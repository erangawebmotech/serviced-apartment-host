import { Col, Row, Select } from "antd";
import "../../styles/propertyListingStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleError, popUploader } from "../../common/commonFunctions";
import { useDispatch } from "react-redux";
import {
  BlockedSummaryEventObject,
  BlockedSummaryEventPropertyObject,
  DiscountSummaryEventObject,
  DropdownObj,
  ICalReservationSummaryEventObject,
  MaintenanceSummaryEventObject,
  MaintenanceSummaryEventPropertyObject,
  ReservationSummaryEventObject,
  SelectedCalenderDateEventDataObject,
  SelectedCalenderDateObject,
} from "../../common/interfaces/uiNecessaryInterface";
import { CalendarEventEnum } from "../../common/enums/calendarEventEnum";
import { getCalendarEventDetails } from "../../service/calendarService";
import { Home } from "react-feather";
import EventDrawer from "../common/drawer/EventDrawer";
import ReservationEventCard from "../common/cards/ReservationEventCard";
import MaintenanceEventCard from "../common/cards/MaintenanceEventCard";
import BlockedEventCard from "../common/cards/BlockedEventCard";
import { CalendarColorsEnum } from "../../common/enums/calendarColorsEnum";
import ICalReservationEventCard from "../common/cards/ICalReservationEventCard";

interface ReservationsAndOtherDetailsTabProps {
  propertyId: number;
  selectedDates: SelectedCalenderDateObject[];
  isOnlyPropertyOwner: boolean,
  loadCalenderDated: () => void;
}
const ReservationsAndOtherDetailsTab: React.FC<
  ReservationsAndOtherDetailsTabProps
