import React, { useEffect, useState } from "react";
import AveragePositionChart from "../charts/AveragePositionChart";
import GameSectionChangesChart from "../charts/GameSectionChangesChart";
import GamePositionChangesChart from "../charts/GamePositionChangesChart";
import GameData from "../services/GameTracker";

const TrackerDetails = ({ trackingDetails, gameName, casinoName }) => {
  return (
    <>
      <div className="mt-1">
        <div className="tracker-details">
          <div className="tracker-details-head">
            <h5 className="m-0">Tracker Details</h5>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', fontSize: '14px', paddingTop: '20px' }}>
              <div>
                <div>Game</div>
                <div style={{ fontWeight: 'bold' }} >{gameName}</div>
              </div>
              <div style={{ border: '1px solid var(--Base-Purple-100, #CCCEE5)' }}>
                
              </div>
              <div>
                <div>Casino</div>
                <div style={{ fontWeight: 'bold' }} >{casinoName}</div>
              </div>
            </div>
          </div>
          <div className="tracker_details_boxes">
            <div className="position-view-box">
              <div className="d-flex justify-content-between align-items-center position-view-box-head">
                <h5>Latest Position</h5>
                <div className="d-flex align-items-center">
                  <h4>
                    {trackingDetails?.latest_position?.overall_game_position}
                  </h4>{" "}
                  <span>
                    ({trackingDetails?.latest_position?.created_date})
                  </span>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.latest_position?.section_name}</h4>
                    <span>Section Name</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>
                      {trackingDetails?.latest_position?.section_position}
                    </h4>
                    <span>Section Position</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.latest_position?.game_position}</h4>
                    <span>Game Position</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-view-box best_position_box">
              <div className="d-flex justify-content-between align-items-center position-view-box-head">
                <h5>Best Position</h5>
                <div className="d-flex align-items-center">
                  <h4>
                    {trackingDetails?.best_position?.overall_game_position}
                  </h4>{" "}
                  <span>({trackingDetails?.best_position?.created_date})</span>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.best_position?.section_name}</h4>
                    <span>Section Name</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.best_position?.section_position}</h4>
                    <span>Section Position</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.best_position?.game_position}</h4>
                    <span>Game Position</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-view-box worst_position_box">
              <div className="d-flex justify-content-between align-items-center position-view-box-head">
                <h5>Worst Position</h5>
                <div className="d-flex align-items-center">
                  <h4>
                    {trackingDetails?.worst_position?.overall_game_position}
                  </h4>{" "}
                  <span>({trackingDetails?.worst_position?.created_date})</span>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.worst_position?.section_name}</h4>
                    <span>Section Name</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.worst_position?.section_position}</h4>
                    <span>Section Position</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-view-box-bottom">
                    <h4>{trackingDetails?.worst_position?.game_position}</h4>
                    <span>Game Position</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tracker-details" style={{ marginTop: "16px" }}>
          <AveragePositionChart trackingDetails={trackingDetails} />
        </div>
        {/* <div className="tracker-details" style={{ marginTop: "16px" }}>
          <GameSectionChangesChart trackingDetails={trackingDetails} />
        </div> */}
        <div className="tracker-details" style={{ marginTop: "16px" }}>
          <GamePositionChangesChart trackingDetails={trackingDetails} />
        </div>
      </div>
    </>
  );
};

export default TrackerDetails;
