import { Button, Col, Divider, Form, InputNumber, Row, Select } from "antd";
import "../../styles/propertyListingStyles.scss";
import "../../styles/calenderStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../common/commonFunctions";
import { useDispatch } from "react-redux";
import {
  DiscountDetailsObj,
  DropdownObj,
  SelectedCalenderDateObject,
} from "../../common/interfaces/uiNecessaryInterface";
import {
  changeCalendarPricesAccordingToDates,
  getCalenderPricesAccordingToDates,
} from "../../service/calendarService";
import { Calendar } from "react-feather";
import { EditOutlined } from "@ant-design/icons";
import DiscountTypeCard from "../common/cards/DiscountTypeCard";
import { CurrencyEnum } from "../../common/enums/currencyEnum";
import { DiscountTypeEnum } from "../../common/enums/discountTypeEnum";
import dayjs from "dayjs";
import {
  changeDiscountValues,
  changeDurationalDiscountValues,
  getAllDiscounts,
  getAllDurationalDiscountTypes,
  getCalendarDiscountRoomCategories,
  removeDiscountValues,
} from "../../service/discountService";
import moment from "moment";
import { label } from "framer-motion/client";
import DurationalDiscountFormRepeater from "./sections/DurationalDiscountFormRepeater";
import { DurationalDiscountObj } from "../../common/interfaces/apiNecessaryInterface";

interface DiscountsTabProps {
  propertyId: number;
  selectedDates: SelectedCalenderDateObject[];
  isOnlyPropertyOwner: boolean;
  loadCalenderDated: () => void;
  loadCalenderPricers: () => void;
}

