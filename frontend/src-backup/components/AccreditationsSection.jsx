// src/components/AccreditationsSection.jsx (Logos, like Etiwa's)
const AccreditationsSection = () => {
  const logos = [
    'https://via.placeholder.com/150?text=NBTE',
    'https://via.placeholder.com/150?text=Kaduna+State',
    // Add more
  ];

  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-primary-dark text-center mb-8'>
          Accreditations & Partners
        </h2>
        <div className='flex flex-wrap justify-center space-x-6'>
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt='Accreditation Logo'
              className='h-20'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationsSection;
