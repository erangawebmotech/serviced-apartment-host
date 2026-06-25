import { Checkbox, Divider, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import { UnitEnum } from "../../../common/uiConstants.ts";
import {
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../../common/commonFunctions.tsx";
import * as constants from "../../../common/constants.ts";
import { getPropertyById } from "../../../service/propertyListingService.ts";
import { Cookies } from "typescript-cookie";
import { useDispatch } from "react-redux";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import { PricePerNightDataObject } from "../../../common/interfaces/uiNecessaryInterface.ts";
import { CurrencyEnum } from "../../../common/enums/currencyEnum.ts";

interface PricePerNightComponentProps {
  propertyPriceDetails: number;
  monthlyPropertyPriceDetails: number;
  onPricePerNightChange: (data: PricePerNightDataObject) => void;
  commissionRate: number;
}

const PricePerNightComponent: React.FC<PricePerNightComponentProps> = ({
  propertyPriceDetails,
  monthlyPropertyPriceDetails,
  onPricePerNightChange,
  commissionRate,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [monthlyPropertyPrice, setMonthlyPropertyPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [monthlyPriceError, setMonthlyPriceError] = useState<string | null>(
    null
  );

  const [isMonthlyRateHave, setIsMonthlyRateHave] = useState<boolean>(false);


  const [form] = Form.useForm();

  useEffect(() => {
    setPropertyPrice(propertyPriceDetails);
    setMonthlyPropertyPrice(monthlyPropertyPriceDetails);
    setIsMonthlyRateHave(monthlyPropertyPriceDetails ? true : false);
    form.setFieldsValue({
      propertyPrice: propertyPriceDetails,
      monthlyPropertyPrice: monthlyPropertyPriceDetails,
    });
  }, [propertyPriceDetails, monthlyPropertyPriceDetails]);

  useEffect(() => {
    sendPricePerNightToParent();
  }, [propertyPrice, monthlyPropertyPrice]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({
        type: "IS_UNIT_DETAILS_SET",
        value: { unitPrice: propertyPrice },
      });
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [propertyPrice]);

  const sendPricePerNightToParent = () => {
    const payload = {
      priceForMaxCount: propertyPrice,
      monthlyRate: monthlyPropertyPrice,
    };

    onPricePerNightChange(payload);
  };

  const clearStates = () => {
    // Reset the form and state
    form.resetFields();
    setPropertyPrice(0);
    setMonthlyPropertyPrice(0);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setPropertyPrice(value);

    if (value < 0) {
      setError("Daily rate cannot be lower than 0.");
    } else {
      setError(null);
    }
  };

  const handleMonthlyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setMonthlyPropertyPrice(value);

    if (value < 0) {
      setMonthlyPriceError("Monthly rate cannot be lower than 0.");
    } else {
      setMonthlyPriceError(null);
    }
  };

  return (
    <div className="PricePerNightComponentContainer  w-100" >
      <div
        className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0"
        style={{ backgroundColor: "#fdfdfd6e" }}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

            }
          }}
        >
          {" "}
          <h5 className="font-size-4 font-weight-normal mt-3">Daily rate</h5>
          <Form.Item
            name="propertyPrice"
            validateStatus={error ? "error" : undefined}
            help={
              error ||
              `Enter the price in ${CurrencyEnum.USD} (including taxes, commission, and fees)`
            }
            className="w-100"
          >
            <Input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              size="large"
              id="propertyPrice"
              name="propertyPrice"
              value={propertyPrice}
              placeholder="Daily rate of your property"
              className="rounded-4 p-3 bg-transparent border border-secondary"
              type="number"
              onChange={handlePriceChange}
              min={0}
            />
          </Form.Item>
          <Checkbox
            checked={isMonthlyRateHave}
            className="me-1 mt-3"
            id="PsyAtPropertyCheckbox"
            onChange={(e) => {
              // console.log(e?.target?.checked);
              setIsMonthlyRateHave(e?.target?.checked);
              if (!e?.target?.checked) {
                setMonthlyPropertyPrice(0);
                form.setFieldsValue({
                  monthlyPropertyPrice: 0,
                });
              }
            }}
          >
            <span className="font-weight-normal font-size-4">
              Enable Monthly Pricing{" "}
            </span>{" "}
          </Checkbox>

          {isMonthlyRateHave && (
            <div className="w-100">
              <h5 className="font-size-4 font-weight-normal mt-3">
                Monthly Rate (≥ 30 Days – Excludes Utility Bills)
              </h5>
              <Form.Item
                name="monthlyPropertyPrice"
                validateStatus={monthlyPriceError ? "error" : undefined}
                help={
                  monthlyPriceError ||
                  `Enter the price in ${CurrencyEnum.USD} (including taxes, commission, and fees)`
                }
                className="w-100"
              >
                <Input
                  size="large"
                  id="monthlyPropertyPrice"
                  name="monthlyPropertyPrice"
                  value={monthlyPropertyPrice}
                  placeholder="Monthly rate of  your property"
                  className="rounded-4 p-3 bg-transparent border border-secondary"
                  type="number"
                  min={0}
                  onChange={handleMonthlyPriceChange}
                />
              </Form.Item>
            </div>
          )}
          <h5 className="font-size-4 font-weight-semi-bold mt-4 ">
            Commission Breakdown :
          </h5>
          <ul className="text-start">
            <li>
              {" "}
              <h5 className="font-size-4 font-weight-semi-bold mb-0 ">
                {commissionRate}% Serviced Apartments LK commission
              </h5>
              <ul className="text-start">
                <li>24/7 support in your preferred language</li>
                <li>Save time with automatically confirmed bookings</li>
                <li>We promote your place on Google</li>
              </ul>
            </li>
          </ul>
          <Divider className="bg-secondary mb-3" />
          <h5 className="font-size-4 font-weight-semi-bold">
            Daily Earnings Calculation
          </h5>
          <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
            Daily rate :
            {propertyPrice >= 0 && (
              <span className="font-weight-medium font-size-4 ms-1">
                {CurrencyEnum.USD}{" "}
                {(
                  propertyPrice
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            )}{" "}
          </h5>
          <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
            Your estimated earnings after fees :
            {propertyPrice >= 0 && (
              <span className="font-weight-semi-bold font-size-3 ms-1">
                {CurrencyEnum.USD}{" "}
                {(
                  propertyPrice -
                  (propertyPrice / 100) * commissionRate
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            )}{" "}
          </h5>
          {isMonthlyRateHave && (
            <div className="w-100">
              <Divider className="bg-secondary my-3" />
              <h5 className="font-size-4 font-weight-semi-bold">
                Monthly Earnings Calculation
              </h5>

              {/* <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                {CurrencyEnum.USD}{" "}
                {monthlyPropertyPrice >= 0 && (
                  monthlyPropertyPrice + " x 30 = " + CurrencyEnum.USD + " " + monthlyPropertyPrice * 30
                )}
              </h5> */}
              <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                Monthly rate :
                {monthlyPropertyPrice >= 0 && (
                  <span className="font-weight-medium font-size-4 ms-1">
                    {CurrencyEnum.USD}{" "}
                    {(
                      monthlyPropertyPrice
                    ).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" + Utility bills"}
                  </span>
                )}
              </h5>
              <h5 className="font-size-4 font-weight-normal d-flex align-items-center">
                Your estimated earnings after fees :
                {monthlyPropertyPrice >= 0 && (
                  <span className="font-weight-semi-bold font-size-3 ms-1">
                    {CurrencyEnum.USD}{" "}
                    {((
                      monthlyPropertyPrice -
                      (monthlyPropertyPrice / 100) * commissionRate
                    )).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" + Utility bills"}
                  </span>
                )}{" "}
              </h5>
            </div>
          )}
          <Divider className="bg-secondary mt-2" />
        </Form>
      </div>
    </div>
  );
};

export default PricePerNightComponent;
