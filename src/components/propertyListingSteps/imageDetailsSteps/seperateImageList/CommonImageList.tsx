import CustomImageUploader from "../../../common/ImageUploader/ImageUploader.tsx";
import { Alert } from "antd";
import { useEffect, useRef, useState } from "react";
import { UploadFileStatus } from "antd/es/upload/interface";
import { CancellationPolicyDetailsObject, propertyImage } from "../../../../common/interfaces/uiNecessaryInterface.ts";
import ImageUploadDropzone, { ImageItem } from "./tempUI/ImageUploadDropzone.tsx";
import { area } from "framer-motion/client";

interface propertyImageProps {
    areaDetails: { id: number; name: string };
    propertyImagesData: propertyImage[];
    onDataChange: (data: any) => void;
    isSpecialArea: boolean;
}

const CommonImageList: React.FC<propertyImageProps> = ({
    areaDetails,
    propertyImagesData,
    onDataChange,
    isSpecialArea
}) => {
    const [mainImageInit, setMainImageInit] = useState<propertyImage[]>([]);
    const [otherImageInit, setOtherImageInit] = useState<propertyImage[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);

    const handleImagesChange = (newImages: ImageItem[]) => {
        // setImages(newImages);
        setUploadedImages(newImages)

        let temp: { fileId: string | number; isCover: boolean; altTag: string; }[] = [];

        newImages?.forEach((media) => {
            temp.push({
                fileId: media?.data?.id ?? -1,
                isCover: media?.isCover,
                altTag: media?.altText ?? '',
            });
        });
        const { coverImages, otherImages } = separateImages(temp)

        setPropertyImages({ coverImages, otherImages })
    };

    const setPropertyImages = ({ coverImages, otherImages }: { coverImages: any, otherImages: any }) => {
        if (!coverImages.length && !otherImages.length) {
            return;
        }

        let data: any = []

        if (areaDetails.id === 0) {
            data = [coverImages[0], ...otherImages]
        } else {
            data = [{
                "specialAreaId": areaDetails.id,
                "images": [
                    ...([coverImages[0]]),
                    ...otherImages,
                ]
            }]
        }
        onDataChange(data)

    }


    const separateImages = (images: any[] = []) => {
        const coverImages = images.filter((image) => image?.isCover);
        const otherImages = images.filter((image) => !image?.isCover);
        return { coverImages, otherImages };
    };

    useEffect(() => {
        const { coverImages, otherImages } = separateImages(propertyImagesData)
        setMainImageInit(coverImages)
        setOtherImageInit(otherImages)
        groupImageData(propertyImagesData)

    }, [propertyImagesData]);

    const groupImageData = (data: propertyImage[]) => {
        const groupedData: Record<number, { id: number, coverImages: propertyImage[], otherImages: propertyImage[] }> = {};

        data.forEach(image => {
            const groupId = image.id!;

            if (!groupedData[groupId]) {
                groupedData[groupId] = {
                    id: groupId,
                    coverImages: [],
                    otherImages: []
                };
            }

            if (image.isCover) {
                groupedData[groupId].coverImages.push(image);
            } else {
                groupedData[groupId].otherImages.push(image);
            }
        });

        const finalData = Object.values(groupedData);

        const toImageItem = (img: propertyImage): ImageItem | null => {
            if (!img.file) return null;

            return {
                data: img.file,
                thumbUrl: img.thumbUrl,
                status: 'done',
                altText: img.altTag ?? '',
                isCover: img.isCover ?? false,
            };
        };

        const allImages: ImageItem[] = finalData.flatMap(group => [
            ...group.coverImages.map(toImageItem).filter(Boolean) as ImageItem[],
            ...group.otherImages.map(toImageItem).filter(Boolean) as ImageItem[],
        ]);
        setImages(allImages)
    };


    return <div
        className="d-flex flex-column align-items-center align-items-lg-start my-2 w-100">
        <h5 className="mt-2 mb-3 font-size-3 font-weight-medium subtopic-position secondary-color">
            {areaDetails.name ? areaDetails.name : "Common Property Images"}
        </h5>
        {/* <div className="d-flex w-100 mobile-view-res">
            {!isSpecialArea && <div className="me-3">
                <p>Cover Image </p>

                <CustomImageUploader
                    initialData={mainImageInit}
                    getIds={(data: any) => getMainIdValues(data)}
                    isMainImage={true}
                    resetUploader={resetUploader}
                />

                {mainImagesLoader && <Alert message="Uploading..." type="info"/>}
                {!mainImagesLoader && showImageError && (
                    <Alert message="Change Images and Try Again" type="error"/>
                )}
            </div>}
            <div>
                <p>Other Images </p>

                <CustomImageUploader
                    initialData={otherImageInit}
                    getIds={(data: any) => getOtherIdValues(data)}
                    isMainImage={false}
                    resetUploader={resetUploader}
                />

                {otherImagesLoader && (
                    <Alert message="Uploading..." type="info"/>
                )}
                {!otherImagesLoader && showImageError && (
                    <Alert message="Change Images and Try Again" type="error"/>
                )}


            </div>
        </div> */}
        <div className="d-flex w-100 mobile-view-res">
            <ImageUploadDropzone
                onChange={handleImagesChange}
                value={images}
                maxImages={10}
            />

        </div>

    </div>
}

export default CommonImageList