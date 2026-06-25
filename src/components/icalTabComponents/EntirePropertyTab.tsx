import { Button, Col, Form, Input, Popconfirm, Row, Space } from "antd";
import "../../styles/propertyListingStyles.scss";
import "../../styles/ical/icanPageStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleError, popUploader } from "../../common/commonFunctions";
import { useDispatch } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Trash } from "react-feather";
import {
  IcalObjICalendarsObj,
  IcalObjPropertyDetailsObj,
} from "../../common/interfaces/uiNecessaryInterface";
import { deleteIcalURL, generateIcalURL } from "../../service/icalService";
import ICalExportURLModal from "../common/modal/ICalExportURLModal";

interface EntirePropertyTabProps {
  icalDetails: IcalObjICalendarsObj[];
  propertyDetails: IcalObjPropertyDetailsObj;
  loadIcalDetails: () => void;
}
const EntirePropertyTab: React.FC<EntirePropertyTabProps> = ({
  icalDetails,
  propertyDetails,
  loadIcalDetails,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  // console.log(icalDetails);
  const [form] = Form.useForm();
  const [isOpenRExportURLModal, setIsOpenRExportURLModal] =
    useState<boolean>(false);
  const [exportURLDetails, setexportURLDetails] = useState<string>();
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const [savedStatus, setSavedStatus] = useState<boolean[]>([]);

  useEffect(() => {
    if (icalDetails?.length > 0) {
      form.setFieldsValue({
        icalPlatforms: icalDetails.map((item) => ({
          platform: item.platform,
          url: item.url,
          icalLinkId: item?.id ? item?.id : null
        })),
      });
      setSavedStatus(icalDetails.map(() => true));
    } else {
      setSavedStatus([false]);
    }
  }, [icalDetails, form]);

  const handleSave = async (index: number) => {
    try {
      const platformField = ["icalPlatforms", index, "platform"];
      const linkField = ["icalPlatforms", index, "url"];

      await form.validateFields([platformField, linkField]);

      const values = form.getFieldValue("icalPlatforms");
      const rowData = values[index];

      // console.log("Saving data:", rowData);

      // popUploader(dispatch, true);

      setModalLoading(true);
      setIsOpenRExportURLModal(true);

      const payload = {
        propertyId: propertyDetails?.id,
        accommodationUnitId: "",
        subUnitId: "",
        isEntireProperty: true,
        url: rowData?.url,
        platform: rowData?.platform,
        icalLinkId: rowData?.icalLinkId ? rowData?.icalLinkId : null
      };



      generateIcalURL(payload)
        .then((res) => {
          // setIsOpenRExportURLModal(true);
          setModalLoading(false);
          setexportURLDetails(res?.data);
          setSavedStatus((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          loadIcalDetails();
          // popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          setModalLoading(false);
          setIsOpenRExportURLModal(false);
          handleError(err);
        });
    } catch (error) {
      console.warn("Validation failed:", error);
    }
  };

  const entirePropertyExportFunction = () => {
    // popUploader(dispatch, true);
    setModalLoading(true);
    setIsOpenRExportURLModal(true);

    const payload = {
      propertyId: propertyDetails?.id,
      accommodationUnitId: "",
      subUnitId: "",
      isEntireProperty: true,
      url: "",
      platform: "",
    };

    generateIcalURL(payload)
      .then((res) => {
        // setIsOpenRExportURLModal(true);
        setexportURLDetails(res?.data);
        setModalLoading(false);
        // popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleDeleteIcalEntryAndForm = async ({
    index,
    form,
    remove,
    objName,
    savedStatus,
    setSavedStatus,
    handleError,
    icalId,
  }: {
    index: number;
    form: any;
    remove: (name: number) => void;
    objName: number;
    savedStatus: boolean[];
    setSavedStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
    handleError: (error: any) => void;
    icalId?: number;
  }) => {
    const currentRow = form.getFieldValue("icalPlatforms")[index];

    if (savedStatus[index] && icalId !== undefined) {
      try {
        // console.log("API call to delete with ID:", icalId);
        popUploader(dispatch, true);
        deleteIcalURL(icalId)
          .then((res) => {
            loadIcalDetails();

            remove(objName);
            const remaining = form.getFieldValue("icalPlatforms");
            if (!remaining || remaining.length === 0) {
              form.setFieldsValue({
                icalPlatforms: [{}],
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

      const remaining = form.getFieldValue("icalPlatforms");
      if (!remaining || remaining.length === 0) {
        form.setFieldsValue({
          icalPlatforms: [{}],
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
    <div className="EntirePropertyTabContainer w-100">
      {exportURLDetails && (
        <ICalExportURLModal
          isOpen={isOpenRExportURLModal}
          exportURL={exportURLDetails}
          propertyName={propertyDetails?.name}
          loading={modalLoading}
          onClose={() => {
            setIsOpenRExportURLModal(false);
          }}
        />
      )}
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="w-100">
          <Form
            form={form}
            layout="vertical"
            className="w-100"
            name="dynamic_form_nest_item"
            autoComplete="off"
            initialValues={{
              icalPlatforms:
                icalDetails.length > 0
                  ? icalDetails.map((item) => ({
                    platform: item.platform,
                    url: item.url,
                    id: item.id,
                  }))
                  : [{}],
            }}
          >
            <Button
              size="large"
              type="primary"
              className="my-3"
              onClick={() => {
                entirePropertyExportFunction();
              }}
            >
              Export Serviced Apartments Link
            </Button>
            <Form.List name="icalPlatforms">
              {(fields, { add, remove }) => (
                <div className="d-flex flex-column w-100 align-items-end">
                  {fields.map((obj, index) => {
                    const currentValues = icalDetails[index];
                    const isExisting = !!currentValues?.url;

                    // console.log(currentValues);

                    return (
                      <div key={index} className="w-100 my-1">
                        <Row className="w-100">
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                            xxl={8}
                            className="pe-0 pe-lg-2"
                          >
                            <Form.Item
                              name={[obj.name, "platform"]}
                              label="Platform"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter platform name",
                                },
                                {
                                  validator: (_, value) =>
                                    value && value.trim() !== ""
                                      ? Promise.resolve()
                                      : Promise.reject(new Error("Platform name cannot be just spaces")),
                                }
                              ]}
                              className="w-100"
                            >
                              <Input
                                size="large"
                                placeholder="Enter your platform"
                                className="w-100 py-2"
                              />
                            </Form.Item>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={12}
                            xl={12}
                            xxl={12}
                            className="ps-0 ps-lg-2 pe-0 pe-lg-2"
                          >
                            <Form.Item
                              name={[obj.name, "url"]}
                              label="Ical Link"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter Ical link",
                                },
                                {
                                  validator: (_, value) =>
                                    value && value.trim() !== ""
                                      ? Promise.resolve()
                                      : Promise.reject(new Error("Ical link cannot be just spaces")),
                                }
                              ]}
                              className="w-100"
                            >
                              <Input
                                size="large"
                                placeholder="Paste your ical link"
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
                            <Button
                              size="large"
                              className="icalFormRepeaterBtns"
                              onClick={() => handleSave(obj.name)}
                            >
                              {savedStatus[index] ? "Edit Link" : "Save Link"}
                            </Button>
                            {(savedStatus[index] || fields.length > 1) &&
                              (savedStatus[index] &&
                                currentValues?.id !== undefined ? (
                                <Popconfirm
                                  title="Delete this ical link"
                                  description="Are you sure to delete this ical link ?"
                                  onConfirm={() => {
                                    handleDeleteIcalEntryAndForm({
                                      index,
                                      form,
                                      remove,
                                      objName: obj.name,
                                      savedStatus,
                                      setSavedStatus,
                                      handleError,
                                      icalId: currentValues?.id,
                                    });
                                  }}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  {" "}
                                  <Button
                                    className="ms-3 icalFormRepeaterBtns"
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
                                  className="ms-3 icalFormRepeaterBtns"
                                  size="large"
                                  onClick={() => {
                                    handleDeleteIcalEntryAndForm({
                                      index,
                                      form,
                                      remove,
                                      objName: obj.name,
                                      savedStatus,
                                      setSavedStatus,
                                      handleError,
                                      icalId: currentValues?.id,
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
                      type="primary"
                      onClick={() => add()}
                      size="large"
                      icon={<PlusOutlined />}
                    >
                      Add Another Ical Link
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            {/* <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item> */}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default EntirePropertyTab;
