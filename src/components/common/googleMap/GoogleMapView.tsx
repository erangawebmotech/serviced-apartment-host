import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Col, Input, List, Row } from "antd";
import locIcon from "../../../assets/images/mdi--location.svg";
import "../../../styles/common/map/googleMap.scss";
import { customToastMsg } from "../../../common/commonFunctions";
import { Navigation } from "react-feather";
import { Cookies } from "typescript-cookie";
import * as constants from "../../../common/constants";

// Define the container style
const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

// Define default center location
const center_delivery = {
  lat: 6.9271,
  lng: 79.8612,
};

const zoom = 10;

interface GoogleMapViewProps {
  onMarkerPositionChange: (position: google.maps.places.PlaceResult) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  isSelectLocation: (status: boolean) => void;
  selectedLocation?: { lat: number; lng: number };
  onMapsLoad?: (status: boolean) => void;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  onMarkerPositionChange,
  initialLatitude = null,
  initialLongitude = null,
  isSelectLocation,
  selectedLocation,
  onMapsLoad

}) => {
  const gMapKey = import.meta.env.VITE_GOOGLE_MAPS_PUBLIC_KEY as string;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: gMapKey,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral>({
      lat: center_delivery.lat,
      lng: center_delivery.lng,
    });
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [showCurrentLocationOption, setShowCurrentLocationOption] =
    useState<boolean>(false);
  const [dropdownHovered, setDropdownHovered] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log("isLoaded:", isLoaded);
  //   console.log("google:", window.google);
  //   console.log("google.maps:", window.google?.maps);
  //   console.log("google.maps.Map:", window.google?.maps?.Map);
  // }, [isLoaded]);

  useEffect(() => {
    if (onMapsLoad) {
      onMapsLoad(isLoaded);
    }
    if (isLoaded) {
      isSelectLocation(false);
    }
  }, [isLoaded, onMapsLoad]);

  useEffect(() => {
    if (searchBox) {
      // console.log("searchBox", searchBox);

      const onPlacesChanged = async () => {
        const place = searchBox.getPlaces()?.[0];
        if (place && place.geometry?.location) {
          const location = place.geometry.location.toJSON(); // Convert LatLng to LatLngLiteral
          // console.log("Selected Location:", location);

          setMarkerPosition(location); // Update marker position
          setSelectedPlace(place); // Save place details
          setInputValue(place.formatted_address || ""); // Set input value

          if (map) {
            map.setCenter(location); // Center the map
            map.setZoom(15); // Adjust zoom level
          }
          // console.log(place);
          const serializablePlaceObject = JSON.stringify(place);
          Cookies.set(constants.LOCATION_OBJECT, serializablePlaceObject);
          // console.log(Cookies.get(constants.LOCATION_OBJECT));

          onMarkerPositionChange(place);
          isSelectLocation(true);
        } else {
          customToastMsg("Unable to retrieve location details.", 2);
        }
      };

      searchBox.addListener("places_changed", onPlacesChanged);
    }
  }, [searchBox, map]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps is not ready");
      return;
    }

    let location: google.maps.LatLngLiteral = center_delivery;

    if (selectedLocation?.lat && selectedLocation?.lng) {
      location = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };
      isSelectLocation(true);
    }

    const bounds = new window.google.maps.LatLngBounds(location);
    mapInstance.fitBounds(bounds);
    mapInstance.setCenter(location);
    mapInstance.setZoom(15);
    setMap(mapInstance);
  }, [selectedLocation, isSelectLocation]);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
    setAutocomplete(new window.google.maps.places.AutocompleteService());
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (predictions.length > 0) {
        const place = predictions[0];
        handleListItemClick(place);
        isSelectLocation(true);
      } else {
        customToastMsg("No predictions available", 2);
      }
    } else if (autocomplete && event.currentTarget.value) {
      autocomplete.getPlacePredictions(
        { input: event.currentTarget.value },
        (predictions) => {
          setPredictions(predictions || []);
        }
      );
    }
  };

  const handleListItemClick = (
    place: google.maps.places.AutocompletePrediction
  ) => {
    const placeService = new window.google.maps.places.PlacesService(map!);
    placeService.getDetails({ placeId: place.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const location = place && place.geometry?.location?.toJSON();
        if (location) {
          setMarkerPosition(location);
          setSelectedPlace(place);
          const bounds = new window.google.maps.LatLngBounds(location);
          if (map) {
            map.fitBounds(bounds);
            map.setCenter(location);
            map.setZoom(15);
          }
          setSearchBox(null);
          setPredictions([]);
          onMarkerPositionChange(place);
          isSelectLocation(false);
        }
      }
    });
  };

  const getCurrentLocation = () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            // console.error("Google Maps API is not ready yet.");
            customToastMsg("Google Maps is not ready yet.", 2);
            return;
          }


          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
              const result = results[0];
              setMarkerPosition(location);
              if (map) {
                map.setCenter(location);
                map.setZoom(15);
              }
              onMarkerPositionChange(result);
              setSelectedPlace(result);
              setShowCurrentLocationOption(false);
            } else {
              customToastMsg("Unable to retrieve place information.", 2);
            }
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              customToastMsg("Permission denied for location access.", 2);
              break;
            case error.POSITION_UNAVAILABLE:
              customToastMsg("Location information is unavailable.", 2);
              break;
            case error.TIMEOUT:
              customToastMsg("Location request timed out.", 2);
              break;
            default:
              customToastMsg("An unknown error occurred while retrieving location.", 2);
              break;
          }
          // customToastMsg("Error retrieving current location.", 2);
          // console.error("Geolocation error: ", error);
        }
      );
    } else {
      customToastMsg("Geolocation is not supported by this browser.", 2);
    }
  };

  useEffect(() => {
    if (
      !markerPosition ||
      (markerPosition.lat === center_delivery.lat &&
        markerPosition.lng === center_delivery.lng)
    ) {
      // console.log("is init marker point");
      let location: google.maps.LatLngLiteral | null = null;

      if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
        location = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        };
      } else if (initialLatitude && initialLongitude) {
        location = {
          lat: initialLatitude,
          lng: initialLongitude,
        };
      } else {
        location = {
          lat: center_delivery.lat,
          lng: center_delivery.lng,
        };
      }

      if (location) {
        setMarkerPosition(location); // Initialize marker position
        if (map) {
          const bounds = new window.google.maps.LatLngBounds(location);
          map.fitBounds(bounds);
          map.setCenter(location);
          map.setZoom(15);
          isSelectLocation(true);
        }
      }
    }
  }, [initialLatitude, initialLongitude, selectedLocation, map]);

  useEffect(() => {
    // console.log("Marker position updated:", markerPosition);
    // @ts-ignore
  }, [markerPosition]);

  if (!isLoaded || typeof window.google === "undefined" || typeof window.google.maps === "undefined") {
    return <div>Loading Google Map...</div>;
  }
  return isLoaded ? (
    <div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            onLoad={onLoad}
            // ref={mapVariable}
            center={markerPosition || center_delivery}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                icon={locIcon}
                draggable={true}
                onDragEnd={(event) => {
                  // console.log(event);
                  const location = event.latLng?.toJSON();
                  if (location) {
                    setMarkerPosition(location);
                    if (!window.google || !window.google.maps) {
                      console.error("Google Maps is not loaded yet");
                      return;
                    }
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location }, (results, status) => {
                      if (
                        status === google.maps.GeocoderStatus.OK &&
                        results?.[0]
                      ) {
                        const placeId = results[0].place_id; // Extract the place_id from reverse geocoding

                        if (placeId) {
                          const placeService =
                            new google.maps.places.PlacesService(map!);

                          // Use PlacesService to get full details
                          placeService.getDetails(
                            { placeId },
                            (placeDetails, status) => {
                              if (
                                status ===
                                google.maps.places.PlacesServiceStatus.OK
                              ) {
                                setSelectedPlace(placeDetails); // Save full place details
                                // @ts-ignore
                                onMarkerPositionChange(placeDetails); // Notify parent

                                // console.log(
                                //   "Dragged Place Full Details:",
                                //   placeDetails
                                // ); // Log full details
                              } else {
                                customToastMsg(
                                  "Unable to retrieve full place details.",
                                  2
                                );
                                // console.error(
                                //   "PlacesService failed due to: " + status
                                // );
                              }
                            }
                          );
                        }
                      } else {
                        customToastMsg("Unable to retrieve place details.", 2);
                        // console.error("Geocoder failed due to: " + status);
                      }
                    });
                    // @ts-ignore
                    onMarkerPositionChange(location);
                  }
                }}
              />
            )}

            <StandaloneSearchBox
              // className="ipt-location"
              onLoad={onSearchBoxLoad}
            >
              <Input
                size="large"
                type="text"
                placeholder="Enter your location"
                style={{
                  width: "95%",
                  position: "absolute",
                  left: "50%",
                  cursor: "pointer",
                  top: "3.5%",
                  transform: "translateX(-50%)",
                }}
                value={inputValue}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setInputValue(e.target.value);
                  if (e.target.value) {
                    setShowCurrentLocationOption(false);
                  } else {
                    setShowCurrentLocationOption(true);
                  }
                }}
                onFocus={() => {
                  if (!inputValue) {
                    setShowCurrentLocationOption(true);
                  }
                }}
                onBlur={() => {
                  if (!dropdownHovered) {
                    setShowCurrentLocationOption(false);
                  }
                }}
                onKeyPress={handleKeyPress}
              />
            </StandaloneSearchBox>
            {showCurrentLocationOption && !inputValue && (
              <div
                onMouseEnter={() => setDropdownHovered(true)}
                onMouseLeave={() => setDropdownHovered(false)}
              >
                <List
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    backgroundColor: "white",
                    marginTop: "5px",
                    width: "95%",
                    cursor: "pointer",
                    top: "50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="rounded-bottom"
                >
                  <List.Item
                    onClick={getCurrentLocation}
                    style={{ cursor: "pointer" }}
                    className="px-3"
                  >
                    <Navigation size={20} className="me-2" /> Use my current
                    location
                  </List.Item>
                </List>
              </div>
            )}
          </GoogleMap>
        </Col>
      </Row>
    </div>
  ) : (
    <></>
  );
};

export default React.memo(GoogleMapView);
