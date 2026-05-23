// src/data/blogData.js
// Centralized blog data management

export const blogPosts = [
  {
    id: 1,
    slug: 'importance-of-technical-skills',
    title: 'The Importance of Technical Skills in Today\'s Job Market',
    excerpt: 'Discover why acquiring technical skills through NSQ certification can transform your career prospects and open doors to countless opportunities.',
    content: `
      <h2>Why Technical Skills Matter More Than Ever</h2>
      <p>In today's rapidly evolving job market, technical skills have become the cornerstone of career success. At Brainstorm Academy, we understand that the gap between theoretical knowledge and practical application is what separates successful professionals from the rest.</p>
      
      <h3>The Changing Landscape of Employment</h3>
      <p>The Nigerian job market, like many others globally, is experiencing a significant shift towards skills-based hiring. Employers are no longer just looking for degrees; they want candidates who can demonstrate practical competence in specific technical areas.</p>
      
      <blockquote>
        "Skills are the currency of the 21st-century economy. At Brainstorm Academy, we're not just teaching; we're equipping students with the tools they need to thrive."
      </blockquote>
      
      <h3>NSQ Certification: Your Competitive Edge</h3>
      <p>The National Skills Qualification (NSQ) certification offered at Brainstorm Academy provides:</p>
      <ul>
        <li><strong>Industry Recognition:</strong> Nationally recognized credentials that employers trust</li>
        <li><strong>Practical Experience:</strong> Hands-on training that prepares you for real-world challenges</li>
        <li><strong>Career Flexibility:</strong> Skills that open multiple career pathways</li>
        <li><strong>Entrepreneurship Foundation:</strong> Knowledge to start your own business</li>
      </ul>
      
      <h3>Real-World Impact</h3>
      <p>Our graduates have gone on to secure positions in leading companies, start their own successful businesses, and become master craftsmen in their chosen fields. The combination of NBTE-approved curriculum and practical training ensures that every graduate is workplace-ready.</p>
      
      <h3>Take the Next Step</h3>
      <p>Whether you're interested in web development, electrical installations, mobile phone repair, or any of our 17+ NSQ courses, Brainstorm Academy provides the training, certification, and support you need to succeed.</p>
      
      <p><a href="/courses">Explore our courses</a> and start your journey towards a brighter future today.</p>
    `,
    category: 'skills',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-10-15',
    readTime: '5 min read',
    image: '🎯',
    featured: true,
    tags: ['Skills Development', 'NSQ', 'Career', 'Education'],
    metaDescription: 'Learn why technical skills and NSQ certification are essential for career success in today\'s competitive job market.',
  },
  {
    id: 2,
    slug: 'brainstorm-academy-student-success',
    title: 'How Brainstorm Academy Prepares Students for Real-World Success',
    excerpt: 'Learn about our comprehensive approach to education that combines theoretical knowledge with hands-on practical experience.',
    content: `
      <h2>A Holistic Approach to Education</h2>
      <p>At Brainstorm Academy, we believe that true education goes beyond textbooks and classrooms. Our approach integrates theory, practice, and real-world application to create well-rounded professionals.</p>
      
      <h3>Our Three-Pillar System</h3>
      
      <h4>1. Theoretical Foundation</h4>
      <p>We start with a strong theoretical base, ensuring students understand the 'why' behind every skill. Our NBTE-approved curriculum covers all essential concepts comprehensively.</p>
      
      <h4>2. Practical Application</h4>
      <p>Theory means nothing without practice. Our state-of-the-art workshops and laboratories provide daily hands-on training where students apply what they learn in real scenarios.</p>
      
      <h4>3. Industry Exposure</h4>
      <p>Regular industrial visits and excursions expose students to actual work environments, helping them understand industry standards and expectations.</p>
      
      <h3>The 3Es Guarantee</h3>
      <p>Every graduate from Brainstorm Academy is guaranteed the 3Es:</p>
      <ul>
        <li><strong>Education:</strong> NBTE-certified qualification</li>
        <li><strong>Employment:</strong> Job-ready skills that employers seek</li>
        <li><strong>Economic Independence:</strong> Ability to start and run your own business</li>
      </ul>
      
      <h3>Student Success Stories</h3>
      <p>Our students have gone on to achieve remarkable success in various fields. From opening their own businesses to securing positions in leading companies, the Brainstorm Academy difference is evident in every graduate's journey.</p>
      
      <p>Ready to start your success story? <a href="/contact">Contact us today</a> to learn more about our programs.</p>
    `,
    category: 'education',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-10-12',
    readTime: '7 min read',
    image: '🏆',
    featured: true,
    tags: ['Education', 'Student Success', 'Training', 'NBTE'],
    metaDescription: 'Discover how Brainstorm Academy\'s comprehensive approach prepares students for real-world success through theory, practice, and industry exposure.',
  },
  {
    id: 3,
    slug: 'in-demand-skills-2025',
    title: '10 In-Demand Skills You Can Learn at Brainstorm Academy',
    excerpt: 'From web development to electrical installations, explore the most sought-after skills that employers are looking for in 2025.',
    content: `
      <h2>The Top Skills Employers Want in 2025</h2>
      <p>The job market is constantly evolving, but certain skills remain consistently in demand. Here are 10 high-value skills you can master at Brainstorm Academy.</p>
      
      <h3>1. Web Development</h3>
      <p>With businesses going digital, web developers are more valuable than ever. Learn HTML, CSS, JavaScript, and modern frameworks to build stunning websites.</p>
      
      <h3>2. Networking and System Security</h3>
      <p>As cyber threats increase, professionals who can secure networks and systems are in high demand across all industries.</p>
      
      <h3>3. Mobile Phone Repair</h3>
      <p>With billions of smartphones worldwide, mobile repair technicians can build lucrative careers or businesses.</p>
      
      <h3>4. Electrical Installations</h3>
      <p>From residential to commercial projects, qualified electricians are always needed and well-compensated.</p>
      
      <h3>5. Welding and Fabrication</h3>
      <p>Essential for construction, manufacturing, and automotive industries, welding skills open numerous career doors.</p>
      
      <h3>6. Plumbing and Pipe Fitting</h3>
      <p>Every building needs plumbing. Master this trade and enjoy consistent job opportunities and good pay.</p>
      
      <h3>7. Fashion Design</h3>
      <p>The fashion industry continues to grow. Learn to create custom garments and start your own fashion line.</p>
      
      <h3>8. Furniture Making</h3>
      <p>Quality furniture makers are always in demand, whether working for companies or running independent workshops.</p>
      
      <h3>9. Cosmetology and Beauty Therapy</h3>
      <p>The beauty industry is booming. Acquire skills that allow you to work anywhere or open your own salon.</p>
      
      <h3>10. Hospitality and Catering</h3>
      <p>From hotels to events, hospitality skills ensure you can always find work in Nigeria's growing service sector.</p>
      
      <h3>Why Choose Brainstorm Academy?</h3>
      <p>All our courses are NBTE-certified, include hands-on training, and prepare you for NSQ certification. We don't just teach skills; we prepare you for success.</p>
      
      <p><a href="/courses">View all our courses</a> and choose your path to success.</p>
    `,
    category: 'career',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-10-10',
    readTime: '6 min read',
    image: '🚀',
    featured: false,
    tags: ['Career', 'Skills', 'Job Market', 'Training'],
    metaDescription: 'Discover the 10 most in-demand technical skills for 2025 that you can learn at Brainstorm Academy to boost your career prospects.',
  },
  {
    id: 7,
    slug: 'web-development-2025',
    title: 'Web Development in 2025: Skills Every Developer Should Have',
    excerpt: 'Stay ahead of the curve with our guide to essential web development skills and technologies dominating the industry.',
    content: `
      <h2>The Evolving Web Development Landscape</h2>
      <p>Web development in 2025 is more dynamic and exciting than ever. As businesses continue to digitalize, the demand for skilled web developers has skyrocketed. At Brainstorm Academy, we ensure our students learn the most relevant and in-demand skills.</p>
      
      <h3>Essential Skills for Modern Web Developers</h3>
      
      <h4>1. HTML5 & CSS3 Mastery</h4>
      <p>The foundation of all web development. You must understand:</p>
      <ul>
        <li>Semantic HTML structure</li>
        <li>Responsive design principles</li>
        <li>CSS Grid and Flexbox</li>
        <li>CSS animations and transitions</li>
      </ul>
      
      <h4>2. JavaScript Proficiency</h4>
      <p>JavaScript is the language of the web. Modern developers need to master:</p>
      <ul>
        <li>ES6+ features (arrow functions, async/await, destructuring)</li>
        <li>DOM manipulation</li>
        <li>Event handling</li>
        <li>API integration</li>
        <li>Popular frameworks (React, Vue, or Angular)</li>
      </ul>
      
      <h4>3. Responsive Design</h4>
      <p>With mobile traffic exceeding desktop, responsive design isn't optional – it's mandatory. Learn to create websites that look perfect on all devices.</p>
      
      <h4>4. Version Control (Git)</h4>
      <p>Every professional developer uses Git. Understanding version control is essential for collaboration and professional work.</p>
      
      <h4>5. Backend Basics</h4>
      <p>Even frontend developers benefit from understanding backend concepts:</p>
      <ul>
        <li>How servers work</li>
        <li>RESTful APIs</li>
        <li>Database basics</li>
        <li>Authentication and security</li>
      </ul>
      
      <h3>What You'll Learn at Brainstorm Academy</h3>
      <p>Our Website Design & Development course covers all these essential skills in just 4 months:</p>
      
      <blockquote>
        "The course was comprehensive and practical. Within 2 months of graduation, I had built 5 websites for clients and was earning ₦150,000 monthly." - Abdul, Web Development Graduate
      </blockquote>
      
      <h3>Career Opportunities</h3>
      <p>Web development opens numerous career paths:</p>
      <ul>
        <li><strong>Freelance Developer:</strong> Work from anywhere, set your rates</li>
        <li><strong>Agency Developer:</strong> Join a web design agency</li>
        <li><strong>In-house Developer:</strong> Work for a company's web team</li>
        <li><strong>Start Your Agency:</strong> Build websites for small businesses</li>
        <li><strong>Remote Work:</strong> Work for international companies</li>
      </ul>
      
      <h3>Why Now is the Perfect Time</h3>
      <p>The Nigerian digital economy is booming. Every business needs a website, but there aren't enough skilled developers to meet the demand. This creates enormous opportunities for trained professionals.</p>
      
      <h3>Start Your Web Development Journey</h3>
      <p>Don't wait for the "perfect time" – it doesn't exist. Start learning today and position yourself for success in the thriving web development industry.</p>
      
      <p><a href="/courses/website-design-development">Enroll in our Web Development course</a> and start building your future.</p>
    `,
    category: 'technology',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-09-30',
    readTime: '9 min read',
    image: '💻',
    featured: false,
    tags: ['Web Development', 'Programming', 'Technology', 'Career'],
    metaDescription: 'Discover the essential web development skills for 2025 and how to master them at Brainstorm Academy.',
  },
  {
    id: 8,
    slug: 'entrepreneurship-through-skills',
    title: 'Entrepreneurship Through Skills: Start Your Own Business',
    excerpt: 'Learn how acquiring technical skills can be your gateway to starting and running a successful small business.',
    content: `
      <h2>From Skill to Business: Your Entrepreneurship Journey</h2>
      <p>At Brainstorm Academy, we don't just train technicians – we create entrepreneurs. Every skill you learn is a potential business opportunity waiting to be explored.</p>
      
      <h3>Why Skills-Based Businesses Succeed</h3>
      
      <h4>Low Barrier to Entry</h4>
      <p>Unlike many businesses that require massive capital, skills-based businesses can start with minimal investment. Your primary asset is your knowledge and expertise.</p>
      
      <h4>Immediate Market Demand</h4>
      <p>Technical skills solve real problems. People always need electricians, plumbers, fashion designers, and web developers. The market is ready and waiting.</p>
      
      <h4>Scalability</h4>
      <p>Start alone, then hire assistants as you grow. Many of our graduates now employ 5-10 people within their first 2 years.</p>
      
      <h3>Success Blueprint: From Training to Business</h3>
      
      <h4>Phase 1: Master Your Skill (Months 1-4)</h4>
      <p>Focus entirely on learning and practicing. Complete your NSQ certification and build confidence in your abilities.</p>
      
      <h4>Phase 2: Gain Experience (Months 5-10)</h4>
      <p>Work for someone else or take on small projects. Learn the business side: pricing, customer service, quality control.</p>
      
      <h4>Phase 3: Start Your Business (Month 11+)</h4>
      <p>Register your business, create a simple website or social media presence, and start serving clients.</p>
      
      <h3>Business Skills We Teach</h3>
      <p>Beyond technical skills, our courses include:</p>
      <ul>
        <li><strong>Pricing Strategies:</strong> How to price your services profitably</li>
        <li><strong>Customer Service:</strong> Building lasting client relationships</li>
        <li><strong>Marketing Basics:</strong> Attracting and retaining customers</li>
        <li><strong>Financial Management:</strong> Tracking income and expenses</li>
        <li><strong>Business Registration:</strong> Legal requirements and procedures</li>
      </ul>
      
      <h3>Real Business Examples</h3>
      
      <h4>Case Study: Fashion Design Business</h4>
      <p><strong>Startup Cost:</strong> ₦50,000 (sewing machine + materials)</p>
      <p><strong>Monthly Revenue (Year 1):</strong> ₦80,000 - ₦150,000</p>
      <p><strong>Monthly Revenue (Year 2):</strong> ₦200,000 - ₦400,000</p>
      
      <h4>Case Study: Electrical Services</h4>
      <p><strong>Startup Cost:</strong> ₦30,000 (basic tools)</p>
      <p><strong>Monthly Revenue (Year 1):</strong> ₦100,000 - ₦200,000</p>
      <p><strong>Monthly Revenue (Year 2):</strong> ₦300,000 - ₦600,000</p>
      
      <h4>Case Study: Mobile Repair Shop</h4>
      <p><strong>Startup Cost:</strong> ₦80,000 (tools + spare parts)</p>
      <p><strong>Monthly Revenue (Year 1):</strong> ₦120,000 - ₦250,000</p>
      <p><strong>Monthly Revenue (Year 2):</strong> ₦400,000 - ₦800,000</p>
      
      <h3>The Brainstorm Advantage</h3>
      <blockquote>
        "Brainstorm Academy prepared me for business ownership, not just employment. The practical training and business modules gave me the confidence to start my own company immediately after graduation." - Michael, Furniture Making Graduate
      </blockquote>
      
      <h3>Common Business Challenges and Solutions</h3>
      
      <p><strong>Challenge:</strong> Finding first customers</p>
      <p><strong>Solution:</strong> Start with friends, family, and social media marketing</p>
      
      <p><strong>Challenge:</strong> Managing finances</p>
      <p><strong>Solution:</strong> Use simple accounting apps and separate business/personal money</p>
      
      <p><strong>Challenge:</strong> Competition</p>
      <p><strong>Solution:</strong> Focus on quality, excellent service, and building reputation</p>
      
      <h3>Your Business Starts Here</h3>
      <p>Every successful business owner started where you are now. The difference is they took action. Choose a course, master the skill, and start your entrepreneurship journey.</p>
      
      <p><a href="/courses">Explore our courses</a> and find your path to business ownership.</p>
    `,
    category: 'career',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-09-28',
    readTime: '7 min read',
    image: '💡',
    featured: false,
    tags: ['Entrepreneurship', 'Business', 'Skills', 'Career'],
    metaDescription: 'Learn how to transform technical skills into a successful business with guidance from Brainstorm Academy.',
  },
  {
    id: 9,
    slug: 'future-of-construction',
    title: 'The Future of Construction: Modern Techniques and Skills',
    excerpt: 'Explore modern construction techniques including interlocking, advanced concreting, and sustainable building practices.',
    content: `
      <h2>Construction Industry Evolution</h2>
      <p>The Nigerian construction industry is experiencing a revolution. Modern techniques, sustainable practices, and innovative materials are transforming how we build. Skilled craftsmen who understand these new methods are in high demand.</p>
      
      <h3>Modern Construction Techniques</h3>
      
      <h4>Interlocking Brick Technology</h4>
      <p>One of the most exciting developments in construction. Interlocking bricks offer:</p>
      <ul>
        <li>Faster construction (up to 3x faster than traditional methods)</li>
        <li>Lower costs (no mortar needed)</li>
        <li>Better insulation and durability</li>
        <li>Environmentally friendly</li>
      </ul>
      
      <h4>Advanced Concreting Methods</h4>
      <p>Modern concrete work goes beyond basic mixing and pouring:</p>
      <ul>
        <li>Stamped and decorative concrete</li>
        <li>Self-healing concrete</li>
        <li>High-performance concrete mixes</li>
        <li>Concrete polishing and finishing</li>
      </ul>
      
      <h4>Sustainable Building Practices</h4>
      <p>Green construction is no longer a luxury – it's becoming standard:</p>
      <ul>
        <li>Rainwater harvesting systems</li>
        <li>Solar panel integration</li>
        <li>Natural ventilation design</li>
        <li>Recycled material usage</li>
      </ul>
      
      <h3>Skills That Pay Premium Rates</h3>
      
      <h4>1. Bricklaying & Block Laying</h4>
      <p>Foundation of all construction. Master traditional and modern techniques including interlocking systems.</p>
      <p><strong>Average Daily Rate:</strong> ₦8,000 - ₦15,000 for skilled workers</p>
      
      <h4>2. Concreting Specialist</h4>
      <p>High-quality concrete work is always in demand for foundations, floors, and decorative applications.</p>
      <p><strong>Average Daily Rate:</strong> ₦10,000 - ₦20,000</p>
      
      <h4>3. Plumbing & Pipe Fitting</h4>
      <p>Essential for every building project, from residential to commercial.</p>
      <p><strong>Average Daily Rate:</strong> ₦12,000 - ₦25,000</p>
      
      <h4>4. Electrical Installations</h4>
      <p>Growing demand for both traditional and smart home electrical systems.</p>
      <p><strong>Average Daily Rate:</strong> ₦15,000 - ₦30,000</p>
      
      <h3>Why Construction Skills Are Recession-Proof</h3>
      <p>People always need shelter. Whether the economy is booming or struggling, construction continues. In fact, during economic downturns, repair and renovation work often increases as people improve existing structures instead of buying new ones.</p>
      
      <h3>Training at Brainstorm Academy</h3>
      <p>Our construction-related courses provide:</p>
      <ul>
        <li>Hands-on practice with real materials and tools</li>
        <li>Theory covering building codes and safety standards</li>
        <li>Modern techniques like interlocking and decorative finishing</li>
        <li>Site visits to active construction projects</li>
        <li>NBTE certification upon completion</li>
      </ul>
      
      <blockquote>
        "I learned bricklaying at Brainstorm Academy. The training was intense and practical. Now I lead a team of 6 workers and handle multiple projects simultaneously. My life has completely changed." - Yusuf, Bricklaying Graduate
      </blockquote>
      
      <h3>Career Progression Path</h3>
      
      <p><strong>Year 1:</strong> Assistant craftsman (₦50,000 - ₦80,000/month)</p>
      <p><strong>Year 2:</strong> Skilled craftsman (₦120,000 - ₦200,000/month)</p>
      <p><strong>Year 3:</strong> Team leader (₦200,000 - ₦350,000/month)</p>
      <p><strong>Year 4+:</strong> Contractor with own team (₦500,000 - ₦2,000,000/month)</p>
      
      <h3>The Technology Integration</h3>
      <p>Modern construction workers use technology:</p>
      <ul>
        <li>Laser levels and measuring tools</li>
        <li>Construction management apps</li>
        <li>3D modeling for planning</li>
        <li>Safety monitoring systems</li>
      </ul>
      
      <h3>Get Started in Construction</h3>
      <p>Whether you're interested in bricklaying, plumbing, electrical work, or other construction trades, Brainstorm Academy provides comprehensive training that prepares you for real-world success.</p>
      
      <h3>Industry Partnerships</h3>
      <p>We've partnered with leading construction companies to provide:</p>
      <ul>
        <li>Industrial training opportunities</li>
        <li>Job placement assistance</li>
        <li>Mentorship from experienced professionals</li>
        <li>Access to the latest tools and techniques</li>
      </ul>
      
      <h3>Build Your Future</h3>
      <p>The construction industry offers stable, well-paying careers with excellent growth potential. Start your training today and lay the foundation for a prosperous future.</p>
      
      <p><a href="/courses">View our construction-related courses</a> and choose your path to success.</p>
    `,
    category: 'skills',
    author: {
      name: 'Admin',
      avatar: '👨‍💼',
      bio: 'Administrator at Brainstorm Academy'
    },
    date: '2025-09-25',
    readTime: '6 min read',
    image: '🏗️',
    featured: false,
    tags: ['Construction', 'Skills Development', 'Career', 'Modern Techniques'],
    metaDescription: 'Discover modern construction techniques and career opportunities in Nigeria\'s thriving construction industry.',
  },
];

// Helper functions for blog data management
export const getBlogPostById = (id) => {
  return blogPosts.find(post => post.id === parseInt(id));
};

export const getBlogPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = () => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category) => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const searchPosts = (query) => {
  const searchTerm = query.toLowerCase();
  return blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getRelatedPosts = (currentPostId, limit = 3) => {
  const currentPost = getBlogPostById(currentPostId);
  if (!currentPost) return [];
  
  return blogPosts
    .filter(post => 
      post.id !== currentPostId && 
      post.category === currentPost.category
    )
    .slice(0, limit);
};

// Categories configuration
export const categories = [
  { id: 'all', name: 'All Posts', icon: '📚' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'skills', name: 'Skills Development', icon: '🛠️' },
  { id: 'career', name: 'Career Tips', icon: '💼' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'news', name: 'Academy News', icon: '📰' },
];