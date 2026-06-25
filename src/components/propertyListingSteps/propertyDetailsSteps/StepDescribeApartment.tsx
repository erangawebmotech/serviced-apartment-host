import { Button, Col, Divider, Grid, Row } from "antd";
import { useEffect, useState } from "react";
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
  AmenityObject,
  SpecialAreaAmenitiesObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { useDispatch } from "react-redux";
import { getAllAmenities } from "../../../service/propertyDetailsService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import defaultIcon from "../../../assets/images/steps/defaultIcon.png";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepDescribeApartment = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [selectedItems, setSelectedItems] = useState<
    { amenityId: number; description: string }[]
  >([]);
  const [amenitiesList, setAmenitiesList] = useState<
    SpecialAreaAmenitiesObject[]
  >([]);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

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
          loadAllAmenities(dataObj?.allowEntireProperty ? dataObj?.allowEntireProperty : false);
          if (
            dataObj?.propertyAmenities &&
            dataObj?.propertyAmenities.length > 0
          ) {
            let temp: { amenityId: number; description: string }[] = [];
            dataObj?.propertyAmenities.map((amenity) => {
              temp.push({
                amenityId: amenity?.amenity?.id,
                description: amenity?.description,
              });
            });
            setSelectedItems(temp);
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

  const loadAllAmenities = (isEntireProperty: boolean) => {
    popUploader(dispatch, true);
    getAllAmenities()
      .then((resp) => {
        if (isEntireProperty) {
          setAmenitiesList(resp?.data);
        } else {
          const filteredAmenities = resp?.data.filter(
            (item: any) => item.amenityCategory.name !== 'BATHROOM_AMENITIES'
          );
          // console.log(filteredAmenities);
          setAmenitiesList(filteredAmenities);
        }

        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleItemClick = (id: number) => {
    setSelectedItems((prevSelectedItems) => {
      const isAlreadySelected = prevSelectedItems.some(
        (item) => item.amenityId === id
      );

      if (isAlreadySelected) {
        return prevSelectedItems.filter((item) => item.amenityId !== id);
      } else {
        return [...prevSelectedItems, { amenityId: id, description: "" }];
      }
    });
  };

  const isSelected = (id: number) =>
    selectedItems.some((item) => item.amenityId === id);

  const handleCreatePropertyDescribeApartment = () => {
    let isValidate = true;
    // selectedItems.length <= 0
    //   ? customToastMsg("Select apartment feature", 2)
    //   : (isValidate = true);

    const data = {
      propertyAmenities: selectedItems,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.PROPERTY_AMENITIES, propertyId)
        .then((res) => {
          clearStates();
          popUploader(dispatch, false);
          if (
            propertyDetailsObject?.allowEntireProperty
          ) {
            history(`/property/13/${propertyId}`);
            return;
          } else {
            history(`/property/14/${propertyId}`);
            // history(`/main/finish/${propertyId}`);
          }
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
    setSelectedItems([]);
    setIsDisableBtns(true);
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
        return "10";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "11";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey === PropertyTypesKeysEnum.HOTEL
      ) {
        return "08";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey != PropertyTypesKeysEnum.HOTEL
      ) {
        return "09";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "11";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "10";
      }
    }
    return "12";
  };

  return (
    <PropertyListing>
      <div className="StepDescribeApartmentContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={10} xl={12} xxl={12}>
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
                {propertyDetailsObject?.allowEntireProperty &&
                  !propertyDetailsObject?.allowIndividualUnit
                  ? "What shared amenities does your property provide ?"
                  : "What amenities does your property provide ?"}
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Detail the amenities available in your property.
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={14}
            xl={12}
            xxl={12}
            className={`d-flex flex-column align-items-center align-items-lg-start mb-2 align-self-end py-2 pe-2`}
            // className={`d-flex flex-column align-items-center align-items-lg-start mb-2 bg-success align-self-end py-2 pe-2
            //   ${screens.xxl || screens.xl
            //     ? "justify-content-start "
            //     : "justify-content-start"
            //   } 
            //     `}
            style={{ height: "88%", overflowY: "auto" }}
          >
            {amenitiesList.map((amenity: SpecialAreaAmenitiesObject) => {
              return (
                <div>
                  {amenity?.amenityCategory?.amenities.length > 0 && (
                    <div className="mt-5 mt-lg-0">
                      <h5 className="font-size-3 font-weight-medium mb-3 secondary-color">
                        {formatNamesCmnFun(amenity?.amenityCategory?.name)}
                      </h5>
                      <div>
                        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
                          {amenity?.amenityCategory?.amenities.map(
                            (item: AmenityObject) => {
                              return (
                                <div
                                  onClick={() => handleItemClick(item.id)}
                                  key={item.id}
                                  className="d-flex justify-content-center align-items-center py-2 py-lg-1 py-xl-2 px-4 px-lg-3 px-xl-4 rounded-4 my-2 mx-2"
                                  style={{
                                    width: "max-content",
                                    color: isSelected(item.id)
                                      ? "white"
                                      : "black",
                                    backgroundColor: isSelected(item.id)
                                      ? "#ef5a60"
                                      : "#fdfdfd6e",
                                    border: "2px solid white",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img
                                    src={
                                      item.file?.originalPath
                                        ? item.file?.originalPath
                                        : defaultIcon
                                    }
                                    alt="icon"
                                    height={20}
                                    width="auto"
                                  />

                                  <h5 className="font-size-3 font-weight-normal ms-2 my-2 my-0">
                                    {item.name}
                                  </h5>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <Divider />
                    </div>
                  )}
                </div>
              );
            })}
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
              type="default"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/property/11/${propertyId}`);
                // if (
                //   propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                //   propertyTypeKey === PropertyTypesKeysEnum.HOTEL
                // ) {
                //   history(`/property/06/${propertyId}`);
                // } else {
                //   history(`/property/07/${propertyId}`);
                // }
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              type="primary"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyDescribeApartment}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepDescribeApartment;
