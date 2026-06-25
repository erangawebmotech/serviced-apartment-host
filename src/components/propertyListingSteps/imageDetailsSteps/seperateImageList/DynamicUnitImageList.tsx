import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row } from "antd";
import CommonImageList from "./CommonImageList";
import { propertyImage } from "../../../../common/interfaces/uiNecessaryInterface.ts"; // Assuming the child component is based on this template

interface Unit {
    id: number;
    name: string | null;
    unitImages: any[];
}

interface UnitImageData {
    unitId: number;
    images: {
        fileId: number | string;
        altTag?: string;
        isCover: boolean;
    }[];
}

const DynamicUnitImageList = ({
    units,
    onSave,
}: {
    units: Unit[];
    onSave: (data: UnitImageData[]) => void;
}) => {
    const [unitImages, setUnitImages] = useState<UnitImageData[]>([]);
    const [mainImageInit, setMainImageInit] = useState<propertyImage[]>([]);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [groupedImages, setGroupedImages] = useState<{ unitId: number; images: propertyImage[] }[]>([])
    const handleChildDataChange = (newData: UnitImageData) => {
        const existingIndex = unitImages.findIndex(item => item.unitId === newData.unitId);

        if (existingIndex !== -1) {
            const existing = unitImages[existingIndex];

            const isSameData = JSON.stringify(existing.images) === JSON.stringify(newData.images);
            if (isSameData) return;

            setUnitImages(prev => {
                const updatedState = [...prev];
                updatedState[existingIndex] = newData;
                return updatedState;
            });
        } else {
            setUnitImages(prev => [...prev, newData]);
        }
    };


    // const handleChildDataChange = (newData: UnitImageData) => {
    //     console.log('New Data: ', newData)

    //     if (unitImages.length) {
    //         const existing = unitImages.find((image) => image?.unitId === newData?.unitId)
    //         if (existing) {
    //             console.log(existing)
    //             setUnitImages((prev) => {
    //                 const existingIndex = prev.findIndex(
    //                     (item) => item.unitId === newData.unitId
    //                 );
    //                 if (existingIndex !== -1) {
    //                     const updatedState = [...prev];
    //                     updatedState[existingIndex] = newData;
    //                     return updatedState;
    //                 } else {
    //                     return [...prev, newData];
    //                 }

    //             }

    //             )
    //         }
    //     } else {
    //         setUnitImages([newData])
    //     }

    // };

    // setUnitImages((prevState) => {
    //     const existingIndex = prevState.findIndex(
    //         (item) => item.unitId === newData.unitId
    //     );
    //     console.log('Index Number : ',existingIndex)

    //     if (existingIndex !== -1) {
    //         const updatedState = [...prevState];
    //         updatedState[existingIndex] = newData;
    //         return updatedState;
    //     } else {
    //         return [...prevState, newData];
    //     }
    // });


    useEffect(() => {
        // const flattenedData = unitImages.map((unit) => ({
        //     unitId: unit.unitId,
        //     images: unit.images.flatMap((img) => img.images || img), // Flatten nested `images`
        // }));
        onSave(unitImages);
    }, [unitImages]);

    // useEffect(() => {
    //     console.log('Units xxxxxxxxxxxxxxxxxx ', units)
    //     let images: propertyImage[] = []
    //     units.map((unit) => {
    //         images = [];
    //         unit.unitImages.map((imageDetails: propertyImage) => {
    //             images.push(
    //                 {
    //                     id: unit?.id,
    //                     isCover: imageDetails?.isCover,
    //                     altTag: imageDetails?.altTag,
    //                     file: imageDetails?.file,
    //                     url: imageDetails?.file?.originalPath,
    //                     thumbUrl: imageDetails?.file?.smallPath,
    //                 }
    //             )
    //         })
    //     })
    //     console.log('After Process Unit Images : ', images)
    //     setMainImageInit(images)
    // }, [units]);

    useEffect(() => {
        const allImages: propertyImage[] = [];

        units.forEach((unit) => {
            unit.unitImages.forEach((imageDetails: propertyImage) => {
                allImages.push({
                    id: unit.id,
                    isCover: imageDetails.isCover,
                    altTag: imageDetails.altTag,
                    file: imageDetails.file,
                    url: imageDetails.file?.originalPath,
                    thumbUrl: imageDetails.file?.smallPath,
                });
            });
        });

        setMainImageInit(allImages);

        // 👇 Group by unitId into desired format


        const newGroupedImages: { unitId: number; images: propertyImage[] }[] = [];

        allImages.forEach((img) => {
            const existingIndex = newGroupedImages.findIndex((group) => group.unitId === img.id);

            if (existingIndex !== -1) {
                newGroupedImages[existingIndex].images.push(img);
            } else {
                newGroupedImages.push({
                    unitId: img?.id!,
                    images: [img],
                });
            }
        });

        setGroupedImages(newGroupedImages);
    }, [units]);

    return (
        <div className="my-3 w-100 dynamic-unit-image-list">
            {units.length > 0 && windowWidth > 426 ?
                <Divider orientationMargin="0" orientation={"left"}>Room Images In Your Property <small>(Add more than 5
                    images)</small></Divider> : units.length > 0 && windowWidth < 426 ?
                    <span>Room Images In Your Property <small>(Add more than 5
                        images)</small></span> : <span></span>
            }
            {units.length > 0 && <Row>
                {units.map((unit, index) => {
                    return (
                        <Col key={index} xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <CommonImageList
                                isSpecialArea={false}
                                // propertyImagesData={mainImageInit}
                                propertyImagesData={
                                    groupedImages.find((data) => data.unitId === unit.id)?.images || []
                                }
                                areaDetails={{ id: unit.id, name: unit.name === null ? 'Room' : unit.name }}
                                onDataChange={(images) =>
                                    handleChildDataChange({ unitId: images[0]?.specialAreaId, images: images[0]?.images })
                                    // handleChildDataChange({unitId: unit.id, images})
                                }
                            />
                        </Col>
                    )
                })}
            </Row>}

        </div>

    );
};

export default DynamicUnitImageList;
