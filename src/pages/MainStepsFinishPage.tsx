import { Button, Col, message, Progress, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/propertyListingStyles.scss";
import stepDoneIcon from "../assets/images/steps/stepDone.png";
import bathroomIcon from "../assets/images/steps/bathroom1.svg";
import finalStepIcon from "../assets/images/steps/finalStep.png";
import roomStepIcon from "../assets/images/steps/roomStep.png";
import simplifyRoomIcon from "../assets/images/steps/roomSummery/rooms.png";
import simplifyBedIcon from "../assets/images/steps/roomSummery/beds.png";
import simplifyAttachBathroomIcon from "../assets/images/steps/roomSummery/attached-bathroom.png";
import simplifySharedBathroomIcon from "../assets/images/steps/roomSummery/shared-bathroom.png";
import propertyDetailsStepIcon from "../assets/images/steps/propertyDetailsStep.png";
import entirePropertyStepIcon from "../assets/images/steps/entirePropertyStep.png";
import photoStepIcon from "../assets/images/steps/photoStep..png";
import ColorAnimationComponent from "../components/common/ColorAnimationComponent";
import RoomFormRepeater from "../components/common/formRepeater/RoomFormRepeater";
import {
  customSweetAlert,
  customToastMsg,
  formatNamesCmnFun,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  removeCookie,
  setEncryptedCookie,
} from "../common/commonFunctions.tsx";
import * as constants from "../common/constants.ts";
import { Cookies } from "typescript-cookie";
import {
  deleteDraftProperty,
  getPropertyById,
  inactiveProperty,
} from "../service/propertyListingService.ts";
import { useDispatch } from "react-redux";
import { deleteUnitDetailById } from "../service/propertyDetailsService.ts";
import { PropertyListingDetailDTO } from "../common/dto/PropertyListingDetailDTO.ts";
import { ListingStepsEnum } from "../common/enums/listingStepsEnum.ts";
import { MainStepsCompleteTypeEnum } from "../common/enums/mainStepsCompleteTypeEnum.ts";
import { PropertyTypesEnum } from "../common/enums/propertyTypesEnum.ts";
import { CurrencyEnum } from "../common/enums/currencyEnum.ts";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { PropertyStatusEnum } from "../common/enums/propertyStatusEnum.ts";

const MainStepsFinishPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [unitDetails, setUnitDetails] = useState<any>([]);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>({});
  const [lastCompletedStep, setLastCompletedStep] = useState(0);
  const [completePercentage, setCompletePercentage] = useState(0);


  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    getPropertyIdFromCookies();
  }, []);

  const getPropertyIdFromCookies = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    setPropertyId(propertyId ? propertyId : 0);
    loadPropertyDetailsPropertyId();
  };

  const deleteUnitDetails = (id: number) => {
    popUploader(dispatch, true);
    deleteUnitDetailById(id)
      .then((res) => {
        message.success("Unit details delete successfully!");
        popUploader(dispatch, false);
        loadPropertyDetailsPropertyId();
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          // const result = findUnitById(dataObj.unitDetails, parseInt(unitId || "0"));

          setPropertyDetailsObject(dataObj);
          if (dataObj.unitDetails) {
            // console.log(dataObj.unitDetails);
            setUnitDetails(dataObj.unitDetails);
          }
          Cookies.set(constants.PLAN_ID, dataObj?.plan?.id);

          // const message = getStepMessage(dataObj, dataObj.unitDetails || []);
          // setStepMessage(message);

          popUploader(dispatch, false);

        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  // console.log(unitDetails.length);

  const handleDeleteListedProperty = () => {
    customSweetAlert("Are you sure to delete this created property?", 4, () => {
      popUploader(dispatch, true);
      deleteDraftProperty(propertyId)
        .then((res) => {
          customToastMsg("Property delete successfully!", 1);
          removeCookie(constants.PROPERTY_ID);
          Cookies.remove(constants.PLAN_ID);
          Cookies.remove(constants.ROOM_ID);
          history(`/listed-properties`);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    });
  };

  const handleUnpublishListedProperty = (
    propertyId: number,
    status: string
  ) => {
    customSweetAlert("Are you sure to unpublish this property?", 4, () => {
      popUploader(dispatch, true);
      const payload = {
        status: status,
      };
      inactiveProperty(propertyId, payload)
        .then((res) => {
          customToastMsg("Property unpublish successfully!", 1);
          loadPropertyDetailsPropertyId();
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    });
  };

  useEffect(() => {
    if (!propertyDetailsObject) return;

    const isStep1Complete =
      propertyDetailsObject.checkIn && propertyDetailsObject.checkOut;
    const isStep2Complete =
      unitDetails.length > 0;
    const isStep3Complete =
      propertyDetailsObject.propertyImages &&
      propertyDetailsObject.propertyImages.length > 0;
    const isStep4Complete =
      propertyDetailsObject.invoiceHeadingType != null &&
      (propertyDetailsObject.lastSubStep === "INVOICE_HEADING_TYPE" ||
        propertyDetailsObject.lastSubStep === "FINAL_STEP");
    const isStep5Complete =
      propertyDetailsObject.status === PropertyStatusEnum.PUBLISHED
    let step = 0;
    if (isStep1Complete) step = 1;
    if (step === 1 && isStep2Complete) step = 2;
    if (step === 2 && isStep3Complete) step = 3;
    if (step === 3 && isStep4Complete) step = 4;

    setLastCompletedStep(step);

    const stepsCompletedArray = [
      isStep1Complete,
      isStep2Complete,
      isStep3Complete,
      isStep4Complete,
      isStep5Complete,
    ];

    // Count how many steps are true (completed)
    const completedStepsCount = stepsCompletedArray.filter(Boolean).length;
    const totalSteps = stepsCompletedArray.length;
    const completionPercentage = (completedStepsCount / totalSteps) * 100;
    // console.log("Completion percentage:", completionPercentage);

    setCompletePercentage(completionPercentage);
  }, [propertyDetailsObject, unitDetails]);

  return (
    <div
      className="MainStepsFinishPageContainer d-flex"
      style={{ minHeight: "100vh" }}
    >
      <ColorAnimationComponent layoutHeight="100%" />
      <Row className="d-flex align-items-center justify-content-center py-5 m-0 w-100">
        <Col
          xs={18}
          sm={18}
          md={18}
          lg={18}
          xl={15}
          xxl={12}
          className="w-100 my-3 m-0"
        >
          {/* {propertyDetailsObject?.invoiceHeadingType != null &&
            (propertyDetailsObject?.lastSubStep ===
              ListingStepsEnum.INVOICE_HEADING_TYPE ||
              propertyDetailsObject.lastSubStep ===
              ListingStepsEnum.FINAL_STEP) ? (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">All done!</h1>
              <p className="font-size-3 font-weight-medium">
                Preview and publish your property to start receiving bookings.
              </p>
            </div>
          ) : propertyDetailsObject?.propertyImages &&
            propertyDetailsObject?.propertyImages.length > 0 ? (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">Great job!</h1>
              <p className="font-size-3 font-weight-medium">
                Your property listing is nearly ready to go live and start
                attracting potential buyers!
              </p>
            </div>
          ) : unitDetails.length > 0 &&
            unitDetails[0].unitBathrooms.length > 0 ? (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">Great progress!</h1>
              <p className="font-size-3 font-weight-medium">
                Time to upload images that showcase your property.
              </p>
            </div>
          ) : // : propertyDetailsObject?.priceForEntireProperty &&
            //   propertyDetailsObject?.priceForEntireProperty > 0 ? (
            //   <div className="text-center">
            //     <h1 className="font-weight-medium font-size-1">Great job!</h1>
            //     <p className="font-size-3 font-weight-medium">
            //       You’re making great progress. On to the next exciting step!
            //     </p>
            //   </div>
            // )
            propertyDetailsObject?.checkIn && propertyDetailsObject?.checkOut ? (
              <div className="text-center">
                <h1 className="font-weight-medium font-size-1">Nice start!</h1>
                <p className="font-size-3 font-weight-medium">
                  Now, let’s add the rooms in your property.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="font-weight-medium font-size-1">
                  Start from the first step!
                </h1>
                <p className="font-size-3 font-weight-medium">
                  Complete the first step of listing your property.
                </p>
              </div>
            )} */}


          {lastCompletedStep === 4 && (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">All done!</h1>
              <p className="font-size-3 font-weight-medium">
                Preview and publish your property to start receiving bookings.
              </p>
            </div>
          )}

          {lastCompletedStep === 3 && (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">Great job!</h1>
              <p className="font-size-3 font-weight-medium">
                Your property listing is nearly ready to go live and start
                attracting potential buyers!
              </p>
            </div>
          )}

          {lastCompletedStep === 2 && (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">Great progress!</h1>
              <p className="font-size-3 font-weight-medium">
                Time to upload images that showcase your property.
              </p>
            </div>
          )}

          {lastCompletedStep === 1 && (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">Nice start!</h1>
              <p className="font-size-3 font-weight-medium">
                Now, let’s add the rooms in your property.
              </p>
            </div>
          )}

          {lastCompletedStep === 0 && (
            <div className="text-center">
              <h1 className="font-weight-medium font-size-1">
                Start from the first step!
              </h1>
              <p className="font-size-3 font-weight-medium">
                Complete the property overview details of your property.
              </p>
            </div>
          )}

          <div className="w-100">
            <Progress
              percent={completePercentage}
              percentPosition={{ align: 'end', type: 'inner' }}
              size={["100%", 15]}
              strokeColor="#ef5a60"
              className="mt-3"
            />
          </div>

          <div className="w-100 mt-5">
            <div className="mb-4 py-3 px-3 bg-white rounded-3">
              <Row className="d-flex justify-content-center text-center text-md-start">
                <Col
                  xs={8}
                  sm={8}
                  md={3}
                  lg={2}
                  xl={2}
                  xxl={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  {propertyDetailsObject?.checkIn &&
                    propertyDetailsObject?.checkOut ? (
                    <img
                      src={stepDoneIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  ) : (
                    <img
                      src={propertyDetailsStepIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  )}
                </Col>
                <Col
                  xs={20}
                  sm={20}
                  md={14}
                  lg={16}
                  xl={16}
                  xxl={16}
                  className="ps-0 ps-md-4 d-flex flex-column justify-content-center"
                >
                  <h2 className="font-size-4 font-weight-light p-0 my-1">
                    Step 01
                  </h2>
                  <h2 className="font-size-3 font-weight-bold p-0 m-0">
                    Property Overview
                  </h2>
                  <p className="font-size-4 font-weight-light my-1 p-0">
                    Provide essential information about your property premises
                  </p>
                  {Object.keys(propertyDetailsObject).length > 0 && (
                    <Row className="text-gray pt-3 rounded-3 w-100">
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        className={`
                         ${propertyDetailsObject?.priceForEntireProperty &&
                          propertyDetailsObject?.priceForEntireProperty > 0 &&
                          propertyDetailsObject?.monthlyRate &&
                          propertyDetailsObject?.monthlyRate > 0 &&
                          "border-end remove-border-md "
                          } pe-1 
                          `}
                      >
                        <h2 className="font-size-5 font-weight-medium p-0 my-1">
                          Code : {propertyDetailsObject?.code}
                        </h2>
                        <h2 className="font-size-5 font-weight-medium p-0 my-1">
                          {formatNamesCmnFun(
                            propertyDetailsObject?.name
                              ? propertyDetailsObject?.name +
                              " - "
                              : ""
                          ) +
                            propertyDetailsObject?.propertyType?.name}
                        </h2>

                        <h2 className="font-size-5 font-weight-medium p-0 my-1">
                          {" "}
                          {propertyDetailsObject?.address && propertyDetailsObject?.address +
                            ", " +
                            propertyDetailsObject?.city}
                        </h2>
                      </Col>
                      <Col xs={24} sm={24} md={12} className="ps-2">
                        {propertyDetailsObject?.priceForEntireProperty! > 0 && (
                          <h2 className="font-size-5 font-weight-medium p-0 my-1">
                            Daily Rate : {CurrencyEnum.USD}{" "}
                            {CurrencyEnum.USD + " " + (propertyDetailsObject?.priceForEntireProperty!).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </h2>
                        )}
                        {propertyDetailsObject?.monthlyRate! > 0 && (
                          <h2 className="font-size-5 font-weight-medium p-0 my-1">
                            Monthly Rate :{" "}
                            {CurrencyEnum.USD + " " + (propertyDetailsObject?.monthlyRate!).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </h2>
                        )}
                      </Col>
                    </Row>
                  )}
                </Col>

                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={6}
                  xl={6}
                  xxl={6}
                  className="d-flex justify-content-center justify-content-lg-end align-items-center"
                >
                  {propertyDetailsObject?.propertyType ? (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4  me-0 me-lg-3 rounded-3"
                      type="text"
                      style={{ color: "#ef5a60" }}
                      onClick={() => {
                        history(`/property/01`);
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4  me-0 me-lg-3 rounded-3"
                      type="primary"
                      onClick={() => {
                        history(`/start`);
                      }}
                    >
                      Add Details
                    </Button>
                  )}
                </Col>
              </Row>
            </div>

            <div className="mb-4 py-3 px-3 bg-white rounded-3 ">
              <Row className="d-flex justify-content-center text-center text-md-start">
                <Col
                  xs={8}
                  sm={8}
                  md={3}
                  lg={2}
                  xl={2}
                  xxl={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  {unitDetails.length > 0 ? (
                    <img
                      src={stepDoneIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  ) : (
                    <img
                      src={roomStepIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  )}
                </Col>
                <Col
                  xs={20}
                  sm={20}
                  md={14}
                  lg={16}
                  xl={16}
                  xxl={16}
                  className="ps-0 ps-md-4 d-flex flex-column justify-content-center"
                >
                  <h2 className="font-size-4 font-weight-light p-0 my-1">
                    Step 02
                  </h2>
                  <h2 className="font-size-3 font-weight-bold p-0 m-0">
                    Rooms
                  </h2>
                  <p className="font-size-4 font-weight-light my-1 p-0">
                    {/* {propertyDetailsObject?.allowEntireProperty &&
                    !propertyDetailsObject?.allowIndividualUnit
                      ? "Tell us about your rooms"
                      : "Tell us about your first room. Once you set one you can add more"} */}
                    Tell us about your rooms
                  </p>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={6}
                  xl={6}
                  xxl={6}
                  className="d-flex justify-content-center justify-content-lg-end align-items-center"
                >
                  {unitDetails.length === 0 && (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4  me-0 me-lg-3 rounded-3"
                      type="primary"
                      onClick={() => {
                        Cookies.remove(constants.ROOM_ID);
                        // console.log(Cookies.get(constants.ROOM_ID));
                        if (
                          propertyDetailsObject?.allowEntireProperty === null &&
                          propertyDetailsObject?.allowIndividualUnit === null
                        ) {
                          customToastMsg(
                            "Please fill property overview details first",
                            2
                          );
                        } else {
                          if (
                            propertyDetailsObject?.allowEntireProperty &&
                            !propertyDetailsObject?.allowIndividualUnit
                          ) {
                            history(`/unit/02/${propertyId}`);
                          } else if (
                            propertyDetailsObject?.allowIndividualUnit
                          ) {
                            history(`/unit/01/${propertyId}`);
                          }
                        }
                      }}
                    >
                      Add Rooms
                    </Button>
                  )}
                </Col>
              </Row>
              {unitDetails.length > 0 && (
                <div className="mb-4 py-3  rounded-3 ">
                  <Row className="d-flex justify-content-center text-center text-md-start">
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      xxl={24}
                      className="ps-0  d-flex flex-column justify-content-center"
                    >
                      {propertyDetailsObject?.allowIndividualUnit ? (
                        <RoomFormRepeater
                          bookingPlans={{
                            allowIndividualUnit:
                              propertyDetailsObject?.allowIndividualUnit,
                            allowEntireProperty:
                              propertyDetailsObject?.allowEntireProperty,
                          }}
                          unitDetails={unitDetails}
                          deleteUnitDetails={(id: number) => {
                            deleteUnitDetails(id);
                          }}
                        />
                      ) : (
                        <Row className="my-3 d-flex justify-content-center justify-content-md-start px-4">
                          <Col
                            xs={24}
                            sm={24}
                            md={3}
                            lg={2}
                            xl={2}
                            xxl={2}
                            className="d-flex align-items-center justify-content-center"
                          ></Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={21}
                            lg={22}
                            xl={22}
                            xxl={22}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <Row className="w-100">
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                lg={3}
                                xl={3}
                                xxl={3}
                                className="d-flex align-items-center justify-content-center border-end SRSummeryStartBorder"
                              >
                                <img
                                  src={simplifyRoomIcon}
                                  alt="icon"
                                  height="auto"
                                  width="40px"
                                />
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={9}
                                xl={9}
                                xxl={9}
                                className="my-2 my-md-0  border-start border-end"
                              >
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                                  Rooms
                                </h5>
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray mt-1">
                                  {unitDetails?.length}
                                </h5>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                lg={3}
                                xl={3}
                                xxl={3}
                                className="border-start border-end  d-flex align-items-start justify-content-center"
                              >
                                <img
                                  src={simplifyBedIcon}
                                  alt="icon"
                                  height="auto"
                                  width="40px"
                                // style={{strokeWidth:"80px"}}
                                />
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={9}
                                xl={9}
                                xxl={9}
                                className="border-start SRSummeryEndBorder my-2 my-md-0"
                              >
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                                  Beds
                                </h5>
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray mt-1">
                                  {unitDetails.reduce(
                                    (total: number, unit: any) => {
                                      return (
                                        total +
                                        unit.beds.reduce(
                                          (bedTotal: number, bed: any) => {
                                            return bedTotal + bed.count;
                                          },
                                          0
                                        )
                                      );
                                    },
                                    0
                                  )}
                                </h5>
                              </Col>

                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                lg={3}
                                xl={3}
                                xxl={3}
                                className="border-end SRSummeryStartBorder  d-flex align-items-start justify-content-center"
                              >
                                <img
                                  src={simplifyAttachBathroomIcon}
                                  alt="icon"
                                  height="auto"
                                  width="50px"
                                // style={{strokeWidth:"80px"}}
                                />
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={9}
                                xl={9}
                                xxl={9}
                                className="border-start border-end my-2 my-md-0  d-flex flex-column align-items-center align-items-md-start justify-content-center"
                              >
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                                  Attach Bathrooms
                                </h5>
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray mt-1">
                                  {unitDetails.reduce(
                                    (total: number, unit: any) => {
                                      return (
                                        total +
                                        unit.unitBathrooms.reduce(
                                          (
                                            bathroomTotal: number,
                                            bathroom: any
                                          ) => {
                                            return bathroomTotal + bathroom.count;
                                          },
                                          0
                                        )
                                      );
                                    },
                                    0
                                  )}
                                </h5>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                lg={3}
                                xl={3}
                                xxl={3}
                                className="border-start border-end  d-flex align-items-start justify-content-center"
                              >
                                <img
                                  src={simplifySharedBathroomIcon}
                                  alt="icon"
                                  height="auto"
                                  width="40px"
                                // style={{strokeWidth:"80px"}}
                                />
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={9}
                                xl={9}
                                xxl={9}
                                className="SRSummeryEndBorder border-start my-2 my-md-0  d-flex flex-column align-items-center align-items-md-start justify-content-center"
                              >
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                                  Shared Bathrooms
                                </h5>
                                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray mt-1">
                                  {propertyDetailsObject?.sharedBathrooms &&
                                    propertyDetailsObject?.sharedBathrooms?.length > 0
                                    ? propertyDetailsObject?.sharedBathrooms.reduce(
                                      (sum, item) => sum + item.count,
                                      0
                                    )
                                    : 0}
                                </h5>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                  <Row className="w-100 d-flex justify-content-center justify-content-md-end border-top">
                    <Col
                      xs={24}
                      sm={24}
                      md={9}
                      lg={7}
                      xl={6}
                      xxl={5}
                      className="me-0 me-md-4 me-lg-3"
                    >
                      <Button
                        size="large"
                        className="w-100 my-3 py-4  me-0 me-lg-3 rounded-3 "
                        style={{
                          color:
                            propertyDetailsObject?.allowEntireProperty &&
                              !propertyDetailsObject?.allowIndividualUnit
                              ? "#ef5a60"
                              : "white",
                        }}
                        type={
                          propertyDetailsObject?.allowEntireProperty &&
                            !propertyDetailsObject?.allowIndividualUnit
                            ? "text"
                            : "primary"
                        }
                        onClick={() => {
                          Cookies.remove(constants.ROOM_ID);
                          // console.log(Cookies.get(constants.ROOM_ID));
                          if (
                            propertyDetailsObject?.allowEntireProperty &&
                            !propertyDetailsObject?.allowIndividualUnit
                          ) {
                            history(`/unit/02/${propertyId}`);
                          } else if (
                            propertyDetailsObject?.allowIndividualUnit
                          ) {
                            history(`/unit/01/${propertyId}`);
                          }
                        }}
                      >
                        {propertyDetailsObject?.allowEntireProperty &&
                          !propertyDetailsObject?.allowIndividualUnit
                          ? "Edit"
                          : propertyDetailsObject?.allowIndividualUnit
                            ? "Add Another Room"
                            : ""}
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            <div className="mb-4 py-3 px-3 bg-white rounded-3">
              <Row className="d-flex justify-content-center text-center text-md-start">
                <Col
                  xs={8}
                  sm={8}
                  md={3}
                  lg={2}
                  xl={2}
                  xxl={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  {propertyDetailsObject?.propertyImages &&
                    propertyDetailsObject?.propertyImages.length > 0 ? (
                    <img
                      src={stepDoneIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  ) : (
                    <img
                      src={photoStepIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  )}
                </Col>
                <Col
                  xs={20}
                  sm={20}
                  md={14}
                  lg={16}
                  xl={16}
                  xxl={16}
                  className="ps-0 ps-md-4 d-flex flex-column justify-content-center"
                >
                  <h2 className="font-size-4 font-weight-light p-0 my-1">
                    Step 03
                  </h2>
                  <h2 className="font-size-3 font-weight-bold p-0 m-0">
                    Images
                  </h2>
                  <p className="font-size-4 font-weight-light my-1 p-0">
                    Share more images of your property so guests know what to
                    expect
                  </p>
                  {Object.keys(propertyDetailsObject).length > 0 && (
                    <Row className="text-gray pt-3 rounded-3 d-flex justify-content-center justify-content-md-start">
                      {propertyDetailsObject?.propertyImages
                        ?.slice(0, 5)
                        .map((img) => {
                          return (
                            <Col
                              xs={9}
                              sm={5}
                              md={5}
                              lg={4}
                              xl={4}
                              xxl={3}
                              className="p-3"
                            >
                              <img
                                src={img?.file?.smallPath}
                                height={60}
                                width={60}
                                style={{
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                                className="rounded-3"
                              />
                            </Col>
                          );
                        })}
                      {propertyDetailsObject?.propertyImages && propertyDetailsObject?.propertyImages.length > 0 && (propertyDetailsObject?.propertyImages.length > 5 || propertyDetailsObject?.totalUnitImagesCount! > 0) &&
                        <Col
                          xs={9}
                          sm={5}
                          md={5}
                          lg={4}
                          xl={4}
                          xxl={3}
                          className="p-3"
                        >
                          <div
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                              backgroundColor: "#F2F2F2",
                              height: "60px",
                              width: "60px"
                            }}
                            className="d-flex justify-content-center align-items-center rounded-3 border"
                          >{"+" + ((propertyDetailsObject?.totalUnitImagesCount! + propertyDetailsObject?.propertyImages.length) - 5)}</div>
                        </Col>}
                    </Row>
                  )}
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={6}
                  xl={6}
                  xxl={6}
                  className="d-flex justify-content-center justify-content-lg-end align-items-center"
                >
                  {propertyDetailsObject?.propertyImages &&
                    propertyDetailsObject?.propertyImages.length > 0 ? (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4 me-0 me-lg-3 rounded-3"
                      type="text"
                      style={{ color: "#ef5a60" }}
                      onClick={() => {
                        history(`/image/01/${propertyId}`);
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4 me-0 me-lg-3 rounded-3"
                      type="primary"
                      onClick={() => {
                        history(`/image/01/${propertyId}`);
                      }}
                    >
                      Add Images
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
            <div className="py-3 px-3 bg-white rounded-3">
              <Row className="d-flex justify-content-center text-center text-md-start">
                <Col
                  xs={8}
                  sm={8}
                  md={3}
                  lg={2}
                  xl={2}
                  xxl={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  {propertyDetailsObject?.invoiceHeadingType != null &&
                    (propertyDetailsObject?.lastSubStep ===
                      ListingStepsEnum.INVOICE_HEADING_TYPE ||
                      propertyDetailsObject.lastSubStep ===
                      ListingStepsEnum.FINAL_STEP) &&
                    propertyDetailsObject.lastMainStep ===
                    MainStepsCompleteTypeEnum.FINAL_STEP_COMPLETE ? (
                    <img
                      src={stepDoneIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  ) : (
                    <img
                      src={finalStepIcon}
                      alt="icon"
                      height="auto"
                      width="70%"
                    />
                  )}
                </Col>
                <Col
                  xs={20}
                  sm={20}
                  md={14}
                  lg={16}
                  xl={16}
                  xxl={16}
                  className="ps-0 ps-md-4 d-flex flex-column justify-content-center"
                >
                  <h2 className="font-size-4 font-weight-light p-0 my-1">
                    Step 04
                  </h2>
                  <h2 className="font-size-3 font-weight-bold p-0 m-0">
                    Finalization & Publishing
                  </h2>
                  <p className="font-size-4 font-weight-light my-1 p-0">
                    Finalize and publish your listing to start receiving
                    bookings
                  </p>
                  {Object.keys(propertyDetailsObject).length > 0 && propertyDetailsObject?.cancellationPolicies
                    ?.shortCancellationPolicyId && (
                      <Row className="text-gray pt-3 rounded-3 w-100">
                        <Col xs={24} sm={24} md={10}>
                          <h2 className="font-size-5 font-weight-medium p-0 my-1">
                            Pay at property
                            {propertyDetailsObject?.payAtProperty ? (
                              <CheckCircleTwoTone
                                twoToneColor="#52c41a"
                                className="ms-2"
                              />
                            ) : (
                              <CloseCircleTwoTone
                                twoToneColor="red"
                                className="ms-2"
                              />
                            )}
                          </h2>

                          <h2 className="font-size-5 font-weight-medium p-0 my-1">
                            {" "}
                            Instance booking
                            {propertyDetailsObject?.allowInstantBooking ? (
                              <CheckCircleTwoTone
                                twoToneColor="#52c41a"
                                className="ms-2"
                              />
                            ) : (
                              <CloseCircleTwoTone
                                twoToneColor="red"
                                className="ms-2"
                              />
                            )}
                          </h2>
                        </Col>
                        <Col xs={24} sm={24} md={14}>
                          {propertyDetailsObject?.cancellationPolicies?.longCancellationPolicy &&
                            <h2 className="font-size-5 font-weight-medium p-0 my-1">
                              Long term cancellation policy :
                              {" "}{propertyDetailsObject?.cancellationPolicies?.longCancellationPolicy?.name}
                            </h2>}


                          {propertyDetailsObject?.cancellationPolicies?.shortCancellationPolicyId && <h2 className="font-size-5 font-weight-medium p-0 my-1">
                            {" "}
                            Short term cancellation policy :
                            {" "}{propertyDetailsObject?.cancellationPolicies?.shortCancellationPolicyId?.name}
                          </h2>}
                        </Col>
                      </Row>
                    )}
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={6}
                  xl={6}
                  xxl={6}
                  className="d-flex justify-content-center justify-content-lg-end align-items-center"
                >
                  {propertyDetailsObject?.cancellationPolicies
                    ?.shortCancellationPolicyId ? (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4 me-0 me-lg-3 rounded-3"
                      type="text"
                      style={{ color: "#ef5a60" }}
                      onClick={() => {
                        history(`/final/01/${propertyId}`);
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      className="w-75 my-3 py-4 me-0 me-lg-3 rounded-3"
                      type="primary"
                      onClick={() => {
                        history(`/final/01/${propertyId}`);
                      }}
                    >
                      Add Final Details
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Button
                  disabled={
                    !(
                      propertyDetailsObject?.checkIn &&
                      propertyDetailsObject?.checkOut &&
                      unitDetails.length > 0 &&
                      propertyDetailsObject?.propertyImages &&
                      propertyDetailsObject?.propertyImages?.length > 0 &&
                      propertyDetailsObject?.invoiceHeadingType != null &&
                      (propertyDetailsObject?.lastSubStep ===
                        ListingStepsEnum.INVOICE_HEADING_TYPE ||
                        propertyDetailsObject.lastSubStep ===
                        ListingStepsEnum.FINAL_STEP) &&
                      propertyDetailsObject.lastMainStep ===
                      MainStepsCompleteTypeEnum.FINAL_STEP_COMPLETE
                    )
                  }
                  size="large"
                  className=" w-100 mt-4 py-4  rounded-3"
                  type="default"
                  onClick={() => {
                    localStorage.setItem("fromLocation", "propertyList");
                    window.open(`/view/${propertyId}`, "_blank");
                  }}
                >
                  Preview my property
                </Button>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Button
                  disabled={
                    !(
                      propertyDetailsObject?.checkIn &&
                      propertyDetailsObject?.checkOut &&
                      unitDetails.length > 0 &&
                      propertyDetailsObject?.propertyImages &&
                      propertyDetailsObject?.propertyImages?.length > 0 &&
                      propertyDetailsObject?.invoiceHeadingType != null &&
                      (propertyDetailsObject?.lastSubStep ===
                        ListingStepsEnum.INVOICE_HEADING_TYPE ||
                        propertyDetailsObject.lastSubStep ===
                        ListingStepsEnum.FINAL_STEP) &&
                      propertyDetailsObject.lastMainStep ===
                      MainStepsCompleteTypeEnum.FINAL_STEP_COMPLETE
                    )
                  }
                  size="large"
                  className=" w-100 mt-4 py-4  rounded-3"
                  type="primary"
                  onClick={() => {
                    history(`/complete/${propertyId}`);
                  }}
                >
                  Publish my listing
                </Button>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="pe-0 pe-md-3"
              >
                <Button
                  size="large"
                  className=" w-100 mt-4 py-2  rounded-3"
                  type="default"
                  onClick={() => {
                    history(`/`);
                  }}
                >
                  Back to home
                </Button>
              </Col>
              {propertyDetailsObject?.status !== PropertyStatusEnum.PUBLISHED ?
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={12}
                  className=" ps-0 ps-md-3"
                >
                  <Button
                    disabled={propertyDetailsObject?.status === PropertyStatusEnum.UNPUBLISHED || !propertyId}
                    size="large"
                    className=" w-100 mt-4 py-2  rounded-3"
                    type="default"
                    onClick={() => {
                      handleDeleteListedProperty();
                    }}
                  >
                    Delete property
                  </Button>
                </Col> : <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={12}
                  className=" ps-0 ps-md-3"
                >
                  <Button
                    disabled={!propertyId}
                    size="large"
                    className=" w-100 mt-4 py-2  rounded-3"
                    type="default"
                    onClick={() => {
                      handleUnpublishListedProperty(
                        propertyId,
                        PropertyStatusEnum.UNPUBLISHED
                      )
                    }}
                  >
                    Unpublish property
                  </Button>
                </Col>}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainStepsFinishPage;
