import React, { useRef, useState } from "react";
import Loader from "../../layouts/loader/Loader";
import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import CompassData from "../../services/CompassApi";
import { useNavigate } from "react-router-dom";

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
import { Dialog } from "primereact/dialog";

import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import "../ui/Compass.css";


const RequestedCasinoData = ({
  casinoRequestData,
  setRequestCasinoModalVisible,
  loader,
  getCasinoRequestData,
}) => {
  const dt = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);
  

  const [operatorFilter, setOperatorFilter] = useState(null);
  const [geoFilter, setGeoFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const toast = useRef(null);

  const filterData = () => {
    let filteredData = casinoRequestData;

    if (operatorFilter) {
      filteredData = filteredData.filter(
        (item) => item.operator_name === operatorFilter
      );
    }

    if (geoFilter) {
      filteredData = filteredData.filter(
        (item) => item.operator_country === geoFilter
      );
    }

    return filteredData;
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) return;

    setDeleteLoader(true);
    const idsToDelete = selectedRows.map((row) => row.id);

    CompassData.delete_casinos_request({ request_id: idsToDelete })
      .then((res) => {
        if (res?.success === true) {
          getCasinoRequestData();
          setSelectedRows([]);
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: res?.message || 'Deleted successfully',
            life: 3000
          });
          setOperatorFilter(null);
          setGeoFilter(null);
          setStatusFilter(null);
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err,
          life: 3000
        });
      })
      .finally(() => setDeleteLoader(false));
  };


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

  const statusActionTemplate = (rowData) => {
      let tagStyle = {
        fontSize: '12px',
        fontWeight: 500,
      };

      switch (rowData.status) {
        case 'Pending':
          tagStyle.backgroundColor = '#fff3cd';
        tagStyle.color = '#856404';
          break;
        case 'Configuring':
        tagStyle.backgroundColor = '#f8d7da';
        tagStyle.color = '#721c24';
          break;
        case 'Deployed':
          tagStyle.backgroundColor = '#d4edda';
          tagStyle.color = '#155724';
          break;
        default:
          tagStyle.backgroundColor = '#fff3cd';
        tagStyle.color = '#856404';
          break;
      }

      return (
        <Tag
          value={rowData.status}
          style={tagStyle}
          className="text-capitalize"
          rounded
        />
      );
  };


  const CreatedOnTemplate = (row) => {
    const options = { year: "numeric", month: "short", day: "numeric" };

    const createdDate = new Date(row?.created_date).toLocaleDateString("en-US", options);

    return (
      <span>
        {createdDate}
      </span>
    );
  }


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
    new Set(casinoRequestData?.map((data) => data.operator_name))
  ).map((operator_name) => ({
    value: operator_name,
    label: operator_name,
  }));

  const geoOption = Array.from(
    new Set(casinoRequestData?.map((data) => data.operator_country))
  ).map((operator_country) => ({
    value: operator_country,
    label: operator_country,
  }));

  
  const statusOption = Array.from(
    new Set(casinoRequestData?.map((data) => data.status))
  ).map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <>
      <Toast ref={toast} />
      {loader ? (
        <Loader />
      ) : (
        <div className="compass h-100">
          {casinoRequestData?.length === 0 ? (
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-md-5">
                <div className="compass-text text-center">
                  <p>No casino requests found</p>
                  <button
                    className="btn-filter"
                    //onClick={showFirstDrawer}
                    onClick={() => setRequestCasinoModalVisible(true)}
                  >
                    Request New Casino <FaPlus className="ms-2" />
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
                        Requested Casinos
                      </h4>
                      <span className="text-black" style={{ fontSize: "1rem" }}>Track, add, delete all your casino requests</span>
                    </div>

                    <Button
                      className="btn-filter"
                      onClick={() => setRequestCasinoModalVisible(true)}
                      label="Request New Casino"
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
                        <label className="fs-6" htmlFor="operator">Casino</label>
                      </FloatLabel>

                      <FloatLabel>
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          filter
                          showClear
                          inputId="game"
                          style={{ minWidth: '200px' }}
                          value={geoFilter}
                          options={geoOption}
                          onChange={(option) =>
                            setGeoFilter(option ? option.value : null)
                          }
                        />
                        <label className="fs-6" htmlFor="game">Country</label>
                      </FloatLabel>

                      <FloatLabel>
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          filter
                          showClear
                          inputId="status"
                          style={{ minWidth: '200px' }}
                          value={statusFilter}
                          options={statusOption}
                          onChange={(option) =>
                            setStatusFilter(option ? option.value : null)
                          }
                        />
                        <label className="fs-6" htmlFor="status">Status</label>
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
                <h5 className="font-semibold pl-2">Details</h5>
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
                    field="operator_name"
                    header={headerWithTooltip(
                      "Casino Name",
                      "Name of Casino",
                      "operator_name"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="operator_country"
                    header={headerWithTooltip(
                      "Country",
                      "Country for which the casino is to be configured",
                      "operator_country"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="status"
                    header={headerWithTooltip(
                      "Status",
                      "Current status of the requested casino",
                      "status"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                    body={statusActionTemplate}
                  ></Column>
                  <Column
                    field="operator_url"
                    header={headerWithTooltip(
                      "URL",
                      "URL configured for this casino",
                      "operator_url"
                    )}
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>

                  <Column
                    field="created_date"
                    header={headerWithTooltip(
                      "Created On",
                      "Time when casino request was created",
                      "created_date"
                    )}
                    style={{ minWisdth: "10rem" }}
                    sortable
                    body={CreatedOnTemplate}
                  ></Column>

                  {/* <Column
                    field="details"
                    header={headerWithTooltip(
                      "Details",
                      "Check historical movement of the game",
                      "details"
                    )}
                    className="text-center"
                    body={actionBodyTemplate}
                  ></Column> */}

                </DataTable>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RequestedCasinoData;
