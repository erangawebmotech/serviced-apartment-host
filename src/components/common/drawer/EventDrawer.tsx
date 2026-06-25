import React, { FC, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Drawer,
  Divider,
  Button,
  Checkbox,
} from "antd";
import { User } from "react-feather";
import { CalendarEventEnum } from "../../../common/enums/calendarEventEnum";
import moment from "moment";
import ReservationStatusTag from "../tags/ReservationStatusTag";
import { formatCountdown } from "antd/es/statistic/utils";
import {
  customSweetAlert,
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { unblockCalenderDates } from "../../../service/calendarService";
import { useDispatch } from "react-redux";
import { SelectedCalenderDateObject } from "../../../common/interfaces/uiNecessaryInterface";
import defaultProfileImage from "../../../assets/images/profileDefaultImg.jpg";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";

interface EventDrawerProps {
  isOpen: boolean;
  eventPropertyDetails?: any;
  eventDetails: any;
  eventTypeDetails: any;
  isOnlyPropertyOwner: boolean,
  onClose: () => void;
  clearSelectedDates: () => void;
}

const EventDrawer: FC<EventDrawerProps> = ({
  isOpen,
  eventPropertyDetails,
  eventDetails,
  eventTypeDetails,
  isOnlyPropertyOwner,
  onClose,
  clearSelectedDates,
}) => {
  const dispatch = useDispatch();

  const [selectedUnits, setSelectedUnits] = useState<
    { date: string; subUnitId: number }[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [selectedEntireDates, setSelectedEntireDates] = useState<string[]>([]);
  const [selectAllEntireDates, setSelectAllEntireDates] =
    useState<boolean>(false);

  // useEffect(() => {
  //   console.log(eventDetails, "eventDetails");
  //   console.log(eventPropertyDetails, "eventPropertyDetails");
  //   console.log(eventTypeDetails, "eventTypeDetails");
  // }, [isOpen]);

  // Flatten all unique checkbox entries
  const allSubUnits =
    eventDetails?.events?.flatMap((event: any) =>
      event.subUnitDetailsDTOS.map((subU: any) => ({
        date: event.date,
        subUnitId: subU.id,
      }))
    ) || [];

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedUnits(checked ? allSubUnits : []);
  };

  const allEntireDates =
    (eventTypeDetails?.allowEntireProperty &&
      !eventTypeDetails?.allowIndividualUnit &&
      eventDetails?.flatMap((event: any, index: number) => ({
        date: event.date,
        subUnitId: index,
      }))) ||
    [];

  const handleSelectAllEntireDates = (checked: boolean) => {
    setSelectAllEntireDates(checked);
    setSelectedUnits(checked ? allEntireDates : []);
  };

  const handleCheckboxChange = (date: string, subUnitId: number) => {
    setSelectedUnits((prevSelected) => {
      const exists = prevSelected.some(
        (item) => item.date === date && item.subUnitId === subUnitId
      );
      return exists
        ? prevSelected.filter(
          (item) => !(item.date === date && item.subUnitId === subUnitId)
        )
        : [...prevSelected, { date, subUnitId }];
    });
  };

  const handleUnblockRooms = () => {
    let isValidate = false;

    selectedUnits.length <= 0
      ? customToastMsg("Please select rooms to unblock", 2)
      : (isValidate = true);

    if (isValidate) {
      const groupedData: Record<
        number,
        {
          subUnitId: number;
          dateRanges: { startDate: string; endDate: string }[];
        }
      > = {};

      selectedUnits.forEach(({ date, subUnitId }) => {
        const startDate = moment(date)
          .startOf("day")
          .format("YYYY-MM-DDT00:00:00");
        const endDate = moment(date).endOf("day").format("YYYY-MM-DDT23:59:59");

        if (!groupedData[subUnitId]) {
          groupedData[subUnitId] = { subUnitId, dateRanges: [] };
        }

        groupedData[subUnitId].dateRanges.push({ startDate, endDate });
      });

      const payload = {
        propertyId: eventTypeDetails?.propertyId,
        isEntireProperty: false,
        unitDetails: Object.values(groupedData),
        dateRanges: null,
        type: "BLOCKED",
      };

      // console.log("Unblock Payload:", JSON.stringify(payload, null, 2));
      customSweetAlert(
        "Are you sure to unblock this selected rooms ?",
        4,
        () => {
          unblockCalenderDates(payload)
            .then(() => {
              popUploader(dispatch, false);
              customToastMsg("Selected romes unblocked successfully", 1);
              setSelectedUnits([]);
              setSelectAll(false);
              onClose();
              clearSelectedDates();
            })
            .catch((error) => {
              popUploader(dispatch, false);
              handleError(error);
            });
        }
      );
    }
  };

  const handleUnblockEntireProperty = () => {
    // console.log(selectedUnits);

    const transformedArray = selectedUnits.map((item) => {
      return {
        startDate: moment(item.date)
          .startOf("day")
          .format("YYYY-MM-DDT00:00:00"),
        endDate: moment(item.date).endOf("day").format("YYYY-MM-DDT23:59:59"),
      };
    });

    const payload = {
      propertyId: eventTypeDetails?.propertyId,
      isEntireProperty: true,
      unitDetails: null,
      dateRanges: transformedArray,
      type: "BLOCKED",
    };

    // console.log("Unblock Payload:", JSON.stringify(payload, null, 2));
    customSweetAlert("Are you sure to unblock this selected dates ?", 4, () => {
      unblockCalenderDates(payload)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Selected dates unblocked successfully", 1);
          setSelectedUnits([]);
          setSelectAllEntireDates(false);
          onClose();
          clearSelectedDates();
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    });
  };

  return (
    <Drawer
      title={`${eventTypeDetails?.summary?.type === CalendarEventEnum.BLOCKED
        ? "Blocked"
        : eventTypeDetails?.summary?.type === CalendarEventEnum.DISCOUNT
          ? "Discount"
          : eventTypeDetails?.summary?.type === CalendarEventEnum.MAINTENANCE
            ? "Maintenance"
            : eventTypeDetails?.summary?.type === CalendarEventEnum.RESERVATION
              ? "Reservation"
              : ""
        } Details`}
      onClose={onClose}
      open={isOpen}
      width="600px"
      footer={
        eventTypeDetails?.summary?.type === CalendarEventEnum.BLOCKED ? (
          eventTypeDetails?.allowIndividualUnit ? (
            <div>
              <Row className="d-flex justify-content-between align-items-center p-3">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Select All
                </Checkbox>
                <Button onClick={handleUnblockRooms}>
                  Unblock Selected Rooms
                </Button>{" "}
              </Row>
            </div>
          ) : eventTypeDetails?.allowEntireProperty ? (
            <div>
              <Row className="d-flex justify-content-between align-items-center p-3">
                <Checkbox
                  checked={selectAllEntireDates}
                  onChange={(e) => handleSelectAllEntireDates(e.target.checked)}
                >
                  Select All Dates
                </Checkbox>
                <Button onClick={handleUnblockEntireProperty}>
                  Unblock Entire Property
                </Button>{" "}
              </Row>
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )
      }
    >
      {eventTypeDetails?.summary?.type === CalendarEventEnum.RESERVATION && (
        <div className="w-100">
          {!isOnlyPropertyOwner &&
            <div>
              <h5 className="font-size-4 primary-color mt-2 mb-3">
                Account Holder
              </h5>
              <Row className="my-1">
                <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
                  <h5 className="font-size-5">Name</h5>
                </Col>
                <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                  <h5 className="font-size-5">
                    <img
                      src={
                        eventDetails?.reservedUser?.file?.smallPath
                          ? eventDetails?.reservedUser?.file?.smallPath
                          : defaultProfileImage
                      }
                      alt="cusImg"
                      height={30}
                      width={30}
                      style={{ objectFit: "cover" }}
                      className="me-2 rounded-5"
                    />
                    {`${eventDetails?.reservedUser?.firstName ?? ""} ${eventDetails?.reservedUser?.lastName ?? ""}`.trim()}
                  </h5>
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
                  <h5 className="font-size-5">Email</h5>
                </Col>
                <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                  <h5
                    className="font-size-5"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {eventDetails?.reservedUser?.email}
                  </h5>
                </Col>
              </Row>
              <Divider />
            </div>
          }

          {eventDetails?.reservedUser?.countryCode &&
            eventDetails?.reservedUser?.contactNo && (
              <Row className="my-1">
                <Col
                  xs={12}
                  sm={12}
                  md={8}
                  lg={10}
                  xl={8}
                  xxl={8}
                  className="pe-2"
                >
                  <h5 className="font-size-5">Contact No</h5>
                </Col>
                <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                  <h5 className="font-size-5">
                    {eventDetails?.reservedUser?.countryCode +
                      " " +
                      eventDetails?.reservedUser?.contactNo}
                  </h5>
                </Col>
              </Row>
            )}


          <h5 className="font-size-4 primary-color mt-2 mb-3">
            Reservation Details
          </h5>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Res.Number</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{eventDetails?.reservationNumber}</h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Status</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <ReservationStatusTag reservationStatus={eventDetails?.status} />
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5"> Check In Date</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {moment(eventDetails?.checkInDate).format("YYYY.MM.DD")}
              </h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5"> Check Out Date</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {moment(eventDetails?.checkOutDate).format("YYYY.MM.DD")}
              </h5>
            </Col>
          </Row>
          {!isOnlyPropertyOwner &&
            <Row className="my-1">
              <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
                <h5 className="font-size-5">Guest Details</h5>
              </Col>
              {eventDetails?.guestFirstName ? <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                <h5 className="font-size-5">
                  {`${eventDetails?.guestFirstName ?? ""} ${eventDetails?.guestLastName ?? ""}`.trim()}
                </h5>
                <h5
                  className="font-size-5"
                  style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {eventDetails?.guestEmail}
                </h5>
                <h5 className="font-size-5">
                  {eventDetails?.guestCountryCode &&
                    eventDetails?.guestContactNumber &&
                    eventDetails?.guestCountryCode +
                    " " +
                    eventDetails?.guestContactNumber}
                </h5>
              </Col> :
                <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                  <h5
                    className="font-size-5"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    Not mention
                  </h5>
                </Col>}
            </Row>}
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Payment Type</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {formatNamesCmnFun(
                  eventDetails?.paymentType ? eventDetails?.paymentType : ""
                )}
              </h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Property Ownership</h5>
            </Col>
            {eventTypeDetails?.owner ? <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                <img
                  src={
                    eventTypeDetails?.owner?.file?.smallPath
                      ? eventTypeDetails?.owner?.file?.smallPath
                      : defaultProfileImage
                  }
                  alt="cusImg"
                  height={30}
                  width={30}
                  style={{ objectFit: "cover" }}
                  className="me-2 rounded-5"
                />{" "}
                {`${eventTypeDetails?.owner?.firstName ?? ""} ${eventTypeDetails?.owner?.lastName ?? ""}`.trim()}
              </h5>
              <h5
                className="font-size-5"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                {eventTypeDetails?.owner?.email}
              </h5>
              <h5 className="font-size-5">
                {eventTypeDetails?.owner?.countryCode &&
                  eventTypeDetails?.owner?.contactNo &&
                  eventTypeDetails?.owner?.countryCode +
                  " " +
                  eventTypeDetails?.owner?.contactNo}
              </h5>
            </Col> :
              <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                <h5
                  className="font-size-5"
                  style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  Not mention
                </h5>
              </Col>}
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Total Amount</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{CurrencyEnum.USD} {eventDetails?.totalAmount}</h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Special Request</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {eventDetails?.specialRequest
                  ? eventDetails?.specialRequest
                  : "N/A"}
              </h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Guest Count</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{eventDetails?.numberOfGuests}</h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Reservation Type</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {eventDetails?.isEntireProperty ? "Entire Property" : "Unit"}
              </h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Reserved Room Count</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{eventDetails?.totalRoomCount}</h5>
            </Col>
          </Row>
          <h5 className="font-size-4 primary-color mt-4 mb-3">
            Reserved Room Details
          </h5>
          {eventDetails?.roomDetails.map((room: any) => {
            return (
              <div className="my-1 shadow p-3 my-3 rounded-4">
                <Row className="my-1">
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={10}
                    xl={8}
                    xxl={8}
                    className="pe-2"
                  >
                    <h5 className="font-size-5">Room Name</h5>
                  </Col>
                  <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                    <h5 className="font-size-5">{room?.name}</h5>
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={10}
                    xl={8}
                    xxl={8}
                    className="pe-2"
                  >
                    <h5 className="font-size-5">Room Count</h5>
                  </Col>
                  <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                    <h5 className="font-size-5">{room?.roomCount}</h5>
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={10}
                    xl={8}
                    xxl={8}
                    className="pe-2"
                  >
                    <h5 className="font-size-5">Guest Count</h5>
                  </Col>
                  <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                    <h5 className="font-size-5">{room?.maxHeadCount}</h5>
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      )}

      {eventTypeDetails?.summary?.type === CalendarEventEnum.BLOCKED &&
        eventTypeDetails?.allowEntireProperty &&
        !eventTypeDetails?.allowIndividualUnit ? (
        <div className="w-100">
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Property Name</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{eventTypeDetails?.name}</h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Property Type</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {eventTypeDetails?.propertyType?.type}
              </h5>
            </Col>
          </Row>
          <Divider />
          <h5 className="font-size-5 font-weight-semi-bold mb-3">
            Entire Property Blocked
          </h5>
          {eventTypeDetails?.allowEntireProperty &&
            !eventTypeDetails?.allowIndividualUnit &&
            eventDetails.map((event: any, index: number) => {
              return (
                <div className="mb-4">
                  <Row className="my-1 shadow p-3 my-3 rounded-4">
                    <Col
                      xs={3}
                      sm={3}
                      md={2}
                      lg={2}
                      xl={2}
                      xxl={2}
                      className="d-flex align-items-center"
                    >
                      <Checkbox
                        value={{ date: event.date, id: index }}
                        checked={selectedUnits.some(
                          (item) =>
                            item.date === event.date && item.subUnitId === index
                        )}
                        onChange={() => handleCheckboxChange(event.date, index)}
                      />
                    </Col>
                    <Col xs={21} sm={21} md={22} lg={22} xl={22} xxl={22}>
                      <Row className="my-1">
                        <Col
                          xs={12}
                          sm={12}
                          md={8}
                          lg={10}
                          xl={8}
                          xxl={8}
                          className="pe-2"
                        >
                          <h5 className="font-size-5">Blocked Date</h5>
                        </Col>
                        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                          <h5 className="font-size-5">
                            {moment(event?.date).format("YYYY.MM.DD")}
                          </h5>
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col
                          xs={12}
                          sm={12}
                          md={8}
                          lg={10}
                          xl={8}
                          xxl={8}
                          className="pe-2"
                        >
                          <h5 className="font-size-5">Blocked Reason</h5>
                        </Col>
                        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
                          <h5 className="font-size-5">{event?.reason}</h5>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
      ) : eventTypeDetails?.allowIndividualUnit ? (
        <div className="w-100">
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Property Name</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">{eventTypeDetails?.name}</h5>
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={8} className="pe-2">
              <h5 className="font-size-5">Property Type</h5>
            </Col>
            <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={16}>
              <h5 className="font-size-5">
                {eventTypeDetails?.propertyType?.type}
              </h5>
            </Col>
          </Row>
          <Divider />
          <h5 className="font-size-5 font-weight-semi-bold mb-3">
            {eventDetails?.name} Room Category
          </h5>

          {eventDetails?.events.map((event: any) => {
            return (
              <div className="mb-4">
                <Row className="my-1">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <h5 className="font-size-5 ">
                      {" "}
                      {moment(event?.date).format("YYYY.MM.DD")}
                    </h5>
                  </Col>
                </Row>
                {event?.subUnitDetailsDTOS.map((subU: any) => {
                  return (
                    <Row className="my-1 shadow p-3 my-3 rounded-4">
                      <Col
                        xs={3}
                        sm={3}
                        md={2}
                        lg={2}
                        xl={2}
                        xxl={2}
                        className="d-flex align-items-center"
                      >
                        <Checkbox
                          value={{ date: event.date, id: subU.id }}
                          checked={selectedUnits.some(
                            (item) =>
                              item.date === event.date &&
                              item.subUnitId === subU.id
                          )}
                          onChange={() =>
                            handleCheckboxChange(event.date, subU.id)
                          }
                        />
                      </Col>
                      <Col xs={21} sm={21} md={22} lg={22} xl={22} xxl={22}>
                        <Row>
                          <Col xs={5} sm={5} md={4} lg={4} xl={4} xxl={4}>
                            {subU?.name}
                          </Col>
                          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
                            -
                          </Col>
                          <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                            {subU?.reason}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </Drawer>
  );
};

export default EventDrawer;
