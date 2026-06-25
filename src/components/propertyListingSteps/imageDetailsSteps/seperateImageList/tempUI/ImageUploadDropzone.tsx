import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;
const { Text } = Typography;
import {
    Upload,
    Row,
    Col,
    Input,
    Card,
    Typography,
    message,
    Badge,
    Button,
    Skeleton
} from 'antd';
import { uploadImages } from "../../../../../service/mediaService";
import { Trash2 } from "react-feather";
import { handleError } from "../../../../../common/commonFunctions";

export interface ImageItem {
    data: {
        id: number,
        largePath: string;
        mediumPath: string;
        originalName: string;
        originalPath: string;
        smallPath: string;
    };
    thumbUrl?: string;
    status: 'done' | 'uploading' | 'error' | 'removed';
    altText: string;
    isCover: boolean;
};

export interface DataProps {
    id: number,
    largePath: string;
    mediumPath: string;
    originalName: string;
    originalPath: string;
    smallPath: string;

}

interface ImageUploadDropzoneProps {
    onChange: (images: ImageItem[]) => void;
    maxImages?: number;
    value?: ImageItem[];
}

const ItemTypes = {
    IMAGE: 'image',
};

const ImageCard: React.FC<{
    item: ImageItem;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    onAltTextChange: (uid: string, altText: string) => void;
    onSetCover: (uid: string) => void;
    onRemove: (uid: string) => void;
}> = ({ item, index, moveItem, onAltTextChange, onSetCover, onRemove }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Set up drag source
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.IMAGE,
        item: () => ({ index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Set up drop target
    const [, drop] = useDrop({
        accept: ItemTypes.IMAGE,
        hover: (draggedItem: { index: number }, monitor) => {
            if (!ref.current) {
                return;
            }

            const dragIndex = draggedItem.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Get rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Get mouse position
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) {
                return;
            }

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveItem(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            draggedItem.index = hoverIndex;
        },
    });

    // Connect drag and drop refs
    drag(drop(ref));
    return (
        <Card
            ref={ref}
            key={index}
            hoverable
            bodyStyle={{ padding: 5 }}
            style={{
                marginBottom: 16,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                borderColor: item?.isCover ? '#1890ff' : undefined,
                position: 'relative',
            }}
            cover={
                <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
                    <img
                        alt={item?.altText || item?.data?.originalName}
                        src={item.data?.largePath}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            }
            actions={[
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
                    <Button
                        type={item?.isCover ? "primary" : "default"}
                        size="small"
                        onClick={() => onSetCover(item?.data?.id?.toString())}
                        style={{ fontSize: '12px' }}
                    >
                        {item?.isCover ? 'Cover Image' : 'Set as Cover'}
                    </Button>
                    <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => onRemove(item?.data?.id?.toString())}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>

            ]}
        >
            <Input
                placeholder="Add alt text for accessibility"
                value={item?.altText}
                onChange={(e) => onAltTextChange(item?.data?.id?.toString(), e.target.value)}
                style={{ marginTop: '8px' }}
            />
        </Card>
    );
};



const CoverDropZone: React.FC<{
    onDrop: () => void;
    hasCover: boolean;
    coverImage?: ImageItem;
}> = ({ onDrop, hasCover, coverImage }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.IMAGE,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });


    return (
        <div
            ref={drop}
            style={{
                marginBottom: '16px',
                borderRadius: '8px',
                borderWidth: '2px',
                borderStyle: 'dashed',
                borderColor: isOver ? '#1890ff' : '#d9d9d9',
                backgroundColor: isOver ? '#e6f7ff' : hasCover ? '#f5f5f5' : '#ffffff',
                height: 250,
                width: '100%',
                overflow: 'hidden',
                transition: 'all 0.3s',
            }}
        >
            {hasCover ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                        src={coverImage?.data?.largePath}
                        alt={coverImage?.altText || "Cover image"}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Text style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '4px'
                    }}>
                        Cover Image
                    </Text>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                }}>
                    <Text style={{ color: '#8c8c8c' }}>
                        Cover Image
                    </Text>
                </div>
            )}
        </div>
    );
};

