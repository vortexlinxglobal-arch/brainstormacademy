// src/components/NewsSection.jsx (Latest news, like Etiwa's partnership updates)
const NewsSection = () => {
  const news = [
    {
      title: 'New Partnership for Gender Equality Training',
      date: 'Sept 2025',
      excerpt: 'Collaborating with industry for women in skills development.',
    },
    // Add more
  ];

  return (
    <section className='py-12 bg-neutral'>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-primary-dark text-center mb-8'>
          Latest News
        </h2>
        <div className='space-y-6'>
          {news.map((item, index) => (
            <div key={index} className='bg-white p-6 rounded shadow-md'>
              <h3 className='text-xl font-semibold text-primary-dark mb-2'>
                {item.title}
              </h3>
              <p className='text-sm text-gray-500 mb-2'>{item.date}</p>
              <p className='text-gray-700'>{item.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
