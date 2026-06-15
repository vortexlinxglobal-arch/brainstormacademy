require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Node < 22 (including Node 20) does not provide a global WebSocket. Supabase realtime
// needs a WebSocket implementation. Ensure `ws` is available and set as global.WebSocket
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.WebSocket = global.WebSocket || require('ws');
} catch (e) {
  // If `ws` isn't installed, Supabase will throw a helpful error; we let it surface.
}

const { createClient } = require('@supabase/supabase-js');

const cookieParser = require('cookie-parser');
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
    'next-router-prefetch',
  ],
  exposedHeaders: ['Content-Length', 'ETag'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const PORT = process.env.PORT || 4000;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const respond = (res, payload, status = 200) => res.status(status).json(payload);

const setRefreshTokenCookie = (res, refresh_token) => {
  if (!refresh_token) return;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  res.cookie('sb_refresh_token', refresh_token, cookieOptions);
};

const getBearerToken = (req) => {
  const authorization = req.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) return null;
  return authorization.replace('Bearer ', '');
};

const getUserFromToken = async (token) => {
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
};

const requireAuth = async (req, res) => {
  let token = getBearerToken(req);
  let user = await getUserFromToken(token);

  if (!user && req.cookies && req.cookies.sb_refresh_token) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: req.cookies.sb_refresh_token,
    });

    if (!refreshData?.session || refreshError) {
      respond(res, { error: 'Unauthorized' }, 401);
      return null;
    }

    setRefreshTokenCookie(res, refreshData.session.refresh_token);
    token = refreshData.session.access_token;
    user = await getUserFromToken(token);
  }

  if (!user) {
    respond(res, { error: 'Unauthorized' }, 401);
    return null;
  }

  return user;
};

const requireRole = async (req, res, allowedRoles = ['staff', 'admin', 'super_admin']) => {
  const user = await requireAuth(req, res);
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    respond(res, { error: 'Access denied' }, 403);
    return null;
  }

  return user;
};