const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({ onChange, maxImages = Infinity, value = [] }) => {
    const [fileList, setFileList] = useState<ImageItem[]>(value);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        if (value && value.length > 0) {
            setFileList(value);
        }
    }, [value]);

    useEffect(() => {
        const hasCover = fileList.some((item) => item.isCover);

        if (!hasCover && fileList.length > 0) {
            setFileList((prev) =>
                prev.map((img, index) => ({
                    ...img,
                    isCover: index === 0,
                }))
            );
        }
        onChange(fileList);
    }, [fileList, value, onChange]);



    const handleBeforeUpload = async (file: RcFile): Promise<boolean> => {

        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 25;
        if (!isLt5M) {
            message.error('Image must be smaller than 25MB!');
            return false;
        }

        // Check if we've reached the max number of images
        if (fileList.length >= maxImages) {
            message.error(`You can only upload a maximum of ${maxImages} images!`);
            return false;
        }

        const formData = new FormData();
        formData.append('files', file);

        setUploading(true)
        await uploadImages(formData).then(async (res) => {
            if (!res?.data) {
                return;
            }

            const data: DataProps[] = res?.data;

            const newImageObject: ImageItem = {
                data: data[0],
                status: "done",
                altText: "",
                isCover: false,
            }

            setFileList((prev) => [...prev, newImageObject]);

        }).catch((error) => {
            handleError(error)
        }).finally(() => {
            setUploading(false)
            return true;
        })
        return false;
    };

    // Handle removing an image
    const handleRemove = (uid: string) => {
        const updatedList = fileList.filter((item) => item?.data?.id?.toString() !== uid);

        // If the removed image was the cover, set the first image as cover
        if (fileList.find(item => item?.data?.id?.toString() === uid)?.isCover && updatedList.length > 0) {
            updatedList[0].isCover = true;
        }

        setFileList(updatedList);
    };

    // Handle alt text changes
    const handleAltTextChange = (uid: string, altText: string) => {
        setFileList((prev) =>
            prev.map((item) =>
                item?.data?.id?.toString() === uid ? { ...item, altText } : item
            )
        );
    };

    const handleSetCover = (uid: string) => {
        setFileList((prev) =>
            prev.map((img) => ({
                ...img,
                isCover: img.data.id.toString() === uid,
            }))
        );
    };

    // Handle drag and drop reordering
    const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
        setFileList((prevItems) => {
            const newItems = [...prevItems];

            const [draggedItem] = newItems.splice(dragIndex, 1);
            newItems.splice(hoverIndex, 0, draggedItem);

            return newItems.map((item) => ({ ...item, isCover: false }));
        });
    }, []);

    // Get the current cover image
    const coverImage = fileList.find((item) => item.isCover);
    const hasCover = !!coverImage;

    // Handle dropping an image onto the cover zone
    const handleCoverDrop = useCallback(() => {
        const lastDraggedItem = fileList.find((_, index) => index === 0);
        if (lastDraggedItem) {
            handleSetCover(lastDraggedItem.data?.id?.toString());
        }
    }, [fileList]);



    return (
        <DndProvider backend={HTML5Backend} >
            <div className="image-upload-dropzone" style={{ marginRight: '20px' }}>
                <Row gutter={15}>
                    <Col xs={24} sm={24} md={12} lg={11}>
                        <CoverDropZone
                            onDrop={handleCoverDrop}
                            hasCover={hasCover}
                            coverImage={coverImage}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={13}>
                        <Dragger
                            accept="image/*"
                            fileList={[]}
                            beforeUpload={handleBeforeUpload}
                            showUploadList={false}
                            multiple={true}
                            className="transition-all"
                            style={{ width: "100%", minHeight: 250, maxHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag files to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for single or bulk upload. Strictly prohibited from uploading company data or other
                                prohibited files.
                            </p>
                            {
                                uploading && (
                                    <p className="ant-upload-text" style={{ fontSize: '13px' }}>
                                        Uploading...
                                    </p>
                                )
                            }
                        </Dragger>

                    </Col>
                </Row>



                <div style={{ marginTop: '24px' }}>
                    <Row gutter={[16, 16]}>
                        {
                            fileList.map((item, index) => {
                                return (
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} key={item?.data?.id}>
                                        <ImageCard
                                            item={item}
                                            index={index}
                                            moveItem={moveItem}
                                            onAltTextChange={handleAltTextChange}
                                            onSetCover={handleSetCover}
                                            onRemove={handleRemove} />
                                    </Col>
                                )
                            })

                        }
                        {uploading && (
                            Array.from({ length: 1 }).map((_, index) => (
                                <Col xs={24} sm={12} md={12} lg={8} xl={6} key={`skeleton-${index}`}>
                                    <Skeleton.Image active style={{ width: 200, height: 250 }} />
                                </Col>
                            ))

                        )}
                    </Row>
                </div>

            </div>
        </DndProvider>
    )
}

export default ImageUploadDropzone