import "../styles/reservation/reservationManagementStyles.scss";
import "../styles/listning/listningStyles.scss";
import "../styles/commonStyles.scss";
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Divider,
  Form,
  Row,
  Select,
  Spin,
  Tag,
  Timeline,
  theme,
} from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  customSweetAlert,
  customToastMsg,
  formatNamesCmnFun,
  getLastPathSegment,
  handleError,
  popUploader,
  truncateDescriptions,
} from "../common/commonFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import {
  changePaymentType,
  getReservationByReservationCode,
  markReservationAsPaid,
} from "../service/reservationService";
import { DropdownObj, ReservationAllDetailsObj } from "../common/interfaces/uiNecessaryInterface";
import moment from "moment";
import { ReservationStatusEnum } from "../common/enums/reservationStatusEnum";
import DefaultCardImage from "../assets/images/DefaultCardImage.png";
import defaultProfileImage from "../assets/images/profileDefaultImg.jpg";
import { ArrowLeft } from "react-feather";
import { PaymentStatusEnum } from "../common/enums/paymentStatusEnum";
import { CurrencyEnum } from "../common/enums/currencyEnum";
import ReservationCancelModal from "../components/common/modal/ReservationCancelModal";
import MainLayout from "../layout/MainLayout";
import ReservationStatusChangeModal from "../components/common/modal/ReservationStatusChangeModal";
import ReservationStatusTag from "../components/common/tags/ReservationStatusTag";
import { LoadingOutlined } from '@ant-design/icons';
import { PaymentTypeEnum } from "../common/enums/paymentTypeEnum";


