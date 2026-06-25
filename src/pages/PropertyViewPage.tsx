import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import "../styles/propertyView/propertyView.scss";
import "../styles/commonStyles.scss";
import { Button, Col, Image, Row, Tabs, TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, MapPin } from "react-feather";
import { useEffect, useState } from "react";
import {
  formatNamesCmnFun,
  getLastPathSegment,
  handleError,
  popUploader,
} from "../common/commonFunctions";
import { useDispatch } from "react-redux";
import { getPropertyById } from "../service/propertyListingService";
import { PropertyListingDetailDTO } from "../common/dto/PropertyListingDetailDTO";
import ImagePreviewModal from "../components/common/modal/ImagePreviewModal";
import PropertyOverviewTab from "../components/propertyViewTabsComponents/PropertyOverviewTab";
import RoomDetailsTab from "../components/propertyViewTabsComponents/RoomDetailsTab";
import MainLayout from "../layout/MainLayout";

const PropertyViewPage = ({ }) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [navigateLocation, setNavigateLocation] = useState<string>();
  const [propertyId, setPropertyId] = useState<number>();
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imagesList, setImagesList] = useState<string[]>();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const currentURL = window.location.pathname;
    const propertyId = parseInt(getLastPathSegment(currentURL));
    setPropertyId(propertyId);
    loadPropertyDetailsPropertyId(propertyId);
    const fromLocation = localStorage.getItem("fromLocation");
    setNavigateLocation(fromLocation);
  }, []);

  const loadPropertyDetailsPropertyId = (propertyId: number) => {
    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          setPropertyDetailsObject(dataObj);

          const images = dataObj?.propertyImages || [];

          const coverImage = images.find((img) => img.isCover)?.file?.largePath;
          const otherImages = images
            .filter((img) => !img.isCover)
            .map((img) => img.file?.largePath);

          const imageList = coverImage
            ? [coverImage, ...otherImages]
            : otherImages;
          setImagesList(imageList);

          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const handleOpenPreview = () => setIsPreviewOpen(true);
  const handleClosePreview = () => setIsPreviewOpen(false);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Overview",
      children: <PropertyOverviewTab propertyDetails={propertyDetailsObject ?? {}} />,
    },
    {
      key: "2",
      label: "Rooms",
      children: (
        <RoomDetailsTab
          roomDetails={propertyDetailsObject?.unitDetails ?? []}
          isIndividualUnitsAvailable={
            propertyDetailsObject?.allowIndividualUnit
          }
        />
      ),
    },
  ];

  return (
    <>

      {imagesList?.length && imagesList?.length > 0 && (
        <ImagePreviewModal
          open={isPreviewOpen}
          onClose={handleClosePreview}
          images={imagesList}
          title={propertyDetailsObject?.name ?? ""}
        />
      )}

      <MainLayout pageName="whitePage">
        <main className="propertyViewPageContainer">
          <div className="d-flex justify-content-center align-item-center w-100 f-view">
            <Row className="innerF-view d-flex flex-column">
              <div className="d-flex justify-content-between mt-4">
                <Button
                  onClick={() => {
                    navigateLocation === "reservation"
                      ? history(`/reservation-manage`)
                      : navigateLocation === "earnings"
                        ? history(`/earnings-manage`)
                        : navigateLocation === "propertyList"
                          ? history(`/listed-properties`)
                          : "";
                  }}
                  size="large"
                  type="default"
                  className="rounded-circle px-2 mb-3"
                  style={{ height: 40, width: 40 }}
                >
                  <ArrowLeft size={20} className="mx-1" />
                </Button>

                {propertyDetailsObject && !propertyDetailsObject?.isOnlyPropertyOwner && <Button
                  onClick={() => {
                    history(`/main/finish/${propertyId}`);
                  }}
                  size="large"
                  type="primary"
                  className="px-3 mb-3 rounded-3"
                >
                  Edit Property
                </Button>}
              </div>

              {imagesList?.length > 0 && (
                <Row className="w-100 position-relative ">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="w-100"
                  >
                    {" "}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        minWidth: "100%",
                        maxHeight: "600px",
                        overflow: "hidden",
                        borderRadius: "20px",
                      }}
                    >
                      {/* Main Image - No Preview */}
                      <Image
                        preview={false}
                        src={imagesList[0]}
                        width="100%"
                        height="600px"
                        style={{
                          // width: "100%",
                          minWidth: "100%",
                          // height: "600px",
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: "20px",
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(2, 2, 2, 0.75) 82.69%)",
                          pointerEvents: "none",
                          borderRadius: "20px",
                        }}
                      />

                    </div>
                  </Col>
                  <Row
                    className="w-100 position-absolute ps-4 ps-sm-5 text-white"
                    style={{ bottom: 40 }}
                  >
                    <Col xs={24} sm={24} md={10} lg={10} xl={10} xxl={10}>
                      <h2 className="mt-2 font-size-1 font-weight-bold">
                        {formatNamesCmnFun(propertyDetailsObject?.name || "")}
                      </h2>
                      <h2 className="mt-2 font-size-3 font-weight-semi-bold">
                        {propertyDetailsObject?.code}
                      </h2>
                      <p className="m-0 font-size-3">
                        <MapPin />{" "}
                        {propertyDetailsObject?.address +
                          " " +
                          propertyDetailsObject?.city}
                      </p>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={13}
                      xl={13}
                      xxl={13}
                      className="imageList"
                    >
                      <div
                        style={{
                          display: "flex",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255, 255, 255, 1)",
                          borderRadius: 20,
                          padding: 10,
                          gap: 10,
                          alignItems: "center",
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          zIndex: 2,
                        }}
                      >
                        <img
                          src={imagesList[1]}
                          alt="main"
                          style={{
                            width: 300,
                            height: 180,
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: 10,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <img
                            src={imagesList[2]}
                            alt="small-1"
                            className="mb-5"
                            style={{
                              width: 120,
                              height: 130,
                              objectFit: "cover",
                              objectPosition: "center",
                              borderRadius: 10,
                            }}
                          />
                        </div>

                        {/* See More Button */}
                        <Button
                          type="primary"
                          onClick={handleOpenPreview}
                          style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            padding: "6px 12px",
                          }}
                        >
                          <Eye size={16} /> See More
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Row>
              )}
              {imagesList?.length > 0 && (
                <Row
                  className="d-flex justify-content-center justify-content-md-start w-100 mt-3 responsiveImageList"
                  style={{
                    borderRadius: 20,
                    gap: 10,
                    minHeight: 100,
                    maxHeight: 200,
                  }}
                >
                  <Col xs={11} sm={5} md={5} lg={6} xl={6} xxl={6}>
                    {" "}
                    <img
                      src={imagesList[1]}
                      alt="main"
                      style={{
                        width: "100%",
                        maxHeight: 100,
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 10,
                      }}
                    />
                  </Col>
                  <Col
                    xs={11}
                    sm={5}
                    md={5}
                    lg={6}
                    xl={6}
                    xxl={6}
                    className="ps-2"
                  >
                    {" "}
                    <img
                      src={imagesList[2]}
                      alt="small-1"
                      style={{
                        width: "100%",
                        maxHeight: 100,
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 10,
                      }}
                    />
                  </Col>
                  <Col
                    xs={11}
                    sm={5}
                    md={5}
                    lg={6}
                    xl={6}
                    xxl={6}
                    className="h-100 ps-0 ps-sm-2"
                  >
                    <img
                      src={imagesList[3]}
                      alt="small-1"
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: 100,
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 10,
                      }}
                    />
                  </Col>
                  <Col
                    xs={11}
                    sm={5}
                    md={5}
                    lg={6}
                    xl={6}
                    xxl={6}
                    className="h-100 ps-2 "
                  >
                    {" "}
                    {/* See More div */}
                    <div
                      className="border border-dark d-flex justify-content-center align-items-center h-100"
                      onClick={handleOpenPreview}
                      style={{
                        width: "100%",
                        maxHeight: 100,
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 10,
                      }}
                    >
                      <h3 className="font-size-6">
                        {" "}
                        <Eye size={16} /> See More
                      </h3>
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="mt-3 w-100">
                <Tabs
                  activeKey={activeTab}
                  destroyInactiveTabPane
                  items={items}
                  onChange={(key) => setActiveTab(key)}
                  className="m-0 w-100"
                />
              </Row>
            </Row>
          </div>
        </main>
      </MainLayout>

    </>
  );
};

export default PropertyViewPage;
