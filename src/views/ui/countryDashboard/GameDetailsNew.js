import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import { Spin } from "antd";

import { MdArrowBackIos } from "react-icons/md";
import { FaGem, FaLock } from "react-icons/fa6";

import call from "../../../services/Call";
import AveragePositionChart from "../../../charts/AveragePositionChart";
import DailySectionalAnalyticshart from "../../../charts/DailySectionalAnalyticshart";
import InfoCard from "../../../charts/InfoCard";

import { useContext } from "react";
import { ProfileSystem } from "../../../context/ProfileContext";
import { useContactSales } from "../../../context/confirmationContext";
import { BreadCrumb } from 'primereact/breadcrumb';

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../DashboardMod.css";
import "../AccessBlur.css";

const GameDetailsNew = () => {
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");
    const [loader, setLoader] = useState(true);
    const [trackingDetails, setTrackingDetails] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [minDate, setMinDate] = useState(null);

    const location = useLocation();
    console.log("location.state", location.state);
    const {
        redirect_from,
        operator_id,
        operator_name,
        game_id,
        game_name,
        country_name,
        state_name
    } = location.state || {};

    const { state } = useContext(ProfileSystem);
    const isPlanExpired = state?.plan === "trial_expired";
    //const isPlanExpired = state?.plan === "trial";
    const { showContactSalesConfirmation } = useContactSales();

    var items = [];
    if (redirect_from === "operator") {
        items = [{ label: 'Operators' }, { label: operator_name }, { label: 'Countries' }, { label: country_name }, { label: 'Games' }, { label: game_name }];
    }
    else if (redirect_from === "country") {
        items = [{ label: 'Countries' }, { label: country_name }, { label: 'Operators' }, { label: operator_name }, { label: 'Games' }, { label: game_name }];
    }
    else if (redirect_from === "game") {
        items = [{ label: 'Games' }, { label: game_name }, { label: 'Countries' }, { label: country_name }, { label: 'Operators' }, { label: operator_name }];
    }
    const home = { icon: 'pi pi-home' }


    useEffect(() => {
        const currentDate = new Date();
        const previousMonth = new Date(currentDate);

        previousMonth.setMonth(currentDate.getMonth() - 1);
        previousMonth.setDate(1);

        setMinDate(previousMonth);
        setStartDate(previousMonth);
        setEndDate(currentDate);
    }, []);

    useEffect(() => {
        if (operator_id && game_id) {
            setLoader(true);
            getDashboardData({
                operator_id: operator_id,
                game_id: game_id,
                country_name: country_name,
                state_name: state_name
            });
        }
    }, [user_id, operator_id, game_id]);

    const getDashboardData = ({ operator_id, game_id, country_name, state_name }) => {
        const user_company_2 = localStorage.getItem("user_company");
        call({
            path: "tracker_dashboard_details_mod",
            method: "POST",
            data: {
                operator_id: operator_id,
                game_id: game_id,
                country_name: country_name,
                state_name: state_name
            },
        })
            .then((res) => {
                setTrackingDetails(res.data);
            })
            .catch((err) => {
                console.log("Error fetching data: ", err);
                setTrackingDetails(null);
            })
            .finally(() => {
                setLoader(false);
            });
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
                            {/* <MdArrowBackIos
                                style={{
                                    fontSize: "30px",
                                    cursor: "pointer",
                                }}
                                // onClick={() => navigate("/dashboard")}
                                onClick={() => navigate(-1)}
                            /> */}
                            <div>
                                <h4
                                    className="m-md-0 font-semibold"
                                    style={{ color: "#392f6c" }}
                                >
                                    Positions Dashboard
                                </h4>
                                <span className="text-black" style={{ fontSize: "1rem" }}>
                                    View page wise position details of the game
                                </span>
                            </div>
                        </div>
                    </div>

                    <BreadCrumb model={items} home={home} style={{
                        textDecoration: "none!important",
                        marginTop: "3rem",
                        marginBottom: "1rem"
                    }} />
                </div>

                {loader ? (
                    <div
                        className="row align-items-center justify-content-center"
                        style={{ height: "500px" }}
                    >
                        <div className="col-md-5">
                            <div className="text-center">
                                <Spin size="large" />
                            </div>
                        </div>
                    </div>
                ) : trackingDetails ? (
                    <>
                        {/* <div className="mt-3">
                            <div className="flex gap-2 mt-2">
                                <InfoCard
                                    header="Selected Game"
                                    tooltip="Shows selected game name"
                                    tooltipTarget="game_name"
                                    value={game_name}
                                    widthMod={true}
                                />

                                <InfoCard
                                    header="Selected Casino"
                                    tooltip="Shows selected casino name"
                                    tooltipTarget="casino_name"
                                    value={operator_name}
                                    widthMod={true}
                                />

                                <InfoCard
                                    header="Country"
                                    tooltip="Shows country name"
                                    tooltipTarget="country_name"
                                    value={country_name}
                                    widthMod={true}
                                />

                                <InfoCard
                                    header="State"
                                    tooltip="Shows state name"
                                    tooltipTarget="state_name"
                                    value={state_name}
                                    widthMod={true}
                                />
                            </div>
                        </div> */}

                        <div className="mt-5">
                            <div>
                                <DailySectionalAnalyticshart
                                    trackingDetails={trackingDetails}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="d-flex justify-content-center"
                            style={{ marginTop: "15%" }}
                        >
                            <h4>Tracking data is unavailable</h4>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GameDetailsNew;
