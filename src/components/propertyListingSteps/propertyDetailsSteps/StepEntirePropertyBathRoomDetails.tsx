import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  formatNamesCmnFun,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import {
  BathroomDetailsObject,
  DescribeApartmentItemsObj,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
import { useDispatch } from "react-redux";
import {
  getAllSharedBathrooms,
  getAmenitiesDetailsByEnum,
} from "../../../service/propertyDetailsService";
import {
  addNewProperty,
  getPropertyById,
  updatePropertyCreateLastMainStep,
} from "../../../service/propertyListingService";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum";
import { AmenityCategoriesEnum } from "../../../common/enums/amenityCategoriesEnum";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import defaultIcon from "../../../assets/images/steps/defaultIcon.png";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepEntirePropertyBathRoomDetails = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [sharedBathroomList, setSharedBathroomList] =
    useState<BathroomDetailsObject[]>();
  const [bathroomAmenitiesList, setBathroomAmenitiesList] = useState<
    DescribeApartmentItemsObj[]
  >([]);
  const [bathroomSelections, setBathroomSelections] = useState<any>({});
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));

    loadAllSharedBathrooms();
    getAmenitiesList();
    loadPropertyDetailsPropertyId();
  }, []);

  const loadAllSharedBathrooms = () => {
    let temp: BathroomDetailsObject[] = [];

    getAllSharedBathrooms()
      .then((resp) => {
        resp?.data.map((bathroom: BathroomDetailsObject) => {
          temp.push({
            id: bathroom?.id,
            name: bathroom?.name,
          });
        });
        setSharedBathroomList(temp);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const getAmenitiesList = () => {
    let temp: any = {
      categories: [AmenityCategoriesEnum.BATHROOM_AMENITIES],
    };
    getAmenitiesDetailsByEnum(temp)
      .then((res) => {
        const amenitiesList = res.data[0].amenities.map((amenity: any) => ({
          id: amenity.id.toString(),
          icon: amenity?.file?.smallPath,
          name: amenity.name,
        }));
        setBathroomAmenitiesList(amenitiesList);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );
          setPropertyDetailsObject(dataObj);
          if (dataObj?.sharedBathrooms && dataObj?.sharedBathrooms.length > 0) {
            const bathroomSelectionInit: any = {};
            dataObj.sharedBathrooms.forEach((bathroom: any) => {
              bathroomSelectionInit[bathroom.bathroomType.id] = {
                isSelected: true,
                count: bathroom.count,
                amenityIds: bathroom.amenities.map((amenity: any) =>
                  amenity.id.toString()
                ),
              };
            });

            setBathroomSelections(bathroomSelectionInit);

            // console.log("Loaded Bathroom Data:", bathroomSelectionInit);
          }

          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const getBathroomData = () => {
    const bathrooms = Object.entries(bathroomSelections).map(
      ([bathroomTypeId, details]: [string, any]) => ({
        bathroomTypeId: parseInt(bathroomTypeId, 10),
        count: details.count || 0,
        amenityIds: details.amenityIds || [],
      })
    );

    // console.log("Final Bathroom Data:", bathrooms);
    return bathrooms;
  };

  const handleCreatePropertyListingBathroomDetails = () => {
    let isValidate = false;

    const bathroomData = getBathroomData();

    // const isAnyBathroomSelected = bathroomData.some(
    //   (bathroom) => bathroom.bathroomTypeId && bathroom.count > 0
    // );

    // !isAnyBathroomSelected
    //   ? customToastMsg("Please select at least one bathroom type", 2)
    bathroomData.some((bathroom) => bathroom.count <= 0)
      ? customToastMsg("Bathroom count cannot be zero for selected types", 2)
      : // : bathroomData.some((bathroom) => bathroom.amenityIds.length === 0)
      // ? customToastMsg(
      //     "Please select amenities for the selected bathroom types",
      //     2
      //   )
      (isValidate = true);

    const data = {
      sharedBathrooms: bathroomData,
    };
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.SHARED_BATHROOMS, propertyId)
        .then((response) => {
          popUploader(dispatch, false);
          history(`/property/09/${propertyId}`);
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

  const clearStates = () => {
    setBathroomSelections({});
  };

  const getStepNumber = (
    propertyTypeKey: string,
    propertyDetailsObject: any
  ) => {
    if (!propertyTypeKey) {
      return "";
    }

    const isApartmentOrSimilar =
      propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
      propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
      propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
      propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY;

    if (isApartmentOrSimilar) {
      if (!propertyDetailsObject?.allowEntireProperty) {
        return "05";
      }
    } else {
      if (!propertyDetailsObject?.allowEntireProperty) {
        return "06";
      }
    }
    return "08";
  };

  return (
    <PropertyListing>
      <div className="StepEntirePropertyBathRoomDetailsContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={11} xl={12} xxl={12}>
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
                  Property Details
                </span>{" "}
                {">"} Step{" "}
                {getStepNumber(propertyTypeKey, propertyDetailsObject)}
              </h2>
              <h1 className="font-weight-medium font-size-1 me-0 me-lg-5">
                Specify shared bathroom details here
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Specify whether there are shared bathrooms to ensure guests know
                what to expect.
              </p>
            </div>
          </Col>

          <Col
            id="bathroom-col"
            xs={24}
            sm={24}
            md={24}
            lg={13}
            xl={12}
            xxl={12}
            className={`mb-3 d-flex ${Object.keys(bathroomSelections).length > 0
              ? "align-items-start"
              : "align-items-center"
              }
             `}
            // style={{ height: "86%", overflowY: "auto" }}
            style={Object.keys(bathroomSelections).length > 0 ? {
              height: "85%", overflowY: "auto", padding: "10px 10px 10px 0",
              alignSelf: "end", margin: "20px 0 10px 0"
            } : { height: "85%", overflowY: "auto",alignSelf: "end", }}
          >
            <Card
              bordered={false}
              className="rounded-4 ms-0 ms-xl-5 my-3 w-100"
              style={{ backgroundColor: "#fdfdfd6e" }}
            >
              <h5 className="font-size-4 font-weight-medium mb-3">
                Shared Bathroom Type
              </h5>

              {sharedBathroomList &&
                sharedBathroomList.map((bathRoom: any) => (
                  <Row className="d-flex justify-content-center justify-content-lg-start">
                    <div key={bathRoom.id}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Checkbox
                          checked={
                            bathroomSelections[bathRoom.id]?.isSelected || false
                          }
                          className="me-2 me-sm-3 me-md-4 me-lg-2 me-xl-4 my-2"
                          onChange={(e) => {
                            const isSelected = e.target.checked;

                            setBathroomSelections((prev: any) => {
                              const updatedSelections = { ...prev };

                              if (isSelected) {
                                updatedSelections[bathRoom.id] = {
                                  ...prev[bathRoom.id],
                                  isSelected,
                                  count: prev[bathRoom.id]?.count || 1,
                                  amenityIds:
                                    prev[bathRoom.id]?.amenityIds || [],
                                };
                              } else {
                                delete updatedSelections[bathRoom.id]; // Remove the object
                              }

                              return updatedSelections;
                            });
                          }}
                        >
                          <span className="font-size-4">
                            {formatNamesCmnFun(bathRoom.name)}
                          </span>
                        </Checkbox>
                      </Col>

                      {/* Bathroom Count */}
                      {bathroomSelections[bathRoom.id]?.isSelected && (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          xxl={24}
                          className="mt-3 d-flex justify-content-center justify-content-lg-start"
                        >
                          <Form.Item label="Count">
                            <div
                              className="d-flex align-items-center border border-secondary rounded-3"
                              style={{
                                width: "130px",
                              }}
                            >
                              {/* Decrement Button */}
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  setBathroomSelections((prev: any) => ({
                                    ...prev,
                                    [bathRoom.id]: {
                                      ...prev[bathRoom.id],
                                      count: Math.max(
                                        1,
                                        (prev[bathRoom.id]?.count || 1) - 1
                                      ),
                                    },
                                  }));
                                }}
                              >
                                -
                              </button>

                              <InputNumber
                                style={{ width: "60px" }}
                                min={1}
                                type="number"
                                size="large"
                                //value={roomCount}
                                value={
                                  bathroomSelections[bathRoom.id]?.count || 1
                                }
                                className="bg-transparent"
                                bordered={false}
                                onChange={(e) => {
                                  const value = Math.max(
                                    1,
                                    Math.min(10, Number(e.target.value))
                                  );
                                  setBathroomSelections((prev: any) => ({
                                    ...prev,
                                    [bathRoom.id]: {
                                      ...prev[bathRoom.id],
                                      count: value,
                                    },
                                  }));
                                }}
                              />

                              {/* Increment Button */}
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  setBathroomSelections((prev: any) => ({
                                    ...prev,
                                    [bathRoom.id]: {
                                      ...prev[bathRoom.id],
                                      count: Math.min(
                                        10,
                                        (prev[bathRoom.id]?.count || 1) + 1
                                      ),
                                    },
                                  }));
                                }}
                              >
                                +
                              </button>
                            </div>
                          </Form.Item>
                        </Col>
                      )}

                      {/* Bathroom Amenities */}
                      {bathroomSelections[bathRoom.id]?.isSelected && (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          xxl={24}
                          className="mt-3"
                        >
                          {bathroomAmenitiesList.length > 0 && (
                            <h5 className="font-size-4 font-weight-medium mb-2">
                              {formatNamesCmnFun(bathRoom.name)} Amenities
                            </h5>
                          )}

                          <div>
                            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
                              {bathroomAmenitiesList.map((item: any) => (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    const isSelected = bathroomSelections[
                                      bathRoom.id
                                    ]?.amenityIds?.includes(item.id);
                                    setBathroomSelections((prev: any) => ({
                                      ...prev,
                                      [bathRoom.id]: {
                                        ...prev[bathRoom.id],
                                        amenityIds: isSelected
                                          ? prev[
                                            bathRoom.id
                                          ]?.amenityIds.filter(
                                            (id: number) => id !== item.id
                                          ) // Remove
                                          : [
                                            ...(prev[bathRoom.id]
                                              ?.amenityIds || []),
                                            item.id,
                                          ], // Add
                                      },
                                    }));
                                  }}
                                  className="d-flex justify-content-center align-items-center px-3 rounded-4 my-2 mx-2"
                                  style={{
                                    width: "max-content",
                                    color: bathroomSelections[
                                      bathRoom.id
                                    ]?.amenityIds?.includes(item.id)
                                      ? "white"
                                      : "black",
                                    backgroundColor: bathroomSelections[
                                      bathRoom.id
                                    ]?.amenityIds?.includes(item.id)
                                      ? "#ef5a60"
                                      : "#fdfdfd6e",
                                    border: "2px solid white",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img
                                    src={item.icon ? item.icon : defaultIcon}
                                    width="20px"
                                    alt="icon-img"
                                  />
                                  <h5 className="font-size-4 font-weight-normal ms-2 my-2 my-0">
                                    {item.name}
                                  </h5>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      )}

                      <Divider />
                    </div>
                  </Row>
                ))}
            </Card>
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

                if (propertyDetailsObject?.allowEntireProperty) {
                  history(`/property/07/${propertyId}`);
                  return;
                } else {
                  if (
                    propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                    propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                    propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                  ) {
                    history(`/property/04/${propertyId}`);
                  } else {
                    history(`/property/05/${propertyId}`);
                  }
                }

                // if (
                //   propertyDetailsObject?.allowEntireProperty &&
                //   propertyDetailsObject.propertyType?.name !=
                //     PropertyTypesEnum.HOTEL
                // ) {
                //   history(`/property/10/${propertyId}`);
                //   return;
                // } else if (
                //   propertyDetailsObject?.allowIndividualUnit &&
                //   propertyDetailsObject.propertyType?.name !=
                //     PropertyTypesEnum.HOTEL &&
                //   propertyDetailsObject.propertyType?.name !=
                //     PropertyTypesEnum.APARTMENT
                // ) {
                //   history(`/property/09/${propertyId}`);
                //   return;
                // }
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingBathroomDetails}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepEntirePropertyBathRoomDetails;
