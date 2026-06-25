import { Button, Checkbox, Col, Form, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCancellationPolicies } from "../../../service/propertyDetailsService";
import {
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import {
  CancellationPolicies,
  CancellationPolicyDetailsObject,
} from "../../../common/interfaces/uiNecessaryInterface";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";

interface CancellationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    longCancellationPolicy: CancellationPolicies | null;
    shortCancellationPolicy: CancellationPolicies;
  } | null;
  selectedPropertyType: string;
  isMonthlyRateNotAvailable: boolean;
  onPolicyChange: (policy: {
    longCancellationPolicy: CancellationPolicies | null;
    shortCancellationPolicy: CancellationPolicies;
  }) => void;
}

const CancellationPolicyModal: React.FC<CancellationPolicyModalProps> = ({
  isOpen,
  currentData,
  selectedPropertyType,
  isMonthlyRateNotAvailable,
  onClose,
  onPolicyChange,
}) => {
  const [selectedLongPolicy, setSelectedLongPolicy] =
    useState<CancellationPolicies | null>();
  const [selectedShortPolicy, setSelectedShortPolicy] =
    useState<CancellationPolicies>();
  const [cancellationPolicyList, setCancellationPolicyList] = useState<
    CancellationPolicyDetailsObject[]
  >([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      loadAllCancellationPolicies();
      if (currentData) {
        // console.log(currentData);
        setSelectedLongPolicy(currentData?.longCancellationPolicy);
        setSelectedShortPolicy(currentData?.shortCancellationPolicy);
        form.setFieldsValue({
          selectedCancellationPolicy: currentData,
        });
      }
    }
  }, [isOpen, currentData, form]);

  // console.log(isMonthlyRateNotAvailable);

  const loadAllCancellationPolicies = () => {
    let temp: CancellationPolicyDetailsObject[] = [];

    popUploader(dispatch, true);
    getAllCancellationPolicies()
      .then((resp) => {
        resp?.data.map((property: CancellationPolicyDetailsObject) => {
          let policies: CancellationPolicies[] = [];

          if (
            selectedPropertyType === PropertyTypesEnum.HOTEL ||
            isMonthlyRateNotAvailable
          ) {
            if (property?.type === "SHORT_TERM") {
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
          } else {
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
        // console.log(temp);

        setCancellationPolicyList(temp);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleChangeCancellationPolicy = () => {
    if (
      (selectedPropertyType === PropertyTypesEnum.HOTEL ||
        isMonthlyRateNotAvailable) &&
      !selectedShortPolicy
    ) {
      customToastMsg("Please select cancellation policy", 2);
      return;
    }
    if (
      selectedPropertyType != PropertyTypesEnum.HOTEL &&
      !isMonthlyRateNotAvailable &&
      (!selectedShortPolicy || !selectedLongPolicy)
    ) {
      customToastMsg(
        "Please select both long-term and short-term cancellation policies",
        2
      );
      return;
    }

    if (
      (selectedPropertyType === PropertyTypesEnum.HOTEL ||
        isMonthlyRateNotAvailable) &&
      selectedShortPolicy
    ) {
      onPolicyChange({
        longCancellationPolicy: null,
        shortCancellationPolicy: selectedShortPolicy,
      });
      onClose();
      return;
    }
    if (
      (selectedPropertyType != PropertyTypesEnum.HOTEL ||
        !isMonthlyRateNotAvailable) &&
      selectedShortPolicy &&
      selectedLongPolicy
    ) {
      onPolicyChange({
        longCancellationPolicy: selectedLongPolicy,
        shortCancellationPolicy: selectedShortPolicy,
      });
      onClose();
      return;
    }
  };

  const clearInputs = () => {
    form.resetFields();
    setSelectedLongPolicy(undefined);
    setSelectedShortPolicy(undefined);
  };

  return (
    <Modal
      title={<h4>Change Cancellation Policy</h4>}
      width={
        selectedPropertyType === PropertyTypesEnum.HOTEL ||
        isMonthlyRateNotAvailable
          ? 500
          : 800
      }
      open={isOpen}
      onCancel={() => {
        onClose();
      }}
      afterClose={() => clearInputs()}
      footer={[
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>,
        <Button
          onClick={() => {
            handleChangeCancellationPolicy();
          }}
          type="primary"
        >
          Select Policy
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          {["LONG_TERM", "SHORT_TERM"].map((type) => {
            const policies = cancellationPolicyList.find(
              (item) => item.type === type
            )?.cancellationPolicies;

            return (
              policies && (
                <Col
                  xs={
                    selectedPropertyType === PropertyTypesEnum.HOTEL ||
                    isMonthlyRateNotAvailable
                      ? 24
                      : 24
                  }
                  sm={
                    selectedPropertyType === PropertyTypesEnum.HOTEL ||
                    isMonthlyRateNotAvailable
                      ? 24
                      : 12
                  }
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
                  key={type}
                >
                  <div
                    className={
                      selectedPropertyType === PropertyTypesEnum.HOTEL ||
                      isMonthlyRateNotAvailable
                        ? "mt-0 mb-3"
                        : "mt-4 mb-3"
                    }
                  >
                    {selectedPropertyType === PropertyTypesEnum.HOTEL ||
                    isMonthlyRateNotAvailable ? (
                      ""
                    ) : (
                      <div>
                        {type === "LONG_TERM" ? (
                          <h5 className="d-flex flex-column">
                            Long Term Policies{" "}
                            <span
                              className="text-muted"
                              style={{ fontSize: 15 }}
                            >
                              (More than 30 days)
                            </span>
                          </h5>
                        ) : type === "SHORT_TERM" ? (
                          <h5 className="d-flex flex-column">
                            Short Term Policies{" "}
                            <span
                              className="text-muted"
                              style={{ fontSize: 15 }}
                            >
                              (Less than 30 days)
                            </span>{" "}
                          </h5>
                        ) : (
                          ""
                        )}
                      </div>
                    )}

                    <Radio.Group
                      onChange={(e) => {
                        const selectedPolicy = policies.find(
                          (policy) => policy.id === e.target.value
                        );
                        if (type === "LONG_TERM") {
                          setSelectedLongPolicy(selectedPolicy);
                        } else if (type === "SHORT_TERM") {
                          setSelectedShortPolicy(selectedPolicy);
                        }
                      }}
                      className="d-flex flex-column ms-3"
                      value={
                        type === "SHORT_TERM"
                          ? selectedShortPolicy?.id
                          : type === "LONG_TERM"
                          ? selectedLongPolicy?.id
                          : ""
                      }
                    >
                      {policies.map((policy) => (
                        <div key={policy.id}>
                          <Radio value={policy.id} className="mt-2">
                            <span className="font-size-4 font-weight-normal">
                              {formatNamesCmnFun(policy.name)}
                            </span>
                            <br />
                          </Radio>
                          <p className="font-size-5 font-weight-normal text-gray ms-4">
                            {policy.description}
                          </p>
                        </div>
                      ))}
                    </Radio.Group>
                  </div>
                </Col>
              )
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
};

export default CancellationPolicyModal;
