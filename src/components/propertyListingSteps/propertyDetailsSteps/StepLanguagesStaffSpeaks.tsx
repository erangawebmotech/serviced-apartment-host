import { Button, Checkbox, Col, Form, Row } from "antd";
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
import { LanguagesDetailsObject } from "../../../common/interfaces/uiNecessaryInterface";
import { getAllLanguages } from "../../../service/propertyDetailsService";
import { useDispatch } from "react-redux";
import * as constants from "../../../common/constants";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";

const StepLanguagesStaffSpeaks = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [languagesList, setLanguagesList] = useState<LanguagesDetailsObject[]>(
    []
  );
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadAllLanguages();
    loadPropertyDetailsPropertyId();
  }, []);

  // useEffect(() => {
  //   console.log(selectedLanguages);
  // }, [selectedLanguages]);

  const loadAllLanguages = () => {
    let temp: LanguagesDetailsObject[] = [];

    popUploader(dispatch, true);
    getAllLanguages()
      .then((resp) => {
        resp?.data.map((property: LanguagesDetailsObject) => {
          temp.push({
            id: property?.id,
            name: property?.name,
            code: property?.code,
          });
        });
        setLanguagesList(temp);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          setPropertyDetailsObject(dataObj);
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );
          if (
            dataObj?.propertyLanguages &&
            dataObj?.propertyLanguages.length > 0
          ) {
            setSelectedLanguages(
              dataObj?.propertyLanguages?.map(
                (language: { id: number }) => language.id
              ) || []
            );
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

  const handleCreatePropertyListingBookingPlan = () => {
    let isValidate = true;
    // selectedLanguages.length <= 0
    //   ? customToastMsg("Select languages", 2)
    //   : (isValidate = true);

    const data = {
      propertyLanguageIds: selectedLanguages,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.LANGUAGES, propertyId)
        .then((response) => {
          clearStates();
          form.resetFields();
          popUploader(dispatch, false);
          history(`/property/11/${propertyId}`);
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
    setSelectedLanguages([]);
    setIsDisableBtns(true);
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
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "08";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "09";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey === PropertyTypesKeysEnum.HOTEL
      ) {
        return "06";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey != PropertyTypesKeysEnum.HOTEL
      ) {
        return "07";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "09";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "08";
      }
    }
    return "10";
  };

  return (
    <PropertyListing>
      <div className="StepLanguagesStaffSpeaksContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100"
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
                {">"} Step{" "}
                {getStepNumber(propertyTypeKey, propertyDetailsObject)}
              </h2>
              <h1 className="font-weight-medium font-size-1 me-0 me-lg-5">
                What languages does your staff speak?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Showcase the languages your staff can communicate in to welcome
                diverse customers.
              </p>
            </div>
          </Col>

          <Col xs={12} sm={10} md={15} lg={12} xl={12} xxl={12}>
            <Form
              form={form}
              layout="vertical"
              className="mt-4 w-100 ms-0 ms-xl-5 text-start"
            >
              <h5 className="font-size-4 font-weight-medium mb-3">
                Languages
              </h5>
              <Form.Item name="entirePlace" className="ms-4">
                <Row gutter={[10, 20]}>
                  {languagesList.map((option) => (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      xxl={12}
                      key={option.id}
                      className="d-flex"
                    >
                      <Checkbox
                        value={option.id}
                        checked={
                          Array.isArray(selectedLanguages) &&
                          selectedLanguages.includes(option?.id)
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (selectedLanguages.includes(value)) {
                            setSelectedLanguages(
                              selectedLanguages.filter((lang) => lang !== value)
                            );
                          } else {
                            setSelectedLanguages([...selectedLanguages, value]);
                          }
                        }}
                      >
                        {formatNamesCmnFun(option.name)}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
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
              type="default"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/property/09/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              type="primary"
              size="large"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={() => {
                handleCreatePropertyListingBookingPlan();
              }}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepLanguagesStaffSpeaks;
