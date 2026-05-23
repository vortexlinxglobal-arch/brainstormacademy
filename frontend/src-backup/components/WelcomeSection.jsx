// src/components/WelcomeSection.jsx (About/Mission)
const WelcomeSection = () => {
  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto flex flex-col md:flex-row items-center'>
        <img
          src='https://via.placeholder.com/600x400?text=Welcome+to+Brainstorm'
          alt='Welcome to Brainstorm Academy'
          className='w-full md:w-1/2 mb-6 md:mb-0'
        />
        <div className='md:ml-8 text-center md:text-left'>
          <h2 className='text-3xl font-bold text-primary-dark mb-4'>
            Welcome to Brainstorm Academy
          </h2>
          <p className='text-lg text-gray-700'>
            Brainstorm Academy is a private training institution approved by the
            Kaduna State Government and NBTE to provide educational services in
            Nursery, Primary, Secondary, and skills development for NSQ
            certification.
          </p>
          <p className='text-lg text-gray-700 mt-4'>
            Our mission: To prepare children with knowledge and skills for
            tertiary education and empower youth for self-employment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
