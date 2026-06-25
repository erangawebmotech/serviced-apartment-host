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
  HighlightItemsObj,
  SpecialAreaAmenitiesObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { useDispatch } from "react-redux";
import { propertyHighlight } from "../../../service/propertyDetailsService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import defaultIcon from "../../../assets/images/steps/defaultIcon.png";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepEntirePropertyHighlights = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [highlightsList, setHighlightsList] = useState<
    HighlightItemsObj[]
  >([]);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadAllHighLights();
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
          if (
            dataObj?.propertyHighlights &&
            dataObj?.propertyHighlights.length > 0
          ) {
            const highLightArray: number[] = dataObj.propertyHighlights.map(
              (item: any) => item.id
            );
            setSelectedItems(highLightArray);
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

  const loadAllHighLights = () => {
    popUploader(dispatch, true);
    propertyHighlight()
      .then((res) => {
        const highlightsList = res.data.map((highlight: any) => ({
          id: highlight.id,
          icon: highlight?.file?.smallPath,
          name: highlight.name,
        }));
        setHighlightsList(highlightsList);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      });
  };

  const handleItemClick = async (id: number) => {
    await setSelectedItems((prevSelectedItems = []) => {
      const updatedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id];
      // console.log("Updated selectedItems:", updatedItems); // Log the updated state

      return updatedItems;
    });
  };

  const isSelected = (id: number) => selectedItems.includes(id);


  const handleCreatePropertyHighlights = () => {
    let isValidate = true;
    // selectedItems.length <= 0
    //   ? customToastMsg("Select apartment feature", 2)
    //   : (isValidate = true);

    const data = {
      propertyHighlightIds: selectedItems,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.PROPERTY_HIGHLIGHTS, propertyId)
        .then((res) => {
          clearStates();
          popUploader(dispatch, false);
          history(`/property/14/${propertyId}`);
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
        return "11";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "12";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey === PropertyTypesKeysEnum.HOTEL
      ) {
        return "09";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey != PropertyTypesKeysEnum.HOTEL
      ) {
        return "10";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "12";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "11";
      }
    }
    return "13";
  };

  return (
    <PropertyListing>
      <div className="StepEntirePropertyHighlightsContainer py-5 py-lg-0 h-100 w-100">
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
                Highligh
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Choose the standout features of your property, such as scenic views or special surroundings, to help guests know what makes your place special.
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
            // className={`d-flex flex-column align-items-center align-items-lg-start mb-2 align-self-end py-2 pe-2`}
            className={`d-flex flex-column align-items-center align-items-lg-start mb-2 align-self-end py-2 pe-2
              ${screens.xxl || screens.xl
                ? "justify-content-center "
                : "justify-content-start"
              } 
                `}
            style={{ height: "88%", overflowY: "auto" }}
          >


            <div className="mt-5 mt-lg-0">
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
                {highlightsList.map((item: HighlightItemsObj) => {
                  return (
                    <div
                      onClick={() => handleItemClick(item.id)}
                      key={item.id}
                      className="d-flex justify-content-center align-items-center py-1  px-3 rounded-4 my-2 mx-2"
                      style={{
                        width: "max-content",
                        color: isSelected(item.id) ? "white" : "black",
                        backgroundColor: isSelected(item.id)
                          ? "#ef5a60"
                          : "#fdfdfd6e",
                        border: "2px solid white",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={item.icon ? item.icon : defaultIcon}
                        width="20px"
                        alt="icon-img"
                      />
                      <h5 className="font-size-3 font-weight-normal ms-2 my-2 my-0">
                        {item.name}
                      </h5>
                    </div>
                  );
                })}
              </div>
            </div>

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
                history(`/property/12/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              type="primary"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyHighlights}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepEntirePropertyHighlights;
