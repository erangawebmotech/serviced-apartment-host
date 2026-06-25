import NavBar from "../components/NavBar";
import "../styles/reservation/reservationManagementStyles.scss";
import "../styles/listning/listningStyles.scss";
import "../styles/commonStyles.scss";
import Footer from "../components/Footer";
import filter from "../assets/images/mi_filter.png";
import { useEffect, useRef, useState } from "react";
import closeIcon from "../assets/images/close_29dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
  removeCookie,
  setEncryptedCookie,
} from "../common/commonFunctions";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Empty,
  Input,
  Pagination,
  PaginationProps,
  Popover,
  Row,
  Select,
  Typography,
} from "antd";
import { Cookies } from "typescript-cookie";
import { useNavigate } from "react-router-dom";
import * as constants from "../common/constants";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  DropdownObj,
  DropdownObjThree,
  DropdownObjTwo,
  EarningsDetailsObj,
  EarningsSummeryDataObj,
  EarningsSummeryDetails,
  EarningsTableDataObj,
} from "../common/interfaces/uiNecessaryInterface";
import { getAllPropertyListToDropdown } from "../service/listningService";
import dayjs from "dayjs";
import { MoreVertical } from "react-feather";
import { Dayjs } from "dayjs";
import { PaymentStatusEnum } from "../common/enums/paymentStatusEnum";
import {
  getAllEarnings,
  getAllEarningsFiltration,
  getEarningsSummeryWithFiltration,
} from "../service/earningsService";
import { PaymentTypeEnum } from "../common/enums/paymentTypeEnum";
import { SettlementStatusEnum } from "../common/enums/settlementStatusEnum";
import { CurrencyEnum } from "../common/enums/currencyEnum";
import EarningsRecodeCard from "../components/common/cards/EarningsRecodeCard";
import enUS from "antd/es/locale/en_US";
import MainLayout from "../layout/MainLayout";
import { EarningSummeryFiltrationEnum } from "../common/enums/earningsSummeryFiltrationEnum";

const startOfMonth = dayjs().startOf("month").startOf("day");
const endOfMonth = dayjs().endOf("month").endOf("day");

