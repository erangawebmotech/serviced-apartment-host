import { Button, Col, Divider, Row } from "antd";
import React, { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import "../../../styles/propertyListingStyles.scss";
import { useNavigate } from "react-router-dom";
import {
  formatNamesCmnFun,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService.ts";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import { useDispatch, useSelector } from "react-redux";
import CommonImageList from "./seperateImageList/CommonImageList.tsx";
import DynamicSpecialAreaList from "./seperateImageList/DynamicSpecialAreaList.tsx";
import DynamicUnitImageList from "./seperateImageList/DynamicUnitImageList.tsx";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum.ts";
import {
  propertyImage,
  PropertyImagesRapterObj,
} from "../../../common/interfaces/uiNecessaryInterface.ts";

interface propertyImageDetails {
  areaId: string | number;
  imageDetails: {
    imageId: number;
    isCover: boolean;
    altText: string | null;
  }[];
}

type TransformedItem = {
  fileId: number;
  isCover: boolean;
  altTag: string | null;
};

const StepGuestHouseImages = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [propertyImagesRapter, setPropertyImagesRapter] = useState<
    PropertyImagesRapterObj[]
  >([]);
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyListingDetailDTO>([]);
  const [areaImages, setAreaImages] = useState([]);
  const [unitImages, setUnitImages] = useState([]);
  const [propertyImagesData, setPropertyImagesData] = useState<any>([]);
  const [commonPropertyImagesData, setCommonPropertyImagesData] = useState<any>([]);
  const [propertyImagesDataInit, setPropertyImagesDataInit] = useState<
    propertyImage[]
  >([]);
  const [initSpecialAreas, setInitSpecialAreas] = useState([]);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    setIsDisableBtns(true);
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

  // const handleChildData = (data: any[]) => {
  //   console.log('New Data $$$$$$$', data)
  //   if (!Array.isArray(data) || data.length === 0) return;

  //   data.forEach((image) => {
  //     const existingIndex = commonPropertyImagesData.findIndex(
  //       (item) => item.fileId === image.fileId
  //     );
  //     if (existingIndex !== -1) {
  //       const existingImage = commonPropertyImagesData[existingIndex];

  //       if (existingImage.isCover !== image.isCover) {
  //         const updatedImages = [...commonPropertyImagesData];
  //         updatedImages[existingIndex] = {
  //           ...existingImage,
  //           isCover: image.isCover,
  //         };
  //         setCommonPropertyImagesData(updatedImages);
  //       }
  //     } else {
  //       console.log('Hit $$')
  //       setCommonPropertyImagesData((prev) => [...prev, image]);
  //     }
  //   });
  // };

  const handleChildData = (data: any[]) => {

    if (!Array.isArray(data) || data.length === 0) return;

    const isSame = JSON.stringify(data) === JSON.stringify(commonPropertyImagesData);
    if (isSame) return;
    setCommonPropertyImagesData(data);
    setPropertyImagesData(data)
  };

  // const handleChildData = (newData: any) => {
  //   if (!newData?.fileId) return;

  //   const isAlreadyAdded = propertyImagesData.some(item => item.fileId === newData.fileId);
  //   if(isAlreadyAdded){}
  //   if (!isAlreadyAdded) {
  //     setPropertyImagesData(prev => [...prev, newData]);
  //   }
  // };


  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    let temp: any[] = [];
    let propertyInitData: propertyImage[] = [];
    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj = resp?.data;
          setPropertyDetails(dataObj);
          popUploader(dispatch, false);
          dataObj.specialAreas.map((specArea: any) => {
            temp.push({
              name: `${formatNamesCmnFun(specArea.name)} Images`,
              id: specArea.id,
              areaImages: specArea.areaImages,
            });
          });
          setPropertyImagesRapter(temp);
          dataObj.propertyImages.map((propImage: propertyImage) => {
            propertyInitData.push({
              id: propImage?.file?.id,
              isCover: propImage.isCover,
              altTag: propImage.altTag,
              file: propImage.file,
              url: propImage?.file?.originalPath,
              thumbUrl: propImage?.file?.smallPath,
            });
          });

          const transformAreaImages = (areas: any[]) => {
            return areas.map((area) => {
              return {
                ...area,
                areaImages: area.areaImages.map((image: propertyImage[]) => ({
                  id: image.file.id,
                  isCover: image.isCover,
                  altTag: image.altTag,
                  file: image.file,
                  url: image.file.originalPath,
                  thumbUrl: image.file.smallPath,
                })),
              };
            });
          };

          const transformedAreas = transformAreaImages(dataObj.specialAreas);


          setPropertyImagesDataInit(propertyInitData);
          setInitSpecialAreas(transformedAreas);
          setPropertyImagesData(propertyInitData);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
          setIsDisableBtns(false);
        });
    }
  };

  const handleCreatePropertyListingGuestHouseImages = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    let data: any = {
      images: {
        // propertyImages: propertyImagesData,
        propertyImages: commonPropertyImagesData,
        areaImages,
        unitImages,
      },
    };
    setIsDisableBtns(true);
    popUploader(dispatch, true);
    addNewProperty(data, ListingStepsEnum.IMAGES, propertyId)
      .then((res) => {
        history(`/main/finish/${propertyId}`);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      }).finally(() => {
        setIsDisableBtns(false);
      });
  };

  const handleSaveData = (data: any) => {
    const transformedData = data.map((area: any) => ({
      specialAreaId: area.specialAreaId,
      images: area.images.map((image: any) => ({
        fileId: image?.fileId,
        altTag: image?.altTag || "", // Ensure `altTag` is always a string
        isCover: image?.isCover, // Retain `isCover` as is
      })),
    }));

    setAreaImages(transformedData); // Store the transformed data in state
  };

  const handleSaveUnitDetails = (data: any) => {
    setUnitImages(data);
  };

  useEffect(() => {
    setPropertyImagesDataInit(propertyImagesData);
  }, []);

  useEffect(() => { }, [propertyImagesDataInit]);

  const isDisabled = useSelector((state: any) => state.buttonReducer.isDisabled);

  // @ts-ignore
  return (
    <PropertyListing>
      <div className="py-5 py-lg-0 w-100 h-100 stepGuestHouseImagesContainer">
        <Row
          className="d-flex align-items-center pt-5 pt-lg-0 contentRow "
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={10} xl={12} xxl={12}>
            <div className="me-0 me-lg-5 pe-0 pe-lg-5">
              <h2 className="font-size-3 font-weight-medium primary-color">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  Images
                </span>{" "}
                {">"} Step 01
              </h2>
              <h1 className="font-size-1 font-weight-medium">
                What does your property looks like?
              </h1>
              <p className="me-0 me-lg-5 font-size-4 font-weight-extra-light">
                Upload at least 5 photos of your property. The more you upload,
                the more likely you are to get bookings. You can add more later.
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={14}
            xl={12}
            xxl={12}
            className="d-flex flex-column align-items-start align-self-end mb-2"
            style={{ height: "88%", overflowY: "auto" }}
          >
            <div className="mt-4 w-100">
              {windowWidth > 426 ? (
                <Divider orientationMargin="0" orientation={"left"}>
                  Overall Property Images{" "}
                  <small>(Add more than 5 images)</small>
                </Divider>
              ) : (
                <span>
                  {" "}
                  Overall Property Images{" "}
                  <small>(Add more than 5 images)</small>
                </span>
              )}
              {propertyImagesDataInit ? (
                <CommonImageList
                  isSpecialArea={false}
                  areaDetails={{ id: 0, name: "" }}
                  propertyImagesData={propertyImagesDataInit}
                  onDataChange={handleChildData}
                />
              ) : (
                <p>Loading property images...</p>
              )}
            </div>

            {propertyDetails?.specialAreas && (
              <DynamicSpecialAreaList
                specialAreImage={initSpecialAreas}
                onSave={handleSaveData}
                areas={propertyImagesRapter}
              />
            )}

            {propertyDetails?.unitDetails && (
              <DynamicUnitImageList
                onSave={handleSaveUnitDetails}
                units={propertyDetails?.unitDetails}
              />
            )}
          </Col>
        </Row>
        <Row className="btnRow" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex flex-column-reverse flex-sm-row justify-content-between mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="me-0 me-sm-2 mt-3 mt-lg-0 px-5 py-4 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/main/finish/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisabled || propertyImagesData?.length < 5}
              size="large"
              type="primary"
              className="ms-0 ms-sm-3 mt-3 mt-lg-0 px-5 py-4 rounded-4"
              onClick={handleCreatePropertyListingGuestHouseImages}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepGuestHouseImages;
