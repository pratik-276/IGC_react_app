import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { MultiSelect } from "primereact/multiselect";
import { Tooltip } from "primereact/tooltip";

import { MdInfoOutline } from "react-icons/md";
import BullsharkReport from "../../services/BullsharkReport";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

export default function BullsharkReportPage() {
  const navigate = useNavigate();
  const provider_id = localStorage.getItem("provider_id");

  const [markets, setMarkets] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  const [casinos, setCasinos] = useState([]);
  const [casinoLoading, setCasinoLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);

  const [selectedMarket, setSelectedMarket] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCasino, setSelectedCasino] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);

  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllMarketsList = () => {
    setMarketLoading(true);
    BullsharkReport.get_all_markets()
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((item) => item?.market && typeof item.market === "string")
            .map((item) => ({
              label: item.market,
              value: item.market,
            }));

          setMarkets(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
        setMarkets([]);
      })
      .finally(() => {
        setMarketLoading(false);
      });
  };

  const getCountryList = () => {
    setCountryLoading(true);
    const payload = {
      markets: selectedMarket,
    };
    BullsharkReport.get_country_for_multiple_market(payload)
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((item) => item?.country && typeof item.country === "string")
            .map((item) => ({
              label: item.country,
              value: item.country,
            }));

          setCountries(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setCountryLoading(false);
      });
  };

  const getCasinoList = () => {
    setCasinoLoading(true);
    const payload = {
      countries: selectedCountry,
    };
    BullsharkReport.get_operator_for_multiple_country(payload)
      .then((res) => {
        if (res?.success === true) {
          setCasinos(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setCasinoLoading(false);
      });
  };

  const getProvidersList = () => {
    setProviderLoading(true);

    BullsharkReport.get_provider()
      .then((res) => {
        if (res?.success === true) {
          setProviders(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setProviderLoading(false);
      });
  };

  const getReportData = () => {
    setLoading(true);
    const payload = {
      markets: selectedMarket,
      countries: selectedCountry,
      operator_ids: selectedCasino,
      provider_ids: selectedProvider,
    };
    console.log("Payload sent:", payload);

    BullsharkReport.get_competitor_data(payload)
      .then((res) => {
        if (res?.success === true) {
          setData(res.data);
          setTableData(generateTableData(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const generateTableData = (raw) => {
    const grouped = {};

    raw.forEach((item) => {
      const key = `${item.country}__${item.casino}`;

      if (!grouped[key]) {
        grouped[key] = {
          country: item.country,
          casino: item.casino,

          casino_id: item.casino_id || item.operator_id,
          provider_ids: new Set(),
        };
      }

      if (item.provider_id) {
        grouped[key].provider_ids.add(item.provider_id);
      }

      grouped[key][item.provider_name] = item.game_count;
    });

    return Object.values(grouped).map((row) => ({
      ...row,
      provider_ids: Array.from(row.provider_ids),
    }));
  };

  useEffect(() => {
    getAllMarketsList();
  }, []);

  useEffect(() => {
    if (selectedMarket.length > 0) {
      getCountryList();
    }
  }, [selectedMarket]);

  useEffect(() => {
    if (selectedCountry.length > 0) {
      getCasinoList();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCasino.length > 0) {
      getProvidersList();
    }
  }, [selectedCasino]);

  const headerWithTooltip = (headerText, tooltipText, id) => (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ width: "100%" }}
    >
      <div className="d-flex align-items-center m-1">
        <h5 style={{ margin: 0 }}>{headerText}</h5>
        <Tooltip
          target={`.info-icon-${sanitizeForClass(id)}`}
          content={tooltipText}
          position="top"
          className="custom-tooltip"
        />
        <MdInfoOutline
          className={`info-icon-${sanitizeForClass(id)} ms-2`}
          style={{ fontSize: "16px", cursor: "pointer", flexShrink: 0 }}
        />
      </div>
    </div>
  );

  const sortIconTemplate = (options) => {
    let icon = options.sorted ? (
      options.sortOrder < 0 ? (
        <i className="pi pi-sort-up" style={{ fontSize: "14px" }} />
      ) : (
        <i className="pi pi-sort-down" style={{ fontSize: "14px" }} />
      )
    ) : (
      <i className="pi pi-sort" style={{ fontSize: "14px" }} />
    );
    return icon;
  };

  const gameCountTemplate = (value) => {
    const hasValue = value !== undefined && value !== null && value > 0;

    return (
      <div
        style={{
          backgroundColor: hasValue ? "#d4edda" : "#f8d7da",
          padding: "4px 4px",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        {hasValue ? value : "-"}
      </div>
    );
  };

  const sanitizeForClass = (str) => str.replace(/[^a-zA-Z0-9-_]/g, "-");

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="pb-3">
              <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                Bullshark Report test
              </h4>
              <span className="text-black" style={{ fontSize: "1rem" }}>
                Sample description text for Bullshark Report page.
              </span>
            </div>

            <div className="d-flex flex-column gap-4">
              <div className="row g-3">
                {/* MARKET */}
                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Market"
                      loading={marketLoading}
                      value={selectedMarket}
                      onChange={(e) => {
                        setSelectedMarket(e.value);
                        setSelectedCountry([]);
                        setCountries([]);
                        setSelectedCasino([]);
                        setCasinos([]);
                        setSelectedProvider([]);
                        setProviders([]);
                      }}
                      options={markets}
                      className="w-100"
                      inputId="market"
                    />
                    <label className="fs-6" htmlFor="market">
                      Market
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Country"
                      loading={countryLoading}
                      disabled={selectedMarket.length === 0}
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.value);
                        setSelectedCasino([]);
                        setCasinos([]);
                        setSelectedProvider([]);
                        setProviders([]);
                      }}
                      options={countries}
                      className="w-100"
                      inputId="country"
                    />
                    <label className="fs-6" htmlFor="country">
                      Country
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      optionLabel="operator_name"
                      optionValue="id"
                      filter
                      placeholder="Select Casino"
                      loading={casinoLoading}
                      disabled={selectedCountry.length === 0}
                      value={selectedCasino}
                      onChange={(e) => {
                        setSelectedCasino(e.value);
                        setSelectedProvider([]);
                        setProviders([]);
                      }}
                      options={casinos}
                      className="w-100"
                      inputId="casino"
                    />
                    <label className="fs-6" htmlFor="casino">
                      Casino
                    </label>
                  </FloatLabel>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      optionLabel="game_provider_name"
                      optionValue="provider_id"
                      filter
                      showClear
                      placeholder="Select Provider (Max 5)"
                      loading={providerLoading}
                      disabled={selectedCasino.length === 0}
                      value={selectedProvider}
                      onChange={(e) => {
                        if (e.value.length <= 5) {
                          setSelectedProvider(e.value);
                        } else {
                          toast.error("You can select up to 5 providers only.");
                        }
                      }}
                      options={providers}
                      className="w-100"
                      inputId="provider"
                    />
                    <label className="fs-6" htmlFor="provider">
                      Provider
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-4"></div>

                <div className="col-md-4 d-flex align-items-start gap-3">
                  <Button
                    type="button"
                    label="Apply"
                    loading={loading}
                    icon="pi pi-filter"
                    disabled={selectedProvider.length === 0}
                    onClick={getReportData}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />

                  <Button
                    type="button"
                    label="Reset"
                    icon="pi pi-refresh"
                    disabled={!selectedMarket}
                    onClick={() => {
                      setSelectedMarket([]);
                      setSelectedCountry([]);
                      setSelectedCasino([]);
                      setSelectedProvider([]);
                      setCountries([]);
                      setCasinos([]);
                      setProviders([]);
                      setData([]);
                    }}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
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
        ) : data.length > 0 ? (
          <div className="border border-secondary p-3 rounded-3 mt-3">
            <DataTable
              value={tableData}
              removableSort
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
              size="small"
              className="table-bordered p-component p-datatable custom-table small"
              scrollable
              sortIcon={sortIconTemplate}
              sortField="casino"
              sortOrder={1}
              onRowClick={(e) => {
                const row = e.data;

                // console.log("Row clicked:", row);
                // console.log("geography:", row.country);
                // console.log("operator_id:", row.casino_id);
                // console.log("provider_name:", row.provider_ids);

                navigate("/casino-view", {
                  state: {
                    geography: row.country,
                    operator_id: row.casino_id,
                    provider_name: row.provider_ids,
                  },
                });
              }}
            >
              <Column
                field="casino"
                sortable
                header={headerWithTooltip(
                  "Casino",
                  "The name of the game provider",
                  "casino"
                )}
              ></Column>

              <Column
                field="country"
                sortable
                header={headerWithTooltip(
                  "Country",
                  "The name of the game",
                  "country"
                )}
              ></Column>

              {Array.from(new Set(data.map((item) => item.provider_name))).map(
                (provider) => (
                  <Column
                    key={provider}
                    field={provider}
                    header={headerWithTooltip(
                      provider,
                      `Count for ${provider}`,
                      provider
                    )}
                    body={(rowData) => gameCountTemplate(rowData[provider])}
                  />
                )
              )}
            </DataTable>
          </div>
        ) : null}
      </div>
    </>
  );
}
