import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { BreadCrumb } from 'primereact/breadcrumb';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";

import { Spin } from "antd";

import { MdInfoOutline } from "react-icons/md";
import { FaGem, FaLock, FaCaretUp, FaCaretDown } from "react-icons/fa6";

import dayjs from "dayjs";
import Papa from "papaparse";

import InfoCard from "../../../charts/InfoCard";
import PositionDashboard from "../../../services/PositionDashboard";

import { useContext } from "react";
import { ProfileSystem } from "../../../context/ProfileContext";
import { useContactSales } from "../../../context/confirmationContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../DashboardMod.css";
import "../AccessBlur.css";
import "./posnDashboard.css";
import { Skeleton } from "primereact/skeleton";

const OperatorDashboard1 = () => {
    const user_id = localStorage.getItem("user_id");
    const user_company = localStorage.getItem("user_company");
    const navigate = useNavigate();

    const location = useLocation();
    const {
        redirect_from,
        country_name_from_state,
        state_name_from_state,
        game_id_from_state,
        game_name_from_state
    } = location.state || {};
    var redirectFrom = "operator";
    if (redirect_from) {
        redirectFrom = redirect_from;
    }
    console.log("Redirect FROM: " + redirectFrom);

    const [loader, setLoader] = useState(false);

    const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
    const [summaryCasinoCoverage, setSummaryCasinoCoverage] = useState(null);
    const [summaryGameCount, setSummaryGameCount] = useState(null);
    const [summaryTotalPositions, setSummaryTotalPositions] = useState(null);
    const [summaryCountryCount, setSummaryCountryCount] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    //const [redirectFrom, setRedirectFrom] = useState("operator");

    const PAGE_SIZE = 20;
    const tableWrapperRef = useRef(null);

    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const searchRef = useRef("");
    const searchDebounceRef = useRef(null);
    const sortFieldRef = useRef("game_positions_count");
    const sortOrderRef = useRef("desc");

    const [hasMore, setHasMore] = useState(true);
    const [tableData, setTableData] = useState([]);
    //const [totalRecords, setTotalRecords] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    var items = [];
    if (redirectFrom === "country") {
        items = [{ label: 'Countries' }, { label: country_name_from_state }, { label: 'Operators' }];
    }
    if (redirectFrom === "operator") {
        items = [{ label: 'Operators' }];
    }
    if (redirectFrom === "game") {
        items = [{ label: 'Games' }, { label: game_name_from_state }, { label: 'Countries' }, { label: country_name_from_state }, { label: "Operators" }];
    }

    const home = { icon: 'pi pi-home' }

    useEffect(() => {
        // if (redirect_from) {
        //     console.log(redirect_from);
        //     setRedirectFrom(redirect_from);
        // }
        // console.log(redirect_from, redirectFrom);
        const wrapper = tableWrapperRef.current?.querySelector(
            ".p-datatable-wrapper"
        );

        if (!wrapper) return;

        const handleScroll = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;

            if (pageRef.current === 1) return;

            if (scrollTop + clientHeight >= scrollHeight - 50) {
                fetchTableData();
            }
        };

        wrapper.addEventListener("scroll", handleScroll);
        return () => wrapper.removeEventListener("scroll", handleScroll);
    }, [tableData.length]);

    const fetchTableData = async ({ reset = false } = {}) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setTableLoading(true);

        setTableData((prev) => [
            ...prev,
            ...Array.from({ length: PAGE_SIZE }, (_, i) => ({
                __skeleton: true,
                comb_id: `skeleton-${pageRef.current}-${i}`,
            })),
        ]);

        try {
            if (redirectFrom === "country") {
                const res = await PositionDashboard.provider_operator_dashboard_1({
                    game_provider: user_company,
                    country_name: country_name_from_state,
                    state: state_name_from_state,
                    limit: PAGE_SIZE,
                    page: pageRef.current,
                    search: searchRef.current,
                    sort_by: sortFieldRef.current,
                    order: sortOrderRef.current
                });
                if (res?.success) {
                    setTableData((prev) => {
                        // remove skeleton rows
                        const clean = prev.filter((r) => !r.__skeleton);
                        return reset ? res.data : [...clean, ...res.data];
                    });

                    hasMoreRef.current =
                        res.pagination.current_page < res.pagination.total_pages;

                    pageRef.current = res.pagination.current_page + 1;
                }
            }
            if (redirectFrom === "operator") {
                const res = await PositionDashboard.provider_operator_dashboard_2({
                    game_provider: user_company,
                    limit: PAGE_SIZE,
                    page: pageRef.current,
                    search: searchRef.current,
                    sort_by: sortFieldRef.current,
                    order: sortOrderRef.current
                });
                if (res?.success) {
                    setTableData((prev) => {
                        // remove skeleton rows
                        const clean = prev.filter((r) => !r.__skeleton);
                        return reset ? res.data : [...clean, ...res.data];
                    });

                    hasMoreRef.current =
                        res.pagination.current_page < res.pagination.total_pages;

                    pageRef.current = res.pagination.current_page + 1;
                }
            }
            if (redirectFrom === "game") {
                const res = await PositionDashboard.provider_operator_dashboard_3({
                    game_provider: user_company,
                    game_id: game_id_from_state,
                    country_name: country_name_from_state,
                    state: state_name_from_state,
                    limit: PAGE_SIZE,
                    page: pageRef.current,
                    search: searchRef.current,
                    sort_by: sortFieldRef.current,
                    order: sortOrderRef.current
                });
                if (res?.success) {
                    setTableData((prev) => {
                        // remove skeleton rows
                        const clean = prev.filter((r) => !r.__skeleton);
                        return reset ? res.data : [...clean, ...res.data];
                    });

                    hasMoreRef.current =
                        res.pagination.current_page < res.pagination.total_pages;

                    pageRef.current = res.pagination.current_page + 1;
                }
            }


        } finally {
            loadingRef.current = false;
            setTableLoading(false);
        }
    };

    const onSort = (e) => {
        sortFieldRef.current = e.sortField;
        sortOrderRef.current = e.sortOrder === 1 ? "asc" : "desc";

        // reset pagination
        pageRef.current = 1;
        hasMoreRef.current = true;
        setHasMore(true);
        setTableData([]);

        fetchTableData({ reset: true });
    };

    useEffect(() => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            searchRef.current = searchTerm.trim();

            pageRef.current = 1;
            hasMoreRef.current = true;
            setHasMore(true);
            setTableData([]);
            fetchTableData({ reset: true });
        }, 500);

        return () => clearTimeout(searchDebounceRef.current);
    }, [searchTerm]);

    useEffect(() => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            searchRef.current = searchTerm.trim();

            pageRef.current = 1;
            hasMoreRef.current = true;
            setHasMore(true);
            setTableData([]);
            fetchTableData({ reset: true });
        }, 500);

        return () => clearTimeout(searchDebounceRef.current);
    }, [redirectFrom]);

    const { state } = useContext(ProfileSystem);
    const isPlanExpired = state?.plan === "trial_expired";
    //const isPlanExpired = state?.plan === "trial";
    const { showContactSalesConfirmation } = useContactSales();


    useEffect(() => {
        getSummary();
    }, []);


    useEffect(() => {
        getSummary();
    }, [redirectFrom]);

    const getSummary = async () => {
        try {
            if (redirectFrom === "country") {
                const response = await PositionDashboard.provider_operator_dashboard_1_summary({
                    game_provider: user_company,
                    country_name: country_name_from_state,
                    state: state_name_from_state,
                });
                if (response?.success === true) {
                    setSummaryCasinoCount(response?.data?.casino_count || null);
                    setSummaryCasinoCoverage(response?.data?.casino_coverage || null);
                    setSummaryGameCount(response?.data?.game_count || null);
                    setSummaryTotalPositions(response?.data?.game_positions_count || null);
                } else {
                    console.log("Failed to fetch summary data");
                }
            }
            if (redirectFrom === "operator") {
                const response = await PositionDashboard.provider_operator_dashboard_2_summary({
                    game_provider: user_company
                });

                if (response?.success === true) {
                    setSummaryCasinoCount(response?.data?.casino_count || null);
                    setSummaryCountryCount(response?.data?.country_count || null);
                    setSummaryTotalPositions(response?.data?.game_positions_count || null);
                } else {
                    console.log("Failed to fetch summary data");
                }
            }
            if (redirectFrom === "game") {
                const response = await PositionDashboard.provider_operator_dashboard_3_summary({
                    game_provider: user_company,
                    game_id: game_id_from_state,
                    country_name: country_name_from_state,
                    state: state_name_from_state,
                });

                if (response?.success === true) {
                    setSummaryCasinoCount(response?.data?.casino_count || null);
                    setSummaryCountryCount(response?.data?.country_count || null);
                    setSummaryTotalPositions(response?.data?.game_positions_count || null);
                } else {
                    console.log("Failed to fetch summary data");
                }
            }

        } catch (err) {
            console.log(err);
        }
    };

    const headerWithTooltip = (headerText, tooltipText, id) => (
        <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "100%" }}
        >
            <div className="d-flex align-items-center m-1">
                <h5 style={{ margin: 0 }}>{headerText}</h5>
                <Tooltip
                    target={`.info-icon-${id}`}
                    content={tooltipText}
                    position="top"
                    className="custom-tooltip"
                />
                <MdInfoOutline
                    className={`info-icon-${id} ms-2`}
                    style={{ fontSize: "16px", cursor: "pointer", flexShrink: 0 }}
                />
            </div>
        </div>
    );

    const skeletonBody = () => {
        return (
            <Skeleton width="80%" height="1rem" style={{ margin: "0.25rem 0" }} />
        );
    };

    const exportCSV = async () => {

        if (redirectFrom === "country") {
            const downloadData = {
                game_provider: user_company,
                search: searchTerm,
                country_name: country_name_from_state,
                state: state_name_from_state,
            };
            const downloadRes = await PositionDashboard.provider_operator_dashboard_1_download(
                downloadData
            );
            //console.log("downloadRes", downloadRes?.data);
            if (downloadRes?.success === true) {
                const csv = Papa.unparse(downloadRes?.data);
                const link = document.createElement("a");
                link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                link.download = "game_tracker_data.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        if (redirectFrom === "operator") {
            const downloadData = {
                game_provider: user_company,
                search: searchTerm
            };
            const downloadRes = await PositionDashboard.provider_operator_dashboard_2_download(
                downloadData
            );
            //console.log("downloadRes", downloadRes?.data);
            if (downloadRes?.success === true) {
                const csv = Papa.unparse(downloadRes?.data);
                const link = document.createElement("a");
                link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                link.download = "game_tracker_data.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        if (redirectFrom === "game") {
            const downloadData = {
                game_provider: user_company,
                search: searchTerm,
                game_id: game_id_from_state,
                country_name: country_name_from_state,
                state: state_name_from_state,
            };
            const downloadRes = await PositionDashboard.provider_operator_dashboard_3_download(
                downloadData
            );
            //console.log("downloadRes", downloadRes?.data);
            if (downloadRes?.success === true) {
                const csv = Papa.unparse(downloadRes?.data);
                const link = document.createElement("a");
                link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                link.download = "game_tracker_data.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

    };

    return (
        <>
            <div>
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                                Positions Dashboard
                            </h4>
                            <span>
                                Track latest positions of all your games across all casinos
                            </span>
                        </div>
                    </div>
                </div>
                <BreadCrumb model={items} home={home} style={{
                    textDecoration: "none!important",
                    marginTop: "3rem",
                    marginBottom: "1rem"
                }} />

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
                ) : (
                    <>
                        {tableData.length > 0 ? (
                            <>
                                {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
                                <div className="mb-3">
                                    <div>
                                        {/* <h5 className="font-semibold pl-2">Summary</h5> */}
                                        <div className="flex gap-2 mt-2">

                                            <InfoCard
                                                header="Operator Count"
                                                tooltip="Shows total count of unique operators hosting your games"
                                                tooltipTarget="casino_count"
                                                value={summaryCasinoCount}
                                            />

                                            {redirectFrom === "country" && <InfoCard
                                                header="Operator Coverage"
                                                tooltip="Shows coverage of your games compared to total operators scanned in selected country"
                                                tooltipTarget="casino_coverage"
                                                value={summaryCasinoCoverage + "%"}
                                            />}

                                            {(redirectFrom === "operator") && <InfoCard
                                                header="Country Count"
                                                tooltip="Shows total count of unique countries hosting your games"
                                                tooltipTarget="country_count"
                                                value={summaryCountryCount}
                                            />}

                                            {redirectFrom === "country" && <InfoCard
                                                header="Game Count"
                                                tooltip="Shows total count of unique games across all casinos"
                                                tooltipTarget="game_count"
                                                value={summaryGameCount}
                                            />}

                                            <InfoCard
                                                header="Total Positions"
                                                tooltip="Shows total count of unique game positions across all casinos"
                                                tooltipTarget="game_position_count"
                                                value={summaryTotalPositions}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
                                <div className="">
                                    {/* Tracker Details Table */}

                                    <div className="d-flex align-items-center justify-content-end">
                                        {/* <h5 className="font-semibold pl-2">Latest Details</h5> */}
                                        {isPlanExpired ? (
                                            <>
                                                <span
                                                    className="text-muted"
                                                    id="download-disabled"
                                                    style={{
                                                        cursor: "not-allowed",
                                                        textDecoration: "underline dotted",
                                                    }}
                                                >
                                                    Download Report
                                                </span>
                                                <Tooltip
                                                    target="#download-disabled"
                                                    content="Upgrade your plan to download the report"
                                                    position="top"
                                                />
                                            </>
                                        ) : (
                                            <div className="d-flex align-items-center gap-1 mb-2">
                                                <IconField iconPosition="left">
                                                    <InputIcon className="pi pi-search"> </InputIcon>
                                                    <InputText
                                                        placeholder="Search..."
                                                        className="w-12rem"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </IconField>
                                                <Button
                                                    icon="pi pi-download"
                                                    tooltip="Download Report"
                                                    tooltipOptions={{ position: "top" }}
                                                    rounded
                                                    onClick={() => exportCSV()}
                                                    style={{ backgroundColor: "#392f6c", border: "none" }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div ref={tableWrapperRef}>
                                            <DataTable
                                                value={tableData}
                                                dataKey="comb_id"
                                                lazy
                                                scrollable
                                                scrollHeight="600px"
                                                onSort={onSort}
                                                sortField={sortFieldRef.current}
                                                sortOrder={sortOrderRef.current === "asc" ? 1 : -1}
                                                className="table-bordered p-datatable custom-table small"
                                                onRowClick={(e) => {
                                                    const rowData = e.data;
                                                    if (redirectFrom === "country") {
                                                        navigate("/game-dashboard", {
                                                            state: {
                                                                redirect_from: "country",
                                                                country_name_from_state: country_name_from_state,
                                                                state_name_from_state: state_name_from_state,
                                                                operator_id_from_state: rowData.operator_id,
                                                                operator_name_from_state: rowData.operator_name,
                                                            },
                                                        });
                                                    }
                                                    if (redirectFrom === "operator") {
                                                        navigate("/country-dashboard", {
                                                            state: {
                                                                redirect_from: "operator",
                                                                operator_id_from_state: rowData.operator_id,
                                                                operator_name_from_state: rowData.operator_name,
                                                            },
                                                        });
                                                    }

                                                    if (redirectFrom === "game") {
                                                        navigate("/page-position-details", {
                                                            state: {
                                                                redirect_from: redirectFrom,
                                                                game_id: game_id_from_state,
                                                                game_name: game_name_from_state,
                                                                operator_id: rowData.operator_id,
                                                                operator_name: rowData.operator_name,
                                                                country_name: country_name_from_state,
                                                                state_name: state_name_from_state,
                                                            },
                                                        });
                                                    }
                                                }}
                                            >

                                                <Column
                                                    field="operator_name"
                                                    header={headerWithTooltip(
                                                        "Operator",
                                                        "Name of Operator",
                                                        "operator_name"
                                                    )}
                                                    body={(rowData) =>
                                                        rowData.__skeleton
                                                            ? skeletonBody()
                                                            : rowData.operator_name
                                                    }
                                                    sortable
                                                ></Column>

                                                {(redirectFrom === "operator") && <Column
                                                    field="country_count"
                                                    header={headerWithTooltip(
                                                        "Country Count",
                                                        "Overall count of countries for this operator",
                                                        "country_count"
                                                    )}
                                                    sortable
                                                    body={(rowData) =>
                                                        rowData.__skeleton
                                                            ? skeletonBody()
                                                            : rowData.country_count
                                                    }
                                                />}

                                                {(redirectFrom === "operator" || redirectFrom === "country") && <Column
                                                    field="game_count"
                                                    header={headerWithTooltip(
                                                        "Game Count",
                                                        "Overall count of games in this country",
                                                        "game_count"
                                                    )}
                                                    sortable
                                                    body={(rowData) =>
                                                        rowData.__skeleton
                                                            ? skeletonBody()
                                                            : rowData.game_count
                                                    }
                                                />}

                                                <Column
                                                    field="game_positions_count"
                                                    header={headerWithTooltip(
                                                        "Total Positions",
                                                        "Overall count of positions where the game is found across all casinos in this country",
                                                        "game_positions_count"
                                                    )}
                                                    sortable
                                                    body={(rowData) =>
                                                        rowData.__skeleton
                                                            ? skeletonBody()
                                                            : rowData.game_positions_count
                                                    }
                                                ></Column>

                                                {redirectFrom === "game" && <Column
                                                    field="last_observed_date"
                                                    header={headerWithTooltip(
                                                        "LOD",
                                                        "Date when the game was last observed on the operator",
                                                        "last_observed_date"
                                                    )}
                                                    sortable
                                                    body={(rowData) => {
                                                        if (rowData.__skeleton) {
                                                            return <Skeleton width="60%" height="1rem" />;
                                                        }

                                                        return dayjs(rowData.last_observed_date).format(
                                                            "MMM D, YYYY"
                                                        );
                                                    }}
                                                    style={{ minWidth: "7rem" }}
                                                ></Column>}
                                            </DataTable>
                                        </div>

                                        {isPlanExpired && (
                                            <div
                                                className="d-flex flex-column align-items-center justify-content-center py-4"
                                                style={{
                                                    background: "#f8f8f8",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ccc",
                                                    marginTop: "1rem",
                                                }}
                                            >
                                                <FaLock
                                                    style={{
                                                        fontSize: "2rem",
                                                        marginBottom: "0.5rem",
                                                        color: "#392f6c",
                                                    }}
                                                />
                                                <p className="fw-bold m-1">
                                                    To access the complete data, please upgrade your plan.
                                                </p>
                                                <Button
                                                    className="btn-upgrade"
                                                    onClick={showContactSalesConfirmation}
                                                >
                                                    <FaGem /> <span>Upgrade Plan</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="d-flex justify-content-center"
                                    style={{ marginTop: "15%" }}
                                >
                                    <h4>
                                        No trackers configured
                                    </h4>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default OperatorDashboard1;
