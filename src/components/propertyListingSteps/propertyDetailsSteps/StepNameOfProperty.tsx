import { Button, Card, Col, Row, Alert } from "antd";
import React, { useEffect, useState } from "react";
import "../../../styles/propertyListingStyles.scss";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import {
  customToastMsg,
  getDecryptedCookie,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import { getAllPropertyTypes } from "../../../service/propertyDetailsService";
import { useDispatch } from "react-redux";
import { PropertyTypeDetailsObject } from "../../../common/interfaces/uiNecessaryInterface";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import * as constants from "../../../common/constants";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { Cookies } from "typescript-cookie";

const StepNameOfProperty = () => {
  const [cardDetailsList, setCardDetailsList] = useState<
    PropertyTypeDetailsObject[]
  >([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number>(0);
  const [isPropertyTypeAlreadyCreated, setIsPropertyTypeAlreadyCreated] =
    useState<boolean>(false);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  const history = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    loadAllPropertyTypes();
    loadPropertyDetailsPropertyId();
  }, []);

  const loadAllPropertyTypes = () => {
    let temp: PropertyTypeDetailsObject[] = [];

    popUploader(dispatch, true);
    getAllPropertyTypes()
      .then((resp) => {
        setCardDetailsList(
          resp?.data.map((property: PropertyTypeDetailsObject) => ({
            id: property.id,
            name: property.name,
            icon: property.icon,
            key: property.key,
          }))
        );
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
          if (dataObj?.propertyType) {
            setSelectedPropertyId(dataObj?.propertyType?.id);
            setIsPropertyTypeAlreadyCreated(true);
          }
          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    } else {
      setIsDisableBtns(false);
    }
  };

  const handleCardClick = (cardType: number) => {
    setSelectedPropertyId(cardType);
  };

  const handleCreatePropertyListingNameOfProperty = () => {
    let isValidate = false;
    !selectedPropertyId
      ? customToastMsg("Select your property type ", 2)
      : (isValidate = true);

    const planId = parseInt(Cookies.get(constants.PLAN_ID) as string);
    const data = {
      planId: planId,
      propertyTypeId: selectedPropertyId && selectedPropertyId,
    };
    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.PROPERTY_TYPE, null)
        .then((response) => {
          clearStates();
          popUploader(dispatch, false);
          history(`/property/02/${response?.data?.propertyId}`);
          setEncryptedCookie(constants.PROPERTY_ID, response?.data?.propertyId);
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
    setCardDetailsList([]);
    setSelectedPropertyId(0);
    setIsPropertyTypeAlreadyCreated(false);
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="py-5 py-lg-0 w-100 h-100 stepNameOfPropertyContainer">
        <Row
          className="d-flex align-items-center pt-5 pt-lg-0 contentRow"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="me-0 me-xl-5 pe-0 pe-lg-5">
              <h2 className="font-size-3 font-weight-medium primary-color">
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
                {">"} Step 01
              </h2>
              <h1 className="font-size-1 font-weight-medium">
                Tell us about your property
              </h1>
              <p className="me-0 me-xl-5 font-size-4 font-weight-extra-light">
                Let’s start by getting to know your place! Whether you're
                offering an entire apartment or just a room, give us the
                details. We’ll ask about the property type, location, and how
                many guests it can accommodate. This is the first step toward
                creating the perfect listing and connecting with potential
                guests.
              </p>
              {isPropertyTypeAlreadyCreated && (
                <Alert
                  message="Once you select your property type, it cannot be changed. If you
              wish to make updates, simply create a new entry."
                  type="warning"
                  showIcon
                />
              )}
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className="d-flex flex-column align-items-center align-self-end py-1 mb-2"
            style={{
              height: "88%",
              overflowY: "auto",
              justifyContent: cardDetailsList.length <= 4 ? "center" : "start",
            }}
          >
            <Row
              className="d-flex justify-content-center my-4 my-lg-0"
              style={{
                pointerEvents: isPropertyTypeAlreadyCreated ? "none" : "all",
                opacity: isPropertyTypeAlreadyCreated ? 0.5 : 1,
              }}
            >
              {cardDetailsList.map((cardType) => (
                <Col
                  xs={24}
                  sm={20}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={10}
                  className="my-4"
                  key={cardType?.id}
                >
                  <Card
                    bordered={false}
                    hoverable
                    className="d-flex align-items-center justify-content-center mx-4 mx-lg-2 mx-md-5 mx-sm-5 mx-xl-4 mx-xxl-5 rounded-3"
                    style={{
                      height: 200,
                      backgroundColor:
                        selectedPropertyId === cardType?.id
                          ? "#08294207"
                          : "#fdfdfd6e",
                      border:
                        selectedPropertyId === cardType?.id
                          ? "3px solid #ff9296"
                          : "none",
                    }}
                    onClick={() => handleCardClick(cardType?.id)}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center w-100">
                      <img
                        src={cardType?.icon}
                        alt={cardType?.name}
                        style={{ height: 80, width: "auto" }}
                      />
                      <h4
                        className="mt-2 font-size-3 text-center secondary-color"
                      >
                        {cardType?.name}
                      </h4>
                    </div>
                  </Card>

                </Col>
              ))}
              {/* <div
                dangerouslySetInnerHTML={{ __html: cardType?.icon }}
                style={{ height: 80, width: "auto" }}
              /> */}
            </Row>
          </Col>
        </Row>
        <Row className="btnRow" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex flex-column-reverse flex-sm-row justify-content-between mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="me-0 me-sm-2 mt-3 mt-lg-0 px-5 py-4 rounded-4"
              onClick={() => {
                history("/start");
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="ms-0 ms-sm-3 mt-3 mt-lg-0 px-5 py-4 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

                isPropertyTypeAlreadyCreated
                  ? history(`/property/02/${propertyId}`)
                  : handleCreatePropertyListingNameOfProperty();
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

export default StepNameOfProperty;
