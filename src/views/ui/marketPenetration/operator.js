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

const MarketPenetrationOperatorDashboard = () => {
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

    const sortFieldRef = useRef("coverage");
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

    let items = [{ label: "Operators", command: () => navigate("/market-penetration-operator") }];

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

    const getCasinosProviders = async () => {
        try {
            const response = await MarketPenetration.market_penetration_provider_casinos();

            if (response?.success === true) {
                console.log(response);
                setCasinosList(response?.data || []);
            } else {
                console.log("Failed to fetch casinos list");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setCasinosLoader(false);
        }
    };

    const getLicensesProviders = async () => {
        try {
            const response = await MarketPenetration.market_penetration_provider_licenses();

            if (response?.success === true) {
                console.log(response);
                setLicensesList(response?.data || []);
            } else {
                console.log("Failed to fetch licenses list");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLicensesLoader(false);
        }
    };


    const getSummary = async () => {
        try {
            const response =
                await MarketPenetration.market_penetration_provider_summary({
                    "countries": selectedCountries ? selectedCountries : [],
                    "licenses": selectedLicenses ? selectedLicenses : [],
                    "operators": selectedCasinos ? selectedCasinos : [],
                });

            if (response?.success === true) {
                setSummaryProviderCount(response?.data?.provider_count);
                setSummaryCasinoCount(response?.data?.casino_count);
                setSummaryCoverage(
                    response?.data?.coverage,
                );
            } else {
                console.log("Failed to fetch summary data");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getCountryProviders();
        getCasinosProviders();
        getLicensesProviders();
        getSummary();
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
        getSummary();
        pageRef.current = 1;
        hasMoreRef.current = true;
        setTableData([]);

        fetchTableData({ reset: true });
    }, [selectedLicenses, selectedCasinos, selectedCountries]);

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
            res = await MarketPenetration.market_penetration_operator_data({
                "countries": selectedCountries ? selectedCountries : [],
                "licenses": selectedLicenses ? selectedLicenses : [],
                "operators": selectedCasinos ? selectedCasinos : [],
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
            field: "operator_name",
            header: headerWithTooltip("Operator", "Name of operator", "operator_name"),
            body: textTemplate("operator_name"),
            sortable: true,
        },
        {
            field: "country",
            header: headerWithTooltip("Country", "Country name", "country"),
            body: textTemplate("country"),
            sortable: true,
        },
        {
            field: "integrated_providers",
            header: headerWithTooltip(
                "Integrated Providers",
                "Overall count of providers integrated with the operator",
                "integrated_providers",
            ),
            body: textTemplate("integrated_providers"),
            sortable: true,
        },

        // {
        //     field: "visible_providers",
        //     header: headerWithTooltip(
        //         "Visible Providers",
        //         "Overall count of providers where the provider's games are found in lobby",
        //         "visible_providers",
        //     ),
        //     body: textTemplate("visible_providers"),
        //     sortable: true,
        // },

        {
            field: "coverage",
            header: headerWithTooltip(
                "Coverage",
                "Coverage of this operator across all providers",
                "coverage",
            ),
            body: percentageTextTemplate("coverage"),
            sortable: true,
        },
    ];


    return (
        <>
            <PageHeader
                title="Operator Market Penetration"
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

            <div className={`filter-wrapper ${showFilter ? "open" : "closed"}`}>
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
                    <MultiSelect
                        options={licensesList}
                        optionLabel="license_label"
                        optionValue="license"
                        filter
                        placeholder="License"
                        loading={licensesLoader}
                        value={selectedLicenses}
                        onChange={(e) => setSelectedLicenses(e.value)}
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
                                    header="Operators"
                                    tooltip="Shows total count of unique operators hosting your games"
                                    tooltipTarget="casino_count"
                                    value={summaryCasinoCount}
                                />
                                <InfoCard
                                    header="Providers"
                                    tooltip="Shows total count of providers"
                                    tooltipTarget="provider_count"
                                    value={summaryProviderCount}
                                />

                                <InfoCard
                                    header="Coverage"
                                    tooltip="Shows coverage of providers across casinos"
                                    tooltipTarget="coverage"
                                    value={summaryCoverage + "%"}
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
                            navigate("/market-penetration-operator-details", {
                                state: {
                                    operator_name: rowData.operator_name,
                                    country: rowData.country,
                                    integrated_providers: rowData.integrated_providers,
                                    coverage: rowData.coverage,
                                    visible_providers: rowData.visible_providers,
                                    stateSelectedCountries: selectedCountries,
                                    stateSelectedLicenses: selectedLicenses,
                                    stateCountries: countryList,
                                    stateLicenses: licensesList,
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

export default MarketPenetrationOperatorDashboard;
