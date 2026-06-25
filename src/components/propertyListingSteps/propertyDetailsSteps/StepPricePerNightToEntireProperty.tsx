import { Button, Checkbox, Col, Divider, Form, Grid, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import { UnitEnum } from "../../../common/uiConstants";
import PropertyListing from "../../../pages/PropertyListing";
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
  updatePropertyCreateLastMainStep,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { commissionRateEnum } from "../../../config/commissionConfig";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";
import { PlansEnum } from "../../../common/enums/plansEnum";

const StepPricePerNightToEntireProperty = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [monthlyPropertyPrice, setMonthlyPropertyPrice] = useState<number>(0);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyPriceError, setMonthlyPriceError] = useState<string | null>(
    null
  );
  const [isMonthlyRateHave, setIsMonthlyRateHave] = useState<boolean>(false);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [commissionRate, setCommissionRate] = useState<number>(0);


  const [form] = Form.useForm();

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
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );
          setPropertyDetailsObject(dataObj);

          dataObj?.plan?.name === PlansEnum.STARTER ? setCommissionRate(commissionRateEnum?.STARTER) : dataObj?.plan?.name === PlansEnum.SUPPORTIVE ? setCommissionRate(commissionRateEnum?.SUPPORTIVE) : dataObj?.plan?.name === PlansEnum.ALL_INCLUSIVE ? setCommissionRate(commissionRateEnum?.ALL_INCLUSIVE) : ""
          if (dataObj?.priceForEntireProperty || dataObj?.monthlyRate) {
            setPropertyPrice(
              dataObj?.priceForEntireProperty
                ? dataObj?.priceForEntireProperty
                : 0
            );
            setMonthlyPropertyPrice(
              dataObj?.monthlyRate ? dataObj?.monthlyRate : 0
            );
            setIsMonthlyRateHave(dataObj?.monthlyRate ? true : false);
            form.setFieldsValue({
              propertyPrice: dataObj?.priceForEntireProperty,
              monthlyPropertyPrice: dataObj?.monthlyRate,
            });
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

  const handleCreatePropertyListingPricePerNightToEntireProperty = () => {
    let isValidate = false;
    propertyPrice <= 0
      ? customToastMsg("Enter valid property daily rate", 2)
      : monthlyPropertyPrice && monthlyPropertyPrice <= 0
        ? customToastMsg("Enter valid property monthly rate", 2)
        : (isValidate = true);

    const data = {
      priceForEntireProperty: propertyPrice,
      monthlyRate: monthlyPropertyPrice,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(
        data,
        ListingStepsEnum.PRICE_FOR_ENTIRE_PROPERTY,
        propertyId
      )
        .then(() => {
          clearStates();
          form.resetFields();
          popUploader(dispatch, false);
          history(`/property/07/${propertyId}`);
        })
        .catch((error) => {
          handleError(error);
          popUploader(dispatch, false);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const clearStates = () => {
    setPropertyPrice(0);
    setIsDisableBtns(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setPropertyPrice(value);

    if (value < 0) {
      setError("Daily rate cannot be lower than 0.");
    } else {
      setError(null);
    }
  };

  const handleMonthlyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setMonthlyPropertyPrice(value);

    if (value < 0) {
      setMonthlyPriceError("Monthly rate cannot be lower than 0.");
    } else {
      setMonthlyPriceError(null);
    }
  };

  return (
    <PropertyListing>
      <div className="StepPricePerNightToEntirePropertyContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
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
                {propertyTypeKey === ""
                  ? ""
                  : propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                    propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                    ? " 05"
                    : " 06"}{" "}
              </h2>
              <h1 className="font-weight-medium font-size-1">
                Set the nightly rate for your entire property
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Provide the nightly price for the entire property to help
                potential guests plan their stay within their budget
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className={`d-flex align-self-end mb-2 py-4 justify-content-center pe-2 ${!isMonthlyRateHave && (screens.xxl || screens.xl)
              ? "align-items-center "
              : "align-items-start"
              }  `}
            style={
              isMonthlyRateHave
                ? {
                  height: "86%",
                  overflowY: "auto",
                  padding: "10px 10px 10px 0",
                  alignSelf: "end",
                  margin: "20px 0 10px 0"
                }
                : { height: "86%", overflowY: "auto", }
            }
          >
            <div
              className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0 w-100"
              style={{ backgroundColor: "#fdfdfd6e" }}
            >
              <Form
                form={form}
                layout="vertical"
                className="mt-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
              >
                <h5 className="font-size-4 font-weight-normal">Daily Rate</h5>
                <Form.Item
                  name="propertyPrice"
                  validateStatus={error ? "error" : undefined}
                  help={
                    error ||
                    `Enter the price in ${CurrencyEnum.USD} (including taxes, commission, and fees)`
                  }
                  className="w-100"
                >
                  <Input
                    size="large"
                    id="propertyPrice"
                    name="propertyPrice"
                    value={propertyPrice}
                    placeholder="Daily rate of  your property"
                    className="rounded-4 p-3 bg-transparent border border-secondary"
                    type="number"
                    min={0}
                    step={0.01}
                    onChange={handlePriceChange}
                  />
                </Form.Item>

                <Checkbox
                  checked={isMonthlyRateHave}
                  className="me-1 mt-3"
                  id="PsyAtPropertyCheckbox"
                  onChange={(e) => {
                    setIsMonthlyRateHave(e?.target?.checked);
                    if (!e?.target?.checked) {
                      setMonthlyPropertyPrice(0);
                      form.setFieldsValue({
                        monthlyPropertyPrice: 0,
                      });
                    }
                  }}
                >
                  <span className="font-weight-normal font-size-4">
                    Enable Monthly Pricing{" "}
                  </span>{" "}
                </Checkbox>

                {isMonthlyRateHave && (
                  <div className="w-100">
                    <h5 className="font-size-4 font-weight-normal mt-3">
                      Monthly Rate (≥ 30 Days – Excludes Utility Bills)
                    </h5>
                    <Form.Item
                      name="monthlyPropertyPrice"
                      validateStatus={monthlyPriceError ? "error" : undefined}
                      help={
                        monthlyPriceError ||
                        `Enter the price in ${CurrencyEnum.USD} (including taxes, commission, and fees)`
                      }
                      className="w-100"
                    >
                      <Input
                        size="large"
                        id="monthlyPropertyPrice"
                        name="monthlyPropertyPrice"
                        value={monthlyPropertyPrice}
                        placeholder="Monthly rate of  your property"
                        className="rounded-4 p-3 bg-transparent border border-secondary"
                        type="number"
                        step={0.01}
                        min={0}
                        onChange={handleMonthlyPriceChange}
                      />
                    </Form.Item>
                  </div>
                )}
                <h5 className="font-size-4 font-weight-semi-bold mt-4 ">
                  Commission Breakdown :
                </h5>

                <ul className="text-start">
                  <li>
                    {" "}
                    <h5 className="font-size-4 font-weight-semi-bold mb-0 ">
                      {commissionRate}% Serviced Apartments LK commission
                    </h5>
                    <ul className="text-start">
                      <li>24/7 support in your preferred language</li>
                      <li>Save time with automatically confirmed bookings</li>
                      <li>We promote your place on Google</li>
                    </ul>
                  </li>
                </ul>

                <Divider className="bg-secondary mb-3" />
                <h5 className="font-size-4 font-weight-semi-bold">
                  Daily Earnings Calculation
                </h5>
                <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                  Daily rate :
                  {propertyPrice >= 0 && (
                    <span className="font-weight-medium font-size-4 ms-1">
                      {CurrencyEnum.USD}{" "}
                      {(
                        propertyPrice
                      ).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  )}{" "}
                </h5>
                <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                  Your estimated earnings after fees :
                  {propertyPrice >= 0 && (
                    <span className="font-weight-semi-bold font-size-3 ms-1">
                      {CurrencyEnum.USD}{" "}
                      {(
                        propertyPrice -
                        (propertyPrice / 100) * commissionRate
                      ).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  )}{" "}
                </h5>
                {isMonthlyRateHave && (
                  <div className="w-100">
                    <Divider className="bg-secondary my-3" />
                    <h5 className="font-size-4 font-weight-semi-bold">
                      Monthly Earnings Calculation
                    </h5>

                    <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                      Monthly rate :
                      {monthlyPropertyPrice >= 0 && (
                        <span className="font-weight-medium font-size-4 ms-1">
                          {CurrencyEnum.USD}{" "}
                          {(
                            monthlyPropertyPrice
                          ).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" + Utility bills"}
                        </span>
                      )}
                    </h5>
                    {/* <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                      {CurrencyEnum.USD}{" "}
                      {monthlyPropertyPrice >= 0 && (
                        monthlyPropertyPrice + " x 30 = " + CurrencyEnum.USD + " " + monthlyPropertyPrice * 30
                      )}
                    </h5> */}
                    <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                      Your estimated earnings after fees :
                      {monthlyPropertyPrice >= 0 && (
                        <span className="font-weight-semi-bold font-size-3 ms-1">
                          {CurrencyEnum.USD}{" "}
                          {((
                            monthlyPropertyPrice -
                            (monthlyPropertyPrice / 100) * commissionRate
                          )).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )} {" + Utility bills"}
                        </span>
                      )}{" "}
                    </h5>
                  </div>
                )}
                <Divider className="bg-secondary mt-3" />
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
              size="large"
              type="default"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                if (
                  propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                  propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                  propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                  propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                ) {
                  history(`/property/04/${propertyId}`);
                } else {
                  history(`/property/05/${propertyId}`);
                }
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingPricePerNightToEntireProperty}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepPricePerNightToEntireProperty;
