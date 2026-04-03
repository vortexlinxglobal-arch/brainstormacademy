// src/components/CoursesSection.jsx (Categories with images, like Etiwa's)
const CoursesSection = () => {
  const courses = [
    {
      name: 'Networking & System Security',
      image: 'https://via.placeholder.com/300?text=Networking',
    },
    {
      name: 'Website Design & Development',
      image: 'https://via.placeholder.com/300?text=Web+Design',
    },
    {
      name: 'Mobile Phone Repair',
      image: 'https://via.placeholder.com/300?text=Mobile+Repair',
    },
    // Add more from brochure...
  ];

  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-primary-dark text-center mb-8'>
          Course Categories
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {courses.map((course, index) => (
            <div
              key={index}
              className='bg-neutral p-4 rounded shadow-md text-center'
            >
              <img
                src={course.image}
                alt={course.name}
                className='w-full h-40 object-cover mb-4'
              />
              <h3 className='text-lg font-semibold text-primary-dark'>
                {course.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
