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
  Checkbox,
  Col,
  DatePicker,
  Empty,
  Input,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
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
  ReservationCardDetailsObj,
  ReservationSummeryDetails,
} from "../common/interfaces/uiNecessaryInterface";
import { getAllPropertyListToDropdown } from "../service/listningService";
import {
  changeReservationStatus,
  getAllReservations,
  getAllReservationsFiltration,
  getReservationsSummeryWithFiltration,
} from "../service/reservationService";
import { Dayjs } from "dayjs";
import { PaymentStatusEnum } from "../common/enums/paymentStatusEnum";
import { ReservationStatusEnum } from "../common/enums/reservationStatusEnum";
import ReservationRecodeCard from "../components/common/cards/ReservationRecodeCard";
import { CurrencyEnum } from "../common/enums/currencyEnum";
import { ReservationSummeryFiltrationEnum } from "../common/enums/reservationSummeryFiltrationEnum";
import MainLayout from "../layout/MainLayout";
import ReservationStatusChangeModal from "../components/common/modal/ReservationStatusChangeModal";

const startOfMonth = moment()
  .startOf("month")
  .startOf("day")
  .format("YYYY-MM-DD[T]HH:mm:ss");
const endOfMonth = moment()
  .endOf("month")
  .endOf("day")
  .format("YYYY-MM-DD[T]HH:mm:ss");

