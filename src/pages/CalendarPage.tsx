import {
  Badge,
  BadgeProps,
  Button,
  Calendar,
  CalendarProps,
  Col,
  DatePicker,
  Row,
  Select,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import "../styles/propertyListingStyles.scss";
import "../styles/calenderStyles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { handleError, popUploader } from "../common/commonFunctions";
import { getCalendarDates, getCalendarPrices } from "../service/calendarService";
import NavBar from "../components/NavBar";
import moment from "moment";
import { getAllPropertyListToDropdown } from "../service/listningService";
import CalendarTag from "../components/common/tags/CalendarTag";
import { CalendarEventEnum } from "../common/enums/calendarEventEnum";
import {
  DropdownObjThree,
  DropdownObjTwo,
  SelectedCalenderDateObject,
} from "../common/interfaces/uiNecessaryInterface";
import ReservationsAndOtherDetailsTab from "../components/calendarTabComponent/ReservationsAndOtherDetailsTab";
import BlockDatesTab from "../components/calendarTabComponent/BlockDatesTab";
import { X, XCircle } from "react-feather";
import DiscountsTab from "../components/calendarTabComponent/DiscountsTab";
import { CalendarColorsEnum } from "../common/enums/calendarColorsEnum";
import { CurrencyEnum } from "../common/enums/currencyEnum";
import SynchronizeTab from "../components/calendarTabComponent/SynchronizeTab";

const CalendarPage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const startOfMonth = dayjs().startOf("month").startOf("day");
  const endOfMonth = dayjs().endOf("month").endOf("day");

  const [calendarSelectedDates, setCalendarSelectedDates] = useState<
    SelectedCalenderDateObject[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const [selectedDateRanges, setSelectedDateRanges] = useState<
    [Dayjs | null | undefined, Dayjs | null | undefined]
  >([startOfMonth, endOfMonth]);
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [calendarPrices, setCalendarPrices] = useState<Record<string, number>>({});
  const [selectedPropertyId, setSelectedPropertyId] = useState<number>();
  const [userPropertyList, setUserPropertyList] = useState<DropdownObjThree[]>();
  const [activeTab, setActiveTab] = useState("1");

  const [isOnlyPropertyOwner, setIsOnlyPropertyOwner] =
    useState<boolean>(false);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(true);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsFullScreen(window.innerWidth > 768);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    const { state } = location;
    if (state && state.propertyId) {
      const { propertyId } = state;
      const propIdNum = parseInt(propertyId)
      setSelectedPropertyId(propIdNum);
    }
  }, [location]);

  useEffect(() => {
    getAllUserProperties();
  }, []);

  useEffect(() => {
    if (
      userPropertyList &&
      userPropertyList.length > 0 &&
      !selectedPropertyId
    ) {
      setSelectedPropertyId(userPropertyList?.[0]?.value ?? undefined);
    }
  }, [userPropertyList]);

  useEffect(() => {
    getCalenderSchedules();
    getCalenderPropertyPrices();
    if (selectedDateRanges.length > 0 && selectedDateRanges[0]) {
      setCurrentMonth(dayjs(selectedDateRanges[0]));
    }
  }, [selectedDateRanges, selectedPropertyId]);

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

  const getCalenderSchedules = () => {
    let startDate = "";
    let endDate = "";

    if (selectedDateRanges === undefined || selectedDateRanges === null) {
      startDate = startOfMonth.format("YYYY-MM-DDTHH:mm:ss");
      endDate = endOfMonth.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      if (selectedDateRanges && selectedDateRanges.length === 2) {
        startDate = selectedDateRanges[0].format("YYYY-MM-DDTHH:mm:ss");
        endDate = selectedDateRanges[1].format("YYYY-MM-DDTHH:mm:ss");
      }

      if (selectedPropertyId) {
        const data = {
          propertyId: selectedPropertyId,
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
        };
        popUploader(dispatch, true);
        getCalendarDates(data)
          .then((response: any) => {

            // setIsOnlyPropertyOwner(true)
            setIsOnlyPropertyOwner(response?.data?.isOnlyPropertyOwner)
            const formattedData: Record<string, any[]> = {};

            response?.data?.calenderDetails?.calenderDates.forEach(
              (item: any) => {
                const dateKey = dayjs(item.date).format("YYYY-MM-DD");
                formattedData[dateKey] = item.events || [];
              }
            );

            // console.log(formattedData);

            setCalendarData(formattedData);
            popUploader(dispatch, false);
          })
          .catch((error) => {
            popUploader(dispatch, false);
            handleError(error);
          });
      }
    }
  };

  const getCalenderPropertyPrices = () => {
    let startDate = "";
    let endDate = "";

    if (selectedDateRanges === undefined || selectedDateRanges === null) {
      startDate = startOfMonth.format("YYYY-MM-DDTHH:mm:ss");
      endDate = endOfMonth.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      if (selectedDateRanges && selectedDateRanges.length === 2) {
        startDate = selectedDateRanges[0].format("YYYY-MM-DDTHH:mm:ss");
        endDate = selectedDateRanges[1].format("YYYY-MM-DDTHH:mm:ss");
      }

      if (selectedPropertyId) {
        const data = {
          propertyId: selectedPropertyId,
          startDate: startDate,
          endDate: endDate,
        };
        popUploader(dispatch, true);
        getCalendarPrices(data)
          .then((response: any) => {


            const formattedData: Record<string, number> = {};

            response?.data?.forEach(
              (item: any) => {
                const dateKey = dayjs(item.date).format("YYYY-MM-DD");
                formattedData[dateKey] = item.finalPrice || [];
              }
            );
            // console.log(formattedData);

            setCalendarPrices(formattedData);
            popUploader(dispatch, false);
          })
          .catch((error) => {
            popUploader(dispatch, false);
            handleError(error);
          });
      }
    }
  };

  const handleSelect = (date: Dayjs) => {
    const selectedMonthStart = date.startOf("month");

    if (selectedMonthStart.isBefore(currentMonth, "month")) {
      // console.log("Clicked a date from the previous month");
      goToPreviousMonth();
      return; // Exit early to avoid duplicate updates
    } else if (selectedMonthStart.isAfter(currentMonth, "month")) {
      // console.log("Clicked a date from the next month");
      goToNextMonth();
      return; // Exit early to avoid duplicate updates
    }


    setCurrentMonth(selectedMonthStart);

    const formattedDate = {
      startDate: date.startOf("day").format("YYYY-MM-DD[T]HH:mm:ss"),
      endDate: date.endOf("day").format("YYYY-MM-DD[T]HH:mm:ss"),
    };

    setCalendarSelectedDates((prevDates) => {
      const exists = prevDates.some(
        (d) =>
          d.startDate === formattedDate.startDate &&
          d.endDate === formattedDate.endDate
      );

      return exists
        ? prevDates.filter(
          (d) =>
            d.startDate !== formattedDate.startDate &&
            d.endDate !== formattedDate.endDate
        )
        : [...prevDates, formattedDate];
    });
  };

  const dateCellRender = (date: Dayjs) => {
    const formattedDate = date.startOf("day").format("YYYY-MM-DD[T]HH:mm:ss");

    const isSelected = calendarSelectedDates.some(
      (d) => d.startDate === formattedDate
    );

    const listData = getListData(date);
    const listPrice = getListPrice(date);

    // ✅ NEW: check if active reservation exists
    const hasActiveReservation = (calendarData[date.format("YYYY-MM-DD")] || []).some(
      (event: any) =>
        event.type === CalendarEventEnum.RESERVATION && event?.count > 0
    );

    // const hasCheckedOutReservation = (calendarData[date.format("YYYY-MM-DD")] || []).some(
    //   (event: any) =>
    //     event.type === CalendarEventEnum.RESERVATION && event?.checkedOut
    // );

    return (
      <div
        className={`calenderCellSelectedDiv ${isSelected ? "calendarCellSelectedState" : ""}`}
        style={{
          background: hasActiveReservation
            ? "#4da3ff2d"
            // : hasCheckedOutReservation
            //   ? "linear-gradient(to right, #4da3ff2d 50%, transparent 50%)" // ✅ half color
              : "transparent",
          color: "black",
        }}
      >
        {listData.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-center align-items-end m-0 p-0 mb-2 mb-lg-0"
          >
            <Badge
              className="m-0 p-0"
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </div>
        ))}
        {listPrice.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-end align-items-end h-auto m-0 p-0"
          >
            <h2 className="m-0 p-0 colanderPriceParent">{item.content}</h2>
          </div>
        ))}
      </div>
    );
  };

  const goToPreviousMonth = () => {
    // setCurrentMonth(currentMonth.subtract(1, "month"));
    const previousMonth = currentMonth.subtract(1, "month");
    const prevStart = previousMonth.startOf("month").startOf("day");
    const prevEnd = previousMonth.endOf("month").endOf("day");

    setSelectedDateRanges([prevStart, prevEnd]);
    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {

    const nextMonth = currentMonth.add(1, "month");
    const nextStart = nextMonth.startOf("month").startOf("day");
    const nextEnd = nextMonth.endOf("month").endOf("day");

    setSelectedDateRanges([nextStart, nextEnd]);
    setCurrentMonth(nextMonth);

  };

  const handleYearChange = (year: any) => {
    setCurrentMonth(currentMonth.year(year));
  };

  const getListData = (value: Dayjs) => {
    const formattedDate = value.format("YYYY-MM-DD");
    return (calendarData[formattedDate] || []).map((event) => ({
      type: event.type.toLowerCase(),
      content: (
        <span className="bg-primary ">
          { event.type === CalendarEventEnum.RESERVATION && event?.count > 0 ? (
            <CalendarTag
              color={CalendarColorsEnum.RESERVATION}
              count={event.count}
              label={CalendarEventEnum.RESERVATION}
              purpose="label"
            />
          ) : event.type === CalendarEventEnum.BLOCKED ? (
            <CalendarTag
              color={CalendarColorsEnum.BLOCK}
              count={event.count}
              label={CalendarEventEnum.BLOCKED}
              purpose="label"
            />
          ) : event.type === CalendarEventEnum.MAINTENANCE ? (
            <CalendarTag
              color={CalendarColorsEnum.MAINTAINS}
              count={event.count}
              label={CalendarEventEnum.MAINTENANCE}
              purpose="label"
            />
          ) : (
            // : event.type === CalendarEventEnum.DISCOUNT ? (
            //   <CalendarTag
            //     color="#FFAE00"
            //     count={event.count}
            //     label={CalendarEventEnum.DISCOUNT}
            //     purpose="label"
            //   />
            // )
            ""
          )}
        </span>
      ),
    }));
  };

  const getListPrice = (value: Dayjs) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const price = calendarPrices[formattedDate];

    if (price === undefined) return [];

    return [
      {
        content: (
          <Tooltip title={`${CurrencyEnum?.USD} ${price.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}>
            <div className="calendarPriceWrapper">

              <span className="ms-2 font-size-5 text-dark font-weight-normal calendarPriceText">
                {CurrencyEnum?.USD} {price.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>
          </Tooltip>
        ),
      },
    ];
  };


  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Calendar Overview",
      children: (
        <ReservationsAndOtherDetailsTab
          propertyId={
            selectedPropertyId ?? userPropertyList?.[0]?.value ?? 0
          }
          selectedDates={calendarSelectedDates}
          isOnlyPropertyOwner={isOnlyPropertyOwner}
          loadCalenderDated={() => {
            getCalenderSchedules();
            // getCalenderPropertyPrices();
            setCalendarSelectedDates([]);
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Pricing",
      children: (
        <DiscountsTab
          propertyId={
            selectedPropertyId ?? userPropertyList?.[0]?.value ?? 0
          }
          selectedDates={calendarSelectedDates}
          isOnlyPropertyOwner={isOnlyPropertyOwner}
          loadCalenderDated={() => {
            getCalenderSchedules();
            setCalendarSelectedDates([]);
          }}
          loadCalenderPricers={() => {
            getCalenderPropertyPrices();
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Manage Blocked Dates",
      children: (
        <BlockDatesTab
          propertyId={
            selectedPropertyId ?? userPropertyList?.[0]?.value ?? 0
          }
          selectedDates={calendarSelectedDates}
          loadCalenderDated={() => {
            getCalenderSchedules();
            // getCalenderPropertyPrices();
            setCalendarSelectedDates([]);
          }}
        />
      ),
    },
  ];

  if (!isOnlyPropertyOwner) {
    items.push({
      key: "4",
      label: "Synchronize",
      children: (
        <SynchronizeTab
          propertyId={
            selectedPropertyId ?? userPropertyList?.[0]?.value ?? 0
          }
        />
      ),
    });
  }

  return (
    <>
      <NavBar pageName="whitePage" />
      <div className="bg-white px-5 w-100 h-100 CalendarPageContainer homePage_ExtraPadding ">
        <Row className="w-100 h-100">
          <Col xs={24} sm={24} md={9} lg={9} xl={9} xxl={9}>
            <h3 className="font-size-2 text-gray-secondary">
              {currentMonth.format("MMMM YYYY")}
            </h3>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={5}
            lg={5}
            xl={5}
            xxl={5}
            className="px-2 my-3 my-md-0"
          >
            <Select
              style={{ height: 40, width: "100%", borderRadius: 4 }}
              value={selectedPropertyId}
              showSearch
              placeholder="Select a property"
              optionFilterProp="label"
              onChange={(value) => {
                setSelectedPropertyId(value ?? undefined);
                setCalendarSelectedDates([]);
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
            ))}</Select>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={10}
            lg={10}
            xl={10}
            xxl={10}
            className="px-2"
          >
            <RangePicker
              style={{ height: 40, width: "100%", borderRadius: 4 }}
              value={selectedDateRanges}
              onChange={(calendarSelectedDates) => {
                if (
                  calendarSelectedDates &&
                  calendarSelectedDates.length === 2
                ) {
                  setSelectedDateRanges([
                    calendarSelectedDates[0]?.startOf("day"),
                    calendarSelectedDates[1]?.endOf("day"),
                  ]);
                } else {
                  setSelectedDateRanges([startOfMonth, endOfMonth]);
                }
              }}
            />
          </Col>
        </Row>
        <Row className="mt-2 pt-5 pt-lg-0 w-100 h-100 contentRow">
          <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
            <div>
              <div className="d-flex align-items-center justify-content-between mt-3 mb-3">
                <div className="d-flex align-items-start flex-column flex-md-row">
                  {" "}
                  <Button onClick={goToPreviousMonth}>&lt; Previous</Button>
                  <Button
                    onClick={goToNextMonth}
                    className=" ms-0 ms-md-4 my-3 my-md-0"
                  >
                    Next &gt;
                  </Button>
                </div>

                <div className="d-flex align-items-end  flex-column flex-md-row">
                  <Button
                    className="me-0 me-md-3"
                    disabled={calendarSelectedDates.length <= 0}
                    onClick={(e) => {
                      setCalendarSelectedDates([]);
                    }}
                  >
                    <XCircle size={15} />
                    {calendarSelectedDates.length > 0 &&
                      calendarSelectedDates.length === 1
                      ? calendarSelectedDates.length + "  Day Selected"
                      : calendarSelectedDates.length + "  Days Selected"}
                  </Button>{" "}
                  <Select
                    className="my-3 my-md-0"
                    value={currentMonth.year()}
                    onChange={handleYearChange}
                    style={{ width: 100 }}
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = dayjs().year() - 5 + i;
                      return (
                        <Select.Option key={year} value={year}>
                          {year}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="responsive-calendar">
                <Calendar
                  value={currentMonth}
                  onSelect={handleSelect}
                  dateCellRender={dateCellRender}
                  headerRender={() => null}
                  fullscreen={isFullScreen}
                  cellRender={cellRender}
                />
              </div>
              <div className="d-flex flex-wrap justify-content-center">
                <CalendarTag
                  color={CalendarColorsEnum.RESERVATION}
                  count={""}
                  label={CalendarEventEnum.RESERVATION}
                  purpose="tag"
                />
                <CalendarTag
                  color={CalendarColorsEnum.BLOCK}
                  count={""}
                  label={CalendarEventEnum.BLOCKED}
                  purpose="tag"
                />
                {/* <CalendarTag
                  color={CalendarColorsEnum.MAINTAINS}
                  count={""}
                  label={CalendarEventEnum.MAINTENANCE}
                  purpose="tag"
                /> */}
                {/* <CalendarTag
                  color="#1EB200"
                  count={""}
                  label={CalendarEventEnum.DISCOUNT}
                  purpose="tag"
                /> */}
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={8}
            xl={8}
            xxl={8}
            className="ps-0 ps-lg-5 h-100 mt-5 mt-lg-0"
          >
            <Tabs
              activeKey={activeTab}
              destroyInactiveTabPane
              items={items}
              onChange={(key) => setActiveTab(key)}
              className="m-0"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CalendarPage;
