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

const MarketPenetrationOperatorDashboardL2 = () => {
    const user_company = localStorage.getItem("user_company");
    const navigate = useNavigate();
    const location = useLocation();

    const { state } = useContext(ProfileSystem);
    const isPlanExpired = state?.plan === "trial_expired";
    const {
        operator_name,
        integrated_providers,
        coverage,
        visible_providers,
        stateSelectedCountries,
        stateSelectedLicenses,
        stateCountries,
        stateLicenses,
    } = location.state || {};
    //const isPlanExpired = state?.plan === "trial";

    const PAGE_SIZE = 20;

    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const searchRef = useRef("");

    const sortFieldRef = useRef("visible_games_percentage");
    const sortOrderRef = useRef("desc");

    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableData, setTableData] = useState([]);

    const [selectedLicenses, setSelectedLicenses] = useState(stateSelectedLicenses);
    const [selectedCasinos, setSelectedCasinos] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState(stateSelectedCountries);

    let items = [{ label: "Operators", command: () => navigate("/market-penetration-operator") }, { label: operator_name }];


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
            res = await MarketPenetration.market_penetration_operator_provider_details({
                "countries": selectedCountries ? selectedCountries : [],
                "licenses": selectedLicenses ? selectedLicenses : [],
                "operators": selectedCasinos ? selectedCasinos : [],
                limit: PAGE_SIZE,
                page: pageRef.current,
                search: searchTerm,
                sort_by: sortFieldRef.current,
                order: sortOrderRef.current,
                operator_name: operator_name
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
            field: "provider_name",
            header: headerWithTooltip("Provider", "Name of provider", "provider_name"),
            body: textTemplate("provider_name"),
            sortable: true,
        },

        {
            field: "visible_games",
            header: headerWithTooltip(
                "Visible Games",
                "Overall count of games visible in lobby",
                "visible_games",
            ),
            body: textTemplate("visible_games"),
            sortable: true,
        },

        {
            field: "visible_games_percentage",
            header: headerWithTooltip(
                "Visible Games %",
                "Percentage of games visible in lobby out of total games on the operator",
                "visible_games_percentage",
            ),
            body: percentageTextTemplate("visible_games_percentage"),
            sortable: true,
        },
    ];

    return (
        <>
            <PageHeader
                title="Provider Market Penetration"
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

            <div className={`filter-wrapper ${((stateCountries && stateCountries.length > 0) || (stateLicenses && stateLicenses.length > 0)) ? "open" : "closed"}`}>
                <div className="d-flex gap-2 mt-2 w-100 align-items-center justify-content-between">
                    <MultiSelect
                        options={stateCountries ? stateCountries : []}
                        optionLabel="geography"
                        optionValue="geography"
                        filter
                        placeholder="Country"
                        //loading={countryLoader}
                        value={selectedCountries}
                        //onChange={(e) => setSelectedCountries(e.value)}
                        className="w-100"
                    />
                    <MultiSelect
                        options={stateLicenses ? stateLicenses : []}
                        optionLabel="license_label"
                        optionValue="license"
                        filter
                        placeholder="License"
                        //loading={licensesLoader}
                        value={selectedLicenses}
                        //onChange={(e) => setSelectedLicenses(e.value)}
                        className="w-100"
                    />
                    {/* <MultiSelect
                                                options={casinosList}
                                                optionLabel="operator_name"
                                                optionValue="operator_name"
                                                filter
                                                placeholder="Operator"
                                                loading={casinosLoader}
                                                value={selectedCasinos}
                                                onChange={(e) => setSelectedCasinos(e.value)}
                                                className="w-100"
                                            /> */}
                </div>
            </div>

            {loading || tableData.length > 0 ? (
                <>
                    {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
                    <div className="mb-3">
                        <div>
                            {/* <h5 className="font-semibold pl-2">Summary</h5> */}
                            <div className="flex gap-2 mt-2">
                                <InfoCard
                                    header="Integrated Providers"
                                    tooltip="Shows total count of providers where operator is integrated"
                                    tooltipTarget="integrated_providers"
                                    value={integrated_providers}
                                />

                                <InfoCard
                                    header="Visible Providers"
                                    tooltip="Shows total count of unique providers whose games are visible in lobby"
                                    tooltipTarget="visible_providers"
                                    value={visible_providers}
                                />

                                <InfoCard
                                    header="Coverage"
                                    tooltip="Shows coverage of operator across providers"
                                    tooltipTarget="coverage"
                                    value={coverage + "%"}
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
                            console.log(rowData);
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

export default MarketPenetrationOperatorDashboardL2;
