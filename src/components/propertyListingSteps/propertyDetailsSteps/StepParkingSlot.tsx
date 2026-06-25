import { Button, Card, Col, Form, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  formatNamesCmnFun,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import * as constants from "../../../common/constants";
import { useDispatch } from "react-redux";
import { ParkingFacilitiesEnum } from "../../../common/enums/parkingFacilitiesEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { HomeStayOptionDetailsObject } from "../../../common/interfaces/uiNecessaryInterface";
import { getAllHomeStayOptions } from "../../../service/propertyDetailsService";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepParkingSlot = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [parkingSlotAvailability, setParkingSlotAvailability] = useState<
    string | null
  >(null);
  const [breakfastStatus, setBreakfastStatus] = useState<boolean | null>(null);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyType, setPropertyType] = useState<string>("");
  const [selectedHomeStayOption, setSelectedHomeStayOption] =
    useState<number>();
  const [homeStayOptionList, setHomeStayOptionList] = useState<
    HomeStayOptionDetailsObject[]
  >([]);
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadAllHomeStayOptions();
    loadPropertyDetailsPropertyId();
  }, []);

  const loadAllHomeStayOptions = () => {
    let temp: HomeStayOptionDetailsObject[] = [];
    popUploader(dispatch, true);
    getAllHomeStayOptions()
      .then((resp) => {
        resp?.data.map((property: HomeStayOptionDetailsObject) => {
          temp.push({
            id: property?.id,
            party: property?.party,
            icon: property?.icon,
          });
        });
        setHomeStayOptionList(temp);
        popUploader(dispatch, false);
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
          setPropertyDetailsObject(dataObj);
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );
          setPropertyType(
            dataObj?.propertyType?.name ? dataObj?.propertyType?.name : ""
          );
          if (dataObj?.parkingFacility || dataObj?.hasBreakfast) {
            setParkingSlotAvailability(dataObj?.parkingFacility?.type ?? null);
            setBreakfastStatus(dataObj?.hasBreakfast ?? false);
          }
          if (
            dataObj?.propertyType?.key === PropertyTypesKeysEnum.HOME_STAY &&
            dataObj?.otherParty
          ) {
            setSelectedHomeStayOption(dataObj?.otherParty?.id);
          }
          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const handleCreatePropertyListingParkingSlot = () => {
    let isValidate = false;
    // parkingSlotAvailability === ""
    //   ? customToastMsg("Select parking facilities", 2)
    //   : breakfastStatus === ""
    //   ? customToastMsg("Select breakfast status", 2)
    propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY &&
      (!selectedHomeStayOption || selectedHomeStayOption === 0)
      ? customToastMsg("Select home stay option", 2)
      : (isValidate = true);

    const data = {
      services: {
        parkingFacilityType: parkingSlotAvailability,
        hasBreakfast: breakfastStatus,
        otherPartyId: selectedHomeStayOption,
      },
    };
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.PARKING_AND_BREAKFAST, propertyId)
        .then((response: any) => {
          clearStates();
          form.resetFields();
          popUploader(dispatch, false);
          history(`/property/12/${propertyId}`);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const clearStates = () => {
    setParkingSlotAvailability(null);
    setBreakfastStatus(null);
    setIsDisableBtns(true);
  };

  const handleCardClick = (cardType: number) => {
    setSelectedHomeStayOption(cardType);
  };

  const getStepNumber = (
    propertyTypeKey: string,
    propertyDetailsObject: any
  ) => {
    if (!propertyTypeKey) {
      return "";
    }

    const isApartmentOrSimilar =
      propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
      propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
      propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
      propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY;

    if (isApartmentOrSimilar) {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "09";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "10";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey === PropertyTypesKeysEnum.HOTEL
      ) {
        return "07";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey != PropertyTypesKeysEnum.HOTEL
      ) {
        return "08";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "10";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "09";
      }
    }
    return "11";
  };

  return (
    <PropertyListing>
      <div className="StepParkingSlotContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-lg-5">
              <h2 className="font-weight-medium font-size-3 primary-color">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  Property Details
                </span>{" "}
                {">"} Step{" "}
                {getStepNumber(propertyTypeKey, propertyDetailsObject)}
              </h2>
              <h1 className="font-weight-medium font-size-1 me-0 me-xl-5">
                Do you offer parking and breakfast?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Provide information on Parking availability and breakfast
                options to enhance the guest experience
              </p>
            </div>
          </Col>

          <Col
            xs={20}
            sm={12}
            md={8}
            lg={12}
            xl={12}
            xxl={12}
            className="d-flex flex-column align-items-start py-2 mb-2 "
            style={
              propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                ? { height: "88%", overflowY: "auto", alignSelf: "end" }
                : undefined
            }
          >
            <Form
              form={form}
              layout="vertical"
              className="mt-4 w-100 ps-0 ps-xl-5 text-start"
            >
              {propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY && (
                <div className="w-100 mb-5">
                  <h5 className="font-size-4 font-weight-medium mb-3">
                    Other Parties On The Site
                  </h5>

                  <div className="grid-container">
                    {homeStayOptionList.map((cardType) => (
                      <Card
                        bordered={false}
                        hoverable
                        className="card-item d-flex align-items-end justify-content-center rounded-3"
                        style={{
                          height: "auto",
                          width: 180,
                          backgroundColor:
                            selectedHomeStayOption === cardType?.id
                              ? "#08294207"
                              : "#fdfdfd6e",
                          border:
                            selectedHomeStayOption === cardType?.id
                              ? "3px solid #ff9296"
                              : "none",
                        }}
                        onClick={() => handleCardClick(cardType?.id)}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: cardType?.icon }}
                          style={{ height: "auto", width: "auto" }}
                          className="homeStayIconsDiv mt-2"
                        />

                        <h4 className="font-size-3 secondary-color text-center mt-2">
                          {formatNamesCmnFun(cardType?.party)}
                        </h4>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-5">
                <h5 className="font-size-4 font-weight-medium mb-3">
                  Parking Facilities
                </h5>
                <Radio.Group
                  onChange={(e) => {
                    setParkingSlotAvailability(e.target.value);
                  }}
                  className="d-flex flex-column ms-3"
                  value={parkingSlotAvailability}
                >
                  <Radio value={ParkingFacilitiesEnum.NO} className="my-3">
                    <span className="font-size-4 font-weight-medium">No</span>
                  </Radio>
                  <Radio value={ParkingFacilitiesEnum.ON_SITE} className="my-3">
                    <span className="font-size-4 font-weight-medium">
                      On Site
                    </span>
                  </Radio>
                  <Radio
                    value={ParkingFacilitiesEnum.STREET_PARKING}
                    className="my-3"
                  >
                    {" "}
                    <span className="font-size-4 font-weight-medium">
                      Street Parking
                    </span>
                  </Radio>
                  <Radio
                    value={ParkingFacilitiesEnum.PAID_SLOT}
                    className="my-3"
                  >
                    {" "}
                    <span className="font-size-4 font-weight-medium">
                      Paid Slot
                    </span>
                  </Radio>
                </Radio.Group>
              </div>
              <div>
                <h5 className="font-size-4 font-weight-medium mb-3">
                  Is Breakfast Included?
                </h5>
                <Radio.Group
                  onChange={(e) => {
                    setBreakfastStatus(e.target.value);
                  }}
                  className="d-flex flex-column ms-3"
                  value={breakfastStatus}
                >
                  <Radio value={true} className="my-3">
                    <span className="font-size-4 font-weight-medium">Yes</span>
                  </Radio>
                  <Radio value={false} className="my-3">
                    <span className="font-size-4 font-weight-medium">No</span>
                  </Radio>
                </Radio.Group>
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="btnRow w-100" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex justify-content-between flex-column-reverse flex-sm-row mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/property/10/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={() => {
                handleCreatePropertyListingParkingSlot();
              }}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepParkingSlot;
