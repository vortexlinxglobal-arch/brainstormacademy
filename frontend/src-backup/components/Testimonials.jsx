const Testimonials = () => {
  return (
    <section className='testimonials section'>
      <div className='container'>
        <h2>What Our Community Says</h2>
        <div className='grid'>
          <div className='testimonial-card'>
            <p className='testimonial-text'>
              "Brainstorm Academy transformed my career with practical skills
              and NBTE certification."
            </p>
            <p className='testimonial-author'>Jane Doe, Web Developer</p>
          </div>
          <div className='testimonial-card'>
            <p className='testimonial-text'>
              "The hands-on training and industry connections opened doors I
              never imagined."
            </p>
            <p className='testimonial-author'>John Smith, Data Analyst</p>
          </div>
          <div className='testimonial-card'>
            <p className='testimonial-text'>
              "Top-tier programs recognized by employers nationwide."
            </p>
            <p className='testimonial-author'>NBTE Official</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
