import { Button, Col, Form, Input, Modal, Row, message } from "antd";
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

interface ReservationStatusChangeModalProps {
  isOpen: boolean;
  selectedReservationId: number;
  status: string;
  onClose: () => void;
  loadReservations: () => void;
}

const ReservationStatusChangeModal: React.FC<ReservationStatusChangeModalProps> = ({
  isOpen,
  selectedReservationId,
  status,
  onClose,
  loadReservations,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useNavigate();

  const [reasonToReject, setReasonToReject] = useState<string>("");
  const [isApproveChangeStatus, setIsApproveChangeStatus] =
    useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
    }
  }, [isOpen]);

  const clearInputs = () => {
    form.resetFields();
    setReasonToReject("");
    setIsApproveChangeStatus(false);
  };

  const handleChangeReservationStatus = () => {
    form
      .validateFields()
      .then((values) => {
        let data: {
          status: string;
          reason: string;
        } = { status: "", reason: "" };

        status === ReservationStatusEnum.REJECTED
          ? (data = {
            status: ReservationStatusEnum.REJECTED,
            reason: reasonToReject.trim(),
          })
          : status === ReservationStatusEnum.APPROVED
            ? (data = {
              status: ReservationStatusEnum.APPROVED,
              reason: "",
            })
            : status === ReservationStatusEnum.NO_SHOW
              ? (data = {
                status: ReservationStatusEnum.NO_SHOW,
                reason: "",
              })
              : "";

        // console.log(data);
        popUploader(dispatch, true);
        changeReservationStatus(selectedReservationId, data)
          .then(() => {
            onClose();
            loadReservations();
            clearInputs();
            popUploader(dispatch, false);
            customToastMsg(
              `Reservation ${status === ReservationStatusEnum.REJECTED
                ? "rejected"
                : status === ReservationStatusEnum.APPROVED
                  ? "approved"
                  : status === ReservationStatusEnum.NO_SHOW
                    ? "mark as no show"
                    : ""
              } successfully`,
              1
            );
          })
          .catch((error) => {
            popUploader(dispatch, false);
            handleError(error);
          });
      })
      .catch((error) => {
        status === ReservationStatusEnum.REJECTED && reasonToReject === ""
          ? customToastMsg("Reason cannot be empty", 2)
          : "";
      });
  };

  return (
    <Modal
      title={
        status != ReservationStatusEnum.NO_SHOW ?
          <h4>
            {status === ReservationStatusEnum.REJECTED
              ? "Reject"
              : status === ReservationStatusEnum.APPROVED
                ? "Approve"
                : ""}{" "}
            Reservation{" "}
          </h4> : <h4>
            Reservation Mark As No Show
          </h4>
      }
      width={500}
      open={isOpen}
      onCancel={() => {
        onClose();
      }}
      centered={true}
      afterClose={() => clearInputs()}
      footer={
        [
          !isApproveChangeStatus && (
            <Button
              onClick={() => {
                onClose();
              }}
              size="large"
            >
              No
            </Button>
          ),
          !isApproveChangeStatus && (
            <Button
              onClick={() => {
                {
                  status === ReservationStatusEnum.REJECTED
                    ? setIsApproveChangeStatus(true)
                    : status === ReservationStatusEnum.APPROVED
                      ? handleChangeReservationStatus()
                      : status === ReservationStatusEnum.NO_SHOW
                        ? handleChangeReservationStatus()
                        : "";
                }
              }}
              size="large"
              type="primary"
            >
              Yes,{" "}
              {status === ReservationStatusEnum.REJECTED
                ? "Reject !"
                : status === ReservationStatusEnum.APPROVED
                  ? "Approve !"
                  : status === ReservationStatusEnum.NO_SHOW
                    ? "Mark As No Show !"
                    : ""}{" "}
            </Button>
          ),
          isApproveChangeStatus && (
            <Button
              onClick={() => {
                onClose();
              }}
              size="large"
            >
              Cancel
            </Button>
          ),
          isApproveChangeStatus && (
            <Button
              onClick={() => {
                handleChangeReservationStatus();
              }}
              size="large"
              type="primary"
            >
              {status === ReservationStatusEnum.REJECTED
                ? "Reject"
                : status === ReservationStatusEnum.APPROVED
                  ? "Approve"
                  : status === ReservationStatusEnum.NO_SHOW
                    ? "Mark As No Show"
                    : ""}{" "}
              Reservation
            </Button>
          ),
        ]}
    >
      {status != ReservationStatusEnum.NO_SHOW ? <h4 className="font-size-4 font-weight-medium mt-4">
        Are you sure to{" "}
        {status === ReservationStatusEnum.REJECTED
          ? "reject"
          : status === ReservationStatusEnum.APPROVED
            ? "approve"
            : ""}{" "}
        this reservation ?
      </h4> : <h4 className="font-size-4 font-weight-medium mt-4">
        Are you sure to mark this reservation as no show ?
      </h4>}

      {
        status === ReservationStatusEnum.APPROVED && (
          <h4 className="font-size-4 font-weight-light mb-4">
            Approve this reservation to confirm the guest's stay. The guest will
            be notified once approved.
          </h4>
        )
      }
      {
        status === ReservationStatusEnum.NO_SHOW && (
          <h4 className="font-size-4 font-weight-light mb-4">
            Guest will notify this action and you will not get any payment for this reservation If payment has not already been received
          </h4>
        )
      }
      {
        status === ReservationStatusEnum.REJECTED && (
          <h4 className="font-size-4 font-weight-light mb-4">
            Reject this reservation if you are unable to accommodate the guest.
            They will be notified of your decision.
          </h4>
        )
      }

      {
        status === ReservationStatusEnum.REJECTED && isApproveChangeStatus && (
          <Form form={form} layout="vertical" className="mt-4">
            <Row>
              <Col sm={24} md={24}>
                {" "}
                <Form.Item
                  name="reasonToReject"
                  label="Reason"
                  rules={[{ required: true, message: "Reason cannot be empty" }, {
                    validator: (_, value) =>
                      value && value.trim() !== ""
                        ? Promise.resolve()
                        : Promise.reject(new Error("Reason cannot be just spaces")),
                  }]}
                >
                  <TextArea
                    size="large"
                    id="reasonToReject"
                    name="reasonToReject"
                    value={reasonToReject}
                    maxLength={300}
                    style={{ height: 120, resize: "none" }}
                    placeholder="Enter reason to reject reservation"
                    onChange={(e) => setReasonToReject(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )
      }
    </Modal >
  );
};

export default ReservationStatusChangeModal;
