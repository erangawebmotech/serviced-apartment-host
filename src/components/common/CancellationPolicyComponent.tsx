import { Button, Checkbox, Col, Form, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../common/commonFunctions";
import {
  CancellationPolicies,
  CancellationPolicyDetailsObject,
} from "../../common/interfaces/uiNecessaryInterface";
import { getAllCancellationPolicies } from "../../service/propertyDetailsService";
import { PropertyTypesEnum } from "../../common/enums/propertyTypesEnum";

interface CancellationPolicyComponentProps {
  selectedPropertyType: string;
  isMonthlyRateNotAvailable: boolean;
  onPolicyChange: (policy: {
    longCancellationPolicy: CancellationPolicies | undefined;
    shortCancellationPolicy: CancellationPolicies | undefined;
  }) => void;
}

const CancellationPolicyComponent: React.FC<
  CancellationPolicyComponentProps
> = ({ selectedPropertyType, isMonthlyRateNotAvailable, onPolicyChange }) => {
  const [selectedLongPolicy, setSelectedLongPolicy] =
    useState<CancellationPolicies>();
  const [selectedShortPolicy, setSelectedShortPolicy] =
    useState<CancellationPolicies>();
  const [cancellationPolicyList, setCancellationPolicyList] = useState<
    CancellationPolicyDetailsObject[]
  >([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    loadAllCancellationPolicies();
  }, []);

  useEffect(() => {
    handleChangeCancellationPolicy();
  }, [selectedLongPolicy, selectedShortPolicy]);

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

        setCancellationPolicyList(temp);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleChangeCancellationPolicy = () => {
    onPolicyChange({
      longCancellationPolicy: selectedLongPolicy,
      shortCancellationPolicy: selectedShortPolicy,
    });
  };

  const clearInputs = () => {
    form.resetFields();
    setSelectedLongPolicy(undefined);
    setSelectedShortPolicy(undefined);
  };

  return (
    <Form form={form} layout="vertical" className="mt-2">
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
                    <div className="text-start">
                      {type === "LONG_TERM" ? (
                        <h5 className="d-flex flex-column">
                          Long Term Policies{" "}
                          <span className="text-muted" style={{ fontSize: 15 }}>
                            (More than 30 days)
                          </span>
                        </h5>
                      ) : type === "SHORT_TERM" ? (
                        <h5 className="d-flex flex-column">
                          Short Term Policies{" "}
                          <span className="text-muted" style={{ fontSize: 15 }}>
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
                    className="d-flex flex-column ms-0 ms-md-3 text-start"
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
  );
};

export default CancellationPolicyComponent;