const { Search } = Input;
const ReservationManagementPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { RangePicker } = DatePicker;

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [reservationList, setReservationList] = useState<
    ReservationCardDetailsObj[]
  >([]);

  // filtration
  const [searchReservationCode, setSearchReservationCode] =
    useState<string>("");
  const [selectedDateRanges, setSelectedDateRanges] =
    useState<[Dayjs | null | undefined, Dayjs | null | undefined]>();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | string>(
    ""
  );
  const [userPropertyList, setUserPropertyList] = useState<DropdownObjThree[]>();
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("");
  const [paymentStatusList, setPaymentStatusList] = useState<DropdownObj[]>();
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState<string>("");
  const [reservationStatusList, setReservationStatusList] =
    useState<DropdownObj[]>();

  const [isReservationStatusChangeModalOpen, setIsReservationStatusChangeModalOpen] =
    useState<boolean>(false);
  const [selectedReservationId, setSelectedReservationId] = useState<{
    id: number;
    status: string;
  }>();
  const [selectedSummeryCard, setSelectedSummeryCard] = useState<string>("");

  const [reservationSummeryDetails, setReservationSummeryDetails] =
    useState<ReservationSummeryDetails[]>();

  const [selectedReviewStatus, setSelectedReviewStatus] =
    useState<string | boolean>("");
  const [reviewStatusList, setReviewStatusList] = useState<DropdownObj[]>();

  /*pagination */
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalRecodes, setTotalRecodes] = useState<number>(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleReservationFiltration = (
    reservationCode: string,
    reservationSummary: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    reservationStatus: string,
    paymentStatus: string,
    reviewStatus: string,
    currentPage: number
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      reservationFiltration(
        reservationCode,
        reservationSummary,
        propertyId,
        dateRange,
        reservationStatus,
        paymentStatus,
        reviewStatus,
        currentPage
      );
    }, 1000);
  };

  useEffect(() => {
    // loadAllReservations(currentPage);
    setPaymentStatusList([
      { value: PaymentStatusEnum.PENDING, label: "Pending" },
      { value: PaymentStatusEnum.SUCCESS, label: "Success" },
      { value: PaymentStatusEnum.FAILED, label: "Failed" },
      { value: PaymentStatusEnum.CANCELLED, label: "Cancel" },
    ]);
    setReviewStatusList([
      { value: "", label: "All" },
      { value: "true", label: "Pending Reviews" },
      { value: "false", label: "Review Added" },
    ]);
    setReservationStatusList([
      { value: ReservationStatusEnum.PENDING, label: "Pending" },
      { value: ReservationStatusEnum.APPROVED, label: "Approved" },
      { value: ReservationStatusEnum.REJECTED, label: "Rejected" },
      // { value: ReservationStatusEnum.CANCELLED, label: "Cancel" },
      { value: ReservationStatusEnum.CANCELLED_BY_GUEST, label: "Cancel By Guest" },
      { value: ReservationStatusEnum.CANCELLED_BY_HOST, label: "Cancel By Host" },
      { value: ReservationStatusEnum.CHECKED_IN, label: "Checked In" },
      { value: ReservationStatusEnum.CHECKED_OUT, label: "Checked Out" },
      { value: ReservationStatusEnum.NO_SHOW, label: "No Show" },
    ]);
  }, []);

  useEffect(() => {
    handleReservationFiltration(
      searchReservationCode,
      selectedSummeryCard,
      selectedPropertyId,
      selectedDateRanges,
      selectedReservationStatus,
      selectedPaymentStatus,
      selectedReviewStatus,
      currentPage
    );
  }, [currentPage]);


  useEffect(() => {
    if (isSidebarOpen) {
      getAllUserProperties();
    }
  }, [isSidebarOpen]);

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

  const loadAllReservations = (currentPage: number) => {
    popUploader(dispatch, true);
    getAllReservations(currentPage)
      .then((response: any) => {
        setReservationList(response?.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalRecodes(response.pagination.totalCount);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const reservationFiltration = (
    reservationCode: string,
    reservationSummary: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    reservationStatus: string,
    paymentStatus: string,
    reviewStatus: string | boolean,
    currentPage: number
  ) => {
    getReservationsSummery(
      reservationCode,
      reservationSummary,
      propertyId,
      dateRange,
      reservationStatus,
      paymentStatus,
      reviewStatus
    );
    if (
      reservationCode === "" &&
      reservationSummary === "" &&
      propertyId === "" &&
      reservationStatus === "" &&
      paymentStatus === "" &&
      reviewStatus === "" &&
      (dateRange === undefined || dateRange === null)
    ) {
      loadAllReservations(currentPage);
    } else {
      popUploader(dispatch, true);

      let startDate = "";
      let endDate = "";

      if (dateRange && dateRange.length === 2) {
        startDate = dateRange[0].format("YYYY-MM-DDTHH:mm:ss");
        endDate = dateRange[1].format("YYYY-MM-DDTHH:mm:ss");
      }

      setReservationList([]);

      let data = {
        propertyId: propertyId,
        reservationCode: reservationCode,
        reservationSummary: reservationSummary,
        checkin: startDate,
        checkout: endDate,
        paymentStatus: paymentStatus,
        reviewStatus: reviewStatus,
        reservationStatus: reservationStatus,
      };

      getAllReservationsFiltration(data, currentPage)
        .then((response: any) => {
          setReservationList(response?.data);
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

  const getReservationsSummery = (
    reservationCode: string,
    reservationSummary: string,
    propertyId: number | string,
    dateRange: [Dayjs | null | undefined, Dayjs | null | undefined],
    reservationStatus: string,
    paymentStatus: string,
    reviewStatus: string | boolean
  ) => {
    popUploader(dispatch, true);

    let startDate = "";
    let endDate = "";

    if (dateRange && dateRange.length === 2) {
      startDate = dateRange[0].format("YYYY-MM-DDTHH:mm:ss");
      endDate = dateRange[1].format("YYYY-MM-DDTHH:mm:ss");
    }

    setReservationList([]);

    let data = {
      propertyId: propertyId,
      reservationCode: reservationCode,
      reservationSummary: reservationSummary,
      checkin: startDate,
      checkout: endDate,
      paymentStatus: paymentStatus,
      reviewStatus: reviewStatus,
      reservationStatus: reservationStatus,
    };

    getReservationsSummeryWithFiltration(data)
      .then((response: any) => {
        const summaryBoxes = [
          {
            key: ReservationSummeryFiltrationEnum.CURRENTLY_HOSTING,
            label: "Currently Hosting",
            value: response?.data?.currentlyHosting,
          },
          {
            key: ReservationSummeryFiltrationEnum.CHECKING_OUT,
            label: "Checking Out",
            value: response?.data?.checkingOut,
          },
          {
            key: ReservationSummeryFiltrationEnum.UPCOMING,
            label: "Upcoming",
            value: response?.data?.upcoming,
          },
          {
            key: ReservationSummeryFiltrationEnum.STAYED,
            label: "Stayed",
            value: response?.data?.stayed,
          },
          {
            key: ReservationSummeryFiltrationEnum.CANCELLED,
            label: "Cancelled",
            value: response?.data?.cancelled,
          },
        ];
        setReservationSummeryDetails(summaryBoxes);
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

  return (
    <>
      <ReservationStatusChangeModal
        selectedReservationId={selectedReservationId?.id}
        status={selectedReservationId?.status}
        isOpen={isReservationStatusChangeModalOpen}
        onClose={() => {
          setIsReservationStatusChangeModalOpen(false);
        }}
        loadReservations={() => {
          loadAllReservations(currentPage);
        }}
      />
      <MainLayout pageName="filterArea">
        <main>
          <div className="d-flex justify-content-center align-item-center listingMainPage">
            <div className="listingMainPage_inner ">
              <Row className="w-100 ">
                <Col xs={24} sm={24} md={24} lg={12}>
                  <h1 className="m-0 fourth_topic text-gray-secondary">
                    Reservations
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
                            handleReservationFiltration(
                              e.target.value ? e.target.value : "",
                              selectedSummeryCard,
                              selectedPropertyId,
                              selectedDateRanges,
                              selectedReservationStatus,
                              selectedPaymentStatus,
                              selectedReviewStatus,
                              0
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
              {reservationSummeryDetails && (
                <Row className="w-100 mt-4 d-flex justify-content-center justify-content-md-start ">
                  {reservationSummeryDetails.map((box) => (
                    <div
                      key={box.key}
                      className={`rounded-5 py-1 px-3 mx-2 my-2 cursor-pointer`}
                      style={{
                        backgroundColor:
                          selectedSummeryCard === box.key ? "white " : "white",
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
                        handleReservationFiltration(
                          searchReservationCode,
                          newSelectedKey ?? "",
                          selectedPropertyId,
                          selectedDateRanges,
                          selectedReservationStatus,
                          selectedPaymentStatus,
                          selectedReviewStatus,
                          0
                        );
                      }}
                    >
                      <h2
                        className={`font-size-3 font-weight-semi-bold p-1 my-1`}
                      // className={`font-size-3
                      //   ${selectedSummeryCard === box.key
                      //     ? "font-weight-semi-bold"
                      //     : "font-weight-medium" }
                      //      p-1 my-1`}
                      >
                        {box.label} ({box.value})
                      </h2>
                    </div>
                  ))}
                </Row>
              )}
              <div className="container-fluid my-4 p-0">
                {reservationList.length > 0 ? (
                  <Row className="w-100">
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      className="m-0 p-0"
                    >
                      {reservationList.map((reservation, index) => {
                        return (
                          <ReservationRecodeCard
                            key={index}
                            reservationDetails={reservation}
                            acceptOrRejectReservation={(details: {
                              id: number;
                              status: string;
                            }) => {
                              // console.log(details);

                              setSelectedReservationId({
                                id: details?.id,
                                status: details?.status,
                              });
                              setIsReservationStatusChangeModalOpen(true);
                            }}
                          />
                        );
                      })}
                    </Col>
                  </Row>
                ) : (
                  <Empty
                    description={
                      <Typography.Text>No Reservations</Typography.Text>
                    }
                  />
                )}

                <br />
                {reservationList.length > 0 && (
                  <Pagination
                    className="paginateArea mt-3 mb-3"
                    align="end"
                    total={totalRecodes}
                    defaultPageSize={10}
                    current={currentPage + 1}
                    showSizeChanger={false}
                    onChange={onChangePagination}
                    showTotal={(total) => (
                      <span
                        style={{ position: "relative", top: "3px" }}
                        className="font-size-5 text-gray"
                      >{`Total ${total} items`}</span>
                    )}
                  />
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
                    placeholder="Select a property"
                    optionFilterProp="label"
                    allowClear
                    onChange={(value) => {
                      setSelectedPropertyId(value ?? "");
                      handleReservationFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        value ?? "",
                        selectedDateRanges,
                        selectedReservationStatus,
                        selectedPaymentStatus,
                        selectedReviewStatus,
                        0
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
                    allowClear
                    onChange={(calendarSelectedDates) => {
                      if (
                        calendarSelectedDates &&
                        calendarSelectedDates.length === 2
                      ) {
                        setSelectedDateRanges([
                          calendarSelectedDates[0]?.startOf("day"),
                          calendarSelectedDates[1]?.endOf("day"),
                        ]);
                        handleReservationFiltration(
                          searchReservationCode,
                          selectedSummeryCard,
                          selectedPropertyId,
                          [
                            calendarSelectedDates[0]?.startOf("day"),
                            calendarSelectedDates[1]?.endOf("day"),
                          ],
                          selectedReservationStatus,
                          selectedPaymentStatus,
                          selectedReviewStatus,
                          0
                        );
                      } else {
                        setSelectedDateRanges(undefined);
                        handleReservationFiltration(
                          searchReservationCode,
                          selectedSummeryCard,
                          selectedPropertyId,
                          undefined,
                          selectedReservationStatus,
                          selectedPaymentStatus,
                          selectedReviewStatus,
                          0
                        );
                      }
                    }}
                  />
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
                  <h6 className="fw-normal font-size-4">
                    Select Reservation Status
                  </h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={
                      selectedReservationStatus
                        ? selectedReservationStatus
                        : undefined
                    }
                    showSearch
                    allowClear
                    placeholder="Select reservation status"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedReservationStatus(value ?? "");
                      handleReservationFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        value ?? "",
                        selectedPaymentStatus,
                        selectedReviewStatus,
                        0
                      );
                    }}
                    options={reservationStatusList}
                  />
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
                  <h6 className="fw-normal font-size-4">Select Payment Status</h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={
                      selectedPaymentStatus ? selectedPaymentStatus : undefined
                    }
                    showSearch
                    allowClear
                    placeholder="Select payment status"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedPaymentStatus(value ?? "");
                      handleReservationFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        selectedReservationStatus,
                        value ?? "",
                        selectedReviewStatus,
                        0
                      );
                    }}
                    options={paymentStatusList}
                  />
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
                  <h6 className="fw-normal font-size-4">Review Status</h6>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={
                      selectedReviewStatus === true
                        ? "true"
                        : selectedReviewStatus === false
                          ? "false"
                          : ""
                    }
                    showSearch
                    placeholder="Select review status"
                    optionFilterProp="label"
                    allowClear
                    onChange={(value) => {
                      const parsedValue =
                        value === "true" ? true : value === "false" ? false : "";
                      setSelectedReviewStatus(parsedValue);
                      handleReservationFiltration(
                        searchReservationCode,
                        selectedSummeryCard,
                        selectedPropertyId,
                        selectedDateRanges,
                        selectedReservationStatus,
                        selectedPaymentStatus,
                        parsedValue,
                        0
                      );
                    }}
                    options={reviewStatusList}
                  />
                </Col>
              </Row>

              <div className="w-100 pt-4">
                <Button
                  className="clearButton  mt-4"
                  color="default"
                  variant="filled"
                  onClick={() => {
                    setSelectedPaymentStatus("");
                    setSelectedReviewStatus("");
                    setSelectedReservationStatus("");
                    setSelectedPropertyId("");
                    setSelectedDateRanges(undefined);
                    loadAllReservations(currentPage);
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
export default ReservationManagementPage;
