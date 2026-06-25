import { Button, Card, Col, Form, Radio, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import * as constants from "../../../common/constants";
import { getAllQuestions } from "../../../service/propertyDetailsService";
import { QuestionDetailsObject } from "../../../common/interfaces/uiNecessaryInterface";
import { useDispatch } from "react-redux";
import {
  addNewProperty,
  getPropertyById,
  updatePropertyCreateLastMainStep,
} from "../../../service/propertyListingService";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyTypesKeysEnum } from "../../../common/enums/propertyTypesKeysEnum";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum";

const StepPoliciesOfProperty = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [checkInTime, setCheckInTime] = useState<string>("14:00:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("11:00:00");
  const [selectedQuestionsAndAnswers, setSelectedQuestionsAndAnswers] =
    useState<{ questionId: number; answerId: string | number }[]>([]);
  const [questionList, setQuestionList] = useState<QuestionDetailsObject[]>([]);
  const [propertyTypeKey, setPropertyTypeKey] = useState<string>("");
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();

  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  const [form] = Form.useForm();
  dayjs.extend(customParseFormat);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));

    loadAllQuestions();
  }, []);

  // useEffect(() => {
  //   console.log(selectedQuestionsAndAnswers);
  // }, [selectedQuestionsAndAnswers]);

  const loadAllQuestions = () => {
    let temp: QuestionDetailsObject[] = [];
    let tempSelectedAnswers: {
      questionId: number;
      answerId: string | number;
    }[] = [];
    popUploader(dispatch, true);
    getAllQuestions()
      .then((resp) => {
        resp?.data.map((question: QuestionDetailsObject) => {
          temp.push({
            id: question?.id,
            question: question?.question,
            status: question?.status,
            answers: question?.answers,
          });
          tempSelectedAnswers.push({
            questionId: question.id,
            answerId: "",
          });
        });
        setQuestionList(temp);
        setSelectedQuestionsAndAnswers(tempSelectedAnswers);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      })
      .finally(() => {
        loadPropertyDetailsPropertyId();
      });
  };

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          setPropertyDetailsObject(dataObj);
          setPropertyTypeKey(
            dataObj?.propertyType?.key ? dataObj?.propertyType?.key : ""
          );
          if (dataObj?.checkIn && dataObj?.checkOut) {
            setCheckInTime(dataObj?.checkIn);
            setCheckOutTime(dataObj?.checkOut);
            form.setFieldsValue({
              checkInTime: dayjs(dataObj.checkIn, "HH:mm:ss"),
              checkOutTime: dayjs(dataObj.checkOut, "HH:mm:ss"),
            });
          }
          if (
            dataObj?.propertyPolicies &&
            dataObj?.propertyPolicies.length > 0
          ) {
            const questionAnswers = dataObj?.propertyPolicies.map((policy) => ({
              questionId: policy?.question?.id,
              answerId: policy?.question?.answers?.id,
            }));

            setSelectedQuestionsAndAnswers(questionAnswers);
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

  const handleCreatePropertyListingPoliciesOfProperty = () => {
    let isValidate = false;

    const hasUnansweredQuestions = selectedQuestionsAndAnswers.some(
      (entry) => entry.answerId === ""
    );

    const checkIn = dayjs(checkInTime, "HH:mm:ss");
    const checkOut = dayjs(checkOutTime, "HH:mm:ss");

    hasUnansweredQuestions
      ? customToastMsg("Select answers to all questions", 2)
      : checkInTime === ""
        ? customToastMsg("Select check in time", 2)
        : checkOutTime === ""
          ? customToastMsg("Select check out time", 2)
          : (isValidate = true);

    const data = {
      propertyPolices: {
        questionAndAnswers: selectedQuestionsAndAnswers,
        checkIn: checkInTime,
        checkOut: checkOutTime,
      },
    };

    // console.log(data);

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.POLICIES, propertyId)
        .then((response) => {
          updateLastMainStep();
        })
        .catch((error) => {
          handleError(error);
          popUploader(dispatch, false);
        })
                    setIsDisableBtns(true);
    }
  };

  const updateLastMainStep = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    updatePropertyCreateLastMainStep(
      MainStepsCompleteTypeEnum.PROPERTY_DETAILS_COMPLETE,
      propertyId
    )
      .then((response) => {
        history(`/property/10/${propertyId}`);
        clearStates();
        form.resetFields();
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      });
  };

  const clearStates = () => {
    setCheckInTime("");
    setCheckOutTime("");
    setSelectedQuestionsAndAnswers([]);
    setQuestionList([]);
    setIsDisableBtns(true);
  };

  const getStepNumber = (
    propertyTypeKey: string,
    propertyDetailsObject: any
  ) => {
    if (!propertyTypeKey) {
      return "";
    }

    const isApartmentOrSimilar =
      propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
      propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
      propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
      propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY;

    if (isApartmentOrSimilar) {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "07";
      }
      if (
        propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "08";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey === PropertyTypesKeysEnum.HOTEL
      ) {
        return "05";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit &&
        propertyTypeKey != PropertyTypesKeysEnum.HOTEL
      ) {
        return "06";
      }
    } else {
      if (
        propertyDetailsObject?.allowEntireProperty &&
        !propertyDetailsObject?.allowIndividualUnit
      ) {
        return "08";
      }
      if (
        !propertyDetailsObject?.allowEntireProperty &&
        propertyDetailsObject?.allowIndividualUnit
      ) {
        return "07";
      }
    }
    return "09";
  };

  return (
    <PropertyListing>
      <div className="StepPoliciesOfPropertyContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-lg-5">
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
                  Property Details
                </span>{" "}
                {">"} Step{" "}
                {getStepNumber(propertyTypeKey, propertyDetailsObject)}
              </h2>
              <h1 className="font-weight-medium font-size-1">
                What are the usage policies for your location?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Provide details about parties, noise levels, smoking policies,
                and flexible check-in/out times to set clear expectations.
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={18}
            lg={12}
            xl={12}
            xxl={12}
            className="mb-2 pe-0 pe-lg-3 d-flex flex-column"
            style={{
              height: "90%",
              overflowY: "auto",
              alignSelf: "end",
              justifyContent: questionList.length > 2 ? "start" : "center",
            }}
          >
            {questionList.map((question) => (
              <Card
                bordered={false}
                className="rounded-4 ms-0 ms-xl-5 my-3"
                style={{ backgroundColor: "#fdfdfd6e" }}
                key={question.id}
              >
                <h5 className="font-size-4 font-weight-medium mb-3">
                  {question?.question}
                </h5>

                <Radio.Group
                  onChange={(e) => {
                    const answerId = e.target.value;
                    setSelectedQuestionsAndAnswers((prev) =>
                      prev.map((entry) =>
                        entry.questionId === question.id
                          ? { ...entry, answerId }
                          : entry
                      )
                    );
                  }}
                  value={
                    selectedQuestionsAndAnswers.find(
                      (entry) => entry.questionId === question.id
                    )?.answerId
                  }
                >
                  {question.answers.map((answer) => (
                    <Radio
                      key={answer.id}
                      value={answer.id}
                      className="me-0 me-sm-5 my-2"
                    >
                      <span className="font-size-4 font-weight-medium">
                        {answer?.label}
                      </span>
                    </Radio>
                  ))}
                </Radio.Group>
              </Card>
            ))}

            <Card
              bordered={false}
              className="rounded-4 ms-0 ms-xl-5 my-3"
              style={{ backgroundColor: "#fdfdfd6e" }}
            >
              <h5 className="font-size-4 font-weight-medium mb-3">
                Check in and Checkout time
              </h5>
              <Form
                form={form}
                layout="vertical"
                className=" d-flex flex-column flex-md-row w-100"
              >
                <Row className="w-100">
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      name="checkInTime"
                      label="Check in time"
                      className="mb-1 pe-0 ps-sm-3"
                      initialValue={dayjs("14:00:00", "HH:mm:ss")}
                    >
                      <TimePicker
                        style={{ height: 40 }}
                        format="HH:mm"
                        onSelect={(selectedTime) => {
                          if (selectedTime) {
                            setCheckInTime(selectedTime.format("HH:mm:ss"));
                            form.setFieldsValue({ checkInTime: selectedTime });
                          } else {
                            setCheckInTime("");
                            form.setFieldsValue({ checkInTime: null });
                          }
                        }}
                        value={
                          checkInTime ? dayjs(checkInTime, "HH:mm:ss") : null
                        }
                        defaultValue={dayjs("14:00", "HH:mm")}
                        className="rounded-3 bg-transparent border border-secondary w-100 "
                        showNow={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      name="checkOutTime"
                      label="Check out time"
                      className="mb-0 ps-0 ps-sm-3"
                      initialValue={dayjs("11:00:00", "HH:mm:ss")}
                    >
                      <TimePicker
                        style={{ height: 40 }}
                        format="HH:mm"
                        onSelect={(selectedTime) => {
                          if (selectedTime) {
                            setCheckOutTime(selectedTime.format("HH:mm:ss"));
                            form.setFieldsValue({ checkOutTime: selectedTime });
                          } else {
                            setCheckOutTime("");
                            form.setFieldsValue({ checkOutTime: null });
                          }
                        }}
                        value={
                          checkOutTime ? dayjs(checkOutTime, "HH:mm:ss") : null
                        }
                        defaultValue={dayjs("11:00", "HH:mm")}
                        className="rounded-3 bg-transparent border border-secondary w-100 "
                        showNow={false}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
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

                if (propertyDetailsObject?.allowIndividualUnit) {
                  if (
                    propertyDetailsObject.propertyType?.name !=
                    PropertyTypesEnum.HOTEL
                  ) {
                    history(`/property/08/${propertyId}`);
                    return;
                  } else {
                    if (propertyDetailsObject?.allowEntireProperty) {
                      history(`/property/07/${propertyId}`);
                      return;
                    } else {
                      if (
                        propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                        propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                        propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                        propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                      ) {
                        history(`/property/04/${propertyId}`);
                        return;
                      } else {
                        history(`/property/05/${propertyId}`);
                        return;
                      }
                    }
                  }
                } else {
                  if (propertyDetailsObject?.allowEntireProperty) {
                    history(`/property/07/${propertyId}`);
                    return;
                  } else {
                    if (
                      propertyTypeKey === PropertyTypesKeysEnum.APARTMENT ||
                      propertyTypeKey === PropertyTypesKeysEnum.HOTEL ||
                      propertyTypeKey === PropertyTypesKeysEnum.ROOMS ||
                      propertyTypeKey === PropertyTypesKeysEnum.HOME_STAY
                    ) {
                      history(`/property/04/${propertyId}`);
                    } else {
                      history(`/property/05/${propertyId}`);
                    }
                  }
                }
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingPoliciesOfProperty}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepPoliciesOfProperty;
