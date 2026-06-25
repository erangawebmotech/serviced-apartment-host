import { Button, Col, Row } from "antd";
import ComingSoonImage from "../assets/images/comingSoon.svg";
import PropertyListing from "./PropertyListing";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const ComingSoonPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <PropertyListing>
      <div className="ComingSoonPageContainer py-5 py-lg-0 h-100 w-100 d-flex align-items-center">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100 "
          style={{ height: "90%" }}
        >
          <Col
            xs={24}
            sm={24}
            md={18}
            lg={12}
            xl={8}
            xxl={8}
            className="pe-0 d-flex justify-content-center"
          >
            <img src={ComingSoonImage} alt="image " height="400px" width="auto" />
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
            <div className=" text-center">
              <h1 className=" font-weight-medium font-size-1 text-center  primary-color ">
                Coming Soon
              </h1>
              <h6 className="text-center fw-normal mt-3">
                This page is currently under development. Stay tuned for
                updates! We're launching soon!
              </h6>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={7}
            xl={7}
            xxl={7}
            className="pe-0 pe-md-4"
          >
            <Button
              size="large"
              type="primary"
              className=" w-100 mt-3 rounded-3"
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

export default ComingSoonPage;
