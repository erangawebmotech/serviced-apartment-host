import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../../common/commonFunctions.tsx";
import {
  DescribeApartmentItemsObj,
  GuestUseInRoomDataObject,
} from "../../../common/interfaces/uiNecessaryInterface.ts";
import * as constants from "../../../common/constants.ts";
import { AmenityCategoriesEnum } from "../../../common/enums/amenityCategoriesEnum.ts";
import {
  getAmenitiesDetailsByEnum,
  propertyHighlight,
} from "../../../service/propertyDetailsService.ts";
import { useDispatch } from "react-redux";
import { getPropertyById } from "../../../service/propertyListingService.ts";
import { Cookies } from "typescript-cookie";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import defaultIcon from "../../../assets/images/steps/defaultIcon.png";

interface GuestUseInRoomComponentProp {
  selectedAmenitiesDetails: { amenityId: string; description: string | null }[];
  selectedHighlightsDetails: string[];
  onGuestUseInRoomDataChange: (data: GuestUseInRoomDataObject) => void;
}

interface Amenity {
  amenityId: number;
  description: string;
}

const GuestUseInRoomComponent: React.FC<GuestUseInRoomComponentProp> = ({
  selectedAmenitiesDetails,
  selectedHighlightsDetails,
  onGuestUseInRoomDataChange,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [generalAmenitiesList, setGeneralAmenitiesList] = useState<
    DescribeApartmentItemsObj[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [highlightsList, setHighlightsList] = useState<
    DescribeApartmentItemsObj[]
  >([]);

  const [selectedAmenities, setSelectedAmenities] = useState<
    { amenityId: string; description: string | null }[]
  >([]);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  useEffect(() => {
    setSelectedAmenities(selectedAmenitiesDetails);
    setSelectedItems(selectedHighlightsDetails);
  }, [selectedAmenitiesDetails, selectedHighlightsDetails]);

  useEffect(() => {
    getAmenitiesList();
    getHighLights();
  }, []);
  useEffect(() => {
    sendDataToParent();
  }, [selectedAmenities, selectedItems]);

  const handleItemClick = async (id: string) => {
    await setSelectedItems((prevSelectedItems = []) => {
      const updatedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id];
      // console.log("Updated selectedItems:", updatedItems); // Log the updated state

      return updatedItems;
    });
  };

  const handleAmenitySelection = (id: string) => {
    setSelectedAmenities((prev) => {
      const isSelected = prev.some((item) => item.amenityId === id);
      const updatedAmenities = isSelected
        ? prev.filter((item) => item.amenityId !== id)
        : [...prev, { amenityId: id, description: "test" }];

      return updatedAmenities;
    });
  };

  const getAmenitiesList = () => {
    let temp: any = {
      categories: [AmenityCategoriesEnum.ACCOMMODATION_UNIT_AMENITIES],
    };
    popUploader(dispatch, true);
    getAmenitiesDetailsByEnum(temp)
      .then((res) => {
        //
        // id: "1",
        //     icon: "<MapPin size={18} />",
        //     name: "Shower",
        const amenitiesList = res.data[0].amenities.map((amenity: any) => ({
          id: amenity?.id.toString(),
          icon: amenity?.file?.smallPath, // Icon from API or fallback
          name: amenity?.name,
        }));
        setGeneralAmenitiesList(amenitiesList);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      });
  };

  const getHighLights = () => {
    popUploader(dispatch, true);
    propertyHighlight()
      .then((res) => {
        const highlightsList = res.data.map((highlight: any) => ({
          id: highlight.id.toString(),
          icon: highlight?.file?.smallPath, // Icon from API or fallback
          name: highlight.name,
        }));
        setHighlightsList(highlightsList);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      });
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  const sendDataToParent = () => {
    const unitAmenitiesData = {
      amenities: selectedAmenities.map((amenity: any) => ({
        amenityId: Number(amenity.amenityId),
        description: "test",
        // description: amenity.description,
      })),
      highlightIds: selectedItems.map(Number),
    };

    onGuestUseInRoomDataChange(unitAmenitiesData);
  };

  const clearStates = () => {
    setSelectedItems([]);
    setSelectedAmenities([]);
    setIsDisableBtns(true);
  };

  // console.log(selectedAmenities);
  return (
    <div className="GuestUseInRoomComponentContainer w-100" onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}>
      <div
        className="py-3 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
        style={{ backgroundColor: "#fdfdfd6e" }}
      >
        <div className="mt-5 mt-lg-0">
          {generalAmenitiesList.length > 0 && (
            <h5 className="font-size-4 font-weight-medium mb-2">
              General Amenities
            </h5>
          )}
          {/* <h5 className="font-size-2 font-weight-medium mb-3 secondary-color">
            General Amenities
          </h5> */}
          <div>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
              {generalAmenitiesList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAmenitySelection(item.id)}
                  className="d-flex justify-content-center align-items-center py-1 px-3 rounded-4 my-2 mx-2"
                  style={{
                    width: "max-content",
                    color: selectedAmenities.some(
                      (selectedItem) => selectedItem.amenityId === item.id
                    )
                      ? "white"
                      : "black",
                    backgroundColor: selectedAmenities.some(
                      (selectedItem) => selectedItem.amenityId === item.id
                    )
                      ? "#ef5a60"
                      : "#fdfdfd6e",
                    border: "2px solid white",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.icon ? item.icon : defaultIcon}
                    width="20px"
                    alt="icon-img"
                  />
                  <h5 className="font-size-4 font-weight-normal ms-2 my-2">
                    {item.name}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Divider />
        <div className="mb-5 mb-lg-0">
          {highlightsList.length > 0 && (
            <h5 className="font-size-4 font-weight-medium mb-2">Highlights</h5>
          )}
          {/* <h5 className="font-size-2 font-weight-medium mb-3 secondary-color">
            Highlights
          </h5> */}
          <div>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
              {highlightsList.map((item: any) => {
                return (
                  <div
                    onClick={() => handleItemClick(item.id)}
                    key={item.id}
                    className="d-flex justify-content-center align-items-center py-1  px-3 rounded-4 my-2 mx-2"
                    style={{
                      width: "max-content",
                      color: isSelected(item.id) ? "white" : "black",
                      backgroundColor: isSelected(item.id)
                        ? "#ef5a60"
                        : "#fdfdfd6e",
                      border: "2px solid white",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={item.icon ? item.icon : defaultIcon}
                      width="20px"
                      alt="icon-img"
                    />
                    <h5 className="font-size-3 font-weight-normal ms-2 my-2 my-0">
                      {item.name}
                    </h5>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestUseInRoomComponent;
