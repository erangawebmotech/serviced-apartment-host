import { Button, Col, Form, Grid, Input, Row } from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { useDispatch } from "react-redux";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepNewListingDiscount = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [newListingDiscountRate, setNewListingDiscountRate] = useState<number>(0);


  const [selectedItems, setSelectedItems] = useState<number[]>([]);
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
          if (dataObj?.newListingDiscount) {
            setNewListingDiscountRate(dataObj?.newListingDiscount);
            form.setFieldsValue({
              newListingDiscountRate: dataObj?.newListingDiscount,

            });
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

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setNewListingDiscountRate(value);

    if (value < 0) {
      setError("Discount rate cannot be lower than 0.");
    } else if (value > 100) {
      setError("Discount rate cannot be grater than 100.");
    } else {
      setError(null);
    };

  }

  const handleCreatePropertyNewListingDiscount = () => {
    let isValidate = false;

    if (newListingDiscountRate < 0) {
      customToastMsg("Enter valid discount rate", 2)
    } else if (newListingDiscountRate > 100) {
      customToastMsg("Enter valid discount rate", 2)
    } else {
      (isValidate = true);
    };

    const data = {
      newPropertyDiscount: {
        value: newListingDiscountRate
      }
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.NEW_LISTING_DISCOUNT, propertyId)
        .then((res) => {
          clearStates();
          popUploader(dispatch, false);
          history(`/main/finish/${propertyId}`);
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
    setNewListingDiscountRate(0);
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
        return "12";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "13";
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
        return "11";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "13";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "11";
      }
    }
    return "14";
  };

  return (
    <PropertyListing>
      <div className="StepNewListingDiscountContainer py-5 py-lg-0 h-100 w-100">
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
                New Listing Launch Discount
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Give your property a strong start by offering a special discount on your first 3 reservations.
                This helps boost visibility, attract early guests, and secure your first reviews.
              </p>
              <ul className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                <li>Discount applies <strong> only to stays shorter than 30 days.</strong></li>
                <li>The discount will be <strong> automatically removed after the first 3 bookings.</strong></li>
              </ul>
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


            <div
              className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0 w-100"
              style={{ backgroundColor: "#fdfdfd6e" }}
            >
              <Form
                form={form}
                layout="vertical"
                className="my-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
              >
                <h5 className="font-size-4 font-weight-medium mb-4">Discounted Rate (%)</h5>
                <h5 className="font-size-4 font-weight-normal">Enter the percentage discount you’d like to offer for your new listing.</h5>
                <Form.Item
                  name="newListingDiscountRate"
                  validateStatus={error ? "error" : undefined}
                  help={
                    error
                  }
                  className="w-100"
                >
                  <Input
                    size="large"
                    id="newListingDiscountRate"
                    name="newListingDiscountRate"
                    value={newListingDiscountRate}
                    placeholder="New listing discount rate of your property"
                    className="rounded-4 p-3 bg-transparent border border-secondary"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    onChange={handleRateChange}
                  />
                </Form.Item>
                <small className="mt-2 text-secondary">(Example: If your nightly rate is $100 and you set a 20% discount, guests will see $80 per night for the first 3 bookings.)</small>
              </Form>
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
                // history(`/property/13/${propertyId}`);

                if (
                  propertyDetailsObject?.allowEntireProperty
                ) {
                  history(`/property/13/${propertyId}`);
                  return;
                } else {
                  history(`/property/12/${propertyId}`);
                  // history(`/main/finish/${propertyId}`);
                }
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              type="primary"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyNewListingDiscount}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepNewListingDiscount;
