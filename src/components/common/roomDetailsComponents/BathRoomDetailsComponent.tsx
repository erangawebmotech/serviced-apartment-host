import {
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Radio,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  formatNamesCmnFun,
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../../common/commonFunctions.tsx";
import {
  BathRoomDataObject,
  DescribeApartmentItemsObj,
  DropdownObj,
} from "../../../common/interfaces/uiNecessaryInterface.ts";
import * as constants from "../../../common/constants.ts";
import {
  getAllNonSharedBathroomDetails,
  getAmenitiesDetailsByEnum,
} from "../../../service/propertyDetailsService.ts";
import { AmenityCategoriesEnum } from "../../../common/enums/amenityCategoriesEnum.ts";
import { useDispatch } from "react-redux";
import { getPropertyById } from "../../../service/propertyListingService.ts";
import { Cookies } from "typescript-cookie";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import defaultIcon from "../../../assets/images/steps/defaultIcon.png";

interface BathRoomDetailsComponentProp {
  bathroomSelectionsDetails: any;
  onBathroomSelectionDataChange: (data: BathRoomDataObject[]) => void;
}

const BathRoomDetailsComponent: React.FC<BathRoomDetailsComponentProp> = ({
  bathroomSelectionsDetails,
  onBathroomSelectionDataChange,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [bathroomSelections, setBathroomSelections] = useState<any>({});

  const [bathRoomTypes, setBathRoomType] = useState<DropdownObj[]>([]);
  const [bathroomAmenitiesList, setBathroomAmenitiesList] = useState<
    DescribeApartmentItemsObj[]
  >([]);

  const [form] = Form.useForm();

  useEffect(() => {
    getAmenitiesList();
    getAllBathRoomType();
  }, []);
  useEffect(() => {
    setBathroomSelections(bathroomSelectionsDetails);
  }, [bathroomSelectionsDetails]);

  const getAllBathRoomType = () => {
    getAllNonSharedBathroomDetails()
      .then((res) => {
        const filteredData = res.data.filter(
          (item: any) =>
            item.name !== "SHARED_HALF" && item.name !== "SHARED_FULL"
        );

        const formattedData = filteredData.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));

        setBathRoomType(formattedData);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
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
          icon: amenity.file?.smallPath,
          name: amenity.name,
        }));
        setBathroomAmenitiesList(amenitiesList);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      });
  };

  useEffect(() => {
    sendBathroomDetails();
  }, [bathroomSelections]);

  const sendBathroomDetails = () => {
    const bathroomData = getBathroomData();

    onBathroomSelectionDataChange(bathroomData);
  };

  const getBathroomData = () => {
    const bathrooms = Object.entries(bathroomSelections).map(
      ([bathroomTypeId, details]: [string, any]) => ({
        bathroomTypeId: parseInt(bathroomTypeId, 10),
        count: details.count || 0,
        amenityIds: details.amenityIds || [],
      })
    );

    return bathrooms;
  };

  const clearStates = () => {
    setBathroomSelections({});
    form.resetFields();
  };

  // console.log(
  //   "bathroomSelections",
  //   bathroomSelections,
  //   "Radio value:",
  //   Object.keys(bathroomSelections)[0],
  //   typeof parseInt(Object.keys(bathroomSelections)[0])
  // );

  return (
    <div className="BathRoomDetailsComponentContainer w-100" onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}>
      <Card
        bordered={false}
        className="rounded-4 border border-white my-3 w-100"
        style={{ backgroundColor: "#fdfdfd6e" }}
      >
        <h5 className="font-size-4 font-weight-medium mb-2">Bathroom Type</h5>

        <Select
          className="w-100"
          size="large"
          placeholder="Select bathroom type"
          value={
            Object.keys(bathroomSelections).length === 1
              ? parseInt(Object.keys(bathroomSelections)[0])
              : null
          }
          options={bathRoomTypes}
          onChange={(e) => {
            setBathroomSelections((prev: any) => {
              const updatedSelections = { ...prev };

              Object.keys(updatedSelections).forEach((key) => {
                if (key !== e) {
                  delete updatedSelections[key];
                }
              });

              updatedSelections[e] = {
                count: 1,
                amenityIds: [],
              };

              return updatedSelections;
            });
          }}
        />

        {/* {Object.keys(bathroomSelections).length === 1 && (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="mt-3"
          >
            <Form.Item label="Count">
              <div
                className="d-flex align-items-center border border-secondary rounded-3"
                style={{
                  width: "130px",
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setBathroomSelections((prev: any) => {
                      const firstKey = Object.keys(prev)[0];
                      if (!firstKey) return prev;

                      return {
                        ...prev,
                        [firstKey]: {
                          ...prev[firstKey],
                          count: Math.max(1, (prev[firstKey]?.count || 1) - 1),
                        },
                      };
                    });
                  }}
                >
                  -
                </button>

                <InputNumber
                  style={{ width: "60px" }}
                  min={1}
                  type="number"
                  size="large"
                  value={
                    Object.keys(bathroomSelections).length > 0
                      ? bathroomSelections[Object.keys(bathroomSelections)[0]]
                          .count
                      : 1
                  }
                  className="bg-transparent"
                  bordered={false}
                  onChange={(e) => {
                    const value = Math.max(
                      1,
                      Math.min(10, Number(e.target.value))
                    );

                    setBathroomSelections((prev: any) => {
                      const firstKey = Object.keys(prev)[0];
                      if (!firstKey) return prev;

                      return {
                        ...prev,
                        [firstKey]: {
                          ...prev[firstKey],
                          count: value,
                        },
                      };
                    });
                  }}
                />

                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setBathroomSelections((prev: any) => {
                      const firstKey = Object.keys(prev)[0];
                      if (!firstKey) return prev;

                      return {
                        ...prev,
                        [firstKey]: {
                          ...prev[firstKey],
                          count: Math.min(10, (prev[firstKey]?.count || 1) + 1),
                        },
                      };
                    });
                  }}
                >
                  +
                </button>
              </div>
            </Form.Item>
          </Col>
        )} */}

        {Object.keys(bathroomSelections).length === 1 && (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="mt-3"
          >
            {bathroomAmenitiesList?.length > 0 && (
              <h5 className="font-size-4 font-weight-medium mb-2">Amenities</h5>
            )}

            <div>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
                {bathroomAmenitiesList.map((item: any) => {
                  const firstBathroomId = Object.keys(bathroomSelections)[0];

                  const isSelected = bathroomSelections[
                    firstBathroomId
                  ]?.amenityIds?.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setBathroomSelections((prev: any) => {
                          if (!firstBathroomId) return prev;

                          return {
                            ...prev,
                            [firstBathroomId]: {
                              ...prev[firstBathroomId],
                              amenityIds: isSelected
                                ? prev[firstBathroomId]?.amenityIds.filter(
                                  (id: number) => id !== item.id
                                )
                                : [
                                  ...(prev[firstBathroomId]?.amenityIds ||
                                    []),
                                  item.id,
                                ],
                            },
                          };
                        });
                      }}
                      className="d-flex justify-content-center align-items-center px-3 rounded-4 my-2 mx-2"
                      style={{
                        width: "max-content",
                        color: isSelected ? "white" : "black",
                        backgroundColor: isSelected ? "#ef5a60" : "#fdfdfd6e",
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
                  );
                })}
              </div>
            </div>
          </Col>
        )}
      </Card>
    </div>
  );
};

export default BathRoomDetailsComponent;
