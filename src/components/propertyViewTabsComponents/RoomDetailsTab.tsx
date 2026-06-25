import { Badge, Card, Carousel, Col, Divider, Empty, Row, Tag, Typography } from "antd";
import "../../styles/propertyListingStyles.scss";
import "../../styles/ical/icanPageStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MapPin, User } from "react-feather";
import {
  PropertyListingDetailDTO,
  PropertyUnitDetails,
} from "../../common/dto/PropertyListingDetailDTO";
import parse from "html-react-parser";
import moment from "moment";
import { formatNamesCmnFun } from "../../common/commonFunctions";
import { PropertyStatusEnum } from "../../common/enums/propertyStatusEnum";
import { CurrencyEnum } from "../../common/enums/currencyEnum";
import { PropertyUnitsStatusEnum } from "../../common/enums/propertyUnitsStatusEnum";
import defaultIcon from "../../assets/images/steps/defaultIcon02.png";
import roomStepIcon from "../../assets/images/steps/roomStep.png";

interface RoomDetailsTabProps {
  roomDetails: PropertyUnitDetails[];
  isIndividualUnitsAvailable: boolean;
}
const RoomDetailsTab: React.FC<RoomDetailsTabProps> = ({
  roomDetails,
  isIndividualUnitsAvailable,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  // const [modalLoading, setModalLoading] = useState<boolean>(false);

  // const contentStyle: React.CSSProperties = {
  //   margin: 0,
  //   height: "100%",
  //   color: "#fff",
  //   lineHeight: "160px",
  //   textAlign: "center",
  //   background: "#364d79",
  // };

  // console.log(roomDetails);


  return (
    <div className="RoomDetailsTabContainer w-100">
      <Row className="w-100">
        {roomDetails.length > 0 ? <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100">
          {roomDetails.map((roomCat: PropertyUnitDetails, index: number) => {
            return (
              <Card bordered={true} className="w-100 my-3">
                <Row className="w-100">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="w-100"
                  >
                    {isIndividualUnitsAvailable ? (
                      <h2 className="font-size-2 font-weight-semi-bold p-0 mt-2 mb-4">
                        {formatNamesCmnFun(roomCat?.name ? roomCat?.name : "")}{" "}
                        - {roomCat?.unitCategory?.name}{" "}
                        <Tag
                          className="font-size-3 py-1 px-2 ms-2"
                          color={
                            roomCat?.status == PropertyUnitsStatusEnum.ACTIVE
                              ? "green"
                              : roomCat?.status ==
                                PropertyUnitsStatusEnum.INACTIVE
                                ? "red"
                                : ""
                          }
                        >
                          {" "}
                          {roomCat?.status}
                        </Tag>
                      </h2>
                    ) : (
                      <h2 className="font-size-2 font-weight-semi-bold p-0 mt-2 mb-4">
                        {roomCat?.isMasterBedRoom ? "Master Bedroom" : `Bedroom ${index + 1}`} -{" "}
                        <Tag
                          className="font-size-3 py-1 px-2"
                          color={
                            roomCat?.status == PropertyUnitsStatusEnum.ACTIVE
                              ? "green"
                              : roomCat?.status ==
                                PropertyUnitsStatusEnum.INACTIVE
                                ? "red"
                                : ""
                          }
                        >
                          {" "}
                          {roomCat?.status}
                        </Tag>
                      </h2>
                    )}
                    {roomCat?.count && isIndividualUnitsAvailable && (
                      <Row className="">
                        <Col
                          xs={12}
                          sm={11}
                          md={8}
                          lg={6}
                          xl={6}
                          xxl={5}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Room count
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={11}
                          sm={12}
                          md={15}
                          lg={17}
                          xl={17}
                          xxl={18}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            {roomCat?.count}
                          </h2>
                        </Col>
                      </Row>
                    )}
                    {roomCat?.maxHeadCount && (
                      <Row className="">
                        <Col
                          xs={12}
                          sm={11}
                          md={8}
                          lg={6}
                          xl={6}
                          xxl={5}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Maximin head count
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={11}
                          sm={12}
                          md={15}
                          lg={17}
                          xl={17}
                          xxl={18}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            {roomCat?.maxHeadCount}
                          </h2>
                        </Col>
                      </Row>
                    )}
                    {roomCat?.minBookingDays && (
                      <Row className="">
                        <Col
                          xs={12}
                          sm={11}
                          md={8}
                          lg={6}
                          xl={6}
                          xxl={5}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Minimum booking days
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={11}
                          sm={12}
                          md={15}
                          lg={17}
                          xl={17}
                          xxl={18}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            {roomCat?.minBookingDays}
                          </h2>
                        </Col>
                      </Row>
                    )}
                    {roomCat?.size && (
                      <Row className="">
                        <Col
                          xs={12}
                          sm={11}
                          md={8}
                          lg={6}
                          xl={6}
                          xxl={5}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Size of a room
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={11}
                          sm={12}
                          md={15}
                          lg={17}
                          xl={17}
                          xxl={18}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            {roomCat?.size} square feets
                          </h2>
                        </Col>
                      </Row>
                    )}
                    {/* <h2 className="font-size-6 font-weight-normal p-0">
                      You {roomCat?.editable ? "can" : "can't"} edit details in
                      this room category
                    </h2> */}

                    {isIndividualUnitsAvailable && <Divider />}
                    <Row className="w-100 d-flex justify-content-center justify-content-lg-start">
                      {roomCat?.unitImages &&
                        roomCat?.unitImages?.length > 0 && (
                          <Col
                            xs={24}
                            sm={20}
                            md={14}
                            lg={8}
                            xl={8}
                            xxl={8}
                            className="w-100 mb-4"
                          >
                            <Carousel
                              arrows
                              infinite={false}
                              className="h-100 rounded-4"
                            >
                              {roomCat?.unitImages?.map((imgObj, index) => (
                                <div key={index} className="rounded-4">
                                  <img
                                    src={imgObj?.file?.largePath}
                                    alt={
                                      imgObj?.altTag ||
                                      `Room image ${index + 1}`
                                    }
                                    className="rounded-4"
                                    style={{
                                      width: "100%",
                                      height: "280px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              ))}
                            </Carousel>
                          </Col>
                        )}
                      {roomCat?.subUnits &&
                        roomCat?.subUnits?.length > 0 &&
                        isIndividualUnitsAvailable && (
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={8}
                            xl={8}
                            xxl={8}
                            className={`w-100 ps-0 mb-3 mb-lg-0 ${roomCat?.unitImages &&
                              roomCat?.unitImages?.length > 0
                              ? "ps-lg-4"
                              : "ps-lg-0"
                              }`}
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                              Room Details
                            </h2>

                            {roomCat?.subUnits?.map((subU) => {
                              return (
                                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                  {subU?.name}
                                </h2>
                              );
                            })}
                          </Col>
                        )}
                      {roomCat?.beds && roomCat?.beds.length > 0 && (
                        <Col
                          xs={24}
                          sm={24}
                          md={12}
                          lg={8}
                          xl={8}
                          xxl={8}
                          className={`w-100 mb-3 mb-lg-0 ${roomCat?.unitImages &&
                            roomCat?.unitImages?.length > 0 &&
                            !isIndividualUnitsAvailable
                            ? "ps-lg-4"
                            : "ps-lg-0"
                            }`}
                        >
                          <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                            Bed Details
                          </h2>

                          {roomCat?.beds?.map((bed) => {
                            return (
                              <div className="d-flex align-items-center">
                                <img
                                  src={roomStepIcon}
                                  alt="icon"
                                  height="auto"
                                  width={25}
                                />{" "}
                                <h5 className="font-size-4 font-weight-normal my-0 ms-2">
                                  {bed.bedType?.name} Bed(s) -
                                </h5>
                                <h5 className="font-size-4 font-weight-normal my-0 ms-2">
                                  {bed?.count}
                                </h5>
                              </div>
                            );
                          })}
                        </Col>
                      )}

                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}
                        xl={8}
                        xxl={8}
                        className="w-100 mb-3 mb-lg-0"
                      >
                        <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                          Bathroom Details
                        </h2>

                        {roomCat?.unitBathrooms &&
                          roomCat?.unitBathrooms.length > 0 ? (
                          roomCat?.unitBathrooms?.map((bathroom) => {
                            return (
                              <div>
                                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                  {bathroom?.bathroomType?.name} -{" "}
                                  {bathroom?.count}
                                </h2>
                                {bathroom?.amenities &&
                                  bathroom?.amenities.length > 0 && (
                                    <div>
                                      <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                        Bathroom amenities
                                      </h2>
                                      {bathroom?.amenities?.map(
                                        (bathroomAmenity) => {
                                          return (
                                            <div
                                              // onClick={() =>
                                              //   handleItemClick(bathroomAmenity.id)
                                              // }
                                              key={bathroomAmenity.id}
                                              className="d-flex justify-content-center align-items-center py-2 py-lg-1 py-xl-2 px-4 px-lg-3 px-xl-4 rounded-4 my-2 mx-2"
                                              style={{
                                                width: "max-content",
                                                color: "black",
                                                backgroundColor: "#fdfdfd6e",
                                                border: "2px solid white",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <img
                                                src={
                                                  bathroomAmenity.file?.mediumPath
                                                    ? bathroomAmenity.file?.mediumPath
                                                    : defaultIcon
                                                }
                                                alt="icon"
                                                height={20}
                                                width="auto"
                                              />

                                              <h5 className="font-size-3 font-weight-normal ms-2 my-2 my-0">
                                                {bathroomAmenity.name}
                                              </h5>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })
                        ) : roomCat?.unitBathrooms &&
                          roomCat?.unitBathrooms.length <= 0 &&
                          !isIndividualUnitsAvailable ? (
                          <h2 className="font-size-6 font-weight-normal p-0 my-2">
                            Shared Bathroom
                          </h2>
                        ) : (
                          ""
                        )}
                      </Col>

                      {roomCat?.unitAmenities &&
                        roomCat?.unitAmenities.length > 0 && (
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={8}
                            xl={8}
                            xxl={8}
                            className="w-100 "
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                              Room Amenities
                            </h2>

                            {roomCat?.unitAmenities?.map((amenity) => {
                              return (
                                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                  {amenity?.amenity?.name}
                                </h2>
                              );
                            })}
                          </Col>
                        )}

                      {roomCat?.unitHighlights &&
                        roomCat?.unitHighlights.length > 0 && (
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={8}
                            xl={8}
                            xxl={8}
                            className="w-100 "
                          >
                            <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                              Highlights
                            </h2>

                            {roomCat?.unitHighlights?.map((highlights) => {
                              return (
                                <div
                                  // onClick={() => handleItemClick(item.id)}
                                  key={highlights.id}
                                  className="d-flex justify-content-center align-items-center py-1  px-3 rounded-4 my-2 mx-2"
                                  style={{
                                    width: "max-content",
                                    color: "black",
                                    backgroundColor: "#fdfdfd6e",
                                    border: "2px solid white",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img
                                    src={
                                      highlights.file
                                        ? highlights.file
                                        : defaultIcon
                                    }
                                    width="20px"
                                    alt="icon-img"
                                  />
                                  <h5 className="font-size-3 font-weight-normal ms-2 my-2 my-0">
                                    {highlights.name}
                                  </h5>
                                </div>
                              );
                            })}
                          </Col>
                        )}
                    </Row>
                    {isIndividualUnitsAvailable && <Divider />}

                    {isIndividualUnitsAvailable && (
                      <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
                        Price Details
                      </h2>
                    )}
                    {roomCat?.priceForMaxCount && (
                      <Row className="">
                        <Col
                          xs={15}
                          sm={17}
                          md={13}
                          lg={10}
                          xl={8}
                          xxl={7}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Daily price rate for maximin head count
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={8}
                          sm={6}
                          md={10}
                          lg={10}
                          xl={15}
                          xxl={16}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            {CurrencyEnum.USD +
                              " " +
                              roomCat?.priceForMaxCount.toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                          </h2>
                        </Col>
                      </Row>
                    )}
                    {isIndividualUnitsAvailable && (
                      <Row className="">
                        <Col
                          xs={15}
                          sm={17}
                          md={13}
                          lg={10}
                          xl={8}
                          xxl={7}
                          className="d-flex align-items-start"
                        >
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            Monthly price rate for maximin head count
                          </h2>
                        </Col>
                        <Col xs={1} className="d-flex align-items-start">
                          {" "}
                          <h2 className="font-size-6 font-weight-normal p-0">
                            :
                          </h2>
                        </Col>
                        <Col
                          xs={8}
                          sm={6}
                          md={10}
                          lg={10}
                          xl={15}
                          xxl={16}
                          className="d-flex flex-column flex-sm-row align-items-start"
                        >
                          {" "}
                          {roomCat?.monthlyRate ? (
                            <h2 className="font-size-6 font-weight-normal p-0">
                              {CurrencyEnum.USD +
                                " " +
                                roomCat?.monthlyRate.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                            </h2>
                          ) : (
                            <h2 className="font-size-6 font-weight-normal p-0">
                              {CurrencyEnum.USD + " " + 0.00}
                            </h2>
                          )}
                        </Col>
                      </Row>
                    )}
                    {isIndividualUnitsAvailable && roomCat?.unitRates && roomCat?.unitRates.length > 0 && roomCat?.unitRates.some(rate => rate.rate !== 0) ? (
                      <Row className="mt-4">
                        <Row className="w-100 mb-2">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <h5 className="font-size-4 font-weight-medium ">
                              Guest Count
                            </h5>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <h5 className="font-size-4 font-weight-medium ">
                              Price
                            </h5>
                          </Col>
                        </Row>

                        {roomCat?.unitRates?.map((rateList: any) => (
                          <Row className="w-100 d-flex align-items-center">
                            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                              <h5 className="font-size-4 font-weight-normal ">
                                <User size={25} className="me-2" /> X{" "}
                                {rateList.headCount}
                              </h5>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                              <h5 className="font-size-4 font-weight-medium ">
                                {rateList.rate} % off
                              </h5>
                            </Col>
                          </Row>
                        ))}
                      </Row>
                    ) : <Row><h2 className="font-size-6 font-weight-normal p-0 mt-2">Guest rates are not specified</h2></Row>}
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col> :
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100"><Empty
            description={
              <Typography.Text>No room added yet</Typography.Text>
            }
          /></Col>}
      </Row>
    </div>
  );
};

export default RoomDetailsTab;
