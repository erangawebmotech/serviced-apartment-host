import NavBar from "../components/NavBar";
import "../styles/listning/listningStyles.scss";
import "../styles/commonStyles.scss";
import Footer from "../components/Footer";
import filter from "../assets/images/mi_filter.png";
import defaultImage from "../assets/images/DefaultCardImage.png";
import { useEffect, useRef, useState } from "react";
import closeIcon from "../assets/images/close_29dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import {
  findAllLocationCategory,
  getAllPropertyListFiltration,
  getPropertyById,
  getPropertyType,
} from "../service/listningService";
import {
  customSweetAlert,
  customToastMsg,
  formatNamesCmnFun,
  handleError,
  popUploader,
  removeCookie,
  setEncryptedCookie,
  truncateDescriptions,
} from "../common/commonFunctions";
import { useDispatch } from "react-redux";
import {
  Alert,
  Badge,
  Button,
  Col,
  Empty,
  Input,
  message,
  Pagination,
  Popover,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import { Cookies } from "typescript-cookie";
import { useNavigate } from "react-router-dom";
import * as constants from "../common/constants";
import vector from "../assets/images/icon/Vector.png";
import { DownOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import {
  deleteDraftProperty,
  inactiveProperty,
} from "../service/propertyListingService";
import { PropertyStatusEnum } from "../common/enums/propertyStatusEnum";
import MainLayout from "../layout/MainLayout";
import { DropdownObj } from "../common/interfaces/uiNecessaryInterface";

interface Hotel {
  id: number;
  code: string;
  plan: string;
  name: string;
  address: string;
  city: string;
  status: string;
  propertyType: string;
  slug: string;
  propertyImages: any;
  isOnlyPropertyOwner: boolean,
}

const { Search } = Input;
const ListeningPage = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const dispatch = useDispatch();
  const [propertyName, setSearchPropertyName] = useState<string>("");
  const [propertyList, setPropertyTypeList] = useState([]);
  const [propertyTypeId, setPropertyTypeId] = useState<string>("");
  const [propertyStatusValue, setPropertyStatusValue] = useState<string>("");
  const [propertyStatusList, setPropertyStatusList] = useState<DropdownObj[]>([]);
  const [locationList, setLocationList] = useState([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");

  /* for district */
  const [districtValue, setDistrictValue] = useState("");
  const [citiesValue, setCitiesValue] = useState("");

  const [open, setOpen] = useState(null);

  /*pagination */
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalRecodes, setTotalRecodes] = useState<number>(0);

  const [cityExpanded, setExPandedCities] = useState();
  /* Range Picker Initialize */
  const { RangePicker } = DatePicker;

  /* set the cities Value expanded */
  const [expanded, setExpanded] = useState(null);

  /* location area expand */
  const [openLocationArea, setOpenLocationArea] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleToggle = (index: any) => {
    setOpen(open === index ? null : index);
  };

  const handleLocationAreaState = () => {
    setOpenLocationArea(!openLocationArea);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setPropertyStatusList([
      { value: PropertyStatusEnum.DRAFT, label: "Draft" },
      { value: PropertyStatusEnum.PENDING, label: "Pending" },
      { value: PropertyStatusEnum.PUBLISHED, label: "Published" },
      { value: PropertyStatusEnum.UNPUBLISHED, label: "Unpublished" },
      { value: PropertyStatusEnum.HOLD, label: "Hold" },
      { value: PropertyStatusEnum.REJECTED, label: "Rejected" },
    ]);
  }, []);
  useEffect(() => {
    LoadAllHotelList(
      propertyTypeId,
      propertyName,
      propertyStatusValue,
      districtValue,
      citiesValue,
      startDate,
      endDate,
      currentPage
    );
  }, [
    propertyTypeId,
    propertyStatusValue,
    districtValue,
    citiesValue,
    startDate,
    endDate,
    currentPage,
  ]);

  const handlePropertyNameChange = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set a new debounce timeout
    debounceRef.current = setTimeout(() => {
      LoadAllHotelList(
        propertyTypeId,
        name,
        propertyStatusValue,
        districtValue,
        citiesValue,
        startDate,
        endDate,
        currentPage
      );
    }, 1000);
  };

  const LoadAllHotelList = (
    propertyId?: string,
    propertyName?: string,
    propertyStatusValue?: string,
    districtValue?: string,
    citiesValue?: string,
    startDate?: any,
    endDate?: any,
    currentPage?: number
  ) => {
    if (
      propertyName !== "" ||
      propertyId !== "" ||
      propertyStatusValue !== "" ||
      districtValue !== "" ||
      citiesValue !== "" ||
      startDate !== "" ||
      endDate !== ""
    ) {
      popUploader(dispatch, true);
      getAllPropertyListFiltration(
        propertyId,
        propertyName,
        propertyStatusValue,
        districtValue,
        citiesValue,
        startDate,
        endDate,
        currentPage
      )
        .then((resp) => {
          //console.log(resp);
          setCurrentPage(resp.pagination.currentPage);
          setTotalRecodes(resp.pagination.totalCount);

          const mappedList: Hotel[] = resp.data.map((item: any) => {
            return {
              id: item.id,
              code: item.code,
              plan: item.plan?.name,
              name: item.name,
              address: item.address,
              city: item.city,
              status: item.status,
              propertyType: item.propertyType?.name,
              slug: item.slug,
              propertyImages:
                item.propertyImages.length > 0
                  ? item.propertyImages[0].file.mediumPath
                  : null,
              isOnlyPropertyOwner: item.isOnlyPropertyOwner,
            };
          });
          // console.log(mappedList);

          setHotelList(mappedList);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    } else {
      popUploader(dispatch, true);
      getAllPropertyListFiltration(
        propertyId,
        propertyName,
        propertyStatusValue,
        districtValue,
        citiesValue,
        startDate,
        endDate,
        currentPage
      )
        .then((resp) => {
          // console.log(resp);
          setCurrentPage(resp.pagination.currentPage);
          setTotalRecodes(resp.pagination.totalCount);
          const mappedList: Hotel[] = resp.data.map((item: any) => {
            return {
              id: item.id,
              code: item.code,
              plan: item.plan?.name,
              name: item.name,
              address: item.address,
              city: item.city,
              status: item.status,
              slug: item.slug,
              propertyType: item.propertyType?.name,
              propertyImages:
                item.propertyImages.length > 0
                  ? item.propertyImages[0].file.mediumPath
                  : null,
              isOnlyPropertyOwner: item.isOnlyPropertyOwner,
            };
          });

          setHotelList(mappedList);
          // console.log("yoooo:", mappedList[0].propertyImages);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  // const findEachPropertyDetail = (id: number) => {
  //   getPropertyById(id).then((res: any) => {});
  // };

  /* get property Type */
  useEffect(() => {
    getAllPropertyTypeList();
    getAllLocationCategory();
  }, [isSidebarOpen]);

  const getAllPropertyTypeList = () => {
    getPropertyType().then((res) => {
      setPropertyTypeList(res.data);
    });
  };
  /* searchByName */
  const searchByPropertyType = (id: any) => {
    setPropertyTypeId(id);
  };

  /* get all  location */
  const getAllLocationCategory = () => {
    findAllLocationCategory().then((res) => {
      // console.log("Location Area :", res.data);

      setLocationList(res.data);
      //  transformToTreeData(res.data);
    });
  };

  const treeData = locationList.map((location: any) => ({
    title: location.name,
    value: location.id,
    children: location.citys.map((city: { name: any; id: any }) => ({
      title: city.name,
      value: city.id,
    })),
  }));

  /* set The District Value */
  const toggleExpand = (id: any) => {
    setExpanded(expanded === id ? null : id);
    setDistrictValue(id);
    setCitiesValue("");
  };
  /* set The city Value */

  const onActionTheCitiesValue = (cityId: any) => {
    setExPandedCities(cityExpanded === cityId ? null : cityId);
    setCitiesValue(cityId);
  };

  /* handleDateRange */
  const handleDateRange = (date: any) => {
    if (date && date.length === 2) {
      const formattedStartDate = date[0].toISOString().split(".")[0];
      const formattedEndDate = date[1].toISOString().split(".")[0];
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    } else {
      // console.log("No date selected");
    }
  };

  const handleDeleteListedProperty = (propertyId: number) => {
    customSweetAlert("Are you sure to delete this property?", 4, () => {
      popUploader(dispatch, true);
      deleteDraftProperty(propertyId)
        .then((res) => {
          customToastMsg("Property delete successfully!", 1);
          removeCookie(constants.PROPERTY_ID);
          Cookies.remove(constants.PLAN_ID);
          Cookies.remove(constants.ROOM_ID);
          LoadAllHotelList(
            propertyTypeId,
            propertyName,
            propertyStatusValue,
            districtValue,
            citiesValue,
            startDate,
            endDate,
            0
          );
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    });
  };

  const handleUnpublishListedProperty = (
    propertyId: number,
    status: string
  ) => {
    customSweetAlert(`Are you sure to ${status === PropertyStatusEnum.PUBLISHED ? "publish" : status === PropertyStatusEnum.UNPUBLISHED ? "unpublish" : ""} this property?`, 4, () => {
      popUploader(dispatch, true);
      const payload = {
        status: status,
      };
      inactiveProperty(propertyId, payload)
        .then((res) => {
          customToastMsg(`Property ${status === PropertyStatusEnum.PUBLISHED ? "publish" : status === PropertyStatusEnum.UNPUBLISHED ? "unpublish" : ""} successfully!`, 1);
          LoadAllHotelList(
            propertyTypeId,
            propertyName,
            propertyStatusValue,
            districtValue,
            citiesValue,
            startDate,
            endDate,
            0
          );
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    });
  };

  const content = (
    propertyId: number,
    slug: string,
    propertyType: string,
    status: string,
    isOnlyPropertyOwner: boolean,
  ) => (
    <div>
      {!isOnlyPropertyOwner && <p
        className="mx-2 hover-effect"
        onClick={() => updateProperty(propertyId)}
      >
        Edit Property
      </p>}
      <p
        className="mx-2 hover-effect"
        onClick={() => {
          localStorage.setItem("fromLocation", "propertyList");
          window.open(`/view/${propertyId}`, "_blank");
        }}
      >
        View Property
      </p>

      {status !== PropertyStatusEnum.PUBLISHED &&
        status !== PropertyStatusEnum.UNPUBLISHED &&
        !isOnlyPropertyOwner && (
          <p
            className="mx-2 hover-effect"
            onClick={() => handleDeleteListedProperty(propertyId)}
          >
            {" "}
            Delete Property
          </p>
        )}
      {!isOnlyPropertyOwner && status === PropertyStatusEnum.PUBLISHED && (
        <p
          className="mx-2 hover-effect"
          onClick={() =>
            handleUnpublishListedProperty(
              propertyId,
              PropertyStatusEnum.UNPUBLISHED
            )
          }
        >
          {" "}
          Unpublish
        </p>
      )}
      {status === PropertyStatusEnum.UNPUBLISHED && (
        <p
          className="mx-2 hover-effect"
          onClick={() =>
            handleUnpublishListedProperty(
              propertyId,
              PropertyStatusEnum.PUBLISHED
            )
          }
        >
          {" "}
          Publish
        </p>
      )}
      <p
        style={{
          color: status === PropertyStatusEnum.PUBLISHED ? "black" : "gray",
          cursor: status === PropertyStatusEnum.PUBLISHED ? "pointer" : "default",
        }}
        className={`mx-2 ${status === PropertyStatusEnum.PUBLISHED ? "hover-effect" : "ps-2"
          }`}
        onClick={() => {
          navigate("/calendar", {
            state: { propertyId: propertyId },
          });
        }}
      >
        Calendar
      </p>
      <p
        style={{
          color:
            slug && slug != "" && status === PropertyStatusEnum.PUBLISHED
              ? "black"
              : "gray",
          cursor:
            slug && slug != "" && status === PropertyStatusEnum.PUBLISHED
              ? "pointer"
              : "default",
        }}
        className={`mx-2 ${slug && slug != "" && status === PropertyStatusEnum.PUBLISHED
          ? "hover-effect"
          : "ps-2"
          }`}
        onClick={() => {
          const baseUrl = import.meta.env.VITE_GUST_URL;
          const formattedPropertyType = propertyType
            .toLowerCase()
            .replace(/\s+/g, "-");
          const url = `${baseUrl}/${formattedPropertyType}/${slug}`;

          slug &&
            slug != "" &&
            status === PropertyStatusEnum.PUBLISHED &&
            copyToClipboard(url);
        }}
      >
        Copy Link
      </p>
      {!isOnlyPropertyOwner && <p
        style={{
          color: status === PropertyStatusEnum.PUBLISHED ? "black" : "gray",
          cursor: status === PropertyStatusEnum.PUBLISHED ? "pointer" : "default",
        }}
        className={`mx-2 ${status === PropertyStatusEnum.PUBLISHED ? "hover-effect" : "ps-2"
          }`}
        onClick={() => {
          navigate(`/synchronize/${propertyId}`);
          // navigate("/synchronize", {
          //   state: { propertyId: propertyId },
          // });
        }}
      >
        Synchronize
      </p>}
      {/* <p className="mx-2 hover-effect">Change Property Status</p>
      <p className="mx-2 hover-effect">Check Reservations</p>
      <p className="mx-2 hover-effect">Reviews</p>
      <p className="mb-1 mx-2 hover-effect">Payments</p> */}
    </div>
  );

  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // console.log("Copied to clipboard successfully!");
        setTimeout(() => {
          messageApi.open({
            type: "success",
            content: "Link copied to clipboard",
          });
        }, 0);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Fail to copy the link to clipboard",
        });
      });
  };

  // const copyToClipboard = (url: string) => {
  //   if (navigator.clipboard && navigator.clipboard.writeText) {
  //     navigator.clipboard
  //       .writeText(url)
  //       .then(() => {
  //         console.log("Copied to clipboard successfully!");
  //         messageApi.open({
  //           type: "success",
  //           content: "Link copied to clipboard",
  //         });
  //       })
  //       .catch((err) => {
  //         console.error("Failed to copy: ", err);
  //         messageApi.open({
  //           type: "error",
  //           content: "Fail to copy the link to clipboard",
  //         });
  //       });
  //   } else {
  //     // Fallback for older browsers
  //     const textArea = document.createElement("textarea");
  //     textArea.value = url;
  //     document.body.appendChild(textArea);
  //     textArea.select();
  //     try {
  //       document.execCommand("copy");
  //       messageApi.open({
  //         type: "success",
  //         content: "Link copied to clipboard",
  //       });
  //     } catch (err) {
  //       console.error("Fallback: Copying failed", err);
  //       messageApi.open({
  //         type: "error",
  //         content: "Fail to copy the link to clipboard",
  //       });
  //     }
  //     document.body.removeChild(textArea);
  //   }
  // };

  const updateProperty = (propertyId: number) => {
    setEncryptedCookie(constants.PROPERTY_ID, propertyId);
    navigate(`/main/finish/${propertyId}`);
  };

  const onChangePagination = (page: number) => {
    const zeroBasedPage = page - 1;
    setCurrentPage(zeroBasedPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* change the property Status */
  const changePropertyStatus = (e: any) => {
    e === undefined ? setPropertyStatusValue("") : setPropertyStatusValue(e);
  };

  const clearAllParams = () => {
    setPropertyStatusValue("");
    setPropertyTypeId("");
    setStartDate("");
    setEndDate("");
    setDistrictValue("");
    setCitiesValue("");
    setOpenLocationArea(false);
    setExpanded(null);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <MainLayout pageName="filterArea">
        <main>
          {/* listing Page */}
          {contextHolder}
          {/*  <ColorAnimationComponent layoutHeight="100%" /> */}
          <div className="d-flex justify-content-center align-item-center listingMainPage">
            <div className="listingMainPage_inner ">
              <div className="w-100 row">
                <div className="col-lg-6 col-md-12">
                  <h1 className="m-0 fourth_topic text-gray-secondary">
                    Your listings
                  </h1>
                </div>
                <div className="col-lg-6 col-md-12">
                  <Row className="filter-container">
                    <Col xs={16} sm={18} md={18} lg={17} xl={12}>
                      <span className="position-relative">
                        <Input
                          style={{ width: "100%" }}
                          size="large"
                          onChange={(e) =>
                            handlePropertyNameChange(e.target.value)
                          }
                          placeholder="Search property name"
                          prefix={
                            <SearchOutlined
                              style={{ color: "#BFBFBF", fontSize: "16px" }}
                            />
                          }
                        />
                      </span>
                    </Col>
                    <Col xs={8} sm={6} md={6} lg={7} xl={6}>
                      <span
                        className="filter-inner-area w-100"
                        onClick={toggleSidebar}
                      >
                        <p className="m-0 text-gray">Filters</p>
                        <img src={filter} alt="filter" />
                      </span>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="up-section"></div>
              {/* col-end */}
              <div className="container-fluid my-4">
                {hotelList.length > 0 ? (
                  <div className="row d-flex justify-content-start g-4">
                    {hotelList.map((hotel: Hotel) => (
                      <div
                        className="col-12 col-sm-6 col-md-6 col-lg-4 padding-remover"
                        // onClick={() => findEachPropertyDetail(hotel.id)}
                        key={hotel.id}
                      >
                        <Badge.Ribbon
                          text={hotel?.propertyType}
                          color="#082942"
                          style={{ margin: "0 1px 0 0 " }}
                        >
                          <div className="card h-100 shadow">
                            <div className="card-img-container position-relative">
                              <img
                                src={
                                  hotel.propertyImages === null
                                    ? defaultImage
                                    : hotel.propertyImages
                                }
                                className="card-img-top"
                                alt="House"
                              />
                              {hotel.status === PropertyStatusEnum.PUBLISHED ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="green" />{" "}
                                    {/* Green for PUBLISHED */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : hotel.status === PropertyStatusEnum.DRAFT ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="blue" /> {/* Red for DRAFT */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : hotel.status === PropertyStatusEnum.PENDING ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="purple" />{" "}
                                    {/* Purple for PENDING */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : hotel.status ===
                                PropertyStatusEnum.UNPUBLISHED ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="orange" />{" "}
                                    {/* Purple for UNPUBLISHED */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : hotel.status ===
                                PropertyStatusEnum.HOLD ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="yellow" />{" "}
                                    {/* Yellow for HOLD */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : hotel.status ===
                                PropertyStatusEnum.REJECTED ? (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="red" />{" "}
                                    {/* Red for REJECTED */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              ) : (
                                <div className="action-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                  <b className="text-danger">
                                    <Badge color="#FF0000" />{" "}
                                    {/* Default color */}
                                  </b>
                                  &nbsp; {hotel.status}
                                </div>
                              )}

                              <div className="plan-badge position-absolute text-gray-secondary p-2 rounded-pill">
                                {hotel.plan.replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-row justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                  <h5 className="card-title">
                                    {hotel.name
                                      ? hotel.name[0].toUpperCase() +
                                      hotel.name.slice(1).toLowerCase()
                                      : "Unnamed Hotel"}
                                  </h5>
                                  <h5 className="card-title font-weight-normal font-size-6">{hotel.code}</h5>
                                  {hotel.address && hotel.city && <p className="card-text text-muted">
                                    {truncateDescriptions(hotel.address + ", " + hotel.city || "", 4.9)}
                                  </p>}
                                </div>
                                <div className="round-small-area">
                                  <Popover
                                    placement="bottomRight"
                                    trigger="click"
                                    content={content(
                                      hotel?.id,
                                      hotel?.slug,
                                      hotel?.propertyType,
                                      hotel?.status,
                                      hotel?.isOnlyPropertyOwner
                                    )}
                                  >
                                    <Button className="round-small-area">
                                      <img src={vector} alt="vector" />
                                    </Button>
                                  </Popover>
                                  {/*   <span className="round-small-area"></span> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Badge.Ribbon>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    description={
                      <Typography.Text>No Listed Properties</Typography.Text>
                    }
                  />
                )}

                <br />
                {hotelList.length > 0 && (
                  <Pagination
                    className="paginateArea mt-3 mb-3"
                    align="end"
                    total={totalRecodes}
                    defaultPageSize={9}
                    current={currentPage + 1}
                    showSizeChanger={false}
                    onChange={onChangePagination}
                    showTotal={(total) => (
                      <span
                        style={{ position: "relative", top: "3px" }}
                        className="font-size-5 text-gray"
                      >{`Total ${total} items`}</span>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* side bar */}
          {/* Sidebar */}
          <div className={`sidebar-left ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-content">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <p style={{ fontSize: "20px", zIndex: "999" }} className="m-0">
                    Filters
                  </p>
                  <img
                    className="mx-2"
                    style={{ width: "21px", height: "21px" }}
                    src={filter}
                    alt="searchIcon"
                  />
                </span>
                <img
                  width={30}
                  className="close-btn"
                  src={closeIcon}
                  alt=" close"
                  onClick={toggleSidebar}
                />
              </div>
              <div className="w-100 pt-4">
                <p style={{ fontSize: "20px" }} className="m-0 font-size-4 mb-1">
                  Property Type
                </p>
                <div className="d-flex align-item-center flex-wrap mb-3">
                  {propertyList.map((list: any) => (
                    <span
                      key={list.id}
                      className={`d-flex justify-content-center align-items-center hotelTypeBorder m-2 ${propertyTypeId === list.id ? "selected" : ""
                        }`}
                      onClick={() => searchByPropertyType(list.id)}
                    >
                      {/* <span
                      className="img-icon-filter"
                      dangerouslySetInnerHTML={{ __html: list.icon }}
                    /> */}
                      <img className="img-icon-filter ms-1" src={list.icon} />
                      <p className="mb-0 mx-2 font-size-5 font-weight-normal ">
                        {list.name}
                      </p>
                    </span>
                  ))}
                </div>

                <div className="d-flex flex-column mb-4">
                  <p
                    style={{ fontSize: "20px" }}
                    className="m-0 font-size-4 mb-2"
                  >
                    Property Status
                  </p>
                  <Select
                    showSearch
                    className="mx-2 w-100"
                    allowClear
                    placeholder="Select the status"
                    value={
                      propertyStatusValue === "" ? undefined : propertyStatusValue
                    }
                    onChange={(e) => changePropertyStatus(e)}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={propertyStatusList}
                  />
                </div>

                {/* sub nav item */}
                {/* <div className="d-flex flex-column mb-2">
                <div
                  style={{ cursor: "pointer" }}
                  className="d-flex justify-content-between align-items-center"
                  onClick={handleLocationAreaState}
                >
                  <p
                    style={{ fontSize: "20px" }}
                    className="m-0 font-size-4 mb-2"
                  >
                    Location
                  </p>
                  <span>
                    {openLocationArea ? (
                      <DownOutlined color="#635F60" />
                    ) : (
                      <RightOutlined color="#635F60" />
                    )}
                  </span>
                </div>

                <div
                  className={`dropdown-menu-custom mx-2 ${
                    !openLocationArea ? "slide-up" : "slide-down"
                  } `}
                >
                  {locationList.map((parent: any) => (
                    <div key={parent.id} className="parent-item">
                      <div
                        className={`parent-name ${
                          expanded === parent.id ? "active" : ""
                        }`}
                        onClick={() => toggleExpand(parent.id)}
                      >
                        {parent.name}
                        <span className="arrow">
                          {expanded === parent.id ? (
                            <DownOutlined />
                          ) : (
                            <RightOutlined />
                          )}
                        </span>
                      </div>
                      {expanded === parent.id && parent.citys.length > 0 && (
                        <div className="sub-items">
                          {parent.citys.map((city: any) => (
                            <div
                              key={city.id}
                              className={`sub-item ${
                                cityExpanded === city.id ? "active" : ""
                              }`}
                              onClick={() => onActionTheCitiesValue(city.id)}
                            >
                              {city.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div> */}

                {/* search by date */}
                {/* <div className="d-flex flex-column">
                <p
                  style={{ fontSize: "20px" }}
                  className="m-0 font-size-4 mb-2"
                >
                  Filter By Dates
                </p>
                <RangePicker
                  size="middle"
                  className="mx-2 w-100"
                  onChange={(date) => handleDateRange(date)}
                />
              </div> */}

                {/* clear button */}
                <Button
                  className="clearButton  mt-4"
                  color="default"
                  variant="filled"
                  onClick={() => clearAllParams()}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* back drop */}
          {isSidebarOpen && (
            <div
              className="backdrop"
              onClick={toggleSidebar} // Close sidebar when clicking the backdrop
            ></div>
          )}
        </main>
      </MainLayout>
    </>
  );
};
export default ListeningPage;
