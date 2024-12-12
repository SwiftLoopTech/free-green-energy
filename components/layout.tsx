import Navbar from "./navbar";
import Footer from "./footer";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="mx-5 ">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
