import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Papa from "papaparse";

import PositionDashboard from "../../../services/PositionDashboard";
import { MultiSelect } from "primereact/multiselect";

import { useContext } from "react";
import { ProfileSystem } from "../../../context/ProfileContext";

import InfoCard from "../../../charts/InfoCard";
import PageHeader from "../../../component/PageHeader";
import headerWithTooltip from "../../../component/tableHeaders";
import ReusableLazyTable from "../../../component/ReusableLazyTable";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../DashboardMod.css";
import "../AccessBlur.css";
// import "./posnDashboard.css";
import {
    countryBodyTemplate,
    gameTrendTemplate,
    textTemplate,
    percentageTextTemplate
} from "../../../component/tableTemplates";
import MarketPenetration from "../../../services/MarketPenetration";
import NewProvider from "../../../services/NewProvider";

const NewProviderL3 = () => {
    const user_company = localStorage.getItem("user_company");
    const navigate = useNavigate();
    const location = useLocation();

    const { state } = useContext(ProfileSystem);
    const isPlanExpired = state?.plan === "trial_expired";
    const {
        provider_name,
        operator_name,
        country,
    } = location.state || {};
    //const isPlanExpired = state?.plan === "trial";

    const PAGE_SIZE = 20;

    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const searchRef = useRef("");

    const sortFieldRef = useRef("game_release_date");
    const sortOrderRef = useRef("desc");

    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [tableData, setTableData] = useState([]);

    let items = [{ label: "Providers", command: () => navigate("/new-providers") }, { label: provider_name }, { label: "Operators", command: () => navigate("/new-providers/operators") }, { label: operator_name + "(" + country + ")" }, { label: "Games" }];


    useEffect(() => {
        pageRef.current = 1;
        hasMoreRef.current = true;
        setTableData([]);

        fetchTableData({ reset: true });
    }, []);

    useEffect(() => {
        pageRef.current = 1;
        hasMoreRef.current = true;
        setTableData([]);

        fetchTableData({ reset: true });
    }, [searchTerm]);

    const fetchTableData = async ({ reset = false } = {}) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        // skeleton rows
        setTableData((prev) => [
            ...prev,
            ...Array.from({ length: PAGE_SIZE }, (_, i) => ({
                __skeleton: true,
                provider_id: `skeleton-${pageRef.current}-${i}`,
            })),
        ]);

        try {
            let res;
            res = await NewProvider.new_provider_l3({
                limit: PAGE_SIZE,
                page: pageRef.current,
                search: searchTerm,
                sort_by: sortFieldRef.current,
                order: sortOrderRef.current,
                provider_name: provider_name,
                operator_name: operator_name,
                country: country
            });

            if (res?.success) {
                setTableData((prev) => {
                    const clean = prev.filter((r) => !r.__skeleton);
                    return reset ? res.data : [...clean, ...res.data];
                });

                console.log("res.data : ", res);

                hasMoreRef.current =
                    res.pagination.current_page < res.pagination.total_pages;

                pageRef.current = res.pagination.current_page + 1;
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    const resetTable = () => {
        pageRef.current = 1;
        hasMoreRef.current = true;

        setTableData([]);
        fetchTableData({ reset: true });
    };

    const handleSort = (field, order) => {
        sortFieldRef.current = field;
        sortOrderRef.current = order;

        pageRef.current = 1;
        hasMoreRef.current = true;

        fetchTableData({ reset: true });
    };

    const columns = [
        {
            field: "game_name",
            header: headerWithTooltip("Game", "Name of game", "game_name"),
            body: textTemplate("game_name"),
            sortable: true,
        },
        {
            field: "provider_name",
            header: headerWithTooltip("provider", "provider name", "provider_name"),
            body: textTemplate("provider_name"),
            sortable: true,
        },

        // {
        //     field: "countries_present",
        //     header: headerWithTooltip(
        //         "Countries Present",
        //         "Overall count of countries provider and operator are integrated",
        //         "countries_present",
        //     ),
        //     body: textTemplate("countries_present"),
        //     sortable: true,
        // },

        {
            field: "game_release_date",
            header: headerWithTooltip(
                "Game Release Date",
                "Worldwide release date of the game",
                "game_release_date",
            ),
            body: textTemplate("game_release_date"),
            sortable: true,
        }
    ];

    return (
        <>
            <PageHeader
                title="Newly Launched Providers"
                breadcrumb={items}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                isPlanExpired={isPlanExpired}
                features={{
                    search: true,
                    filters: false,
                    download: false,
                    chat: false,
                }}
            />


            {loading || tableData.length > 0 ? (
                <>
                    {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
                    <div className="mb-3">
                        <div>
                            {/* <h5 className="font-semibold pl-2">Summary</h5> */}
                            <div className="flex gap-2 mt-2">
                                <InfoCard
                                    header="Provider"
                                    tooltip="Shows selected provider"
                                    tooltipTarget="provider_name"
                                    value={provider_name}
                                />
                                <InfoCard
                                    header="Operators"
                                    tooltip="selected operator"
                                    tooltipTarget="operator_name"
                                    value={operator_name}
                                />
                                <InfoCard
                                    header="Country"
                                    tooltip="Shows selected country"
                                    tooltipTarget="country"
                                    value={country}
                                />
                            </div>
                        </div>
                    </div>

                    <ReusableLazyTable
                        data={tableData}
                        loading={loading}
                        hasMore={hasMoreRef.current}
                        columns={columns}
                        scrollHeight="600px"
                        onLazyLoad={() => fetchTableData()}
                        onSort={handleSort}
                        sortField={sortFieldRef.current}
                        sortOrder={sortOrderRef.current}
                        onRowClick={(e) => {
                            const rowData = e.data;
                        }}
                    />
                </>
            ) : (
                <>
                    <div
                        className="d-flex justify-content-center"
                        style={{ marginTop: "15%" }}
                    >
                        <h4>No trackers configured</h4>
                    </div>
                </>
            )}
        </>
    );
};

export default NewProviderL3;
