import { Button, Col, Form, Radio, Row } from "antd";
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
import * as constants from "../../../common/constants";
import { InvoiceHeadingTypeEnum } from "../../../common/enums/invoiceHeadingTypeEnum";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { Cookies } from "typescript-cookie";

const StepNameAppearOnTheInvoice = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [nameOfTheInvoice, setNameOfTheInvoice] = useState<string>("");
  const [propertyName, setPropertyName] = useState<string>("");
  const [loggedUserName, setLoggedUserName] = useState<string>("");
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));

    loadPropertyDetailsPropertyId();
    const authUser = Cookies.get(constants.AUTH_USER_HOST)
      ? Cookies.get(constants.AUTH_USER_HOST)
      : Cookies.get(constants.AUTH_USER);

    const authUserString = JSON.parse(authUser as string)
    setLoggedUserName(
      `${authUserString?.firstName ?? ""} ${authUserString?.lastName ?? ""}`.trim()
    );
  }, []);

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          if (dataObj?.invoiceHeadingType) {
            setNameOfTheInvoice(dataObj?.invoiceHeadingType);
          }
          if (dataObj?.name) {
            setPropertyName(dataObj?.name);
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

  const handleCreatePropertyListingNameOfTheInvoice = () => {
    let isValidate = false;
    nameOfTheInvoice === ""
      ? customToastMsg("Select one option", 2)
      : (isValidate = true);

    const data = {
      invoiceHeadingType: nameOfTheInvoice,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.INVOICE_HEADING_TYPE, propertyId)
        .then(() => {
          clearStates();
          popUploader(dispatch, false);
          history(`/final/04/${propertyId}`);
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
    setNameOfTheInvoice("");
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="StepNameAppearOnTheInvoiceContainer py-5 py-lg-0 h-100 w-100">
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
                  Final Steps
                </span>{" "}
                {">"} Step 03
              </h2>
              <h1 className="font-weight-medium font-size-1 ">
                What name should appear on the invoice?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Please select the name to display on your invoice. This name
                will be used for all billing purposes.
              </p>
            </div>
          </Col>

          <Col xs={20} sm={15} md={10} lg={12} xl={12} xxl={12}>
            <Form
              form={form}
              layout="vertical"
              className="mt-4 w-100 ms-0 ms-xl-5 text-start py-5"
            >
              <Radio.Group
                onChange={(e) => {
                  setNameOfTheInvoice(e.target.value);
                }}
                className="d-flex flex-column ms-3"
                value={nameOfTheInvoice}
              >
                <div>
                  <Radio
                    value={InvoiceHeadingTypeEnum.USER_INFO}
                    className="my-4"
                  >
                    <span className="font-size-4 font-weight-normal">
                      {formatNamesCmnFun(loggedUserName)}
                    </span>
                    <div className="text-muted small mt-0 position-absolute">
                      Your name will appear on the invoice
                    </div>
                  </Radio>
                </div>

                <Radio
                  value={InvoiceHeadingTypeEnum.PROPERTY_INFO}
                  className="my-4"
                >
                  {" "}
                  <span className="font-size-4 font-weight-normal">
                    {formatNamesCmnFun(propertyName)}
                  </span>
                  <div className="text-muted small mt-0 position-absolute">
                    The property name will appear on the invoice
                  </div>
                </Radio>
              </Radio.Group>
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
                history(`/final/02/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingNameOfTheInvoice}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepNameAppearOnTheInvoice;
