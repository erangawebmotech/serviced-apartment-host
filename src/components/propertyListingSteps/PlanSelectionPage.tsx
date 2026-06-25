import { Col, Row } from "antd";
import "../../styles/propertyListingStyles.scss";
import PropertyListing from "../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import hotelBuilding from "../../assets/images/home/iconImage/Hotel Building.png";
import {
  checkAuthenticationViaAuthUser,
  formatNamesCmnFun,
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../common/commonFunctions";
import * as constants from "../../common/constants";
import { Cookies } from "typescript-cookie";
import {
  getAllPlanDetails,
  getPropertyTypes,
} from "../../service/propertyDetailsService";
import { useDispatch } from "react-redux";
import SendInquiryModal from "../common/modal/SendInquiryModal";
import { PlansEnum } from "../../common/enums/plansEnum";
import { LISTING_PLANS } from "../../common/data/plans";
import PackagePlanCard from "../common/cards/PackagePlanCard";

const PlanSelectionPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: number;
    name: string;
  }>();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [planDetails, setPlanDetails] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    loadAllPlanDetails();
  }, []);

  useEffect(() => {
    const cardElements = document.querySelectorAll(".glass-container");
    const heights = Array.from(cardElements).map((card) =>
      (card as HTMLElement).offsetHeight
    );

    const maxCardHeight = Math.max(...heights);
    setMaxHeight(maxCardHeight);
  }, [planDetails]);

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

  // useEffect(() => {
  //   const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
  //   if (propertyId) {
  //   }
  // }, []);

  const handleOpenInquiryModal = (plan: { id: number; name: string }) => {
    setSelectedPlan(plan);
    setIsInquiryModalOpen(true);
  };

  return (
    <PropertyListing location="plan">
      <div className="d-flex align-items-center py-5 py-lg-0 w-100 h-100 PlanSelectionPageContainer">
        {selectedPlan && (
          <SendInquiryModal
            isOpen={isInquiryModalOpen}
            selectedPlan={selectedPlan}
            onClose={() => {
              setIsInquiryModalOpen(false);
            }}
          />
        )}
        <Row
          className="d-flex align-items-center justify-content-center pt-5 pt-lg-5 my-5 contentRow h-100"
        >
          <Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20}>
            <div className="text-center">
              <h1 className="font-size-1 font-weight-medium text-center primary-color">
                Welcome to List Your Property!
              </h1>
              <h6 className="mt-3 text-center fw-normal">
                We’re thrilled to have you here! Your journey to becoming a
                successful property listing starts with selecting the perfect
                plan tailored to your needs. Whether listing your first property
                or expanding your portfolio, we’ve made the process simple and
                efficient.
              </h6>
              <h6 className="mt-3 px-5 font-size-5 text-center fw-light">
                Selecting a plan ensures you have the best tools at your
                disposal to make listing a breeze. Let’s take this step together
                and unlock your property’s full potential.
              </h6>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="mt-5">
            <div className="d-flex align-items-start justify-content-center mt-4 w-100 row card-container-animation">
              {planDetails.map((plan: any, index: number) => {
                const matchingPlan = LISTING_PLANS.find(
                  (details) => details.plan === plan.name
                );

                if (!matchingPlan) return null;

                return (
                  <PackagePlanCard
                    key={index}
                    index={index}
                    matchingPlan={matchingPlan}
                    maxHeight={maxHeight}
                    hoveredCard={hoveredCard}
                    onHover={(i) => setHoveredCard(i)}
                    onButtonClick={() => {
                      if (plan?.name === PlansEnum.STARTER) {
                        Cookies.set(constants.PLAN_ID, plan?.id);
                        // const isUserLogin = Cookies.get(constants.AUTH_USER_HOST);

                        if (checkAuthenticationViaAuthUser()) {
                          const propertyId = getDecryptedCookie(
                            constants.PROPERTY_ID
                          );
                          if (propertyId) {
                            history("/draft-listing", {
                              state: { fromLocation: "PlanSelection" },
                            });
                          } else {
                            history("/start");
                          }
                        } else {
                          history("/login");
                        }
                      } else {
                        handleOpenInquiryModal(plan);
                      }
                    }}
                  />
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default PlanSelectionPage;
