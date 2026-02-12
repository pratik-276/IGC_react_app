import React from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { BreadCrumb } from "primereact/breadcrumb";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FaFilter } from "react-icons/fa6";

const PageHeader = ({
  title,
  subtitle,
  breadcrumb,

  searchValue,
  onSearchChange,

  onDownload,
  onToggleFilter,
  onToggleChat,

  isPlanExpired = false,

  features = {
    search: true,
    filters: true,
    download: true,
    chat: true,
  },
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      {/* LEFT SECTION */}
      <div>
        <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
          {title}
        </h4>

        {/* Breadcrumb OR Subtitle */}
        {breadcrumb ? (
          <div className="mt-1">
            <BreadCrumb model={breadcrumb} />
          </div>
        ) : subtitle ? (
          <span>{subtitle}</span>
        ) : null}
      </div>

      {/* RIGHT SECTION */}
      <div className="d-flex align-items-center justify-content-between">
        {isPlanExpired && features.download ? (
          <>
            <span
              className="text-muted"
              id="download-disabled"
              style={{
                cursor: "not-allowed",
                textDecoration: "underline dotted",
              }}
            >
              Download Report
            </span>
            <Tooltip
              target="#download-disabled"
              content="Upgrade your plan to download the report"
              position="top"
            />
          </>
        ) : (
          <div className="d-flex align-items-center gap-1 mb-2">
            {/* SEARCH */}
            {features.search && (
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                  placeholder="Search..."
                  className="w-12rem"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </IconField>
            )}

            {/* FILTERS */}
            {features.filters && (
              <Button
                onClick={onToggleFilter}
                className="d-flex align-items-center gap-1"
                style={{ backgroundColor: "#392f6c", border: "none" }}
              >
                <FaFilter /> <span>Filters</span>
              </Button>
            )}

            {/* DOWNLOAD */}
            {features.download && (
              <Button
                icon="pi pi-download"
                tooltip="Download Report"
                tooltipOptions={{ position: "top" }}
                rounded
                onClick={onDownload}
                style={{ backgroundColor: "#392f6c", border: "none" }}
              />
            )}

            {/* CHAT */}
            {features.chat && (
              <Button
                icon="pi pi-comments"
                label="Insights"
                onClick={onToggleChat}
                style={{ backgroundColor: "#392f6c", border: "none" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