> = ({ propertyId, selectedDates, isOnlyPropertyOwner, loadCalenderDated }) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isOpenEventDrawer, setIsOpenEventDrawer] = useState<boolean>(false);
  const [selectedEventPropertyDetails, setSelectedEventPropertyDetails] =
    useState();
  const [selectedEventDetails, setSelectedEventDetails] = useState();
  const [selectedEventTypeDetails, setSelectedEventTypeDetails] = useState();
  const [selectedEventType, setSelectedEventType] = useState<string>();
  const [eventTypeList, setEventTypeList] = useState<DropdownObj[]>();
  const [calendarEvents, setCalendarEvents] =
    useState<SelectedCalenderDateEventDataObject>();

  useEffect(() => {
    setEventTypeList([
      {
        value: CalendarEventEnum.RESERVATION,
        label: "Reservation",
      },
      {
        value: CalendarEventEnum.BLOCKED,
        label: "Blocked",
      },
      // {
      //   value: CalendarEventEnum.MAINTENANCE,
      //   label: "Maintenance",
      // },
      // {
      //   value: CalendarEventEnum.DISCOUNT,
      //   label: "Discount",
      // },
    ]);
  }, []);

  useEffect(() => {
    if (propertyId) {
      // console.log(selectedDates);
      getSelectedCalenderDateEventSchedules();
    }
  }, [selectedDates]);

  const getSelectedCalenderDateEventSchedules = () => {
    if (selectedDates.length > 0) {
      const data = {
        propertyId: propertyId,
        dateRanges: selectedDates,
      };
      popUploader(dispatch, true);
      getCalendarEventDetails(data)
        .then((response: any) => {
          const formattedData: Record<string, any[]> = {};
          setCalendarEvents(response?.data);
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    } else {
      setCalendarEvents(undefined);
    }
  };

  const handleEventDetailsDrawerOpen = (
    property: any,
    event: any,
    eventTypeDetails: any
  ) => {
    setSelectedEventPropertyDetails(property);
    setSelectedEventDetails(event);
    setSelectedEventTypeDetails(eventTypeDetails);
    setIsOpenEventDrawer(true);
  };

  return (
    <div className="ReservationsAndOtherDetailsTabContainer h-100 w-100">
      {selectedEventDetails && (
        <EventDrawer
          isOpen={isOpenEventDrawer}
          isOnlyPropertyOwner={isOnlyPropertyOwner}
          eventPropertyDetails={selectedEventPropertyDetails}
          eventDetails={selectedEventDetails}
          eventTypeDetails={selectedEventTypeDetails}
          onClose={() => {
            setIsOpenEventDrawer(false);
          }}
          clearSelectedDates={() => {
            setSelectedEventDetails(undefined);
            loadCalenderDated();
          }}
        />
      )}
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
          {propertyId ? (
            <div>
              {" "}
              {calendarEvents ? (
                <div>
                  <Select
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    value={selectedEventType}
                    showSearch
                    allowClear
                    placeholder="Select type"
                    optionFilterProp="label"
                    onChange={(value) => {
                      setSelectedEventType(value ?? undefined);
                    }}
                    options={eventTypeList}
                  />
                  {(selectedEventType === undefined ||
                    selectedEventType === CalendarEventEnum.RESERVATION) &&
                    (calendarEvents?.reservationSummary?.summary?.events
                      .length > 0 ||
                      calendarEvents?.icalReservationSummary?.summary?.events
                        .length > 0) && (
                      <div>
                        <h5
                          className="font-size-4  mb-2 mt-3"
                          style={{ color: CalendarColorsEnum.RESERVATION }}
                        >
                          Reservations
                        </h5>
                        {calendarEvents?.reservationSummary?.summary?.events.map(
                          (
                            event: ReservationSummaryEventObject,
                            index: number
                          ) => {
                            return (
                              <ReservationEventCard
                                index={index}
                                reservationNumber={event?.reservationNumber}
                                checkInDate={event?.checkInDate}
                                checkOutDate={event?.checkOutDate}
                                reservationOwner={event?.reservedUser}
                                status={event?.status}
                                specialRequest={event?.specialRequest}
                                totalAmount={event?.totalAmount}
                                typeColor={CalendarColorsEnum.RESERVATION}
                                isOnlyPropertyOwner={isOnlyPropertyOwner}
                                handleEventDetailsDrawerOpen={() => {
                                  handleEventDetailsDrawerOpen(
                                    undefined,
                                    event,
                                    calendarEvents?.reservationSummary
                                  );
                                }}
                              />
                            );
                          }
                        )}
                        {calendarEvents?.icalReservationSummary?.summary?.events.map(
                          (
                            event: ICalReservationSummaryEventObject,
                            index: number
                          ) => {
                            return (
                              <ICalReservationEventCard
                                index={index}
                                checkInDate={event?.checkInDate}
                                checkOutDate={event?.checkOutDate}
                                platform={event?.platform}
                                typeColor={CalendarColorsEnum.RESERVATION}
                              />
                            );
                          }
                        )}
                      </div>
                    )}

                  {(selectedEventType === undefined ||
                    selectedEventType === CalendarEventEnum.MAINTENANCE) &&
                    calendarEvents?.maintenanceSummary?.summary?.events.length >
                    0 && (
                      <div>
                        <h5
                          className="font-size-4 mb-2 mt-3"
                          style={{ color: CalendarColorsEnum.MAINTAINS }}
                        >
                          Maintenance
                        </h5>
                        {calendarEvents?.maintenanceSummary?.summary?.events.map(
                          (
                            event: MaintenanceSummaryEventObject,
                            index: number
                          ) => {
                            return (
                              <div>
                                {event?.properties.map(
                                  (
                                    property: MaintenanceSummaryEventPropertyObject
                                  ) => {
                                    return (
                                      <MaintenanceEventCard
                                        index={index}
                                        date={event?.date}
                                        // owner={
                                        //   calendarEvents?.maintenanceSummary.owner
                                        // }
                                        // status={property?.status}
                                        unitName={property?.name}
                                        reason={property?.reason}
                                        typeColor={CalendarColorsEnum.MAINTAINS}
                                      // handleEventDetailsDrawerOpen={() => {
                                      //   handleEventDetailsDrawerOpen(
                                      //     property,
                                      //     event,
                                      //     calendarEvents?.maintenanceSummary
                                      //   );
                                      // }}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  {(selectedEventType === undefined ||
                    selectedEventType === CalendarEventEnum.BLOCKED) &&
                    calendarEvents?.blockedSummary?.summary?.accommodationUnis
                      ?.length > 0 ? (
                    <div>
                      <h5
                        className="font-size-4 mb-2 mt-3"
                        style={{ color: CalendarColorsEnum.BLOCK }}
                      >
                        Blocked
                      </h5>
                      {calendarEvents?.blockedSummary?.allowIndividualUnit &&
                        calendarEvents?.blockedSummary?.summary?.accommodationUnis.map(
                          (
                            unit: {
                              id: number;
                              name: string;
                              events: BlockedSummaryEventObject[];
                            },
                            index: number
                          ) => {
                            return (
                              <BlockedEventCard
                                index={index}
                                unitName={unit?.name}
                                unitCount={unit?.events ? unit?.events : []}
                                // reason={"property?.reason"}
                                typeColor={CalendarColorsEnum.BLOCK}
                                handleEventDetailsDrawerOpen={() => {
                                  handleEventDetailsDrawerOpen(
                                    "",
                                    unit,
                                    calendarEvents?.blockedSummary
                                  );
                                }}
                              />
                            );
                          }
                        )}
                    </div>
                  ) : calendarEvents?.blockedSummary?.summary
                    ?.entireProperDetails?.length > 0 ? (
                    <div>
                      <h5
                        className="font-size-4 mb-2 mt-3"
                        style={{ color: CalendarColorsEnum.BLOCK }}
                      >
                        Blocked
                      </h5>

                      {calendarEvents?.blockedSummary?.allowEntireProperty && (
                        <BlockedEventCard
                          index={0}
                          date={
                            calendarEvents?.blockedSummary?.summary
                              ?.entireProperDetails
                          }
                          // owner={calendarEvents?.blockedSummary.owner}
                          // status={property?.status}
                          unitName={"Entire Property"}
                          // reason={event?.reason}
                          typeColor={CalendarColorsEnum.BLOCK}
                          handleEventDetailsDrawerOpen={() => {
                            handleEventDetailsDrawerOpen(
                              "",
                              calendarEvents?.blockedSummary?.summary
                                ?.entireProperDetails,
                              calendarEvents?.blockedSummary
                            );
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {/* {(selectedEventType === undefined ||
                selectedEventType === CalendarEventEnum.DISCOUNT) &&
                calendarEvents?.discountSummary?.summary?.events.length > 0 && (
                  <div>
                    <h5
                      className="font-size-4 mb-2 mt-3"
                      style={{ color: "#1EB200" }}
                    >
                      Discount
                    </h5>
                    {calendarEvents?.discountSummary?.summary?.events.map(
                      (event: DiscountSummaryEventObject, index: number) => {
                        return (
                          <ReservationEventCard
                            index={index}
                            reservationNumber={event?.reservationNumber}
                            checkInDate={event?.checkInDate}
                            checkOutDate={event?.checkOutDate}
                            reservationOwner={event?.reservationOwner}
                            status={event?.status}
                            specialRequest={event?.specialRequest}
                            totalAmount={event?.totalAmount}
                            typeColor="#1EB200"
                            handleEventDetailsDrawerOpen={() => {
                              handleEventDetailsDrawerOpen(
                                undefined,
                                event,
                                calendarEvents?.discountSummary
                              );
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                )} */}
                </div>
              ) : (
                <div className="w-100 h-100">
                  <div
                    className="my-2 d-flex flex-column justify-content-center align-items-center"
                    style={{ height: 580, backgroundColor: "#FFF5F5" }}
                  >
                    <Home
                      className="font-size-5 primary-color mb-2"
                      strokeWidth={1.6}
                    />
                    <h5 className="font-size-5 primary-color font-weight-normal">
                      Select dates to get details
                    </h5>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-100 h-100">
              <div
                className="my-2 d-flex flex-column justify-content-center align-items-center"
                style={{ height: 580, backgroundColor: "#FFF5F5" }}
              >
                <Home
                  className="font-size-5 primary-color mb-2"
                  strokeWidth={1.6}
                />
                <h5 className="font-size-5 primary-color font-weight-normal">
                  Please select property
                </h5>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReservationsAndOtherDetailsTab;
