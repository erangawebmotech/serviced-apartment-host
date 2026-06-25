import React, { Fragment } from "react";

interface PropertyLayoutProps {
  children: JSX.Element;
}
const PropertyLayout: React.FC<PropertyLayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <main>{children}</main>
    </Fragment>
  );
};

export default PropertyLayout;
