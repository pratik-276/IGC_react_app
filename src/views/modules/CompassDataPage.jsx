import React, { useRef, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Loader from "../../layouts/loader/Loader";
import { FaChartLine, FaPlus } from "react-icons/fa6";
import { CiPause1 } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "react-bootstrap";
import Select from "react-select";

const CompassDataPage = ({
  setOpen,
  compassRead,
  loader,
  getCompassReadData,
}) => {
  const options = ["Pause", "In Progress", "Not Available"];
  const options3 = [5, 10, 15, 20];
  const options4 = [5, 10, 15, 20];

  const dt = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  const [operatorFilter, setOperatorFilter] = useState(null);
  const [gameFilter, setGameFilter] = useState(null);

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
          toast.success(res?.message);
          setPage(0);
          setOperatorFilter(null);
          setGameFilter(null);
        }
      })
      .catch(console.error)
      .finally(() => setDeleteLoader(false));
  };

  const showFirstDrawer = () => setOpen(true);

  const createdBodyTemplate = () => <span className="text-center">-</span>;

  const StatusBodyTemplate = (row) => {
    const startDate = new Date(row?.start_date);
    const formattedStartDate = startDate
      ?.toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    const endDate = new Date(row?.end_date);
    const formattedEndDate = endDate
      ?.toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    return (
      <h5 style={{ color: "#8A92A6" }}>
        {formattedStartDate} to {formattedEndDate}
      </h5>
    );
  };

  const operatorNameBodyTemplate = (row) => {
    return (
      <h5 style={{ color: "#222222", fontWeight: "500", fontSize: "15px" }}>
        {row?.name}
      </h5>
    );
  };

  const gameNameBodyTemplate = (row) => {
    return (
      <h5 style={{ color: "#222222", fontWeight: "500", fontSize: "15px" }}>
        {row?.game_original_name}
      </h5>
    );
  };

  const statusActionTemplate = () => (
    <td className="text-center">
      <span className="action-btn"></span>
    </td>
  );

  const filteredData = filterData();
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / rows);
  const paginatedData = filteredData.slice(page * rows, (page + 1) * rows);

  const dateTimePeriod = [
    {
      id: "7 days",
      date: "7 days",
    },
    {
      id: "1 month",
      date: "1 month",
    },
    {
      id: "3 month",
      date: "3 month",
    },
    {
      id: "custom",
      date: "custom",
    },
  ];

  const statusPeriod = [
    {
      id: "Pause",
      status: "Pause",
    },
    {
      id: "In Progress",
      status: "In Progress",
    },
    {
      id: "Not Available",
      status: "Not Available",
    },
  ];

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

  const timeOption = dateTimePeriod?.map((data) => ({
    value: data.id,
    label: data.date,
  }));

  const statusOption = statusPeriod?.map((data) => ({
    value: data.id,
    label: data.status,
  }));

  const casinoFilterChange = (option) => {
    setOperatorFilter(option ? option.value : null);
  };

  return (
    <>
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
                    className="btn game_add_btn"
                    onClick={showFirstDrawer}
                  >
                    Calibrate Casino or Game <FaPlus className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="compass-data">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h3>Calibrate Compass</h3>
                  <span>Track, add, delete all your games and operators</span>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    className="btn game_add_btn"
                    onClick={showFirstDrawer}
                  >
                    Calibrate Casino or Game <FaPlus className="ms-2" />
                  </button>
                </div>
              </div>
              <div className="compass-data-border mb-3">
                <span></span>
              </div>
              <div className="d-flex justify-content-between">
                <div className="calibrate-dropdown">
                  <div className="all-time-status-dropdown">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={false}
                      name="trackingstatus"
                      options={statusOption}
                      placeholder="Status"
                      onChange={casinoFilterChange}
                    />
                  </div>
                  <div className="all-time-status-dropdown">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={false}
                      name="trackingstatus"
                      options={operatorOption}
                      placeholder="Operator"
                      onChange={casinoFilterChange}
                    />
                  </div>
                  <div className="all-time-status-dropdown">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={false}
                      name="trackingstatus"
                      options={gameOption}
                      placeholder="Game"
                      onChange={(option) =>
                        setGameFilter(option ? option.value : null)
                      }
                    />
                  </div>
                  <div className="all-time-status-dropdown">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={false}
                      name="trackingstatus"
                      options={timeOption}
                      placeholder="All Time"
                      onChange={(option) =>
                        setGameFilter(option ? option.value : null)
                      }
                    />
                  </div>
                </div>
                <div className="compass-right-icon">
                  <div className="compass-search">
                    <FaChartLine />
                  </div>
                  {deleteLoader ? (
                    <div className="compass-search">
                      <Spin />
                    </div>
                  ) : (
                    <div
                      className="compass-search"
                      onClick={selectedRows.length > 0 ? handleDelete : null}
                      style={{
                        cursor:
                          selectedRows.length > 0 ? "pointer" : "not-allowed",
                        opacity: selectedRows.length > 0 ? 1 : 0.5,
                      }}
                    >
                      <i className="bi bi-trash3"></i>
                    </div>
                  )}
                  <div className="compass-search">
                    <CiPause1 />
                  </div>
                  <div className="compass-search">
                    <IoMdSearch />
                  </div>
                </div>
              </div>

              {/* Tracker Details  Data Table */}
              <div className="tracker-details mt-3 p-0">
                <div className="tracker-details-body calibrate-compass-table">
                  <DataTable
                    ref={dt}
                    value={paginatedData}
                    selection={selectedRows}
                    onSelectionChange={(e) => setSelectedRows(e.value)}
                    dataKey="id"
                    removableSort
                    paginator={false}
                    className="tracker-details-table"
                    scrollable
                    scrollHeight="400px"
                  >
                    <Column
                      selectionMode="multiple"
                      exportable={false}
                    ></Column>
                    <Column
                      field="operator_name"
                      header="Created On"
                      body={createdBodyTemplate}
                    ></Column>
                    <Column
                      field="name"
                      header="Operator Name"
                      style={{ minWidth: "15rem" }}
                      body={operatorNameBodyTemplate}
                    ></Column>
                    <Column
                      field="game_original_name"
                      header="Game Name"
                      style={{ minWidth: "15rem" }}
                      body={gameNameBodyTemplate}
                    ></Column>
                    <Column
                      field="start_date"
                      header="Tracking Timeline"
                      body={StatusBodyTemplate}
                    ></Column>
                    <Column
                      field="credit"
                      header="Credits consumed"
                      body={createdBodyTemplate}
                    ></Column>
                    <Column
                      field="status"
                      header="Status"
                      body={statusActionTemplate}
                    ></Column>
                  </DataTable>
                </div>
              </div>

              {/* Tracker Details Pagination of Data Table */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span>
                    Showing {page * rows + 1} -
                    {Math.min((page + 1) * rows, totalRecords)} out of &nbsp;
                    {totalRecords}
                  </span>
                </div>
                <div>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center orderlist_pagination">
                      <Pagination className="custom-pagination">
                        <Pagination.Prev
                          disabled={page === 0}
                          onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 0))
                          }
                        >
                          <MdKeyboardArrowLeft className="me-2" /> Prev
                        </Pagination.Prev>

                        {[...Array(totalPages).keys()].map((num) => {
                          if (
                            num === 0 ||
                            num === totalPages - 1 ||
                            (num >= page - 1 && num <= page + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={num}
                                onClick={() => setPage(num)}
                                active={num === page}
                                className="custom-pagination-item"
                              >
                                {num + 1}
                              </Pagination.Item>
                            );
                          } else if (
                            (num === 1 && page > 4) ||
                            (num === totalPages - 2 && page < totalPages - 3)
                          ) {
                            return (
                              <Pagination.Item
                                key={num}
                                disabled
                                className="custom-pagination-item"
                              >
                                ...
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}

                        <Pagination.Next
                          disabled={page + 1 === totalPages}
                          onClick={() =>
                            setPage((prev) =>
                              Math.min(prev + 1, totalPages - 1)
                            )
                          }
                        >
                          Next <MdKeyboardArrowRight className="ms-2" />
                        </Pagination.Next>
                      </Pagination>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center pagination_per_select">
                  <span className="me-1">Items per Page: </span>
                  <Dropdown
                    options={options4.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    onChange={(e) => setRows(Number(e.value))}
                    value={rows?.toString()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CompassDataPage;
