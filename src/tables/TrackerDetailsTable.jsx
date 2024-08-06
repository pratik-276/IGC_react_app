import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../views/ui/ProductService";

const TrackerDetailsTable = ({ setShow, gameTracking }) => {
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const dt = useRef(null);

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
          placeholder="Select Game"
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

  const HandleShowDetails = () => {
    window.scrollTo(0, 0);
    setShow(true);
  };

  const actionBodyTemplate = () => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "24px" }}
        onClick={HandleShowDetails}
      />
    );
  };

  return (
    <>
      <div className="">
        <DataTable
          ref={dt}
          value={gameTracking}
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
          scrollable
          scrollHeight="400px"
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="operator_name"
            header="Casino "
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="game_name"
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
            field="avg_position"
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
    </>
  );
};

export default TrackerDetailsTable;
