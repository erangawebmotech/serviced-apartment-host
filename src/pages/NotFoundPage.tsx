import { Button, Col, Row } from "antd";
import ErrorImage from "../assets/images/404_error.png";
import "../styles/propertyListingStyles.scss";
import PropertyListing from "./PropertyListing";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const NotFoundPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <PropertyListing>
      <div className="NotFoundPageContainer py-5 py-lg-0 h-100 w-100 d-flex align-items-center">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100 "
          style={{ height: "90%" }}
        >
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="pe-0 pe-md-4"
          >
            <img src={ErrorImage} alt="image " height="auto" width="100%" />
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
            <div className=" text-center">
              <h1 className=" font-weight-medium font-size-1 text-center  primary-color ">
                Page Not Found
              </h1>
              <h6 className="text-center fw-normal mt-3">
                It seems the page you're looking for doesn’t exist or is
                currently unavailable.
              </h6>
              <h6 className="text-center font-size-5 mt-3 fw-light px-5 ">
                This issue can occur for a few reasons: The page has likely been
                removed or is no longer active, the link you've followed may be
                incorrect or outdated, or you may have entered the URL
                inaccurately.
              </h6>
            </div>
          </Col>
          {/* <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            xxl={8}
            className="pe-0 pe-md-4"
          >
            <Button
              size="large"
              type="primary"
              className=" w-100  mt-3 rounded-3"
              style={{ whiteSpace: "normal", height: "auto" }}
              onClick={() => {
                history("/listed-properties");
              }}
            >
              Back To Your Properties
            </Button>
          </Col> */}
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            xxl={8}
            // className="pe-0 pe-md-4"
          >
            <Button
              size="large"
              type="primary"
              className=" w-100  mt-3 rounded-3"
              style={{ whiteSpace: "normal", height: "auto" }}
              onClick={() => {
                history("/");
              }}
            >
              Back To Home
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default NotFoundPage;
