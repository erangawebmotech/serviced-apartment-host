import { Button, Card, Col, Row, Tag } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";
import { DiscountDetailsObj } from "../../../common/interfaces/uiNecessaryInterface";
import { DiscountTypeEnum } from "../../../common/enums/discountTypeEnum";

interface DiscountTypeCardProps {
  key: number;
  discountData: DiscountDetailsObj;
  // typeColor: string;
  handleSelectDiscount: (selectedDiscount: DiscountDetailsObj) => void;
  handleRemoveDiscount: (selectedDiscountId: number) => void;
}

const DiscountTypeCard: React.FC<DiscountTypeCardProps> = ({
  key,
  discountData,
  // typeColor,
  handleSelectDiscount,
  handleRemoveDiscount,
}) => {

  return (
    <Card
      key={key}
      hoverable
      className="my-2 mx-2"
      bordered={true}
    // style={{ borderBottom: `4px solid ${typeColor}` }}
    >
      <h5 className="font-size-4">{discountData?.discount?.name}</h5>
      <p className="font-size-5">{discountData?.discount?.description}</p>

      {discountData?.alreadyApplied ? (
        <Row className="my-1 w-100">
          <Col xs={24} sm={8} md={8} lg={24} xl={24} xxl={8} className="mb-3">
            <Tag color="blue">Already Added</Tag>
          </Col>
          {discountData.discount.discountType === DiscountTypeEnum.DURATIONAL
            ? <Col
              xs={24}
              sm={16}
              md={16}
              lg={24}
              xl={24}
              xxl={16}
              className="d-flex justify-content-end flex-column flex-sm-row"
            >
              <Button
                onClick={() => {
                  handleSelectDiscount(discountData);
                }}
                size="large"
                type="primary"
                className="me-0 me-sm-4 mb-3 mb-sm-0"
              >
                Manage Discounts
              </Button>
            </Col>
            : <Col
              xs={24}
              sm={16}
              md={16}
              lg={24}
              xl={24}
              xxl={16}
              className="d-flex justify-content-end flex-column flex-sm-row"
            >
              <Button
                onClick={() => {
                  handleSelectDiscount(discountData);
                }}
                size="large"
                type="primary"
                className="me-0 me-sm-4 mb-3 mb-sm-0"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  handleRemoveDiscount(discountData?.discount?.id);
                }}
                size="large"
                type="primary"
              >
                Remove
              </Button>
            </Col>}
        </Row>
      ) : (
        <Row className="my-1">
          <Button
            onClick={() => {
              handleSelectDiscount(discountData);
            }}
            size="large"
            type="primary"
          >
            Add Discount
          </Button>
        </Row>
      )}
    </Card>
  );
};

export default DiscountTypeCard;
