import {
  Button,
  Col,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import roomStepIcon from "../../../assets/images/steps/roomStep.png";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import {
  DropdownObjTwo,
  RoomDetailsDataObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
import {
  getAllBedTypes,
} from "../../../service/propertyDetailsService.ts";
// @ts-ignore
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import {
  addNewProperty,
  getPropertyById,
  updatePropertyCreateLastMainStep,
} from "../../../service/propertyListingService.ts";
import { useDispatch } from "react-redux";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum.ts";
import { Cookies } from "typescript-cookie";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum.ts";
import { Plus, Trash2 } from "react-feather";

const StepSimplifyRoomDetails = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [roomCount, setRoomCount] = useState<number>(1);
  const [roomDetailsArray, setRoomDetailsArray] = useState<
    RoomDetailsDataObject[]
  >(
    Array.from({ length: roomCount }, () => ({
      bedDetails: [{ bedTypeId: 0, count: 1 }],
      bathroomType: "",
      unitId: null,
      editable: true,
      isMasterBedRoom: false,
    }))
  );
  const [bedDetails, setBedDetails] = useState<DropdownObjTwo[]>([]);

  const [sharedFullBathroomCount, setSharedFullBathroomCount] =
    useState<number>(0);
  const [sharedHalfBathroomCount, setSharedHalfBathroomCount] =
    useState<number>(0);
  const [unitCount, setUnitCount] = useState<number>(1);
  const [form] = Form.useForm();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  useEffect(() => {
    // console.log(roomDetailsArray);
    const hasSharedBathroom = roomDetailsArray.some(
      (room) => room.bathroomType === "Shared"
    );

    if (hasSharedBathroom && sharedFullBathroomCount === 0) {
      const currentValue = form.getFieldValue("sharedFullBathroomCount");
      const newValue = Math.min(500, currentValue + 1);
      form.setFieldsValue({
        sharedFullBathroomCount: newValue,
      });
      // console.log("Increased Value:", newValue);
      setSharedFullBathroomCount(newValue);
    }

    // console.log(hasSharedBathroom);
  }, [roomDetailsArray]);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    getAllBedTypesForRooms();
    loadPropertyDetailsPropertyId();
  }, []);

  useEffect(() => {
    const updatedArray = Array.from({ length: roomCount }, (_, index) => {
      const existingRoom = roomDetailsArray[index];
      return {
        bedDetails: existingRoom?.bedDetails || [{ bedTypeId: 0, count: 1 }],
        bathroomType: existingRoom?.bathroomType || "",
        unitId: existingRoom?.unitId ?? null,
        editable: existingRoom?.editable ?? true,
        isMasterBedRoom: index === 0, // Only the first room is the master bedroom
      };
    });

    setRoomDetailsArray(updatedArray);
  }, [roomCount]);

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

  const loadPropertyDetailsPropertyId = async () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    setPropertyId(propertyId ? propertyId : 0);
    if (propertyId) {
      popUploader(dispatch, true);
      await getPropertyById(propertyId)
        .then(async (resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;

          if (dataObj.unitDetails && dataObj.unitDetails?.length > 0) {
            setUnitCount(
              dataObj.unitDetails?.length > 0 ? dataObj.unitDetails?.length : 1
            );
            setRoomCount(dataObj.unitDetails?.length);

            let tempRoomDetails: RoomDetailsDataObject[] = [];

            dataObj.unitDetails.map((unit, index) => {
              const transformedBeds = unit?.beds && unit?.beds.map((bed: any) => ({
                bedTypeId: bed.bedType.id,
                count: bed.count,
              }));

              let bathroomType =
                unit?.unitBathrooms && unit?.unitBathrooms?.length > 0
                  ? unit?.unitBathrooms[0].bathroomType?.name
                  : "Shared";

              tempRoomDetails.push({
                bedDetails: transformedBeds,
                bathroomType: bathroomType,
                unitId: unit?.id ? unit?.id : null,
                editable: unit?.editable,
                isMasterBedRoom: unit?.isMasterBedRoom ? unit?.isMasterBedRoom : false,
              });
            });

            // console.log(tempRoomDetails, "tempRoomDetails");

            setRoomDetailsArray(tempRoomDetails);
          } else {
            setUnitCount(1);
            setRoomCount(1);
          }
          let sharedFullBathroomCount = 0;
          let sharedHalfBathroomCount = 0;
          if (dataObj.sharedBathrooms) {
            dataObj.sharedBathrooms.forEach((bathroom) => {
              if (bathroom.bathroomType?.name === "Shared Bathroom ( Full )") {
                sharedFullBathroomCount += bathroom.count;
              }
              if (bathroom.bathroomType?.name === "Shared Bathroom ( Half )") {
                sharedHalfBathroomCount += bathroom.count;
              }
            });
          }

          setSharedFullBathroomCount(sharedFullBathroomCount);
          setSharedHalfBathroomCount(sharedHalfBathroomCount);

          form.setFieldsValue({
            sharedFullBathroomCount: sharedFullBathroomCount,
            sharedHalfBathroomCount: sharedHalfBathroomCount,
          });
          popUploader(dispatch, false);
          await setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const validateCreatePropertyListingUnitDetails = () => {
    let isValidate = true;

    if (roomCount <= 0) {
      customToastMsg("Enter valid room count", 2);
      isValidate = false;
    }

    let hasSharedBathroom = false;

    for (const room of roomDetailsArray) {
      const hasInvalidBedType = room.bedDetails.some(
        (bed) => bed.bedTypeId === 0
      );
      const hasInvalidBedCount = room.bedDetails.some((bed) => bed.count === 0);
      const hasInvalidBathroomType = room.bathroomType === "";

      if (hasInvalidBedType) {
        customToastMsg("Enter valid bed type in all rooms", 2);
        isValidate = false;
      }
      if (hasInvalidBedCount) {
        customToastMsg("Enter valid bed count in all rooms", 2);
        isValidate = false;
      }
      if (hasInvalidBathroomType) {
        customToastMsg("Enter valid bathroom type in all rooms", 2);
        isValidate = false;
      }

      if (room.bathroomType.includes("Shared")) {
        hasSharedBathroom = true;
      }
    }

    if (
      hasSharedBathroom &&
      sharedFullBathroomCount <= 0 &&
      sharedHalfBathroomCount <= 0
    ) {
      customToastMsg("Enter valid shared bathroom count", 2);
      isValidate = false;
    }

    if (isValidate) {
      handleCreatePropertyListingUnitDetails();
    }
  };

  const handleCreatePropertyListingUnitDetails = () => {
    popUploader(dispatch, true);
    const entirePropertyUnitDetailsObject = roomDetailsArray.map(
      (room, index) => {
        return {
          unitId: room?.unitId,
          beds: room?.bedDetails,
          isMasterBedRoom: room?.isMasterBedRoom,
          attachedFullBathroomCount: room.bathroomType.includes(
            "Attached Bathroom ( Full )"
          )
            ? 1
            : null,
          attachedHalfBathroomCount: room.bathroomType.includes(
            "Attached Bathroom ( Half )"
          )
            ? 1
            : null,
        };
      }
    );

    const data = {
      unitDetails: {
        entirePropertyUnitDetails: {
          count: roomCount,
          entirePropertyUnitDetailsObject: entirePropertyUnitDetailsObject,
          sharedFullBathroomCount:
            sharedFullBathroomCount !== 0 ? sharedFullBathroomCount : null,
          sharedHalfBathroomCount:
            sharedHalfBathroomCount !== 0 ? sharedHalfBathroomCount : null,
        },
      },
    };

    setIsDisableBtns(true);
    addNewProperty(data, ListingStepsEnum.UNIT_DETAILS, propertyId)
      .then((res) => {
        clearStates();
        let currentValue = Cookies.get(constants.ROOM_ID);
        Cookies.set(
          constants.ROOM_ID,
          currentValue ? currentValue : res?.data?.lastCreatedUnitId
        );
        updateLastMainStep();
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      })
      .finally(() => {
        setIsDisableBtns(false);
      });
  };

  const updateLastMainStep = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    setIsDisableBtns(true);
    updatePropertyCreateLastMainStep(
      MainStepsCompleteTypeEnum.UNIT_DETAILS_COMPLETE,
      propertyId
    )
      .then((response) => {
        history(`/main/finish/${propertyId}`);

        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      }).finally(() => {
        setIsDisableBtns(false);
      });
  };

  const clearStates = () => {
    setRoomCount(1);
    setSharedFullBathroomCount(0);
    setSharedHalfBathroomCount(0);
    // setRoomDetailsArray([]);
    setIsDisableBtns(true);
  };

  const addBedSelection = (roomIndex: number) => {
    setRoomDetailsArray((prev) =>
      prev.map((room, index) =>
        index === roomIndex
          ? {
            ...room,
            bedDetails: [...room.bedDetails, { bedTypeId: 0, count: 1 }],
          }
          : room
      )
    );
  };

  const updateBedType = (
    roomIndex: number,
    bedIndex: number,
    value: number
  ) => {
    setRoomDetailsArray((prev) =>
      prev.map((room, rIndex) =>
        rIndex === roomIndex
          ? {
            ...room,
            bedDetails: room.bedDetails.map((bed, bIndex) =>
              bIndex === bedIndex ? { ...bed, bedTypeId: value } : bed
            ),
          }
          : room
      )
    );
  };

  const updateBedCount = (
    roomIndex: number,
    bedIndex: number,
    count: number
  ) => {
    setRoomDetailsArray((prev) =>
      prev.map((room, rIndex) =>
        rIndex === roomIndex
          ? {
            ...room,
            bedDetails: room.bedDetails.map((bed, bIndex) =>
              bIndex === bedIndex ? { ...bed, count } : bed
            ),
          }
          : room
      )
    );
  };

  const removeBedSelection = (roomIndex: number, bedIndex: number) => {
    setRoomDetailsArray((prev) =>
      prev.map((room, rIndex) =>
        rIndex === roomIndex
          ? {
            ...room,
            bedDetails: room.bedDetails.filter(
              (_, bIndex) => bIndex !== bedIndex
            ),
          }
          : room
      )
    );
  };

  const deleteUnitDetails = (id: number) => {
    if (roomDetailsArray.length === 1) {
      setRoomDetailsArray([
        {
          bedDetails: [{ bedTypeId: 0, count: 1 }],
          bathroomType: "",
          unitId: null,
          editable: true,
          isMasterBedRoom: false,
        },
      ]);
      setRoomCount(1);
    } else {
      setRoomDetailsArray((prevRooms) =>
        prevRooms.filter((room) => room.unitId !== id)
      );
      setRoomCount((prevRooms) => Math.max(prevRooms - 1, 1));
    }
  };

  return (
    <PropertyListing>
      <div className="StepSimplifyRoomDetailsContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-lg-5">
              <h2 className="font-weight-medium font-size-3 primary-color">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  Rooms
                </span>{" "}
                {">"} Add Details
              </h2>
              <h1 className="font-weight-medium font-size-1">
                Bedrooms & bathrooms details
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Detail your bedrooms & bathrooms here
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className="pe-0 pe-lg-3 align-self-end mb-2"
            style={{ height: "88%", overflowY: "auto" }}
          >
            <Form form={form} layout="vertical" className="mt-4 w-100">

              <h5 className="font-size-4 font-weight-medium ">
                Bedrooms Details
              </h5>

              <div
                className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-4 font-weight-normal mt-3">
                  How many bedrooms do you have?
                </h5>
                <Form.Item name="roomCount">
                  <div className="d-flex align-items-center border border-secondary rounded-3 mb-3">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setRoomCount((prev) => Math.max(unitCount, prev - 1));
                      }}
                    >
                      -
                    </button>
                    <InputNumber
                      style={{ width: "60px" }}
                      min={unitCount}
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
              </div>

              {roomDetailsArray.length > 0 &&
                roomDetailsArray.map((room, roomIndex) => (
                  <div
                    className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
                    style={{
                      backgroundColor: "#fdfdfd6e",
                      pointerEvents: room.editable ? "auto" : "none",
                      opacity: room.editable ? 1 : 0.5,
                    }}
                  >
                    <Row className="w-100 d-flex  flex-row  flex-md-row-reverse  justify-content-center align-items-center">
                      {room?.unitId != null && (
                        <Col sm={7} md={6} lg={8} xl={6} xxl={4}>
                          <Popconfirm
                            title="Delete this unit"
                            description="Are you sure to delete this room details?"
                            onConfirm={() => {
                              deleteUnitDetails(room?.unitId);
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              disabled={isDisableBtns}
                              size="middle"
                              type="primary"
                              className="rounded-3 w-100"
                            >
                              Remove Room
                            </Button>
                          </Popconfirm>
                        </Col>
                      )}
                      <Col
                        sm={24}
                        md={18}
                        lg={room?.unitId != null ? 16 : 24}
                        xl={room?.unitId != null ? 18 : 24}
                        xxl={room?.unitId != null ? 20 : 24}
                      >
                        <div className="d-flex align-items-center">
                          {/* {room?.bathroomType != "" &&
                            room.bedDetails.some((bed) => bed.count != 0) && (
                              <CheckCircle
                                color="green"
                                className="me-2"
                                style={{ strokeWidth: 3 }}
                              />
                            )} */}
                          <h5 className="font-size-4 font-weight-normal mt-3">
                            What beds are available in{" "}
                            <span className="font-weight-semi-bold">
                              {room?.isMasterBedRoom ? "Master Bedroom" : `Bedroom ${roomIndex + 1}`}
                            </span>{" "}
                            ?
                          </h5>
                        </div>
                      </Col>
                    </Row>

                    <div className="w-100 d-flex flex-column">
                      {room?.bedDetails.map((bed, index) => (
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
                                  !room?.bedDetails.some(
                                    (selected) =>
                                      selected.bedTypeId === option.value
                                  ) || bed.bedTypeId === option.value
                              )}
                              onChange={(value) =>
                                updateBedType(roomIndex, index, value)
                              }
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
                                  updateBedCount(
                                    roomIndex,
                                    index,
                                    Math.max(1, bed.count - 1)
                                  )
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
                                  updateBedCount(roomIndex, bed.id, Number(e));
                                }}
                              />
                              <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                  updateBedCount(
                                    roomIndex,
                                    index,
                                    Math.min(500, bed.count + 1)
                                  )
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
                              disabled={room?.bedDetails.length < 2}
                              type="default"
                              onClick={() =>
                                removeBedSelection(roomIndex, index)
                              }
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
                          addBedSelection(roomIndex);
                        }}
                        disabled={room?.bedDetails.length >= bedDetails.length}
                      >
                        <u>
                          <Plus size={15} /> Add Another Bed Type
                        </u>
                      </Button>
                    </div>

                    <h5 className="font-size-4 font-weight-normal">
                      Select Available Bathroom Type
                    </h5>
                    <Radio.Group
                      onChange={(e) => {
                        setRoomDetailsArray((prev) =>
                          prev.map((room, index) =>
                            index === roomIndex
                              ? { ...room, bathroomType: e.target.value }
                              : room
                          )
                        );
                      }}
                      className="my-3"
                      value={room?.bathroomType}
                    >
                      <Radio value={"Shared"} className=" me-0 me-sm-4">
                        <span className="font-size-4 font-weight-medium">
                          Shared
                        </span>
                      </Radio>
                      <Radio
                        value={"Attached Bathroom ( Full )"}
                        className=" me-0 me-sm-4"
                      >
                        <span className="font-size-4 font-weight-medium">
                          Attached
                        </span>
                      </Radio>
                      {/* <Radio
                        value={"Attached Bathroom ( Half )"}
                        className=" me-0 me-sm-4"
                      >
                        {" "}
                        <span className="font-size-4 font-weight-medium">
                          Attached ( Half )
                        </span>
                      </Radio> */}
                    </Radio.Group>
                  </div>
                ))}

              <h5 className="font-size-4 font-weight-medium m-0 mt-5 ">
                Bathrooms Summary
              </h5>

              <div
                className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-4 font-weight-normal my-3">
                  Attached Bathrooms Count :{" "}
                  {
                    roomDetailsArray.filter(
                      (room) =>
                        room.bathroomType === "Attached Bathroom ( Full )"
                    ).length
                  }
                </h5>
                {/* <h5 className="font-size-4 font-weight-normal my-3">
                  Attached (Half) Bathrooms Count :{" "}
                  {
                    roomDetailsArray.filter(
                      (room) =>
                        room.bathroomType === "Attached Bathroom ( Half )"
                    ).length
                  }
                </h5> */}
                <Row className="mb-3">
                  <Col xs={24} sm={17} md={18} lg={14} xl={18} xxl={19}>
                    <h5 className="font-size-4 font-weight-normal mt-3 me-3">
                      Shared Bathrooms Count
                    </h5>
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
                    {" "}
                    <Form.Item name="sharedFullBathroomCount" initialValue={0}>
                      <div className="d-flex align-items-center border border-secondary rounded-3">
                        {/* Decrease Button */}
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            const currentValue = form.getFieldValue(
                              "sharedFullBathroomCount"
                            );
                            const newValue = Math.max(0, currentValue - 1);
                            form.setFieldsValue({
                              sharedFullBathroomCount: newValue,
                            });
                            // console.log("Decreased Value:", newValue);
                            setSharedFullBathroomCount(newValue);
                          }}
                        >
                          -
                        </button>

                        {/* Input Number */}
                        <InputNumber
                          style={{ width: "60px" }}
                          min={0}
                          max={500}
                          type="number"
                          size="large"
                          className="bg-transparent"
                          bordered={false}
                          value={sharedFullBathroomCount}
                          onChange={(value) => {
                            form.setFieldsValue({
                              sharedFullBathroomCount: value || 0,
                            });
                            setSharedFullBathroomCount(value || 0);
                          }}
                        />

                        {/* Increase Button */}
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            const currentValue = form.getFieldValue(
                              "sharedFullBathroomCount"
                            );
                            const newValue = Math.min(500, currentValue + 1);
                            form.setFieldsValue({
                              sharedFullBathroomCount: newValue,
                            });
                            // console.log("Increased Value:", newValue);
                            setSharedFullBathroomCount(newValue);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={24} sm={17} md={18} lg={14} xl={18} xxl={19}>
                    <h5 className="font-size-4 font-weight-normal mt-3 me-3">
                      Shared Half Bathrooms Count
                    </h5>
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
                    {" "}
                    <Form.Item name="sharedHalfBathroomCount" initialValue={0}>
                      <div className="d-flex align-items-center border border-secondary rounded-3">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            const currentValue = form.getFieldValue(
                              "sharedHalfBathroomCount"
                            );
                            const newValue = Math.max(0, currentValue - 1);
                            form.setFieldsValue({
                              sharedHalfBathroomCount: newValue,
                            });
                            // console.log("Decreased Value:", newValue);
                            setSharedHalfBathroomCount(newValue);
                          }}
                        >
                          -
                        </button>

                        <InputNumber
                          style={{ width: "60px" }}
                          min={0}
                          max={500}
                          type="number"
                          size="large"
                          className="bg-transparent"
                          bordered={false}
                          value={sharedHalfBathroomCount}
                          onChange={(value) => {
                            form.setFieldsValue({
                              sharedHalfBathroomCount: value || 0,
                            });
                            // console.log("Changed Value:", value);
                            setSharedHalfBathroomCount(value);
                          }}
                        />

                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            const currentValue = form.getFieldValue(
                              "sharedHalfBathroomCount"
                            );
                            const newValue = Math.min(500, currentValue + 1);
                            form.setFieldsValue({
                              sharedHalfBathroomCount: newValue,
                            });
                            // console.log("Increased Value:", newValue);
                            setSharedHalfBathroomCount(newValue);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row> */}
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="btnRow w-100" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex justify-content-between flex-column-reverse flex-sm-row mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/main/finish/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={() => {
                validateCreatePropertyListingUnitDetails();
              }}
            >
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepSimplifyRoomDetails;
