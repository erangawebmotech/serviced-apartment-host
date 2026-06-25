import { Button, Col, Form, GetProp, Input, Modal, Row, Upload, UploadFile, UploadProps } from "antd";
import "../../../styles/contactNumberInputCustomStyle.scss";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUserDetailObjTwo, FileUploadObject } from "../../../common/interfaces/uiNecessaryInterface";
import { validateInputs } from "../../../common/validation";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ImgCrop from "antd-img-crop";
import { uploadImages } from "../../../service/mediaService";
import { customToastMsg, handleError, popUploader } from "../../../common/commonFunctions";
import { updateProfileDetails } from "../../../service/profileService";

interface EditProfileModal {
  isOpen: boolean;
  userDetails: authUserDetailObjTwo;
  onClose: () => void;
  updatedProfile: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];


const EditProfileModal: React.FC<EditProfileModal> = ({
  isOpen,
  userDetails,
  onClose,
  updatedProfile,
}) => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+94");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [profileImg, setProfileImg] = useState<FileUploadObject>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");


  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      // console.log(userDetails);

      const userCountryCode = userDetails?.countryCode || "+94";
      const userContactNo = userDetails?.contactNo || "";

      setFirstName(userDetails?.firstName)
      setLastName(userDetails?.lastName)
      setCountryCode(userCountryCode);
      setPhoneNumber(userContactNo);

      if (userDetails?.file) {
        setFileList([
          {
            uid: userDetails?.file?.id,
            name: "image.png",
            status: "done",
            url: userDetails?.file?.mediumPath,
          },
        ]);
        setProfileImg({
          id: userDetails?.file?.id,
          largePath: userDetails?.file?.mediumPath,
          mediumPath: userDetails?.file?.mediumPath,
          originalName: userDetails?.file?.mediumPath,
          originalPath: userDetails?.file?.mediumPath,
          smallPath: userDetails?.file?.mediumPath,
        });
      }



      form.setFieldsValue({
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        userPhone: `${userCountryCode}${userContactNo}`,
      });

    }

  }, [isOpen])

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // console.log(newFileList);
    setFileList(newFileList);
  };

  const customRequest = async (file: any, onSuccess: any, onError: any) => {
    let temp: FileUploadObject = {
      id: null,
      largePath: "",
      mediumPath: "",
      originalName: "",
      originalPath: "",
      smallPath: "",
    };

    // console.log(file.file, "+++++++++++++");


    try {
      const formData = new FormData();
      formData.append('files', file.file);
      // console.log('Form Data : ', formData)
      const response = await uploadImages(formData);

      // console.log(response);

      const newFile = {
        ...file.file,

        uid: response?.data[0]?.id,
        name: "image.png",
        status: "done",
        url: response?.data[0]?.mediumPath,
      };

      setFileList((prevFileList) =>
        prevFileList.map((f) => (f.uid === file.file.uid ? newFile : f))
      );

      temp = {
        id: response?.data[0]?.id,
        largePath: response?.data[0]?.largePath,
        mediumPath: response?.data[0]?.mediumPath,
        originalName: response?.data[0]?.originalName,
        originalPath: response?.data[0]?.originalPath,
        smallPath: response?.data[0]?.smallPath,
      };
      setProfileImg(temp);
      setIsUploading(true);
      onSuccess();
    } catch (error: any) {
      onError(error.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const removeFile = async (file: UploadFile) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
    setProfileImg({
      id: null,
      largePath: "",
      mediumPath: "",
      originalName: "",
      originalPath: "",
      smallPath: "",
    });
  };



  const handleEditProfileDetails = () => {
    form
      .validateFields()
      .then((values) => {
        if (phoneNumber === "") {
          customToastMsg("Contact no cannot be empty", 2)
        } else if (phoneNumberError != "") {
          customToastMsg("Enter valid contact number", 2)
        } else {
          const data = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            countryCode: countryCode,
            contactNo: phoneNumber,
            fileId: profileImg?.id
          };

          // console.log(data);
          popUploader(dispatch, true);
          updateProfileDetails(userDetails?.id, data)
            .then(() => {
              onClose();
              updatedProfile();
              clearInputs();
              popUploader(dispatch, false);

              customToastMsg(
                "Profile details updated successfully",
                1
              );
            })
            .catch((error) => {
              popUploader(dispatch, false);
              handleError(error);
            });
        }

      })
      .catch((error) => {
        firstName === ""
          ? customToastMsg("First Name cannot be empty", 2)
          : !validateInputs(firstName, ["isValidName"]).isValid
            ? customToastMsg(
              validateInputs(firstName, ["isValidName"]).errorMessage,
              2
            )
            : lastName === ""
              ? customToastMsg("Last Name cannot be empty", 2)
              : !validateInputs(lastName, ["isValidName"]).isValid
                ? customToastMsg(
                  validateInputs(lastName, ["isValidName"]).errorMessage,
                  2
                )
                : phoneNumber === ""
                  ? customToastMsg("Contact no cannot be empty", 2)
                  : phoneNumberError != ""
                    ? customToastMsg("Enter valid contact number", 2)
                    : "";
      });
  };

  const clearInputs = () => {
    form.resetFields();
    setCountryCode("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setProfileImg(undefined);
    setFileList([]);
    setPhoneNumberError("");
  };

  const handlePhoneNumberChange = (phone: string, countryData: CountryData) => {
    const dialCode = `${countryData.dialCode}`;

    let numberWithoutCode = phone.startsWith(dialCode)
      ? phone.slice(dialCode.length)
      : phone;

    if (numberWithoutCode.startsWith("0")) {
      numberWithoutCode = numberWithoutCode.slice(1);
    }

    setPhoneNumber(numberWithoutCode);
    setCountryCode(`+${dialCode}`);

    // if (!numberWithoutCode || numberWithoutCode.trim() === "") {
    //   setPhoneNumberError("Please input the Contact Number");
    // } else 
    if (numberWithoutCode.length > 15) {
      setPhoneNumberError("You cannot exceed 15 characters");
    } else {
      const { isValid, errorMessage } = validateInputs(numberWithoutCode, ["isContactNo"]);
      setPhoneNumberError(isValid ? "" : errorMessage);
    }
  }


  return (
    <Modal
      title={<h4>Edit Profile Details </h4>}
      width={600}
      open={isOpen}
      onCancel={() => {
        onClose();
        clearInputs()
      }}
      footer={[
        <Button
          onClick={() => {
            onClose();
            clearInputs()
          }}
          size="large"
          className="mt-3"
        >
          Cancel
        </Button>,
        <Button
          onClick={() => {
            handleEditProfileDetails();
          }}
          size="large"
          type="primary"
          className="mt-3"
        >
          Save
        </Button>,
      ]}
    >

      <Form form={form} layout="vertical" className="mt-4">
        <Row>
          <Col sm={24} md={24} className="mt-3">
            <Form.Item
              name="profileImg"
              label="Profile Image"
            >

              <div className="w-100 d-flex flex-column align-items-center">
                <ImgCrop rotationSlider fillColor={"transparent"}>
                  <Upload
                    name="profileImg"
                    className="d-flex justify-content-center"
                    //@ts-ignore
                    customRequest={(
                      file: any,
                      onSuccess: any,
                      onError: any
                    ) => {
                      customRequest(file, onSuccess, onError);
                    }}
                    onRemove={removeFile}
                    listType="picture-circle"
                    fileList={fileList}
                    multiple={false}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    {fileList.length < 1 && "+ Upload"}
                  </Upload>
                </ImgCrop>
              </div>

            </Form.Item>
          </Col>
          <Col sm={24} md={24} className="mt-3">
            {" "}
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "First Name cannot be empty" },
                {
                  validator: (_, value) => {
                    const { isValid, errorMessage } = validateInputs(value, [
                      "isValidName",
                    ]);
                    return isValid
                      ? Promise.resolve()
                      : Promise.reject(new Error(errorMessage));
                  },
                }, {
                  validator: (_, value) =>
                    value && value.trim() !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("First Name cannot be just spaces")),
                }
              ]}
            >
              <Input
                size="large"
                id="firstName"
                name="firstName"
                value={firstName}
                placeholder="Enter your first name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={24} className="mt-3">
            {" "}
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Last Name cannot be empty" },
                {
                  validator: (_, value) => {
                    const { isValid, errorMessage } = validateInputs(value, [
                      "isValidName",
                    ]);
                    return isValid
                      ? Promise.resolve()
                      : Promise.reject(new Error(errorMessage));
                  },
                },{
                  validator: (_, value) =>
                    value && value.trim() !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("Last Name cannot be just spaces")),
                }
              ]}
            >
              <Input
                size="large"
                id="lastName"
                name="lastName"
                value={lastName}
                placeholder="Enter your name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
          </Col>


          <Col sm={24} md={24} className="mt-3">
            <Form.Item
              name="userPhone"
              label="Contact Number"
              rules={[
                { required: true, message: "Please input the Contact Number" },
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
                onChange={handlePhoneNumberChange}
              />
            </Form.Item>
            {phoneNumberError && (
              <div className="mt-1" style={{ fontSize: "0.9rem", color: "#ff4d4f" }}>
                {phoneNumberError}
              </div>
            )}
          </Col>

        </Row>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