const DiscountsTab: React.FC<DiscountsTabProps> = ({
  propertyId,
  selectedDates,
  isOnlyPropertyOwner,
  loadCalenderDated,
  loadCalenderPricers,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const startOfMonth = dayjs().startOf("month").startOf("day");
  const endOfMonth = dayjs().endOf("month").endOf("day");

  const [priceRange, setPriceRange] = useState<string>();
  const [discountPriceRange, setDiscountPriceRange] = useState<string>();
  const [selectedRoomCategory, setSelectedRoomCategory] = useState<number>();
  const [roomCategoryList, setRoomCategoryList] = useState<DropdownObj[]>([]);
  const [selectedDiscount, setSelectedDiscount] =
    useState<DiscountDetailsObj>();
  const [discountList, setDiscountList] = useState<DiscountDetailsObj[]>([]);
  const [durationalDiscountTypeList, setDurationalDiscountTypeList] = useState<DropdownObj[]>([]);

  const [propertyPrice, setPropertyPrice] = useState<number>();
  const [discountRate, setDiscountRate] = useState<number>();
  const [beforeArrivalTime, setBeforeArrivalTime] = useState<number>();

  const [isPriceEditable, setIsPriceEditable] = useState<boolean>(false);

  const [selectedDateNames, setSelectedDateNames] =
    useState<string>("No dates selected");

  const [form] = Form.useForm();

  useEffect(() => {
    if (propertyId) {
      clearStatesWhenInitialTime();
      // console.log("Selected Dates:", selectedDates);
      gettingCalenderDiscountTabRoomCategories();
      const formattedDates = formatSelectedDates(selectedDates);
      // console.log("Formatted Dates:", formattedDates);
      setSelectedDateNames(formattedDates);
      loadAllDurationalDiscountTypes()
    }
  }, [selectedDates]);

  const clearStatesWhenInitialTime = () => {
    setRoomCategoryList([]);
    setSelectedRoomCategory(undefined);
    setSelectedDiscount(undefined);
    form.setFieldsValue({
      selectedDiscount: undefined,
      selectedRoomCategory: undefined,
      disableCheckbox: true,
      isPriceEditable: false,
    });
  };

  const loadAllDiscounts = (sleetedRoomAcc: number) => {
    popUploader(dispatch, true);
    getAllDiscounts(sleetedRoomAcc)
      .then((response: any) => {
        setDiscountList(response?.data);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const loadAllDurationalDiscountTypes = () => {
    popUploader(dispatch, true);
    getAllDurationalDiscountTypes()
      .then((response: any) => {
        let temp: DropdownObj[] = []
        response?.data.map((type: {
          id: number,
          days: number
        }) => {
          temp.push({
            value: type.id,
            label: type.days
          })
        })
        setDurationalDiscountTypeList(temp);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const gettingCalenderDiscountTabRoomCategories = () => {
    popUploader(dispatch, true);
    getCalendarDiscountRoomCategories(propertyId)
      .then((response: any) => {
        let temp: DropdownObj[] = [];
        response?.data.map((accUnit: { id: number; name: string }) => {
          temp.push({
            value: accUnit.id,
            label: accUnit.name,
          });
        });
        setRoomCategoryList(temp);
        if (temp.length > 0) {
          // console.log(temp[0].value);

          setSelectedRoomCategory(Number(temp[0].value));
          form.setFieldsValue({
            selectedRoomCategory: temp[0].value,
          });
          getPricesOfRoomCategory(Number(temp[0].value));
          !isOnlyPropertyOwner && loadAllDiscounts(Number(temp[0].value));
        }

        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const getPricesOfRoomCategory = (selectedRoomCategory: number) => {
    let startDate = "";
    let endDate = "";

    let data = {};

    if (selectedDates && selectedDates.length > 0) {
      data = {
        accommodationUnitId: selectedRoomCategory,
        dateRange: selectedDates,
      };
    } else {
      startDate = startOfMonth.format("YYYY-MM-DDTHH:mm:ss");
      endDate = endOfMonth.format("YYYY-MM-DDTHH:mm:ss");
      data = {
        accommodationUnitId: selectedRoomCategory,
        dateRange: [
          {
            startDate: startDate,
            endDate: endDate,
          },
        ],
      };
    }

    popUploader(dispatch, true);

    getCalenderPricesAccordingToDates(data)
      .then((response: any) => {
        processRoomCategoryPrices(response?.data?.events);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const formatPriceValue = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatPriceRangeDisplay = (range?: string) => {
    if (!range) return formatPriceValue(0);

    return range
      .split(" - ")
      .map((part) => {
        const numericValue = Number(part);
        return formatPriceValue(Number.isFinite(numericValue) ? numericValue : 0);
      })
      .join(" - ");
  };

  const processRoomCategoryPrices = (events: any[]) => {
    if (!events || events.length === 0) return;

    const prices: number[] = [];
    const discountPrices: number[] = [];

    events.forEach((event) => {
      const price =
        event.finalCalendarPrice && event.finalCalendarPrice !== 0
          ? event.finalCalendarPrice
          : event.standardPrice;
      const numericPrice = Number(price);

      if (Number.isFinite(numericPrice) && numericPrice !== 0) {
        prices.push(numericPrice);
      }
    });

    events.forEach((event) => {
      const dPrices =
        event.discountedPrice &&
        event.discountedPrice !== 0 &&
        event.discountedPrice;
      const numericDiscountPrice = Number(dPrices);

      if (Number.isFinite(numericDiscountPrice) && numericDiscountPrice !== 0) {
        discountPrices.push(numericDiscountPrice);
      }
    });

    const getRange = (arr: number[]) => {
      if (arr.length === 0) return null;
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return min === max ? `${min}` : `${min} - ${max}`;
    };

    const nextPriceRange = getRange(prices);
    const nextDiscountPriceRange = getRange(discountPrices);

    setPriceRange(nextPriceRange ?? undefined);
    setDiscountPriceRange(nextDiscountPriceRange ?? undefined);

    const propertyPrice = nextPriceRange
      ? Number(nextPriceRange.split(" - ")[0])
      : 0;
    setPropertyPrice(propertyPrice);

    form.setFieldsValue({
      propertyPrice: propertyPrice,
    });

    popUploader(dispatch, false);
  };

  const handleAccommodationUnitChange = (value: number | undefined) => {
    setSelectedRoomCategory(value);
    value && getPricesOfRoomCategory(value);
    !isOnlyPropertyOwner && value && loadAllDiscounts(value);
  };

  const formatSelectedDates = (selectedDates: SelectedCalenderDateObject[]) => {
    if (!selectedDates || selectedDates.length === 0)
      return "No dates selected";

    // Sort dates in ascending order and normalize timezones
    const sortedDates = selectedDates
      .map((date) => ({
        startDate: new Date(
          Date.UTC(
            new Date(date.startDate).getFullYear(),
            new Date(date.startDate).getMonth(),
            new Date(date.startDate).getDate()
          )
        ),
        endDate: new Date(
          Date.UTC(
            new Date(date.endDate).getFullYear(),
            new Date(date.endDate).getMonth(),
            new Date(date.endDate).getDate()
          )
        ),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    if (sortedDates.length === 1) {
      return sortedDates[0].startDate.toISOString().split("T")[0];
    }

    // Group dates by month
    const groupedByMonth: Record<string, Date[]> = {};
    sortedDates.forEach(({ startDate }) => {
      const key = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`; // Month is 0-based, so +1
      if (!groupedByMonth[key]) groupedByMonth[key] = [];
      groupedByMonth[key].push(startDate);
    });

    const formattedOutput: string[] = [];

    // Loop through grouped months and generate output
    Object.entries(groupedByMonth).forEach(([key, dates]) => {
      const [year, month] = key.split("-").map(Number);
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });

      dates.sort((a, b) => a.getTime() - b.getTime()); // Ensure sorting

      // Get total days in the selected month
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      const selectedDays = new Set(dates.map((date) => date.getDate()));

      // If all days in the month are selected, show only the month name
      if (selectedDays.size === totalDaysInMonth) {
        formattedOutput.push(`All days in ${monthName} ${year}`);
        return; // Skip further processing for this month
      }

      const formattedRanges: string[] = [];
      let startRange = dates[0];
      let endRange = dates[0];

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        prevDate.setDate(prevDate.getDate() + 1); // Move to the next day

        if (dates[i].getTime() === prevDate.getTime()) {
          endRange = dates[i]; // Extend the range
        } else {
          // If not sequential, push the previous range and start a new one
          formattedRanges.push(
            startRange.getTime() === endRange.getTime()
              ? startRange.toISOString().split("T")[0]
              : `${startRange.toISOString().split("T")[0]} to ${endRange.toISOString().split("T")[0]
              }`
          );
          startRange = dates[i];
          endRange = dates[i];
        }
      }

      // Push the last range
      formattedRanges.push(
        startRange.getTime() === endRange.getTime()
          ? startRange.toISOString().split("T")[0]
          : `${startRange.toISOString().split("T")[0]} to ${endRange.toISOString().split("T")[0]
          }`
      );

      formattedOutput.push(`${formattedRanges.join(", ")}`);
    });

    return formattedOutput.join(", ");
  };

  const handleRoomCategoryPriceChangeInCalendar = () => {
    let isValidate = false;

    propertyPrice === undefined
      ? customToastMsg("Enter valid price", 2)
      : propertyPrice <= 0
        ? customToastMsg("Enter valid price", 2)
        : (isValidate = true);

    if (isValidate) {
      const payload = {
        accommodationUnitId: selectedRoomCategory,
        priceDetails: {
          price: propertyPrice,
          dateRange: selectedDates,
        },
      };
      popUploader(dispatch, true);
      changeCalendarPricesAccordingToDates(payload)
        .then(() => {
          customToastMsg("Price updated successfully", 1);
          setIsPriceEditable(false);
          getPricesOfRoomCategory(selectedRoomCategory);
          loadCalenderPricers();
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    }
  };

  const handleDiscountValues = () => {
    if (selectedRoomCategory === undefined) {
      customToastMsg("Please select a room category before proceeding.", 2);
      return;
    }
    if (selectedDiscount === undefined) {
      customToastMsg("Please select a discount type.", 2);
      return;
    }

    let isValidate = false;

    (selectedDiscount?.discount?.discountType === DiscountTypeEnum.EARLY_BIRD ||
      selectedDiscount?.discount?.discountType ===
      DiscountTypeEnum.LAST_MINUTE) &&
      beforeArrivalTime === undefined
      ? customToastMsg("Enter valid arrival time", 2)
      : discountRate === undefined
        ? customToastMsg("Enter valid discount rate", 2)
        : (isValidate = true);

    if (isValidate) {
      const payload = {
        discountId: selectedDiscount?.discount?.id,
        // startDate: "2024-10-01T10:00:00", // optional
        // endDate: "2024-10-10T18:00:00", // optional
        value: discountRate!,
        hourCount:
          selectedDiscount?.discount?.discountType ===
            DiscountTypeEnum.EARLY_BIRD ||
            selectedDiscount?.discount?.discountType ===
            DiscountTypeEnum.LAST_MINUTE
            ? beforeArrivalTime
            : undefined,
      };

      popUploader(dispatch, true);
      changeDiscountValues(selectedRoomCategory, payload)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Discount values changed successfully", 1);
          setIsPriceEditable(false);
          setSelectedDiscount(undefined);
          !isOnlyPropertyOwner && loadAllDiscounts(selectedRoomCategory);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    }
  };

  const handleDurationalDiscountValues = (payload: DurationalDiscountObj) => {
    if (selectedRoomCategory === undefined) {
      customToastMsg("Please select a room category before proceeding.", 2);
      return;
    }

    let isValidate = true;

    // Check for duplicate discountDurationId
    const ids = payload.durationDetails.map(d => d.discountDurationId);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);

    if (hasDuplicates) {
      customToastMsg("You chose the same value multiple times in number of dates .", 2);
      isValidate = false;
    }

    // Check for invalid or missing values
    const hasInvalidValues = payload.durationDetails.some(
      d => d.value === undefined || d.value === null || isNaN(Number(d.value))
    );

    if (hasInvalidValues) {
      customToastMsg("Enter valid discount rate for all durations.", 2);
      isValidate = false;
    }

    if (isValidate) {
      popUploader(dispatch, true);
      changeDurationalDiscountValues(payload, selectedRoomCategory,)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Discount values changed successfully", 1);
          setIsPriceEditable(false);
          setSelectedDiscount(undefined);
          !isOnlyPropertyOwner && loadAllDiscounts(selectedRoomCategory);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    }
  };

  const handleRemoveAddedDiscount = (disId: number) => {
    if (selectedRoomCategory === undefined) {
      customToastMsg("Please select a room category before proceeding.", 2);
      return;
    }

    const payload = {
      discountId: disId,
      accommodationUnitId: selectedRoomCategory,
    };

    customSweetAlert("Are you sure to remove this discount ?", 4, () => {
      popUploader(dispatch, true);
      removeDiscountValues(payload)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Discount removed successfully", 1);
          setIsPriceEditable(false);
          setSelectedDiscount(undefined);
          !isOnlyPropertyOwner && loadAllDiscounts(selectedRoomCategory);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    });
  };

  return (
    <div className="DiscountsTabContainer content-center-input-parent  h-100 w-100">
      <Row className="w-100 h-100">
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          xxl={24}
          className="h-100 w-100"
        >
          {" "}
          {propertyId ? (
            <Form form={form} layout="vertical" className="w-100">
              <div className="d-flex">
                <h5 className="font-size-4 font-weight-normal text-gray-secondary m-0 ">
                  {selectedDates.length > 1 ? " Dates " : "Date "}:{" "}
                </h5>
                <h5 className="font-size-4 font-weight-normal text-gray-secondary m-0 ms-2 ">
                  {/* {selectedDateNames} */}
                  {selectedDateNames.split(",").map((date, index, arr) => (
                    <span key={index}>
                      {date.trim()}
                      {index !== arr.length - 1 ? " ," : ""}
                      <br />
                    </span>
                  ))}
                </h5>
              </div>

              {!selectedDiscount && selectedRoomCategory && (
                <Form.Item
                  name="selectedRoomCategory"
                  label=""
                  className="w-100 mt-3"
                >
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    defaultValue={
                      roomCategoryList.length > 0
                        ? roomCategoryList[0].value
                        : undefined
                    }
                    value={selectedRoomCategory}
                    showSearch
                    // allowClear
                    placeholder="Select category"
                    optionFilterProp="label"
                    onChange={(value) => {
                      handleAccommodationUnitChange(Number(value));
                    }}
                    options={roomCategoryList}
                  />
                </Form.Item>
              )}

              {/* Price edit card start */}
              {!selectedDiscount && (
                <div className="discounts-tab-container mt-3">
                  <div
                    className={`flip-card ${isPriceEditable ? "flipped" : ""}`}
                  >
                    {/* Front Side */}
                    <div className="flip-card-front">
                      <Row className="d-flex mt-3 d-flex align-items-center">
                        <Col xs={24} className="d-flex justify-content-center">
                          <h5 className="font-size-2 font-weight-normal text-center mt-2 mb-3">
                            {CurrencyEnum.USD} {formatPriceRangeDisplay(priceRange)}
                          </h5>
                          {/* </Col> */}
                          {/* <Col xs={4} className="d-flex justify-content-end"> */}
                          {!isOnlyPropertyOwner && selectedDates.length > 0 && (
                            <EditOutlined
                              className="ms-4"
                              style={{ fontSize: 22, cursor: "pointer" }}
                              onClick={() => {
                                setIsPriceEditable(true);
                              }}
                            />
                          )}
                        </Col>
                        {discountPriceRange && (
                          <Col xs={24}>
                            <h5 className="font-size-4 font-weight-normal text-center text-gray">
                              {discountPriceRange} {CurrencyEnum?.USD} with
                              discounts
                            </h5>
                          </Col>
                        )}
                      </Row>
                    </div>

                    {/* Back Side */}
                    <div className="flip-card-back">
                      <Row className="my-1">
                        <Form.Item
                          name="propertyPrice"
                          label=""
                          className="w-100"
                        >
                          <InputNumber
                            name="propertyPrice"
                            size="large"
                            className="w-100"
                            value={propertyPrice ?? 0}
                            min={0}
                            step={0.01}
                            onChange={(value) => {
                              // setPropertyPrice(Math.floor(value || 0))
                              const newValue = value ?? 0; // Ensure it's never undefined
                              setPropertyPrice(newValue);
                              form.setFieldValue("propertyPrice", newValue);
                            }}
                            addonAfter={CurrencyEnum.USD}
                          />
                        </Form.Item>

                        <Row className="my-1 w-100">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={24}
                            xl={24}
                            xxl={24}
                            className="pe-0 pe-md-2 pe-lg-0 my-2"
                          >
                            <Button
                              onClick={() => {
                                handleRoomCategoryPriceChangeInCalendar();
                              }}
                              size="large"
                              type="primary"
                              className="w-100"
                            >
                              Save
                            </Button>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={24}
                            xl={24}
                            xxl={24}
                            className="ps-0 ps-md-2 ps-lg-0 my-2"
                          >
                            <Button
                              onClick={() => {
                                setIsPriceEditable(false);
                                const resetValue = priceRange
                                  ? Number(priceRange.split(" - ")[0])
                                  : 0;
                                setPropertyPrice(resetValue);
                                form.setFieldValue("propertyPrice", resetValue);
                              }}
                              size="large"
                              type="default"
                              className="w-100"
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                </div>
              )}
              {/* Price edit card end */}

              {/* Discount section start */}
              {selectedDates.length === 0 && (
                <div
                  className={`smooth-transition ${!isPriceEditable && !selectedDiscount ? "show" : ""
                    }`}
                >
                  <Divider />
                  {!isOnlyPropertyOwner && <h5 className="font-size-4 secondary-color mb-2 mx-2">
                    Discounts
                  </h5>}
                  {!isOnlyPropertyOwner && discountList &&
                    discountList.map(
                      (discount: DiscountDetailsObj, index: number) => {
                        return (
                          <DiscountTypeCard
                            key={index}
                            discountData={discount}
                            // typeColor="#1EB200"
                            handleSelectDiscount={(
                              selectedDiscount: DiscountDetailsObj
                            ) => {
                              // console.log(selectedDiscount);
                              setSelectedDiscount(selectedDiscount);
                              // if (selectedDiscount?.alreadyApplied) {

                              setDiscountRate(
                                selectedDiscount?.discount?.value
                              );
                              setBeforeArrivalTime(
                                selectedDiscount?.discount?.hourCount
                              );
                              form.setFieldsValue({
                                discountRate: selectedDiscount?.discount?.value,
                                beforeArrivalTime:
                                  selectedDiscount?.discount?.hourCount,
                              });
                              // } else {
                              //   setBeforeArrivalTime(undefined);
                              //   setDiscountRate(undefined);
                              //   form.setFieldsValue({
                              //     discountRate: undefined,
                              //     beforeArrivalTime: undefined,
                              //   });
                              // }
                            }}
                            handleRemoveDiscount={(
                              selectedDiscountId: number
                            ) => {
                              handleRemoveAddedDiscount(selectedDiscountId);
                            }}
                          />
                        );
                      }
                    )}
                </div>
              )}

              <div
                className={`smooth-transition ${selectedDiscount != undefined ? "show" : ""
                  }`}
              >
                {selectedDiscount != undefined && (
                  <Row className="mt-3">
                    <h5 className="font-size-2 font-weight-normal text-center mt-2 mb-1 w-100">
                      {selectedDiscount?.discount?.name}
                    </h5>

                    <p className="font-size-4 font-weight-normal text-center mb-3 w-100 text-gray">
                      {selectedDiscount?.discount?.description}
                    </p>
                    {selectedDiscount.discount.discountType === DiscountTypeEnum.DURATIONAL
                      ? <DurationalDiscountFormRepeater durationalDiscountList={durationalDiscountTypeList} selectedDiscount={selectedDiscount} onSave={(data) => {
                        handleDurationalDiscountValues(data)
                      }} onCancel={() => {
                        setIsPriceEditable(false);
                        setSelectedDiscount(undefined);
                      }} />
                      : <div className="w-100">
                        {selectedDiscount?.discount?.discountType ===
                          DiscountTypeEnum.SEASONAL && (
                            <p className="font-size-6 font-weight-normal mb-2 w-100">
                              Date Range :{" "}
                              {moment(selectedDiscount?.discount?.startDate).format(
                                "YYYY.MM.DD"
                              )}{" "}
                              -{" "}
                              {moment(selectedDiscount?.discount?.endDate).format(
                                "YYYY.MM.DD"
                              )}
                            </p>
                          )}
                        {(selectedDiscount?.discount?.discountType ===
                          DiscountTypeEnum.EARLY_BIRD ||
                          selectedDiscount?.discount?.discountType ===
                          DiscountTypeEnum.LAST_MINUTE) && (
                            <Form.Item
                              name="beforeArrivalTime"
                              label={
                                selectedDiscount?.discount?.discountType ===
                                  DiscountTypeEnum.EARLY_BIRD
                                  ? "Days before arrival"
                                  : selectedDiscount?.discount?.discountType ===
                                    DiscountTypeEnum.LAST_MINUTE
                                    ? "Hours before arrival"
                                    : ""
                              }
                              className="w-100 my-2"
                            >
                              <InputNumber
                                size="large"
                                className="w-100"
                                value={beforeArrivalTime}
                                min={1}
                                type="number"
                                placeholder={
                                  selectedDiscount?.discount?.discountType ===
                                    DiscountTypeEnum.EARLY_BIRD
                                    ? "Enter days before arrival"
                                    : selectedDiscount?.discount?.discountType ===
                                      DiscountTypeEnum.LAST_MINUTE
                                      ? "Enter hours before arrival"
                                      : ""
                                }
                                onChange={(value) => {
                                  if (value && value >= 1) {
                                    setBeforeArrivalTime(value);
                                  } else {
                                    setBeforeArrivalTime(1);
                                  }
                                }}
                              />
                            </Form.Item>
                          )}
                        <Form.Item
                          name="discountRate"
                          label="Discount"
                          className="w-100 my-2"
                        >
                          <InputNumber
                            disabled={!selectedDiscount?.discount?.valueEditable}
                            size="large"
                            className="w-100 "
                            value={discountRate}
                            placeholder="Enter discount"
                            min={1}
                            max={100}
                            type="number"
                            // onChange={(value) =>
                            //   setDiscountRate(Math.floor(value || 0))
                            // }
                            onChange={(value) => {
                              const sanitizedValue = Math.floor(value || 1);
                              if (sanitizedValue < 1) {
                                setDiscountRate(1);
                              } else {
                                setDiscountRate(sanitizedValue);
                              }
                            }}
                            addonAfter={"%"}
                          />
                        </Form.Item>

                        <Row className="my-1 w-100">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={24}
                            xl={24}
                            xxl={24}
                            className="pe-0 pe-md-2 pe-lg-0 my-2"
                          >
                            <Button
                              onClick={() => {
                                handleDiscountValues();
                              }}
                              disabled={!selectedDiscount?.discount?.valueEditable}
                              size="large"
                              type="primary"
                              className="w-100"
                            >
                              Save
                            </Button>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={24}
                            xl={24}
                            xxl={24}
                            className="ps-0 ps-md-2 ps-lg-0 my-2"
                          >
                            <Button
                              onClick={() => {
                                setIsPriceEditable(false);
                                setSelectedDiscount(undefined);
                              }}
                              size="large"
                              type="default"
                              className="w-100"
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </div>}
                  </Row>
                )}
              </div>

              {/* Discount section end */}


            </Form>
          ) : (
            <div className="w-100 h-100">
              <div
                className="my-2 d-flex flex-column justify-content-center align-items-center text-center"
                style={{ height: 580, backgroundColor: "#FFF5F5" }}
              >
                <Calendar
                  className="font-size-5 primary-color mb-2"
                  strokeWidth={1.6}
                />
                <h5 className="font-size-5 primary-color font-weight-normal px-2 px-lg-5">
                  Please select property.
                </h5>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DiscountsTab;
