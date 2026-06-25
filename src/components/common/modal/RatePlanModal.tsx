import React, { FC, useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, InputNumber } from "antd";
import { User } from "react-feather";
import { PriceRatePlan, PriceRatePlanForEntireProperty } from "../../../common/interfaces/uiNecessaryInterface";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";

interface EditPriceModalProps {
  isVisible: boolean;
  initialData: {
    headCount: number;
    price: number;
  };
  onClose: () => void;
  perNightRateList: PriceRatePlan | PriceRatePlanForEntireProperty;
  onSubmit: (updatedData: {
    unitId: any;
    rates: { headCount: number; rate: number }[];
  }) => void;
}

const EditPriceModal: FC<EditPriceModalProps> = ({
  isVisible,
  initialData,
  perNightRateList,
  onClose,
  onSubmit,
}) => {
  const [editData, setEditData] = useState(perNightRateList.rates);

  const handleFormSubmit = () => {
    onSubmit({ unitId: perNightRateList?.unitId, rates: editData });
  };

  const handleInputChange = (index: number, value: number) => {
    // setEditData((prev) =>
    //   prev.map((item, i) =>
    //     i === index ? { ...item, price: parseFloat(value) || 0 } : item
    //   )
    // );

    const parsedValue = (value);
    setEditData((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            rate: isNaN(parsedValue) ? 0 : parseFloat(parsedValue.toFixed(2)),
          }
          : item
      )
    );
  };

  return (
    <Modal
      title="Edit Price Details"
      visible={isVisible}
      onOk={handleFormSubmit}
      onCancel={onClose}
    >
      <Form layout="vertical" className="content-center-input-parent">
        <small className="text-danger mb-4">
          Adjust pricing for different group sizes to attract more bookings.
          Offering lower prices for smaller groups can make your room more
          appealing and increase occupancy.
        </small>
        {editData.map((rateList, index) => (
          <Row
            key={rateList.headCount}
            className="w-100 my-2 d-flex align-items-center"
          >
            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
              <h5 className="font-size-4 font-weight-normal ">
                <User size={25} className="me-2" /> X {rateList.headCount}
              </h5>
            </Col>
            <Col xs={18} sm={15} md={12} lg={12} xl={10} xxl={10}>
              {/* <Input
                size="large"
                // value={rateList.price}
                value={rateList.price.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                addonAfter={CurrencyEnum.USD}
                onChange={(e) => handleInputChange(index, e.target.value)}
                
              /> */}
              <InputNumber
                size="large"
                value={rateList.rate}
                min={0}
                max={100}
                step={1}
                parser={(value) => {
                  const parsedValue = parseInt(
                    value!.replace(/[^0-9]/g, ""),
                    10
                  );
                  return isNaN(parsedValue)
                    ? 0
                    : Math.min(100, Math.max(0, parsedValue));
                }}
                onChange={(value) =>
                  handleInputChange(index, Math.floor(value || 0))
                }
                addonAfter={"%"}
              />
            </Col>
          </Row>
        ))}
      </Form>
    </Modal>
  );
};

export default EditPriceModal;
