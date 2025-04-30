import React, { useEffect, useState } from "react";
import CompetitorData from "../../services/Competitor";

import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";

import { MdInfoOutline } from "react-icons/md";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./CompetitorDashboardMod.css";
import { Spin } from "antd";

const CompetitorDashboardMod = () => {
  const user_company = localStorage.getItem("user_company");
  const [siteData, setSiteData] = useState([]);
  const [siteId, setSiteId] = useState(null);

  const [providerData, setProviderData] = useState([]);
  const [providersName, setProvidersName] = useState(null);

  const [gameData, setGameData] = useState([]);
  const [gamesName, setGamesName] = useState(null);

  const [data, setData] = useState([]);

  const [loader, setLoader] = useState(false);
  const [siteDataLoader, setSiteDataLoader] = useState(true);
  const [providerDataLoader, setProviderDataLoader] = useState(false);
  const [gameDataLoader, setGameDataLoader] = useState(false);

  const [uniquePositions, setUniquePositions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const siteDropdownData = () => {
    setSiteDataLoader(true);

    const payload = {
      game_provider: user_company,
    };

    CompetitorData.get_operator_sites_list(payload)
      .then((res) => {
        if (res?.success === true) {
          setSiteData(res?.data || null);
          setSiteDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSiteDataLoader(false);
      });
  };

  const providerDropdownData = () => {
    setProviderDataLoader(true);

    const payload = {
      operator_site_id: siteId,
    };

    CompetitorData.get_providers_by_site(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          const formatted = (res.success.data || [])
            .map((item) => item.provider_name)
            .filter(Boolean);
          setProviderData(formatted);
          setProviderDataLoader(false);
        }
      })
      .catch(console.log)
      .finally(() => setProviderDataLoader(false));
  };

  const gameDropdownData = () => {
    setGameDataLoader(true);

    const payload = {
      operator_site_id: siteId,
    };

    CompetitorData.get_games_by_site(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          const formatted = (res.success.data || [])
            .map((item) => item.game_name)
            .filter(Boolean);
          setGameData(formatted);
          setGameDataLoader(false);
        }
      })
      .catch(console.log)
      .finally(() => setGameDataLoader(false));
  };

  const getCompitatorData = () => {
    setLoader(true);

    const payload = {
      operator_site_id: siteId,
      ...(providersName?.length ? { provider_name: providersName } : {}),
      ...(gamesName?.length ? { game_name: gamesName } : {}),
    };

    CompetitorData.get_competitor_data(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          setData(res.success.data || null);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    siteDropdownData();
  }, []);

  useEffect(() => {
    setProvidersName(null);
    setGamesName(null);
    providerDropdownData();
    gameDropdownData();
  }, [siteId]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Step 1: Extract unique sorted game positions
    const positions = [
      ...new Set(data.map((item) => item.game_position.toFixed(1))),
    ].sort((a, b) => parseFloat(a) - parseFloat(b));
    setUniquePositions(positions);

    // Step 2: Group by section_title
    const sectionMap = {};

    data.forEach((item) => {
      const section = item.section_title;
      const pos = item.game_position.toFixed(1);
      const displayText = item.game_name;

      if (!sectionMap[section]) {
        sectionMap[section] = { section_title: section };
      }

      sectionMap[section][pos] = displayText;
    });

    // Step 3: Convert to array and sort alphabetically by section_title
    const sortedTableData = Object.values(sectionMap).sort((a, b) =>
      a.section_title.localeCompare(b.section_title)
    );

    setTableData(sortedTableData);
  }, [data]);

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

  const headerWithoutTooltip = (headerText) => (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ width: "100%" }}
    >
      <div className="d-flex align-items-center m-1">
        <h5 style={{ margin: 0 }}>{headerText}</h5>
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

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="col-md-5 col-lg-5">
              <h3 className="m-md-0">Competitor Dashboard</h3>
              <span>View details related to all the competitors</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Dropdown
                optionLabel="label"
                optionValue="value"
                filter
                placeholder="Select Site URL"
                loading={siteDataLoader}
                value={siteId}
                onChange={(e) => setSiteId(e.value)}
                options={siteData}
                itemTemplate={(option) => (
                  <div title={option.label}>{option.label}</div>
                )}
                className="flex-1"
                style={{ maxWidth: "300px" }}
              />

              <MultiSelect
                value={providersName}
                onChange={(e) => setProvidersName(e.value)}
                options={providerData}
                loading={providerDataLoader}
                placeholder="Select Providers"
                filter
                disabled={!siteId}
                maxSelectedLabels={1}
                className="flex-1"
              />

              <MultiSelect
                value={gamesName}
                onChange={(e) => setGamesName(e.value)}
                options={gameData}
                loading={gameDataLoader}
                placeholder="Select Games"
                filter
                disabled={!siteId}
                maxSelectedLabels={1}
                className="flex-1"
              />

              <Button
                type="button"
                label="Apply"
                loading={loader}
                icon="pi pi-filter"
                disabled={!siteId}
                onClick={getCompitatorData}
                className="btn-filter"
                style={{ minWidth: "100px" }}
              />

              <Button
                type="button"
                label="Reset"
                icon="pi pi-refresh"
                disabled={!siteId}
                onClick={() => {
                  setSiteId(null);
                  setProvidersName(null);
                  setGamesName(null);
                }}
                className="btn-filter"
                style={{ minWidth: "100px" }}
              />
            </div>
          </div>
        </div>

        {data?.length > 0 &&
          (loader ? (
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
              <div className="border border-secondary p-3 rounded-3 mt-3">
                <h5 className="font-semibold pl-2">Latest Details</h5>
                <DataTable
                  value={tableData}
                  scrollable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                  sortIcon={sortIconTemplate}
                  size="small"
                  className="table-bordered p-component p-datatable custom-competitor-table small"
                >
                  <Column
                    frozen
                    header={headerWithTooltip(
                      "Section Title",
                      "Name of Section Title",
                      "section_title"
                    )}
                    field="section_title"
                    sortable
                    body={(rowData) => <strong>{rowData.section_title}</strong>}
                  />

                  {uniquePositions.map((pos) => (
                    <Column
                      key={pos}
                      field={pos}
                      //header={pos}
                      header={headerWithoutTooltip(pos)}
                      style={{ minWidth: "120px", whiteSpace: "normal" }}
                    />
                  ))}
                </DataTable>
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default CompetitorDashboardMod;
