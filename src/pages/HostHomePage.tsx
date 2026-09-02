import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkAuthenticationViaAuthUser,
  checkAuthUserIsAdmin,
  customToastMsg,
  formatNamesCmnFun,
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../common/commonFunctions";
import { Cookies } from "typescript-cookie";
import * as constants from "../common/constants";
import mainUpImg from "../assets/images/home/MainImage.png";
import mainImageDown from "../assets/images/home/MainImageDown.png";
import home from "../assets/images/home/iconImage/Room.png";
import settie from "../assets/images/home/iconImage/Room Cleaning.png";
import man from "../assets/images/home/iconImage/Bellboy.png";
import checkout from "../assets/images/home/iconImage/Check out.png";
import hotelBuilding from "../assets/images/home/iconImage/Hotel Building.png";
import lastImg from "../assets/images/home/sigiriya.png";
import combine from "../assets/images/home/imgHome_combine.png";
import parse from "html-react-parser";
import "../styles/homePage/hostHomePageStyle.scss";
import "../styles/commonStyles.scss";
import { useDispatch } from "react-redux";
import {
  getAllPlanDetails,
  getPropertyTypes,
} from "../service/propertyDetailsService";
import SendInquiryModal from "../components/common/modal/SendInquiryModal";
import { PlansEnum } from "../common/enums/plansEnum";
import { FAQ_FOR_HOSTS } from "../common/data/faq";
import { LISTING_PLANS } from "../common/data/plans";
import MainLayout from "../layout/MainLayout";
import FeatureBlock from "../components/common/cards/FeatureBlock";
import { features, hostFeatures } from "../common/data/features";
import sidePattern from '../assets/images/home/packages-side-pattern.png'
import mobileFront from '../assets/images/home/mobile-font.png'
import mobileBack from '../assets/images/home/mobile-back.png'
import appStore from '../assets/images/home/appstore.png'
import googlePay from '../assets/images/home/googleplay.png'
import PackagePlanCard from "../components/common/cards/PackagePlanCard";

