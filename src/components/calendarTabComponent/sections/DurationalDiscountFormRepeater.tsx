import { Button, Card, Col, Divider, Form, InputNumber, Row, Select, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { DiscountDetailsObj, DropdownObj } from "../../../common/interfaces/uiNecessaryInterface";
import { useEffect } from "react";
import "../../../styles/calenderStyles.scss";


interface DurationalDiscountFormRepeaterProps {
    durationalDiscountList: DropdownObj[];
    selectedDiscount?: DiscountDetailsObj;
    onSave: (data: {
        discountId: number;
        durationDetails: {
            propertyDiscountId: number | null;
            discountDurationId: number;
            value: number;
        }[];
    }) => void;
    onCancel: () => void;
}

const DurationalDiscountFormRepeater: React.FC<DurationalDiscountFormRepeaterProps> = ({
    durationalDiscountList,
    selectedDiscount,
    onSave,
    onCancel
}) => {
    const [form] = Form.useForm();

    // Pre-fill existing data or at least one empty row
    useEffect(() => {
        const initialDetails =
            selectedDiscount?.discount?.durationDetails?.length
                ? selectedDiscount.discount.durationDetails.map(detail => ({
                    discountDurationId: detail.discountDurationId,
                    value: detail.value,
                    propertyDiscountId: detail.propertyDiscountId ?? null
                }))
                : [{ discountDurationId: undefined, value: undefined, propertyDiscountId: null }];

        form.setFieldsValue({ durationDetails: initialDetails });
    }, [selectedDiscount, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const filteredDetails = (values.durationDetails || []).filter(
                (item: any) => !(item.discountDurationId === undefined && item.value === undefined)
            );

            const isSingleEmpty = filteredDetails.length === 0;

            const formatted = {
                discountId: selectedDiscount?.discount?.id ?? 0,
                durationDetails: isSingleEmpty
                    ? []
                    : filteredDetails.map((item: any, index: number) => ({
                        propertyDiscountId:
                            selectedDiscount?.discount?.durationDetails?.[index]?.propertyDiscountId ?? null,
                        discountDurationId: item.discountDurationId,
                        value: item.value,
                    })),
            };


            onSave(formatted);
        } catch (error) {
            // Ant Design will automatically display validation errors
            // console.error("Validation failed:", error);
        }
    };

    const validateDuration = (_: any, value: any, index: number) => {
        const otherFieldValue = form.getFieldValue(["durationDetails", index, "value"]);
        if (value === undefined && otherFieldValue !== undefined) {
            return Promise.reject(new Error("Select duration"));
        }
        return Promise.resolve();
    };

    const validateDiscount = (_: any, value: any, index: number) => {
        const otherFieldValue = form.getFieldValue(["durationDetails", index, "discountDurationId"]);
        if (value === undefined && otherFieldValue !== undefined) {
            return Promise.reject(new Error("Enter discount"));
        }
        return Promise.resolve();
    };


    // UPDATED: Disable already selected options for other rows
    const getDisabledOptions = (currentIndex: number) => {
        const selectedIds: number[] = form.getFieldValue("durationDetails")
            ?.map((d: any, i: number) => (i !== currentIndex ? d?.discountDurationId : null))
            .filter((v: number | null) => v !== null) || [];

        return durationalDiscountList.map(option => ({
            ...option,
            disabled: selectedIds.includes(Number(option.value)),
        }));
    };

    return (
        <Form form={form} layout="vertical" className="w-100">
            <Form.List name="durationDetails" >
                {(fields, { add, remove }) => (
                    <div className="w-100">
                        {fields.map((field, index) => {
                            const currentValue = form.getFieldValue(["durationDetails", field.name]) || {};
                            const isOnlyRow = fields.length === 1;
                            const isEmptyRow =
                                currentValue.discountDurationId === undefined &&
                                currentValue.value === undefined;

                            return (
                                <Card
                                    key={field.key}
                                    size="small"
                                    style={{
                                        marginBottom: 16,
                                        // background: "#f9f9f9",
                                        borderRadius: 8,
                                        // border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <Row gutter={[16, 8]} align="middle" className="align-items-start">
                                        <Col xs={24} sm={24} md={10} lg={24} xl={10} xxl={10}>
                                            <Form.Item
                                                label="No of dates"
                                                {...field}
                                                name={[field.name, "discountDurationId"]}
                                                rules={[
                                                    { validator: (_, val) => validateDuration(_, val, field.name) }
                                                ]}
                                            >
                                                <Select
                                                    style={{ height: 40, width: "100%", borderRadius: 5 }}
                                                    placeholder="Select duration"
                                                    options={getDisabledOptions(index)}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={10} lg={24} xl={10} xxl={10}>
                                            <Form.Item
                                                label="Discount"
                                                {...field}
                                                name={[field.name, "value"]}
                                                rules={[
                                                    { validator: (_, val) => validateDiscount(_, val, field.name) }
                                                ]}
                                            >
                                                <InputNumber
                                                    size="large"
                                                    className="w-100 "
                                                    addonAfter="%"
                                                    placeholder="Enter discount"
                                                    min={1}
                                                    max={100}
                                                    type="number"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={2} lg={24} xl={2} xxl={2} className="text-end align-self-start">
                                            {!(isOnlyRow && isEmptyRow) && (
                                                <Button
                                                    className="mb-1 durationalDiscountFormRepeaterBtns "
                                                    type="default"
                                                    icon={<DeleteOutlined />}
                                                    // onClick={() => remove(field.name)}
                                                    onClick={() => {
                                                        remove(field.name);
                                                        // If all removed → add an empty one
                                                        const currentFields = form.getFieldValue("durationDetails");
                                                        if (!currentFields || currentFields.length === 0) {
                                                            add({
                                                                discountDurationId: undefined,
                                                                value: undefined,
                                                                propertyDiscountId: null,
                                                            });
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })}

                        {fields.length < durationalDiscountList.length && (
                            <Button
                                type="default"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    add({
                                        discountDurationId: undefined,
                                        value: undefined,
                                        propertyDiscountId: null
                                    })
                                }
                                style={{ width: "100%" }}
                            >
                                Add Duration
                            </Button>
                        )}
                    </div>
                )}
            </Form.List>

            <Divider />

            <Row className="my-1 w-100">
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="pe-0 pe-md-2 pe-lg-0 my-2"
                >
                    <Button
                        onClick={handleSave}
                        disabled={!selectedDiscount?.discount?.valueEditable}
                        size="large"
                        type="primary"
                        className="w-100"
                    >
                        Save
                    </Button>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="ps-0 ps-md-2 ps-lg-0 my-2"
                >
                    <Button
                        onClick={() => onCancel()}
                        size="large"
                        type="default"
                        className="w-100"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    );
};

export default DurationalDiscountFormRepeater;
