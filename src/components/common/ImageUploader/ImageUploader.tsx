import React, { useEffect, useState } from "react";
import { Upload, Input, UploadProps, UploadFile, GetProp } from "antd";
import ImgCrop from "antd-img-crop";
import { customToastMsg, handleError } from "../../../common/commonFunctions";
import { UploadFileStatus } from "antd/es/upload/interface";
import { uploadImages } from "../../../service/mediaService.ts";
import { propertyImage } from "../../../common/interfaces/uiNecessaryInterface.ts";
import { useDispatch } from "react-redux";
import { disableButton, enableButton } from "../../../slices/disableUploader/action.ts";
import FsLightbox from "fslightbox-react";

interface imageUploaderProps {
    isMainImage: boolean;
    getIds: (fileList: UploadFile[]) => any;
    initialData?: propertyImage[];
    resetUploader: boolean;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CustomImageUploader: React.FC<imageUploaderProps> = ({
    isMainImage,
    getIds,
    initialData,
    resetUploader,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        getIds(fileList);
    }, [fileList]);
    const [toggler, setToggler] = useState(false);

    const [viewImage, setViewImage] = useState<string>('');


    useEffect(() => {
        if (initialData !== undefined) {
            // console.log(initialData)
            const transformedData = initialData?.map((data: any) =>
                data?.id
                    ? {
                        uid: data?.id,
                        name: "52254",
                        status: "done" as UploadFileStatus,
                        url: data?.file?.originalPath,
                        thumbUrl: data?.file?.smallPath,
                        customId: data?.id,
                        altText: data?.altTag,
                    }
                    : {}
            );

            const ids = initialData.map((data: any) => data.id);
            // @ts-ignore
            setFileList(transformedData);
            setUploadedFileIds(ids);
        } else {
        }
    }, [initialData]);

    useEffect(() => {
        if (resetUploader) {
            setFileList([]);
        }
    }, [resetUploader]);

    const handleUpload = async (
        file: any,
        onSuccess: (response: any, file: any) => void,
        onError: (error: any) => void
    ) => {
        const formData = new FormData();
        dispatch(disableButton());
        formData.append("files", file.file);

        try {
            const response = await uploadImages(formData);
            await setUploadedFileIds((prevIds) => [...prevIds, response.data.id]); // Store the new ID
            const updatedFileList = fileList.map((fileNew) => {
                return fileNew?.customId === undefined
                    ? { ...fileNew, customId: response.data.id }
                    : fileNew;
            });
            setFileList(updatedFileList);
            onSuccess(response, file?.file);
            dispatch(enableButton());

        } catch (error) {
            // console.log(fileList, file)
            handleError(error);
            // console.error("Error uploading image:");
            onError(false);
            dispatch(enableButton())

            setTimeout(() => {
                setFileList((prevFileList) =>
                    prevFileList.filter((item) => item.uid !== file.file.uid)
                );
            }, 1000);
        }
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const props: UploadProps = {
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/webpg';
            if (!isPNG) {
                customToastMsg('This file type is not acceptable', 0)
            }
            return isPNG || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            // console.log(info.fileList);
        },
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        setToggler(!toggler)

        // console.log([src])

        setViewImage(src)
        // const imgWindow = window.open(src);
        // imgWindow?.document.write(image.outerHTML);
    };

    const deleteFile = (file: UploadFile) => {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        const newUploadedFileIds = uploadedFileIds.filter(
            (id) => id !== file.response?.data.id
        ); // Safely access response data
        setUploadedFileIds(newUploadedFileIds);
        setFileList(newFileList);
        getIds(newFileList);
    };

    const uploadButton = (
        <div>
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const itemRender = (originNode: any, file: any) => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {originNode}
            <Input
                className="my-2"
                value={file.altText || ""}
                placeholder="Alt text"
                onChange={(e) => handleAltTextChange(file.uid, e.target.value, file)}
                style={{ marginTop: 8 }}
            />
        </div>
    );

    const handleAltTextChange = (fileUid: string, altText: string, file: any) => {
        setFileList((prevList) =>
            prevList.map((file) => {
                if (file.uid === fileUid) {
                    return { ...file, altText: altText || "" };
                }
                return file;
            })
        );
    };

    // @ts-ignore
    return (
        <div className="mb-4  mobile-view-uploader-res ">
            {/* <ImgCrop
        fillColor={"transparent"}
        style={{ position: "absolute", zIndex: "9999999999 !important" }}
        rotate
      > */}

            <FsLightbox
                toggler={toggler}
                sources={[
                    viewImage
                ]}
            />

            <Upload {...props}
                onRemove={deleteFile}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={onPreview}
                customRequest={({ file, onSuccess, onError }) => {
                    // @ts-ignore
                    handleUpload({ file }, onSuccess, onError);
                }}
                multiple={!isMainImage}
                itemRender={itemRender}
            >
                {fileList.length >= (isMainImage ? 1 : 20) ? null : uploadButton}
            </Upload>
            {/* </ImgCrop> */}
        </div>
    );
};

export default CustomImageUploader;
