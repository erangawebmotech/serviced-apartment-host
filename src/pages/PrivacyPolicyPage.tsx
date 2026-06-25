import { Card, Col, Row } from "antd";
import "../styles/propertyListingStyles.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PRIVACY_STATEMENTS } from "../common/data/PrivacyPolicies";
import NavBar from "../components/NavBar";

const PrivacyPolicyPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <NavBar pageName="whitePage" />
      <div
        className="PrivacyPolicyPageContainer py-5 py-lg-0 h-100 w-100 d-flex align-items-center"
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
                Privacy Policies
              </h1>
              {PRIVACY_STATEMENTS.map((section, index) => (
                <div key={index}>
                  <h2 className="mt-4 mb-2 font-size-3 font-weight-semi-bold">
                    {index + 1}. {section?.title}
                  </h2>
                  <p className="text-gray-secondary font-size-6">
                    {section?.description}
                  </p>
                  {section?.subDetails && (
                    <ul className="flex flex-col gap-2 mt-2 pl-5 text-gray-secondary font-size-6">
                      {section?.subDetails?.map((detail, i) => (
                        <li key={i} className="flex items-start my-2">
                          {/* {
                          <img
                            src={image}
                            alt="serviced apartments logo"
                            height={20}
                            width={20}
                          />
                        } */}
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
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

export default PrivacyPolicyPage;
