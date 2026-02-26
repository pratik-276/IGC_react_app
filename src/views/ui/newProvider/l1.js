import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

const NewProviderL1 = () => {
    const user_company = localStorage.getItem("user_company");
    const navigate = useNavigate();
    const location = useLocation();

    const { state } = useContext(ProfileSystem);
    const isPlanExpired = state?.plan === "trial_expired";
    //const isPlanExpired = state?.plan === "trial";

    const PAGE_SIZE = 20;

    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const searchRef = useRef("");

    const sortFieldRef = useRef("total_operators");
    const sortOrderRef = useRef("desc");

    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableData, setTableData] = useState([]);

    const [selectedLicenses, setSelectedLicenses] = useState(null);
    const [selectedCasinos, setSelectedCasinos] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState(null);


    const [licensesList, setLicensesList] = useState([]);
    const [casinosList, setCasinosList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [licensesLoader, setLicensesLoader] = useState(true);
    const [casinosLoader, setCasinosLoader] = useState(true);
    const [countryLoader, setCountryLoader] = useState(true);

    const [summaryProviderCount, setSummaryProviderCount] = useState(null);
    const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
    const [summaryCoverage, setSummaryCoverage] = useState(null);

    let items = [{ label: "Providers", command: () => navigate("/new-providers") }];

    const getCountryProviders = async () => {
        try {
            const response = await MarketPenetration.market_penetration_provider_countries();

            if (response?.success === true) {
                console.log(response);
                setCountryList(response?.data || []);
            } else {
                console.log("Failed to fetch casinos list");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setCountryLoader(false);
        }
    };


    useEffect(() => {
        getCountryProviders();
        //getCasinosProviders();
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

    useEffect(() => {
        pageRef.current = 1;
        hasMoreRef.current = true;
        setTableData([]);

        fetchTableData({ reset: true });
    }, [selectedCountries]);

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
            res = await NewProvider.new_provider_l1({
                "countries": selectedCountries ? selectedCountries : [],
                limit: PAGE_SIZE,
                page: pageRef.current,
                search: searchTerm,
                sort_by: sortFieldRef.current,
                order: sortOrderRef.current,
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
            field: "provider_launch_date",
            header: headerWithTooltip(
                "Provider Launch Date",
                "Date when the provider launched their first game globally",
                "provider_launch_date",
            ),
            body: textTemplate("provider_launch_date"),
            sortable: true,
        },
        {
            field: "total_operators",
            header: headerWithTooltip(
                "Operators",
                "Overall count of operators where the provider is integrated",
                "total_operators",
            ),
            body: textTemplate("total_operators"),
            sortable: true,
        },
    ];

    return (
        <>
            <PageHeader
                title="Newly Launched Providers"
                breadcrumb={items}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                onToggleFilter={() => setShowFilter((v) => !v)}
                isPlanExpired={isPlanExpired}
                features={{
                    search: true,
                    filters: true,
                    download: false,
                    chat: false,
                }}
            />

            <div className={`filter-wrapper mb-3 ${showFilter ? "open" : "closed"}`}>
                <div className="d-flex gap-2 mt-2 w-100 align-items-center justify-content-between">
                    <MultiSelect
                        options={countryList}
                        optionLabel="geography"
                        optionValue="geography"
                        filter
                        placeholder="Country"
                        loading={countryLoader}
                        value={selectedCountries}
                        onChange={(e) => setSelectedCountries(e.value)}
                        className="w-100"
                    />

                </div>
            </div>

            {loading || tableData.length > 0 ? (
                <>
                    {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
                    {/* <div className="mb-3">
                        <div>
                            <div className="flex gap-2 mt-2">
                                <InfoCard
                                    header="Providers"
                                    tooltip="Shows total count of providers"
                                    tooltipTarget="provider_count"
                                    value={summaryProviderCount}
                                />

                                <InfoCard
                                    header="Operators"
                                    tooltip="Shows total count of unique operators hosting your games"
                                    tooltipTarget="casino_count"
                                    value={summaryCasinoCount}
                                />

                                <InfoCard
                                    header="Coverage"
                                    tooltip="Shows coverage of providers across casinos"
                                    tooltipTarget="coverage"
                                    value={summaryCoverage + "%"}
                                />
                            </div>
                        </div>
                    </div> */}

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
                            console.log(selectedCountries, selectedLicenses);
                            navigate("/new-providers/operators", {
                                state: {
                                    provider_name: rowData.provider_name,
                                    total_operators: rowData.total_operators,
                                    provider_launch_date: rowData.provider_launch_date,
                                    stateSelectedCountries: selectedCountries,
                                    stateCountries: countryList,
                                },
                            });
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

export default NewProviderL1;
