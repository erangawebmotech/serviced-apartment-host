import { Button, Col, Form, Input, Modal, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import TextArea from "antd/es/input/TextArea";
import { changeReservationStatus } from "../../../service/reservationService";
import { ReservationStatusEnum } from "../../../common/enums/reservationStatusEnum";

interface ICalExportURLModal {
  isOpen: boolean;
  exportURL: string;
  propertyName: string;
  loading: boolean; // ✅ new prop
  onClose: () => void;
}

const ICalExportURLModal: React.FC<ICalExportURLModal> = ({
  isOpen,
  exportURL,
  propertyName,
  loading,
  onClose,
}) => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [reasonToReject, setReasonToReject] = useState<string>("");
  const [isApproveChangeStatus, setIsApproveChangeStatus] =
    useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(exportURL)
      .then(() => {
        // console.log("Copied to clipboard successfully!");
        setTimeout(() => {
          messageApi.open({
            type: "success",
            content: "Link copied to clipboard",
          });
          onClose();
        }, 0);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Fail to copy the link to clipboard",
        });
      });
  };

  return (
    <Modal
      title={<h4>Export Link Of {propertyName} </h4>}
      width={500}
      open={isOpen}
      onCancel={() => {
        onClose();
      }}
      centered={true}
      footer={[
        <Button
          onClick={() => {
            copyToClipboard();
          }}
          size="large"
          type="primary"
        >
          Copy URL
        </Button>,
      ]}
    >
      {contextHolder}
      {/* <h4 className="font-size-4 font-weight-medium mt-4">
        Are you sure to this reservation ?
      </h4> */}
      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <h4 className="font-size-4 font-weight-light my-4">
            Copy the exported URL of {propertyName}
          </h4>
          <h4 className="font-size-4 font-weight-medium mt-4">{exportURL}</h4>
        </div>
      )}
    </Modal>
  );
};

export default ICalExportURLModal;
