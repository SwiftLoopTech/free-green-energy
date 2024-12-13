import React from "react";
import { useRouter } from "next/router";

const Footer: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  // Determine the background image based on the current route
  let backgroundImage;
  switch (pathname) {
    case "/business-owners":
      backgroundImage = "url('/images/solar-bg.jpg')";
      break;
    case "/homeowners":
      backgroundImage = "url('/images/home.jpg')";
      break;
    default:
      backgroundImage = "url('/images/default-bg.jpg')";
      break;
  }

  // Function to render footer content based on the current route
  const renderFooterContent = () => {
    switch (pathname) {
      case "/homeowners":
        return (
          <div className="text-center w-full">
            <h2 className="text-6xl font-medium mb-4">
              The future is looking up
            </h2>
            <p className="text-6xl font-medium">Be your own source of power</p>
          </div>
        );
      default:
        return (
          <div className="text-right w-1/2">
            <h2 className="text-6xl font-medium mb-4">Start Saving Today</h2>
            <p className="text-lg font-medium mb-8">
              Whether you’d like to be carbon neutral, want to reduce sky-high
              electricity bills, or need to fulfill building mandates, Enphase
              and our solar installation partners can design a system that will
              meet the unique demands of your property and business.
            </p>
          </div>
        );
    }
  };

  return (
    <footer
      className="relative text-white p-4 mt-8 h-[587px] bg-cover bg-center"
      style={{
        background: `linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), ${backgroundImage} lightgray 50% / cover no-repeat`,
      }}
    >
      <div className="relative w-10/12 h-full mx-auto flex items-center justify-end">
        {renderFooterContent()}
      </div>
    </footer>
  );
};

export default Footer;
