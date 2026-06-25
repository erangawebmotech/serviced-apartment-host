import { Button, Card, Col, Form, Input, Popconfirm, Row } from "antd";
import "../../styles/propertyListingStyles.scss";
import "../../styles/ical/icanPageStyles.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  formatNamesCmnFun,
  handleError,
  popUploader,
} from "../../common/commonFunctions";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Trash } from "react-feather";
import {
  IcalObjAccommodationUnitsObj,
  IcalObjPropertyDetailsObj,
  IcalObjSubUnitsObj,
} from "../../common/interfaces/uiNecessaryInterface";
import { deleteIcalURL, generateIcalURL } from "../../service/icalService";
import ICalExportURLModal from "../common/modal/ICalExportURLModal";
import DefaultCardImage from "../../assets/images/DefaultCardImage.png";

interface IndividualUnitsTabProps {
  individualUnitsIcalDetails: IcalObjAccommodationUnitsObj[];
  propertyDetails: IcalObjPropertyDetailsObj;
  loadIcalDetails: () => void;
}
const IndividualUnitsTab: React.FC<IndividualUnitsTabProps> = ({
  individualUnitsIcalDetails,
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
  // const [savedStatus, setSavedStatus] = useState<boolean[]>([]);
  const [savedStatus, setSavedStatus] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    if (individualUnitsIcalDetails?.length > 0) {
      individualUnitsIcalDetails.forEach(
        (roomCat: IcalObjAccommodationUnitsObj) => {
          if (roomCat?.subUnits) {
            const initialObj: Record<string, any[]> = {};

            roomCat.subUnits.forEach((room) => {
              const listName = `icalPlatforms_${room.id}`;

              if (room.icalendars && room.icalendars.length > 0) {
                // Set form fields
                initialObj[listName] = room.icalendars.map((item) => ({
                  platform: item.platform,
                  url: item.url,
                  icalLinkId: item.id ? item.id : null,
                }));

                // Set saved status as true for each item
                setSavedStatus((prev) => ({
                  ...prev,
                  [room.id]: room.icalendars.map(() => true),
                }));
              } else {
                // Default empty form if no icalendars
                initialObj[listName] = [{}];
                setSavedStatus((prev) => ({
                  ...prev,
                  [room.id]: [false],
                }));
              }
            });

            form.setFieldsValue(initialObj);
          }
        }
      );
    }
  }, [individualUnitsIcalDetails, form]);

  const handleSave = async (
    accommodationUnitId: number,
    subUnitId: number,
    index: number
  ) => {
    try {
      const fieldName = `icalPlatforms_${subUnitId}`;
      const platformField = [fieldName, index, "platform"];
      const linkField = [fieldName, index, "url"];

      await form.validateFields([platformField, linkField]);

      const values = form.getFieldValue(fieldName);
      // console.log(values);
      // console.log(index);

      const rowData = values[index];

      // console.log("Saving data:", rowData);

      setModalLoading(true);
      setIsOpenRExportURLModal(true);

      const payload = {
        propertyId: propertyDetails?.id,
        accommodationUnitId: accommodationUnitId,
        subUnitId: subUnitId,
        isEntireProperty: false,
        url: rowData?.url,
        platform: rowData?.platform,
        icalLinkId: rowData?.icalLinkId ? rowData?.icalLinkId : null
      };


      generateIcalURL(payload)
        .then((res) => {
          setModalLoading(false);
          setexportURLDetails(res?.data);
          setSavedStatus((prev) => ({
            ...prev,
            [subUnitId]: (prev[subUnitId] || []).map((item, i) =>
              i === index ? true : item
            ),
          }));
          loadIcalDetails();
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

  const roomCategoryExportFunction = (
    accommodationUnitId: number,
    subUnitId: number
  ) => {
    // popUploader(dispatch, true);
    setModalLoading(true);
    setIsOpenRExportURLModal(true);

    const payload = {
      propertyId: propertyDetails?.id,
      accommodationUnitId: accommodationUnitId,
      subUnitId: subUnitId,
      isEntireProperty: false,
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

  const handleRemoveIcalEntryAndForm = async ({
    roomId,
    fieldName,
    fieldIdx,
    remove,
    form,
    savedStatus,
    setSavedStatus,
    icalId,
  }: {
    roomId: number;
    fieldName: string;
    fieldIdx: number;
    remove: (index: number) => void;
    form: any;
    savedStatus: any;
    setSavedStatus: React.Dispatch<React.SetStateAction<any>>;
    icalId?: number;
  }) => {
    if (savedStatus[roomId]?.[fieldIdx] && icalId !== undefined) {
      // console.log("api to remove data");
      try {
        // console.log("API call to delete with ID:", icalId);
        popUploader(dispatch, true);
        deleteIcalURL(icalId)
          .then((res) => {
            loadIcalDetails();

            remove(fieldIdx);
            const updatedFields = form.getFieldValue(fieldName);
            if (!updatedFields || updatedFields.length === 0) {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [fieldName]: [{}],
              });
              setSavedStatus((prev: any) => ({
                ...prev,
                [roomId]: [false],
              }));
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
      // Remove the field
      remove(fieldIdx);

      const updatedFields = form.getFieldValue(fieldName);
      if (!updatedFields || updatedFields.length === 0) {
        const currentFormValues = form.getFieldsValue();
        currentFormValues[fieldName] = [{}];
        form.setFieldsValue(currentFormValues);
        setSavedStatus((prev: any) => ({
          ...prev,
          [roomId]: [false],
        }));
      }
    }
  };

  return (
    <div className="IndividualUnitsTabContainer w-100">
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
          {individualUnitsIcalDetails.map(
            (roomCat: IcalObjAccommodationUnitsObj, index: number) => {
              return (
                <Card
                  key={index}
                  bordered={true}
                  className="w-100 my-3"
                  style={{
                    backgroundColor: "#E7F4FF",
                    border: "1px solid #87B4D7",
                  }}
                >
                  <Row className="w-100 d-flex justify-content-center">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                      <h2 className="font-size-4 font-weight-medium p-0 my-1">
                        {formatNamesCmnFun(roomCat?.name)}
                      </h2>

                      <Form
                        form={form}
                        layout="vertical"
                        className="w-100"
                        name="dynamic_form_nest_item"
                        autoComplete="off"
                      >
                        {roomCat?.subUnits.map((room: IcalObjSubUnitsObj) => {
                          const listName = `icalPlatforms_${room.id}`;
                          return (
                            <Card
                              className="my-3"
                              key={room.id}
                              hoverable
                            // style={{
                            //   backgroundColor: "#E7F4FF",
                            //   border: "1px solid #87B4D7",
                            // }}
                            >
                              <h2 className="font-size-4 font-weight-medium p-0 my-1">
                                {formatNamesCmnFun(room?.name)}
                              </h2>
                              <Button
                                size="large"
                                type="primary"
                                className="my-3"
                                onClick={() => {
                                  roomCategoryExportFunction(
                                    roomCat?.id,
                                    room.id
                                  );
                                }}
                              >
                                Export Serviced Apartments Link
                              </Button>
                              <Row>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={10}
                                  lg={6}
                                  xl={6}
                                  xxl={5}
                                  className="pe-0 pe-md-3"
                                >
                                  <img
                                    src={
                                      roomCat?.file?.largePath
                                        ? roomCat?.file?.largePath
                                        : DefaultCardImage
                                    }
                                    width="100%"
                                    style={{
                                      height: "100%",
                                      maxHeight: "250px ",
                                    }}
                                    className="rounded-3 object-fit-cover"
                                  />
                                </Col>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={14}
                                  lg={18}
                                  xl={18}
                                  xxl={19}
                                >
                                  <Form.List name={listName}>
                                    {(fields, { add, remove }) => (
                                      <div className="d-flex flex-column w-100 align-items-end">
                                        {fields.map((field, idx) => (
                                          <div
                                            key={field.key}
                                            className="w-100 my-1"
                                          >
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
                                                  name={[
                                                    field.name,
                                                    "platform",
                                                  ]}
                                                  label="Platform"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Please enter platform name",
                                                    },
                                                    {
                                                      validator: (_, value) =>
                                                        value && value.trim() !== ""
                                                          ? Promise.resolve()
                                                          : Promise.reject(new Error("Platform name cannot be just spaces")),
                                                    }
                                                  ]}
                                                >
                                                  <Input
                                                    size="large"
                                                    placeholder="Enter your platform"
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col
                                                xs={24}
                                                sm={24}
                                                md={24}
                                                lg={9}
                                                xl={10}
                                                xxl={11}
                                                className="ps-0 ps-lg-2 pe-0 pe-lg-2"
                                              >
                                                <Form.Item
                                                  name={[field.name, "url"]}
                                                  label="Ical Link"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Please enter Ical link",
                                                    }, {
                                                      validator: (_, value) =>
                                                        value && value.trim() !== ""
                                                          ? Promise.resolve()
                                                          : Promise.reject(new Error("Ical link cannot be just spaces")),
                                                    }
                                                  ]}
                                                >
                                                  <Input
                                                    size="large"
                                                    placeholder="Enter your ical link"
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
                                                  onClick={() =>
                                                    handleSave(
                                                      roomCat?.id,
                                                      room.id,
                                                      idx
                                                    )
                                                  }
                                                >
                                                  {savedStatus[room.id]?.[idx]
                                                    ? "Edit Link"
                                                    : "Save Link"}
                                                </Button>

                                                {(savedStatus[room.id]?.[idx] ||
                                                  fields.length > 1) &&
                                                  (savedStatus[room.id]?.[
                                                    idx
                                                  ] &&
                                                    room.icalendars?.[idx]?.id !==
                                                    undefined ? (
                                                    <Popconfirm
                                                      title="Delete this ical link"
                                                      description="Are you sure to delete this ical link?"
                                                      onConfirm={() => {
                                                        handleRemoveIcalEntryAndForm(
                                                          {
                                                            roomId: room.id,
                                                            fieldName: `icalPlatforms_${room.id}`,
                                                            fieldIdx: idx,
                                                            remove,
                                                            form,
                                                            savedStatus,
                                                            setSavedStatus,
                                                            icalId:
                                                              room.icalendars?.[
                                                                idx
                                                              ]?.id,
                                                          }
                                                        );
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
                                                          strokeWidth={1.8}
                                                        />
                                                      </Button>
                                                    </Popconfirm>
                                                  ) : (
                                                    <Button
                                                      className="ms-3 icalFormRepeaterBtns"
                                                      size="large"
                                                      onClick={() => {
                                                        handleRemoveIcalEntryAndForm(
                                                          {
                                                            roomId: room.id,
                                                            fieldName: `icalPlatforms_${room.id}`,
                                                            fieldIdx: idx,
                                                            remove,
                                                            form,
                                                            savedStatus,
                                                            setSavedStatus,
                                                            icalId:
                                                              room.icalendars?.[
                                                                idx
                                                              ]?.id,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      <Trash
                                                        strokeWidth={1.8}
                                                      />
                                                    </Button>
                                                  ))}
                                              </Col>
                                            </Row>
                                          </div>
                                        ))}
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
                                </Col>
                              </Row>
                            </Card>
                          );
                        })}
                      </Form>
                    </Col>
                  </Row>
                </Card>
              );
            }
          )}
        </Col>
      </Row>
    </div>
  );
};

export default IndividualUnitsTab;
