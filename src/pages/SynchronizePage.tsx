import { Card, Col, Row, Tabs, TabsProps } from "antd";
import "../styles/listning/listningStyles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getLastPathSegment,
  handleError,
  popUploader,
  truncateDescriptions,
} from "../common/commonFunctions";
import NavBar from "../components/NavBar";
import moment from "moment";
import {
  DropdownObjTwo,
  IcalPropertyDetailsObj,
} from "../common/interfaces/uiNecessaryInterface";
import EntirePropertyTab from "../components/icalTabComponents/EntirePropertyTab";
import { getAllIcalDetailsByPropertyId } from "../service/icalService";
import DefaultCardImage from "../assets/images/DefaultCardImage.png";
import defaultProfileImage from "../assets/images/profileDefaultImg.jpg";
import parse from "html-react-parser";
import IndividualUnitsTab from "../components/icalTabComponents/IndividualUnitsTab";

const SynchronizePage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [icalPropertyDetailsObject, setIcalPropertyDetailsObject] =
    useState<IcalPropertyDetailsObj>();

  const [selectedPropertyId, setSelectedPropertyId] = useState<number>();
  const [activeTab, setActiveTab] = useState("1");

  // useEffect(() => {
  //   const { state } = location;
  //   if (state && state.propertyId) {
  //     const { propertyId } = state;
  //     console.log(propertyId);
  //     setSelectedPropertyId(propertyId);
  //     loadIcalDetailsPropertyId(propertyId);
  //   }
  // }, [location]);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const propertyId = parseInt(getLastPathSegment(currentURL));
    setSelectedPropertyId(propertyId);
    loadIcalDetailsPropertyId(propertyId);
  }, []);

  const loadIcalDetailsPropertyId = (propertyId: number) => {
    if (propertyId) {
      popUploader(dispatch, true);
      getAllIcalDetailsByPropertyId(propertyId)
        .then((resp) => {
          const dataObj: IcalPropertyDetailsObj = resp?.data;
          setIcalPropertyDetailsObject(dataObj);
          !dataObj?.property?.allowEntireProperty &&
            dataObj?.property?.allowIndividualUnit &&
            setActiveTab("2");
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const items: TabsProps["items"] = [
    icalPropertyDetailsObject?.property?.allowEntireProperty && {
      key: "1",
      label: `${icalPropertyDetailsObject?.property?.allowEntireProperty &&
        icalPropertyDetailsObject?.property?.allowIndividualUnit
        ? "Entire Property"
        : ""
        // "Entire Property"
        }`,
      children: (
        <EntirePropertyTab
          icalDetails={
            icalPropertyDetailsObject?.icalendars
              ? icalPropertyDetailsObject?.icalendars
              : []
          }
          propertyDetails={icalPropertyDetailsObject?.property}
          loadIcalDetails={() => {
            loadIcalDetailsPropertyId(selectedPropertyId);
          }}
        />
      ),
    },
    icalPropertyDetailsObject?.property?.allowIndividualUnit && {
      key: "2",
      label: `${icalPropertyDetailsObject?.property?.allowEntireProperty &&
        icalPropertyDetailsObject?.property?.allowIndividualUnit
        ? "Individual Units"
        : ""
        // "Individual Units"
        }`,
      children: (
        <IndividualUnitsTab
          individualUnitsIcalDetails={
            icalPropertyDetailsObject?.accommodationUnits
              ? icalPropertyDetailsObject?.accommodationUnits
              : []
          }
          propertyDetails={icalPropertyDetailsObject?.property}
          loadIcalDetails={() => {
            loadIcalDetailsPropertyId(selectedPropertyId);
          }}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <NavBar pageName="filterArea" />
      <div className="d-flex justify-content-center align-item-center listingMainPage w-100">
        <div className="listingMainPage_inner ">
          <Row className="w-100 ">
            <h1 className="m-0 fourth_topic text-gray-secondary">
              Synchronize ical Links
            </h1>
          </Row>

          <Row className="w-100">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="mt-4"
            >
              <Card
                bordered={false}
                className="w-100"
                style={{
                  backgroundColor: "#E7F4FF",
                  border: "1px solid #87B4D7",
                }}
              >
                <Row className="w-100 d-flex justify-content-center">
                  <Col xs={24} sm={15} md={9} lg={7} xl={6} xxl={6}>
                    <img
                      src={
                        icalPropertyDetailsObject?.property?.file
                          ? icalPropertyDetailsObject?.property?.file
                            ?.mediumPath
                          : DefaultCardImage
                      }
                      width="100%"
                      height="140px "
                      style={{ height: "100%", maxHeight: "140px " }}
                      className="propertyViewCardImg rounded-3 object-fit-cover "
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={15}
                    lg={17}
                    xl={18}
                    xxl={18}
                    className="ps-0 ps-md-4 pt-4 pt-md-0"
                  >
                    <h2 className="font-size-3 font-weight-medium p-0 my-1">
                      {icalPropertyDetailsObject?.property && icalPropertyDetailsObject?.property?.name + " - " + icalPropertyDetailsObject?.property?.propertyType}
                    </h2>
                    <h2 className="font-size-5 font-weight-medium p-0 my-1">
                      {icalPropertyDetailsObject?.property?.code}
                    </h2>
                    <h2 className="font-size-5 font-weight-normal p-0 my-2">
                      {icalPropertyDetailsObject?.property?.address + ", " + icalPropertyDetailsObject?.property?.city}{icalPropertyDetailsObject?.property?.floor && " - " + icalPropertyDetailsObject?.property?.floor}
                    </h2>
                    {/* {icalPropertyDetailsObject?.property?.postalCode && <h2 className="font-size-5 font-weight-normal p-0 my-2">
                      Postal code : {" "}{icalPropertyDetailsObject?.property?.postalCode}
                    </h2>} */}

                    {icalPropertyDetailsObject?.property?.allowEntireProperty &&
                      icalPropertyDetailsObject?.property?.allowIndividualUnit && (
                        <li>
                          <h2 className="font-size-5 font-weight-normal p-0 my-2">
                            Customers can book {icalPropertyDetailsObject?.property?.name} as both entire
                            property and separate units
                          </h2>
                        </li>
                      )}
                    {!icalPropertyDetailsObject?.property?.allowEntireProperty &&
                      icalPropertyDetailsObject?.property?.allowIndividualUnit && (
                        <li>
                          <h2 className="font-size-5 font-weight-normal p-0 my-2">
                            Customers can book {icalPropertyDetailsObject?.property?.name} as separate units
                          </h2>
                        </li>
                      )}
                    {icalPropertyDetailsObject?.property?.allowEntireProperty &&
                      !icalPropertyDetailsObject?.property?.allowIndividualUnit && (
                        <li>
                          <h2 className="font-size-5 font-weight-normal p-0 my-2">
                            Customers can book {icalPropertyDetailsObject?.property?.name} as entire
                            property
                          </h2>
                        </li>
                      )}
                    {/* <h2 className="font-size-5 font-weight-normal p-0 my-1">
                      Reservation Plan :{" "}
                      {formatNamesCmnFun(
                      icalPropertyDetailsObject?.property?.
                        ? icalPropertyDetailsObject?.property?.plan?.name
                        : ""
                    )}
                    </h2> */}

                    {icalPropertyDetailsObject?.property?.propertyOwner ? <h5 className="font-size-5 ont-weight-normal p-0 my-1 d-flex align-items-center">
                      Property Ownership :{" "}
                      <img
                        src={
                          icalPropertyDetailsObject?.property?.propertyOwner?.file?.smallPath
                            ? icalPropertyDetailsObject?.property?.propertyOwner?.file?.smallPath
                            : defaultProfileImage
                        }
                        alt="cusImg"
                        height={35}
                        width={35}
                        style={{ objectFit: "cover" }}
                        className="ms-2 me-1 my-1 rounded-5"
                      />{" "}
                      <div className="d-flex flex-column justify-content-center">
                        <h2 className="font-size-5 font-weight-medium p-0 m-0">
                          {`${icalPropertyDetailsObject?.property?.propertyOwner?.firstName ?? ""} ${icalPropertyDetailsObject?.property?.propertyOwner?.lastName ?? ""}`.trim()}
                        </h2>
                        <h2 className="font-size-5 font-weight-medium p-0 m-0 mt-1">
                          {icalPropertyDetailsObject?.property?.propertyOwner?.countryCode &&
                            icalPropertyDetailsObject?.property?.propertyOwner?.contactNo &&
                            icalPropertyDetailsObject?.property?.propertyOwner?.countryCode +
                            " " +
                            icalPropertyDetailsObject?.property?.propertyOwner?.contactNo}
                        </h2>

                      </div>
                    </h5> : <h5 className="d-flex my-1 p-0 font-size-5 ont-weight-normal">
                      <h2 className="m-0 p-0 font-size-5 font-weight-medium">
                        Property Ownership : Not mention
                      </h2>
                    </h5>}
                    {/* <h2 className="font-size-5 font-weight-normal p-0 my-1 mt-3">
                      {parse(
                        truncateDescriptions(
                          icalPropertyDetailsObject?.property?.description ||
                          "",
                          120
                        )
                      )}
                    </h2> */}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="mt-4"
            >
              <Tabs
                activeKey={activeTab}
                destroyInactiveTabPane
                items={items}
                onChange={(key) => setActiveTab(key)}
                className="m-0 w-100"
              />
            </Col>
          </Row>

          <Row className="w-100">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              xxl={12}
              className="mt-4 pe-0 pe-lg-2"
            >
              <Card
                bordered={false}
                className="w-100 h-100"
                style={{
                  backgroundColor: "#EF5A601F",
                }}
              >
                <Row className="w-100 d-flex justify-content-center">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <h2 className="font-size-3 font-weight-medium p-0 my-1 primary-color">
                      What is iCal Synchronization?
                    </h2>
                    <h2 className="font-size-5 font-weight-normal p-0 mt-3">
                      iCal synchronization is a powerful feature that helps
                      property owners manage their bookings across multiple
                      platforms efficiently. By using iCal (short for iCalendar)
                      links, you can automatically sync your property’s
                      availability across websites like Airbnb, Booking.com, and
                      Agoda.
                    </h2>
                    <h2 className="font-size-5 font-weight-normal p-0 mt-3">
                      When you update your calendar on one platform, the changes
                      are reflected across all synchronized platforms, ensuring
                      that your availability remains accurate and up to date.
                      This prevents the risk of double bookings, improves
                      operational efficiency, and provides a seamless experience
                      for both hosts and guests.
                    </h2>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              xxl={12}
              className="mt-4 ps-0 ps-lg-2"
            >
              <Card
                bordered={false}
                className="w-100 h-100"
                style={{
                  backgroundColor: "#EF5A601F",
                }}
              >
                <Row className="w-100 d-flex justify-content-center">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <h2 className="font-size-3 font-weight-medium p-0 my-1 primary-color">
                      Key Benefits of iCal Synchronization
                    </h2>
                    <ul className="font-size-5 font-weight-normal p-0 mt-3 ms-3">
                      <li>
                        Avoid Double Bookings: Keep your calendar consistent
                        across multiple booking channels.
                      </li>
                      <li>
                        Time-Saving Automation: Eliminate the need for manual
                        updates and reduce administrative workload.
                      </li>
                      <li>
                        Better Guest Experience: Ensure potential guests always
                        see accurate availability and avoid disappointments.
                      </li>
                      <li>
                        Multi-Platform Integration: Compatible with most major
                        booking sites, making it easier to manage your listings
                        in one place.
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default SynchronizePage;
