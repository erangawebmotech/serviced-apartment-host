import "../styles/footer/footer.scss";
import "../styles/commonStyles.scss";
import fb from "../assets/images/socialIcons/facebook.png";
import instagram from "../assets/images/socialIcons/instagram.png";
import linkdin from "../assets/images/socialIcons/linkedin.png";
import youtube from "../assets/images/socialIcons/youtube.png";
import tiktok from "../assets/images/socialIcons/tiktok.png";
import lightLogo from "../assets/images/logo/Logo Blue background 3.png";
import { useNavigate } from "react-router-dom";
import { Cookies } from "typescript-cookie";
import * as constants from "../common/constants.ts";
import {
  checkAuthenticationViaAccessToken,
  checkAuthUserIsAdmin,
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../common/commonFunctions.tsx";
import { useEffect, useState } from "react";
import { checkPlan, getAllPlanDetails } from "../service/propertyDetailsService.ts";
import { useDispatch } from "react-redux";
import { verifyUserToken } from "../service/auth.ts";
import { CONTACT_DETAILS } from "../common/data/contactDetails.ts";
import { Col, Row } from "antd";
import { PlansEnum } from "../common/enums/plansEnum.ts";

const Footer = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isExistStaterPlan, setIsExistStaterPlan] = useState<boolean>(false);
  const [planDetails, setPlanDetails] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);


  useEffect(() => {
    loadAllPlanDetails()
  }, [])

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

  const CheckUserToken = () => {
    popUploader(dispatch, true);
    verifyUserToken()
      .then((resp) => {
        checkSelectedPlan()
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        let url = window.location.href;
        const parsedUrl = new URL(url);
        const isLocalhost = parsedUrl.hostname === "localhost";

        Cookies.remove(constants.PROPERTY_ID);
        Cookies.remove(constants.PLAN_ID);
        Cookies.remove(constants.ROOM_ID);
        Cookies.remove(constants.LOCATION_OBJECT);

        Cookies.remove(constants.ACCESS_TOKEN_HOST, {
          domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
          path: "/",
        });

        Cookies.remove(constants.REFRESH_TOKEN_HOST, {
          domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
          path: "/",
        });

        Cookies.remove(constants.AUTH_USER_HOST, {
          domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
          path: "/",
        });
        history("/login");
      });
  };


  const checkSelectedPlan = () => {
    popUploader(dispatch, true);
    checkPlan()
      .then((resp) => {
        setIsExistStaterPlan(resp?.data?.starterListingExists)
        handleStartListingClick(resp?.data?.starterListingExists)
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  }

  const handleStartListingClick = (isExistStaterPlan: boolean) => {
    // console.log(!checkAuthenticationViaAccessToken());

    if (!checkAuthenticationViaAccessToken()) {
      history("/login");
    } else {
      const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
      // console.log("propertyId :", propertyId);

      if (propertyId) {
        history("/draft-listing", {
          state: { fromLocation: "NavBarBtn" },
        });
      } else {
        if (checkAuthUserIsAdmin()) {
          history("/admin-property-listings");
        } else {
          if (isExistStaterPlan) {
            history("/start");
            const starterPlan = planDetails.find(plan => plan.name === PlansEnum.STARTER);
            const starterPlanId = starterPlan ? starterPlan.id : null;
            Cookies.set(constants.PLAN_ID, starterPlanId);
          } else {
            history("/plan-selection");
          }
        }
      }
    }
  };

  return (
    <>
      <footer className="footerMain">
        <div className="align-items-center footer-inner container-fluid">
          <div className="d-flex align-items-center justify-content-center up-section">
            <h2 className="font-size-1 text-white text-center">
              Experience Comfort <br /> in Every Stay
            </h2>
            <span className="d-flex flex-row mt-4">
              {" "}
              <a href={import.meta.env.VITE_GUST_URL} target="_blank">
                {" "}
                <button className="text-uppercase commonBtn find-btn">
                  Find Your Stay
                </button>
              </a>
              <a onClick={CheckUserToken}>
                {" "}
                <button className="text-uppercase commonBtn">
                  Start Listing
                </button>
              </a>
            </span>
          </div>

          {/* up section */}
          <div className="d-flex justify-content-md-between justify-content-center mt-5 w-100 row down-section-footer-last">
            <div className="col-lg-6 col-md-12 col-sm-12 footer-item">
              <ul>
                <li className="text-uppercase first-li">Navigation</li>
                <li
                  onClick={() => {
                    history("/");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth", // or "auto"
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Home{" "}
                </li>
                <li style={{ cursor: "pointer" }}><a
                  href="/about-us"
                  rel="noopener noreferrer"
                  className="text-white"
                  style={{
                    textDecoration: "none",
                  }}
                >About Us</a></li>
                {/* <li
                  onClick={() => {
                    history("/coming-soon");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  What We Do{" "}
                </li> */}
                {/* <li
                  onClick={() => {
                    history("/coming-soon");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  To The Power of 10
                </li> */}
                {/* <li
                  onClick={() => {
                    history("/coming-soon");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Donate
                </li> */}
              </ul>
            </div>

            <div className="col-lg-6 col-md-12 col-sm-12 footer-item">
              <ul>
                <li className="text-uppercase first-li">LEGAL</li>
                {/* <li>General Info</li> */}
                <li style={{ cursor: "pointer" }}><a
                  href="/privacy-policy"
                  rel="noopener noreferrer"
                  className="text-white"
                  style={{
                    textDecoration: "none",
                  }}
                >Privacy Policy</a></li>
                <li style={{ cursor: "pointer" }}> <a
                  href="/terms-and-conditions"
                  rel="noopener noreferrer"
                  className="text-white"
                  style={{
                    textDecoration: "none",
                  }}
                >Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 footer-item">
              <ul>
                <li className="text-uppercase first-li">TALK TO US</li>
                <li> <a
                  href={`mailto:${CONTACT_DETAILS?.email}`}
                  className="text-white"
                  style={{ cursor: "pointer" }}
                >{CONTACT_DETAILS.email}</a></li>
                <li> <a
                  href={`tel:${CONTACT_DETAILS?.contactNo}`}
                  className="text-white"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >{CONTACT_DETAILS.contactNo}</a></li>
                {/* <li>Contact Us</li> */}
                {/* <li>
                  <a
                    href="https://www.facebook.com/ServicedApartmentsLK/"
                    target="_blank"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  {" "}
                  <a
                    href="https://www.linkedin.com/company/seyka-holdings/"
                    target="_blank"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Linkedin
                  </a>
                </li>
                <li>
                  {" "}
                  <a
                    href="https://www.instagram.com/servicedapartments.lk"
                    target="_blank"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Instagram
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
          <Row className="w-100 footer-down-section mt-5">
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className="logo_blur-container d-flex justify-content-center justify-content-lg-start align-items-center">
              <img width={140} src={lightLogo} alt="logo" className="my-2 my-lg-0" onClick={() => {
                history("/");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // or "auto"
                });
              }} /></Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className="d-flex justify-content-center text-center">
              <p className="all-right-reserved mt-2 mb-2">
                {new Date().getFullYear()} © Serviced Apartments LK. All rights
                Reserved
              </p></Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className="d-flex justify-content-center justify-content-lg-end align-items-center my-2 my-lg-0">

              <a
                href="https://www.facebook.com/ServicedApartmentsLK/"
                target="_blank"
              >
                <img width={23} src={fb} alt="facebook" className="me-4" />
              </a>
              <a
                href="https://www.instagram.com/servicedapartments.lk"
                target="_blank"
              >
                <img width={23} src={instagram} alt="instagram" className="me-4" />
              </a>
              <a
                href="https://www.youtube.com/@SeykaHoldings"
                target="_blank"
              >
                <img width={23} src={youtube} alt="youtube" className="me-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/seyka-holdings/"
                target="_blank"
              >
                <img width={23} src={linkdin} alt="linkdin" className="me-4" />
              </a>
              <a
                href="https://www.tiktok.com/@servicedapartmentslk"
                target="_blank"
              >
                <img width={23} src={tiktok} alt="tiktok" className="me-4" />
              </a>
            </Col>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default Footer;
