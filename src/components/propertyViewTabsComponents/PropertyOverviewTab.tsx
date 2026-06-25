import { Badge, Col, Divider, Row, Tag } from "antd";
import "../../styles/propertyListingStyles.scss";
import "../../styles/ical/icanPageStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MapPin, User } from "react-feather";
import { PropertyListingDetailDTO } from "../../common/dto/PropertyListingDetailDTO";
import parse from "html-react-parser";
import moment from "moment";
import { formatNamesCmnFun } from "../../common/commonFunctions";
import { PropertyStatusEnum } from "../../common/enums/propertyStatusEnum";
import { CurrencyEnum } from "../../common/enums/currencyEnum";
import defaultIcon from "../../assets/images/steps/defaultIcon02.png";
import GoogleMap02 from "../common/googleMap/GoogleMap02";
import { PropertyPolicy } from "../../common/interfaces/uiNecessaryInterface";
import defaultProfileImage from "../../assets/images/profileDefaultImg.jpg";


interface PropertyOverviewTabProps {
  propertyDetails: PropertyListingDetailDTO;
}
const PropertyOverviewTab: React.FC<PropertyOverviewTabProps> = ({
  propertyDetails,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [modalLoading, setModalLoading] = useState<boolean>(false);

  return (
    <div className="PropertyOverviewTabContainer w-100">
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100">
          <h2 className="font-size-2 font-weight-semi-bold p-0 my-2">
            {formatNamesCmnFun(
              propertyDetails?.name ? propertyDetails?.name : ""
            )}{" "}
            - {propertyDetails?.propertyType?.name}{" "}
            <Tag
              className="font-size-3 py-1 px-2 ms-2"
              color={
                propertyDetails?.status == PropertyStatusEnum.DRAFT
                  ? "#228bf5"
                  : propertyDetails?.status == PropertyStatusEnum.PENDING
                    ? "#531DAB"
                    : propertyDetails?.status == PropertyStatusEnum.PUBLISHED
                      ? "#52c41a"
                      : propertyDetails?.status == PropertyStatusEnum.UNPUBLISHED
                        ? "#fa8c16"
                        : propertyDetails?.status == PropertyStatusEnum.HOLD
                          ? "#faec16"
                          : propertyDetails?.status == PropertyStatusEnum.REJECTED
                            ? "#fa1616"
                            : ""
              }
            >
              {" "}
              {propertyDetails?.status}
            </Tag>
          </h2>
          <h2 className="font-size-4 font-weight-semi-bold p-0 my-2">
            {propertyDetails?.code}
          </h2>
          <h2 className="font-size-4 font-weight-normal p-0 my-2">
            <MapPin size={15} className="me-1" />
            {propertyDetails?.address + " " + propertyDetails?.city}{propertyDetails?.floor && " - " + propertyDetails?.floor}
          </h2>
          {propertyDetails?.postalCode && <h2 className="font-size-4 font-weight-normal p-0 my-2">
            Postal code :{" "}
            {propertyDetails?.postalCode}
          </h2>}
          <p className="font-size-6 font-weight-normal p-0 my-2">
            {parse(
              propertyDetails?.description ? propertyDetails?.description : ""
            )}
          </p>
          <ul>
            <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Host Plans :
                <span className="font-weight-semi-bold">
                  {" "}
                  {formatNamesCmnFun(propertyDetails?.plan?.name ?? "")}
                </span>
              </h2>
            </li>
            {propertyDetails?.otherParty && (
              <li>
                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                  Other parties in this site :
                  <span className="font-weight-semi-bold">
                    {" "}
                    {formatNamesCmnFun(
                      propertyDetails?.otherParty?.party
                        ? propertyDetails?.otherParty?.party
                        : ""
                    )}
                  </span>
                </h2>
              </li>
            )}
            {propertyDetails?.allowEntireProperty &&
              propertyDetails?.allowIndividualUnit && (
                <li>
                  <h2 className="font-size-6 font-weight-normal p-0 my-2">
                    Customers can book {propertyDetails?.name} as both entire
                    property and separate units
                  </h2>
                </li>
              )}
            {!propertyDetails?.allowEntireProperty &&
              propertyDetails?.allowIndividualUnit && (
                <li>
                  <h2 className="font-size-6 font-weight-normal p-0 my-2">
                    Customers can book {propertyDetails?.name} as separate units
                  </h2>
                </li>
              )}
            {propertyDetails?.allowEntireProperty &&
              !propertyDetails?.allowIndividualUnit && (
                <li>
                  <h2 className="font-size-6 font-weight-normal p-0 my-2">
                    Customers can book {propertyDetails?.name} as entire
                    property
                  </h2>
                </li>
              )}
            <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Maximin Head Count :
                <span className="font-weight-semi-bold">
                  {" "}
                  {propertyDetails?.entirePropertyPrices?.maxHeadCount}
                </span>
              </h2>
            </li>
            {propertyDetails?.allowEntireProperty && (
              <li>
                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                  Minimum Booking Days :
                  <span className="font-weight-semi-bold">
                    {" "}
                    {propertyDetails?.entirePropertyPrices?.minBookingDays}
                  </span>
                </h2>
              </li>
            )}
            <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Instance booking is{" "}
                {propertyDetails?.allowIndividualUnit ? "allow" : "not allow"}{" "}
                in {propertyDetails?.name}
              </h2>
            </li>
            <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Pay at property is{" "}
                {propertyDetails?.payAtProperty ? "allow" : "not allow"} in{" "}
                {propertyDetails?.name}
              </h2>
            </li>
            <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">


                {propertyDetails?.invoiceHeadingType === "USER_INFO" ? "User information" : propertyDetails?.invoiceHeadingType === "PROPERTY_INFO" ? "Property information" : ""}  appear on the invoice
              </h2>
            </li>
            {propertyDetails?.newListingDiscount! > 0 && <li>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                {formatNamesCmnFun(propertyDetails?.name || "")} has {propertyDetails?.newListingDiscount}% new listing discount. This allows only first 3 bookings only. This discount automatically removed after the first 3 bookings.
              </h2>
            </li>}
          </ul>
        </Col>
      </Row>
      <Divider />
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={6} className="w-100">

          <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
            Host By
          </h2>
          {propertyDetails?.host ? <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
            {" "}
            <img
              src={
                propertyDetails?.host?.file?.smallPath
                  ? propertyDetails?.host?.file?.smallPath
                  : defaultProfileImage
              }
              alt="cusImg"
              height={40}
              width={40}
              style={{ objectFit: "cover" }}
              className="my-1 ms-2 me-3 rounded-5"
            />{" "}
            <div className="d-flex flex-column justify-content-center">
              <h2 className="m-0 p-0 font-size-4 font-weight-normal">
                {`${propertyDetails?.host?.firstName ?? ""} ${propertyDetails?.host?.lastName ?? ""}`.trim()}
              </h2>
              <h2 className="m-0 mt-1 p-0 font-size-4 font-weight-normal">
                {propertyDetails?.host?.countryCode &&
                  propertyDetails?.host?.contactNo &&
                  propertyDetails?.host?.countryCode +
                  " " +
                  propertyDetails?.host?.contactNo}
              </h2>

            </div>
          </h5> :
            <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
              <h2 className="m-0 p-0 font-size-4 font-weight-normal">
                Not mention
              </h2>
            </h5>}
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={6} className="w-100 mt-3 mt-md-0">

          <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
            Owned By
          </h2>
          {propertyDetails?.propertyOwner ? <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
            {" "}
            <img
              src={
                propertyDetails?.propertyOwner?.file?.smallPath
                  ? propertyDetails?.propertyOwner?.file?.smallPath
                  : defaultProfileImage
              }
              alt="cusImg"
              height={40}
              width={40}
              style={{ objectFit: "cover" }}
              className="my-1 ms-2 me-3 rounded-5"
            />{" "}
            <div className="d-flex flex-column justify-content-center">
              <h2 className="m-0 p-0 font-size-4 font-weight-normal">
                {`${propertyDetails?.propertyOwner?.firstName ?? ""} ${propertyDetails?.propertyOwner?.lastName ?? ""}`.trim()}
              </h2>
              <h2 className="m-0 mt-1 p-0 font-size-4 font-weight-normal">
                {propertyDetails?.propertyOwner?.countryCode &&
                  propertyDetails?.propertyOwner?.contactNo &&
                  propertyDetails?.propertyOwner?.countryCode +
                  " " +
                  propertyDetails?.propertyOwner?.contactNo}
              </h2>

            </div>
          </h5> :
            <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
              <h2 className="m-0 p-0 font-size-4 font-weight-normal">
                Not mention
              </h2>
            </h5>}


        </Col>
      </Row>
      <Divider />
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14} className="w-100">
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} className="w-100">
              <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
                Other Details
              </h2>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Checkin at {propertyDetails?.checkIn}
              </h2>
              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                Checkout at {propertyDetails?.checkOut}
              </h2>
              {propertyDetails?.hasBreakfast && (
                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                  {propertyDetails?.name} has breakfast
                </h2>
              )}
              {propertyDetails?.parkingFacility && (
                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                  {propertyDetails?.name} has{" "}
                  {formatNamesCmnFun(propertyDetails?.parkingFacility?.type)}{" "}
                  parking facility.
                </h2>
              )}
              {propertyDetails?.propertyLanguages &&
                propertyDetails?.propertyLanguages?.length > 0 && (
                  <h2 className="font-size-6 font-weight-normal p-0 my-2">
                    Languages
                    <ul className="mt-2">
                      {propertyDetails?.propertyLanguages.map((lan) => {
                        return (
                          <li className="my-1">{formatNamesCmnFun(lan?.name)}</li>
                        );
                      })}
                    </ul>
                  </h2>
                )}
            </Col>
            {propertyDetails?.sharedBathrooms &&
              propertyDetails?.sharedBathrooms.length > 0 && (
                <Col
                  xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} className="w-100 my-3 my-lg-0 "
                >
                  <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
                    Bathroom Details
                  </h2>
                  {propertyDetails?.sharedBathrooms &&
                    propertyDetails?.sharedBathrooms.length > 0 &&
                    propertyDetails?.sharedBathrooms?.map((bathroom) => {
                      return (
                        <div>
                          <h2 className="font-size-6 font-weight-normal p-0 my-2">
                            {bathroom?.bathroomType?.name} - {bathroom?.count}
                          </h2>
                          {bathroom?.amenities &&
                            bathroom?.amenities.length > 0 && (
                              <div>
                                <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                  Bathroom amenities
                                </h2>
                                {bathroom?.amenities?.map((bathroomAmenity) => {
                                  return (
                                    <div
                                      key={bathroomAmenity.id}
                                      className="d-flex justify-content-center align-items-center rounded-4 m-2 "
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
                                          bathroomAmenity.file?.smallPath
                                            ? bathroomAmenity.file?.smallPath
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
                                })}
                              </div>
                            )}
                        </div>
                      );
                    })}
                </Col>
              )}

          </Row>

        </Col>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10} className="w-100">
          {propertyDetails?.lng && propertyDetails?.lat && (
            <GoogleMap02
              propertyLocation={{
                lat: propertyDetails?.lat,
                lng: propertyDetails?.lng,
              }}
              propertyName={propertyDetails?.name ? propertyDetails?.name : ""}
            />
          )}
        </Col>
      </Row>
      <Row>
        {propertyDetails?.propertyAmenities &&
          propertyDetails?.propertyAmenities.length > 0 && (

            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100 mt-3 mt-lg-0  ">
              <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
                Amenity Details
              </h2>

              {propertyDetails?.propertyAmenities &&
                propertyDetails?.propertyAmenities.length > 0 && (
                  <Row>
                    {propertyDetails.propertyAmenities.map((amenities) => (
                      <Col
                        key={amenities.id}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={6}
                        xxl={6}
                      >
                        <div
                          key={amenities.id}
                          className="d-flex justify-content-center align-items-center rounded-4"
                          style={{
                            width: "max-content",
                            color: "black",
                            backgroundColor: "#fdfdfd6e",
                            border: "2px solid white",
                            // cursor: "pointer",
                          }}
                        >
                          <img
                            src={
                              amenities?.amenity?.file?.smallPath
                                ? amenities?.amenity?.file?.smallPath
                                : defaultIcon
                            }
                            alt="icon"
                            height={20}
                            width="auto"
                          />

                          <h5 className="font-size-4 font-weight-normal ms-2 my-2 my-0 ">
                            {amenities?.amenity?.name}
                          </h5>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
            </Col>

          )}
      </Row>
      <Row className="mt-3">
        {propertyDetails?.propertyHighlights &&
          propertyDetails?.propertyHighlights.length > 0 && (

            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100 mt-3 mt-lg-0  ">
              <h2 className="font-size-3 font-weight-semi-bold p-0 my-2">
                Highlights
              </h2>

              {propertyDetails?.propertyHighlights &&
                propertyDetails?.propertyHighlights.length > 0 && (
                  <Row>
                    {propertyDetails.propertyHighlights.map((highlight) => (
                      <Col
                        key={highlight.id}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={6}
                        xxl={6}
                      >
                        <div
                          key={highlight.id}
                          className="d-flex justify-content-center align-items-center rounded-4"
                          style={{
                            width: "max-content",
                            color: "black",
                            backgroundColor: "#fdfdfd6e",
                            border: "2px solid white",
                            // cursor: "pointer",
                          }}
                        >
                          <img
                            src={
                              highlight?.file?.smallPath
                                ? highlight?.file?.smallPath
                                : defaultIcon
                            }
                            alt="icon"
                            height={20}
                            width="auto"
                          />

                          <h5 className="font-size-4 font-weight-normal ms-2 my-2 my-0 ">
                            {highlight?.name}
                          </h5>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
            </Col>

          )}
      </Row>
      {/* {(propertyDetails?.sharedBathrooms &&
        propertyDetails?.sharedBathrooms.length > 0) ||
        (propertyDetails?.propertyAmenities &&
          propertyDetails?.propertyAmenities.length > 0 && <Divider />)} */}

      {propertyDetails?.propertyPolicies && <Divider />}
      {propertyDetails?.propertyPolicies && <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100">
          <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
            Policy Questions
          </h2>
          {propertyDetails?.propertyPolicies && propertyDetails?.propertyPolicies.map((policy: PropertyPolicy) => {
            return <Row className="">
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
                  {policy?.question?.question}
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  {policy?.question?.answers?.label}
                </h2>
              </Col>
            </Row>
          }
          )}

        </Col>
      </Row>}
      <Divider />
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100">
          <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
            Cancellation Policies
          </h2>
          {propertyDetails?.cancellationPolicies?.longCancellationPolicy && (
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
                  Long Term cancellation policy
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  <span className="font-weight-semi-bold">
                    {
                      propertyDetails?.cancellationPolicies
                        ?.longCancellationPolicy?.name
                    }
                  </span>{" "}
                  -{" "}
                  {
                    propertyDetails?.cancellationPolicies
                      ?.longCancellationPolicy?.description
                  }
                </h2>
              </Col>
            </Row>
          )}
          {propertyDetails?.cancellationPolicies?.longCancellationPolicy && (
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
                  Long Term security fee
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  {CurrencyEnum.USD +
                    " " +
                    propertyDetails?.cancellationPolicies?.longTermSecurity.toLocaleString(
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
          {propertyDetails?.cancellationPolicies?.shortCancellationPolicyId && (
            <Row className="mt-3">
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
                  Short Term cancellation policy
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  <span className="font-weight-semi-bold">
                    {
                      propertyDetails?.cancellationPolicies
                        ?.shortCancellationPolicyId?.name
                    }
                  </span>{" "}
                  -{" "}
                  {
                    propertyDetails?.cancellationPolicies
                      ?.shortCancellationPolicyId?.description
                  }
                </h2>
              </Col>
            </Row>
          )}
          {propertyDetails?.cancellationPolicies?.shortCancellationPolicyId && (
            <Row>
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
                  Short Term security fee
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  {CurrencyEnum.USD +
                    " " +
                    propertyDetails?.cancellationPolicies?.shortTermSecurity.toLocaleString(
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
          <h2 className="font-size-6 font-weight-normal p-0 mt-3">
            {propertyDetails?.cancellationPolicies?.isRefundAvailable
              ? "Non refundable policy applied"
              : "Non refundable policy not applied"}
          </h2>
          {propertyDetails?.cancellationPolicies?.isRefundAvailable && (
            <Row>
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
                  Non refundable rate
                </h2>
              </Col>
              <Col xs={1} className="d-flex align-items-start">
                {" "}
                <h2 className="font-size-6 font-weight-normal p-0">:</h2>
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
                  {
                    propertyDetails?.cancellationPolicies?.nrpRate}%
                </h2>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      {propertyDetails?.allowEntireProperty && <Divider />}
      {propertyDetails?.allowEntireProperty && (
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
            <h2 className="font-size-3 font-weight-semi-bold p-0 mt-2 mb-3">
              Entire Property Price Details
            </h2>
            {propertyDetails?.allowEntireProperty &&
              propertyDetails?.priceForEntireProperty && (
                <Row className="">
                  <Col
                    xs={15}
                    sm={14}
                    md={10}
                    lg={7}
                    xl={7}
                    xxl={7}
                    className="d-flex align-items-start"
                  >
                    {" "}
                    <h2 className="font-size-6 font-weight-normal p-0">
                      Daily price rate for entire property
                    </h2>
                  </Col>
                  <Col xs={1} className="d-flex align-items-start">
                    {" "}
                    <h2 className="font-size-6 font-weight-normal p-0">:</h2>
                  </Col>
                  <Col
                    xs={8}
                    sm={9}
                    md={13}
                    lg={16}
                    xl={16}
                    xxl={16}
                    className="d-flex flex-column flex-sm-row align-items-start"
                  >
                    {" "}
                    <h2 className="font-size-6 font-weight-normal p-0">
                      {CurrencyEnum.USD +
                        " " +
                        propertyDetails?.priceForEntireProperty.toLocaleString(
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

            {propertyDetails?.allowEntireProperty && (
              <Row className="">
                <Col
                  xs={15}
                  sm={14}
                  md={10}
                  lg={7}
                  xl={7}
                  xxl={7}
                  className="d-flex align-items-start"
                >
                  {" "}
                  <h2 className="font-size-6 font-weight-normal p-0">
                    Monthly price rate for entire property
                  </h2>
                </Col>
                <Col xs={1} className="d-flex align-items-start">
                  {" "}
                  <h2 className="font-size-6 font-weight-normal p-0">:</h2>
                </Col>
                <Col
                  xs={8}
                  sm={9}
                  md={13}
                  lg={16}
                  xl={16}
                  xxl={16}
                  className="d-flex flex-column flex-sm-row align-items-start"
                >
                  {" "}
                  {propertyDetails?.monthlyRate ? (
                    <h2 className="font-size-6 font-weight-normal p-0">
                      {CurrencyEnum.USD +
                        " " +
                        propertyDetails?.monthlyRate.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </h2>
                  ) : (
                    <h2 className="font-size-6 font-weight-normal p-0">
                      Not Specified
                    </h2>
                  )}
                </Col>
              </Row>
            )}
            <h2 className="font-size-3 font-weight-semi-bold p-0 mt-4 mb-2">
              Rate Plans
            </h2>
            {propertyDetails?.entirePropertyPrices?.rates && propertyDetails?.entirePropertyPrices?.rates.length > 0 && propertyDetails.entirePropertyPrices.rates.some(rate => rate.rate !== 0) ?
              <Row className="mt-4">
                <Row className="w-100 mb-2">
                  <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <h5 className="font-size-4 font-weight-medium ">
                      Guest Count
                    </h5>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <h5 className="font-size-4 font-weight-medium ">Price</h5>
                  </Col>
                </Row>

                {propertyDetails?.entirePropertyPrices?.rates &&
                  propertyDetails?.entirePropertyPrices?.rates.length > 0 && propertyDetails.entirePropertyPrices.rates.some(rate => rate.rate !== 0) &&
                  propertyDetails?.entirePropertyPrices?.rates.map(
                    (rateList: any) => (
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
                    )
                  )}
              </Row> : <Row className="w-100 mb-2">
                <h2 className="font-size-6 font-weight-normal p-0 mt-2">Guest rates are not specified</h2>
              </Row>}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PropertyOverviewTab;
