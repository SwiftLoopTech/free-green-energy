import React from "react";

const Landing: React.FC = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <div
        className="h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/panel-working.png')",
        }}
      >
        <div className="landing-sections">
          <h1>It’s a new day for solar power</h1>
          <p>Make, use and sell your own power</p>
          <div>
            <button className=" btn-primary ">Get Product</button>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div
        className="h-[70vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            " linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/panels.jpg')",
        }}
      >
        <div className="landing-sections">
          <h1>IQ Battery 5P</h1>
          <p>Our most powerful battery yet</p>
          <div className="flex gap-2 mx-auto">
            <button className=" btn-primary">For Homeowners</button>
            <button className=" btn-secondary">For Installers</button>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div
        className="h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/panel.jpg')",
        }}
      >
        <div className="landing-sections">
          <h1>The Revolutionary IQ8 Series</h1>
          <p>Our smartest microinverter ever</p>
          <div className="flex gap-2 mx-auto">
            <button className=" btn-primary">Learn More</button>
            <button className=" btn-secondary">Design my system</button>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto flex flex-col md:flex-row justify-between gap-3 w-full p-4">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div
            className="bg-cover bg-center flex items-center rounded-xl p-4 h-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/person.jpg')",
            }}
          >
            <div className="landing-sections">
              <h1 className="text-white text-2xl font-bold mb-2">Energy 101</h1>
              <p className="text-white mb-4">
                Your frequently asked questions, answered
              </p>
              <button className="btn-primary mx-auto ">Learn More</button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div
            className="bg-cover bg-center flex items-center rounded-xl p-4 h-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/worker.jpg')",
            }}
          >
            <div className="landing-sections">
              <h1 className="text-white text-2xl font-bold mb-2">
                Installer Centre
              </h1>
              <p className="text-white mb-4">
                All the information you need in one place
              </p>
              <button className="btn-primary mx-auto">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
