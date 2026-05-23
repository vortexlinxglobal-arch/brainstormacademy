// src/components/ServicesSection.jsx (Cards for services, like Etiwa's training, placement, hostels)
const ServicesSection = () => {
  const services = [
    {
      title: 'Quality Training Programs',
      description:
        'Combine theory, practical, and hands-on experience in various skills.',
      icon: 'https://via.placeholder.com/100?text=Training',
    },
    {
      title: 'Job Placements & Career Guidance',
      description:
        'Guaranteed 3Es: Education, Employment, Economic Independence.',
      icon: 'https://via.placeholder.com/100?text=Jobs',
    },
    {
      title: 'Hostel Accommodation',
      description: 'Conducive living spaces for trainees.',
      icon: 'https://via.placeholder.com/100?text=Hostel',
    },
  ];

  return (
    <section className='py-12 bg-neutral'>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-primary-dark text-center mb-8'>
          Our Services
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded shadow-md text-center'
            >
              <img
                src={service.icon}
                alt={service.title}
                className='mx-auto mb-4'
              />
              <h3 className='text-xl font-semibold text-primary-dark mb-2'>
                {service.title}
              </h3>
              <p className='text-gray-700'>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
