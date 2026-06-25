import { Button, Col, Flex, Layout, Row } from "antd";
import React, { useEffect, useState } from "react";
import logoImg from "../assets/images/logo/Logo.png";
import ColorAnimationComponent from "../components/common/ColorAnimationComponent";
import { Content, Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import "../styles/propertyListingStyles.scss";


interface PropertyListingProps {
  children: JSX.Element;
  location?: string;
  isPageScroll?: boolean;
}
const PropertyListing: React.FC<PropertyListingProps> = ({
  children,
  location,
  isPageScroll,
}) => {
  const history = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerStyle: React.CSSProperties = {
    height: "12vh",
    width: "100%",
    position: "fixed",
    background:
      scrolled || isPageScroll ? "rgba(255, 255, 255, 0.1)" : "transparent",
    boxShadow:
      scrolled || isPageScroll ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
    backdropFilter: scrolled || isPageScroll ? "blur(6px)" : "none",
    WebkitBackdropFilter: scrolled || isPageScroll ? "blur(6px)" : "none",
    transition: "all 0.3s ease",
    zIndex: 20,
    padding: "25px 60px",

  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    //height: "80vh",
    height: location === "plan" ? "100%" : "80vh",
    padding: "0 90px",
  };

  const layoutStyle = {
    width: "100vw",
    minHeight: "100vh",
  };

  return (
    <div>
      <Layout style={layoutStyle}>
        <ColorAnimationComponent layoutHeight="100%" />
        <Header style={headerStyle}>
          {" "}
          <Row className="listingHeader d-flex justify-content-between">
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={5}
              xl={5}
              xxl={5}
              className="d-flex align-items-center"
            >
              <img
                src={logoImg}
                alt="logo"
                width="auto"
                height={40}
                onClick={() => {
                  history("/");
                }}
              />
            </Col>
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={5}
              xl={5}
              xxl={5}
              className="d-flex align-items-center justify-content-center justify-content-sm-end"
            >
              <Button

                size="large"
                type="default"
                className="px-4 py-3 my-3 my-sm-0 me-3 rounded-4"
                onClick={() => {
                  history(`/listed-properties`);
                }}
              >
                Back To Dashboard
              </Button>
            </Col>
          </Row>
        </Header>
        <Content
          style={contentStyle}
          className="contentParent text-center text-lg-start pt-3 pt-sm-0 pt-lg-5 pt-xl-1 mt-5 mt-sm-0"
        >
          {children}
        </Content>
      </Layout>
    </div>
  );
};

export default PropertyListing;
