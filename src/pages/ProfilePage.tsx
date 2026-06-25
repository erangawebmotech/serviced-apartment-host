import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Switch,
  Tag,
} from "antd";
import "../styles/profile/profileStyles.scss";
import "../styles/listning/listningStyles.scss";
import "../styles/commonStyles.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../common/commonFunctions";
import NavBar from "../components/NavBar";
import {
  authUserDetailObjTwo,
  BankDetailsObj,
} from "../common/interfaces/uiNecessaryInterface";
import { verifyUserToken } from "../service/auth";
import defaultProfileImage from "../assets/images/profileDefaultImg.jpg";
import Footer from "../components/Footer";
import {
  createNewBankDetail,
  deleteBankDetail,
  getAllBankDetailsOfAuthUser,
  updateBankDetail,
} from "../service/bankDetailsService";
import { bankDetailsFiltrationObj } from "../common/interfaces/apiNecessaryInterface";
import { Trash } from "react-feather";
import { PlusOutlined } from "@ant-design/icons";
import { BankDetailsStatusEnum } from "../common/enums/bankDetailsStatusEnum";
import MainLayout from "../layout/MainLayout";
import EditProfileModal from "../components/common/modal/EditProfileModal";

const ProfilePage = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [loggedUserObj, setLoggedUserObj] = useState<authUserDetailObjTwo>();
  const [bankDetailsOfUser, setBankDetailsOfUser] = useState<BankDetailsObj[]>(
    []
  );
  const [isBankDetailsEditable, setIsBankDetailsEditable] =
    useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);

  const [form] = Form.useForm();

  const [frontCardClass, setFrontCardClass] = useState("showedCard");
  const [backCardClass, setBackCardClass] = useState("hiddenCard");
  const [cardHeight, setCardHeight] = useState<number>();
  const [isOpenEditProfileModal, setIsOpenEditProfileModal] = useState<boolean>(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState<boolean>();


  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBankDetailsEditable) {
      // Going to edit mode → show back, hide front after delay
      setBackCardClass("showedCard");
      setTimeout(() => {
        setFrontCardClass("hiddenCard");
      }, 300); // adjust this delay to match your CSS transition
    } else {
      // Going back to view mode → show front, hide back after delay
      setFrontCardClass("showedCard");
      setTimeout(() => {
        setBackCardClass("hiddenCard");
      }, 300); // adjust this delay to match your CSS transition
    }
  }, [isBankDetailsEditable]);

  useEffect(() => {
    getAuthUserDetails();
    loadBankDetailsOfUser();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.height > 0) {
          // console.log("Visible card height:", entry.contentRect.height);
          setCardHeight(entry.contentRect.height);
        }
      }
    });
    // Observe only the currently visible side
    if (isBankDetailsEditable) {
      if (backRef.current) observer.observe(backRef.current);
    } else {
      if (frontRef.current) observer.observe(frontRef.current);
    }

    return () => observer.disconnect();
  }, [isBankDetailsEditable]);

  const getAuthUserDetails = () => {
    popUploader(dispatch, true);
    verifyUserToken()
      .then((resp) => {
        setIsProfileIncomplete(resp?.data?.isProfileCompleted)
        setLoggedUserObj(resp?.data?.user);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadBankDetailsOfUser = () => {
    popUploader(dispatch, true);
    const filters: bankDetailsFiltrationObj = {
      bankName: null,
      branch: null,
      accountNumber: null,
      accountHolderName: null,
      status: null,
      page: null,
      perPage: null,
    };
    getAllBankDetailsOfAuthUser(filters)
      .then((resp) => {
        setBankDetailsOfUser(resp?.data);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  useEffect(() => {
    if (bankDetailsOfUser?.length > 0) {
      form.setFieldsValue({
        bankDetailsData: bankDetailsOfUser.map((item: BankDetailsObj) => ({
          id: item.id,
          bankName: item.bankName,
          branch: item.branch,
          accountNumber: item.accountNumber,
          accountHolderName: item.accountHolderName,
          status: item.status,
        })),
      });
      setSavedStatus(bankDetailsOfUser.map(() => true));
    } else {
      form.setFieldsValue({
        bankDetailsData: [{}],
      });
      setSavedStatus([false]);
    }
  }, [bankDetailsOfUser, form]);

  const handleSaveBankDetail = async (index: number) => {
    try {
      const accNumber = ["bankDetailsData", index, "accountNumber"];
      const accName = ["bankDetailsData", index, "accountHolderName"];
      const bankName = ["bankDetailsData", index, "bankName"];
      const branch = ["bankDetailsData", index, "branch"];

      await form.validateFields([accNumber, accName, bankName, branch]);

      const values = form.getFieldValue("bankDetailsData");
      const rowData = values[index];

      // console.log("Saving data:", rowData);

      popUploader(dispatch, true);

      const payload = {
        userId: loggedUserObj?.id,
        bankName: rowData?.bankName,
        branch: rowData?.branch,
        accountNumber: rowData?.accountNumber,
        accountHolderName: rowData?.accountHolderName,
      };

      createNewBankDetail(payload)
        .then((res) => {
          setSavedStatus((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          loadBankDetailsOfUser();
          getAuthUserDetails();
          dispatch({
            type: "IS_PROFILE_UPDATE",
            value: { isUpdate: true, type: 0 },
          });
          customToastMsg("Bank detail save successfully", 1);
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          const { message } = error;
          Object.keys(message).forEach((key) => {
            if (message[key]) {
              customToastMsg(message[key], 0);
            }
          });
        });
    } catch (error) {
      console.warn("Validation failed:", error);
    }
  };

  const handleUpdateBankDetail = async (index: number) => {
    try {
      const accNumber = ["bankDetailsData", index, "accountNumber"];
      const accName = ["bankDetailsData", index, "accountHolderName"];
      const bankName = ["bankDetailsData", index, "bankName"];
      const branch = ["bankDetailsData", index, "branch"];

      await form.validateFields([accNumber, accName, bankName, branch]);

      const values = form.getFieldValue("bankDetailsData");
      const rowData = values[index];

      // console.log("Saving data:", rowData);

      popUploader(dispatch, true);

      const payload = {
        userId: loggedUserObj?.id,
        bankAccountId: rowData?.id,
        bankName: rowData?.bankName,
        branch: rowData?.branch,
        accountNumber: rowData?.accountNumber,
        accountHolderName: rowData?.accountHolderName,
        status: rowData?.status,
      };

      updateBankDetail(payload)
        .then((res) => {
          setSavedStatus((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          loadBankDetailsOfUser();
          customToastMsg("Bank detail updated successfully", 1);
          popUploader(dispatch, false);
        })
        .catch((error) => {
          popUploader(dispatch, false);
          const { message } = error;
          Object.keys(message).forEach((key) => {
            if (message[key]) {
              customToastMsg(message[key], 0);
            }
          });
        });
    } catch (error) {
      console.warn("Validation failed:", error);
    }
  };

  const handleDeleteBankDetailAndForm = async ({
    index,
    form,
    remove,
    objName,
    savedStatus,
    setSavedStatus,
    handleError,
    bankDetailId,
  }: {
    index: number;
    form: any;
    remove: (name: number) => void;
    objName: number;
    savedStatus: boolean[];
    setSavedStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
    handleError: (error: any) => void;
    bankDetailId?: number;
  }) => {
    const currentRow = form.getFieldValue("bankDetailsData")[index];

    if (savedStatus[index] && bankDetailId !== undefined) {
      try {
        // console.log("API call to delete with ID:", bankDetailId);
        popUploader(dispatch, true);
        deleteBankDetail(bankDetailId)
          .then((res) => {
            loadBankDetailsOfUser();
            getAuthUserDetails();
            dispatch({
              type: "IS_PROFILE_UPDATE",
              value: { isUpdate: true, type: 0 },
            });
            customToastMsg("Bank detail deleted successfully", 1);
            remove(objName);
            const remaining = form.getFieldValue("bankDetailsData");
            if (!remaining || remaining.length === 0) {
              form.setFieldsValue({
                bankDetailsData: [{}],
              });
              setSavedStatus([false]);
            } else {
              setSavedStatus((prev) => {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
              });
            }
            popUploader(dispatch, false);
          })
          .catch((err) => {
            popUploader(dispatch, false);
            handleError(err);
            return;
          });
      } catch (err) {
        popUploader(dispatch, false);
        handleError(err);
        return;
      }
    } else {
      // For unsaved entries, just remove the form row
      remove(objName);

      const remaining = form.getFieldValue("bankDetailsData");
      if (!remaining || remaining.length === 0) {
        form.setFieldsValue({
          bankDetailsData: [{}],
        });
        setSavedStatus([false]);
      } else {
        setSavedStatus((prev) => {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        });
      }
    }
  };

  return (
    <>

      {loggedUserObj && <EditProfileModal isOpen={isOpenEditProfileModal} userDetails={loggedUserObj} onClose={() => {
        setIsOpenEditProfileModal(false);
      }} updatedProfile={() => {
        getAuthUserDetails();
        dispatch({
          type: "IS_PROFILE_UPDATE",
          value: { isUpdate: true, type: 0 },
        });
      }} />}
      <MainLayout pageName="whitePage">
        <main>
          <div
            className="bg-white d-flex justify-content-center align-item-center ProfilePageContainer"
            style={{
              padding: "140px 0px 80px 0px",
              minHeight: "100vh",
              height: "auto",
            }}
          >
            <div className="listingMainPage_inner">
              {loggedUserObj && (
                <Row className="d-flex justify-content-center align-items-center">
                  <Col
                    xs={10}
                    sm={7}
                    md={5}
                    lg={4}
                    xl={3}
                    xxl={3}
                    className="d-flex justify-content-center justify-content-md-start"
                  >
                    <img
                      src={
                        loggedUserObj?.file?.largePath
                          ? loggedUserObj?.file?.largePath
                          : defaultProfileImage
                      }
                      height="100%"
                      width="100%"
                      className="rounded-circle border border-dark mb-4 mb-md-0"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={15}
                    lg={17}
                    xl={18}
                    xxl={18}
                    className=" ps-0 ps-md-5"
                  >

                    {!isProfileIncomplete && <p
                      className="mx-2 cursor-setUp rounded-4 my-2" style={{ width: "max-content", color: "orange" }}
                    >
                      <small className="font-weight-medium font-size-6">Incomplete Profile </small>
                    </p>}
                    <h1 className="font-size-1 font-weight-medium text-center text-md-start font-family-2 my-1">
                      {formatNamesCmnFun(
                        `${loggedUserObj?.firstName ?? ""} ${loggedUserObj?.lastName ?? ""}`.trim()
                      )}
                    </h1>
                    <h1 className="font-size-3 font-weight-medium text-center text-md-start font-family-2 my-1">
                      {loggedUserObj?.email}
                    </h1>
                    {loggedUserObj?.countryCode && loggedUserObj?.contactNo && (
                      <h1 className="font-size-3 font-weight-medium text-center text-md-start font-family-2 my-1">
                        {loggedUserObj?.countryCode +
                          " " +
                          loggedUserObj?.contactNo}
                      </h1>
                    )}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={3}
                    xl={3}
                    xxl={3}
                    className="d-flex justify-content-center justify-content-md-end align-self-end"
                  >
                    <Button
                      onClick={() => {
                        setIsOpenEditProfileModal(true)
                      }}
                      size="large"
                      type="primary"
                      className="mt-5 mt-md-0"
                    >
                      Edit Profile
                    </Button>
                  </Col>
                </Row>
              )}

              <Form
                form={form}
                layout="vertical"
                className="w-100"
                name="dynamic_form_nest_item"
                autoComplete="off"
                style={{ height: cardHeight ? `${cardHeight}px` : "100vh" }}
              >
                <Row className="w-100 my-5 h-auto">
                  <h1 className="font-size-3 font-weight-medium  text-center text-md-start font-family-2 m-0 mb-3">
                    Bank Details
                  </h1>
                  <div className="bank_details-tab-container w-100">
                    <div
                      style={{
                        margin: "0 0 20px 0 ",
                      }}
                      className={`flip-card w-100 ${isBankDetailsEditable ? "flipped" : ""
                        }`}
                    >
                      {/* Front Side */}
                      <Card
                        hoverable
                        className={`flip-card-front w-100 h-auto ${frontCardClass}`}
                        ref={frontRef}
                      >
                        <Row className="w-100 h-auto">
                          {bankDetailsOfUser.length > 0 ? (
                            <Col
                              xs={24}
                              sm={24}
                              md={24}
                              lg={24}
                              xl={24}
                              xxl={24}
                              className="d-flex flex-column"
                            >
                              <Row className="w-100 h-auto">
                                {bankDetailsOfUser.map(
                                  (bankDetails: BankDetailsObj) => {
                                    return (
                                      <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                        xxl={12}
                                        className="px-0 px-lg-2"
                                      >
                                        <Card className="mb-3">
                                          <Row>
                                            <Col
                                              xs={12}
                                              sm={8}
                                              md={6}
                                              lg={10}
                                              xl={8}
                                              xxl={8}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                Bank Name
                                              </h2>
                                            </Col>
                                            <Col xs={1}>
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                :
                                              </h2>
                                            </Col>
                                            <Col
                                              xs={11}
                                              sm={15}
                                              md={17}
                                              lg={13}
                                              xl={15}
                                              xxl={15}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                {bankDetails?.bankName}
                                              </h2>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col
                                              xs={12}
                                              sm={8}
                                              md={6}
                                              lg={10}
                                              xl={8}
                                              xxl={8}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                Branch
                                              </h2>
                                            </Col>
                                            <Col xs={1}>
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                :
                                              </h2>
                                            </Col>
                                            <Col
                                              xs={11}
                                              sm={15}
                                              md={17}
                                              lg={13}
                                              xl={15}
                                              xxl={15}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                {bankDetails?.branch}
                                              </h2>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col
                                              xs={12}
                                              sm={8}
                                              md={6}
                                              lg={10}
                                              xl={8}
                                              xxl={8}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                Account Holder
                                              </h2>
                                            </Col>
                                            <Col xs={1}>
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                :
                                              </h2>
                                            </Col>
                                            <Col
                                              xs={11}
                                              sm={15}
                                              md={17}
                                              lg={13}
                                              xl={15}
                                              xxl={15}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                {bankDetails?.accountHolderName}
                                              </h2>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col
                                              xs={12}
                                              sm={8}
                                              md={6}
                                              lg={10}
                                              xl={8}
                                              xxl={8}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                Account Number
                                              </h2>
                                            </Col>
                                            <Col xs={1}>
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                :
                                              </h2>
                                            </Col>
                                            <Col
                                              xs={11}
                                              sm={15}
                                              md={17}
                                              lg={13}
                                              xl={15}
                                              xxl={15}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                {bankDetails?.accountNumber}
                                              </h2>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col
                                              xs={12}
                                              sm={8}
                                              md={6}
                                              lg={10}
                                              xl={8}
                                              xxl={8}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                Status
                                              </h2>
                                            </Col>
                                            <Col xs={1}>
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                :
                                              </h2>
                                            </Col>
                                            <Col
                                              xs={11}
                                              sm={15}
                                              md={17}
                                              lg={13}
                                              xl={15}
                                              xxl={15}
                                            >
                                              {" "}
                                              <h2 className="font-size-6 font-weight-normal p-0 my-2">
                                                <Tag
                                                  color={
                                                    bankDetails?.status ==
                                                      BankDetailsStatusEnum.ACTIVE
                                                      ? "green"
                                                      : bankDetails?.status ==
                                                        BankDetailsStatusEnum.INACTIVE
                                                        ? "red"
                                                        : ""
                                                  }
                                                >
                                                  {" "}
                                                  {bankDetails?.status}
                                                </Tag>{" "}
                                              </h2>
                                            </Col>
                                          </Row>
                                        </Card>
                                      </Col>
                                    );
                                  }
                                )}
                              </Row>

                              <Button
                                onClick={() => {
                                  setIsBankDetailsEditable(true);
                                }}
                                size="large"
                                type="primary"
                                className="mx-0 mx-lg-2 align-self-end"
                              >
                                Add / Edit Bank Accounts
                              </Button>
                            </Col>
                          ) : (
                            <Col xs={24} className="">
                              <h5 className="font-size-6 font-weight-normal mb-4 m-0">
                                Add your bank details here
                              </h5>
                              <Button
                                onClick={() => {
                                  setIsBankDetailsEditable(true);
                                }}
                                size="large"
                                type="primary"
                              >
                                Add Bank Account
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </Card>

                      {/* Back Side */}
                      <Card
                        hoverable
                        // className="flip-card-back w-100 h-auto"
                        className={`flip-card-back w-100 h-auto ${backCardClass}`}
                        ref={backRef}
                      >
                        <Row className="my-1">
                          <Form.List name="bankDetailsData">
                            {(fields, { add, remove }) => (
                              <div className="d-flex flex-column w-100 align-items-end">
                                {fields.map((obj, index) => {
                                  const currentValues = bankDetailsOfUser[index];
                                  // const isExisting = !!currentValues?.url;

                                  // console.log(currentValues);

                                  return (
                                    <div key={index} className="w-100 my-1">
                                      <Row className="w-100 border rounded p-3 mb-3">
                                        {savedStatus[index] && (
                                          <Col
                                            xs={24}
                                            sm={24}
                                            md={24}
                                            lg={24}
                                            xl={24}
                                            xxl={24}
                                            className="pe-0 pe-lg-2 mb-3"
                                          >
                                            <Form.Item
                                              name={[obj.name, "status"]}
                                              label=""
                                              className="w-100"
                                            >
                                              <Switch
                                                checked={
                                                  form.getFieldValue(
                                                    "bankDetailsData"
                                                  )?.[index]?.status ===
                                                  BankDetailsStatusEnum.ACTIVE
                                                }
                                                onChange={(checked) => {
                                                  const newStatus = checked
                                                    ? BankDetailsStatusEnum.ACTIVE
                                                    : BankDetailsStatusEnum.INACTIVE;

                                                  form.setFieldsValue({
                                                    bankDetailsData: form
                                                      .getFieldValue(
                                                        "bankDetailsData"
                                                      )
                                                      .map(
                                                        (
                                                          item: any,
                                                          idx: number
                                                        ) => {
                                                          if (idx === index) {
                                                            return {
                                                              ...item,
                                                              status: newStatus,
                                                            };
                                                          }
                                                          return item;
                                                        }
                                                      ),
                                                  });
                                                }}
                                                checkedChildren="Active"
                                                unCheckedChildren="Inactive"
                                                style={{
                                                  backgroundColor:
                                                    form.getFieldValue(
                                                      "bankDetailsData"
                                                    )?.[index]?.status ===
                                                      BankDetailsStatusEnum.ACTIVE
                                                      ? "#60b24c"
                                                      : "#bababa",
                                                }}
                                              />
                                            </Form.Item>
                                          </Col>
                                        )}
                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={10}
                                          xl={10}
                                          xxl={10}
                                          className="pe-0 pe-lg-2 mb-3"
                                        >
                                          <Form.Item
                                            name={[obj.name, "accountNumber"]}
                                            label="Account Number"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Please enter account number",
                                              },
                                            ]}
                                            className="w-100"
                                          >
                                            <Input
                                              type="number"
                                              size="large"
                                              placeholder="Enter your account number"
                                              className="w-100 py-2"
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={14}
                                          xl={14}
                                          xxl={14}
                                          className="ps-0 ps-lg-2 mb-3"
                                        >
                                          <Form.Item
                                            name={[obj.name, "accountHolderName"]}
                                            label="Account Holder Name"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Please enter account holder name",
                                              },
                                            ]}
                                            className="w-100"
                                          >
                                            <Input
                                              size="large"
                                              placeholder="Enter account holder name"
                                              className="w-100 py-2"
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={10}
                                          xl={10}
                                          xxl={10}
                                          className="pe-0 pe-lg-2 mb-3"
                                        >
                                          <Form.Item
                                            name={[obj.name, "bankName"]}
                                            label="Bank Name"
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please enter bank name",
                                              },
                                            ]}
                                            className="w-100"
                                          >
                                            <Input
                                              size="large"
                                              placeholder="Enter your bank name"
                                              className="w-100 py-2"
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={10}
                                          xl={10}
                                          xxl={10}
                                          className="ps-0 ps-lg-2 pe-0 pe-lg-2 mb-3"
                                        >
                                          <Form.Item
                                            name={[obj.name, "branch"]}
                                            label="Branch"
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please enter branch",
                                              },
                                            ]}
                                            className="w-100"
                                          >
                                            <Input
                                              size="large"
                                              placeholder="Enter branch"
                                              className="w-100 py-2"
                                            />
                                          </Form.Item>
                                        </Col>

                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={4}
                                          xl={4}
                                          xxl={4}
                                          className="ps-0 ps-lg-2 d-flex align-items-start justify-content-end justify-content-lg-start mt-3 mt-lg-0"
                                        >
                                          {savedStatus[index] ? (
                                            <Button
                                              size="large"
                                              className="bankDetailFormRepeaterBtns"
                                              onClick={() =>
                                                handleUpdateBankDetail(obj.name)
                                              }
                                            >
                                              Edit
                                            </Button>
                                          ) : (
                                            <Button
                                              size="large"
                                              className="bankDetailFormRepeaterBtns"
                                              onClick={() =>
                                                handleSaveBankDetail(obj.name)
                                              }
                                            >
                                              Save
                                            </Button>
                                          )}

                                          {(savedStatus[index] ||
                                            fields.length > 1) &&
                                            (savedStatus[index] &&
                                              currentValues?.id !== undefined ? (
                                              <Popconfirm
                                                title="Delete bank account"
                                                description="Are you sure to delete this bank account?"
                                                onConfirm={() => {
                                                  handleDeleteBankDetailAndForm({
                                                    index,
                                                    form,
                                                    remove,
                                                    objName: obj.name,
                                                    savedStatus,
                                                    setSavedStatus,
                                                    handleError,
                                                    bankDetailId:
                                                      currentValues?.id,
                                                  });
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                              >
                                                {" "}
                                                <Button
                                                  className="ms-3 bankDetailFormRepeaterBtns"
                                                  size="large"
                                                >
                                                  <Trash
                                                    className="font-size-5 font-weight-normal"
                                                    strokeWidth={1.8}
                                                  />
                                                </Button>
                                              </Popconfirm>
                                            ) : (
                                              <Button
                                                className="ms-3 bankDetailFormRepeaterBtns"
                                                size="large"
                                                onClick={() => {
                                                  handleDeleteBankDetailAndForm({
                                                    index,
                                                    form,
                                                    remove,
                                                    objName: obj.name,
                                                    savedStatus,
                                                    setSavedStatus,
                                                    handleError,
                                                    bankDetailId:
                                                      currentValues?.id,
                                                  });
                                                }}
                                              >
                                                <Trash
                                                  className="font-size-5 font-weight-normal"
                                                  strokeWidth={1.8}
                                                />
                                              </Button>
                                            ))}
                                        </Col>
                                      </Row>
                                    </div>
                                  );
                                })}
                                <Form.Item className="mt-3">
                                  <Button
                                    onClick={() => {
                                      setIsBankDetailsEditable(false);
                                    }}
                                    size="large"
                                    type="default"
                                    className="me-3 px-4 mb-3 mb-sm-0"
                                  >
                                    Back
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={() => add()}
                                    size="large"
                                    icon={<PlusOutlined />}
                                  >
                                    Add Another Account
                                  </Button>
                                </Form.Item>
                              </div>
                            )}
                          </Form.List>
                        </Row>
                      </Card>
                    </div>
                  </div>
                </Row>
              </Form>
            </div>
          </div>
        </main>
      </MainLayout>

    </>
  );
};

export default ProfilePage;