const Dashboard = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [planDetails, setPlanDetails] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: number;
    name: string;
  }>();

  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const cardElements = document.querySelectorAll(".glass-container");
    const heights = Array.from(cardElements).map(
      (card: HTMLElement) => card.offsetHeight
    );

    const maxCardHeight = Math.max(...heights);
    setMaxHeight(maxCardHeight);
  }, [planDetails]);

  useEffect(() => {
    loadAllPlanDetails();
  }, []);

  const loadAllPlanDetails = async () => {
    popUploader(dispatch, true);

    await getAllPlanDetails()
      .then(async (resp) => {
        setPlanDetails(resp?.data);
      })
      .catch((err) => {
        handleError(err);
      });

    popUploader(dispatch, false);
  };

  const handleOpenInquiryModal = (plan: { id: number; name: string }) => {
    setSelectedPlan(plan);
    setIsInquiryModalOpen(true);
  };

  return (
    <div>

      {/* <NavBar /> */}
      {/* <h1 className="m-0">Home page</h1>
      <Button onClick={testLoginFunction}>Login</Button> */}

      {selectedPlan && (
        <SendInquiryModal
          isOpen={isInquiryModalOpen}
          selectedPlan={selectedPlan}
          onClose={() => {
            setIsInquiryModalOpen(false);
          }}
        />
      )}

      <MainLayout>
        <main>
          {/* ---------------------1st Page---------------------- */}
          <div className="d-flex align-items-center justify-content-center homePage_ExtraPadding container-fluid">
            <div className="d-flex justify-content-between row inner_container_homePage">
              <div className="left-home d-flex flex-column align-items-start p-lg-0 p-xl-0 col-sm-12 col-lg-7 col-xl-8 col-md-12">
                <h1 className="home_Text">
                  Turn your <br />
                  <span className="special_Word">SriLankan Space</span>
                  <br />into a home
                  <br />for the world
                </h1>
                <p className="m-0 font-size-4 home-small-txt">
                  Ready to turn your space into a sought-after destination?
                  Whether it’s a cozy apartment or a luxury villa, we’ll help you
                  reach travelers from around the world. List your property today
                  and watch your calendar fill up!
                </p>
              </div>
              {/* <div className="col-sm-12 col-lg-1 col-xl-1 col-md-12"></div> */}
              <div className="right-home-section position-relative d-flex col-sm-12 col-lg-5 col-xl-4 col-md-12">
                <img
                  style={{ maxWidth: "25rem" }}
                  src={mainUpImg}
                  alt="mainUpImage"
                  className="img-border-radius res-d-none-homeImg"
                />
                <img
                  src={mainImageDown}
                  alt="mainDownImage"
                  className="img-border-radius main-downImg res-d-none-homeImg"
                />

                <img
                  src={combine}
                  alt="mainDownImage-response"
                  className="img-border-radius res-d-view-homeImg"
                />
              </div>
            </div>
          </div>
          {/* ---------------------2nd Page---------------------- */}
          <div className="d-flex align-items-center justify-content-center second-page-Main">
            <div className="d-flex align-items-center justify-content-center second_pageInner container-fluid"

            >
              <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100 up-container">
                <h2 className="m-0 max-w-20ch text-start" style={{ maxWidth: '20ch' }}>Reach a unique global customer base</h2>
                <p className="m-0 font-size-4 text-gray-secondary text-start" style={{ maxWidth: '55ch' }}>
                  Ready to turn your space into a sought-after destination?
                  Whether it’s a cozy apartment or a luxury villa, we’ll help.
                </p>
              </div>

              <div className="w-100 down-container row">
                <div className="col-sm-12 same-padding col-xl-3 col-lg-6 col-md-6">
                  <img
                    height={80}
                    width={80}
                    src={home}
                    alt="home"
                    className="mb-1"
                  />
                  <h5 className="mt-2 mb-2 font-size-2">
                    Easy Property Listing Service
                  </h5>
                  <p className="font-size-5 text-gray">
                    Effortlessly list your property with our intuitive tools,
                    streamlining the process to attract guests quickly and
                    effectively.
                  </p>
                </div>
                <div className="col-sm-12 same-padding col-xl-3 col-lg-6 col-md-6">
                  <img height={80} src={settie} alt="settie" className="mb-1" />
                  <h5 className="mt-2 mb-2 font-size-2">
                    Advanced Security Features
                  </h5>
                  <p className="font-size-5 text-gray">
                    Protect your data and operations with cutting-edge encryption,
                    multi-factor authentication, and fraud detection systems.
                  </p>
                </div>
                <div className="col-sm-12 same-padding col-xl-3 col-lg-6 col-md-6">
                  <img width={80} src={man} alt="home" className="mb-1" />
                  <h5 className="mt-2 mb-2 font-size-2">
                    Comprehensive Reporting
                  </h5>
                  <p className="font-size-5 text-gray">
                    Track performance and optimize strategies with in-depth
                    analytics and real-time reporting tools.
                  </p>
                </div>
                <div className="col-sm-12 same-padding col-xl-3 col-lg-6 col-md-6">
                  <img width={80} src={checkout} alt="home" className="mb-1" />
                  <h5 className="mt-2 mb-2 font-size-2">
                    Integrated Payment Options
                  </h5>
                  <p className="font-size-5 text-gray">
                    Handle transactions with ease through secure and flexible
                    payment gateways designed for both you and your guests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd page */}
          <div className="d-flex flex-column align-items-center justify-content-center w-100 third_Page">
            <div className="d-flex flex-column align-items-center justify-content-center text-center thirdPage_inner">
              <h1 className="modifying-text">
                <span className="font-weight-normal text-gray-secondary">
                  Reach.
                </span>{" "}
                <span className="flag-color-red">Revenue.</span> <br />
                <span className="flag-color-orange">Reliability.</span>
                <span className="font-weight-normal text-gray-secondary">
                  For Every
                </span>{" "}
                <br />
                <span className="flag-color-green">Property</span>{" "}
                <span className="font-weight-normal text-gray-secondary">
                  Owner.
                </span>
              </h1>
              <p className="m-0 mt-1 font-size-4 text-gray-secondary text-center revenu-txt">
                List your Serviced Apartments LK effortlessly and grow your
                revenue with secure,
                <br /> seamless, and efficient booking solutions.
              </p>
              <span className="d-flex align-items-center justify-content-between mt-4 bullet-content">
                <p className="d-flex align-items-center justify-content-center m-0 font-size-4 flag-color-orange smallPaddingForBulletText">
                  &nbsp;<span className="bullet-tip">&#x2022;</span>
                  &nbsp;Hassle-Free Property Listing
                </p>

                <p className="d-flex align-items-center justify-content-center m-0 font-size-4 flag-color-red smallPaddingForBulletText">
                  &nbsp;<span className="bullet-tip flag-color-red">&#x2022;</span>
                  &nbsp;Real-Time Booking Management
                </p>

                <p className="d-flex align-items-center justify-content-center m-0 font-size-4 flag-color-green smallPaddingForBulletText">
                  &nbsp;<span className="bullet-tip flag-color-green">&#x2022;</span>
                  &nbsp;24/7 Round-the-Clock Support for You
                </p>
              </span>
            </div>
            <div className="w-100 perahara-pattern"></div>
          </div>

          {/* 4th Page */}
          <div className="d-flex flex-column align-items-center justify-content-center w-100 fourthPage">
            <div className="d-flex flex-column align-items-center justify-content-center p-lg-0 container-fluid fourthPage_inner">
              <span className="d-flex w-100">
                <h1 className="fourth_topic">
                  List with <b>Confidence</b> <br />
                  and <b>Convenience</b>
                </h1>
              </span>
              <div className="d-flex flex-wrap justify-content-between mt-4 down-section">
                {features.map((feature, idx) => (
                  <FeatureBlock key={idx} title={feature.title} description={feature.description} />
                ))}
              </div>
            </div>
          </div>

          {/* 5th Page */}
          {!checkAuthUserIsAdmin() && (
            <div className="d-flex flex-column align-items-center justify-content-center w-100 five-thPage">
              <div className="five-thPage-Inner container-fluid">
                <span className="top-bar-topic d-flex align-items-center justify-content-between w-100">
                  <h2 className="card-top-topic text-gray-secondary text-uppercase view-Lap">
                    Choose the <b className="secondary-color">Perfect Plan</b> for
                    Your
                    <br />
                    Property Management Needs
                  </h2>
                  <h2 className="card-top-topic text-gray-secondary text-uppercase viewOnlyMobile">
                    Choose the <b className="secondary-color">Perfect Plan</b> for
                    Your Property Management Needs
                  </h2>
                  <p
                    className="font-size-4 text-gray card-page-sub-dec"
                    style={{ width: "36%" }}
                  >
                    Effortlessly list your property with our intuitive tools,
                    streamlining the process to attract guests quickly and
                    effectively.
                  </p>
                </span>
                {/* cards */}

                <div className="d-flex justify-content-xl-between align-items-start justify-content-center row card-container-animation">
                  {planDetails&&planDetails.length > 0 && planDetails.map((plan: any, index: number) => {
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
                          if (checkAuthenticationViaAuthUser()) {
                            if (plan?.name === PlansEnum.STARTER) {
                              Cookies.set(constants.PLAN_ID, plan?.id);
                              // const isUserLogin = Cookies.get(constants.AUTH_USER_HOST);
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
                              handleOpenInquiryModal(plan);
                            }
                          } else {
                            history("/login");
                          }
                        }}
                      />
                    );

                  })}
                </div>
              </div>
            </div>
          )}

          {/*6 th page */}
          <div className="d-flex flex-column align-items-center justify-content-center w-100 sixThPage">
            <div className="text-loop">
              <h1 className="iterableText">
                <span className="text-gray-secondary">Reach.</span>{" "}
                <span className="flag-color-red">Revenue.</span>{" "}
                <span className="flag-color-orange">Reliability.</span>{" "}
                <span className="text-gray-secondary">For Every</span>{" "}
                <span className="flag-color-green">Property</span>{" "}
                <span className="secondary-color">Owner.</span>
              </h1>
            </div>
          </div>


          <div
            className="d-flex flex-column align-items-center justify-content-center pb-6 w-100 container-fluid"
            style={{ background: '#F8F8F8', padding: '80px 0' }}
          >
            <div className="d-flex flex-column align-items-center align-items-md-start justify-content-center w-100 mobile-app-wrapper">

              {/* Image Section */}
              <div
                className="position-relative d-flex justify-content-md-start justify-content-start mb-4 mb-md-0"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                <div
                  className="w-100"
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                  }}
                >
                  <div
                    className="position-relative"
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      margin: '0 auto',
                    }}
                  >
                    <img src={mobileBack} alt="Mobile back" className="mb-10 img-fluid"
                      style={{ width: '310px', height: 'auto' }}
                    />
                    <img
                      src={mobileFront}
                      alt="Mobile front"
                      className="position-absolute img-fluid mobile-image-front"
                      style={{ top: -50, left: 100 }}
                    />
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div
                className="px-3 text-md-start text-center"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                <div
                  className="mx-auto"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                  }}
                >
                  <span className="topic-content-seventh">
                    <h2 className="card-top-topic pt-5 pt-md-0 text-gray-secondary text-uppercase">
                      <strong className="secondary-color">Everything</strong> You Need to <br />
                      Host — <strong className="primary-color">Now on Mobile</strong>
                    </h2>
                    <p className="mb-5 font-size-4 text-gray" style={{ maxWidth: '80ch', margin: '0' }}>
                      With the Serviced Apartments™ Host App, you get complete control over your property listings — right from the palm of your hand...
                    </p>
                  </span>

                  <div
                    className="d-flex flex-wrap justify-content-md-start justify-content-center mt-4 down-section"
                    style={{ gap: '1.5rem' }}
                  >
                    {hostFeatures.map((feature, idx) => (
                      <FeatureBlock key={idx} title={feature.title} description={feature.description} />
                    ))}
                  </div>


                  <p className="mb-5 font-size-4 text-gray" style={{ maxWidth: '80ch', margin: '0' }}>
                    Download now and manage your property with ease. Available on:
                  </p>

                  <div className="d-flex justify-content-md-start justify-content-center gap-3">
                    <a href="https://apps.apple.com/us/app/serviced-apartment-host/id6745584722" target="_blank"><img src={appStore} alt="App Store logo" className="img-fluid" /></a>
                    <a href="https://play.google.com/store/apps/details?id=com.servicedapartments.host&pli=1" target="_blank"><img src={googlePay} alt="Play store logo" className="img-fluid" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* 7th page */}
          <div className="d-flex flex-column align-items-center justify-content-center w-100 sevenPageMain container-fluid">
            <div className="seventhPageInner row">
              <div className="left-section col-lg-6">
                <span className="topic-content-seventh">
                  <h2 className="card-top-topic text-gray-secondary text-uppercase">
                    Everything You {" "}
                    <strong className="secondary-color">Need to Know</strong>
                  </h2>
                  <p className="mb-5 font-size-4 text-gray">
                    Effortlessly list your property with our intuitive tools,
                    streamlining <br /> the process to go.
                  </p>
                </span>
                <div>
                  {FAQ_FOR_HOSTS.map((faq, index) => (
                    <span key={index} className="click-container">
                      <span
                        className="specialArea"
                        onClick={() =>
                          setOpenFAQIndex(openFAQIndex === index ? null : index)
                        }
                      >
                        <h6 className=""> + {faq.question}</h6>
                      </span>
                      <p
                        className={`hidden-content mx-3 font-size-5 secondary-color ${openFAQIndex === index ? "show" : ""
                          }`}
                      >
                        {parse(faq.answer)}
                      </p>
                    </span>
                  ))}
                </div>
              </div>
              {/*    <div className="col-lg-1"></div> */}
              <div className="right-section text-end home-inner-container col-lg-6">
                <img className="home-inner-last" src={lastImg} alt="home" />
              </div>
            </div>
          </div>
          {/* 8th Page */}
        </main>
        {/* <Footer /> */}
      </MainLayout>
    </div>
  );
};

export default Dashboard;
