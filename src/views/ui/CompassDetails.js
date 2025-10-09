import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompassData from "../../services/CompassApi";

import { Button } from "primereact/button";

import { MdArrowBackIos } from "react-icons/md";
import { FaGem, FaLock } from "react-icons/fa6";

import InfoCard from "../../charts/InfoCard";
import CompassGraph from "../../charts/CompassGraph";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import "./AccessBlur.css";

// const graphDetailsTemp = [
//   { created_date: "2025-08-20", game_position: 2 },
//   { created_date: "2025-08-21", game_position: 2 },
//   { created_date: "2025-08-22", game_position: 8 },
//   { created_date: "2025-08-23", game_position: 8 },
//   { created_date: "2025-08-24", game_position: 8 },
//   { created_date: "2025-08-25", game_position: 8 },
// ];

const CompassDetails = () => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [graphDataLoading, setGraphDataLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);

  const [graphDetails, setGraphDetails] = useState([]);
  const [compassGameSection, setCompassGameSection] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const location = useLocation();
  const {
    compass_id,
    operator_site_id,
    game_name,
    casino_name,
    country_name,
    start_date,
    end_date,
    min_position,
    max_position,
    section_name,
    days_inside,
    days_outside,
    scan_status,
  } = location.state || {};

  console.log("scan_status", scan_status);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    setStartDate(new Date(start_date));
    setEndDate(new Date(end_date));

    getCompassGraphData();
    getCompassGameSection();
  }, []);

  const getCompassGraphData = () => {
    setGraphDataLoading(true);
    const payload = {
      id: parseInt(compass_id),
      end_date: end_date,
      start_date: start_date,
    };
    CompassData.compass_details_graph(payload)
      .then((res) => {
        if (res?.success) {
          setGraphDetails(res?.data);
        }
      })
      .catch(console.error)
      .finally(() => setGraphDataLoading(false));
  };

  const getCompassGameSection = () => {
    setSectionLoading(true);
    CompassData.compass_game_sections({ id: parseInt(compass_id) })
      .then((res) => {
        if (res?.success) {
          setCompassGameSection(res?.message);
        }
      })
      .catch(console.error)
      .finally(() => setSectionLoading(false));
  };

  return (
    <>
      <div className={`content ${isPlanExpired ? "show" : ""}`}>
        <FaLock
          style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#392f6c" }}
        />
        <p className="fw-bold">Your plan has expired</p>
        <Button className="btn-upgrade" onClick={showContactSalesConfirmation}>
          <FaGem /> <span>Upgrade Plan</span>
        </Button>
      </div>

      <div className={`w-100 h-100 ${isPlanExpired ? "overlay active" : ""}`}>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <MdArrowBackIos
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/calibrate-compass")}
              />
              <div>
                <h4
                  className="m-md-0 font-semibold"
                  style={{ color: "#392f6c" }}
                >
                  Compass Details
                </h4>
                <span className="text-black" style={{ fontSize: "1rem" }}>
                  View details related to configured compass
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              {/* <div>
                <Calendar
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Start Date"
                  disabled
                />
              </div>

              <div>
                <Calendar
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select End Date"
                  disabled
                />
              </div> */}
              <button
                className="btn-filter"
                label="View Position Details"
                onClick={() => {
                  console.log(operator_site_id, game_name, casino_name, country_name, state);
                  navigate("/position-details", {
                    state: {
                      operator_site_id: operator_site_id,
                      game_name: game_name,
                      casino_name: casino_name,
                      country_name: country_name,
                      state_name: "",
                    },
                  });
                }}
              >
                View Position Details
              </button>
            </div>
          </div>
        </div>

        <div className="border border-secondary p-3 rounded-3 mt-3">
          <h5 className="font-semibold pl-2">Compass Details</h5>
          <div className="flex gap-2 mt-2">
            <InfoCard
              header="Selected Game"
              tooltip="Shows selected game name"
              tooltipTarget="game_name"
              value={game_name}
            />

            <InfoCard
              header="Selected Casino"
              tooltip="Shows selected casino name"
              tooltipTarget="casino_name"
              value={casino_name}
            />

            <InfoCard
              header="Section Name"
              tooltip="Shows section name"
              tooltipTarget="section_name"
              value={section_name}
            />

            <InfoCard
              header="Country"
              tooltip="Shows country name"
              tooltipTarget="country_name"
              value={country_name}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <InfoCard
              header="Start date"
              tooltip="Shows start date"
              tooltipTarget="start_date"
              value={start_date}
            />

            <InfoCard
              header="End Date"
              tooltip="Shows end date"
              tooltipTarget="end_date"
              value={end_date}
            />

            <InfoCard
              header="Min Position"
              tooltip="Shows min position"
              tooltipTarget="min_position"
              value={min_position}
            />

            <InfoCard
              header="Max Position"
              tooltip="Shows max position"
              tooltipTarget="max_position"
              value={max_position}
            />
          </div>

          <h5 className="font-semibold pl-2 mt-3">Compass Status</h5>
          <div className="flex gap-2 mt-2">
            <InfoCard
              header="Days Inside"
              tooltip="Shows days inside"
              tooltipTarget="days_inside"
              value={days_inside}
            />

            <InfoCard
              header="Days Outside"
              tooltip="Shows days outside"
              tooltipTarget="days_outside"
              value={days_outside}
            />

            <InfoCard
              header="Scan Status"
              tooltip="Shows scan status"
              tooltipTarget="scan_status"
              value={scan_status}
            />
          </div>
        </div>

        <div className="border border-secondary p-3 rounded-3 mt-3">
          <h5 className="font-semibold pl-2">Daywise Status</h5>
          <CompassGraph
            graphDetails={graphDetails}
            min_position={min_position}
            max_position={max_position}
          />
        </div>

        {compassGameSection !== "No records as of now" && <div
          className="d-flex justify-content-center"
          style={{ marginTop: "5%" }}
        >
          <h4>Note : {compassGameSection}</h4>
        </div>
        }
      </div>
    </>
  );
};

export default CompassDetails;
