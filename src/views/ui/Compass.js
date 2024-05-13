import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Pagination } from "react-bootstrap";
import { data } from "./dummydata";
import { FaChartLine, FaPlus } from "react-icons/fa6";
import { CiCirclePlus, CiPause1 } from "react-icons/ci";
import { IoIosSearch, IoMdSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { FiMinusCircle } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CompassData from "../../services/CompassApi";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Loader from "../../layouts/loader/Loader";

const options = ["Pause", "inProgress", "Not Available"];
const options1 = ["one", "two", "three"];
const options2 = ["one", "two", "three"];
const options3 = [5, 10, 15, 20];
const options4 = ["5", "10", "15", "20"];
const TrackingTime = ["7days", "1 month", "3 months", "custom"];

const Compass = () => {
  const user_id = localStorage.getItem("user_id");

  const [compassRead, setCompassRead] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loader, setLoader] = useState(true);

  const [selectedOption, setSelectedOption] = useState(null);

  const [trackTime, setTrackTime] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [open, setOpen] = useState(false);

  const [casinoDrawer, setCasinoDrawer] = useState(false);
  const [gameDrawer, setGameDrawer] = useState(false);
  const [newCasino, setNewCasino] = useState(false);

  const showFirstDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedOption("");
  };

  // FUNCTION FOR OPEN CASINO DRAWER
  const showCasinoDrawer = () => {
    setCasinoDrawer(true);
    setSelectedOption("");
  };

  // FUNCTION FOR CLOSE GAME DRAWER
  const onCasinoDrawerClose = () => {
    setCasinoDrawer(false);
  };

  // FUNCTION FOR OPEN GAME DRAWER
  const showGameDrawer = () => {
    setGameDrawer(true);
    setSelectedOption("");
  };

  // FUNCTION FOR CLOSE GAME DRAWER
  const onGameDrawerClose = () => {
    setGameDrawer(false);
  };

  // FUNCTION FOR OPEN ADD NEW CASINO DRAWER
  const showNewCasinoDrawer = () => {
    setNewCasino(true);
  };

  // FUNCTION FOR CLOSE NEW CASINO DRAWER
  const onNewCasinoDrawerClose = () => {
    setNewCasino(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination function
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };
  const paginatedItems = paginate(compassRead, currentPage, itemsPerPage);
  const totalPages = Math.ceil(compassRead?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (option) => {
    setItemsPerPage(parseInt(option.value));
  };

  const filteredData = data.filter((data) => {
    return data?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const SelectTime = (option) => {
    setTrackTime(option);
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };

  const getCompassReadData = () => {
    CompassData.compass_read({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res?.success === true) {
          setCompassRead(res?.data);
          setLoader(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.id);
    if (event.target.checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const toggleSelectAll = () => {
    const allIds = compassRead.map((datas) => datas?.id);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDelete = () => {
    CompassData.compass_delete({ id: selectedItems })
      .then((res) => {
        if (res?.success === true) {
          getCompassReadData();
          toast.success(res?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCompassReadData();
  }, [user_id]);

  return (
    <>
      {/* CALIBRATE COMPASS FIRST PAGE */}
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="compass h-100">
            <>
              {paginatedItems?.length == 0 ? (
                <>
                  <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-md-5">
                      <div className="compass-text text-center">
                        <p>Currently there are no games or Casino configured</p>
                        <button
                          className="btn game_add_btn"
                          onClick={showFirstDrawer}
                        >
                          Calibrate Casino or Game <FaPlus className="ms-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="compass-data">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h3>Calibrate Compass</h3>
                        <span>
                          Track, add, delete all your games and operators
                        </span>
                      </div>
                      {/* <div className="col-md-4">
                <button
                  className="btn game_add_btn"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  Demo Model <FaPlus className="ms-2" />
                </button>
              </div> */}
                      <div className="col-md-6 text-end">
                        <button
                          className="btn game_add_btn"
                          onClick={showFirstDrawer}
                        >
                          Calibrate Casino or Game <FaPlus className="ms-2" />
                        </button>
                      </div>
                    </div>
                    <div className="compass-data-border mb-3">
                      <span></span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="calibrate-dropdown">
                        <Dropdown options={options} placeholder="Status" />
                        <Dropdown options={options1} placeholder="Operator" />
                        <Dropdown options={options2} placeholder="Game" />
                        <Dropdown options={options3} placeholder="All Time" />
                      </div>

                      <div className="compass-right-icon">
                        <div className="compass-search">
                          <FaChartLine />
                        </div>
                        <div className="compass-search" onClick={handleDelete}>
                          <i className="bi bi-trash3"></i>
                        </div>
                        <div className="compass-search">
                          <CiPause1 />
                        </div>
                        <div className="compass-search">
                          <IoMdSearch />
                        </div>
                      </div>
                    </div>
                    <div className="compass-data-table pt-3">
                      <table className="table table-bordered">
                        <thead className="table-heading-name">
                          <tr>
                            <th scope="col">
                              <input
                                type="checkbox"
                                className="casino-checkbox"
                                onChange={toggleSelectAll}
                                checked={selectAll}
                              />
                            </th>
                            <th scope="col">Created On</th>
                            <th scope="col">Operator Name</th>
                            <th scope="col">Game Name </th>
                            <th scope="col" className="text-center">
                              Tracking Timeline
                            </th>
                            <th scope="col" className="text-center">
                              Credits consumed
                            </th>
                            <th scope="col" className="text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="table-body-items">
                          {paginatedItems?.map((datas) => {
                            const startDate = new Date(datas?.start_date);
                            const formattedStartDate = startDate
                              ?.toLocaleDateString("en-GB")
                              .replace(/\//g, "-");
                            const endDate = new Date(datas?.end_date);
                            const formattedEndDate = endDate
                              ?.toLocaleDateString("en-GB")
                              .replace(/\//g, "-");
                            return (
                              <tr
                                key={datas.id}
                                className="table-body-items-table"
                              >
                                <td scope="row" style={{ width: "5%" }}>
                                  <input
                                    type="checkbox"
                                    className="casino-checkbox"
                                    id={datas.id}
                                    onChange={handleCheckboxChange}
                                  />
                                </td>
                                <td scope="row" style={{ width: "13%" }}>
                                  <span className="m-0">
                                    {datas.createdData}
                                  </span>
                                </td>
                                <td
                                  scope="row"
                                  style={{ width: "20%", fontSize: "14px" }}
                                >
                                  <p className="m-0">{datas.name}</p>
                                  <Link to="/">{datas.link}</Link>
                                </td>
                                <td style={{ width: "20%", fontSize: "14px" }}>
                                  <p className="m-0">{datas.gameName}</p>
                                  <Link to="/">{datas.link}</Link>
                                </td>
                                <td className="text-center">
                                  <span className="tracking-time">
                                    {formattedStartDate} to {formattedEndDate}
                                  </span>
                                </td>
                                <td
                                  style={{ width: "15%" }}
                                  className="text-center"
                                >
                                  {/* <span className="credits">{datas.Credits}</span> */}
                                  <span className="credits">-</span>
                                </td>
                                <td className="text-center">
                                  <span className="action-btn"></span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span>
                            Showing {(currentPage - 1) * itemsPerPage + 1} -
                            {Math.min(
                              currentPage * itemsPerPage,
                              compassRead?.length
                            )}
                            &nbsp;out of&nbsp;
                            {compassRead?.length}
                          </span>
                        </div>
                        <div>
                          {totalPages > 1 && (
                            <div className="d-flex justify-content-center orderlist_pagination">
                              <Pagination className="custom-pagination">
                                <Pagination.Prev
                                  onClick={() =>
                                    setCurrentPage((prev) =>
                                      Math.max(prev - 1, 1)
                                    )
                                  }
                                  disabled={currentPage === 1}
                                >
                                  <MdKeyboardArrowLeft className="me-2" /> Prev
                                </Pagination.Prev>
                                {[...Array(totalPages).keys()].map((page) => {
                                  if (
                                    page === 0 ||
                                    page === totalPages - 1 ||
                                    (page >= currentPage - 1 &&
                                      page <= currentPage + 1)
                                  ) {
                                    return (
                                      <Pagination.Item
                                        key={page}
                                        active={page + 1 === currentPage}
                                        onClick={() =>
                                          handlePageChange(page + 1)
                                        }
                                        className="custom-pagination-item"
                                      >
                                        {page + 1}
                                      </Pagination.Item>
                                    );
                                  } else if (
                                    (page === 1 && currentPage > 4) ||
                                    (page === totalPages - 2 &&
                                      currentPage < totalPages - 3)
                                  ) {
                                    return (
                                      <Pagination.Item
                                        key={page}
                                        disabled
                                        className="custom-pagination-item"
                                      >
                                        ...
                                      </Pagination.Item>
                                    );
                                  }
                                  return null;
                                })}
                                <Pagination.Next
                                  onClick={() =>
                                    setCurrentPage((prev) =>
                                      Math.min(prev + 1, totalPages)
                                    )
                                  }
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                  <MdKeyboardArrowRight className="ms-2" />
                                </Pagination.Next>
                              </Pagination>
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center pagination_per_select">
                          <span className="me-1">Items per Page: </span>
                          <Dropdown
                            options={options4.map((option) => ({
                              value: option,
                              label: option,
                            }))}
                            onChange={handleItemsPerPageChange}
                            value={itemsPerPage?.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </div>
        </>
      )}

      {/* CALIBRATE COMPASS DEMO SCREEN OFFCANVAS HERE */}
      <div
        className="offcanvas offcanvas-end w-75 bg-white"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header Tracking-game-model">
          <h5 id="offcanvasRightLabel">Configure</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body Tracking-game-model-content">
          <div className="col-md-12">
            <h6>Tracking list will contain:</h6>
            <span>
              All the combination below are formed according to your selection
              of games and casino. You can remove combination that you don’t
              want to track.
            </span>
          </div>
          <div className="compass-data-table track_game_table pt-3">
            <table className="table table-bordered m-0">
              <thead className="table-heading-name">
                <tr>
                  <th scope="col" style={{ width: "40%" }}>
                    Operator Name
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Game Name{" "}
                  </th>
                  <th scope="col" style={{ width: "40%" }} className="text-end">
                    ACTION
                  </th>
                </tr>
              </thead>
            </table>
            <div className="table-scroll-container">
              <table className="table table-bordered m-0">
                <tbody className="table-body-items">
                  {data?.map((datas) => {
                    return (
                      <tr key={datas.name} className="table-body-items-table">
                        <td
                          scope="row"
                          style={{ width: "40%", fontSize: "14px" }}
                        >
                          <p className="m-0">{datas.name}</p>
                          <Link to="/">{datas.link}</Link>
                        </td>
                        <td style={{ width: "20%", fontSize: "14px" }}>
                          <p className="m-0">{datas.gameName}</p>
                          <Link to="/">{datas.link}</Link>
                        </td>
                        <td className="text-end">
                          <span className="badge rounded-pill me-5">
                            Combination already exists
                          </span>
                          <FiMinusCircle
                            style={{ fontSize: "25px", color: "#607290" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tracking-game-time">
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="tracking_gaming_date">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group tracking_time_dropdown credit-field">
                          <label className="">Select Tracking Time</label>
                          <Dropdown
                            options={TrackingTime}
                            placeholder="Select tracking Time"
                            onChange={(option) => SelectTime(option)}
                            value={trackTime}
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tracking_csm_date">
                    {trackTime?.label === "custom" && (
                      <>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group credit-field">
                              <label>Tracking starts on</label>
                              <div className="tracking-game-credit">
                                <DatePicker
                                  selected={startDate}
                                  showIcon
                                  onChange={(date) =>
                                    handleStartDateChange(date)
                                  }
                                  className="w-100"
                                  dateFormat="dd/MM/yyyy"
                                  dropdownMode="select"
                                  toggleCalendarOnIconClick
                                  placeholderText="Select date"
                                  closeOnScroll={false}
                                  selectsStart
                                  startDate={startDate}
                                  icon={
                                    <FaCalendarAlt
                                      style={{ color: "#ADB5BD" }}
                                    />
                                  }
                                  // endDate={endDate}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group credit-field">
                              <label>Tracking ends on</label>
                              <div className="tracking-game-credit">
                                <DatePicker
                                  selected={endDate}
                                  dateFormat="dd/MM/yyyy"
                                  toggleCalendarOnIconClick
                                  dropdownMode="select"
                                  placeholderText="Select date"
                                  showIcon
                                  onChange={(date) => handleEndDateChange(date)}
                                  className="w-100"
                                  closeOnScroll={false}
                                  selectsEnd
                                  startDate={startDate}
                                  endDate={endDate}
                                  minDate={startDate}
                                  disabled={!startDate}
                                  icon={
                                    <FaCalendarAlt
                                      style={{ color: "#ADB5BD" }}
                                    />
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group credit-field">
                        <label>Expected credits usage</label>
                        <input
                          type="text"
                          className="form-control"
                          value={356}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group credit-field">
                        <label>Credit Balance</label>
                        <input
                          type="text"
                          className="form-control"
                          value={356}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="offcanvas-footer">
          <div
            id="offcanvasRightCalibrate"
            className="sidebar-model-heading text-end"
          >
            <button
              className="compass-sidebar-back"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              Back
            </button>
            <button
              className="compass-sidebar-next"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* CALIBRATE COMPASS FIRST OFF CANVAS FOR CHOOSE CASINO OR GAME IN ANTD */}
      <Drawer
        title="Calibrate"
        width={casinoDrawer || gameDrawer || newCasino ? "100%" : "70%"}
        closable={true}
        onClose={onClose}
        maskClosable={false}
        open={open}
        closeIcon={<CloseOutlined className="custom-close-icon" />}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            {selectedOption == "Casino 1" ? (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                disabled={!selectedOption}
                onClick={showCasinoDrawer}
              >
                Next
              </button>
            ) : (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                disabled={!selectedOption}
                onClick={showGameDrawer}
              >
                Next
              </button>
            )}
          </div>
        }
        className={
          casinoDrawer || gameDrawer || newCasino ? "show_children_drawer" : ""
        }
      >
        <div
          className={`calibrate-title ${
            selectedOption === "Casino 1" ? "selected" : ""
          }`}
          onClick={() => handleSelectOption("Casino 1")}
        >
          <span>Select Casino</span>
          <div className="casino-select-listing mt-4">
            {/* {data?.map((data, index) => (
              <div className="calibrate-casino-data-display" key={data.id}>
                <FiMinusCircle style={{ fontSize: "22px" }} />
                <div className="casino-data-bar">
                  <label htmlFor={data.id}>{data.name}</label>
                  <Link>{data.link}</Link>
                </div>
              </div>
            ))} */}
          </div>
          <div className="calibrate-content mt-4">
            <div className="calibrate-icon">
              <CiCirclePlus />
            </div>
            <p>Start calibrating by adding Casino</p>
          </div>
        </div>
        <div
          className={`calibrate-title mt-4 ${
            selectedOption === "Casino 2" ? "selected" : ""
          }`}
          onClick={() => handleSelectOption("Casino 2")}
        >
          <span>Select Game</span>
          <div className="casino-select-listing mt-4">
            {/* {data?.map((data, index) => (
              <div className="calibrate-casino-data-display" key={data.id}>
                <FiMinusCircle style={{ fontSize: "22px" }} />
                <div className="casino-data-bar">
                  <label htmlFor={data.id}>{data.name}</label>
                  <Link>{data.link}</Link>
                </div>
              </div>
            ))} */}
          </div>
          <div className="calibrate-content mt-4">
            <div className="calibrate-icon">
              <CiCirclePlus />
            </div>
            <div>
              <p>Start calibrating by adding Game</p>
            </div>
          </div>
        </div>

        {/* FOR SELECT CASINO DRAWER */}
        <Drawer
          title="Choose Casino"
          width="50%"
          className="choose_casino_drawer"
          closable={true}
          maskClosable={false}
          onClose={onCasinoDrawerClose}
          open={casinoDrawer}
          closeIcon={<CloseOutlined className="custom-close-icon" />}
          footer={
            <div style={{ textAlign: "right" }}>
              <button
                onClick={onCasinoDrawerClose}
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Back
              </button>
              <button
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Save
              </button>
            </div>
          }
        >
          <div className="search-bar position-relative">
            <div className="serching">
              <input
                type="text"
                placeholder="search game here"
                className="search-casino-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="casino-search-icon">
                <IoIosSearch style={{ fontSize: "20px" }} />
              </div>
            </div>
            {filteredData.length === 0 ? (
              <div className="casedata-no-data-search">
                <div className="no-search-result">
                  <span>No Search result found</span>
                </div>
                <div className="request-demo" onClick={showNewCasinoDrawer}>
                  <AiOutlinePlus className="me-2" />
                  <span>Request New Casino</span>
                </div>
              </div>
            ) : (
              <div>
                {filteredData.map((data, index) => (
                  <div className="casino-data-display" key={data.id}>
                    <input
                      type="checkbox"
                      className="casino-checkbox"
                      id={data.id}
                    />
                    <div className="casino-data-bar">
                      <label htmlFor={data.id}>{data.name}</label>
                      <Link>{data.link}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="line">
            <span></span>
          </div>
        </Drawer>

        {/* FOR SELECT GAME DRAWER */}
        <Drawer
          title="Choose Game"
          width="50%"
          className="choose_casino_drawer"
          closable={true}
          maskClosable={false}
          onClose={onGameDrawerClose}
          open={gameDrawer}
          closeIcon={<CloseOutlined className="custom-close-icon" />}
          footer={
            <div style={{ textAlign: "right" }}>
              <button
                onClick={onGameDrawerClose}
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Back
              </button>
              <button
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Save
              </button>
            </div>
          }
        >
          <div className="search-bar position-relative">
            <div className="serching">
              <input
                type="text"
                placeholder="search game here"
                className="search-casino-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="casino-search-icon">
                <IoIosSearch style={{ fontSize: "20px" }} />
              </div>
            </div>
            {filteredData.length === 0 ? (
              <div className="casedata-no-data-search">
                <div className="no-search-result">
                  <span>No Search result found</span>
                </div>
                <div className="request-demo" onClick={showNewCasinoDrawer}>
                  <AiOutlinePlus className="me-2" />
                  <span>Request New Casino</span>
                </div>
              </div>
            ) : (
              <div>
                {filteredData.map((data, index) => (
                  <div className="casino-data-display" key={data.id}>
                    <input
                      type="checkbox"
                      className="casino-checkbox"
                      id={data.id}
                    />
                    <div className="casino-data-bar">
                      <label htmlFor={data.id}>{data.name}</label>
                      <Link>{data.link}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="line">
            <span></span>
          </div>
        </Drawer>

        {/* FOR ADD NEW CASINO DRAWER HERE */}
        <Drawer
          title="Request New Casino"
          width="50%"
          className="choose_casino_drawer"
          closable={true}
          maskClosable={false}
          onClose={onNewCasinoDrawerClose}
          open={newCasino}
          closeIcon={<CloseOutlined className="custom-close-icon" />}
          footer={
            <div style={{ textAlign: "right" }}>
              <button
                onClick={onNewCasinoDrawerClose}
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Back
              </button>
              <button
                style={{ marginRight: 8 }}
                className="compass-sidebar-back"
              >
                Save
              </button>
            </div>
          }
        >
          <div className="bg-white p-4">
            <div className="row">
              <div className="col-md-8">
                <div className="casino-input-field new_casino_add">
                  <div className="form-group">
                    <label htmlFor="">Enter Casino Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name here"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Enter URL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="URL here"
                    />
                  </div>
                </div>
              </div>

              <div className="url-preview mt-5">
                <h5>
                  <b>URL Preview</b>
                </h5>
                <div>
                  <img
                    src="https://play-lh.googleusercontent.com/FNVQyeiRF2_1PtLj6vXRjvr4-IGwdaShsTvjSFS_v8TmdHdllJ5lUAHlweR5B44dNQ=w526-h296-rw"
                    alt=""
                    className="w-100 bordered mt-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </Drawer>
    </>
  );
};

export default Compass;
