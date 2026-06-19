import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="overflow-hidden bg-[#03120c] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6 sm:space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#F6E2B3]">
                About Brainstorm Skills
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Empowering Nigerian youth with practical skills, NBTE approval, and career-ready training.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
                Brainstorm Skills is a Kaduna-based academy approved by the Kaduna State Government and the National Board for Technical Education (NBTE) as a certified skills development center. We prepare learners for employment, entrepreneurship, and national certifications through practical training, structured curricula, and industry-aligned pathways.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'NBTE Approved', value: 'NSQ Certified Training' },
                  { label: 'Location', value: "No. 22 Ni'ma Road, Hayin Danmani, Kaduna" },
                  { label: 'Outcome', value: 'Education, Employment, Economic Independence' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-300">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-[#D4AF37]/20 transition hover:bg-[#b99223]"
                >
                  Explore NSQ Courses
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#0c2d1d] p-6">
                  <h2 className="text-lg font-semibold text-[#D4AF37]">Our Mission</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    To prepare learners with both knowledge and practical skills for admission into higher education or direct entry into skilled employment and self-employment.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#101f15] p-6">
                  <h2 className="text-lg font-semibold text-[#D4AF37]">Our Vision</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    To deliver competent technical education and ethical training that ensures quality, independence, and lasting opportunity for every learner.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#0c2d1d] p-6">
                  <h2 className="text-lg font-semibold text-[#D4AF37]">Why learners choose us</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                    <li>• Hands-on practical workshops matched with classroom support.</li>
                    <li>• Accredited NSQ certifications and industry-ready curriculum.</li>
                    <li>• Career counseling, placement support, and entrepreneurship guidance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4 rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a6b53]">Academy profile</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">A skills academy with focus on quality, certification, and employability.</h2>
              <p className="text-base leading-8 text-slate-700">
                Brainstorm Skills delivers a balanced combination of basic education and NSQ vocational training. Our National Skills Qualification courses are developed to help learners secure certified trade skills, practical knowledge, and the confidence to thrive in modern workplaces.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'NSQ Courses Offered',
                  description: 'From ICT and electrical installation to beauty, hospitality, and creative trades, our programs are built around practical competence and certification readiness.',
                },
                {
                  title: 'Curriculum Goals',
                  description: 'Academic excellence, technical competence, and career readiness are the core outcomes of every training path we offer.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200/10 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
              <h3 className="text-xl font-semibold text-slate-900">Facilities & Learning Features</h3>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                <li>• Modern laboratories and practical workshops for every trade.</li>
                <li>• Fully-equipped computer lab with internet access.</li>
                <li>• Industry visits and partnership engagements for real-world exposure.</li>
                <li>• Gender-inclusive classrooms and scholarship support for equal opportunity.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200/10 bg-white p-8 shadow-lg shadow-slate-900/5">
              <h3 className="text-xl font-semibold text-slate-900">Graduate Guarantee</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Every learner is supported to achieve the 3Es — Education, Employment, and Economic Independence — through competency-based assessments and coaching that turn acquired skills into income-generating opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
