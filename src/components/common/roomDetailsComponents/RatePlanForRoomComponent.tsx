import { Button, Checkbox, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";

import {
  getDecryptedCookie,
  handleError,
  popUploader,
} from "../../../common/commonFunctions.tsx";
import { User } from "react-feather";
import * as constants from "../../../common/constants.ts";
import { Cookies } from "typescript-cookie";
import { getPropertyById } from "../../../service/propertyListingService.ts";
import { useDispatch, useSelector } from "react-redux";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO.ts";
import EditPriceModal from "../modal/RatePlanModal.tsx";
import {
  PriceRatePlan,
  PriceRatePlanDataObject,
} from "../../../common/interfaces/uiNecessaryInterface.ts";
import { RootState } from "../../../slices/rootReducer.ts";
import { CurrencyEnum } from "../../../common/enums/currencyEnum.ts";

interface RatePlanForRoomComponentProps {
  perNightRateListDetails: PriceRatePlan;
  perNightOverallDetailsData: any;
  onRatePlanForRoomChange: (data: PriceRatePlanDataObject[]) => void;
}

const RatePlanForRoomComponent: React.FC<RatePlanForRoomComponentProps> = ({
  perNightRateListDetails,
  perNightOverallDetailsData,
  onRatePlanForRoomChange,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [perNightRateList, setPerNightRateList] = useState<PriceRatePlan>();
  const [perNightOverallDetails, setPerNightOverallDetails] = useState<{
    headCount: number;
    priceForMaxCount: number;
  }>();
  const [isRatePlaneAvailable, setIsRatePlaneAvailable] =
    useState<boolean>(false);

  const guestCount = useSelector(
    (state: RootState) => state.property.guestCount
  );
  const unitPrice = useSelector((state: RootState) => state.property.unitPrice);

  useEffect(() => {
    // console.log(
    //   perNightRateListDetails,
    //   perNightOverallDetailsData,
    //   "+++++++++++++++++++++++++"
    // );
    setPerNightRateList(perNightRateListDetails);
    setPerNightOverallDetails(perNightOverallDetailsData);

    const rates = perNightRateListDetails?.rates;
    const isRatePlanAvailable = Array.isArray(rates) && rates.length > 0 && rates.some(rateObj => rateObj.rate > 0);
    setIsRatePlaneAvailable(isRatePlanAvailable);

  }, [perNightRateListDetails, perNightOverallDetailsData]);

  useEffect(() => {
    getUnitPriceGestCountWise();
  }, [guestCount, unitPrice]);

  const getUnitPriceGestCountWise = () => {
    // Prevent updating if priceForMaxCount matches unitPrice AND all prices in perNightRateListDetails match unitPrice

    setPerNightOverallDetails({
      headCount: guestCount || 0,
      priceForMaxCount: 0,
    });

    const shouldNotUpdate =
      perNightOverallDetailsData?.headCount === guestCount &&
      perNightRateListDetails?.rates.some((item) => item?.rate !== 2);

    if (shouldNotUpdate) return; // Exit if update is not needed

    const unitId = parseFloat(Cookies.get(constants.ROOM_ID) as string);
    if (!guestCount || !unitPrice) return;

    let unitPricesList: PriceRatePlan = {
      unitId: unitId,
      rates: Array.from({ length: guestCount }, (_, index) => ({
        headCount: index + 1,
        rate: 0,
      })).filter((priceObj) => priceObj.headCount !== guestCount),
    };

    setPerNightRateList(unitPricesList);

    // console.log(guestCount, "guestCount", unitPrice, "unitPrice");
  };

  useEffect(() => {
    sendRatePlanToParentComponent();
  }, [perNightRateList]);

  const sendRatePlanToParentComponent = () => {
    onRatePlanForRoomChange(perNightRateList?.rates || []);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (updatedData: any) => {
    // console.log(updatedData);
    setPerNightRateList(updatedData);
    setIsModalVisible(false);
  };

  const setPriceWhenChangeGuestCount = (guestCount: number) => {
    let unitPricesList: PriceRatePlan = {
      rates: Array.from({ length: guestCount }, (_, index) => ({
        headCount: index + 1,
        rate: 0,
      })).filter((priceObj) => priceObj.headCount !== guestCount),
    };

    setPerNightRateList(unitPricesList);
  };

  return (
    <div className="RatePlanForRoomComponentContainer w-100"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
      {isModalVisible && (
        <EditPriceModal
          initialData={{
            headCount: perNightOverallDetails?.headCount || 1,
            price: perNightOverallDetails?.priceForMaxCount || 0,
          }}
          perNightRateList={perNightRateList}
          isVisible={isModalVisible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}

      <div
        className="py-3 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
        style={{ backgroundColor: "#fdfdfd6e" }}
      >
        <h5 className="font-weight-medium font-size-3 mb-3">
          Standard rate plan
        </h5>

        <Checkbox
          checked={isRatePlaneAvailable}
          className="me-1 mb-3"
          onChange={(e) => {
            // console.log(e?.target?.checked);
            setIsRatePlaneAvailable(e?.target?.checked);
            if (!e?.target?.checked) {
              setPriceWhenChangeGuestCount(guestCount);
            }
          }}
        >
          <span className="font-weight-normal font-size-4">
            Enable rate plans{" "}
          </span>{" "}
        </Checkbox>
        {isRatePlaneAvailable && (
          <div
            className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0 w-100 d-flex flex-column align-items-center align-items-lg-start"
            style={{ backgroundColor: "#fdfdfd6e" }}
          >
            <div className="w-100">
              <Row className="w-100 d-flex flex-column-reverse flex-sm-row">
                <Col
                  xs={24}
                  sm={18}
                  md={19}
                  lg={18}
                  xl={20}
                  xxl={21}
                  className="d-flex justify-content-center justify-content-sm-start align-items-end"
                >
                  <h5 className="font-size-4 font-weight-medium ">
                    Price per group size
                  </h5>
                </Col>
                <Col
                  xs={24}
                  sm={6}
                  md={5}
                  lg={6}
                  xl={4}
                  xxl={3}
                  className="d-flex justify-content-end align-items-center"
                >
                  {perNightOverallDetails?.headCount &&
                    perNightOverallDetails?.headCount > 1 &&
                    unitPrice ? (
                    <Button
                      size="large"
                      className="w-100 my-3 my-sm-2  rounded-3"
                      onClick={() => {
                        setIsModalVisible(true);
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              <p className="font-size-5 primary-color">
                You’re 12% more likely to get bookings if you set lower prices
                for smaller groups of guests
              </p>

              <Row className="w-100 mb-2">
                <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <h5 className="font-size-4 font-weight-medium ">
                    Guest Count
                  </h5>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <h5 className="font-size-4 font-weight-medium ">Price</h5>
                </Col>
              </Row>

              {perNightRateList?.rates?.map((rateList: any) => (
                <Row className="w-100 d-flex align-items-center">
                  <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <h5 className="font-size-4 font-weight-normal ">
                      <User size={25} className="me-2" /> X {rateList.headCount}
                    </h5>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={9} xxl={8}>
                    <h5 className="font-size-4 font-weight-medium ">
                      {rateList.rate} % off
                    </h5>
                  </Col>
                </Row>
              ))}
              <Row className="w-100 d-flex align-items-center">
                <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <h5 className="font-size-4 font-weight-normal text-secondary ">
                    <User size={25} className="me-2" /> X{" "}
                    {perNightOverallDetails?.headCount &&
                      perNightOverallDetails.headCount}
                  </h5>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={9} xxl={8}>
                  {/* <h5 className="font-size-4 font-weight-medium text-secondary">
                  Standard Rate
                </h5> */}
                  <h5 className="font-size-4 font-weight-medium text-secondary">
                    {perNightOverallDetails &&
                      perNightOverallDetails.priceForMaxCount}{" "}
                    % off
                  </h5>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatePlanForRoomComponent;
