import React, { useRef, useState } from "react";
import Loader from "../../layouts/loader/Loader";
import { FaPlus } from "react-icons/fa6";
import CompassData from "../../services/CompassApi";
import { MdInfoOutline } from "react-icons/md";

import { Spin } from "antd";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Dropdown } from 'primereact/dropdown';
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import "../ui/Compass.css";


const CompassDataPage = ({
  setOpen,
  compassRead,
  loader,
  getCompassReadData,
}) => {
  const options4 = [5, 10, 15, 20];

  const dt = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const [operatorFilter, setOperatorFilter] = useState(null);
  const [gameFilter, setGameFilter] = useState(null);
  const toast = useRef(null);

  const filterData = () => {
    let filteredData = compassRead;

    if (operatorFilter) {
      filteredData = filteredData.filter(
        (item) => item.name === operatorFilter
      );
    }

    if (gameFilter) {
      filteredData = filteredData.filter(
        (item) => item.game_original_name === gameFilter
      );
    }

    return filteredData;
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) return;

    setDeleteLoader(true);
    const idsToDelete = selectedRows.map((row) => row.id);

    CompassData.compass_delete({ id: idsToDelete })
      .then((res) => {
        if (res?.success === true) {
          getCompassReadData();
          setSelectedRows([]);
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: res?.message || 'Deleted successfully',
            life: 3000
          });
          setOperatorFilter(null);
          setGameFilter(null);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Delete failed. Try again.',
          life: 3000
        });
      })
      .finally(() => setDeleteLoader(false));
  };


  const showFirstDrawer = () => setOpen(true);

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


  const StatusBodyTemplate = (row) => {
    const options = { year: "numeric", month: "short", day: "numeric" };

    const formattedStartDate = new Date(row?.start_date).toLocaleDateString("en-US", options);
    const formattedEndDate = new Date(row?.end_date).toLocaleDateString("en-US", options);

    return (
      <span>
        {formattedStartDate} to {formattedEndDate}
      </span>
    );
  };


  const statusActionTemplate = (rowData) => {
    let tagStyle = {
      fontSize: '12px',
      fontWeight: 500,
    };

    switch (rowData.scan_status) {
      case 1:
        tagStyle.backgroundColor = '#d4edda';
        tagStyle.color = '#155724';
        break;
      case 0:
        tagStyle.backgroundColor = '#f8d7da';
        tagStyle.color = '#721c24';
        break;
      default:
        tagStyle.backgroundColor = '#fff3cd';
        tagStyle.color = '#856404';
        break;
    }

    return (
      <Tag
        value={rowData.scan_status === 0 ? 'Outside Position': 'Within Position'}
        style={tagStyle}
        className="text-capitalize"
        rounded
      />
    );
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



  const filteredData = filterData();

  const operatorOption = Array.from(
    new Set(compassRead?.map((data) => data.name))
  ).map((name) => ({
    value: name,
    label: name,
  }));

  const gameOption = Array.from(
    new Set(compassRead?.map((data) => data.game_original_name))
  ).map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <>
      <Toast ref={toast} />
      {loader ? (
        <Loader />
      ) : (
        <div className="compass h-100">
          {compassRead?.length === 0 ? (
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-md-5">
                <div className="compass-text text-center">
                  <p>No games or casinos configured.</p>
                  <button
                    className="btn-filter"
                    onClick={showFirstDrawer}
                  >
                    Calibrate Casino or Game <FaPlus className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="compass">

              <div className="compass-data">
                <div className="d-flex flex-column gap-3 justify-content-between">
                  <div className="d-flex align-items-center justify-content-between pb-3">

                    <div>
                      <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                        Calibrate Compass
                      </h4>
                      <span className="text-black" style={{ fontSize: "1rem" }}>Track, add, delete all your games and operators</span>
                    </div>

                    <Button
                      className="btn-filter"
                      onClick={showFirstDrawer}
                      label="Calibrate Casino or Game"
                      icon="pi pi-plus" iconPos="right"
                    />
                  </div>

                  <div className="d-md-flex d-lg-flex justify-content-between">
                    <div className="d-flex gap-2">
                      <FloatLabel>
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          filter
                          showClear
                          inputId="operator"
                          style={{ minWidth: '200px' }}
                          value={operatorFilter}
                          options={operatorOption}
                          onChange={(option) =>
                            setOperatorFilter(option ? option.value : null)
                          }
                        />
                        <label className="fs-6" htmlFor="operator">Operator</label>
                      </FloatLabel>

                      <FloatLabel>
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          filter
                          showClear
                          inputId="game"
                          style={{ minWidth: '200px' }}
                          value={gameFilter}
                          options={gameOption}
                          onChange={(option) =>
                            setGameFilter(option ? option.value : null)
                          }
                        />
                        <label className="fs-6" htmlFor="game">Game</label>
                      </FloatLabel>
                    </div>

                    <Button
                      icon="pi pi-trash"
                      className="btn-filter"
                      onClick={selectedRows.length > 0 ? handleDelete : null}
                      disabled={selectedRows.length === 0}
                      tooltip="Delete Selected Rows"
                      tooltipOptions={{ position: 'left' }}
                      loading={deleteLoader}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-secondary p-3 rounded-3 mt-3">
                <h5 className="font-semibold pl-2">Latest Details</h5>
                <DataTable
                  ref={dt}
                  value={filteredData}
                  selection={selectedRows}
                  onSelectionChange={(e) => setSelectedRows(e.value)}
                  dataKey="id"
                  removableSort
                  scrollable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                  sortIcon={sortIconTemplate}
                  size="small"
                  className="table-bordered p-component p-datatable custom-calibrate-table small"

                >
                  <Column
                    selectionMode="multiple"
                    exportable={false}
                  ></Column>

                  <Column
                    field="name"
                    header={headerWithTooltip(
                      "Operator Name",
                      "Name of Operator",
                      "name"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="game_original_name"
                    header={headerWithTooltip(
                      "Game Name",
                      "Name of Game",
                      "game_name"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="game_provider"
                    header={headerWithTooltip(
                      "Game Provider",
                      "Name of Game Provider",
                      "game_provider"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="start_date"
                    header={headerWithTooltip(
                      "Tracking Timeline",
                      "Tracking Timeline",
                      "start_date"
                    )}
                    style={{ minWidth: "15rem" }}
                    body={StatusBodyTemplate}
                  ></Column>

                  <Column
                    field="scan_status"
                    header={headerWithTooltip(
                      "Status",
                      "Status",
                      "scan_status"
                    )}
                    sortable
                    style={{ minWidth: "8rem" }}
                    body={statusActionTemplate}

                  ></Column>

                  <Column
                    field="section_name"
                    header={headerWithTooltip(
                      "Section Name",
                      "Section Name",
                      "section_name"
                    )}
                    sortable
                    style={{ minWidth: "12rem" }}
                  ></Column>

                  <Column
                    field="min_position"
                    header={headerWithTooltip(
                      "Minimum Position",
                      "Minimum Position of Game",
                      "min_position"
                    )}
                    sortable
                    style={{ minWidth: "8rem" }}
                  ></Column>

                  <Column
                    field="max_position"
                    header={headerWithTooltip(
                      "Maximum Position",
                      "Maximum Position of Game",
                      "max_position"
                    )}
                    sortable
                    style={{ minWidth: "8rem" }}
                  ></Column>

                  <Column
                    field="geography"
                    header={headerWithTooltip(
                      "Country",
                      "Country",
                      "geography"
                    )}
                    sortable
                    style={{ minWidth: "8rem" }}
                  ></Column>

                  <Column
                    field="last_scan_date"
                    header={headerWithTooltip(
                      "Last Scanned Date",
                      "Last Scanned Date",
                      "last_scan_date"
                    )}
                    sortable
                    style={{ minWidth: "8rem" }}
                  ></Column>

                </DataTable>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CompassDataPage;