const getOrCreateDefaultBranch = async () => {
  const { data: branch, error: branchError } = await supabase
    .from('business_center_branches')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (branchError) {
    throw branchError;
  }

  if (branch?.id) {
    return branch.id;
  }

  const { data: createdBranch, error: createBranchError } = await supabase
    .from('business_center_branches')
    .insert({
      name: 'Main Inventory Branch',
      address: 'Main Campus',
      email: 'info@brainstormacademy.ng',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (createBranchError) {
    throw createBranchError;
  }

  return createdBranch.id;
};

app.get('/health', (req, res) => respond(res, { status: 'ok' }));

app.get('/v1/programs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('program_gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/success-ticker', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const { data, error } = await supabase
      .from('students')
      .select('id, first_name, last_name, enrollment_status, updated_at, enrollments!left(trade_id, trades(name))')
      .eq('enrollment_status', 'graduated')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) return respond(res, { error: error.message }, 400);

    const messages = (data || []).map((student) => {
      const name = `${student.first_name || 'A learner'} ${student.last_name || ''}`.trim();
      const tradeName = Array.isArray(student.enrollments) && student.enrollments[0]?.trade?.name
        ? student.enrollments[0].trade.name
        : 'program';
      return `${name} just earned their ${tradeName} certification.`;
    });

    return respond(res, { data: messages });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admissions', async (req, res) => {
  try {
    const {
      applicant_name,
      applicant_email,
      phone,
      date_of_birth,
      address,
      education_background,
      trade_interest,
      previous_experience,
      motivation_statement,
      special_needs,
      emergency_contact,
    } = req.body;

    if (!applicant_name || !applicant_email || !trade_interest) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('code')
      .eq('code', trade_interest)
      .eq('is_active', true)
      .single();

    if (tradeError) return respond(res, { error: tradeError.message }, 400);
    if (!trade) return respond(res, { error: 'Invalid trade selection' }, 400);

    const applicationPayload = {
      applicant_name,
      applicant_email,
      phone,
      date_of_birth,
      address,
      education_background,
      trade_interest,
      previous_experience,
      motivation_statement,
      special_needs,
      emergency_contact,
    };

    const { data, error } = await supabase
      .from('admissions_applications')
      .insert([applicationPayload])
      .select('id')
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, {
      data,
      message: 'Application submitted successfully. You will receive a confirmation email shortly.',
    });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admissions/review', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { application_id, status, decision_notes } = req.body;
    if (!application_id || !status) {
      return respond(res, { error: 'application_id and status are required' }, 400);
    }

    const { error } = await supabase.rpc('review_admissions_application', {
      p_application_id: application_id,
      p_status: status,
      p_decision_notes: decision_notes,
      p_reviewed_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data: { success: true, message: 'Application reviewed successfully' } });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admissions/letter', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { application_id, letter_type } = req.body;
    if (!application_id || !letter_type) {
      return respond(res, { error: 'application_id and letter_type are required' }, 400);
    }

    const { data: letterId, error } = await supabase.rpc('generate_admission_letter', {
      p_application_id: application_id,
      p_letter_type: letter_type,
      p_generated_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);

    const { data: letter, error: letterError } = await supabase
      .from('admission_letters')
      .select('*')
      .eq('id', letterId)
      .single();

    if (letterError) return respond(res, { error: letterError.message }, 400);
    return respond(res, { data: letter, message: 'Admission letter generated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admissions/stats', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);
    const { from: dateFrom, to: dateTo } = req.query;
    const { data, error } = await supabase.rpc('get_admissions_stats', {
      p_date_from: dateFrom,
      p_date_to: dateTo,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admissions/by-trade', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);
    const { data, error } = await supabase.rpc('get_applications_by_trade');
    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admissions/my-applications', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { data, error } = await supabase
      .from('admissions_applications')
      .select('*')
      .eq('applicant_email', user.email)
      .order('submitted_at', { ascending: false });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/trades', async (req, res) => {
  try {
    let data = null
    let error = null

    const catalogQuery = supabase.from('trade_catalog').select('*').order('name');
    let result = await catalogQuery;
    data = result.data;
    error = result.error;

    if (error) {
      console.warn('trade_catalog lookup failed:', error);
      const fallbackQuery = supabase
        .from('trades')
        .select('id, code, name, description, is_active')
        .eq('is_active', true)
        .order('name');
      result = await fallbackQuery;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.warn('trades lookup failed:', error);
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        return respond(res, { data: [] });
      }
      return respond(res, { error: error.message || 'Unable to load trade programs' }, 500);
    }

    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/trades/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trade_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/trades/courses', async (req, res) => {
  try {
    const { trade_code: tradeCode } = req.query;
    if (!tradeCode) return respond(res, { error: 'trade_code parameter required' }, 400);

    const { data, error } = await supabase
      .from('course_catalog')
      .select('*')
      .eq('trade_code', tradeCode)
      .order('order_index');

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/students', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { data, error } = await supabase
      .from('students')
      .select(
        `id, user_id, registration_number, first_name, last_name, enrollment_status, created_at, profiles(email), enrollments!left(trade_id, trades(name, code))`
      )
      .order('created_at', { ascending: false });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/programs', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { data, error } = await supabase
      .from('program_gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/students', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const {
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact,
      guardian_contact,
      address,
      academic_background,
      trade_code,
    } = req.body;

    if (!email || !password || !first_name || !last_name || !date_of_birth || !trade_code) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: trade, error: tradeErr } = await supabase
      .from('trades')
      .select('id, code, name')
      .eq('code', trade_code)
      .eq('is_active', true)
      .maybeSingle();

    if (tradeErr || !trade) {
      return respond(res, { error: 'Invalid or inactive trade code' }, 400);
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student',
          student_data: {
            first_name,
            last_name,
            date_of_birth,
            gender,
            contact,
            guardian_contact,
            address,
            academic_background,
            trade_code,
          },
        },
      },
    });

    if (authError) return respond(res, { error: authError.message }, 400);
    if (!authData.user) return respond(res, { error: 'Failed to create user account' }, 400);

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, user_id, registration_number, first_name, last_name, enrollment_status')
      .eq('user_id', authData.user.id)
      .single();

    if (studentError) {
      return respond(res, { error: 'Student profile creation failed' }, 400);
    }

    return respond(res, {
      data: {
        user: authData.user,
        student,
        message: 'Student created successfully.',
      },
    }, 201);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/admin/students', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { student_id, enrollment_status, contact, guardian_contact, address, academic_background } = req.body;
    if (!student_id) {
      return respond(res, { error: 'student_id is required' }, 400);
    }

    const updatePayload = {
      ...(enrollment_status !== undefined ? { enrollment_status } : {}),
      ...(contact !== undefined ? { contact } : {}),
      ...(guardian_contact !== undefined ? { guardian_contact } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(academic_background !== undefined ? { academic_background } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('students')
      .update(updatePayload)
      .eq('id', student_id)
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Student profile updated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/programs', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { title, category, image_url, description, display_order, is_active = true } = req.body;
    if (!title || !category || !image_url) {
      return respond(res, { error: 'Missing required fields: title, category, image_url' }, 400);
    }

    const { data, error } = await supabase
      .from('program_gallery')
      .insert({ title, category, image_url, description, display_order, is_active })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Program created successfully' }, 201);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/admin/programs', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { program_id, title, category, image_url, description, display_order, is_active } = req.body;
    if (!program_id) {
      return respond(res, { error: 'program_id is required' }, 400);
    }

    const updatePayload = {
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(image_url !== undefined ? { image_url } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(display_order !== undefined ? { display_order } : {}),
      ...(is_active !== undefined ? { is_active } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('program_gallery')
      .update(updatePayload)
      .eq('id', program_id)
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Program updated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/trades', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const {
      category_code,
      code,
      name,
      description,
      duration_months,
      tuition_fee,
      prerequisites,
      curriculum,
    } = req.body;

    if (!category_code || !code || !name || !duration_months) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: tradeId, error } = await supabase.rpc('create_trade', {
      p_category_code: category_code,
      p_code: code,
      p_name: name,
      p_description: description,
      p_duration_months: duration_months,
      p_tuition_fee: tuition_fee,
      p_prerequisites: prerequisites,
      p_curriculum: curriculum,
      p_created_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);

    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single();

    if (tradeError) return respond(res, { error: tradeError.message }, 400);
    return respond(res, { data: trade, message: 'Trade created successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/trades', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const {
      trade_id,
      name,
      description,
      duration_months,
      tuition_fee,
      prerequisites,
      curriculum,
      is_active,
    } = req.body;

    if (!trade_id) return respond(res, { error: 'trade_id is required' }, 400);

    const { error } = await supabase.rpc('update_trade', {
      p_trade_id: trade_id,
      p_name: name,
      p_description: description,
      p_duration_months: duration_months,
      p_tuition_fee: tuition_fee,
      p_prerequisites: prerequisites,
      p_curriculum: curriculum,
      p_is_active: is_active,
      p_updated_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data: { success: true, message: 'Trade updated successfully' } });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/trades/courses', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const {
      trade_code,
      code,
      title,
      description,
      instructor_id,
      duration_hours,
      credit_hours,
      course_fee,
      materials,
      prerequisites,
    } = req.body;

    if (!trade_code || !code || !title) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: courseId, error } = await supabase.rpc('create_course', {
      p_trade_code: trade_code,
      p_code: code,
      p_title: title,
      p_description: description,
      p_instructor_id: instructor_id,
      p_duration_hours: duration_hours,
      p_credit_hours: credit_hours,
      p_course_fee: course_fee,
      p_materials: materials,
      p_prerequisites: prerequisites,
      p_created_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) return respond(res, { error: courseError.message }, 400);
    return respond(res, { data: course, message: 'Course created successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/trades/modules', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { course_code, title, description, order_index, content, duration_hours } = req.body;
    if (!course_code || !title || order_index === undefined) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: moduleId, error } = await supabase.rpc('add_course_module', {
      p_course_code: course_code,
      p_title: title,
      p_description: description,
      p_order_index: order_index,
      p_content: content,
      p_duration_hours: duration_hours,
      p_created_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);

    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (moduleError) return respond(res, { error: moduleError.message }, 400);
    return respond(res, { data: module, message: 'Course module added successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/students', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { data, error } = await supabase.rpc('get_student_dashboard', {
      p_user_id: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/students', async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact,
      guardian_contact,
      address,
      academic_background,
      trade_code,
    } = req.body;

    if (!email || !password || !first_name || !last_name || !date_of_birth || !trade_code) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: trade, error: tradeErr } = await supabase
      .from('trades')
      .select('id, code, name')
      .eq('code', trade_code)
      .eq('is_active', true)
      .maybeSingle();

    if (tradeErr || !trade) {
      return respond(res, { error: 'Invalid or inactive trade code' }, 400);
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student',
          student_data: {
            first_name,
            last_name,
            date_of_birth,
            gender,
            contact,
            guardian_contact,
            address,
            academic_background,
            trade_code,
          },
        },
      },
    });

    if (authError) return respond(res, { error: authError.message }, 400);
    if (!authData.user) return respond(res, { error: 'Failed to create user account' }, 400);

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        registration_number,
        first_name,
        last_name,
        enrollment_status,
        created_at,
        trades:enrollments!inner(trade_id, trades(name, code))
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (studentError) return respond(res, { error: 'Student profile creation failed' }, 400);
    return respond(res, {
      data: {
        user: authData.user,
        student,
        message: 'Student registered successfully. Please check your email for verification.',
      },
    });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/students', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { contact, guardian_contact, address, academic_background } = req.body;
    const { data, error } = await supabase.rpc('update_student_profile', {
      p_user_id: user.id,
      p_contact: contact,
      p_guardian_contact: guardian_contact,
      p_address: address,
      p_academic_background: academic_background,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data: { success: true, message: 'Profile updated successfully' } });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/students/courses', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { data, error } = await supabase.rpc('get_student_courses', {
      p_user_id: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/students/modules', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { course_id: courseId } = req.query;
    if (!courseId) return respond(res, { error: 'course_id parameter required' }, 400);

    const { data, error } = await supabase.rpc('get_student_course_modules', {
      p_user_id: user.id,
      p_course_id: Number(courseId),
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/students/progress', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { course_enrollment_id, module_id, progress_percentage, status, time_spent } = req.body;
    if (!course_enrollment_id || !module_id) {
      return respond(res, { error: 'course_enrollment_id and module_id are required' }, 400);
    }

    const { data, error } = await supabase.rpc('update_student_progress', {
      p_course_enrollment_id: course_enrollment_id,
      p_module_id: module_id,
      p_progress_percentage: progress_percentage,
      p_status: status,
      p_time_spent: time_spent,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/staff', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { data, error } = await supabase.rpc('get_staff_dashboard', {
      p_user_id: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/staff/id-card', async (req, res) => {
  return respond(res, {
    data: {
      message: 'Staff ID card endpoint is not yet implemented. This route is reserved for future dashboard integration.'
    }
  });
});

app.get('/v1/staff/remuneration', async (req, res) => {
  return respond(res, {
    data: {
      message: 'Staff remuneration endpoint is not yet implemented. Configure payroll tables or RPCs to return compensation details.'
    }
  });
});

app.get('/v1/staff/finance', async (req, res) => {
  return respond(res, {
    data: {
      message: 'Staff finance summary endpoint is not yet implemented. Add reporting RPCs for balances, allowances, and expenses.'
    }
  });
});

app.post('/v1/staff', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['admin', 'manager']);
    if (!user) return;

    const {
      email,
      password,
      phone,
      full_name,
      category_code,
      department_code,
      bio,
      employment_date,
      specialty,
      qualifications,
    } = req.body;

    const initialPassword = password || phone;
    if (!email || !initialPassword || !full_name || !category_code) {
      return respond(res, { error: 'Missing required fields' }, 400);
    }

    const { data: category, error: categoryError } = await supabase
      .from('staff_categories')
      .select('id, code, name')
      .eq('code', category_code)
      .maybeSingle();

    if (categoryError || !category) {
      return respond(res, { error: 'Invalid staff category code' }, 400);
    }

    let department_id = null;
    if (department_code) {
      const { data: department, error: departmentError } = await supabase
        .from('departments')
        .select('id, code, name')
        .eq('code', department_code)
        .maybeSingle();
      if (departmentError || !department) {
        return respond(res, { error: 'Invalid department code' }, 400);
      }
      department_id = department.id;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: initialPassword,
      options: {
        data: {
          role: 'staff',
          staff_data: {
            category_code,
            department_code,
            phone,
            bio,
            employment_date,
            specialty,
            qualifications,
          },
        },
      },
    });

    if (authError) return respond(res, { error: authError.message }, 400);
    if (!authData.user) return respond(res, { error: 'Failed to create user account' }, 400);

    const { data: staff, error: staffError } = await supabase
      .from('staff_profiles')
      .select(`
        id,
        employee_id,
        department:departments(name, code),
        category:staff_categories(name, code),
        bio,
        employment_date,
        specialty,
        qualifications,
        performance_rating,
        created_at
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (staffError) return respond(res, { error: 'Staff profile creation failed' }, 400);

    return respond(res, {
      data: {
        user: authData.user,
        staff,
        message: 'Staff member registered successfully. Please check your email for verification.',
      },
    });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/staff', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { bio, specialty, qualifications } = req.body;
    const { data, error } = await supabase
      .from('staff_profiles')
      .update({
        bio,
        specialty,
        qualifications,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data: { success: true, message: 'Profile updated successfully', staff: data } });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/staff/department', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);
    const { code } = req.query;
    if (!code) return respond(res, { error: 'department code parameter required' }, 400);

    const { data, error } = await supabase.rpc('get_staff_by_department', {
      p_department_code: code,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/staff/performance', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['admin']);
    if (!user) return;

    const { staff_id, rating } = req.body;
    if (!staff_id || rating === undefined) {
      return respond(res, { error: 'staff_id and rating are required' }, 400);
    }

    const { error } = await supabase.rpc('update_staff_performance', {
      p_staff_id: staff_id,
      p_rating: rating,
      p_updated_by: user.id,
    });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data: { success: true, message: 'Staff performance updated successfully' } });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/business-center/branches', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { data, error } = await supabase
      .from('business_center_branches')
      .select('*')
      .order('name', { ascending: true });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data || []);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/business-center/branches', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { name, address, phone, email, manager_id } = req.body;
    if (!name) {
      return respond(res, { error: 'Branch name is required' }, 400);
    }

    const { data, error } = await supabase
      .from('business_center_branches')
      .insert({ name, address, phone, email, manager_id })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/business-center/items', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { data, error } = await supabase
      .from('business_center_inventory_items')
      .select('*, branch:business_center_branches(id, name)')
      .order('item_name', { ascending: true });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data || []);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/business-center/items', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { item_name, sku, description, quantity, reorder_level, unit_cost, branch_id } = req.body;
    if (!item_name || quantity === undefined || unit_cost === undefined) {
      return respond(res, { error: 'item_name, quantity, and unit_cost are required' }, 400);
    }

    const effectiveBranchId = branch_id || (await getOrCreateDefaultBranch());
    const { data, error } = await supabase
      .from('business_center_inventory_items')
      .insert({
        item_name,
        sku,
        description,
        quantity,
        reorder_level,
        unit_cost,
        branch_id: effectiveBranchId,
      })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/admin/business-center/items/:id', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { id } = req.params;
    const { item_name, sku, description, quantity, reorder_level, unit_cost, branch_id } = req.body;

    if (!item_name && !sku && !description && quantity === undefined && reorder_level === undefined && unit_cost === undefined && !branch_id) {
      return respond(res, { error: 'At least one field must be provided for update' }, 400);
    }

    const updatePayload = {
      ...(item_name !== undefined ? { item_name } : {}),
      ...(sku !== undefined ? { sku } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
      ...(reorder_level !== undefined ? { reorder_level } : {}),
      ...(unit_cost !== undefined ? { unit_cost } : {}),
      ...(branch_id !== undefined ? { branch_id } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('business_center_inventory_items')
      .update(updatePayload)
      .eq('id', id)
      .select('*, branch:business_center_branches(id, name)')
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Inventory item updated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.delete('/v1/admin/business-center/items/:id', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { id } = req.params;

    // Check if there are any transactions linked to this item
    const { data: transactions, error: transactionError } = await supabase
      .from('business_center_inventory_transactions')
      .select('id', { count: 'exact' })
      .eq('inventory_item_id', id)
      .limit(1);

    if (transactionError) {
      return respond(res, { error: transactionError.message }, 400);
    }

    if (transactions && transactions.length > 0) {
      return respond(res, { error: 'Cannot delete item with existing transactions. Archive or deactivate instead.' }, 409);
    }

    const { error: deleteError } = await supabase
      .from('business_center_inventory_items')
      .delete()
      .eq('id', id);

    if (deleteError) return respond(res, { error: deleteError.message }, 400);
    return respond(res, { message: 'Inventory item deleted successfully' }, 200);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/business-center/transactions', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { data, error } = await supabase
      .from('business_center_inventory_transactions')
      .select('*, inventory_item:business_center_inventory_items(item_name, sku), branch:business_center_branches(id, name)')
      .order('created_at', { ascending: false });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data || []);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/business-center/transactions', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { inventory_item_id, branch_id, transaction_type, quantity, unit_cost, notes } = req.body;
    if (!inventory_item_id || !transaction_type || quantity === undefined || unit_cost === undefined) {
      return respond(res, { error: 'inventory_item_id, transaction_type, quantity, and unit_cost are required' }, 400);
    }

    const effectiveBranchId = branch_id || (await getOrCreateDefaultBranch());
    const { data, error } = await supabase
      .from('business_center_inventory_transactions')
      .insert({
        inventory_item_id,
        branch_id: effectiveBranchId,
        transaction_type,
        quantity,
        unit_cost,
        notes,
        performed_by: user.id,
      })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/meetings', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data || []);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/meetings', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { topic, agenda, scheduled_date, scheduled_time, location, participants, minutes, status } = req.body;
    if (!topic || !scheduled_date || !location || !participants) {
      return respond(res, { error: 'topic, scheduled_date, location, and participants are required' }, 400);
    }

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        topic,
        agenda,
        scheduled_date,
        scheduled_time,
        location,
        participants,
        minutes,
        status: status || 'scheduled',
        created_by: user.id,
      })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/admin/meetings/:id', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { id } = req.params;
    const { topic, agenda, scheduled_date, scheduled_time, location, participants, minutes, status } = req.body;

    if (!topic && !agenda && !scheduled_date && !scheduled_time && !location && !participants && !minutes && status === undefined) {
      return respond(res, { error: 'At least one field must be provided for update' }, 400);
    }

    const updatePayload = {
      ...(topic !== undefined ? { topic } : {}),
      ...(agenda !== undefined ? { agenda } : {}),
      ...(scheduled_date !== undefined ? { scheduled_date } : {}),
      ...(scheduled_time !== undefined ? { scheduled_time } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(participants !== undefined ? { participants } : {}),
      ...(minutes !== undefined ? { minutes } : {}),
      ...(status !== undefined ? { status } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('meetings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Meeting updated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.delete('/v1/admin/meetings/:id', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { id } = req.params;

    const { error: deleteError } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (deleteError) return respond(res, { error: deleteError.message }, 400);
    return respond(res, { message: 'Meeting deleted successfully' }, 200);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.get('/v1/admin/payments', async (req, res) => {
  try {
    await requireRole(req, res, ['staff', 'admin']);

    const { data, error } = await supabase
      .from('payments')
      .select('*, students(id, first_name, last_name), enrollments(id, trade_id, trade:trades(name))')
      .order('payment_date', { ascending: false });

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data || []);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.post('/v1/admin/payments', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    let { student_id, student_email, enrollment_id, amount, payment_method, status, notes, transaction_id } = req.body;

    if (!amount || !payment_method) {
      return respond(res, { error: 'amount and payment_method are required' }, 400);
    }

    if (!student_id && student_email) {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('email', student_email)
        .maybeSingle();

      if (studentError) return respond(res, { error: studentError.message }, 400);
      if (!student) return respond(res, { error: 'Student not found for provided email' }, 404);
      student_id = student.id;
    }

    if (!student_id) {
      return respond(res, { error: 'student_id or student_email is required' }, 400);
    }

    if (!enrollment_id) {
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', student_id)
        .order('enrollment_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (enrollmentError) return respond(res, { error: enrollmentError.message }, 400);
      if (!enrollment) return respond(res, { error: 'No enrollment found for the selected student' }, 404);
      enrollment_id = enrollment.id;
    }

    const { data, error } = await supabase
      .from('payments')
      .insert({
        student_id,
        enrollment_id,
        amount,
        payment_method,
        status: status || 'completed',
        notes,
        transaction_id,
        processed_by: user.id,
      })
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, data);
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

app.put('/v1/admin/payments/:id', async (req, res) => {
  try {
    const user = await requireRole(req, res, ['staff', 'admin']);
    if (!user) return;

    const { id } = req.params;
    const { amount, payment_method, status, notes, transaction_id } = req.body;

    if (!amount && !payment_method && !status && !notes && !transaction_id) {
      return respond(res, { error: 'At least one field must be provided for update' }, 400);
    }

    const updatePayload = {
      ...(amount !== undefined ? { amount } : {}),
      ...(payment_method !== undefined ? { payment_method } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(transaction_id !== undefined ? { transaction_id } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('payments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) return respond(res, { error: error.message }, 400);
    return respond(res, { data, message: 'Payment updated successfully' });
  } catch (error) {
    return respond(res, { error: error.message }, 500);
  }
});

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

// Auth: Signup (Student Registration)
app.post('/v1/auth/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact,
      trade_code,
    } = req.body;

    // Validate required fields
    if (!email || !password || !full_name || !date_of_birth || !trade_code) {
      return respond(
        res,
        {
          error: 'Missing required fields: email, password, full_name, date_of_birth, trade_code',
        },
        400
      );
    }

    // Validate trade exists when possible
    let trade = null
    let tradeLookupUnavailable = false
    const { data: tradeData, error: tradeErr } = await supabase
      .from('trades')
      .select('id, code, name')
      .eq('code', trade_code)
      .eq('is_active', true)
      .maybeSingle();

    if (tradeErr) {
      console.warn('Trade lookup failed during signup:', tradeErr)
      if (tradeErr.message?.includes('Could not find the table') || tradeErr.code === 'PGRST205') {
        tradeLookupUnavailable = true
      } else {
        return respond(res, { error: 'Trade lookup failed' }, 500)
      }
    } else {
      trade = tradeData
    }

    if (!tradeLookupUnavailable && !trade) {
      return respond(res, { error: 'Invalid or inactive trade code' }, 400);
    }

    const emailRedirectTo = req.body.email_redirect_to || req.body.emailRedirectTo
    const defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormacademy.ng'
    let redirectTo = emailRedirectTo || `${defaultAppUrl}/auth/callback`
    if (!redirectTo.includes('/auth/callback')) {
      redirectTo = `${redirectTo.replace(/\/$/, '')}/auth/callback`
    }

    // Create user account via Supabase Auth
    const signUpOptions = {
      data: {
        role: 'student',
        full_name,
        first_name: first_name || full_name.split(' ')[0],
        last_name: last_name || full_name.split(' ').slice(1).join(' '),
      },
    }

    if (redirectTo) {
      signUpOptions.emailRedirectTo = redirectTo
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: signUpOptions,
    });

    if (authError) {
      const authMessage = String(authError.message || 'Failed to create account')
      const normalized = authMessage.toLowerCase()

      if (
        normalized.includes('rate limit') ||
        normalized.includes('confirmation email recently') ||
        normalized.includes('already sent a confirmation email')
      ) {
        return respond(
          res,
          {
            error:
              'A confirmation email was already sent. Please check your inbox or spam folder before trying again.',
          },
          429
        )
      }

      if (
        normalized.includes('already registered') ||
        normalized.includes('duplicate') ||
        normalized.includes('user already registered')
      ) {
        return respond(
          res,
          {
            error:
              'This email is already registered. Please sign in or check your email for the verification link.',
          },
          400
        )
      }

      return respond(res, { error: authMessage }, 400)
    }

    if (!authData.user) {
      return respond(res, { error: 'Failed to create user account' }, 400);
    }

    // Create or update user profile row
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authData.user.id,
          email,
          full_name,
          role: 'student',
          is_active: true,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError)
    }

    // Create student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: authData.user.id,
        first_name: first_name || full_name.split(' ')[0],
        last_name: last_name || full_name.split(' ').slice(1).join(' '),
        email,
        date_of_birth,
        gender: gender || null,
        contact: contact || null,
        enrollment_status: 'pending',
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student profile creation failed:', studentError);
      // Still successful even if student profile creation fails (auth user created)
    }

    // Enroll student in trade
    if (trade) {
      const { error: enrollmentError } = await supabase.from('enrollments').insert({
        user_id: authData.user.id,
        trade_id: trade.id,
        enrollment_date: new Date().toISOString(),
        status: 'active',
      });

      if (enrollmentError) {
        console.error('Enrollment creation failed:', enrollmentError);
      }
    } else if (tradeLookupUnavailable) {
      console.warn('Skipping trade enrollment because trade lookup is unavailable.');
    }

    return respond(
      res,
      {
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
          },
          student: student || null,
          message: 'Account created successfully. Please check your email to verify your account.',
        },
      },
      201
    );
  } catch (error) {
    console.error('Signup error:', error);
    return respond(res, { error: error.message || 'Signup failed' }, 500);
  }
});

// Auth: Signin (Login)
app.post('/v1/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return respond(res, { error: 'Email and password are required' }, 400);
    }

    // Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return respond(res, { error: authError.message || 'Invalid credentials' }, 401);
    }

    if (!authData.session) {
      return respond(res, { error: 'Failed to create session' }, 401);
    }

    // Set HttpOnly refresh cookie
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      res.cookie('sb_refresh_token', authData.session.refresh_token, cookieOptions);
    } catch (err) {
      console.error('Failed to set refresh cookie:', err);
    }

    // Get user profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, user_id, first_name, last_name, email, enrollment_status')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    return respond(
      res,
      {
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
          },
          session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_in: authData.session.expires_in,
            expires_at: authData.session.expires_at,
          },
          student: student || null,
        },
      },
      200
    );
  } catch (error) {
    console.error('Signin error:', error);
    return respond(res, { error: error.message || 'Signin failed' }, 500);
  }
});

// Auth: Verify Token
app.get('/v1/auth/verify', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    // Get user profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, user_id, first_name, last_name, email, enrollment_status')
      .eq('user_id', user.id)
      .maybeSingle();

    return respond(res, {
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        student: student || null,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return respond(res, { error: error.message || 'Verification failed' }, 500);
  }
});

app.get('/v1/profile', async (req, res) => {
  try {
    const user = await requireAuth(req, res)
    if (!user) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return respond(res, { error: error.message || 'Unable to fetch profile' }, 500)
    }

    return respond(res, { data: profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return respond(res, { error: error.message || 'Unable to fetch profile' }, 500)
  }
})

app.get('/v1/notifications', async (req, res) => {
  try {
    const user = await requireAuth(req, res)
    if (!user) return

    const limit = parseInt(req.query.limit, 10) || 20
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return respond(res, { error: error.message || 'Unable to fetch notifications' }, 500)
    }

    return respond(res, { data })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return respond(res, { error: error.message || 'Unable to fetch notifications' }, 500)
  }
})

// Auth: Refresh Token
app.post('/v1/auth/refresh', async (req, res) => {
  try {
    let { refresh_token } = req.body || {};

    // If not provided in body, attempt to read from HttpOnly cookie
    if (!refresh_token && req.cookies && req.cookies.sb_refresh_token) {
      refresh_token = req.cookies.sb_refresh_token;
    }

    if (!refresh_token) {
      return respond(res, { error: 'Refresh token is required' }, 400);
    }

    const { data: authData, error: authError } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (authError || !authData.session) {
      return respond(res, { error: authError?.message || 'Failed to refresh session' }, 401);
    }

    // Update refresh cookie
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      };
      res.cookie('sb_refresh_token', authData.session.refresh_token, cookieOptions);
    } catch (err) {
      console.error('Failed to set refresh cookie during refresh:', err);
    }

    return respond(res, {
      data: {
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_in: authData.session.expires_in,
          expires_at: authData.session.expires_at,
        },
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return respond(res, { error: error.message || 'Token refresh failed' }, 500);
  }
});

// Auth: Signout (Invalidate Session)
app.post('/v1/auth/signout', async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    // Sign out via Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return respond(res, { error: error.message || 'Signout failed' }, 400);
    }
    // Clear refresh cookie
    try {
      res.clearCookie('sb_refresh_token');
    } catch (err) {
      console.error('Failed to clear refresh cookie:', err);
    }

    return respond(res, { data: { message: 'Signed out successfully' } });
  } catch (error) {
    console.error('Signout error:', error);
    return respond(res, { error: error.message || 'Signout failed' }, 500);
  }
});

// ============================================================================

app.use((req, res) => respond(res, { error: 'Not Found' }, 404));

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
