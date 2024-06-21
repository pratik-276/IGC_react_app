import React, { useState } from "react";
import { data } from "../ui/dummydata";
import { FiMinusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const TrackingTime = ["7days", "1 month", "3 months", "custom"];

const Configure = () => {
    const [trackTime, setTrackTime] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
    return (
        <>
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
        </>
    );
};

export default Configure;
