import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  countDescription,
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { desMaxLimit } from "../../../common/validation";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { generateGPTPropertyDescription } from "../../../service/propertyDetailsService";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepNameOfPlace = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [placeName, setPlaceName] = useState<string>("");
  const [placeDescription, setPlaceDescription] = useState<string>("");
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>({});
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

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
          if (dataObj?.name && dataObj?.description) {
            setPlaceName(dataObj?.name);
            setPlaceDescription(dataObj?.description);
            form.setFieldsValue({
              placeName: dataObj?.name,
              placeDescription: dataObj?.description,
            });
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

  const GPTPropertyDescriptionGenerate = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      generateGPTPropertyDescription(propertyId, placeName)
        .then((resp) => {
          setPlaceDescription(resp?.data);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const handleCreatePropertyListingNameOfPlace = () => {
    let isValidate = false;
    placeName === ""
      ? customToastMsg("Enter your place name", 2)
      : placeDescription === ""
        ? customToastMsg("Enter your place description", 2)
        : countDescription(placeDescription) > desMaxLimit
          ? customToastMsg("Description limit exuded", 2)
          : (isValidate = true);

    const data = {
      propertyProfile: {
        name: placeName,
        description: placeDescription,
      },
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.PROPERTY_PROFILE, propertyId)
        .then((response) => {
          clearStates();
          form.resetFields();
          popUploader(dispatch, false);
          const route = resolvePropertyRoute(propertyTypeKey, propertyDetailsObject, propertyId ?? 0);
          history(route);
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

  const resolvePropertyRoute = (
    propertyTypeKey: string,
    propertyDetailsObject: PropertyListingDetailDTO,
    propertyId: number
  ): string => {
    const isSpecialType =
      propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
      propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
      propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
      propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY;

    if (isSpecialType) {
      if (propertyDetailsObject?.allowEntireProperty) {
        return `/property/06/${propertyId}`;
      }

      if (propertyDetailsObject?.allowIndividualUnit) {
        return propertyDetailsObject.propertyType?.name !== PropertyTypesEnum.HOTEL
          ? `/property/08/${propertyId}`
          : `/property/09/${propertyId}`;
      }
    }

    return `/property/05/${propertyId}`;
  };


  const clearStates = () => {
    setPlaceName("");
    setPlaceDescription("");
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="stepNameOfPlaceContainer py-5 py-lg-0 h-100 w-100">
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
                  Property Details
                </span>{" "}
                {">"} Step 04{" "}
              </h2>
              <h1 className="font-weight-medium font-size-1 me-0 me-lg-5">
                What is the name of your property?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Provide a short, catchy description that highlights the unique
                appeal of your location.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form form={form} layout="vertical" className="mt-4 w-100">
              <Form.Item name="placeName" label="Name For Property">
                <Input
                  size="large"
                  id="placeName"
                  name="placeName"
                  value={placeName}
                  placeholder="Name for your property"
                  className="rounded-4 p-3 bg-transparent border border-secondary"
                  type="text"
                  onChange={(e) => setPlaceName(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="placeDescription" label="" className="mt-3">
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h3 className="font-size-6 font-weight-normal">
                      Description
                    </h3>
                    {countDescription(placeDescription) > desMaxLimit ? (
                      <span className="text-count text-danger">
                        {countDescription(placeDescription)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    ) : (
                      <span className="text-count text-muted">
                        {countDescription(placeDescription)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    )}
                  </div>
                  <CKEditor
                    onChange={(event: any, editor) => {
                      const data = editor.getData();
                      setPlaceDescription(data);
                    }}
                    config={{
                      toolbar: {
                        items: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "alignment",
                          "|",
                          "indent",
                          "outdent",
                          "|",
                          "fontColor",
                          "fontSize",
                          "fontBackgroundColor",
                          "|",
                          "undo",
                          "redo",
                          "|",
                          "cut",
                          "copy",
                          "paste",
                          "|",
                          "removeFormat",
                          "|",
                          "blockQuote",
                          "horizontalLine",
                          "|",
                          "code",
                          "|",
                          "specialCharacters",
                          "|",
                        ],
                      },
                    }}
                    editor={ClassicEditor}
                    data={placeDescription}
                    onReady={(editor) => { }}
                  />
                  {/* <h5
                    className="font-size-5 font-weight-medium primary-color mt-2 align-self-end"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      GPTPropertyDescriptionGenerate();
                    }}
                  >
                    <img src={aiIcon} alt="icon" />
                    Need help ?
                  </h5> */}
                </div>
              </Form.Item>
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
                history(`/property/02/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingNameOfPlace}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepNameOfPlace;
