import { Button, Col, Form, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import { UnitEnum } from "../../../common/uiConstants";
import {
  BathRoomDataObject,
  GuestUseInRoomDataObject,
  PricePerNightDataObject,
  PriceRatePlan,
  SelectedBedTypeDataObject,
  UnitDetailsDataObject,
  UnitSubUnitNameDataObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
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
import RoomDetailsComponent from "../../common/roomDetailsComponents/RoomDetailsComponent.tsx";
import BathRoomDetailsComponent from "../../common/roomDetailsComponents/BathRoomDetailsComponent.tsx";
import GuestUseInRoomComponent from "../../common/roomDetailsComponents/GuestUseInRoomComponent.tsx";
import PricePerNightComponent from "../../common/roomDetailsComponents/PricePerNightComponent.tsx";
import RatePlanForRoomComponent from "../../common/roomDetailsComponents/RatePlanForRoomComponent.tsx";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum.ts";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum.ts";
import Loader from "../../common/loader/Loader.tsx";
import Loader02 from "../../common/loader/Loader02.tsx";
import { PlansEnum } from "../../../common/enums/plansEnum.ts";
import { commissionRateEnum } from "../../../config/commissionConfig.ts";

const StepRoomDetails = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isAllowIndividualUnits, setIsAllowIndividualUnits] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  const [guestUseInRoomDetails, setGuestUseInRoomDetails] =
    useState<GuestUseInRoomDataObject>();
  const [bathroomRoomDetails, setBathroomRoomDetails] =
    useState<BathRoomDataObject>();
  const [unitAndSubUnitDetails, setUnitAndSubUnitDetails] =
    useState<UnitSubUnitNameDataObject>();
  const [pricePerNightDetails, setPricePerNightDetails] =
    useState<PricePerNightDataObject>();
  const [priceRatePlanDetails, setPriceRatePlanDetails] =
    useState<PricePerNightDataObject>();
  const [unitDetails, setUnitDetails] = useState<UnitDetailsDataObject>();
  const [isShowCheckBox, setIsShowCheckBox] = useState<boolean>(false);

  const [isRowScrolled, setIsRowScrolled] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);

  //sendDetailsStates
  const [bathroomSelections, setBathroomSelections] = useState<any>({});
  const [selectedAmenities, setSelectedAmenities] = useState<
    { amenityId: string; description: string | null }[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [monthlyPropertyPrice, setMonthlyPropertyPrice] = useState<number>(0);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [guestCountOfRoom, setGuestCountOfRoom] = useState<number>(0);
  const [datesForBooking, setDatesForBooking] = useState<number>(0);
  const [roomSize, setRoomSize] = useState<number>(0);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
  const [
    isHaveMultipleRoomsForRoomCategory,
    setIsHaveMultipleRoomsForRoomCategory,
  ] = useState<boolean>(false);
  const [selectedBedTypeDetails, setSelectedBedTypeDetails] = useState<
    SelectedBedTypeDataObject[]
  >([{ bedTypeId: 0, count: 1 }]);
  const [roomName, setRoomName] = useState<string>("");
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [perNightRateList, setPerNightRateList] = useState<PriceRatePlan>();
  const [perNightOverallDetails, setPerNightOverallDetails] = useState<{
    headCount: number;
    priceForMaxCount: number;
  }>();

  const [isLoaderShow, setIsLoaderShow] = useState<boolean>(false);
  const [commissionRate, setCommissionRate] = useState<number>(0);


  useEffect(() => {
    const rowElement = rowRef.current;
    if (!rowElement) return;

    const handleRowScroll = () => {
      if (rowElement.scrollTop > 10) {
        setIsRowScrolled(true);
      } else {
        setIsRowScrolled(false);
      }
    };

    rowElement.addEventListener("scroll", handleRowScroll);

    return () => {
      rowElement.removeEventListener("scroll", handleRowScroll);
    };
  }, []);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

  useEffect(() => {
    dispatch({
      type: "IS_UNIT_DETAILS_SET",
      value: { isPropertyTypeRoomOrHomeStay: isShowCheckBox },
    });
  }, [isShowCheckBox]);

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    setPropertyId(propertyId ? propertyId : 0);
    const unitId = Cookies.get(constants.ROOM_ID);
    setIsLoaderShow(true);
    if (propertyId) {
      getPropertyById(propertyId)
        .then(async (resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          dataObj?.plan?.name === PlansEnum.STARTER ? setCommissionRate(commissionRateEnum?.STARTER) : dataObj?.plan?.name === PlansEnum.SUPPORTIVE ? setCommissionRate(commissionRateEnum?.SUPPORTIVE) : dataObj?.plan?.name === PlansEnum.ALL_INCLUSIVE ? setCommissionRate(commissionRateEnum?.ALL_INCLUSIVE) : ""

          if (
            dataObj?.propertyType?.name === PropertyTypesEnum.ROOMS ||
            dataObj?.propertyType?.name === PropertyTypesEnum.HOME_STAY
          ) {
            setIsShowCheckBox(false);
          } else {
            setIsShowCheckBox(true);
          }

          if (typeof unitId === "string") {
            const result = findUnitById(dataObj.unitDetails, parseInt(unitId));

            if (result) {
              const bathroomSelectionInit: Record<
                number,
                { count: number; amenityIds: string[] }
              > = {};

              result.unitBathrooms.forEach((bathroom: any) => {
                bathroomSelectionInit[bathroom.bathroomType.id] = {
                  count: bathroom.count,
                  amenityIds: bathroom.amenities.map((amenity: any) =>
                    amenity.id.toString()
                  ),
                };
              });

              setBathroomSelections(bathroomSelectionInit);

              const selectedAmenities = result.unitAmenities.map(
                (unitAmenity: any) => ({
                  amenityId: unitAmenity.amenity.id.toString(),
                  description: unitAmenity.description || null, // Default to "test" if no description
                })
              );
              await setSelectedAmenities(selectedAmenities);

              const highLightArray: string[] = result.unitHighlights.map(
                (item: any) => item.id.toString()
              );
              await setSelectedItems(highLightArray);
              // console.log("Loaded Bathroom Data:", bathroomSelectionInit);

              setPropertyPrice(result.priceForMaxCount || 0);
              setMonthlyPropertyPrice(result.monthlyRate || 0);

              setGuestCountOfRoom(result?.maxHeadCount);
              setRoomCount(result?.count);
              setIsHaveMultipleRoomsForRoomCategory(
                result?.count > 1 ? true : false
              );
              setSelectedRoomType(result?.unitCategoryId);
              setDatesForBooking(result?.minBookingDays);
              setRoomSize(result?.size);
              setUnitId(result.unitId);
              const transformedBeds = result?.beds.map((bed: any) => ({
                bedTypeId: bed.bedType.id,
                count: bed.count,
              }));
              setSelectedBedTypeDetails(transformedBeds);

              form.setFieldsValue({
                selectedRoomType: result?.unitCategoryId,
                guestCountOfRoom: result?.maxHeadCount,
              });

              //--------name part details set to inputs-------------------------
              form.setFieldsValue({
                roomName: result.name || result?.unitCategory?.name,
              });
              setRoomName(result.name || result?.unitCategory?.name);

              // Populate roomNumbers with subUnits names
              const subUnitsNames =
                result.subUnits?.map((subUnit: any, index: number) =>
                  subUnit.name ? subUnit.name : `Room ${index + 1}`
                ) || [];
              const roomCount =
                subUnitsNames.length > 0
                  ? subUnitsNames.length
                  : result.count || 1;
              const roomNames =
                subUnitsNames.length > 0
                  ? subUnitsNames
                  : Array(roomCount).fill("");

              setRoomNumbers(roomNames);

              const fieldsToSet = roomNames.map(
                (name: string, index: number) => ({
                  name: `roomNumber${index}`,
                  value: name,
                })
              );
              form.setFields(fieldsToSet);
              let unitRates: PriceRatePlan = undefined;
              result?.unitRates.length > 0
                ? (unitRates = {
                  unitId: result.unitId,
                  rates: result.unitRates
                    .filter(
                      (priceObj: any) =>
                        priceObj.headCount !== result.maxHeadCount
                    )
                    .map((priceObj: any) => ({
                      headCount: priceObj.headCount,
                      rate: priceObj.rate,
                    })),
                })
                : (unitRates = {
                  unitId: result.unitId,
                  rates: Array.from(
                    { length: result.maxHeadCount },
                    (_, index) => ({
                      headCount: index + 1,
                      rate: 0,
                    })
                  ).filter(
                    (priceObj) => priceObj.headCount !== result.maxHeadCount
                  ),
                });

              setPerNightOverallDetails({
                headCount: result.maxHeadCount,
                priceForMaxCount: 0,
              });
              setPerNightRateList(unitRates);
            }
          }
          setIsLoaderShow(false);
          await setIsDisableBtns(false);
        })
        .catch((err) => {
          setIsLoaderShow(false);
          handleError(err);
        });
    }
  };

  const findUnitById = (unitsArray: any, targetUnitId: number) => {
    return unitsArray.find((unit: any) => unit.unitId === targetUnitId);
  };

  const handleCreatePropertyListingUnitDetails = () => {
    let isValidate = false;

    const isAnyBathroomSelected = bathroomRoomDetails?.some(
      (bathroom: any) => bathroom.bathroomTypeId && bathroom.count > 0
    );

    const allCountsZero = unitDetails?.beds.some((bed) => bed.count === 0);
    const allBedTypesZero = unitDetails?.beds.some(
      (bed) => bed.bedTypeId === 0
    );
    // console.log(unitDetails);

    if (unitDetails?.unitProfile?.name === "") {
      customToastMsg(`Enter your ${UnitEnum.ROOM_SIMPLE} name first`, 2);
    } else if (unitDetails?.unitCategoryId === 0 || unitDetails?.unitCategoryId === null) {
      customToastMsg("Select a room type", 2);
    } else if (unitDetails && unitDetails?.count <= 0) {
      customToastMsg("Enter valid room count", 2);
    } else if (
      unitDetails?.unitProfile?.subUnitsNames.some((value) => value === "")
    ) {
      customToastMsg(
        `Enter your individual ${UnitEnum.ROOM_SIMPLE} names/numbers`,
        2
      );
    } else if (unitDetails && allBedTypesZero) {
      customToastMsg("Enter valid bed type", 2);
    } else if (unitDetails && allCountsZero) {
      customToastMsg("Enter valid bed count", 2);
    } else if (unitDetails && unitDetails.maxHeadCount <= 0) {
      customToastMsg("Enter valid guest count", 2);
    } else if (unitDetails && unitDetails.minBookingDays <= 0) {
      customToastMsg("Enter valid minimum dates of booking", 2);
    } else if (unitDetails && unitDetails.size <= 0) {
      customToastMsg("Enter valid room size", 2);
    } else if (!bathroomRoomDetails || !isAnyBathroomSelected) {
      customToastMsg("Please select at least one bathroom type", 2);
    } else if (
      bathroomRoomDetails.some(
        (bathroom: any) => bathroom.bathroomTypeId && bathroom.count <= 0
      )
    ) {
      customToastMsg("Bathroom count cannot be zero for selected types", 2);
    }
    // else if (
    //   bathroomRoomDetails.some(
    //     (bathroom: any) =>
    //       bathroom.bathroomTypeId &&
    //       (!bathroom.amenityIds || bathroom.amenityIds.length === 0)
    //   )
    // ) {
    //   customToastMsg(
    //     "Please select amenities for the selected bathroom types",
    //     2
    //   );
    // }
    // else if (!guestUseInRoomDetails) {
    //   customToastMsg("Please select at least one amenity and highlight", 2);
    // } else if (
    //   guestUseInRoomDetails?.amenities &&
    //   guestUseInRoomDetails.amenities.length === 0
    // ) {
    //   customToastMsg("Please select at least one general amenity", 2);
    // } else if (
    //   guestUseInRoomDetails?.highlightIds &&
    //   guestUseInRoomDetails.highlightIds.length === 0
    // ) {
    //   customToastMsg("Please select at least one highlight", 2);
    // }
    else if (!pricePerNightDetails || !pricePerNightDetails.priceForMaxCount) {
      customToastMsg("Enter property daily rate", 2);
    } else if (
      pricePerNightDetails?.priceForMaxCount &&
      pricePerNightDetails?.priceForMaxCount <= 0
    ) {
      customToastMsg("Enter a valid property daily rate", 2);
    }
    // else if (!pricePerNightDetails || !pricePerNightDetails.monthlyRate) {
    //   customToastMsg("Enter property monthly rate", 2);
    // }
    else if (
      pricePerNightDetails?.monthlyRate &&
      pricePerNightDetails?.monthlyRate <= 0
    ) {
      customToastMsg("Enter a valid property monthly rate", 2);
    }
    else {
      isValidate = true;
    }

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);

      let data = {
        unitDetails: {
          individualUnitDetails: {
            ...unitDetails,
            unitAmenities: guestUseInRoomDetails,
            unitBathrooms: bathroomRoomDetails,
            unitPriceForMaxCount: pricePerNightDetails?.priceForMaxCount
              ? pricePerNightDetails?.priceForMaxCount
              : null,
            monthlyRate: pricePerNightDetails?.monthlyRate
              ? pricePerNightDetails?.monthlyRate
              : null,
            unitRates: priceRatePlanDetails ? priceRatePlanDetails : null,
          },
        },
      };
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
          popUploader(dispatch, false);
          handleError(error);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const updateLastMainStep = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    updatePropertyCreateLastMainStep(
      MainStepsCompleteTypeEnum.UNIT_DETAILS_COMPLETE,
      propertyId
    )
      .then((response) => {
        history(`/main/finish/${propertyId}`);
        setIsDisableBtns(true);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const handleGuestUseInRoomData = (data: any) => {
    // console.log("Data received from guestUseInRoomDetails:", data);
    setGuestUseInRoomDetails(data);
  };
  const handleBathRoomData = (data: any) => {
    // console.log("Data received from bathRoomData:", data);
    setBathroomRoomDetails(data);
  };

  const handleUnitNameData = (data: any) => {
    // console.log("Data received from handleUnitNameData:", data);
    setUnitAndSubUnitDetails(data);
  };

  const handlePricePerNightData = (data: any) => {
    // console.log("Data received from handlePricePerNightData:", data);
    setPricePerNightDetails(data);
  };
  const handleRatePlanForRoomData = (data: any) => {
    // console.log("Data received from handleRatePlanForRoomData:", data);
    setPriceRatePlanDetails(data);
  };
  const handleUnitDetailsData = (data: any) => {
    // console.log("Data received from handleUnitDetailsData:", data);
    setUnitDetails(data);
  };

  const clearStates = () => {
    // setSelectedRoomType(0);
    // setRoomCount(0);
    // setGuestCountOfRoom(0);
    // setDatesForBooking(0);
    // setRoomSize(0);
    // setUnitId(null);
    dispatch({
      type: "IS_UNIT_DETAILS_SET",
      value: { unitPrice: 0 },
    });
    dispatch({
      type: "IS_UNIT_DETAILS_SET",
      value: { guestCount: 0 },
    });
  };

  return (
    <> {isLoaderShow && <Loader02 />}
      <PropertyListing isPageScroll={isRowScrolled}>

        <div className="StepRoomDetailsContainer py-5 py-lg-0 h-100 w-100 ">
          <Row
            ref={rowRef}
            className="contentRow d-flex align-items-center pt-5 w-100"
            style={{ height: "90%", overflowY: "auto" }}
          >
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              {" "}
              <div className="pt-5">
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
                    Room Details
                  </span>{" "}
                  {">"} Add Details
                </h2>
                <h1 className="font-weight-medium font-size-1">
                  Add details for single room
                </h1>
                <p className="font-size-4 font-weight-extra-light">
                  Provide specific information for room or room type
                </p>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="pe-0 pe-lg-3"
            >
              <Form form={form} layout="vertical" className="w-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <Row>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="pe-0 pe-md-4 "
                  >
                    <RoomDetailsComponent
                      roomCountDetails={roomCount}
                      guestCountOfRoomDetails={guestCountOfRoom}
                      datesForBookingDetails={datesForBooking}
                      roomSizeDetails={roomSize}
                      unitIdDetails={unitId}
                      selectedRoomTypeDetails={selectedRoomType}
                      isHaveMultipleRoomsForRoomCategoryDetails={
                        isHaveMultipleRoomsForRoomCategory
                      }
                      selectedBedTypeDetailsData={selectedBedTypeDetails}
                      roomNameDetails={roomName}
                      roomNumbersDetails={roomNumbers}
                      onUnitDetailsChange={handleUnitDetailsData}
                    />
                  </Col>

                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="ps-0 ps-md-4"
                  >
                    <BathRoomDetailsComponent
                      bathroomSelectionsDetails={bathroomSelections}
                      onBathroomSelectionDataChange={handleBathRoomData}
                    />
                    <GuestUseInRoomComponent
                      selectedAmenitiesDetails={selectedAmenities}
                      selectedHighlightsDetails={selectedItems}
                      onGuestUseInRoomDataChange={handleGuestUseInRoomData}
                    />

                    <PricePerNightComponent
                      propertyPriceDetails={propertyPrice}
                      monthlyPropertyPriceDetails={monthlyPropertyPrice}
                      onPricePerNightChange={handlePricePerNightData}
                      commissionRate={commissionRate}
                    />


                    <RatePlanForRoomComponent
                      perNightOverallDetailsData={perNightOverallDetails}
                      perNightRateListDetails={perNightRateList}
                      onRatePlanForRoomChange={handleRatePlanForRoomData}
                    />


                  </Col>
                </Row>
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
                  clearStates();
                  const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                  history(`/main/finish/${propertyId}`);
                }}
              >
                Back
              </Button>
              <Button
                disabled={isDisableBtns}
                htmlType="button"
                size="large"
                type="primary"
                typeof="Button"
                className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
                onClick={handleCreatePropertyListingUnitDetails}
              >
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </PropertyListing>
    </>
  );
};

export default StepRoomDetails;
