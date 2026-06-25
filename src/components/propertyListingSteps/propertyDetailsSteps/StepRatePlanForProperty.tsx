import { Button, Checkbox, Col, Form, InputNumber, Row } from "antd";
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
import { User } from "react-feather";
import * as constants from "../../../common/constants";
import { Cookies } from "typescript-cookie";
import {
  addNewProperty,
  getPropertyById,
  updatePropertyCreateLastMainStep,
} from "../../../service/propertyListingService.ts";
import { useDispatch } from "react-redux";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum.ts";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import EditPriceModal from "../../common/modal/RatePlanModal.tsx";
import {
  PriceRatePlan,
  PriceRatePlanForEntireProperty,
} from "../../../common/interfaces/uiNecessaryInterface.ts";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum.ts";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum.ts";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum.ts";
import { CurrencyEnum } from "../../../common/enums/currencyEnum.ts";

const StepRatePlanForProperty = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [perNightRateList, setPerNightRateList] =
    useState<PriceRatePlanForEntireProperty>();
  const [perNightOverallDetails, setPerNightOverallDetails] = useState<{
    headCount: number;
    priceForMaxCount: number;
  }>();
  const [isRatePlaneAvailable, setIsRatePlaneAvailable] =
    useState<boolean>(false);

  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [guestCountOfProperty, setGuestCountOfProperty] = useState<number>(0);
  const [datesForBooking, setDatesForBooking] = useState<number>(0);
  const [priceForEntireProperty, setPriceForEntireProperty] =
    useState<number>(0);
  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    const unitId = parseInt(Cookies.get(constants.ROOM_ID) as string);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;

          setPropertyDetailsObject(dataObj);
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );

          setSelectedPropertyType(
            dataObj?.propertyType ? dataObj?.propertyType?.name : ""
          );

          if (
            dataObj?.priceForEntireProperty ||
            dataObj?.entirePropertyPrices
          ) {
            setPriceForEntireProperty(
              dataObj?.priceForEntireProperty
                ? dataObj?.priceForEntireProperty
                : 0
            );
            setGuestCountOfProperty(
              dataObj?.entirePropertyPrices?.maxHeadCount
                ? dataObj?.entirePropertyPrices?.maxHeadCount
                : 0
            );
            setDatesForBooking(
              dataObj?.entirePropertyPrices?.minBookingDays
                ? dataObj?.entirePropertyPrices?.minBookingDays
                : 0
            );

            form.setFieldsValue({
              guestCountOfProperty: dataObj?.entirePropertyPrices?.maxHeadCount
                ? dataObj?.entirePropertyPrices?.maxHeadCount
                : 0,
            });

            setPerNightOverallDetails({
              headCount: dataObj?.entirePropertyPrices?.maxHeadCount
                ? dataObj?.entirePropertyPrices?.maxHeadCount
                : 0,
              priceForMaxCount: 0,
            });



            const rates = dataObj?.entirePropertyPrices?.rates || [];
            const allRatesZero = rates.length > 0 && rates.every(rateObj => rateObj.rate === 0);

            setIsRatePlaneAvailable(!(rates.length === 0 || allRatesZero));



            let unitRates: PriceRatePlanForEntireProperty = { rates: [] };
            dataObj?.entirePropertyPrices?.rates &&
              dataObj?.entirePropertyPrices?.rates.length > 0
              ? (unitRates = {
                rates: dataObj?.entirePropertyPrices?.rates
                  .filter(
                    (priceObj: any) =>
                      priceObj.headCount !==
                      dataObj?.entirePropertyPrices?.maxHeadCount
                  )
                  .map((priceObj: any) => ({
                    headCount: priceObj.headCount,
                    rate: priceObj.rate,
                  })),
              })
              : (unitRates = {
                rates: Array.from(
                  {
                    length: dataObj?.entirePropertyPrices?.maxHeadCount
                      ? dataObj?.entirePropertyPrices?.maxHeadCount
                      : 0,
                  },
                  (_, index) => ({
                    headCount: index + 1,
                    rate: 0,
                  })
                ).filter(
                  (priceObj) =>
                    priceObj.headCount !==
                    dataObj?.entirePropertyPrices?.maxHeadCount
                ), // Exclude max head count
              });

            // Set state

            setPerNightRateList(unitRates);
          }

          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          history("/propertyNotFound");
          handleError(err);
        });
    }
  };

  const handleCreatePropertyListingRatePlan = () => {
    let isValidate = false;

    datesForBooking <= 0
      ? customToastMsg("Enter valid minimum dates for booking", 2)
      : guestCountOfProperty <= 0
        ? customToastMsg("Enter valid guest count", 2)
        : (isValidate = true);

    if (isValidate) {
      let priceRatePlan = {
        entirePropertyPrices: {
          minBookingDays: datesForBooking,
          maxHeadCount: guestCountOfProperty,
          rates: perNightRateList?.rates || [],
        },
      };

      const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(
        priceRatePlan,
        ListingStepsEnum.ENTIRE_PROPERTY_PRICES,
        propertyId
      )
        .then((response) => {
          popUploader(dispatch, false);
          if (
            propertyDetailsObject?.allowIndividualUnit &&
            propertyDetailsObject.propertyType?.name != PropertyTypesEnum.HOTEL
          ) {
            history(`/property/08/${propertyId}`);
            return;
          } else {
            history(`/property/09/${propertyId}`);
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

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (updatedData: any) => {
    setPerNightRateList(updatedData);
    setIsModalVisible(false);
  };

  const setPriceWhenChangeGuestCount = (guestCount: number) => {
    setPerNightOverallDetails((prev: any) => ({
      ...prev,
      headCount: guestCount,
    }));

    let unitPricesList: PriceRatePlanForEntireProperty = {
      rates: Array.from({ length: guestCount }, (_, index) => ({
        headCount: index + 1,
        rate: 0,
      })).filter((priceObj) => priceObj.headCount !== guestCount),
    };

    setPerNightRateList(unitPricesList);
  };

  return (
    <PropertyListing>
      <div className="StepRatePlanForPropertyContainer py-5 py-lg-0 h-100 w-100">
        {isModalVisible && (
          <EditPriceModal
            initialData={{
              headCount: perNightOverallDetails?.headCount || 1,
              price: perNightOverallDetails?.priceForMaxCount || 0,
            }}
            perNightRateList={perNightRateList ?? { rates: [] }}
            isVisible={isModalVisible}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
          />
        )}

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
                {">"} Step
                {propertyTypeKey === ""
                  ? ""
                  : propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                    propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                    ? " 06"
                    : " 07"}
              </h2>
              <h1 className="font-weight-medium font-size-1">
                What is the rate plans for your property?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Provide clear pricing details for the property to help guests
                choose the best option for their stay
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
            className="py-0 py-lg-4 py-xl-0"
            style={
              isRatePlaneAvailable
                ? {
                  height: "86%",
                  overflowY: "auto",
                  padding: "10px 10px 10px 0",
                  alignSelf: "end",
                  margin: "20px 0 10px 0"
                }
                : undefined
            }
          >
            <Form form={form} layout="vertical" className="w-100">
              <div
                className="py-2 pb-4 px-4 rounded-4 border border-white my-4 my-lg-0 w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-4 font-weight-normal mt-3">
                  Minimum dates for booking?
                </h5>
                <Form.Item name="datesForBooking" style={{ width: "150px" }}>
                  <div className="d-flex align-items-center border border-secondary rounded-3">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setDatesForBooking((prev) => Math.max(1, prev - 1));
                      }}
                    >
                      -
                    </button>
                    <InputNumber
                      style={{ width: "80px" }}
                      min={1}
                      max={500}
                      type="number"
                      size="large"
                      value={datesForBooking}
                      defaultValue={0}
                      className="bg-transparent"
                      bordered={false}
                      onChange={(e) => {
                        setDatesForBooking(Number(e));
                      }}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setDatesForBooking((prev) => Math.min(500, prev + 1));
                      }}
                    >
                      +
                    </button>
                  </div>
                </Form.Item>
                <h5 className="font-size-4 font-weight-normal mt-3">
                  How many guests can stay ?
                </h5>
                <Form.Item
                  name="guestCountOfProperty"
                  initialValue={0}
                  style={{ width: "150px" }}
                >
                  <div className="d-flex align-items-center border border-secondary rounded-3">
                    {/* Decrease Button */}
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        const currentValue = form.getFieldValue(
                          "guestCountOfProperty"
                        );
                        const newValue = Math.max(1, currentValue - 1);
                        form.setFieldsValue({ guestCountOfProperty: newValue });
                        setGuestCountOfProperty(newValue);
                        setPriceWhenChangeGuestCount(newValue);
                      }}
                    >
                      -
                    </button>

                    {/* Input Number */}
                    <InputNumber
                      style={{ width: "80px" }}
                      min={1}
                      max={500}
                      type="number"
                      size="large"
                      className="bg-transparent"
                      bordered={false}
                      value={form.getFieldValue("guestCountOfProperty")}
                      onChange={(value) => {
                        form.setFieldsValue({
                          guestCountOfProperty: value || 0,
                        });
                        setGuestCountOfProperty(value);
                        setPriceWhenChangeGuestCount(value);
                      }}
                    />

                    {/* Increase Button */}
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        const currentValue = form.getFieldValue(
                          "guestCountOfProperty"
                        );
                        const newValue = Math.min(500, currentValue + 1);
                        form.setFieldsValue({ guestCountOfProperty: newValue });
                        setGuestCountOfProperty(newValue);
                        setPriceWhenChangeGuestCount(newValue);
                      }}
                    >
                      +
                    </button>
                  </div>
                </Form.Item>
              </div>

              <Checkbox
                checked={isRatePlaneAvailable}
                className="me-1 mt-4"
                onChange={(e) => {
                  setIsRatePlaneAvailable(e?.target?.checked);
                  if (!e?.target?.checked) {
                    setPriceWhenChangeGuestCount(guestCountOfProperty);
                  }
                }}
              >
                <span className="font-weight-normal font-size-4">
                  Enable rate plans{" "}
                </span>{" "}
              </Checkbox>

              {isRatePlaneAvailable && (
                <div>
                  <h5 className="font-weight-medium font-size-3 mb-3 mt-4">
                    Standard rate plan
                  </h5>
                  <div
                    className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0 w-100 d-flex flex-column align-items-center align-items-lg-start"
                    style={{ backgroundColor: "#fdfdfd6e" }}
                  >
                    <div className="w-100">
                      <Row className="w-100 d-flex flex-column-reverse flex-sm-row">
                        <Col
                          xs={24}
                          sm={18}
                          md={19}
                          lg={18}
                          xl={20}
                          xxl={21}
                          className="d-flex justify-content-center justify-content-sm-start align-items-end"
                        >
                          <h5
                            className="font-size-4 font-weight-medium "
                            style={{
                              marginTop:
                                perNightOverallDetails?.headCount &&
                                  perNightOverallDetails?.headCount > 1
                                  ? "0"
                                  : "10px",
                            }}
                          >
                            Price per group size
                          </h5>
                        </Col>
                        <Col
                          xs={24}
                          sm={6}
                          md={5}
                          lg={6}
                          xl={4}
                          xxl={3}
                          className="d-flex justify-content-end align-items-center"
                        >
                          {perNightOverallDetails?.headCount &&
                            perNightOverallDetails?.headCount > 1 ? (
                            <Button
                              size="large"
                              className="w-100 my-3 my-sm-2  rounded-3"
                              onClick={() => {
                                setIsModalVisible(true);
                              }}
                            >
                              Edit
                            </Button>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>

                      <p className="font-size-5 primary-color">
                        You're 12% more likely to get bookings if you offer
                        reduced rates for smaller groups of guests.
                      </p>

                      <Row className="w-100 mb-2">
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                          <h5 className="font-size-4 font-weight-medium ">
                            Guest Count
                          </h5>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                          <h5 className="font-size-4 font-weight-medium ">
                            Price
                          </h5>
                        </Col>
                      </Row>

                      {perNightRateList?.rates?.map((rateList: any) => (
                        <Row className="w-100 d-flex align-items-center">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <h5 className="font-size-4 font-weight-normal ">
                              <User size={25} className="me-2" /> X{" "}
                              {rateList.headCount}
                            </h5>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <h5 className="font-size-4 font-weight-medium ">
                              {rateList.rate} % off
                            </h5>
                          </Col>
                        </Row>
                      ))}
                      <Row className="w-100 d-flex align-items-center">
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                          <h5 className="font-size-4 font-weight-normal text-secondary ">
                            <User size={25} className="me-2" /> X{" "}
                            {perNightOverallDetails?.headCount &&
                              perNightOverallDetails.headCount}
                          </h5>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                          {/* <h5 className="font-size-4 font-weight-medium text-secondary">
                        Standard Rate
                      </h5> */}
                          <h5 className="font-size-4 font-weight-medium text-secondary">
                            {perNightOverallDetails &&
                              perNightOverallDetails.headCount > 0
                              ? perNightOverallDetails.priceForMaxCount
                              : 0}{" "}
                            % off
                          </h5>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              )}
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
                history(`/property/06/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingRatePlan}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepRatePlanForProperty;
