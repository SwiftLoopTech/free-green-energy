import React from "react";

const Business: React.FC = () => {
  // Bento grid content
  const bentoGridContent = [
    {
      title: "Safety first",
      description:
        "Our Microinverter design is the safest choice for solar. Unlike systems with a central inverter, our solar never contains high-voltage, direct current (DC) power, eliminating the risk of fault fires.",
    },
    {
      title: "Certified for rain or shine",
      description:
        "All Enphase IQ Microinverters are all-weather with an IP67 certification. A double-insulated, corrosion-resistant polymer housing means they’re rated to withstand just about anything Mother Nature can throw at them.",
    },
    {
      title: "Responsive and responsible",
      description:
        "Enphase Energy Systems include built-in rapid shutdown so that, in the event of an emergency, your solar power can be turned off instantly and easily, keeping utility workers and first responders safe.",
    },
    {
      title: "Ready for today and tomorrow",
      description:
        "Our Microinverter design is the safest choice for solar. Unlike systems with a central inverter, our solar never contains high-voltage, direct current (DC) power, eliminating the risk of fault fires.",
    },
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <div
        className="rounded-lg bg-cover bg-center h-[70vh] flex flex-col justify-center items-center text-white p-4"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/business-hero.jpg')",
        }}
      >
        <h1 className="text-4xl md:text-8xl font-medium mb-4 w-1/2 text-center leading-[107px]">
          We're perfect for your business
        </h1>
        <div className="flex space-x-4">
          <button className="btn-primary">System estimator</button>
          <button className="btn-secondary">Watch Video</button>
        </div>
      </div>
      {/* About Section */}
      <div className="container mx-auto py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-4">
          <h2 className="text-5xl font-bold mb-4">
            Safe, smart, and powerful energy systems for business
          </h2>
          <p className="text-[16px]">
            The Commercial Enphase Energy System lowers reliance on the power
            grid, saves money on operating costs, and allows you to scale your
            future energy needs. With safety at the forefront, we offer peace of
            mind for sensitive sites like gas stations, firehouses, schools,
            multi-family units, hospitals, warehouses, and more. Join the
            growing number of commercial businesses and non-profit organisations
            that chose Enphase to help conserve energy and serve the people and
            communities that depend on them most. That's why Enphase means
            business.
          </p>
        </div>
      </div>
      {/* Bento Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-16">
        {bentoGridContent.map((item, index) => (
          <div key={index} className="bento-box  ">
            <h3 className="text-5xl font-medium leading-[64.8px]">
              {item.title}
            </h3>
            <p className="text-[16px] font-medium">{item.description}</p>
          </div>
        ))}
        <div className="bg-black rounded-lg text-white  px-14 flex pr-0 py-0 col-span-2 h-[443px] ">
          <div className="w-1/2 py-20">
            <h3 className="text-5xl font-medium mb-4">Better over time</h3>
            <p className="text-[16px]font-medium  w-3/5 ">
              Get free over-the-air software updates that bring innovative new
              features to your solar system and the Enphase App.
            </p>
          </div>
          <div
            className="w-1/2 bg-cover bg-center h-full rounded-r-lg"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0.3)), url('/images/solar-2-bg.jpg')",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Business;
