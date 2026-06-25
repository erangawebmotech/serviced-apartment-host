import { Button, Col, Row, Select } from "antd";
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

interface SynchronizeTabProps {
  propertyId: number;
}
const SynchronizeTab: React.FC<
  SynchronizeTabProps
> = ({ propertyId }) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="SynchronizeTabContainer h-100 w-100">
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
              <Button
                size="large"
                type="primary"
                className="w-100 mt-3"
                onClick={() => history(`/synchronize/${propertyId}`)}
              >
                Go to Synchronize iCal Links
              </Button>
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

export default SynchronizeTab;
