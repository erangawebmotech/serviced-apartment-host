import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row } from "antd";
import CommonImageList from "./CommonImageList.tsx";
import {
  propertyImage,
  PropertyImagesRapterObj,
} from "../../../../common/interfaces/uiNecessaryInterface.ts";

interface Area {
  name: string;
  id: number;
  areaImages: [];
}

interface SpecialAreaImages {
  specialAreaId: number;
  images: {
    fileId: number;
    altTag?: string;
    isCover: boolean;
  }[];
}

interface specialAreImageInterface {
  id: number;
  name: string;
  areaImages: any;
}

interface DynamicSpecialAreaProps {
  areas: PropertyImagesRapterObj[];
  onSave: (data: SpecialAreaImages[]) => void;
  specialAreImage: propertyImage[];
}

const DynamicSpecialAreaList: React.FC<DynamicSpecialAreaProps> = ({
  areas,
  onSave,
  specialAreImage,
}) => {
  const [areaImages, setAreaImages] = useState<SpecialAreaImages[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // console.log(areas);


  // const handleChildDataChange = (newData: SpecialAreaImages) => {
  //   console.log('New Data 2  : ', newData)
  // setAreaImages((prevState) => {
  //   const existingIndex = prevState.findIndex(
  //     (item) => item.specialAreaId === newData.specialAreaId
  //   );

  //   if (existingIndex !== -1) {
  //     const updatedState = [...prevState];
  //     updatedState[existingIndex] = newData;
  //     return updatedState;
  //   } else {
  //     return [...prevState, newData];
  //   }
  // });
  // };
  const handleChildDataChange = (newData: SpecialAreaImages) => {
    const existingIndex = areaImages.findIndex(item => item.specialAreaId === newData.specialAreaId);

    if (existingIndex !== -1) {
      const existing = areaImages[existingIndex];

      const isSameData = JSON.stringify(existing.images) === JSON.stringify(newData.images);
      if (isSameData) return;

      setAreaImages(prev => {
        const updatedState = [...prev];
        updatedState[existingIndex] = newData;
        return updatedState;
      });
    } else {
      setAreaImages(prev => [...prev, newData]);
    }
  };

  useEffect(() => {
    // Process and flatten the areaImages before sending to the parent
    // const flattenedData = areaImages.map((area) => ({
    //   specialAreaId: area.specialAreaId,
    //   images: area.images.flatMap((img) => img.images || img), // Flatten nested images
    // }));
    onSave(areaImages);
  }, [areaImages]);

  useEffect(() => { }, [specialAreImage]);
  // console.log(windowWidth);
  return (
    <div className="my-3 w-100 dynamic-special-area-list">
      {windowWidth > 426 ? (
        <div>
          {areas.length > 0 && (
            <Divider orientationMargin="0" orientation={"left"}>
              Special Areas In Your Property{" "}
              <small>(Add more than 5 images)</small>
            </Divider>
          )}
        </div>
      ) : (
        <div>
          {areas.length > 0 && (
            <span>
              {" "}
              Special Areas In Your Property{" "}
              <small>(Add more than 5 images)</small>
            </span>
          )}
        </div>
      )}
      <Row className="w-100">
        {areas.map((area, index) => (
          <Col key={area.id} xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <CommonImageList
              isSpecialArea={true}
              propertyImagesData={[specialAreImage[index]]} 
              // propertyImagesData={specialAreImage[index]?.areaImages}
              areaDetails={area}
              onDataChange={(images) =>
                // handleChildDataChange(images)
                handleChildDataChange({ specialAreaId: images[0]?.specialAreaId, images: images[0]?.images })
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DynamicSpecialAreaList;
