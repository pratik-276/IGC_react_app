import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Pagination } from "react-bootstrap";
import { data, gameData } from "./dummydata";
import { FaChartLine, FaPlus } from "react-icons/fa6";
import { CiCirclePlus, CiPause1 } from "react-icons/ci";
import { IoIosSearch, IoMdSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { FiMinusCircle } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const options = ["Pause", "inProgress", "Not Available"];
const options1 = ["one", "two", "three"];
const options2 = ["one", "two", "three"];
const options3 = [5, 10, 15, 20];
const options4 = ["5", "10", "15", "20"];
const TrackingTime = ["7days", "1 month", "3 months", "custom"];

const Compass = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [trackTime, setTrackTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination function
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };
  const paginatedItems = paginate(data, currentPage, itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

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
    // console.log(option?.label, "option");
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log("start date", date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    console.log("end date", date);
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };

  return (
    <>  
      {/* CALIBRATE COMPASS FIRST PAGE */}
      <div className="compass h-100">
        {paginatedItems?.length == 0 ? (
          <>
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-md-5">
                <div className="compass-text text-center">
                  <p>Currently there are no games or Casino configured</p>
                  <button
                    className="btn game_add_btn"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCalibrate"
                    aria-controls="offcanvasCalibrate"
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
                  <span>Track, add, delete all your games and operators</span>
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
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCalibrate"
                    aria-controls="offcanvasCalibrate"
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
                  <div className="compass-search">
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
                        <input type="checkbox" className="casino-checkbox" />
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
                      return (
                        <tr key={datas.name} className="table-body-items-table">
                          <td scope="row" style={{ width: "5%" }}>
                            <input
                              type="checkbox"
                              className="casino-checkbox"
                              id={data.id}
                            />
                          </td>
                          <td scope="row" style={{ width: "13%" }}>
                            <span className="m-0">{datas.createdData}</span>
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
                              {datas.Timeline}
                            </span>
                          </td>
                          <td style={{ width: "15%" }} className="text-center">
                            <span className="credits">{datas.Credits}</span>
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
                      {Math.min(currentPage * itemsPerPage, data.length)} out
                      of&nbsp;
                      {data.length}
                    </span>
                  </div>
                  <div>
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center orderlist_pagination">
                        <Pagination className="custom-pagination">
                          <Pagination.Prev
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
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
                                  onClick={() => handlePageChange(page + 1)}
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
                      value={itemsPerPage.toString()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CALIBRATE COMPASS DEMO SCREEN OFFCANVAS HERE */}
      {/* <div
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
      </div> */}

      {/* CALIBRATE COMPASS FIRST OFF CANVAS FOR CHOOSE CASINO OR GAME */}
      <div
        className="offcanvas offcanvas-end compass-sidebar"
        tabIndex="-1"
        id="offcanvasCalibrate"
        aria-labelledby="offcanvasRightCalibrate"
        data-bs-backdrop="static"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Calibrate
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setSelectedOption("")}
          ></button>
        </div>
        <div className="offcanvas-body select-casino-game-body">
          <div
            className={`calibrate-title ${
              selectedOption === "Casino 1" ? "selected" : ""
            }`}
            onClick={() => handleSelectOption("Casino 1")}
          >
            <span>Select Casino</span>
            <div className="casino-select-listing mt-4">
              {data?.map((data, index) => (
                <div className="calibrate-casino-data-display" key={data.id}>
                  <FiMinusCircle style={{ fontSize: "22px" }} />
                  <div className="casino-data-bar">
                    <label htmlFor={data.id}>{data.name}</label>
                    <Link>{data.link}</Link>
                  </div>
                </div>
              ))}
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
              {data?.map((data, index) => (
                <div className="calibrate-casino-data-display" key={data.id}>
                  <FiMinusCircle style={{ fontSize: "22px" }} />
                  <div className="casino-data-bar">
                    <label htmlFor={data.id}>{data.name}</label>
                    <Link>{data.link}</Link>
                  </div>
                </div>
              ))}
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
              onClick={() => setSelectedOption("")}
            >
              Back
            </button>
            {selectedOption == "Casino 1" ? (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                data-bs-toggle="offcanvas"
                data-bs-target="#casinoSelected"
                aria-controls="casinoSelected"
                disabled={!selectedOption}
                onClick={() => setSelectedOption("")}
              >
                Next
              </button>
            ) : (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
                disabled={!selectedOption}
                onClick={() => setSelectedOption("")}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOR CHOOSE CASINO  */}
      <div
        className="offcanvas offcanvas-end casino-sidebar"
        tabIndex="-1"
        id="casinoSelected"
        aria-labelledby="offcanvasRightLabelCasino"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Choose Casino
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0 bg-white">
          <div className="">
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
                  <div
                    className="request-demo"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRequestCasino"
                    aria-controls="offcanvasRequestCasino"
                  >
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
          </div>
          <div className="line">
            <span></span>
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
            <button className="compass-sidebar-next" disabled>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* FOR CHOOSE GAME  */}
      <div
        className="offcanvas offcanvas-end casino-sidebar"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Select Game
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body p-0 bg-white">
          <div className="">
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
              {gameData.length === 0 ? (
                <div className="casedata-no-data-search">
                  <div className="no-search-result">
                    <span>No Search result found</span>
                  </div>
                  <div
                    className="request-demo"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRequestCasino"
                    aria-controls="offcanvasRequestCasino"
                  >
                    <AiOutlinePlus className="me-2" />
                    <span>Request New Casino</span>
                  </div>
                </div>
              ) : (
                <div>
                  {gameData.map((data, index) => (
                    <div className="casino-data-display" key={data.id}>
                      <input
                        type="checkbox"
                        className="casino-checkbox"
                        id={data.id}
                      />
                      <div className="casino-data-bar game-data-bar">
                        <label htmlFor={data.id}>{data.game}</label>
                        <span>{data?.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="line">
            <span></span>
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
            <button className="compass-sidebar-next" disabled>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* FOR REQUEST A NEW CASINO OFFCANVAS*/}
      <div
        className="offcanvas offcanvas-end casino-sidebar"
        tabIndex="-1"
        id="offcanvasRequestCasino"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Choose Casino
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body bg-white p-4">
          <div className="row">
            <div className="col-md-8">
              <div className="casino-input-field">
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
              {/* <span>Enter Url for a preview</span> */}
              <div>
                <img
                  src="https://s3-alpha-sig.figma.com/img/66b8/d95a/fc1a137a2cf4ad184c535dfc86e74b37?Expires=1714348800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=J-9rv-H17~h~wD5JUkbUIRpcg2AaBERK38fDTtxLbhaLFC~sdXACDJ-ZuXol-Jv7Y68KRFmTiHhmum2Dllfi9XCMXmuXZWmL-gS-RyxqIiAEs6KLnvqMcJq4RbxHJ4O5TASp8Wb8q-9sTiYig387LJtzuHLrvt16~Zdk2MFeh6oixg-WAP1QaFAM~B7UIQRIspaClZ54yegdWgRGjPLYZt9g~WB6EQbHdIxCaib-kAqRkACGXWfJXfhdIZcdUWNeLOA9Gt0oXa6HZwsQOXOH4fp-E8YMSyylkKNumODMahgby~Pbe-UEqhucn77u7WzaqGWPiw2TRm4cAxik36aCZA__"
                  alt=""
                  className="w-100 bordered mt-3"
                />
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
            <button className="new-request-casino-btn" disabled>
              Request Casino
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compass;
