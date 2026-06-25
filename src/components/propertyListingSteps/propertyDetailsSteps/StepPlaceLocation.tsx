import { Button, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
    customToastMsg,
    getDecryptedCookie,
    getLastPathSegment,
    handleError,
    popUploader,
    setEncryptedCookie,
} from "../../../common/commonFunctions";
import GoogleMapView from "../../common/googleMap/GoogleMapView";
import * as constants from "../../../common/constants";
import { useDispatch } from "react-redux";
import { getPropertyById } from "../../../service/propertyListingService";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { Cookies } from "typescript-cookie";

const StepPlaceLocation = () => {
    const history = useNavigate();
    const dispatch = useDispatch();

    const [markedPlaceObject, setMarkedPlaceObject] = useState<{}>("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [serializablePlaceObject, setSerializablePlaceObject] = useState<{} | null>(null);

    const [isSelectLocation, setIsSelectLocation] = useState<boolean>(false);
    const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

    const [mapsReady, setMapsReady] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        const currentURL = window.location.pathname;
        const lastSegment = getLastPathSegment(currentURL);
        setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
        // loadPropertyDetailsPropertyId();
    }, []);

    useEffect(() => {
        if (mapsReady) {
            loadPropertyDetailsPropertyId(); // <-- Only load when maps are ready
        }
    }, [mapsReady]);

    const loadPropertyDetailsPropertyId = () => {
        const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

        if (propertyId) {
            popUploader(dispatch, true);
            getPropertyById(propertyId)
                .then((resp) => {
                    const dataObj: PropertyListingDetailDTO = resp?.data;
                    if (dataObj?.lat && dataObj?.lng) {
                        setLatitude(dataObj?.lat);
                        setLongitude(dataObj?.lng);
                        fetchPlaceDetails(dataObj?.lat, dataObj?.lng);
                    } else {
                        // console.log("else print");
                        let locationTemp = Cookies.get(constants.LOCATION_OBJECT);
                        if (locationTemp) {
                            // console.log(locationTemp)
                            if (typeof locationTemp === "string") {
                                let locDetails = JSON.parse(locationTemp);
                                setSerializablePlaceObject(locDetails);
                                // console.log(JSON.parse(locationTemp));
                                setLatitude(locDetails?.geometry?.location.lat);
                                setLongitude(locDetails?.geometry?.location.lng);
                            }
                        } else {
                            // console.log("cant find");
                            setLatitude(0.0);
                            setLongitude(0.0);
                        }
                    }
                    popUploader(dispatch, false);
                    setIsDisableBtns(serializablePlaceObject === null);
                })
                .catch((err) => {
                    popUploader(dispatch, false);
                    handleError(err);
                });
        }
    };

    const fetchPlaceDetails = (lat: number, lng: number) => {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps not yet loaded");
            return;
        }

        const geocoder = new google.maps.Geocoder();
        const location = { lat, lng };
        geocoder.geocode({ location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const placeObject = results[0];
                // console.log("Place Details: ", placeObject);
                handleMarkerPositionChange(placeObject);
            } else {
                // console.error("Geocoder failed due to: ", status);
            }
        });
    };



    const handleMarkerPositionChange = async (position: any) => {
        await setSerializablePlaceObject(null);

        // console.log(position);

        setMarkedPlaceObject(position);
        const serializablePlaceObject = JSON.parse(JSON.stringify(position));
        // console.log(serializablePlaceObject);
        await setSerializablePlaceObject(serializablePlaceObject);
        Cookies.set(
            constants.LOCATION_OBJECT,
            JSON.stringify(serializablePlaceObject), {
            expires: 7, // cookie will expire in 7 days
            secure: true, // ensures cookie is only sent over HTTPS
            // sameSite: "Strict", // mitigates CSRF (can also be 'Lax' depending on needs)
        }
        );
        setIsDisableBtns(serializablePlaceObject == null);
    };

    const handleCreatePropertyListingPlaceLocation = () => {
        let isValidate = false;

        if (!serializablePlaceObject) {
            customToastMsg("Select a location", 2);
        } else {
            (isValidate = true)
        }

        if (isValidate) {
            setIsDisableBtns(true);
            // const serializablePlaceObject = JSON.parse(
            //     JSON.stringify(markedPlaceObject)
            // );
            const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
            history(`/property/03/${propertyId}`, {
                state: { placeObject: serializablePlaceObject },
            });
            Cookies.set(
                constants.LOCATION_OBJECT,
                JSON.stringify(serializablePlaceObject), {
                expires: 7, // cookie will expire in 7 days
                secure: true, // ensures cookie is only sent over HTTPS
                // sameSite: "Strict", // mitigates CSRF (can also be 'Lax' depending on needs)
            }
            );
            setIsDisableBtns(false);
        }
    };
    // console.log(isDisableBtns);
    return (
        <PropertyListing>
            <div className="StepPlaceLocationContainer py-5 py-lg-0 h-100 w-100">
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
                                {">"} Step 02
                            </h2>
                            <h1 className="font-weight-medium font-size-1">
                                Where's your place located?
                            </h1>
                            <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                                Your address is only shared with guests after they’ve made a
                                reservation.
                            </p>
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form form={form} layout="vertical" className="mt-4 w-100">
                            <Form.Item name="location">
                                <GoogleMapView
                                    isSelectLocation={(status) => {
                                        setIsSelectLocation(status);
                                    }}
                                    initialLatitude={latitude}
                                    initialLongitude={longitude}
                                    selectedLocation={{ lat: latitude, lng: longitude }}
                                    onMarkerPositionChange={handleMarkerPositionChange}
                                    onMapsLoad={setMapsReady}
                                />
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
                                history(`/property/01`);
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
                                handleCreatePropertyListingPlaceLocation();
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

export default StepPlaceLocation;
