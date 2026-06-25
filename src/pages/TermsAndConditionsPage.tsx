import {  Card, Col, Row } from "antd";
import "../styles/propertyListingStyles.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavBar from "../components/NavBar";
import { TERMS_AND_CONDITIONS } from "../common/data/TermsAndConditions";

const TermsAndConditionsPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <NavBar pageName="whitePage" />
      <div
        className="TermsAndConditionsPageContainer py-5 py-lg-0 h-100 w-100 d-flex align-items-center"
        style={{ minHeight: "100vh", margin: "60px 0px 0px 0px" }}
      >
        {/* <Button
        onClick={() => {
          const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
          history(`/complete/${propertyId}`);
        }}
        size="large"
        type="default"
        className="position-fixed rounded-circle px-2"
        style={{ top: "20px", left: "20px", height: 40 }}
      >
        <ArrowLeft size={20} className="mx-1" />
      </Button> */}
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100 "
          style={{ height: "90%" }}
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={18}
            xl={18}
            xxl={18}
            className="my-5"
          >
            <Card className="p-3">
              <h1 className=" font-weight-semi-bold font-size-2 mb-5">
                Terms And Conditions
              </h1>
              {TERMS_AND_CONDITIONS.map((section, index) => (
                <div key={index}>
                  <h2 className="mt-4 mb-2 font-size-3 font-weight-semi-bold">
                    {index + 1}. {section?.title}
                  </h2>
                  <p className="text-gray-secondary font-size-6">
                    {section?.description}
                  </p>
                  {section?.subDetails &&
                    section?.subDetails?.map((detail, i) => (
                      <p className="text-gray-secondary font-size-6">
                        <span className="font-size-3 font-weight-semi-bold text-dark">
                          {detail?.title}{" "}
                        </span>{" "}
                        {detail?.description}
                      </p>
                    ))}
                  <p className="mt-2 text-gray-secondary font-size-6">
                    {section?.additionalDetails}
                  </p>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;
