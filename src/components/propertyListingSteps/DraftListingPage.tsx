import { Card, Col, Row } from "antd";
import StepOneImg from "../../assets/images/steps/stepOneImg1.png";
import StepOneImgBlack from "../../assets/images/steps/stepOneImgBlack.png";
import "../../styles/propertyListingStyles.scss";
import PropertyListing from "../../pages/PropertyListing";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  checkAuthUserIsAdmin,
  getDecryptedCookie,
  handleError,
  popUploader,
  removeCookie,
} from "../../common/commonFunctions";
import * as constants from "../../common/constants";
import { Cookies } from "typescript-cookie";
import { checkPlan, getAllPlanDetails } from "../../service/propertyDetailsService";
import { useDispatch } from "react-redux";
import { PlansEnum } from "../../common/enums/plansEnum";

const DraftListingPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isFromPlans, setIsFromPlans] = useState<boolean>(false);
  const [isExistStaterPlan, setIsExistStaterPlan] = useState<boolean>(false);
  const [planDetails, setPlanDetails] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);



  useEffect(() => {
    const { state } = location;
    if (state && state.fromLocation) {
      const { fromLocation } = state;
      // console.log(fromLocation, "fromLocation");

      fromLocation === "PlanSelection"
        ? setIsFromPlans(true)
        : setIsFromPlans(false);
    }
  }, [location]);

  useEffect(() => {
    checkSelectedPlan()
    loadAllPlanDetails()
  }, []);

  const loadAllPlanDetails = () => {
    popUploader(dispatch, true);
    getAllPlanDetails()
      .then((resp) => {
        setPlanDetails(resp?.data);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };


  const checkSelectedPlan = () => {
    popUploader(dispatch, true);
    checkPlan()
      .then((resp) => {
        setIsExistStaterPlan(resp?.data?.starterListingExists)
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  }

  return (
    <PropertyListing>
      <div className="DraftListingPageContainer py-5 py-lg-0 h-100 w-100 d-flex align-items-center">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 "
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
            <div className=" text-center">
              <h1 className=" font-weight-medium font-size-1 text-center  primary-color mx-3 mx-md-0 ">
                Welcome Back!
              </h1>
              <h6 className="text-center fw-normal mt-3">
                We’re glad to see you again! Whether you're here to complete
                your existing property draft or start fresh with a new listing,
                we’ve got the tools to make it easy.
              </h6>
              <h6 className="text-center font-size-5 mt-3 fw-light px-5">
                Remember, completing your property listing ensures better
                visibility, attracts more guests, and complies with local
                regulations.
              </h6>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Row className="w-100 d-flex justify-content-center">
              <Col
                xs={22}
                sm={20}
                md={12}
                lg={10}
                xl={8}
                xxl={8}
                className="px-3"
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    width: "100%",
                    borderBottom: "4px solid #ef5a60 ",
                    // borderLeft: "3px solid #ef5a60 ",
                  }}
                  className="d-flex align-items-center justify-content-center bg-transparent"
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  {" "}
                  <div className="w-100 d-flex flex-column align-items-center">
                    <img
                      src={StepOneImgBlack}
                      alt="image "
                      height="120px"
                      width="auto"
                    />
                    <h6 className="mt-3 text-center">Continue Draft</h6>
                    <p className="text-muted mt-2 text-center">
                      Pick up where you left off! Your progress is saved, so you
                      can continue refining details like pricing, availability,
                      and amenities.
                    </p>
                  </div>
                </Card>
              </Col>
              <Col
                xs={22}
                sm={20}
                md={12}
                lg={10}
                xl={8}
                xxl={8}
                className="px-3 mt-5 mt-md-0"
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    width: "100%",
                    borderBottom: "4px solid #ef5a60 ",
                    // borderLeft: "3px solid #ef5a60 ",
                  }}
                  className="d-flex align-items-center justify-content-center bg-transparent"
                  onClick={() => {
                    removeCookie(constants.PROPERTY_ID);
                    Cookies.remove(constants.ROOM_ID);
                    // isFromPlans ? history(`/start`) : history(`/start`);
                    // Cookies.set(constants.PLAN_ID, 2);
                    // isFromPlans ? history(`/start`) : history(`/plan-selection`);

                    if (isFromPlans) {
                      history(`/start`);
                    } else {
                      if (checkAuthUserIsAdmin()) {
                        history("/admin-property-listings");
                      } else {
                        if (isExistStaterPlan) {
                          history("/start");
                          const starterPlan = planDetails.find(plan => plan.name === PlansEnum.STARTER);
                          const starterPlanId = starterPlan ? starterPlan.id : null;
                          // console.log(starterPlanId, "starterPlanId");
                          Cookies.set(constants.PLAN_ID, starterPlanId);
                        } else {
                          history("/plan-selection");
                        }
                      }
                    }
                  }}
                >
                  <div className="w-100 d-flex flex-column align-items-center">
                    <img
                      src={StepOneImg}
                      alt="image "
                      height="120px"
                      width="auto"
                    />
                    <h6 className="mt-3 text-center">Start New Listing</h6>
                    <p className="text-muted mt-2 text-center">
                      Ready to list a new property? We’ll guide you step-by-step
                      through pricing, amenities, photos, and more to help you
                      get noticed.
                    </p>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default DraftListingPage;