const { Search } = Input;
const EarningsManagementPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { RangePicker } = DatePicker;

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [earningsList, setEarningsList] = useState<EarningsDetailsObj[]>([]);

  // filtration
  const [searchReservationCode, setSearchReservationCode] =
    useState<string>("");
  const [selectedDateRanges, setSelectedDateRanges] =
    useState<[Dayjs | null | undefined, Dayjs | null | undefined]>([startOfMonth, endOfMonth]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | string>(
    ""
  );
  const [userPropertyList, setUserPropertyList] = useState<DropdownObjThree[]>();
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("");
  const [paymentStatusList, setPaymentStatusList] = useState<DropdownObj[]>();
  const [selectedSettlementStatus, setSelectedSettlementStatus] =
    useState<string>("");
  const [settlementStatusList, setSettlementStatusList] =
    useState<DropdownObj[]>();
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [paymentTypeList, setPaymentTypeList] = useState<DropdownObj[]>();

  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [earningsSummeryDetails, setEarningsSummeryDetails] =
    useState<EarningsSummeryDetails[]>();
  const [selectedSummeryCard, setSelectedSummeryCard] = useState<string>("");


  /*pagination */
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalRecodes, setTotalRecodes] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState(20);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // useEffect(() => {
  //   console.log(selectedSummeryCard);
  // }, [selectedSummeryCard]);

  useEffect(() => {
    // loadAllEarnings(0, 20);
    setPaymentStatusList([
      { value: PaymentStatusEnum.PENDING, label: "Pending" },
      { value: PaymentStatusEnum.SUCCESS, label: "Success" },
      { value: PaymentStatusEnum.FAILED, label: "Failed" },
      { value: PaymentStatusEnum.CANCELLED, label: "Cancel" },
    ]);
    setSettlementStatusList([
      { value: SettlementStatusEnum.Settled, label: "Settled" },
      { value: SettlementStatusEnum.NotSettled, label: "Not Settled" },
    ]);
    setPaymentTypeList([
      { value: PaymentTypeEnum.CARD, label: "Card" },
      { value: PaymentTypeEnum.PAY_AT_PROPERTY, label: "Pay at property" },
    ]);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      getAllUserProperties();
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    handleEarningsFiltration(
      searchReservationCode,
      selectedSummeryCard,
      selectedPropertyId,
      selectedDateRanges,
      // selectedSettlementStatus,
      // selectedPaymentStatus,
      selectedPaymentType,
      currentPage,
      pageLimit
    );
  }, [currentPage]);

  useEffect(() => {
    handleEarningsFiltration(
      searchReservationCode,
      selectedSummeryCard,
      selectedPropertyId,
      selectedDateRanges,
      // selectedSettlementStatus,
      // selectedPaymentStatus,
      selectedPaymentType,
      0,
      pageLimit
    );
  }, [pageLimit]);

  const getAllUserProperties = () => {
    popUploader(dispatch, true);
    getAllPropertyListToDropdown()
      .then((response: any) => {
        let temp: DropdownObjThree[] = [];
        response?.data.map((property: any) => {
          temp.push({
            value: property?.id,
            label: `${property?.name} - ${property?.propertyType?.name}`, // for search
            customLabel: (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={property?.file?.smallPath} height={20} width={20} />
                {property?.name} - {property?.propertyType?.name}
              </div>
            ),
          });
        });
        setUserPropertyList(temp);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const loadAllEarnings = (currentPage: number, pageLimit: number) => {
    popUploader(dispatch, true);
    getAllEarnings(currentPage, pageLimit)
      .then((response: any) => {
        setEarningsList(response?.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalRecodes(response.pagination.totalCount);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const handleEarningsFiltration = (
    reservationCode: string,
    earningSummery: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    // settlementStatus: boolean | string,
    // paymentStatus: string,
    paymentType: string,
    currentPage: number,
    pageLimit: number
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      earningsFiltration(
        reservationCode,
        earningSummery,
        propertyId,
        dateRange,
        // settlementStatus,
        // paymentStatus,
        paymentType,
        currentPage,
        pageLimit
      );
    }, 1000);
  };

  const earningsFiltration = (
    reservationCode: string,
    earningSummery: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    // settlementStatus: boolean | string,
    // paymentStatus: string,
    paymentType: string,
    currentPage: number,
    pageLimit: number
  ) => {

    getEarningsSummery(
      reservationCode,
      earningSummery,
      propertyId,
      dateRange,
      // settlementStatus,
      // paymentStatus,
      paymentType
    );

    if (
      reservationCode === "" &&
      earningSummery === "" &&
      propertyId === "" &&
      // settlementStatus === "" &&
      // paymentStatus === "" &&
      paymentType === "" &&
      (dateRange === undefined || dateRange === null)
    ) {
      loadAllEarnings(currentPage, pageLimit);
    } else {
      popUploader(dispatch, true);

      let startDate = "";
      let endDate = "";

      if (dateRange && dateRange.length === 2) {
        startDate = dateRange[0].format("YYYY-MM-DDTHH:mm:ss");
        endDate = dateRange[1].format("YYYY-MM-DDTHH:mm:ss");
      } else {
        startDate = startOfMonth.format("YYYY-MM-DDTHH:mm:ss");
        endDate = endOfMonth.format("YYYY-MM-DDTHH:mm:ss");
      }

      setEarningsList([]);

      let data = {
        propertyId: propertyId,
        earningSummery: earningSummery,
        reservationCode: reservationCode,
        checkin: startDate,
        checkout: endDate,
        // paymentStatus: paymentStatus,
        paymentType: paymentType,
        // settlementStatus: settlementStatus,
      };

      getAllEarningsFiltration(data, currentPage, pageLimit)
        .then((response: any) => {
          setEarningsList(response?.data);
          setCurrentPage(response.pagination.currentPage);
          setTotalRecodes(response.pagination.totalCount);
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    }
  };

  const getEarningsSummery = (
    reservationCode: string,
    earningSummery: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    // settlementStatus: boolean | string,
    // paymentStatus: string,
    paymentType: string
  ) => {
    popUploader(dispatch, true);

    let startDate = "";
    let endDate = "";

    if (dateRange && dateRange.length === 2) {
      startDate = dateRange[0].format("YYYY-MM-DDTHH:mm:ss");
      endDate = dateRange[1].format("YYYY-MM-DDTHH:mm:ss");
    }

    setEarningsList([]);

    let data = {
      propertyId: propertyId,
      earningSummery: earningSummery,
      reservationCode: reservationCode,
      checkin: startDate,
      checkout: endDate,
      // paymentStatus: paymentStatus,
      paymentType: paymentType,
      // settlementStatus: settlementStatus,
    };

    getEarningsSummeryWithFiltration(data)
      .then((response: any) => {
        const data: EarningsSummeryDataObj = response?.data
        const summaryBoxes: EarningsSummeryDetails[] = [

          {
            key: EarningSummeryFiltrationEnum.POTENTIAL,
            label: "Potential Earning",
            value: data?.totalPotential,
          },
          {
            key: EarningSummeryFiltrationEnum.UPCOMING,
            label: "Upcoming Amount",
            value: data?.totalUpcomingPrice,
          },
          {
            key: EarningSummeryFiltrationEnum.PAID,
            label: "Paid Amount",
            value: data?.totalPaidPrice,
          },
          // {
          //   key: EarningSummeryFiltrationEnum.CANCELLED,
          //   label: "Cancelled  Amount",
          //   value: data?.totalCancelledPrice,
          // },
          {
            key: "TOTAL_RESERVATION_COUNT",
            label: "Total Reservations Count",
            value: data?.totalReservationCount,
          },
          {
            key: "TOTAL_EARNED_PRICE",
            label: "Total Earnings",
            value: data?.totalEarnedPrice,
          },

        ];
        setEarningsSummeryDetails(summaryBoxes);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const onChangePagination = (page: number) => {
    const zeroBasedPage = page - 1;
    setCurrentPage(zeroBasedPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    // console.log(current, pageSize);
    setPageLimit(pageSize);
    setCurrentPage(0);
  };

  return (
    <>
      <MainLayout pageName="filterArea">
        <main>
          <div className="d-flex justify-content-center align-item-center listingMainPage">
            <div className="listingMainPage_inner ">
              <Row className="w-100 ">
                <Col xs={24} sm={24} md={24} lg={12}>
                  <h1 className="m-0 fourth_topic text-gray-secondary">
                    Earnings
                  </h1>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Row className="filter-container w-100">
                    <Col xs={16} sm={18} md={18} lg={17} xl={12}>
                      {" "}
                      <span className="position-relative">
                        <Input
                          style={{ width: "100%" }}
                          size="large"
                          onChange={(e) => {
                            setSearchReservationCode(
                              e.target.value ? e.target.value : ""
                            );
                            handleEarningsFiltration(
                              e.target.value ? e.target.value : "",
                              selectedSummeryCard,
                              selectedPropertyId,
                              selectedDateRanges,
                              // selectedSettlementStatus,
                              // selectedPaymentStatus,
                              selectedPaymentType,
                              0,
                              pageLimit
                            );
                          }}
                          placeholder="Search reservation code"
                          prefix={
                            <SearchOutlined
                              style={{ color: "#BFBFBF", fontSize: "16px" }}
                            />
                          }
                        />
                      </span>
                    </Col>
                    <Col xs={8} sm={6} md={6} lg={7} xl={6}>
                      <span
                        className="filter-inner-area w-100"
                        onClick={toggleSidebar}
                      >
                        <p className="m-0 text-gray">More filters</p>
                        <img src={filter} alt="filter" />
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">

                <Col xs={24} sm={24} md={24} lg={24}>
                  <h2 className="font-size-4 font-weight-medium p-0 m-0 mt-1 text-gray-secondary">
                    Date Range : {selectedDateRanges?.[0]?.format("YYYY-MM-DD")} - {selectedDateRanges?.[1]?.format("YYYY-MM-DD")}
                    {
                      earningsSummeryDetails?.find(
                        (item) => item.key === "TOTAL_RESERVATION_COUNT"
                      )
                        ? ` ( ${earningsSummeryDetails.find(
                          (item) => item.key === "TOTAL_RESERVATION_COUNT"
                        )?.label} : ${earningsSummeryDetails.find(
                          (item) => item.key === "TOTAL_RESERVATION_COUNT"
                        )?.value} )`
                        : ""
                    }
                  </h2>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className="py-4 mt-3 rounded-4"
                //  style={{
                //   backgroundColor: "white",
                //   boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                // }}
                >
                  <h2 className="font-size-3 font-weight-semi-bold m-0 p-0 ">
                    {(() => {
                      const totalEarned = earningsSummeryDetails?.find(
                        (item) => item.key === "TOTAL_EARNED_PRICE"
                      );

                      if (totalEarned) {
                        const formattedValue = totalEarned.value?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });

                        return `${totalEarned.label} : ${CurrencyEnum.USD} ${formattedValue}`;
                      }

                      return "";
                    })()}
                  </h2>

                </Col>

              </Row>

              {earningsSummeryDetails && (
                <Row className="w-100 mt-4 d-flex justify-content-center justify-content-md-start ">
                  {earningsSummeryDetails.map((box: EarningsSummeryDetails) => (
                    // <Col
                    //   xs={24}
                    //   sm={24}
                    //   md={24}
                    //   lg={12}
                    //   xl={12}
                    //   xxl={12}
                    //   className="pe-0 pe-lg-3 "
                    // >
                    box.key != "TOTAL_RESERVATION_COUNT" && box.key != "TOTAL_EARNED_PRICE" && <div
                      key={box.key}
                      className={`rounded-5 py-2 px-3 mx-2 my-2 cursor-pointer`}
                      style={{
                        backgroundColor: "white",
                        border:
                          selectedSummeryCard === box.key
                            ? "2px solid black "
                            : "1px solid white",
                        cursor: "pointer",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                      onClick={() => {

                        const newSelectedKey =
                          selectedSummeryCard === box.key ? "" : box.key;
                        setSelectedSummeryCard(newSelectedKey);
                        handleEarningsFiltration(
                          searchReservationCode,
                          newSelectedKey ?? "",
                          selectedPropertyId,
                          selectedDateRanges,
                          // selectedSettlementStatus,
                          // selectedPaymentStatus,
                          selectedPaymentType,
                          0,
                          pageLimit
                        );
                      }}
                    >
                      <h2 className="font-size-3 font-weight-semi-bold p-1 my-1">
                        {box.label} ({box.value ? CurrencyEnum.USD +
                          " " +
                          box.value.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) : 0})
                      </h2>
                      {/* <Row className="w-100 d-flex justify-content-center">
                          <Col
                            xs={13}
                            sm={12}
                            md={9}
                            lg={15}
                            xl={12}
                            xxl={10}
                            className=""
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-1 my-1">
                              {box.label}
                            </h2>
                          </Col>
                          <Col
                            xs={1}
                            sm={1}
                            md={1}
                            lg={1}
                            xl={1}
                            xxl={1}
                            className=""
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-1 my-1">
                              :
                            </h2>
                          </Col>
                          <Col
                            xs={10}
                            sm={11}
                            md={13}
                            lg={8}
                            xl={11}
                            xxl={13}
                            className=""
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-1 my-1">
                              {box.value ? box.key === "TOTAL_RESERVATION_COUNT" ? box.value : CurrencyEnum.USD +
                                " " +
                                box.value.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                ) : 0}
                            </h2>
                          </Col>
                        </Row> */}
                    </div>
                    // </Col>


                  ))}
                </Row>
              )}

              <div className="container-fluid my-4 p-0">
                {earningsList.length > 0 ? (
                  <Row className="w-100">
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      className="m-0 p-0"
                    >
                      {earningsList.map((earning, index) => {
                        return (
                          <EarningsRecodeCard
                            key={index}
                            earningDetails={earning}
                          />
                        );
                      })}
                    </Col>
                  </Row>
                ) : (
                  <Empty
                    description={
                      <Typography.Text>No Earnings</Typography.Text>
                    }
                  />
                )}

                <br />
                {earningsList.length > 0 && (
                  <ConfigProvider
                    locale={{
                      Pagination: {
                        ...enUS.Pagination,
                        items_per_page: "records per page",
                      },
                    }}
                  >
                    <Pagination
                      className="paginateArea mt-3 mb-3"
                      align="end"
                      total={totalRecodes}
                      defaultPageSize={20}
                      pageSize={pageLimit}
                      current={currentPage + 1}
                      onShowSizeChange={onShowSizeChange}
                      showSizeChanger={true}
                      onChange={onChangePagination}
                      showTotal={(total) => (
                        <span
                          style={{ position: "relative", top: "3px" }}
                          className="font-size-5 text-gray"
                        >{`Total ${total} items`}</span>
                      )}
                    />
                  </ConfigProvider>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`sidebar-left ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-content">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <p style={{ fontSize: "20px", zIndex: "999" }} className="m-0">
                    Filters
                  </p>
                  <img
                    className="mx-2"
                    style={{ width: "21px", height: "21px" }}
                    src={filter}
                    alt="searchIcon"
                  />
                </span>
                <img
                  width={30}
                  className="close-btn"
                  src={closeIcon}
                  alt=" close"
                  onClick={toggleSidebar}
                />
              </div>
              <Row className="mt-5">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <h6 className="fw-normal font-size-4">Select Property</h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={selectedPropertyId ? selectedPropertyId : undefined}
                    showSearch
                    allowClear
                    placeholder="Select a property"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedPropertyId(value ?? "");
                      handleEarningsFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        value ?? "",
                        selectedDateRanges,
                        // selectedSettlementStatus,
                        // selectedPaymentStatus,
                        selectedPaymentType,
                        0,
                        pageLimit
                      );
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }

                  > {userPropertyList && userPropertyList.map((item) => (
                    <Select.Option
                      key={item.value}
                      value={item.value}
                      label={item.label}
                    >
                      {item.customLabel}
                    </Select.Option>
                  ))}
                  </Select>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  xxl={24}
                  className="mt-3"
                >
                  <h6 className="fw-normal font-size-4">Select Date Range</h6>
                  <RangePicker
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={selectedDateRanges}
                    allowClear={false}
                    onChange={(calendarSelectedDates) => {
                      if (
                        calendarSelectedDates &&
                        calendarSelectedDates.length === 2
                      ) {
                        setSelectedDateRanges([
                          calendarSelectedDates[0]?.startOf("day"),
                          calendarSelectedDates[1]?.endOf("day"),
                        ]);
                        handleEarningsFiltration(
                          searchReservationCode,
                          selectedSummeryCard,
                          selectedPropertyId,
                          [
                            calendarSelectedDates[0]?.startOf("day"),
                            calendarSelectedDates[1]?.endOf("day"),
                          ],
                          // selectedSettlementStatus,
                          // selectedPaymentStatus,
                          selectedPaymentType,
                          0,
                          pageLimit
                        );
                      } else {
                        setSelectedDateRanges([startOfMonth, endOfMonth]);
                      }
                    }}
                  />
                </Col>
                {/* <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  xxl={24}
                  className="mt-3"
                >
                  <h6 className="fw-normal font-size-4">
                    Select Settlement Status
                  </h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={
                      selectedSettlementStatus
                        ? selectedSettlementStatus
                        : undefined
                    }
                    showSearch
                    placeholder="Select settlement status"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedSettlementStatus(value ?? "");
                      handleEarningsFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        value ?? "",
                        selectedPaymentStatus,
                        selectedPaymentType,
                        0,
                        pageLimit
                      );
                    }}
                    options={settlementStatusList}
                  />
                </Col> */}
                {/* <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  xxl={24}
                  className="mt-3"
                >
                  <h6 className="fw-normal font-size-4">Select Payment Status</h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={
                      selectedPaymentStatus ? selectedPaymentStatus : undefined
                    }
                    showSearch
                    placeholder="Select payment status"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedPaymentStatus(value ?? "");
                      handleEarningsFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        selectedSettlementStatus,
                        value ?? "",
                        selectedPaymentType,
                        0,
                        pageLimit
                      );
                    }}
                    options={paymentStatusList}
                  />
                </Col> */}
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  xxl={24}
                  className="mt-3"
                >
                  <h6 className="fw-normal font-size-4">Select Payment Type</h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={selectedPaymentType ? selectedPaymentType : undefined}
                    showSearch
                    allowClear
                    placeholder="Select payment status"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedPaymentType(value ?? "");
                      handleEarningsFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        // selectedSettlementStatus,
                        // selectedPaymentStatus,
                        value ?? "",
                        0,
                        pageLimit
                      );
                    }}
                    options={paymentTypeList}
                  />
                </Col>
              </Row>

              <div className="w-100 pt-4">
                <Button
                  className="clearButton  mt-4"
                  color="default"
                  variant="filled"
                  onClick={() => {
                    setSelectedPaymentType("");
                    setSelectedPaymentStatus("");
                    setSelectedSettlementStatus("");
                    setSelectedPropertyId("");
                    setSelectedDateRanges([startOfMonth, endOfMonth]);
                    handleEarningsFiltration(
                      "",
                      "",
                      "",
                      [startOfMonth, endOfMonth],
                      // "",
                      // "",
                      "",
                      0,
                      pageLimit
                    );
                    // loadAllEarnings(currentPage, pageLimit);
                    setIsSidebarOpen(false);
                    setSelectedSummeryCard("");
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {isSidebarOpen && (
            <div className="backdrop" onClick={toggleSidebar}></div>
          )}
        </main>
      </MainLayout>
    </>
  );
};
export default EarningsManagementPage;
