const Section4 = () => {
  const stats = [
    {
      value: "1,200+",
      label: "Active Stores",
    },
    {
      value: "$2.5M+",
      label: "Revenue Generated",
    },
    {
      value: "50,000+",
      label: "Products Sold",
    },
  ];

  return (
    <section id="trusted-section" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#DCD9D7] rounded-xl px-30 py-10">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#443F3B]">
            Trusted by Cambodian Entrepreneurs
          </h2>
          <div className="grid md:grid-cols-3 gap-35">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold mb-3 text-[#443F3B]">
                  {stat.value}
                </div>
                <div className="text-[#6B6B6B] text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;
