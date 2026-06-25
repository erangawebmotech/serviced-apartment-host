import {
  Button,
  Checkbox,
  Col,
  Collapse,
  CollapseProps,
  Form,
  Radio,
  Row,
  Select,
} from "antd";
import "../../styles/propertyListingStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  customToastMsg,
  handleError,
  popUploader,
} from "../../common/commonFunctions";
import * as constants from "../../common/constants";
import { Cookies } from "typescript-cookie";
import { useDispatch } from "react-redux";
import {
  AccommodationUnitSubUnitListObj,
  CalendarAccommodationUnitsListObj,
  CalendarDateAccommodationUnitsObj,
  CalendarDateAvailabilityObj,
  SelectedCalenderDateObject,
} from "../../common/interfaces/uiNecessaryInterface";
import {
  blockCalenderDates,
  getCalendarAccommodationUnits,
  getCalendarDateAvailability,
} from "../../service/calendarService";
import { AlertCircle, Calendar } from "react-feather";
import TextArea from "antd/es/input/TextArea";
import { CaretRightOutlined } from "@ant-design/icons";

interface BlockDatesTabProps {
  propertyId: number;
  selectedDates: SelectedCalenderDateObject[];
  loadCalenderDated: () => void;
}

const BlockDatesTab: React.FC<BlockDatesTabProps> = ({
  propertyId,
  selectedDates,
  loadCalenderDated,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [calendarEvents, setCalendarEvents] =
    useState<CalendarDateAvailabilityObj>();
  const [selectedAccommodationUnit, setSelectedAccommodationUnit] =
    useState<number>();
  const [accommodationUnitsList, setAccommodationUnitsList] = useState<
    CalendarAccommodationUnitsListObj[]
  >([]);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [unitList, setUnitList] = useState<AccommodationUnitSubUnitListObj[]>(
    []
  );
  const [blockPropertyTypeValue, setBlockPropertyTypeValue] =
    useState<string>("");
  const [isSelectAllUnitsInCategory, setIsSelectAllUnitsInCategory] =
    useState<boolean>(false);
  const [disableCheckbox, setDisableCheckbox] = useState<boolean>(true);
  const [disableBlockDatesButton, setDisableBlockDatesButton] =
    useState<boolean>(false);
  const [reasonToBlock, setReasonToBlock] = useState<string>("");
  const [selectedDateNames, setSelectedDateNames] =
    useState<string>("No dates selected");

  const [allowEntireProperty, setAllowEntireProperty] =
    useState<boolean>(false);
  const [allowIndividualUnit, setAllowIndividualUnit] =
    useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (propertyId) {
      // console.log(
      //   allowEntireProperty,
      //   "allowEntireProperty",
      //   allowIndividualUnit,
      //   "allowIndividualUnit"
      // );

      clearStatesWhenInitialTime();
      if (selectedDates && selectedDates.length > 0) {
        // console.log("Selected Dates:", selectedDates);
        checkSelectedCalenderDateAvailability();
        gettingCalenderDateAccommodationUnits();
        const formattedDates = formatSelectedDates(selectedDates);
        // console.log("Formatted Dates:", formattedDates);
        setSelectedDateNames(formattedDates);
      }
    }
  }, [selectedDates]);

  useEffect(() => {
    if (blockPropertyTypeValue === "Entire") {
      if (calendarEvents?.entirePropertyAvailable) {
        setDisableBlockDatesButton(false);
      } else {
        setDisableBlockDatesButton(true);
      }
    }
  }, [calendarEvents, blockPropertyTypeValue]);

  const clearStatesWhenInitialTime = () => {
    setBlockPropertyTypeValue("Separate");
    setCalendarEvents(undefined);
    setAccommodationUnitsList([]);
    setUnitList([]);
    setSelectedAccommodationUnit(undefined);
    setSelectedUnits([]);
    setDisableCheckbox(true);
    setIsSelectAllUnitsInCategory(false);
    setReasonToBlock("");
    form.setFieldsValue({
      selectedUnits: [],
      selectedAccommodationUnit: undefined,
      blockPropertyTypeValue: "Separate",
      disableCheckbox: true,
      isSelectAllUnitsInCategory: false,
      reasonToBlock: "",
    });
  };

  const checkSelectedCalenderDateAvailability = () => {
    if (selectedDates && selectedDates.length > 0) {
      const data = {
        propertyId: propertyId,
        dateRanges: selectedDates,
      };
      popUploader(dispatch, true);
      getCalendarDateAvailability(data)
        .then((response: any) => {
          const formattedData: Record<string, any[]> = {};
          setCalendarEvents(response?.data);
          setAllowEntireProperty(response?.data?.allowEntireProperty);
          setAllowIndividualUnit(response?.data?.allowIndividualUnit);
          setBlockPropertyTypeValue(
            response?.data?.allowEntireProperty
              ? "Entire"
              : response?.data?.allowIndividualUnit
                ? "Separate"
                : ""
          );
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

  const gettingCalenderDateAccommodationUnits = () => {
    if (selectedDates && selectedDates.length > 0) {
      const data = {
        propertyId: propertyId,
        dateRanges: selectedDates,
      };
      popUploader(dispatch, true);
      getCalendarAccommodationUnits(data)
        .then((response: any) => {
          let temp: CalendarAccommodationUnitsListObj[] = [];
          response?.data.map((accUnit: CalendarDateAccommodationUnitsObj) => {
            temp.push({
              value: accUnit.id,
              label: accUnit.name,
              subUnits: accUnit.subUnits,
            });
          });
          setAccommodationUnitsList(temp);
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        });
    } else {
      setAccommodationUnitsList([]);
    }
  };

  const handleBlockDatesValidation = () => {
    let isValidate = false;

    if (blockPropertyTypeValue === "Entire") {
      if (!reasonToBlock.trim()) {
        customToastMsg("Please enter the reason to block the dates", 2);
        isValidate = false;
        return;
      } else {
        isValidate = true;
      }
    } else if (blockPropertyTypeValue === "Separate") {
      if (!selectedAccommodationUnit) {
        customToastMsg("Please select unit category", 2);
        isValidate = false;
        return;
      }
      if (selectedUnits.length === 0) {
        customToastMsg("Please select units", 2);
        isValidate = false;
        return;
      }
      if (!reasonToBlock.trim()) {
        customToastMsg("Please enter the reason to block the dates", 2);
        isValidate = false;
        return;
      }
      isValidate = true;
    }

    if (isValidate) {
      blockSelectedDates();
    }
  };

  const blockSelectedDates = () => {
    popUploader(dispatch, true);

    let dataObj = {};
    if (blockPropertyTypeValue === "Entire") {
      dataObj = {
        subUnitIds: [],
        isEntireProperty: true,
        propertyId: propertyId,
        type: "BLOCKED",
        reason: reasonToBlock,
        dateRanges: selectedDates,
      };
    } else if (blockPropertyTypeValue === "Separate") {
      dataObj = {
        subUnitIds: selectedUnits,
        isEntireProperty: false,
        propertyId: propertyId,
        type: "BLOCKED",
        reason: reasonToBlock,
        dateRanges: selectedDates,
      };
    }

    blockCalenderDates(dataObj)
      .then(() => {
        popUploader(dispatch, false);
        customToastMsg("Selected dates blocked successfully", 1);
        clearStatesWhenInitialTime();
        loadCalenderDated();
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const handleAccommodationUnitChange = (value: number | undefined) => {
    setSelectedAccommodationUnit(value);

    if (value !== undefined) {
      const selectedUnit = accommodationUnitsList.find(
        (unit) => unit.value === value
      );
      if (selectedUnit) {
        const subUnitOptions = selectedUnit.subUnits.map((subUnit) => ({
          value: subUnit.id,
          label: subUnit.name,
          disabled: !subUnit.available,
        }));

        setUnitList(subUnitOptions);

        //  select available sub units
        const preselectedUnits = subUnitOptions
          .filter((subUnit) => !subUnit.disabled)
          .map((subUnit) => subUnit.value);
        // console.log(preselectedUnits);
        setSelectedUnits(preselectedUnits);
        form.setFieldsValue({ selectedUnits: preselectedUnits });
        setDisableCheckbox(false);
        setIsSelectAllUnitsInCategory(true);
      }
    } else {
      setUnitList([]);
      setSelectedUnits([]);
      form.setFieldsValue({ selectedUnits: [] });
    }
  };

  const handleChangeMultipleUnitsSelection = (value: number[]) => {
    setSelectedUnits(value);
    form.setFieldsValue({ selectedUnits: value });

    const availableUnits = unitList
      .filter((unit) => !unit.disabled)
      .map((unit) => unit.value);

    const allAvailableSelected =
      availableUnits.length > 0 &&
      availableUnits.every((unit) => value.includes(unit));

    setIsSelectAllUnitsInCategory(allAvailableSelected);
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="d-flex align-items-center">
          <AlertCircle className="me-2 primary-color" />
          <h5 className="font-size-5 font-weight-normal m-0 primary-color">
            {blockPropertyTypeValue === "Separate"
              ? "Your can't block these rooms"
              : calendarEvents?.availability?.title}
          </h5>
        </div>
      ),
      children: (
        <div className="font-size-5 font-weight-normal m-0 primary-color">
          <p>{calendarEvents?.availability?.description}</p>
          <p>{calendarEvents?.message}</p>
          <ul>
            {calendarEvents?.availability?.unitDetails.map((unit) => {
              return <li>{unit}</li>;
            })}
          </ul>
        </div>
      ),
    },
  ];

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

  return (
    <div className="BlockDatesTabContainer  h-100 w-100">
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
                <div className="w-100">
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

                    <Radio.Group
                      onChange={(e) => {
                        setBlockPropertyTypeValue(e.target.value);
                      }}
                      className="d-flex flex-column m-0"
                      value={blockPropertyTypeValue}
                    >
                      <Row className="w-100">
                        {allowIndividualUnit && (
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            {" "}
                            <Radio value="Separate" className="my-4">
                              {" "}
                              <span className="font-size-5 font-weight-normal">
                                Block Specific Rooms
                              </span>
                            </Radio>
                          </Col>
                        )}
                        {allowEntireProperty && (
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            {" "}
                            <Radio value="Entire" className="my-4">
                              <span className="font-size-5 font-weight-normal">
                                Block Entire Property
                              </span>
                            </Radio>
                          </Col>
                        )}
                      </Row>
                    </Radio.Group>
                    {blockPropertyTypeValue === "Separate" && (
                      <div>
                        <Form.Item
                          name="selectedAccommodationUnit"
                          label={`Select room category`}
                          className="w-100"
                        >
                          <Select
                            style={{
                              height: 40,
                              width: "100%",
                              borderRadius: 4,
                            }}
                            value={selectedAccommodationUnit}
                            showSearch
                            // allowClear
                            placeholder="Select category"
                            optionFilterProp="label"
                            onChange={(value) => {
                              handleAccommodationUnitChange(value);
                            }}
                            options={accommodationUnitsList}
                          />
                        </Form.Item>

                        <div className="d-flex mt-3">
                          <AlertCircle className="me-2 text-gray" />
                          <h5 className="font-size-5 font-weight-normal text-gray">
                            If you want you can Block this entire category
                            without choosing any specific rooms{" "}
                          </h5>
                        </div>
                        <Checkbox
                          disabled={disableCheckbox}
                          checked={isSelectAllUnitsInCategory}
                          className="my-2"
                          onClick={(e) => {
                            setIsSelectAllUnitsInCategory(e?.target?.checked);
                            if (e?.target?.checked) {
                              const preselectedUnits = unitList
                                .filter((subUnit) => !subUnit.disabled)
                                .map((subUnit) => subUnit.value);
                              // console.log(preselectedUnits);
                              setSelectedUnits(preselectedUnits);
                              form.setFieldsValue({
                                selectedUnits: preselectedUnits,
                              });
                            } else {
                              setSelectedUnits([]);
                              form.setFieldsValue({ selectedUnits: [] });
                            }
                          }}
                        >
                          <h5 className="font-size-4 font-weight-normal m-0 p-0">
                            Select all rooms in this category
                          </h5>
                        </Checkbox>
                        <Form.Item
                          name="selectedUnits"
                          label={`Select rooms`}
                          className="w-100 mt-2"
                        >
                          <Select
                            style={{
                              height: selectedUnits.length > 0 ? "auto" : 40,
                              width: "100%",
                              borderRadius: 4,
                            }}
                            value={selectedUnits}
                            showSearch
                            // allowClear
                            mode="multiple"
                            placeholder="Select rooms"
                            optionFilterProp="label"
                            onChange={handleChangeMultipleUnitsSelection}
                            options={unitList}
                          />
                        </Form.Item>
                      </div>
                    )}
                    {!calendarEvents?.entirePropertyAvailable && (
                      <Collapse
                        style={{ backgroundColor: "#FFF5F5" }}
                        items={items}
                        // defaultActiveKey={["1"]}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className="my-3"
                      />
                    )}
                    {blockPropertyTypeValue === "Entire" &&
                      calendarEvents?.entirePropertyAvailable && (
                        <Form.Item
                          name="reasonToBlock"
                          label="Reason"
                          className="w-100 mt-2"
                        >
                          <TextArea
                            showCount
                            value={reasonToBlock}
                            maxLength={100}
                            onChange={(e) => {
                              setReasonToBlock(e.target.value);
                            }}
                            placeholder="Reason to block"
                            style={{ height: 120, resize: "none" }}
                          />
                        </Form.Item>
                      )}
                    {blockPropertyTypeValue === "Separate" && (
                      <Form.Item
                        name="reasonToBlock"
                        label="Reason"
                        className="w-100 mt-2"
                      >
                        <TextArea
                          showCount
                          value={reasonToBlock}
                          maxLength={100}
                          onChange={(e) => {
                            setReasonToBlock(e.target.value);
                          }}
                          placeholder="Reason to block"
                          style={{ height: 120, resize: "none" }}
                        />
                      </Form.Item>
                    )}

                    {blockPropertyTypeValue === "Entire" &&
                      calendarEvents?.entirePropertyAvailable && (
                        <Button
                          disabled={
                            blockPropertyTypeValue === "Entire"
                              ? disableBlockDatesButton
                              : false
                          }
                          size="large"
                          type="primary"
                          className="py-4 mt-4  w-100"
                          onClick={handleBlockDatesValidation}
                        >
                          Block Dates
                        </Button>
                      )}
                    {blockPropertyTypeValue === "Separate" && (
                      <Button
                        size="large"
                        type="primary"
                        className="py-4 mt-4  w-100"
                        onClick={handleBlockDatesValidation}
                      >
                        Block Dates
                      </Button>
                    )}
                  </Form>
                </div>
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
                      Please select your desired dates and check availability
                      before proceeding to block them.
                    </h5>
                  </div>
                </div>
              )}
            </div>
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

export default BlockDatesTab;
