import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./ProductService";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";

const TrackingTime = ["7days", "1 month", "3 months", "custom"];

const GameTracking = () => {
  const [products, setProducts] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);

  const dt = useRef(null);

  useEffect(() => {
    ProductService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="tracker-details-head">
        <h5 className="m-0">
          Tracker Details <MdInfoOutline className="ms-1" />
        </h5>
      </div>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Select Game."
        />
      </IconField>
    </div>
  );

  const AverageBodyTemplate = (row) => {
    return (
      <>
        <span style={{ color: "#8A92A6" }}>{row?.avgPosition}</span>
      </>
    );
  };

  const MinBodyTemplate = (row) => {
    return <span style={{ color: "#8A92A6" }}>{row?.minPosition}</span>;
  };

  const MaxBodyTemplate = (row) => {
    return <span style={{ color: "#8A92A6" }}>{row?.maxPosition}</span>;
  };

  const TrendBodyTemplate = (row) => {
    return <span className="trend-details-badge">{row?.trend}</span>;
  };

  const actionBodyTemplate = () => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "24px" }}
        onClick={() => setShow(true)}
      />
    );
  };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4>Overview Dashboard</h4>
              <span>
                View, Filter and analyse data as per your requirements with
                adaptive dashboard
              </span>
            </div>

            <div className="col-md-6">
              <div className="row justify-content-end">
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingTime}
                    placeholder="Status"
                    className="w-100"
                  />
                </div>
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingTime}
                    placeholder="All time "
                    className="w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {show === false && (
          <div className="tracker-details">
            <div className="tracker-details-body">
              <div className="">
                <DataTable
                  ref={dt}
                  value={products}
                  selection={selectedProducts}
                  onSelectionChange={(e) => setSelectedProducts(e.value)}
                  dataKey="id"
                  removableSort
                  paginator
                  className="tracker-details-table"
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                  globalFilter={globalFilter}
                  header={header}
                  loading={loading}
                  scrollable
                  scrollHeight="400px"
                >
                  <Column selectionMode="multiple" exportable={false}></Column>
                  <Column
                    field="casino"
                    header="Casino"
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>
                  <Column
                    field="game"
                    header="Game"
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    style={{ minWidth: "10rem" }}
                  ></Column>
                  <Column
                    field="avgPosition"
                    header="Avg.Position"
                    sortable
                    style={{ minWidth: "10rem" }}
                    body={AverageBodyTemplate}
                    className="text-center "
                  ></Column>
                  <Column
                    field="minPosition"
                    header="Min Position"
                    sortable
                    style={{ minWidth: "10rem" }}
                    body={MinBodyTemplate}
                    className="text-center"
                  ></Column>
                  <Column
                    field="maxPosition"
                    header="Max Position"
                    sortable
                    style={{ minWidth: "10rem" }}
                    body={MaxBodyTemplate}
                    className="text-center"
                  ></Column>
                  <Column
                    field="trend"
                    header="Trend"
                    sortable
                    style={{ minWidth: "10rem" }}
                    body={TrendBodyTemplate}
                  ></Column>
                  <Column
                    field=""
                    header=""
                    className="d-flex align-items-center"
                    body={actionBodyTemplate}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        )}
        {show === true && (
          <div className="tracker-details">
            <div className="tracker-details-head">
              <h5 className="m-0">Tracker Details</h5>
            </div>
            <div className="row pt-3">
              <div className="col-md-4">
                <div className="position-view-box">
                  <div className="d-flex justify-content-between align-items-center position-view-box-head">
                    <h5>Latest Position</h5>
                    <div className="d-flex align-items-center">
                      <h4>56</h4> <span>(12 July 2023)</span>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>New</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>3</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>6</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="position-view-box best_position_box">
                  <div className="d-flex justify-content-between align-items-center position-view-box-head">
                    <h5>Best Position</h5>
                    <div className="d-flex align-items-center">
                      <h4>56</h4> <span>(12 July 2023)</span>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>New</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>3</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>6</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="position-view-box">
                  <div className="d-flex justify-content-between align-items-center position-view-box-head">
                    <h5>Worst Position</h5>
                    <div className="d-flex align-items-center">
                      <h4>56</h4> <span>(12 July 2023)</span>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>New</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>3</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-view-box-bottom">
                        <h4>6</h4>
                        <span>Section Name</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameTracking;
