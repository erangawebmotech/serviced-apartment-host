import React, { Fragment } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

interface MainLayoutProps {
  children: JSX.Element;
  pageName?: string;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children, pageName }) => {
  return (
    <Fragment>
      <NavBar pageName={pageName} />
      <main>{children}</main>
      <Footer />
    </Fragment>
  );
};

export default MainLayout;
