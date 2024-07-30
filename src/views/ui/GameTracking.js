import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const TrackingTime = ["7days", "1 month", "3 months", "custom"];

const GameTracking = () => {
  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4>Overview Dashboard</h4>
              <span>
                View, Filter and analyse data as per your requirements with
                adaptive dashboard
              </span>
            </div>

            <div className="col-md-6">
              <div className="row justify-content-end">
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingTime}
                    placeholder="Status"
                    className="w-100"
                  />
                </div>
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingTime}
                    placeholder="All time "
                    className="w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tracker-details">
          <div className="tracker-details-head">
            <h5>Tracker Details</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameTracking;
