import { Button, Card, Col, Grid, Row } from "antd";
import StepOneImg1 from "../../assets/images/steps/stepOneImg1.png";
import StepOneImg2 from "../../assets/images/steps/stepOneImg2.png";
import StepOneImg3 from "../../assets/images/steps/stepOneImg3.png";
import "../../styles/propertyListingStyles.scss";
import PropertyListing from "../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";

const StepGetStart = () => {
  const history = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const pageData: { title: string, description: string, img: string }[] = [
    {
      title: "1. Tell us about your space",
      description: " Share the basics—location, capacity, and what makes your property special. The more details, the better!",
      img: StepOneImg1
    }, {
      title: "2. Make it shine",
      description: " Add at least five stunning photos, create a catchy title, and write a description that captures the essence of your property.We'll guide you to make it stand out!",
      img: StepOneImg2
    }, {
      title: "3. Publish and start hosting",
      description: "Set your pricing, finalize the details, and when you're ready, hit publish! Your listing will be live, and you'll be welcoming guests in no time.",
      img: StepOneImg3
    }
  ]
  return (
    <PropertyListing>
      <div className="stepGetStartContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 "
          style={{ height: "90%", overflowY: "auto" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="d-flex flex-column align-items-center align-items-lg-start">
              <h1
                className="w-100 font-weight-medium font-size-1 pe-0 pe-lg-4 "
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                Getting started with{" "}
                <span className="primary-color"> Serviced Apartments LK </span>
                is quick and simple!
              </h1>
              <p className="w-100 font-size-4 font-weight-extra-light ">
                We make it easy for you to showcase your space and attract
                guests in no time. Just follow these three straightforward steps
                to get your property listed
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className={`d-flex flex-column align-self-end w-100 mb-2  ${screens.xxl
              ? "justify-content-center"
              : "justify-content-start"
              } `}
            style={{ height: "88%", overflowY: "auto" }}
          >
            {pageData.map((data: { title: string, description: string, img: string }) => {
              return <Card
                className="my-2 text-center text-sm-start bg-transparent w-100"
                bordered={false}
              >
                <Row>
                  <Col xs={24} sm={18} md={19} lg={17} xl={18} xxl={18}>
                    <h2 className="font-size-3 font-weight-medium my-1">
                      {data?.title}
                    </h2>
                    <p className="font-size-4 font-weight-light my-1 pe-4">
                      {data?.description}
                    </p>
                  </Col>
                  <Col xs={24} sm={6} md={5} lg={7} xl={6} xxl={6}>
                    <img
                      src={data?.img}
                      alt="image "
                      height="120px"
                      width="auto"
                    />
                  </Col>
                </Row>
              </Card>
            })}
          </Col>
        </Row>
        <Row
          className="btnRow justify-content-center justify-content-lg-end"
          style={{ height: "10%" }}
        >
          <Col
            xs={24}
            sm={18}
            md={10}
            lg={5}
            xl={4}
            xxl={3}
            className="mt-1 mb-2 mb-md-4 pe-0 pe-md-3"
          >
            <Button
              size="large"
              type="primary"
              className="getStartBtn px-5 py-4 mt-3 mt-lg-0 rounded-4 w-100"
              onClick={() => {
                history("/");
              }}
            >
              Back To Home
            </Button>
          </Col>
          <Col
            xs={24}
            sm={18}
            md={10}
            lg={5}
            xl={4}
            xxl={3}
            className="mt-1 mb-4 ps-0 ps-md-3"
          >
            <Button
              size="large"
              type="primary"
              className="getStartBtn px-5 py-4 mt-3 mt-lg-0 rounded-4 w-100"
              onClick={() => {
                history("/property/01");
              }}
            >
              Get Started
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepGetStart;
