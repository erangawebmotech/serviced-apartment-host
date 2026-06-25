import { Button, Col, Form, Grid, Input, Row } from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import * as constants from "../../../common/constants";
import { useDispatch } from "react-redux";
import { Cookies } from "typescript-cookie";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";

const CONFIRM_ADDRESS_SNAPSHOT_COOKIE = "CONFIRM_ADDRESS_SNAPSHOT";

type ConfirmAddressSnapshot = {
  placeSignature: string;
  selectedCountry: string;
  streetAddress: string;
  aptFloorBldg: string;
  city: string;
  province: string;
  postalCode: string;
};

const StepConfirmAddress = () => {
  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  // const [countryList, setCountryList] = useState<DropdownObj[]>([]);
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [aptFloorBldg, setAptFloorBldg] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [googlePlaceObject, setGooglePlaceObject] = useState<{}>({});
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [form] = Form.useForm();

  const getCoordinateValue = (coordinate: any): number | null => {
    if (typeof coordinate === "number") return coordinate;
    if (typeof coordinate === "function") {
      const value = coordinate();
      return typeof value === "number" ? value : null;
    }
    return null;
  };

  const isSameLocationAsSavedProperty = (
    placeObject: any,
    propertyData?: PropertyListingDetailDTO
  ) => {
    if (propertyData?.lat == null || propertyData?.lng == null) {
      return false;
    }

    const placeLat = getCoordinateValue(placeObject?.geometry?.location?.lat);
    const placeLng = getCoordinateValue(placeObject?.geometry?.location?.lng);

    if (placeLat == null || placeLng == null) {
      return false;
    }

    const precision = 0.000001;
    return (
      Math.abs(placeLat - propertyData.lat) <= precision &&
      Math.abs(placeLng - propertyData.lng) <= precision
    );
  };

  const getPlaceSignature = (placeObject: any): string => {
    const lat = getCoordinateValue(placeObject?.geometry?.location?.lat);
    const lng = getCoordinateValue(placeObject?.geometry?.location?.lng);
    const placeId = placeObject?.place_id || "";
    const formattedAddress = placeObject?.formatted_address || "";
    return `${lat ?? "na"}|${lng ?? "na"}|${placeId}|${formattedAddress}`;
  };

  const getSavedSnapshot = (): ConfirmAddressSnapshot | null => {
    const raw = Cookies.get(CONFIRM_ADDRESS_SNAPSHOT_COOKIE);
    if (!raw || typeof raw !== "string") return null;
    try {
      return JSON.parse(raw) as ConfirmAddressSnapshot;
    } catch {
      return null;
    }
  };

  const saveSnapshot = (placeObject: any) => {
    const snapshot: ConfirmAddressSnapshot = {
      placeSignature: getPlaceSignature(placeObject),
      selectedCountry,
      streetAddress,
      aptFloorBldg,
      city,
      province,
      postalCode,
    };

    Cookies.set(CONFIRM_ADDRESS_SNAPSHOT_COOKIE, JSON.stringify(snapshot), {
      expires: 7,
      secure: true,
    });
  };

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
  }, []);


  useEffect(() => {
    const { state } = location;
    if (state && state?.placeObject && state?.placeObject?.address_components) {
      const { placeObject } = state;
      setGooglePlaceObject(placeObject);

      let streetAddress = "";
      let city = "";
      let province = "";
      let country = "";
      let postalCode = "";

      if (placeObject?.address_components) {
        for (const place of placeObject?.address_components) {
          // Set Street Address
          if (place?.types.includes("route")) {
            streetAddress = place?.long_name;
          }

          // Prioritize Locality as City
          if (!city && place?.types.includes("locality")) {
            city = place.long_name;
          }

          // If Locality is not found, check administrative_area_level_3
          if (!city && place?.types.includes("administrative_area_level_3")) {
            city = place.long_name;
          }

          // If administrative_area_level_3 is not found, check administrative_area_level_2
          if (!city && place?.types.includes("administrative_area_level_2")) {
            city = place.long_name;
          }

          // Set Province
          if (place?.types.includes("administrative_area_level_1")) {
            province = place?.long_name;
          }

          // Set Country
          if (place?.types.includes("country")) {
            country = `${place?.long_name} - ${place?.short_name}`;
          }

          // Set Postal Code
          if (place?.types.includes("postal_code")) {
            postalCode = place?.long_name;
          }
        }

        const snapshot = getSavedSnapshot();
        const placeSignature = getPlaceSignature(placeObject);

        if (snapshot?.placeSignature === placeSignature) {
          // Same place as last saved snapshot: always restore latest edited values.
          setStreetAddress(snapshot.streetAddress || "");
          setCity(snapshot.city || "");
          setProvince(snapshot.province || "");
          setSelectedCountry(snapshot.selectedCountry || country || "");
          setPostalCode(snapshot.postalCode || "");
          setAptFloorBldg(snapshot.aptFloorBldg || "");
        } else if (isSameLocationAsSavedProperty(placeObject, propertyDetailsObject)) {
          // Same map location: keep saved edited values.
          setStreetAddress(propertyDetailsObject?.address || streetAddress || "");
          setCity(propertyDetailsObject?.city || city || "");
          setProvince(province || "");
          setSelectedCountry(country || "");
          setPostalCode(propertyDetailsObject?.postalCode || postalCode || "");
          setAptFloorBldg(propertyDetailsObject?.floor || "");
        } else {
          // New map location: refresh from new place object.
          setStreetAddress(streetAddress || "");
          setCity(city || "");
          setProvince(province || "");
          setSelectedCountry(country || "");
          setPostalCode(postalCode || "");
          setAptFloorBldg("");
        }
      }
    } else {
      customToastMsg("You selected an invalid location. Please select a new location.", 2)
      const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
      history(`/property/02/${propertyId}`);
    }


  }, [location, propertyDetailsObject]);

  useEffect(() => {
    loadPropertyDetailsPropertyId();
  }, []);

  const loadPropertyDetailsPropertyId = async () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      await getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          if (dataObj?.lat && dataObj?.lng) {
            setPropertyDetailsObject(dataObj);
          }
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  useEffect(() => {
    setDataToInputs();
  }, [streetAddress, city, province, selectedCountry, postalCode]);

  const setDataToInputs = () => {
    form.setFieldsValue({
      streetAddress: streetAddress,
      city: city,
      province: province,
      selectedCountry: selectedCountry,
      postalCode: postalCode,
      aptFloorBldg: aptFloorBldg,
    });
    setIsDisableBtns(false);
  };

  const handleCreatePropertyListingConfirmAddress = () => {
    let isValidate = false;
    selectedCountry === ""
      ? customToastMsg("Select Country", 2)
      : streetAddress === ""
        ? customToastMsg("Enter street address", 2)
        : city === ""
          ? customToastMsg("Enter city", 2)
          : // : postalCode === ""
          // ? customToastMsg("Enter postal code", 2)
          (isValidate = true);

    const data = {
      location: {
        postalCode: postalCode,
        city: city,
        address: streetAddress,
        province: province,
        floor: aptFloorBldg,
        mapDetails: googlePlaceObject,
      },
    };
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.LOCATION, propertyId)
        .then(() => {
          saveSnapshot(googlePlaceObject);
          Cookies.remove(constants.LOCATION_OBJECT);
          form.resetFields();
          clearStates();
          popUploader(dispatch, false);
          history(`/property/04/${propertyId}`);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
          history(`/property/02/${propertyId}`);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const clearStates = () => {
    setSelectedCountry("");
    setStreetAddress("");
    setAptFloorBldg("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setGooglePlaceObject({});
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="StepConfirmAddressContainer py-5 py-lg-0 h-100 w-100">
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
                {">"} Step 03
              </h2>
              <h1 className="font-weight-medium font-size-1 ">
                Confirm your address
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Your address is only shared with guests after they’ve made a
                reservation.
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className="d-flex align-items-center py-2 pe-2 "
            // className={`d-flex${
            //   screens.xxl || screens.xl
            //     ? "align-items-center"
            //     : "align-items-start"
            // }py-2 pe-2 `}
            style={{ height: "90%", overflowY: "auto" }}
          >
            <Form
              form={form}
              layout="vertical"
              className="mt-4 w-100 text-start"
            >
              <h6>Country</h6>
              <div className="bg-white rounded-3 mb-4">
                <Form.Item name="selectedCountry">
                  <Input
                    readOnly
                    size="large"
                    id="selectedCountry"
                    name="selectedCountry"
                    variant="borderless"
                    value={selectedCountry}
                    placeholder="Select country / region"
                    type="text"
                    style={{ height: 50, cursor: "not-allowed" }}
                  // onChange={(e) => setSelectedCountry(e.target.value)}
                  />
                  {/* <Select
                    showSearch
                    placeholder="Select country / region"
                    optionFilterProp="label"
                    onChange={(e) => {
                      setSelectedCountry(e || "");
                    }}
                    style={{ height: 50 }}
                    size="large"
                    options={countryList}
                  /> */}
                </Form.Item>
              </div>
              <h6>Address</h6>
              <div className="px-2 py-2 bg-white rounded-3">
                <Form.Item
                  name="streetAddress"
                  label="Street Address"
                  className="mb-2 border-bottom  border-secondary-subtle"
                  labelCol={{ color: "red" }}
                >
                  <Input
                    size="large"
                    id="streetAddress"
                    name="streetAddress"
                    variant="borderless"
                    value={streetAddress}
                    placeholder="Enter street address"
                    type="text"
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="aptFloorBldg"
                  label="Apt, Floor, Bldg (if applicable)"
                  className="mb-2 border-bottom  border-secondary-subtle"
                >
                  <Input
                    size="large"
                    id="aptFloorBldg"
                    name="aptFloorBldg"
                    variant="borderless"
                    value={aptFloorBldg}
                    placeholder="Enter apt, floor, bldg"
                    type="text"
                    onChange={(e) => setAptFloorBldg(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="City/Town/Village"
                  className="mb-2 border-bottom  border-secondary-subtle"
                >
                  <Input
                    size="large"
                    id="city"
                    name="city"
                    value={city}
                    variant="borderless"
                    placeholder="Enter city/town/village"
                    type="text"
                    readOnly
                    style={{ cursor: "not-allowed" }}
                  // onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="province"
                  label="Province/State/Territory (if applicable)"
                  className="mb-2 border-bottom  border-secondary-subtle"
                >
                  <Input
                    size="large"
                    id="province"
                    name="province"
                    value={province}
                    variant="borderless"
                    placeholder="Enter province/state/territory"
                    type="text"
                    readOnly
                    style={{ cursor: "not-allowed" }}
                  // onChange={(e) => setProvince(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="postalCode"
                  label="Postal Code (if applicable)"
                  className="mb-0"
                >
                  <Input
                    size="large"
                    id="postalCode"
                    name="postalCode"
                    value={postalCode}
                    variant="borderless"
                    placeholder="Enter postal code"
                    type="text"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </Form.Item>
              </div>
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
              onClick={() => {
                handleCreatePropertyListingConfirmAddress();
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

export default StepConfirmAddress;
