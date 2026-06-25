import { useEffect, useState } from "react";
import "../styles/NavBar/navBarStyles.scss";
import logoImg from "../assets/images/logo/Logo.png";
import hamberg from "../assets/images/menu_29dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import close from "../assets/images/close_29dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import { json, useLocation, useNavigate } from "react-router-dom";
import * as constants from "../common/constants.ts";
import { Cookies } from "typescript-cookie";
import {
  checkAuthenticationViaAccessToken,
  checkAuthenticationViaAuthUser,
  checkAuthUserIsAdmin,
  formatNamesCmnFun,
  getDecryptedCookie,
  handleError,
  logOut,
  popUploader,
} from "../common/commonFunctions.tsx";
import { Avatar, Badge, Button, Popover } from "antd";
import userIcon from "../assets/images/icon/solar_user-bold.png";

import {
  CreditCardOutlined,
  StarOutlined,
  UserOutlined,
  SwapOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { User } from "react-feather";
import { verifyUserToken } from "../service/auth.ts";
import { authUserDetailObj, authUserDetailObjTwo } from "../common/interfaces/uiNecessaryInterface.ts";
import { useDispatch, useSelector } from "react-redux";
import { checkPlan, getAllPlanDetails } from "../service/propertyDetailsService.ts";
import { RootState } from "../slices/rootReducer.ts";
import { PlansEnum } from "../common/enums/plansEnum.ts";

interface Props {
  pageName?: string;
}

const NavBar = ({ pageName }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<string>("");
  const [loggedUserObj, setLoggedUserObj] = useState<authUserDetailObjTwo>();
  const [isExistStaterPlan, setIsExistStaterPlan] = useState<boolean>(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState<boolean>();
  const [planDetails, setPlanDetails] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const selectIsProfile = (state: RootState) => state.profileUpdate.isUpdate;

  const isProfileUpdate = useSelector(selectIsProfile);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    CheckUserToken();
    loadAllPlanDetails();
    dispatch({
      type: "IS_PROFILE_UPDATE",
      value: { isUpdate: false, type: 0 },
    });
  }, [isProfileUpdate]);

  useEffect(() => {
    CheckUserToken();
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

  const CheckUserToken = () => {
    popUploader(dispatch, true);
    verifyUserToken()
      .then((resp) => {
        setIsProfileIncomplete(resp?.data?.isProfileCompleted)
        setLoggedUserObj(resp?.data?.user);
        setLoggedUser(
          `${resp?.data?.user?.firstName ?? ""} ${resp?.data?.user?.lastName ?? ""}`.trim()
        );
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        let url = window.location.href;
        const parsedUrl = new URL(url);
        const isLocalhost = parsedUrl.hostname === "localhost";

        // Cookies.remove(constants.ACCESS_TOKEN_HOST);
        // Cookies.remove(constants.REFRESH_TOKEN_HOST);
        Cookies.remove(constants.PROPERTY_ID);
        Cookies.remove(constants.PLAN_ID);
        Cookies.remove(constants.ROOM_ID);
        Cookies.remove(constants.LOCATION_OBJECT);
        // Cookies.remove(constants.Expire_time);

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
      navigate("/login");
    } else {
      const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
      // console.log("propertyId :", propertyId);

      if (propertyId) {
        navigate("/draft-listing", {
          state: { fromLocation: "NavBarBtn" },
        });
      } else {
        if (checkAuthUserIsAdmin()) {
          navigate("/admin-property-listings");
        } else {
          if (isExistStaterPlan) {
            navigate("/start");
            const starterPlan = planDetails.find(plan => plan.name === PlansEnum.STARTER);
            const starterPlanId = starterPlan ? starterPlan.id : null;
            Cookies.set(constants.PLAN_ID, starterPlanId);
          } else {
            navigate("/plan-selection");
          }
        }
      }
    }
  };

  const handleListedProperties = () => {
    if (checkAuthenticationViaAccessToken()) {
      // navigate("/listed-properties");
      window.location.href = "/listed-properties";
    } else {
      navigate("/login");
    }
  };

  const content = (
    <div>
      {/* <p className="mx-2 cursor-setUp hover-effect">
        <CreditCardOutlined style={{ marginRight: "8px" }} />
        Payments
      </p>
      <p className="mx-2 cursor-setUp hover-effect">
        <StarOutlined style={{ marginRight: "8px" }} />
        Review Management
      </p>
      <p className="mx-2 cursor-setUp hover-effect">
        <UserOutlined style={{ marginRight: "8px" }} />
        Profile
      </p> */}{" "}

      {checkAuthUserIsAdmin() ?
        <p
          className="d-flex flex-column mx-2 cursor-setUp m-0 mb-3"
          style={{ cursor: "pointer" }}
        >
          <small className="text-gray">Welcome !</small>
          {formatNamesCmnFun(loggedUser)}
        </p>

        : <p
          className={`d-flex flex-column mx-2 cursor-setUp m-0 ${!isProfileIncomplete ? "mb-0" : "mb-3"}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/profile");
          }}
        >
          <small className="text-gray">Welcome !</small>
          {formatNamesCmnFun(loggedUser)}
        </p>}
      {
        !checkAuthUserIsAdmin() && !isProfileIncomplete && <p
          className="mx-2 rounded-4 m-0 mb-3" style={{ width: "max-content", color: "orange" }}
        >
          <small >Incomplete Profile </small>
        </p>
      }
      {
        checkAuthUserIsAdmin() ? (
          <p className="mx-2 cursor-setUp hover-effect">
            <a
              href={import.meta.env.VITE_ADMIN_URL}
              target="_blank"
              style={{ textDecoration: "none", color: "black" }}
            >
              <SwapOutlined style={{ marginRight: "8px" }} />
              Switch to Admin Panel
            </a>
          </p>
        ) : (
          <p className="mx-2 cursor-setUp hover-effect">
            <a
              href={import.meta.env.VITE_GUST_URL}
              target="_blank"
              style={{ textDecoration: "none", color: "black" }}
            >
              <SwapOutlined style={{ marginRight: "8px" }} />
              Switch to Guest
            </a>
          </p>
        )
      }
      <p
        style={{ color: "#EF5A60" }}
        className="mx-2 mb-1 cursor-setUp hover-effect"
        onClick={() => logOut()}
      >
        <LogoutOutlined style={{ marginRight: "8px" }} />
        Log Out
      </p>
    </div >
  );

  return (
    <nav
      style={{
        backgroundColor:
          pageName === "filterArea"
            ? "#F2F2F2"
            : pageName === "whitePage"
              ? "#ffffff"
              : "#E2EEF8",
      }}
      className="d-flex align-items-center justify-content-center w-100 containerPadding"
    >
      <div className="containerPadding_inner">
        <div>
          <img
            style={{ cursor: "pointer" }}
            width="auto"
            height={40}
            onClick={() => navigate("/")}
            src={logoImg}
            alt="logo"
          />
        </div>
        <div className="d-flex align-items-center desktop-nav">
          {checkAuthenticationViaAuthUser() ? (
            <ul className="list-inline nav_itemList">
              {!checkAuthUserIsAdmin() && <li
                className={`list-inline-item ${location.pathname === "/dashboard" ? "active" : ""
                  }`}
                onClick={() => {
                  navigate("/dashboard")
                }}
              >
                Dashboard
              </li>}
              {!checkAuthUserIsAdmin() && (
                <li
                  className={`list-inline-item ${location.pathname === "/earnings-manage" ? "active" : ""
                    }`}
                  onClick={() => {
                    navigate("/earnings-manage", {
                      state: { propertyId: undefined },
                    });
                  }}
                >
                  Earnings
                </li>
              )}
              {!checkAuthUserIsAdmin() && (
                <li
                  className={`list-inline-item ${location.pathname === "/reservation-manage" ? "active" : ""
                    }`}
                  onClick={() => {
                    navigate("/reservation-manage", {
                      state: { propertyId: undefined },
                    });
                  }}
                >
                  Reservations
                </li>
              )}
              <li
                className={`list-inline-item ${location.pathname === "/calendar" ? "active" : ""
                  }`}
                onClick={() => {
                  navigate("/calendar", {
                    state: { propertyId: undefined },
                  });
                }}
              >
                Calender
              </li>
              {/* <li className="list-inline-item">Messages</li> */}
              <li
                className={`list-inline-item ${location.pathname === "/listed-properties" ? "active" : ""
                  }`}
                onClick={handleListedProperties}
              >
                Listed Properties
              </li>
            </ul>
          ) : (
            ""
          )}

          {checkAuthenticationViaAuthUser() ? (
            <Button
              className="start_Listing_button"
              type="primary"
              onClick={checkSelectedPlan}
            >
              List Your Property
            </Button>
          ) : (
            ""
          )}

          {!checkAuthenticationViaAuthUser() ? (
            <div>
              <button
                style={{
                  backgroundColor: "#ef5a60",
                  color: "white",
                  padding: "10px",
                }}
                className="mx-2 px-4 start_Listing_button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                style={{
                  backgroundColor: "#ef5a60",
                  color: "white",
                  padding: "10px",
                }}
                className="mx-2 px-3 start_Listing_button"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Signup
              </button>
            </div>
          ) : (
            // <Popover placement="bottomRight" trigger="click" content={content}>
            //   <Button className="text-white user-icon-area " style={{ border: isProfileIncomplete ? "none" : "4px solid green" }}>
            //     {/* <img src={userIcon} alt="user-icon" /> */}
            //     {loggedUser.charAt(0).toUpperCase()}
            //   </Button>
            // </Popover>
            <Popover placement="bottomRight" trigger="click" content={content}>
              {!checkAuthUserIsAdmin() && !isProfileIncomplete ? (
                <div
                  className="d-flex justify-content-center align-items-center ms-2"
                  style={{
                    padding: "4px",
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #FFEB3B, #FF7F50)",
                    display: "inline-block",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <Button
                    className="text-white user-icon-area"
                    style={{
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      padding: 0,
                    }}
                  >
                    {!loggedUserObj ? loggedUser.charAt(0).toUpperCase() : loggedUserObj?.file ? <img src={loggedUserObj?.file?.smallPath} alt="user-icon" height={40} width={40} className="rounded-5" />
                      : loggedUser.charAt(0).toUpperCase()}


                  </Button>
                </div>
              ) : (
                <Button
                  className="text-white user-icon-area ms-2"
                  style={{
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    padding: 0,
                  }}
                >

                  {!loggedUserObj ? loggedUser.charAt(0).toUpperCase() : loggedUserObj?.file ? <img src={loggedUserObj?.file?.smallPath} alt="user-icon" height={40} width={40} className="rounded-5" />
                    : loggedUser.charAt(0).toUpperCase()}
                </Button>
              )}
            </Popover>

          )}

        </div>
      </div>

      {isSidebarOpen === false ? (
        <button className="menu-toggle-btn" onClick={handleSidebarToggle}>
          <img width={30} src={hamberg} alt="hamberger" />
        </button>
      ) : (
        <button className="menu-toggle-btn" onClick={handleSidebarToggle}>
          <img width={30} src={close} alt="close" />
        </button>
      )}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          {checkAuthenticationViaAuthUser() ? (
            <div className="d-flex flex-column ">
              {!checkAuthUserIsAdmin() && <li
                onClick={() => { navigate("/dashboard") }}
                className={`list-inline-item ${location.pathname === "/dashboard" ? "active" : ""
                  }`}
              >
                Dashboard
              </li>}
              {!checkAuthUserIsAdmin() && <li
                className={`list-inline-item ${location.pathname === "/earnings-manage" ? "active" : ""
                  }`}
                onClick={() => {
                  navigate("/earnings-manage", {
                    state: { propertyId: undefined },
                  });
                }}
              >
                Earnings
              </li>}
              {!checkAuthUserIsAdmin() && <li
                className={`list-inline-item ${location.pathname === "/reservation-manage" ? "active" : ""
                  }`}
                onClick={() => {
                  navigate("/reservation-manage", {
                    state: { propertyId: undefined },
                  });
                }}
              >
                Reservations
              </li>}
              <li
                onClick={() => {
                  navigate("/calendar", {
                    state: { propertyId: undefined },
                  });
                }}
                className={`list-inline-item ${location.pathname === "/calendar" ? "active" : ""
                  }`}
              >
                Calender
              </li>
              {/* <li>Messages</li> */}
              <li
                onClick={handleListedProperties}
                className={`list-inline-item ${location.pathname === "/listed-properties" ? "active" : ""
                  }`}
              >
                Listed Properties
              </li>
              <li>
                <Button
                  className="start_Listing_button"
                  type="primary"
                  onClick={checkSelectedPlan}
                >
                  List Your Property
                </Button>
              </li>
            </div>
          ) : (
            ""
          )}
          <li>
            {!checkAuthenticationViaAuthUser() ? (
              <div className="">
                <button
                  style={{
                    backgroundColor: "#ef5a60",
                    color: "white",
                    padding: "10px",
                  }}
                  className="mx-2 px-4 login-extra start_Listing_button"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
                <button
                  style={{
                    backgroundColor: "#ef5a60",
                    color: "white",
                    padding: "10px",
                  }}
                  className="mx-2 px-3 start_Listing_button"
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Signup
                </button>
              </div>
            ) : (
              <Popover
                placement="bottomRight"
                trigger="click"
                content={content}
              >
                {/* <Button className="user-icon-area">
                  <img src={userIcon} alt="user-icon" />
                </Button> */}

                {!checkAuthUserIsAdmin() && !isProfileIncomplete ? (
                  <div
                    className="d-flex justify-content-center align-items-center ms-2"
                    style={{
                      padding: "4px",
                      borderRadius: "50%",
                      background: "linear-gradient(45deg, #FFEB3B, #FF7F50)",
                      display: "inline-block",
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <Button
                      className="text-white user-icon-area"
                      style={{
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: 0,
                      }}
                    >
                      {!loggedUserObj ? loggedUser.charAt(0).toUpperCase() : loggedUserObj?.file ? <img src={loggedUserObj?.file?.smallPath} alt="user-icon" height={40} width={40} className="rounded-5" />
                        : loggedUser.charAt(0).toUpperCase()}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="text-white user-icon-area ms-2"
                    style={{
                      border: "none",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      padding: 0,
                    }}
                  >
                    {!loggedUserObj ? loggedUser.charAt(0).toUpperCase() : loggedUserObj?.file ? <img src={loggedUserObj?.file?.smallPath} alt="user-icon" height={40} width={40} className="rounded-5" />
                      : loggedUser.charAt(0).toUpperCase()}
                  </Button>
                )}
              </Popover>

            )}
          </li>
        </ul>
      </aside>
    </nav>
  );
};
export default NavBar;
