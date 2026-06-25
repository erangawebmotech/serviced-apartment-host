import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import { UnitEnum } from "../../../common/uiConstants";
import PropertyListing from "../../../pages/PropertyListing";
import {
  customToastMsg,
  formatNamesCmnFun,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import {
  CancellationPolicies,
  CancellationPolicyDetailsObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import * as constants from "../../../common/constants";
import CancellationPolicyModal from "../../common/modal/CancellationPolicyModal";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import CancellationPolicyComponent from "../../common/CancellationPolicyComponent";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";
import { getAllCancellationPolicies } from "../../../service/propertyDetailsService";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";
import { nrpRateEnum } from "../../../config/nonRefundablePolicyConfig";

const StepCancellationPolicy = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState<boolean>(false);
  const [selectedPolicies, setSelectedPolicies] = useState<{
    longCancellationPolicy: CancellationPolicies | undefined;
    shortCancellationPolicy: CancellationPolicies | undefined;
  }>();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [isMonthlyRateNotAvailable, setIsMonthlyRateNotAvailable] =
    useState<boolean>(false);
  const [longTermSecurityFee, setLongTermSecurityFee] = useState<number>();
  const [shortTermSecurityFee, setShortTermSecurityFee] = useState<number>();
  const [longTermSecurityFeeError, setLongTermSecurityFeeError] = useState<
    string | null
  >(null);
  const [shortTermSecurityFeeError, setShortTermSecurityFeeError] = useState<
    string | null
  >(null);
  const [MaxLongTermSecurityFeeValue, setMaxLongTermSecurityFeeValue] =
    useState<number>();

  const [isRefundAvailable, setIsRefundAvailable] = useState<boolean>(false);
  const [nonRefundablePercentage, setNonRefundablePercentage] =
    useState<number>(nrpRateEnum);
  const [nonRefundablePercentageError, setNonRefundablePercentageError] =
    useState<string | null>(null);
  const [cancellationPolicyList, setCancellationPolicyList] = useState<
    CancellationPolicyDetailsObject[]
  >([]);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [alreadyHavePolicies, setAlreadyHavePolicies] =
    useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    // console.log(lastSegment);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadAllCancellationPolicies();
    loadPropertyDetailsPropertyId();
  }, []);

  const loadAllCancellationPolicies = () => {
    let temp: CancellationPolicyDetailsObject[] = [];
    popUploader(dispatch, true);
    getAllCancellationPolicies()
      .then((resp) => {
        resp?.data.map((property: CancellationPolicyDetailsObject) => {
          let policies: CancellationPolicies[] = [];
          if (property?.type === "BOTH") {
            property.cancellationPolicies.map(
              (policy: CancellationPolicies) => {
                policies.push({
                  id: policy?.id,
                  name: policy?.name,
                  description: policy?.description,
                });
              }
            );
            temp.push({
              type: property?.type,
              cancellationPolicies: policies,
            });
          }
        });
        setCancellationPolicyList(temp);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          setSelectedPropertyType(
            dataObj?.propertyType?.name ? dataObj?.propertyType?.name : ""
          );
          setIsMonthlyRateNotAvailable(
            dataObj?.monthlyRate && dataObj?.monthlyRate > 0 ? false : true
          );

          setMaxLongTermSecurityFeeValue(
            dataObj?.monthlyRate ? dataObj?.monthlyRate * 30 : 0
          );

          setNonRefundablePercentage(dataObj?.cancellationPolicies?.nrpRate && dataObj.cancellationPolicies.nrpRate > 0 ? dataObj.cancellationPolicies.nrpRate : nrpRateEnum);
          form.setFieldsValue({
            nonRefundablePercentage:
              dataObj?.cancellationPolicies?.nrpRate && dataObj.cancellationPolicies.nrpRate > 0
                ? dataObj.cancellationPolicies.nrpRate
                : nrpRateEnum,
          });

          if (
            dataObj &&
            dataObj?.cancellationPolicies?.shortCancellationPolicyId
          ) {
            setSelectedPolicies({
              longCancellationPolicy:
                dataObj.cancellationPolicies.longCancellationPolicy,
              shortCancellationPolicy:
                dataObj.cancellationPolicies.shortCancellationPolicyId,
            });
            setIsRefundAvailable(
              dataObj.cancellationPolicies.isRefundAvailable
            );
            setLongTermSecurityFee(
              dataObj.cancellationPolicies.longTermSecurity
            );
            setShortTermSecurityFee(
              dataObj.cancellationPolicies.shortTermSecurity
            );

            form.setFieldsValue({
              longTermSecurityFee:
                dataObj.cancellationPolicies.longTermSecurity,
              shortTermSecurityFee:
                dataObj.cancellationPolicies.shortTermSecurity,
            });

            setAlreadyHavePolicies(true);
          } else {
            setSelectedPolicies(undefined);
          }
          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const handlePolicyChange = (policies: {
    longCancellationPolicy: CancellationPolicies;
    shortCancellationPolicy: CancellationPolicies;
  }) => {
    setSelectedPolicies(policies);
  };

  const handleLongTermSecurityFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);

    setLongTermSecurityFee(value);

    if (value < 0) {
      setLongTermSecurityFeeError(
        "Long term security fee cannot be lower than 0."
      );
    } else if (value > MaxLongTermSecurityFeeValue) {
      setLongTermSecurityFeeError(
        `Long term security fee cannot be grater than ${MaxLongTermSecurityFeeValue}.`
      );
    } else {
      setLongTermSecurityFeeError(null);
    }
  };

  const handleShortTermSecurityFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);

    setShortTermSecurityFee(value);

    if (value < 0) {
      setShortTermSecurityFeeError(
        "Short term security fee cannot be lower than 0."
      );
    } else if (value > 250) {
      setShortTermSecurityFeeError(
        "Short term security fee cannot be grater than 250."
      );
    } else {
      setShortTermSecurityFeeError(null);
    }
  };

  const handleNonRefundablePercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);

    setNonRefundablePercentage(value);

    if (value < 0) {
      setNonRefundablePercentageError(
        "Non refundable rate cannot be lower than 0."
      );
    } else if (value > 100) {
      setNonRefundablePercentageError(
        "Non refundable rate cannot be grater than 100."
      );
    } else {
      setNonRefundablePercentageError(null);
    }
  };

  const handleCreatePropertyListingRatePlanForUnit = () => {
    let isValidate = true;

    if (!selectedPolicies) {
      customToastMsg("Select cancellation policy", 2);
      isValidate = false;
    } else {
      // Case 1: HOTEL or Monthly Rate is available
      if (
        selectedPropertyType === PropertyTypesEnum.HOTEL ||
        isMonthlyRateNotAvailable
      ) {
        if (!selectedPolicies.shortCancellationPolicy) {
          customToastMsg("Please select cancellation policy", 2);
          isValidate = false;
        }
        // else if (
        //   !shortTermSecurityFee ||
        //   shortTermSecurityFee <= 0 ||
        //   shortTermSecurityFee > 250
        // ) {
        //   customToastMsg("Enter valid short term security fee", 2);
        //   isValidate = false;
        // } 
        else if (
          isRefundAvailable &&
          (!nonRefundablePercentage ||
            nonRefundablePercentage <= 0 ||
            nonRefundablePercentage > 100)
        ) {
          customToastMsg("Enter valid non refundable policy rate", 2);
          isValidate = false;
        }
      }
      // Case 2: Not HOTEL and No Monthly Rate
      else if (
        selectedPropertyType !== PropertyTypesEnum.HOTEL &&
        !isMonthlyRateNotAvailable
      ) {
        if (
          !selectedPolicies.longCancellationPolicy ||
          !selectedPolicies.shortCancellationPolicy
        ) {
          customToastMsg(
            "Please select both long-term and short-term cancellation policies",
            2
          );
          isValidate = false;
        }
        // else if (
        //   !longTermSecurityFee ||
        //   longTermSecurityFee <= 0 ||
        //   longTermSecurityFee > MaxLongTermSecurityFeeValue
        // ) {
        //   customToastMsg("Enter valid long term security fee", 2);
        //   isValidate = false;
        // } else if (
        //   !shortTermSecurityFee ||
        //   shortTermSecurityFee <= 0 ||
        //   shortTermSecurityFee > 250
        // ) {
        //   customToastMsg("Enter valid short term security fee", 2);
        //   isValidate = false;
        // } 
        else if (
          isRefundAvailable &&
          (!nonRefundablePercentage ||
            nonRefundablePercentage <= 0 ||
            nonRefundablePercentage > 100)
        ) {
          customToastMsg("Enter valid non refundable policy rate", 2);
          isValidate = false;
        }
      }
    }

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    if (isValidate) {
      setIsDisableBtns(true);
      const data = {
        cancellationPolicies: {
          longCancellationPolicyId: isMonthlyRateNotAvailable
            ? null
            : selectedPolicies?.longCancellationPolicy?.id
              ? selectedPolicies?.longCancellationPolicy?.id
              : null,
          shortCancellationPolicyId: selectedPolicies?.shortCancellationPolicy
            ?.id
            ? selectedPolicies?.shortCancellationPolicy?.id
            : null,
          isRefundAvailable: isRefundAvailable,
          shortTermSecurity: shortTermSecurityFee,
          longTermSecurity: isMonthlyRateNotAvailable ? 0 : longTermSecurityFee,
          nrpRate: isRefundAvailable ? nonRefundablePercentage : null,
        },
      };
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.CANCELLATION_POLICY, propertyId)
        .then(() => {
          clearStates();
          popUploader(dispatch, false);
          history(`/final/03/${propertyId}`);
        })
        .catch((error) => {
          handleError(error);
          popUploader(dispatch, false);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const clearStates = () => {
    setSelectedPolicies(undefined);
    setIsDisableBtns(true);
    setLongTermSecurityFee(undefined);
    setShortTermSecurityFee(undefined);
    setNonRefundablePercentage(nrpRateEnum);
  };

  return (
    <PropertyListing>
      <div className="StepCancellationPolicyContainer py-5 py-lg-0 h-100 w-100">
        {selectedPropertyType != "" && (
          <CancellationPolicyModal
            isOpen={isCancellationPolicyModalOpen}
            onClose={() => {
              setIsCancellationPolicyModalOpen(false);
            }}
            selectedPropertyType={selectedPropertyType}
            isMonthlyRateNotAvailable={isMonthlyRateNotAvailable}
            currentData={selectedPolicies ? selectedPolicies : null}
            onPolicyChange={handlePolicyChange}
          />
        )}
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={10} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-xl-5">
              <h2 className="font-weight-medium font-size-3 primary-color">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  Final Steps
                </span>{" "}
                {">"} Step 02
              </h2>
              <h1 className="font-weight-medium font-size-1">
                What is your cancellation policies for entire property?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-xl-5">
                Clearly outline the terms and conditions for cancellations to
                set expectations for guests.
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={14}
            xl={12}
            xxl={12}
            className="py-0 py-lg-4 py-xl-0 d-flex flex-column pe-2 align-self-end mb-1"
            style={{
              height: "87%",
              overflowY: "auto",
              justifyContent: "start",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              className="mt-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
            >
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
                      className="d-flex justify-content-center justify-content-sm-start align-items-center"
                    >
                      <h5 className="font-size-4 font-weight-medium mt-1">
                        Cancellation policy
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
                      {alreadyHavePolicies && (
                        <Button
                          size="large"
                          className="w-100 my-3 my-sm-2  rounded-3"
                          onClick={() => {
                            setIsCancellationPolicyModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </Col>
                  </Row>

                  <p className="font-size-5 my-2">
                    This policy is set at the property level – any changes made
                    will apply to all {UnitEnum.ROOM_SIMPLE}s.
                  </p>
                  <p className="font-size-5 primary-color">
                    You’re 91% more likely to get bookings with the pre-selected
                    cancellation policy settings than with a 30-day cancellation
                    policy
                  </p>

                  {alreadyHavePolicies &&
                    (selectedPropertyType === PropertyTypesEnum.HOTEL ||
                      isMonthlyRateNotAvailable) ? (
                    ""
                  ) : (
                    <div>
                      {selectedPolicies?.longCancellationPolicy && (
                        <p>
                          <div className="d-flex">
                            <strong className="primary-color">
                              Long Term :{" "}
                            </strong>{" "}
                            <p className="font-size-5 ms-1 fw-bold mb-1">
                              {formatNamesCmnFun(
                                selectedPolicies.longCancellationPolicy?.name
                              )}
                            </p>
                          </div>

                          <p className="font-size-5  mt-0">
                            {
                              selectedPolicies?.longCancellationPolicy
                                ?.description
                            }
                          </p>
                        </p>
                      )}
                    </div>
                  )}
                  {alreadyHavePolicies &&
                    selectedPolicies?.shortCancellationPolicy && (
                      <p>
                        <div className="d-flex">
                          {selectedPropertyType === PropertyTypesEnum.HOTEL ||
                            isMonthlyRateNotAvailable ? (
                            ""
                          ) : (
                            <strong className="primary-color">
                              Short Term :{" "}
                            </strong>
                          )}
                          <p
                            className={`font-size-5 ${selectedPropertyType ===
                              PropertyTypesEnum.HOTEL ||
                              isMonthlyRateNotAvailable
                              ? "ms-0"
                              : "ms-1"
                              }  fw-bold mb-1`}
                          >
                            {formatNamesCmnFun(
                              selectedPolicies.shortCancellationPolicy?.name
                            )}
                          </p>
                        </div>

                        <p className="font-size-5  mt-0">
                          {
                            selectedPolicies?.shortCancellationPolicy
                              ?.description
                          }
                        </p>
                      </p>
                    )}
                </div>
                {!alreadyHavePolicies && (
                  <div>
                    {selectedPropertyType != "" && (
                      <CancellationPolicyComponent
                        selectedPropertyType={selectedPropertyType}
                        isMonthlyRateNotAvailable={isMonthlyRateNotAvailable}
                        onPolicyChange={handlePolicyChange}
                      />
                    )}
                  </div>
                )}
              </div>
              <div
                className="py-2 px-4 rounded-4 border border-white my-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <div className="w-100">
                  <h5 className="font-size-4 font-weight-medium mt-2">
                    Security Fee
                  </h5>

                  <p className="font-size-5 my-2">
                    This policy is set at the property level – any changes made
                    will apply to all units.
                  </p>
                  <p className="font-size-5 primary-color">
                    You’re 91% more likely to get bookings with the pre-selected
                    cancellation policy settings than with a 30-day cancellation
                    policy
                  </p>

                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      xxl={12}
                      className="pe-0 pe-md-2"
                    >
                      {" "}
                      {selectedPropertyType === PropertyTypesEnum.HOTEL ||
                        isMonthlyRateNotAvailable ? (
                        ""
                      ) : (
                        <div>
                          <h5 className="font-size-4 font-weight-normal mt-2">
                            Long term security fee
                          </h5>
                          <Form.Item
                            name="longTermSecurityFee"
                            validateStatus={
                              longTermSecurityFeeError ? "error" : undefined
                            }
                            help={longTermSecurityFeeError}
                            className="w-100"
                          >
                            <Input
                              size="large"
                              id="longTermSecurityFee"
                              name="longTermSecurityFee"
                              value={longTermSecurityFee}
                              placeholder="Enter long term security fee"
                              className="rounded-4 p-3 bg-transparent border border-secondary mb-2"
                              type="number"
                              min={0}
                              onChange={handleLongTermSecurityFeeChange}
                              addonAfter={CurrencyEnum.USD}
                            />
                          </Form.Item>
                        </div>
                      )}
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={
                        selectedPropertyType === PropertyTypesEnum.HOTEL ||
                          isMonthlyRateNotAvailable
                          ? 24
                          : 12
                      }
                      lg={
                        selectedPropertyType === PropertyTypesEnum.HOTEL ||
                          isMonthlyRateNotAvailable
                          ? 24
                          : 12
                      }
                      xl={
                        selectedPropertyType === PropertyTypesEnum.HOTEL ||
                          isMonthlyRateNotAvailable
                          ? 24
                          : 12
                      }
                      xxl={
                        selectedPropertyType === PropertyTypesEnum.HOTEL ||
                          isMonthlyRateNotAvailable
                          ? 24
                          : 12
                      }
                      className={`ps-0 ${selectedPropertyType === PropertyTypesEnum.HOTEL ||
                        isMonthlyRateNotAvailable
                        ? "ps-md-0"
                        : "ps-md-2"
                        }`}
                    >
                      {" "}
                      <div>
                        <h5 className="font-size-4 font-weight-normal mt-2">
                          {selectedPropertyType === PropertyTypesEnum.HOTEL ||
                            isMonthlyRateNotAvailable
                            ? "Security fee"
                            : "Short term security fee"}
                        </h5>
                        <Form.Item
                          name="shortTermSecurityFee"
                          validateStatus={
                            shortTermSecurityFeeError ? "error" : undefined
                          }
                          help={shortTermSecurityFeeError}
                          className="w-100"
                        >
                          <Input
                            size="large"
                            id="shortTermSecurityFee"
                            name="shortTermSecurityFee"
                            value={shortTermSecurityFee}
                            placeholder="Enter short term security fee"
                            className="rounded-4 p-3  bg-transparent border border-secondary mb-2"
                            type="number"
                            min={0}
                            onChange={handleShortTermSecurityFeeChange}
                            addonAfter={CurrencyEnum.USD}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              {selectedPropertyType != PropertyTypesEnum.HOTEL && (
                <div
                  className="py-2 px-4 rounded-4 border border-white mb-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
                  style={{ backgroundColor: "#fdfdfd6e" }}
                >
                  <div className="w-100 ">
                    <h5 className="font-size-4 font-weight-medium mt-2">
                      Non Refundable Policies
                    </h5>

                    <p className="font-size-5 my-2">
                      This policy is set at the property level – any changes
                      made will apply to all units.
                    </p>
                    <p className="font-size-5 primary-color">
                      You’re 91% more likely to get bookings with the
                      pre-selected cancellation policy settings than with a
                      30-day cancellation policy
                    </p>

                    <Row>
                      {["BOTH"].map((type) => {
                        const policies = cancellationPolicyList.find(
                          (item) => item.type === type
                        )?.cancellationPolicies;
                        return (
                          policies && (
                            <Col
                              xs={24}
                              sm={24}
                              md={24}
                              lg={24}
                              xl={24}
                              xxl={24}
                              key={type}
                            >
                              <div className="mt-1 mb-3">
                                {policies.map((policy) => (
                                  <div key={policy.id} className="text-start">
                                    <Checkbox
                                      checked={isRefundAvailable}
                                      onChange={(e) => {
                                        setIsRefundAvailable(e.target.checked);
                                      }}
                                    >
                                      <span className="font-size-4 font-weight-normal">
                                        {/* {formatNamesCmnFun(policy.name)} */}
                                        Allow Non-Refundable Policy
                                      </span>
                                    </Checkbox>
                                    <p className="font-size-5 font-weight-normal text-gray ms-4">
                                      {policy.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </Col>
                          )
                        );
                      })}
                    </Row>
                    {isRefundAvailable && (
                      <Form.Item
                        name="nonRefundablePercentage"
                        validateStatus={
                          nonRefundablePercentageError ? "error" : undefined
                        }
                        help={nonRefundablePercentageError}
                        className="w-100"
                      >
                        <Input
                          size="large"
                          id="nonRefundablePercentage"
                          name="nonRefundablePercentage"
                          value={nonRefundablePercentage}
                          placeholder="Enter non refutable policy rate"
                          className="rounded-4 p-3 bg-transparent border border-secondary"
                          type="number"
                          addonAfter="%"
                          min={0}
                          max={100}
                          onChange={handleNonRefundablePercentageChange}
                        />
                      </Form.Item>
                    )}
                  </div>
                </div>
              )}
            </Form>
          </Col>
        </Row>
        <Row className="btnRow w-100" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex justify-content-between flex-column-reverse flex-sm-row mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/final/01/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={!selectedPolicies}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingRatePlanForUnit}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepCancellationPolicy;
