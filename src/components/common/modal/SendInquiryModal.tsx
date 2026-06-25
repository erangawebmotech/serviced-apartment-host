import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  message,
  Space,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getPropertyTypes,
  sendInquiry,
} from "../../../service/propertyDetailsService";
import "../../../styles/contactNumberInputCustomStyle.scss";
import {
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { validateInputs } from "../../../common/validation";
import { Cookies } from "typescript-cookie";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as constants from "../../../common/constants";


interface SendInquiryModal {
  isOpen: boolean;
  selectedPlan: {
    id: number;
    name: string;
  };
  onClose: () => void;
}

interface Role {
  id: number;
  name: string;
  status: string;
  guard: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hasHost: boolean;
  countryCode: string | null;
  contactNo: string;
  lastLoggedAt: string;
  status: string;
  role: Role;
  file: string | null;
  permissions: string[];
}

const SendInquiryModal: React.FC<SendInquiryModal> = ({
  isOpen,
  selectedPlan,
  onClose,
}) => {
  const [name, setName] = useState<string>("");
  const [contactNo, setContactNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [inquiryMessage, setInquiryMessage] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [propertyTypesOptions, setPropertyTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [countryCode, setCountryCode] = useState<string>("+94");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [authUser, setAuthUser] = useState<User | null>(null);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadAllProperties();
    }
    const storedUser: any = Cookies.get(constants.AUTH_USER_HOST);
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, [isOpen]);

  const loadAllProperties = async () => {
    popUploader(dispatch, true);

    await getPropertyTypes()
      .then((properties) => {
        setPropertyTypeOptions(
          properties?.data.map((type: any) => ({
            value: type.id,
            label: type.name,
          }))
        );
        popUploader(dispatch, false);
      })
      .catch((err) => {
        handleError(err);
        popUploader(dispatch, false);
      });
  };

  useEffect(() => {
    if (authUser) {
      setName(`${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`);
      form.setFieldValue(
        "name",
        `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`
      );
      setEmail(authUser?.email);
      form.setFieldValue("email", authUser?.email);
      setContactNo(`${authUser?.countryCode}${authUser?.contactNo}`);
      setCountryCode(authUser?.countryCode ? authUser?.countryCode : "");
      setPhoneNumber(authUser?.contactNo);
      form.setFieldValue(
        "userPhone",
        `${authUser?.countryCode}${authUser?.contactNo}`
      );
    }
  }, [authUser, form, isOpen]);

  const handleSendInquiry = () => {
    form
      .validateFields()
      .then((values) => {
        const authUser = Cookies.get(constants.AUTH_USER_HOST);
        const customerId = authUser ? JSON.parse(authUser as string).id : 0;

        const data = {
          planId: selectedPlan?.id,
          name: name.trim(),
          email: email.trim(),
          contactNo: phoneNumber,
          location: address.trim(),
          links: values.urls
            ? values.urls.map((urlObj: { last: string }) => urlObj.last)
            : [],
          propertyTypeId: values?.propertyType,
          description: inquiryMessage.trim(),
          customerId: customerId,
          countryCode: countryCode,
        };

        popUploader(dispatch, true);
        sendInquiry(data)
          .then(() => {
            onClose();
            clearInputs();
            popUploader(dispatch, false);
            // messageApi.open({
            //   type: "success",
            //   content:
            //     "Thank you for connecting with us.Inquiry send successfully!",
            // });
            customToastMsg(
              "Thank you for connecting with us. Your inquiry send successfully",
              1
            );
            history("/");
          })
          .catch((error) => {
            popUploader(dispatch, false);

            if (error.message) {
              customToastMsg(error.message, 0);
            }
            error.message.name
              ? customToastMsg(error.message.name, 0)
              : error.message.email
                ? customToastMsg(error.message.email, 0)
                : error.message.contactNo
                  ? customToastMsg(error.message.contactNo, 0)
                  : error.message.location
                    ? customToastMsg(error.message.location, 0)
                    : error.message.description ? customToastMsg(error.message.description, 0) : "";
          });
      })
      .catch((error) => {
        name === ""
          ? customToastMsg("Name cannot be empty", 2)
          : !validateInputs(name, ["isValidName"]).isValid
            ? customToastMsg(
              validateInputs(name, ["isValidName"]).errorMessage,
              2
            )
            : email === ""
              ? customToastMsg("Email cannot be empty", 2)
              : !validateInputs(email, ["isEmail"]).isValid
                ? customToastMsg(validateInputs(email, ["isEmail"]).errorMessage, 2)
                : contactNo === ""
                  ? customToastMsg("Contact no cannot be empty", 2)
                  : // : !validateInputs(contactNo, ["isContactNo"]).isValid
                  //   ? customToastMsg(
                  //     validateInputs(contactNo, ["isContactNo"]).errorMessage,
                  //     2
                  //   )
                  address === ""
                    ? customToastMsg("Address cannot be empty", 2)
                    : inquiryMessage === ""
                      ? customToastMsg("Inquiry message cannot be empty", 2)
                      : "";
      });
  };

  const clearInputs = () => {
    form.resetFields();
    setName("");
    setContactNo("");
    setEmail("");
    setAddress("");
    setInquiryMessage("");
  };

  return (
    <Modal
      title={<h4>Let’s Get Started with Your Inquiry!</h4>}
      width={700}
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
          size="large"
        >
          Cancel
        </Button>,
        <Button
          onClick={() => {
            handleSendInquiry();
          }}
          size="large"
          type="primary"
        >
          Send Inquiry
        </Button>,
      ]}
    >
      {contextHolder}
      <h6 className="fw-semibold">
        Thank you for selecting the{" "}
        <span className="primary-color">
          {formatNamesCmnFun(selectedPlan?.name ? selectedPlan?.name : "")}
        </span>{" "}
        plan!
      </h6>
      <h6 className="fw-normal">
        To help us assist you better, please provide the following details:
      </h6>
      <Form form={form} layout="vertical" className="mt-4">
        <Row>
          <Col sm={24} md={12} className="pe-0 pe-md-2">
            {" "}
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Name cannot be empty" },
                {
                  validator: (_, value) =>
                    value && value.trim() !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("Name cannot be just spaces")),
                },
                {
                  validator: (_, value) => {
                    const { isValid, errorMessage } = validateInputs(value.trim(), [
                      "isValidName",
                    ]);
                    return isValid
                      ? Promise.resolve()
                      : Promise.reject(new Error(errorMessage));
                  },
                },
              ]}
            >
              <Input
                size="large"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={12} className="ps-0 ps-md-2">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email cannot be empty" },
                {
                  validator: (_, value) => {
                    const { isValid, errorMessage } = validateInputs(value, [
                      "isEmail",
                    ]);
                    return isValid
                      ? Promise.resolve()
                      : Promise.reject(new Error(errorMessage));
                  },
                },
              ]}
            >
              <Input
                size="large"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col sm={24} md={12} className="mt-3">
            <Form.Item
              name="userPhone"
              label="Contact Number"
              rules={[
                { required: true, message: "Please input the Contact Number" },
                {
                  validator: (_, value) => {
                    const { isValid, errorMessage } = validateInputs(value, [
                      "isContactNo",
                    ]);
                    return isValid
                      ? Promise.resolve()
                      : Promise.reject(new Error(errorMessage));
                  },
                },
                { max: 15, message: "You cannot exceed 15 characters" },
              ]}
            >
              <PhoneInput
                country={"lk"}
                value={`${countryCode}${phoneNumber}`}
                inputStyle={{
                  width: "100%",
                  height: "43px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  fontSize: "14px",
                }}
                placeholder="+94 xxx xxx xxx"
                containerClass="phone-input-custom"
                onChange={(phone: string, countryData: CountryData) => {
                  const dialCode = `${countryData.dialCode}`;

                  let numberWithoutCode = phone.startsWith(dialCode)
                    ? phone.slice(dialCode.length)
                    : phone;

                  if (numberWithoutCode.startsWith("0")) {
                    numberWithoutCode = numberWithoutCode.slice(1);
                  }

                  setPhoneNumber(numberWithoutCode);
                  setCountryCode(`+${dialCode}`);
                }}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={12} className="mt-3 ps-0 ps-md-2">
            {" "}
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address cannot be empty" }, {
                validator: (_, value) =>
                  value && value.trim() !== ""
                    ? Promise.resolve()
                    : Promise.reject(new Error("Address cannot be just spaces")),
              },]}
            >
              <Input
                size="large"
                id="address"
                name="address"
                value={address}
                placeholder="Enter your address"
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col sm={12} md={12} className="mt-3">
            <Form.Item
              name="propertyType"
              label="Property Type"
              rules={[
                { required: true, message: "Property Type cannot be empty" },
              ]}
            >
              <Select
                showSearch
                size="large"
                allowClear
                placeholder="Select a Type"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={propertyTypesOptions}
              />
            </Form.Item>
          </Col>

          <Col className="mt-3 w-100" sm={24} md={24} lg={24} xl={24}>
            <Form.Item label="External Urls">
              <Form.List name="urls">
                {(fields, { add, remove }) => (
                  <div className="w-100">
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 15,
                          marginBottom: "10px",
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "last"]}
                          rules={[
                            { required: true, message: "URL is required" },
                            {
                              type: "url",
                              warningOnly: true,
                              message: "Enter a valid URL",
                            },
                            {
                              type: "string",
                              min: 6,
                              message: "Minimum 6 characters required",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            className="w-100"
                            placeholder="Enter URL"
                            size="large"
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{
                            fontSize: 18,
                            color: "#ff4d4f",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        size="large"
                      >
                        Add New URL
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          </Col>

          <Col sm={24} md={24} className="mt-3 mb-3">
            {" "}
            <Form.Item
              name="inquiryMessage"
              label="Message"
              rules={[{ required: true, message: "Message cannot be empty" }, {
                validator: (_, value) =>
                  value && value.trim() !== ""
                    ? Promise.resolve()
                    : Promise.reject(new Error("Message cannot be just spaces")),
              },]}
            >
              <TextArea
                showCount
                maxLength={500}
                onChange={(e) => setInquiryMessage(e.target.value)}
                id="inquiryMessage"
                name="inquiryMessage"
                value={inquiryMessage}
                placeholder="Enter your message"
                style={{ height: 120, resize: "none", fontSize: "16px" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <small className="mt-5">Note : Our team at ServicedApartmentsLK will contact you regarding your inquiry shortly. Please be patient while we review your information. We look forward to assisting you!</small>
    </Modal>
  );
};

export default SendInquiryModal;
