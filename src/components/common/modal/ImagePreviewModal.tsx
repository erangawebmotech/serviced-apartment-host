import React, { useState } from "react";
import { Modal, Image, Spin, Row } from "antd";

interface ImagePreviewProps {
  images: string[];
  title: string;
  open: boolean;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewProps> = ({
  images,
  title,
  open,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [loading, setLoading] = useState(false);

  const handleThumbnailClick = (img: string) => {
    setLoading(true);
    const preload = new window.Image();
    preload.src = img;
    preload.onload = () => {
      setSelectedImage(img);
      setLoading(false);
    };
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
    >
      <Row className="w-100 d-flex justify-content-center">
        {/* Main Image Display */}
        <div className="d-flex justify-content-center align-items-center mb-4 mt-3 h-100 w-100">
          <img
            src={selectedImage}
            alt="Selected"
            width="100%"
            height="100%"
            style={{
              maxHeight: 400,
              maxWidth: 800,
              objectFit: "cover",
              borderRadius: 8,
              opacity: loading ? 0.8 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            draggable={false}
          />
          {/* Show spinner when loading */}
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
            >
              <Spin size="large" />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="d-flex flex-wrap justify-content-center overflow-x-auto gap-2 px-2">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              width={100}
              height={70}
              style={{
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
                border:
                  img === selectedImage
                    ? "2px solid #1890ff"
                    : "1px solid #d9d9d9",
              }}
              onClick={() => handleThumbnailClick(img)}
              preview={false}
            />
          ))}
        </div>
      </Row>
    </Modal>
  );
};

export default ImagePreviewModal;
