import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [isFloating, setIsFloating] = useState(false);
  const buttonRef = useRef(null);

  const courses = {
    'networking-system-security': {
      title: 'Networking and System Security Installation',
      description:
        'Learn to design, install, and maintain secure network systems. This course covers network configuration, cybersecurity protocols, and system maintenance, preparing you for roles in IT infrastructure and security.',
      curriculum:
        'Topics include network architecture, firewall setup, intrusion detection, and secure system administration. Practical sessions involve hands-on network setup and troubleshooting.',
      outcomes:
        'Prepare for roles as network administrators or cybersecurity technicians with NSQ certification.',
    },
    'website-design-development': {
      title: 'Website Design & Development',
      description:
        'Master the art of creating responsive, user-friendly websites. This course covers HTML, CSS, JavaScript, and modern frameworks, enabling you to build professional websites.',
      curriculum:
        'Learn web design principles, front-end and back-end development, and content management systems. Practical projects include building a portfolio website.',
      outcomes:
        'Become a web developer or designer, ready to work freelance or in tech companies.',
    },
    'mobile-phone-repair': {
      title: 'Mobile Phone Repair',
      description:
        'Gain expertise in diagnosing and repairing mobile devices. This course covers hardware troubleshooting, software updates, and component replacement.',
      curriculum:
        'Study mobile device anatomy, repair techniques, and diagnostic tools. Practical workshops include screen replacements and software fixes.',
      outcomes:
        'Work as a mobile repair technician or start your own repair business.',
    },
    'electrical-installations': {
      title: 'Electrical Installations',
      description:
        'Learn to install and maintain electrical systems safely and efficiently. This course covers wiring, circuit design, and safety standards.',
      curriculum:
        'Topics include electrical theory, wiring regulations, and installation techniques. Hands-on training in wiring setups and safety inspections.',
      outcomes:
        'Pursue careers as electricians or electrical contractors with NSQ certification.',
    },
    'furniture-making': {
      title: 'Furniture Making',
      description:
        'Develop skills in crafting high-quality furniture. This course teaches woodworking, design, and finishing techniques.',
      curriculum:
        'Learn furniture design, material selection, and assembly methods. Practical projects include building tables and chairs.',
      outcomes:
        'Work as a furniture maker or start a custom furniture business.',
    },
    'painting-decoration': {
      title: 'Painting, Decoration & Finishes (Interior Design)',
      description:
        'Master the art of interior painting and decoration. This course covers color theory, surface preparation, and finishing techniques.',
      curriculum:
        'Study paint types, application methods, and decorative finishes. Practical sessions include wall painting and texture application.',
      outcomes:
        'Become an interior decorator or painter for residential and commercial projects.',
    },
    'wood-work': {
      title: 'Wood Work',
      description:
        'Learn advanced woodworking techniques for creating functional and aesthetic wooden structures.',
      curriculum:
        'Covers wood selection, joinery, and finishing. Practical projects include crafting wooden fixtures and structures.',
      outcomes:
        'Work as a carpenter or woodwork specialist in construction or design.',
    },
    upholstery: {
      title: 'Upholstery',
      description:
        'Gain skills in upholstering furniture, from fabric selection to final assembly.',
      curriculum:
        'Learn fabric cutting, sewing, and attachment techniques. Practical workshops include reupholstering chairs and sofas.',
      outcomes: 'Pursue careers in upholstery or start an upholstery business.',
    },
    'bricklaying-concreting': {
      title: 'Bricklaying, Block laying, Concreting And Interlocking',
      description:
        'Learn construction techniques for bricklaying, concreting, and interlocking paving.',
      curriculum:
        'Covers masonry techniques, concrete mixing, and interlocking designs. Hands-on training in building walls and pavements.',
      outcomes: 'Work as a mason or start a construction business.',
    },
    'plumbing-pipe-fitting': {
      title: 'Plumbing & Pipe Fitting',
      description:
        'Master plumbing systems and pipe fitting for residential and commercial buildings.',
      curriculum:
        'Study pipe installation, maintenance, and repair. Practical sessions include installing plumbing systems.',
      outcomes: 'Become a certified plumber or pipe fitter.',
    },
    'hospitality-catering': {
      title: 'Hospitality & Catering',
      description:
        'Develop skills in food preparation, service, and hospitality management.',
      curriculum:
        'Covers culinary techniques, menu planning, and customer service. Practical training in kitchen operations.',
      outcomes: 'Work in hotels, restaurants, or start a catering business.',
    },
    'cosmetology-beauty': {
      title: 'Cosmetology & Beauty Therapy',
      description:
        'Learn professional beauty techniques, including makeup, haircare, and skincare.',
      curriculum:
        'Study beauty treatments, product application, and client consultation. Practical sessions include makeup and hair styling.',
      outcomes: 'Become a cosmetologist or open a beauty salon.',
    },
    'fashion-design': {
      title: 'Fashion Design & Garment Making',
      description:
        'Create stylish garments through design and sewing techniques.',
      curriculum:
        'Covers pattern making, sewing, and fashion design principles. Practical projects include designing clothing.',
      outcomes: 'Work as a fashion designer or start a tailoring business.',
    },
    'hardware-maintenance': {
      title: 'Hardware Maintenance',
      description: 'Learn to maintain and repair computer hardware systems.',
      curriculum:
        'Study computer components, troubleshooting, and repair techniques. Practical workshops include PC assembly.',
      outcomes: 'Pursue careers as a hardware technician.',
    },
    'welding-fabrication': {
      title: 'Welding And Fabrication',
      description:
        'Master welding techniques for metal fabrication in construction and manufacturing.',
      curriculum:
        'Covers welding methods, safety, and fabrication processes. Practical training in welding metal structures.',
      outcomes: 'Work as a welder or fabricator in industrial sectors.',
    },
    'home-electrical-appliances': {
      title: 'Home Electrical Appliances',
      description:
        'Learn to repair and maintain household electrical appliances.',
      curriculum:
        'Study appliance mechanics, wiring, and troubleshooting. Practical sessions include fixing common appliances.',
      outcomes:
        'Become an appliance repair technician or start a repair service.',
    },
    'aluminium-fabrication': {
      title: 'Aluminium Fabrication',
      description:
        'Develop skills in fabricating aluminium structures for windows, doors, and more.',
      curriculum:
        'Covers aluminium cutting, assembly, and installation. Practical projects include building window frames.',
      outcomes:
        'Work as an aluminium fabricator or start a fabrication business.',
    },
  };

  const course = courses[courseId] || {
    title: 'Course Not Found',
    description: 'The requested course could not be found.',
    curriculum: '',
    outcomes: '',
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load

    const handleScroll = () => {
      if (buttonRef.current) {
        const buttonTop = buttonRef.current.getBoundingClientRect().top;
        const isButtonOutOfView = buttonTop < 0;
        setIsFloating(isButtonOutOfView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className='course-detail-page'>
      <section className='hero'>
        <div className='hero-content'>
          <h1>{course.title}</h1>
          <p>
            Explore our National Skills Qualification (NSQ) certified training
            program.
          </p>
        </div>
      </section>

      <section className='section course-details'>
        <div className='container'>
          <Link
            to='/about'
            className={`back-to-about ${isFloating ? 'floating' : ''}`}
            aria-label='Back to About page'
            ref={buttonRef}
          >
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
            </svg>
            Back to About
          </Link>
          <h2>Course Overview</h2>
          <p>{course.description}</p>
          <h3>Curriculum</h3>
          <p>{course.curriculum}</p>
          <h3>Learning Outcomes</h3>
          <p>{course.outcomes}</p>
          <Link to='/contact' className='cta-button'>
            Enroll Now
          </Link>
        </div>
      </section>

      <section className='section facilities'>
        <div className='container'>
          <h2>Training Facilities</h2>
          <p>
            Our state-of-the-art facilities include fully equipped workshops,
            computer laboratories, and industry-standard tools to ensure
            hands-on learning.
          </p>
          <p>
            Students benefit from daily practical workshops, industrial visits,
            and partnerships with industry practitioners to meet NBTE
            certification standards.
          </p>
        </div>
      </section>

      <section className='cta-banner'>
        <div className='container'>
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Contact us to learn more about our NSQ programs and how to enroll.
          </p>
          <Link to='/contact' className='cta-button'>
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CourseDetail;