const ViewReservationPage = () => {
  const [navigateLocation, setNavigateLocation] = useState<string>();
  const [reservationCode, setReservationCode] = useState<string>();
  const [reservationDetails, setReservationDetails] =
    useState<ReservationAllDetailsObj>();
  const [isReservationCancelModalOpen, setIsReservationCancelModalOpen] =
    useState<boolean>(false);
  const [isReservationStatusChangeModalOpen, setIsReservationStatusChangeModalOpen] =
    useState<boolean>(false);
  const [changingReservationStatus, setChangingReservationStatus] =
    useState<string>();
  const [isOnlyPropertyOwner, setIsOnlyPropertyOwner] =
    useState<boolean>();

  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState<DropdownObj[]>([]);
  const [loading, setLoading] = useState(false);

  const [showPaymentTypeChangeForm, setShowPaymentTypeChangeForm] = useState(false);

  const [form] = Form.useForm();


  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const { state } = location;
  //   if (state && state.location) {
  //     const { location } = state;
  //     console.log(location);
  //     setNavigateLocation(location);
  //   }
  // }, [location]);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const reservationCode = getLastPathSegment(currentURL);
    setReservationCode(reservationCode);
    getReservationDetails(reservationCode);
    const fromLocation = localStorage.getItem("fromLocation");
    setNavigateLocation(fromLocation ?? "");
    setPaymentTypeOptions([
      { value: PaymentTypeEnum.CARD, label: `${formatNamesCmnFun(PaymentTypeEnum.CARD)}` },
      { value: PaymentTypeEnum.PAY_AT_PROPERTY, label: `${formatNamesCmnFun(PaymentTypeEnum.PAY_AT_PROPERTY)}` }
    ])
  }, []);

  const getReservationDetails = (selectedReservationCode: string) => {
    popUploader(dispatch, true);
    getReservationByReservationCode(selectedReservationCode)
      .then((res) => {
        setReservationDetails(res?.data);
        setIsOnlyPropertyOwner(res?.data?.isOnlyPropertyOwner)
        popUploader(dispatch, false);
      })
      .catch((err) => {
        handleError(err);
        popUploader(dispatch, false);
      });
  };

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "white",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => {
    const items = [
      {
        key: "1",
        label: (

          <h2 className="m-0 p-0 font-size-4 font-weight-medium">
            Guest Details
          </h2>
        ),
        children: (
          <div>
            {" "}
            <h2 className="mb-2 p-0 font-size-5 font-weight-medium">
              {`${reservationDetails?.contactDetails?.firstName ?? ""} ${reservationDetails?.contactDetails?.lastName ?? ""}`.trim()}
            </h2>
            <h2 className="my-2 p-0 font-size-5 font-weight-medium">
              <a href={`mailto:${reservationDetails?.contactDetails?.email}`} className="text-dark" style={{ textDecoration: "none" }}>
                {reservationDetails?.contactDetails?.email}
              </a>
            </h2>
            <h2 className="p-0 font-size-5 font-weight-normal">
              {reservationDetails?.contactDetails?.countryCode &&
                reservationDetails?.contactDetails?.contactNo &&
                <a href={`tel:${reservationDetails?.contactDetails?.countryCode + reservationDetails?.contactDetails?.contactNo}`} className="text-dark" style={{ textDecoration: "none" }}>
                  {
                    reservationDetails?.contactDetails?.countryCode +
                    " " +
                    reservationDetails?.contactDetails?.contactNo}
                </a>
              }
            </h2>

            <Divider
              orientation="left"
              orientationMargin="0"
              className="font-size-5"
            />

            <h2 className="m-0 mb-3 p-0 font-size-4 font-weight-medium">
              Account Holder
            </h2>

            <h5 className="d-flex align-items-center my-1 mb-2 p-0 font-size-5 ont-weight-normal">
              <img
                src={
                  reservationDetails?.reservedUser?.file?.mediumPath
                    ? reservationDetails?.reservedUser?.file?.mediumPath
                    : defaultProfileImage
                }
                alt="cusImg"
                height={30}
                width={30}
                style={{ objectFit: "cover" }}
                className="me-2 rounded-5"
              />
              {`${reservationDetails?.reservedUser?.firstName ?? ""} ${reservationDetails?.reservedUser?.lastName ?? ""}`.trim()}
            </h5>
            <h2 className="p-0 font-size-5 font-weight-normal">
              {reservationDetails?.reservedUser?.countryCode &&
                reservationDetails?.reservedUser?.contactNo &&
                <a href={`tel:${reservationDetails?.reservedUser?.countryCode + reservationDetails?.reservedUser?.contactNo}`} className="text-dark" style={{ textDecoration: "none" }}>
                  {
                    reservationDetails?.reservedUser?.countryCode +
                    " " +
                    reservationDetails?.reservedUser?.contactNo}
                </a>
              }
            </h2>
          </div>
        ),
        style: panelStyle,
      },
      {
        key: "2",
        label: (
          <h2 className="m-0 p-0 font-size-4 font-weight-medium">
            Reservation Details
          </h2>
        ),
        children: (
          <Row>
            <Col xs={24} sm={24} md={24} lg={12}>
              {reservationDetails?.entireProperty && (
                <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                  Entire Property Reserved
                </h2>
              )}
              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Reservation Code
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {reservationDetails?.code}
                  </h2>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Reservation Status
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15} className="d-flex align-items-center">
                  {" "}
                  <ReservationStatusTag
                    reservationStatus={reservationDetails?.status ?? ""}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Check In Date
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {moment(reservationDetails?.checkIn).format("YYYY.MM.DD")}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Check Out Date
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {moment(reservationDetails?.checkOut).format("YYYY.MM.DD")}

                  </h2>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              {/* <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Guest Count
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {reservationDetails?.totalGuest}
                  </h2>
                </Col>
              </Row> */}
              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Adult Count
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {reservationDetails?.adult}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={8} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    Children Count
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col xs={11} sm={17} md={15} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                    {reservationDetails?.child}
                  </h2>
                </Col>
              </Row>
            </Col>
            <Col sm={24} md={24}>
              <Divider className="my-4" />
              {reservationDetails?.specialRequest && <Row className="my-2">
                <Col
                  xs={12}
                  sm={6}
                  md={8}
                  lg={6}
                  xl={5}
                  xxl={4}
                  className="d-flex align-items-start"
                >
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">
                    Special Request
                  </h2>
                </Col>
                <Col xs={1} className="d-flex align-items-start">
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col
                  xs={11}
                  sm={17}
                  md={15}
                  lg={13}
                  xl={14}
                  xxl={15}
                  className="d-flex flex-column flex-sm-row align-items-start"
                >
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">
                    {reservationDetails?.specialRequest}
                  </h2>
                </Col>
              </Row>}
              <Row className="my-2">
                <Col
                  xs={12}
                  sm={6}
                  md={8}
                  lg={6}
                  xl={5}
                  xxl={4}
                  className="d-flex align-items-start"
                >
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">
                    Cancellation Policy
                  </h2>
                </Col>
                <Col xs={1} className="d-flex align-items-start">
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col
                  xs={11}
                  sm={17}
                  md={15}
                  lg={13}
                  xl={14}
                  xxl={15}
                  className="d-flex flex-column flex-sm-row align-items-start"
                >
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">
                    <span className="font-weight-semi-bold">
                      {reservationDetails?.cancellationPolicy?.name}
                    </span>{" "}
                    - {truncateDescriptions(
                      reservationDetails?.cancellationPolicy?.description || "",
                      5
                    )}
                  </h2>
                </Col>
              </Row>
              <Row className="my-2">
                <Col
                  xs={12}
                  sm={6}
                  md={8}
                  lg={6}
                  xl={5}
                  xxl={4}
                  className="d-flex align-items-start"
                >
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">
                    Security Deposit
                  </h2>
                </Col>
                <Col xs={1} className="d-flex align-items-start">
                  {" "}
                  <h2 className="p-0 font-size-5 font-weight-medium">:</h2>
                </Col>
                <Col
                  xs={11}
                  sm={17}
                  md={15}
                  lg={13}
                  xl={14}
                  xxl={15}
                  className="d-flex flex-column flex-sm-row align-items-start"
                >
                  {" "}

                  <h2 className="p-0 font-size-5 font-weight-medium">
                    {CurrencyEnum.USD} {reservationDetails?.securityDeposit.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </h2>
                </Col>
              </Row>
              <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                {reservationDetails?.nrpEnabled
                  ? "Non refundable policy applied"
                  : "Non refundable policy not applied"}
              </h2>
              <Divider className="my-4" />
              <Row>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <div className="w-100">
                    <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Sub Total
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {CurrencyEnum.USD} {reservationDetails?.subTotal.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </h2>
                      </Col>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Discount
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {CurrencyEnum.USD} {reservationDetails?.totalDiscount.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </h2>
                      </Col>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Net Total
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {CurrencyEnum.USD} {reservationDetails?.netTotal.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </h2>
                      </Col>
                    </Row>
                    <Divider className="m-0 my-2" />
                    {/* <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Serviced Apartment Commission Rate
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {reservationDetails?.commissionRate} %
                        </h2>
                      </Col>
                    </Row> */}
                    <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Platform Change ({reservationDetails?.commissionRate} %)
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {CurrencyEnum.USD}  {reservationDetails?.commissionAmount ? reservationDetails?.commissionAmount.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) : 0}

                        </h2>
                      </Col>
                    </Row>



                    <Row className="d-flex align-items-center justify-content-center w-100">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal">
                          Total Income
                        </h2>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <h2 className="my-2 font-size-5 font-weight-normal text-end">
                          {CurrencyEnum.USD} {reservationDetails?.ownerCommissionAmount.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </h2>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        ),
        style: panelStyle,
      },
      {
        key: "4",
        label: (
          <h2 className="m-0 p-0 font-size-4 font-weight-medium">
            Payment Details
          </h2>
        ),
        children: (
          <div className="d-flex flex-column w-100">
            {" "}
            <Row className="my-2">
              <Col
                xs={12}
                sm={6}
                md={8}
                lg={6}
                xl={5}
                xxl={4}
                className="d-flex align-items-start"
              >
                {" "}
                <h2 className="p-0 font-size-5 font-weight-medium">
                  Payment Status
                </h2>
              </Col>
              <Col xs={1}>
                {" "}
                <h2 className="d-flex align-items-start p-0 font-size-5 font-weight-medium">
                  :
                </h2>
              </Col>
              <Col
                xs={11}
                sm={17}
                md={15}
                lg={13}
                xl={14}
                xxl={15}
                className="d-flex align-items-start"
              >
                {" "}
                <Tag
                  color={
                    reservationDetails?.paymentStatus ===
                      PaymentStatusEnum.PENDING
                      ? "gold"
                      : reservationDetails?.paymentStatus ===
                        PaymentStatusEnum.SUCCESS
                        ? "green"
                        : reservationDetails?.paymentStatus ===
                          PaymentStatusEnum.CANCELLED
                          ? "purple"
                          : reservationDetails?.paymentStatus ===
                            PaymentStatusEnum.FAILED
                            ? "red"
                            : "none"
                  }
                >
                  {reservationDetails?.paymentStatus
                    ? reservationDetails?.paymentStatus
                    : "none"}
                </Tag>
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs={12} sm={6} md={8} lg={6} xl={5} xxl={4}>
                {" "}
                <h2 className="p-0 font-size-5 font-weight-medium">
                  Payment Type
                </h2>
              </Col>
              <Col xs={1}>
                {" "}
                <h2 className="d-flex align-items-start p-0 font-size-5 font-weight-medium">
                  :
                </h2>
              </Col>
              <Col
                xs={11}
                sm={17}
                md={15}
                lg={13}
                xl={14}
                xxl={15}
                className="d-flex align-items-start"
              >
                <h2 className="p-0 font-size-5 font-weight-medium">
                  {formatNamesCmnFun(
                    reservationDetails?.paymentType
                      ? reservationDetails?.paymentType
                      : ""
                  )}
                </h2>

              </Col>
            </Row>
            {!isOnlyPropertyOwner && reservationDetails?.paymentStatus != PaymentStatusEnum.SUCCESS && (reservationDetails?.status === ReservationStatusEnum.PENDING || reservationDetails?.status === ReservationStatusEnum.APPROVED) && <Row className="my-2">
              {!showPaymentTypeChangeForm && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                {" "}
                <h2 className="p-0 font-size-5 font-weight-medium">
                  You can change payment type of your reservation by <span className="primary-color" style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowPaymentTypeChangeForm(true)}>click in here </span>
                </h2>
              </Col>}
              {showPaymentTypeChangeForm && <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={12}>
                <h2 className="p-0 font-size-5 font-weight-medium">
                  Change payment type of your reservation
                </h2>
                <Form form={form} layout="vertical" className="w-100 mt-3">
                  <Row>
                    <Col xs={24} sm={12} md={24} lg={16} xl={16} xxl={16}>
                      <Form.Item
                        name="selectedPaymentType"
                        label=""
                        className="w-100"
                      >
                        <Select
                          style={{ height: 40, width: "100%", borderRadius: 4 }}
                          value={selectedPaymentType}
                          showSearch
                          allowClear
                          placeholder="Select payment type"
                          optionFilterProp="label"
                          onChange={(value) => {
                            setSelectedPaymentType(value);
                          }}
                          options={paymentTypeOptions.map((opt) => ({
                            ...opt,
                            disabled: opt.value === reservationDetails?.paymentType || (opt.value === PaymentTypeEnum.PAY_AT_PROPERTY && reservationDetails?.property?.payAtProperty === false),
                          }))}
                        />
                      </Form.Item></Col>
                    <Col xs={24} sm={12} md={24} lg={8} xl={8} xxl={8}>
                      <div className="d-flex">
                        {reservationDetails?.paymentType !== selectedPaymentType && <Button
                          onClick={() => {
                            handleChangePaymentType({ paymentType: selectedPaymentType ?? "", reservationId: reservationDetails?.id });
                          }}
                          disabled={loading || !selectedPaymentType}
                          size="large"
                          type="primary"
                          className="w-100 mt-3 mt-sm-0 mt-md-3 mt-lg-0 ms-0 ms-sm-3 ms-md-0 ms-lg-3 "
                        >
                          {loading && <Spin style={{ color: 'white' }} indicator={<LoadingOutlined color='#fff' spin />}
                            size="default" />} Change
                        </Button>}
                        <Button
                          onClick={() => {
                            setShowPaymentTypeChangeForm(false)
                          }}
                          size="large"
                          type="default"
                          className="w-100 mt-3 mt-sm-0 mt-md-3 mt-lg-0 ms-3 "
                        >
                          Cancel
                        </Button>
                      </div>

                    </Col>
                  </Row>
                </Form>
              </Col>}


            </Row>}
            {/* {reservationDetails?.status != ReservationStatusEnum.REJECTED && reservationDetails?.paymentStatus === PaymentStatusEnum.PENDING &&
              reservationDetails?.paymentType ===
              PaymentTypeEnum.PAY_AT_PROPERTY && (
                <Popconfirm
                  title="Payment marked as paid"
                  description="Are you sure to mark this payment as paid?"
                  onConfirm={() => {
                    handleMarkAsPaid();
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    size="large"
                    type="primary"
                    className="align-self-end"
                  >
                    Confirm Payment
                  </Button>
                </Popconfirm>
              )} */}
          </div>
        ),
        style: panelStyle,
      },
    ];

    if (!reservationDetails?.entireProperty) {
      items.splice(2, 0, {
        key: "3",
        label: (
          <h2 className="m-0 p-0 font-size-4 font-weight-medium">
            Room Details
          </h2>
        ),
        children: (
          <div>
            {" "}
            <h2 className="my-2 p-0 font-size-5 font-weight-medium">
              Reserved Room count : {reservationDetails?.roomCount}
            </h2>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Card
                  bordered={false}
                  className="w-100"
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  <Row className="d-flex align-items-center justify-content-center w-100">
                    <Col xs={6} sm={8} md={8} lg={8} xl={8} xxl={8}>
                      <h2 className="my-2 font-size-5 font-weight-medium">
                        Room Name
                      </h2>
                    </Col>
                    <Col xs={6} sm={5} md={5} lg={5} xl={5} xxl={5}>
                      <h2 className="my-2 font-size-5 font-weight-medium text-end">
                        Guest Count
                      </h2>
                    </Col>
                    <Col xs={6} sm={5} md={5} lg={5} xl={5} xxl={5}>
                      <h2 className="my-2 font-size-5 font-weight-medium text-end">
                        Room Count
                      </h2>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                      <h2 className="my-2 font-size-5 font-weight-medium text-end">
                        Room Price
                      </h2>
                    </Col>
                  </Row>
                  {reservationDetails?.roomDetails.map((room: any) => {
                    return (
                      <Row className="d-flex align-items-center justify-content-center w-100">
                        <Col xs={6} sm={8} md={8} lg={8} xl={8} xxl={8}>
                          <h2 className="my-2 font-size-5 font-weight-normal">
                            {room?.name}
                          </h2>
                        </Col>
                        <Col xs={6} sm={5} md={5} lg={5} xl={5} xxl={5}>
                          <h2 className="my-2 font-size-5 font-weight-normal text-end">
                            {room?.maxHeadCount}
                          </h2>
                        </Col>
                        <Col xs={6} sm={5} md={5} lg={5} xl={5} xxl={5}>
                          <h2 className="my-2 font-size-5 font-weight-normal text-end">
                            {room?.roomCount}
                          </h2>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                          <h2 className="my-2 font-size-5 font-weight-normal text-end">
                            {CurrencyEnum.USD} {room?.unitPrice.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </h2>
                        </Col>
                      </Row>
                    );
                  })}
                </Card>
              </Col>
            </Row>
          </div>
        ),
        style: panelStyle,
      });
    }

    if (isOnlyPropertyOwner) {
      return items.filter((item) => item.key !== "1");
    }

    return items;
  };

  const handleMarkAsPaid = () => {
    popUploader(dispatch, true);
    markReservationAsPaid(reservationDetails?.id ?? 0)
      .then((res) => {
        popUploader(dispatch, false);
        customToastMsg("Payment marked as paid successfully", 1);
        getReservationDetails(reservationCode ?? "");
      })
      .catch((err) => {
        handleError(err);
        popUploader(dispatch, false);
      });
  };

  const handleChangePaymentType = ({ paymentType, reservationId }: { paymentType: string, reservationId: number }) => {

    customSweetAlert("Are you sure you want to change payment type of this reservation?", 4, () => {
      setLoading(true)
      changePaymentType({ paymentType: paymentType, reservationId: reservationId })
        .then((res) => {
          customToastMsg("Payment type changed successfully", 1);
          getReservationDetails(reservationCode ?? "");
          setLoading(false)
          setSelectedPaymentType(null);
          form.setFieldsValue({
            selectedPaymentType: null,
          });
          setShowPaymentTypeChangeForm(false)

        })
        .catch((err) => {
          handleError(err);
          setLoading(false)
        }).finally(() => {
          setLoading(false)
        })
    });
  };

  return (
    <div>

      <ReservationCancelModal
        selectedReservationId={reservationDetails?.id ?? 0}
        status={reservationDetails?.status ?? ""}
        isOpen={isReservationCancelModalOpen}
        onClose={() => {
          setIsReservationCancelModalOpen(false);
        }}
      />

      <ReservationStatusChangeModal
        selectedReservationId={reservationDetails?.id ?? 0}
        status={changingReservationStatus ?? ""}
        isOpen={isReservationStatusChangeModalOpen}
        onClose={() => {
          setIsReservationStatusChangeModalOpen(false);
        }}
        loadReservations={() => {
          getReservationDetails(reservationCode ?? "");

        }}
      />

      <MainLayout pageName="filterArea">
        <main>
          <div className="d-flex justify-content-center viewReservationPage align-item-center listingMainPage">
            <div className="listingMainPage_inner">
              <Row className="mt-3 w-100">
                <Col xs={24} sm={24} lg={24} className="mb-2">
                  <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="d-flex align-items-center">
                      <Button
                        onClick={() => {
                          navigateLocation === "reservation"
                            ? history(`/reservation-manage`)
                            : navigateLocation === "earnings"
                              ? history(`/earnings-manage`)
                              : "";
                        }}
                        size="large"
                        type="default"
                        className="me-3 mb-2 px-2 rounded-circle"
                        style={{
                          height: 40,
                          width: 40,
                        }}
                      >
                        <ArrowLeft size={20} className="mx-1" />
                      </Button>
                      <h4 className="d-flex align-items-center">
                        {reservationDetails?.code}{" "}
                        <span className="d-flex align-items-center ms-2">
                          <ReservationStatusTag
                            reservationStatus={reservationDetails?.status ?? ""}
                          />
                        </span>


                      </h4>
                    </div>

                    {reservationDetails && !isOnlyPropertyOwner && <div className="align-self-center align-self-sm-end">
                      {navigateLocation === "reservation" &&
                        <div className="d-flex flex-column flex-sm-row justify-content-center">
                          {reservationDetails?.status ===
                            ReservationStatusEnum.APPROVED && (
                              <Button
                                size="large"
                                type="default"
                                className="mx-2 mb-2"
                                onClick={() => {
                                  setIsReservationStatusChangeModalOpen(true)
                                  setChangingReservationStatus(ReservationStatusEnum.NO_SHOW)
                                }}
                              >
                                Mark As No Show
                              </Button>
                            )}
                          {reservationDetails?.status ===
                            ReservationStatusEnum.PENDING && (
                              <Button
                                size="large"
                                type="default"
                                className="mx-2 mb-2"
                                onClick={() => {
                                  setIsReservationStatusChangeModalOpen(true)
                                  setChangingReservationStatus(ReservationStatusEnum.APPROVED)
                                }}
                              >
                                Approve
                              </Button>
                            )}
                          {reservationDetails?.status ===
                            ReservationStatusEnum.PENDING && (
                              <Button
                                size="large"
                                type="default"
                                className="mx-2 mb-2"
                                onClick={() => {
                                  setIsReservationStatusChangeModalOpen(true)
                                  setChangingReservationStatus(ReservationStatusEnum.REJECTED)
                                }}
                              >
                                Reject
                              </Button>
                            )}
                          {reservationDetails?.status !=
                            ReservationStatusEnum.REJECTED && <Button
                              size="large"
                              className="ms-2 mb-2"
                              type="default"
                              onClick={() => {
                                setIsReservationCancelModalOpen(true);
                              }}
                            >
                              Cancel Reservation
                            </Button>}
                        </div>
                      }
                    </div>}


                  </div>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Card
                    bordered={false}
                    className="w-100"
                    style={{
                      backgroundColor: "#E7F4FF",
                      border: "1px solid #87B4D7",
                    }}
                  >
                    <Row className="d-flex justify-content-center w-100">
                      <Col xs={24} sm={15} md={9} lg={7} xl={6} xxl={6}>
                        <img
                          src={
                            reservationDetails?.property?.file?.mediumPath
                              ? reservationDetails?.property?.file?.mediumPath
                              : DefaultCardImage
                          }
                          width="100%"
                          height="150px"
                          style={{ height: "100%", maxHeight: "150px " }}
                          className="rounded-3 object-fit-cover propertyViewCardImg"
                        />
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={15}
                        lg={17}
                        xl={18}
                        xxl={18}
                        className="ps-0 ps-md-4 pt-4 pt-md-0"
                      >
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}><h2 className="my-1 p-0 font-size-3 font-weight-medium">
                            {reservationDetails?.property?.name + " - " + reservationDetails?.property?.propertyType}
                          </h2>
                            <h2 className="my-1 p-0 font-size-5 font-weight-medium">
                              {reservationDetails?.property?.code}
                            </h2>
                            <h2 className="my-2 p-0 font-size-5 font-weight-normal">
                              {/* {reservationDetails?.property?.address + ", " + reservationDetails?.property?.city}{reservationDetails?.property?.floor && " - " + icalPropertyDetailsObject?.property?.floor} */}
                              {reservationDetails?.property?.address + ", " + reservationDetails?.property?.city}{reservationDetails?.property?.floor && " - " + reservationDetails?.property?.floor}
                            </h2>

                            {reservationDetails?.property?.allowEntireProperty &&
                              reservationDetails?.property?.allowIndividualUnit && (
                                <li>
                                  <h2 className="my-2 p-0 font-size-5 font-weight-normal">
                                    Customers can book {reservationDetails?.property?.name} as both entire
                                    property and separate units
                                  </h2>
                                </li>
                              )}
                            {!reservationDetails?.property?.allowEntireProperty &&
                              reservationDetails?.property?.allowIndividualUnit && (
                                <li>
                                  <h2 className="my-2 p-0 font-size-5 font-weight-normal">
                                    Customers can book {reservationDetails?.property?.name} as separate units
                                  </h2>
                                </li>
                              )}
                            {reservationDetails?.property?.allowEntireProperty &&
                              !reservationDetails?.property?.allowIndividualUnit && (
                                <li>
                                  <h2 className="my-2 p-0 font-size-5 font-weight-normal">
                                    Customers can book {reservationDetails?.property?.name} as entire
                                    property
                                  </h2>
                                </li>
                              )}
                            <h2 className="my-1 p-0 font-size-5 font-weight-normal">
                              Reservation Plan :{" "}
                              {formatNamesCmnFun(
                                reservationDetails?.property?.plan?.name
                                  ? reservationDetails?.property?.plan?.name
                                  : ""
                              )}
                            </h2></Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                            <Row className="d-flex align-items-center mb-2">
                              <Col xs={8} sm={8} md={8} lg={6} xl={9} xxl={8}>
                                {" "}
                                <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                                  Property Ownership
                                </h5>
                              </Col>
                              <Col xs={1}>
                                {" "}
                                <h5 className="my-1 p-0 font-size-5 ont-weight-normal">:</h5>
                              </Col>
                              <Col xs={15} sm={15} md={15} lg={17} xl={14} xxl={15}>
                                {" "}
                                {reservationDetails?.property?.propertyOwner ? <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                                  {" "}
                                  <img
                                    src={
                                      reservationDetails?.property?.propertyOwner?.file?.smallPath
                                        ? reservationDetails?.property?.propertyOwner?.file?.smallPath
                                        : defaultProfileImage
                                    }
                                    alt="cusImg"
                                    height={35}
                                    width={35}
                                    style={{ objectFit: "cover" }}
                                    className="my-1 ms-2 me-1 rounded-5"
                                  />{" "}
                                  <div className="d-flex flex-column justify-content-center">
                                    <h2 className="m-0 p-0 font-size-5 font-weight-medium">
                                      {`${reservationDetails?.property?.propertyOwner?.firstName ?? ""} ${reservationDetails?.property?.propertyOwner?.lastName ?? ""}`.trim()}
                                    </h2>
                                    <h2 className="m-0 mt-1 p-0 font-size-5 font-weight-medium">
                                      {reservationDetails?.property?.propertyOwner?.countryCode &&
                                        reservationDetails?.property?.propertyOwner?.contactNo &&
                                        reservationDetails?.property?.propertyOwner?.countryCode +
                                        " " +
                                        reservationDetails?.property?.propertyOwner?.contactNo}
                                    </h2>

                                  </div>
                                </h5> :
                                  <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                                    <h2 className="m-0 p-0 font-size-5 font-weight-medium">
                                      Not mention
                                    </h2>
                                  </h5>}
                              </Col>
                            </Row>
                            <Row className="d-flex align-items-center">
                              <Col xs={8} sm={8} md={8} lg={6} xl={9} xxl={8}>
                                {" "}
                                <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                                  Host Details
                                </h5>
                              </Col>
                              <Col xs={1}>
                                {" "}
                                <h5 className="my-1 p-0 font-size-5 ont-weight-normal">:</h5>
                              </Col>
                              <Col xs={15} sm={15} md={15} lg={17} xl={14} xxl={15}>
                                {" "}
                                <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                                  <img
                                    src={
                                      reservationDetails?.property?.host?.file?.smallPath
                                        ? reservationDetails?.property?.host?.file?.smallPath
                                        : defaultProfileImage
                                    }
                                    alt="cusImg"
                                    height={35}
                                    width={35}
                                    style={{ objectFit: "cover" }}
                                    className="my-1 ms-2 me-1 rounded-5"
                                  />{" "}
                                  <div className="d-flex flex-column justify-content-center">
                                    <h2 className="m-0 p-0 font-size-5 font-weight-medium">
                                      {`${reservationDetails?.property?.host?.firstName ?? ""} ${reservationDetails?.property?.host?.lastName ?? ""}`.trim()}
                                    </h2>
                                    <h2 className="m-0 mt-1 p-0 font-size-5 font-weight-medium">
                                      {reservationDetails?.property?.host?.countryCode &&
                                        reservationDetails?.property?.host?.contactNo &&
                                        reservationDetails?.property?.host?.countryCode +
                                        " " +
                                        reservationDetails?.property?.host?.contactNo}
                                    </h2>
                                  </div>
                                </h5>
                              </Col>
                            </Row>
                          </Col>
                        </Row>


                        {/* <h2 className="my-1 mt-3 p-0 font-size-5 font-weight-normal">
                          {parse(
                            truncateDescriptions(
                              reservationDetails?.property?.description || "",
                              120
                            )
                          )}
                        </h2> */}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <div className="mt-5 w-100">
                <Row className="w-100">
                  <Col xs={24} sm={24} md={14} lg={16} xl={16} xxl={16}>
                    <Collapse
                      className="bg-transparent w-100"
                      bordered={false}
                      activeKey={["1", "2", "3", "4"]}
                      expandIcon={({ isActive }) => ""}
                      style={{ background: token.colorBgContainer }}
                      items={getItems(panelStyle)}
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={8}
                    xl={8}
                    xxl={8}
                    className="ps-2 ps-sm-5"
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <h2 className="mb-4 p-0 font-size-4 font-weight-medium">
                          Reservation Timeline
                        </h2>
                        <Timeline
                          items={reservationDetails?.reservationTimelines.map(
                            (item) => ({
                              children: (
                                <div>
                                  <h2 className="my-1 p-0 font-size-5 font-weight-normal">
                                    {item.status} -
                                    {moment.utc(item.createdAt).local().format("YYYY.MM.DD")}
                                  </h2>
                                  <h2 className="my-1 p-0 font-size-5 font-weight-normal">
                                    {item.reason ? `Reason : ${item.reason}` : ""}
                                  </h2>
                                </div>
                              ),
                            })
                          )}
                        />
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <h2 className="my-4 p-0 font-size-4 font-weight-medium">
                          Payment Timeline
                        </h2>

                        {reservationDetails?.paymentsTimeLines &&
                          reservationDetails?.paymentsTimeLines.length > 0 ? (
                          <Timeline
                            items={reservationDetails?.paymentsTimeLines.map(
                              (item) => ({
                                children: (
                                  <div>
                                    <h2 className="my-1 p-0 font-size-5 font-weight-normal">
                                      {item.status} -
                                      {moment.utc(item.createdAt).local().format("YYYY.MM.DD")}
                                    </h2>
                                    <h2 className="my-1 p-0 font-size-5 font-weight-normal">
                                      {item.reason
                                        ? `Reason : ${item.reason}`
                                        : ""}
                                    </h2>
                                  </div>
                                ),
                              })
                            )}
                          />
                        ) : (
                          <h2 className="my-2 p-0 font-size-5 font-weight-medium">
                            Payment time line not available
                          </h2>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>

    </div>
  );
};
export default ViewReservationPage;
