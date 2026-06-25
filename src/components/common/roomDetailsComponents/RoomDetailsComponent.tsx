import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import roomStepIcon from "../../../assets/images/steps/roomStep.png";
import {
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../../common/commonFunctions.tsx";
import { UnitEnum } from "../../../common/uiConstants.ts";
import {
  BedTypeDataObject,
  DropdownObjTwo,
  SelectedBedTypeDataObject,
  UnitDetailsDataObject,
} from "../../../common/interfaces/uiNecessaryInterface.ts";
import * as constants from "../../../common/constants.ts";
import {
  getAllBedRoomType,
  getAllBedTypes,
} from "../../../service/propertyDetailsService.ts";
// @ts-ignore
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import { getPropertyById } from "../../../service/propertyListingService.ts";
import { useDispatch, useSelector } from "react-redux";
import { Cookies } from "typescript-cookie";
import { RootState } from "../../../slices/rootReducer.ts";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum.ts";
import { Plus, Trash2 } from "react-feather";

interface RoomDetailsComponentProp {
  roomCountDetails: number;
  guestCountOfRoomDetails: number;
  datesForBookingDetails: number;
  roomSizeDetails: number;
  unitIdDetails: number | null;
  selectedRoomTypeDetails: number | null;
  isHaveMultipleRoomsForRoomCategoryDetails: boolean;
  selectedBedTypeDetailsData: SelectedBedTypeDataObject[];
  roomNameDetails: string;
  roomNumbersDetails: string[];
  onUnitDetailsChange: (data: UnitDetailsDataObject) => void;
}

const RoomDetailsComponent: React.FC<RoomDetailsComponentProp> = ({
  roomCountDetails,
  guestCountOfRoomDetails,
  datesForBookingDetails,
  roomSizeDetails,
  unitIdDetails,
  selectedRoomTypeDetails,
  isHaveMultipleRoomsForRoomCategoryDetails,
  selectedBedTypeDetailsData,
  roomNameDetails,
  roomNumbersDetails,
  onUnitDetailsChange,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const checkboxShowValue = useSelector(
    (state: RootState) => state?.property?.isPropertyTypeRoomOrHomeStay
  );
  const [bedDetails, setBedDetails] = useState<DropdownObjTwo[]>([]);
  const [selectedBedTypeDetails, setSelectedBedTypeDetails] = useState<
    SelectedBedTypeDataObject[]
  >([{ bedTypeId: 0, count: 1 }]);

  const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
  const [roomTypeList, setRoomTypeList] = useState<any[]>([]);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [guestCountOfRoom, setGuestCountOfRoom] = useState<number>(0);
  const [datesForBooking, setDatesForBooking] = useState<number>(0);
  const [roomSize, setRoomSize] = useState<number>(0);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [isApartment, setIsApartment] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [
    isHaveMultipleRoomsForRoomCategory,
    setIsHaveMultipleRoomsForRoomCategory,
  ] = useState<boolean>(false);

  const [isShowCheckBox, setIsShowCheckBox] = useState<boolean>(true);

  //-----------------unit name part states --------------------------------

  const [roomName, setRoomName] = useState<string>("");
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);

  // useEffect(() => {
  //   console.log(selectedBedTypeDetails);
  // }, [selectedBedTypeDetails]);

  useEffect(() => {
    getAllBedroom();
    setRoomNumbers(Array(1).fill(""));
    getAllBedTypesForRooms();
  }, []);

  useEffect(() => {
    setRoomCount(roomCountDetails);
    setGuestCountOfRoom(guestCountOfRoomDetails);
    setDatesForBooking(datesForBookingDetails);
    setRoomSize(roomSizeDetails);
    setUnitId(unitIdDetails);
    setSelectedRoomType(selectedRoomTypeDetails);
    setIsHaveMultipleRoomsForRoomCategory(
      isHaveMultipleRoomsForRoomCategoryDetails
    );
    setSelectedBedTypeDetails(selectedBedTypeDetailsData);
    setRoomName(roomNameDetails);
    setRoomNumbers(roomNumbersDetails);

    form.setFieldsValue({
      selectedRoomType: selectedRoomTypeDetails,
      guestCountOfRoom: guestCountOfRoomDetails,
      roomName: roomNameDetails,
    });

    const fieldsToSet = roomNumbersDetails.map(
      (name: string, index: number) => ({
        name: `roomNumber${index}`,
        value: name,
      })
    );
    form.setFields(fieldsToSet);
  }, [
    roomCountDetails,
    guestCountOfRoomDetails,
    datesForBookingDetails,
    roomSizeDetails,
    unitIdDetails,
    selectedRoomTypeDetails,
    isHaveMultipleRoomsForRoomCategoryDetails,
    selectedBedTypeDetailsData,
    roomNameDetails,
    roomNumbersDetails,
  ]);

  const getAllBedTypesForRooms = () => {
    getAllBedTypes().then((res) => {
      const bedTypesWithCount = res.data.map(
        (bedType: { id: number; name: string }) => ({
          value: bedType.id,
          label: (
            <div className="d-flex align-items-center">
              <img src={roomStepIcon} alt="icon" height="auto" width={25} />{" "}
              <h5 className="font-size-4 font-weight-normal my-0 ms-2">
                {bedType.name} Bed(s)
              </h5>
            </div>
          ),
          count: 0,
        })
      );
      setBedDetails(bedTypesWithCount);
    });
  };

  const getAllBedroom = () => {
    getAllBedRoomType().then((res) => {
      let data: any[] = [];
      res.data.map((roomy: any) => {
        data.push({
          value: roomy.id,
          label: roomy.name,
        });
      });
      setRoomTypeList(data);
    });
  };

  useEffect(() => {
    setIsShowCheckBox(checkboxShowValue ? checkboxShowValue : false);
    // console.log(checkboxShowValue, "checkboxShowValue");
  }, [checkboxShowValue]);

  useEffect(() => {
    sendUnitDetailsToParentComponent();
  }, [
    selectedRoomType,
    roomCount,
    selectedBedTypeDetails,
    guestCountOfRoom,
    datesForBooking,
    roomSize,
    roomName,
    roomNumbers,
  ]);

  useEffect(() => {
    setRoomNumbers((prevRoomNumbers) => {
      const newRoomNumbers = Array.from(
        { length: roomCount },
        (_, index) => prevRoomNumbers[index] || `Room ${String(index + 1)}`
      );

      const fieldsToSet = newRoomNumbers.map((name, index) => ({
        name: `roomNumber${index}`,
        value: name,
      }));
      form.setFields(fieldsToSet);

      return newRoomNumbers;
    });
  }, [roomCount]);

  useEffect(() => {
    dispatch({
      type: "IS_UNIT_DETAILS_SET",
      value: { guestCount: guestCountOfRoom },
    });
  }, [guestCountOfRoom]);

  const sendUnitDetailsToParentComponent = () => {
    let data = {
      unitCategoryId: selectedRoomType,
      count: roomCount,
      unitId: unitId,
      maxHeadCount: guestCountOfRoom,
      minBookingDays: datesForBooking,
      size: roomSize,
      beds: selectedBedTypeDetails,
      unitProfile: {
        name: roomName,
        subUnitsNames: roomNumbers,
      },
    };
    onUnitDetailsChange(data);
  };

  const clearStates = () => {
    setSelectedRoomType(null);
    setIsApartment(false);
    setRoomCount(0);
    setGuestCountOfRoom(0);
    setDatesForBooking(0);
    setRoomSize(0);
    setUnitId(null);
    setRoomName("");
    setRoomNumbers(Array(1).fill(""));
  };

  const findUnitById = (unitsArray: any, targetUnitId: number) => {
    return unitsArray.find((unit: any) => unit.unitId === targetUnitId);
  };

  const handleRoomNumberChange = (index: number, value: string) => {
    const updatedRoomNumbers = [...roomNumbers];
    updatedRoomNumbers[index] = value;
    setRoomNumbers(updatedRoomNumbers);
  };

  const addBedSelection = () => {
    if (selectedBedTypeDetails.length < bedDetails.length) {
      setSelectedBedTypeDetails([
        ...selectedBedTypeDetails,
        { bedTypeId: 0, count: 1 },
      ]);
    }
  };

  const removeBedSelection = (index: number) => {
    setSelectedBedTypeDetails(
      selectedBedTypeDetails.filter((_, i) => i !== index)
    );
  };

  const updateBedType = (index: number, value: number) => {
    const updatedSelection = [...selectedBedTypeDetails];
    updatedSelection[index].bedTypeId = value;
    setSelectedBedTypeDetails(updatedSelection);
  };

  const updateBedCount = (index: number, count: number) => {
    const updatedSelection = [...selectedBedTypeDetails];
    updatedSelection[index].count = count;
    setSelectedBedTypeDetails(updatedSelection);
  };

  return (
    <div className="RoomDetailsComponentContainer w-100">
      <Form form={form} layout="vertical" className="w-100" onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
        <div
          className="py-2 px-4 rounded-4 border border-white my-3  w-100 d-flex flex-column align-items-center align-items-lg-start"
          style={{ backgroundColor: "#fdfdfd6e" }}
        >
          <div className="w-100">
            {!isApartment && (
              <div>
                {" "}
                <h5 className="font-size-4 font-weight-normal mt-3 text-start">
                  Name for your {UnitEnum.ROOM_SIMPLE}s
                </h5>
                <Form.Item name="roomName" className="w-100">
                  <Input
                    size="large"
                    id="roomName"
                    name="roomName"
                    value={roomName}
                    placeholder="Name for your property"
                    className="rounded-3 p-2 bg-transparent "
                    style={{ height: 50 }}
                    type="text"
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </Form.Item>
              </div>
            )}

            {!isApartment ? (
              <h5 className="font-size-4 font-weight-normal mt-3 text-start">
                Select the type of this bedroom?{" "}
              </h5>
            ) : (
              <h5 className="font-size-4 font-weight-normal mt-3 text-start">
                Select the type of bedroom?{" "}
              </h5>
            )}

            <Form.Item name="selectedRoomType" className="w-100">
              <Select
                className="text-start w-100 "
                showSearch
                allowClear
                placeholder="Select bedroom type"
                optionFilterProp="label"
                onChange={(e: number | null) => {
                  // console.log(e);
                  setSelectedRoomType(Number(e) || null);
                }}
                size="large"
                defaultValue={roomTypeList.find(
                  (rm) => rm.value === selectedRoomType
                )}
                style={{ height: 50 }}
                options={roomTypeList}
              />
            </Form.Item>
          </div>

          {isShowCheckBox && (
            <Checkbox
              onChange={(e) => {
                setIsHaveMultipleRoomsForRoomCategory(e.target.checked);
                !e.target.checked && setRoomCount(Number(1));
              }}
              checked={isHaveMultipleRoomsForRoomCategory}
              className="mb-3 mt-3 font-size-4 font-weight-normal text-start"
            >
              Have multiple rooms in this category?
            </Checkbox>
          )}
          {isShowCheckBox && isHaveMultipleRoomsForRoomCategory && (
            <div className="w-100 d-flex flex-column align-items-center align-items-lg-start">
              {!isApartment ? (
                <h5 className="font-size-4 font-weight-normal mt-3">
                  How many {UnitEnum.ROOM_SIMPLE + "s "}
                  of this category do you have?
                </h5>
              ) : (
                <h5 className="font-size-4 font-weight-normal mt-3">
                  How many {UnitEnum.ROOM_SIMPLE + "s "}
                  of this category do you have in your apartment?
                </h5>
              )}
              <Form.Item name="roomCount" style={{ width: "134px" }}>
                <div className="d-flex align-items-center border border-secondary rounded-3">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setRoomCount((prev) => Math.max(1, prev - 1));
                    }}
                  >
                    -
                  </button>
                  <InputNumber
                    min={1}
                    max={500}
                    type="number"
                    size="large"
                    value={roomCount}
                    defaultValue={0}
                    className="bg-transparent"
                    bordered={false}
                    onChange={(e) => {
                      setRoomCount(Number(e));
                    }}
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setRoomCount((prev) => Math.min(500, prev + 1));
                    }}
                  >
                    +
                  </button>
                </div>
              </Form.Item>

              {!isApartment && (
                <div className="w-100">
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    className="font-weight-normal font-size-5 text-gray mb-1"
                  >
                    Individual room numbers / Names
                  </Divider>
                  <h6
                    className="text-gray fw-normal mb-3"
                    style={{ fontSize: 14 }}
                  >
                    (These names are for internal use only and will not be
                    visible to customers)
                  </h6>
                  <Row>
                    {roomNumbers.map((roomNumber, index) => (
                      <Col
                        key={index}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        className="px-0 px-lg-2"
                      >
                        <Form.Item
                          name={`roomNumber${index}`}
                          label={`Individual room number / Name ${index + 1}`}
                        >
                          <Input
                            size="large"
                            placeholder={`Room ${index + 1}`}
                            value={roomNumber}
                            className="rounded-4 px-3 py-2 bg-transparent border border-secondary"
                            onChange={(e) =>
                              handleRoomNumberChange(index, e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
          style={{ backgroundColor: "#fdfdfd6e" }}
        >
          <h5 className="font-size-4 font-weight-normal mt-3">
            What beds are available in this{" "}
            {isApartment
              ? UnitEnum.APARTMENT_SIMPLE + "s"
              : UnitEnum.ROOM_SIMPLE + "s"}
            ?
          </h5>
          <div className="w-100 d-flex flex-column">
            {selectedBedTypeDetails.map((bed, index) => (
              <Row
                key={index}
                className="my-2 d-flex justify-content-center w-100"
              >
                <Col
                  xs={24}
                  sm={13}
                  md={14}
                  lg={12}
                  xl={15}
                  xxl={17}
                  className="d-flex flex-column justify-content-center "
                >
                  <Select
                    className="basic-single me-0 me-sm-4 my-2 my-sm-0"
                    size="large"
                    placeholder="Select Bed Type"
                    showSearch
                    value={bed?.bedTypeId || null}
                    options={bedDetails.filter(
                      (option) =>
                        !selectedBedTypeDetails.some(
                          (selected) => selected.bedTypeId === option.value
                        ) || bed.bedTypeId === option.value
                    )}
                    onChange={(value) => updateBedType(index, value)}
                  />
                </Col>
                <Col
                  xs={24}
                  sm={7}
                  md={6}
                  lg={8}
                  xl={6}
                  xxl={5}
                  className="d-flex align-items-center justify-content-center"
                >
                  <div className="d-flex align-items-center border border-secondary rounded-3 my-2 my-sm-0">
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        updateBedCount(index, Math.max(1, bed.count - 1))
                      }
                    >
                      -
                    </button>
                    <InputNumber
                      min={1}
                      max={500}
                      bordered={false}
                      size="large"
                      disabled={true}
                      value={bed.count}
                      className="bg-transparent w-100"
                      onChange={(e) => {
                        updateBedCount(bed.bedTypeId, Number(e));
                      }}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        updateBedCount(index, Math.min(500, bed.count + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={3}
                  xxl={2}
                  className="ps-2 d-flex align-items-center"
                >
                  <Button
                    disabled={selectedBedTypeDetails.length < 2}
                    type="default"
                    onClick={() => removeBedSelection(index)}
                    className="w-100 my-2 my-sm-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              type="text"
              className="align-self-center align-self-sm-end "
              onClick={() => {
                addBedSelection();
              }}
              disabled={selectedBedTypeDetails.length >= bedDetails.length}
            >
              <u>
                <Plus size={15} /> Add Another Bed
              </u>
            </Button>
          </div>
        </div>
        <div
          className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
          style={{ backgroundColor: "#fdfdfd6e" }}
        >
          <h5 className="font-size-4 font-weight-normal mt-3">
            How many guests can stay in this{" "}
            {isApartment
              ? UnitEnum.APARTMENT_SIMPLE + "s"
              : UnitEnum.ROOM_SIMPLE + "s"}
            ?
          </h5>
          <Form.Item name="guestCountOfRoom" initialValue={0}>
            <div className="d-flex align-items-center border border-secondary rounded-3">
              {/* Decrease Button */}
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const currentValue = form.getFieldValue("guestCountOfRoom");
                  const newValue = Math.max(1, currentValue - 1);
                  form.setFieldsValue({ guestCountOfRoom: newValue });
                  // console.log("Decreased Value:", newValue);
                  setGuestCountOfRoom(newValue);
                }}
              >
                -
              </button>

              {/* Input Number */}
              <InputNumber
                style={{ width: "60px" }}
                min={1}
                max={500}
                type="number"
                size="large"
                className="bg-transparent"
                bordered={false}
                value={form.getFieldValue("guestCountOfRoom")}
                onChange={(value) => {
                  form.setFieldsValue({ guestCountOfRoom: value || 0 });
                  // console.log("Changed Value:", value);
                  setGuestCountOfRoom(value);
                }}
              />

              {/* Increase Button */}
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const currentValue = form.getFieldValue("guestCountOfRoom");
                  const newValue = Math.min(500, currentValue + 1);
                  form.setFieldsValue({ guestCountOfRoom: newValue });
                  // console.log("Increased Value:", newValue);
                  setGuestCountOfRoom(newValue);
                }}
              >
                +
              </button>
            </div>
          </Form.Item>
          <h5 className="font-size-4 font-weight-normal mt-3">
            Minimum dates for booking?
          </h5>
          <Form.Item name="datesForBooking">
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
                style={{ width: "60px" }}
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
            How big is this{" "}
            {isApartment
              ? UnitEnum.APARTMENT_SIMPLE + "s"
              : UnitEnum.ROOM_SIMPLE + "s"}
            ?(Square Feets)
          </h5>
          <Form.Item name="roomSize">
            <div className="d-flex align-items-center border border-secondary rounded-3">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setRoomSize((prev) => Math.max(1, prev - 1));
                }}
              >
                -
              </button>
              <InputNumber
                // addonAfter={selectAfter}
                style={{ width: "60px" }}
                min={1}
                type="number"
                size="large"
                value={roomSize}
                defaultValue={0}
                className="bg-transparent"
                bordered={false}
                onChange={(e) => {
                  setRoomSize(Number(e));
                }}
              />

              <button
                type="button"
                className="btn"
                onClick={() => {
                  setRoomSize((prev) => prev + 1);
                }}
              >
                +
              </button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default RoomDetailsComponent;
