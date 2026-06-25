import { Modal } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import { CONTACT_DETAILS } from "../../../common/data/contactDetails";

interface ReservationCancelModal {
  isOpen: boolean;
  selectedReservationId: number;
  status: string;
  onClose: () => void;
}

const ReservationCancelModal: React.FC<ReservationCancelModal> = ({
  isOpen,
  selectedReservationId,
  status,
  onClose,
}) => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [reasonToReject, setReasonToReject] = useState<string>("");
  const [isApproveChangeStatus, setIsApproveChangeStatus] =
    useState<boolean>(false);

  return (
    <Modal
      title={<h4>Cancel Reservation </h4>}
      width={500}
      open={isOpen}
      onCancel={() => {
        onClose();
      }}
      footer={[]}
    >
      <h4 className="font-size-4 font-weight-medium mt-4">
        Contact Serviced Apartments LK to cancel this reservation
      </h4>
      <h4 className="mt-4 p-0 m-0">
        <a
          href={`tel:${CONTACT_DETAILS?.contactNo}`}
          className="text-dark font-size-4 font-weight-medium"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          {" "}
          {CONTACT_DETAILS.contactNo}
        </a>{" "}
      </h4>
      <h4 className="my-0 p-0">
        <a
          href={`mailto:${CONTACT_DETAILS?.email}`}
          className="text-dark font-size-4 font-weight-medium"
          style={{ cursor: "pointer" }}
        >
          {" "}
          {CONTACT_DETAILS.email}
        </a>{" "}
      </h4>
    </Modal>
  );
};

export default ReservationCancelModal;
