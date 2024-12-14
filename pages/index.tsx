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
            <button className=" btn-primary">Get Product</button>
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
          <h1>The revolutionary IQ8 Series</h1>
          <p>Our smartest microinverter ever</p>
          <div className="flex gap-2 mx-auto">
            <button className=" btn-primary">Learn More</button>
            <button className=" btn-secondary">Design my system</button>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto flex justify-between gap-3 w-full p-4">
        <div className="w-1/2">
          {" "}
          <div
            className="bg-cover bg-center flex items-center rounded-xl"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/person.jpg')",
            }}
          >
            <div className="landing-sections">
              <h1>Energy 101</h1>
              <p>Your frequently asked questions, answered</p>

              <button className=" btn-primary">Learn More</button>
            </div>
          </div>
        </div>
        <div className="w-1/2 ">
          {" "}
          <div
            className="bg-cover bg-center flex items-center rounded-xl"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/worker.jpg')",
            }}
          >
            <div className="landing-sections">
              <h1>Installer Centre</h1>
              <p>All the information you need in one place</p>

              <button className=" btn-primary ">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
