import React from "react";
import { useRouter } from "next/router";

const Footer: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  // Determine the background image based on the current route
  const getBackgroundImage = () => {
    switch (pathname) {
      case "/business-owners":
        return "url('/images/solar-bg.jpg')";
      case "/homeowners":
        return "url('/images/home.jpg')";
      default:
        return NaN;
    }
  };

  // Render footer content based on the current route
  const renderFooterContent = () => {
    switch (pathname) {
      case "/homeowners":
        return (
          <div className="text-center w-full">
            <h2 className="text-4xl md:text-6xl font-medium mb-4">
              The future is looking up
            </h2>
            <p className="text-3xl md:text-6xl font-medium">
              Be your own source of power
            </p>
          </div>
        );
      case "/business-owners":
        return (
          <div className="">
            <h2 className="text-6xl font-medium mb-4">Start Saving Today</h2>
            <p className="text-lg font-medium mb-8">
              Whether you’d like to be carbon neutral, want to reduce sky-high
              electricity bills, or need to fulfill building mandates, Enphase
              and our solar installation partners can design a system that will
              meet the unique demands of your property and business.
            </p>
          </div>
        );
      default:
        return (
          <div className="container mx-auto px-4 py-8 text-black ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                <div className="space-y-2">
                  <p>Future Green Energy</p>
                  <p>Near Sabarigiri International School </p>
                  <p>Sreekariyam, Trivandrum-695584</p>
                  <p>Phone: +91 77363-94030</p>
                  <p>Email: fgesolarteam@gmail.com</p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/about"
                          className="hover:text-gray-300 transition-colors"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/services"
                          className="hover:text-gray-300 transition-colors"
                        >
                          Services
                        </a>
                      </li>
                      <li>
                        <a
                          href="/homeowners"
                          className="hover:text-gray-300 transition-colors"
                        >
                          For Homeowners
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/contact"
                          className="hover:text-gray-300 transition-colors"
                        >
                          Contact
                        </a>
                      </li>
                      <li>
                        <a
                          href="/faq"
                          className="hover:text-gray-300 transition-colors"
                        >
                          FAQ
                        </a>
                      </li>
                      <li>
                        <a
                          href="/privacy"
                          className="hover:text-gray-300 transition-colors"
                        >
                          Privacy Policy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center mt-8 pt-4 border-t border-gray-700">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Future Green Energy. All Rights
                Reserved.
              </p>
            </div>
          </div>
        );
    }
  };
  const backgroundImage = getBackgroundImage();
  return (
    <footer
      className="relative text-white py-8 md:py-12 bg-cover bg-center  bg-gray-200"
      style={
        backgroundImage
          ? {
              background: `linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), ${backgroundImage} lightgray 50% / cover no-repeat`,
            }
          : {}
      }
    >
      <div className="container mx-auto px-4">{renderFooterContent()}</div>
    </footer>
  );
};

export default Footer;
