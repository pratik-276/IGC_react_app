import { useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { sortIconTemplate } from "./tableTemplates";

export default function ReusableLazyTable({
  data,
  loading,
  columns,
  scrollHeight = "600px",
  hasMore,
  onLazyLoad,
  onSort,
  sortField,
  sortOrder,
  onRowClick,
}) {
  const wrapperRef = useRef(null);
  const lazyRef = useRef(onLazyLoad);
  lazyRef.current = onLazyLoad;

  useEffect(() => {
    const wrapper = wrapperRef.current?.querySelector(".p-datatable-wrapper");
    if (!wrapper) return;

    const handleScroll = (e) => {
      if (!hasMore || loading) return;

      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        lazyRef.current?.();
      }
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const wrapper = wrapperRef.current?.querySelector(".p-datatable-wrapper");
    if (!wrapper) return;

    const hasScroll = wrapper.scrollHeight > wrapper.clientHeight;

    if (!hasScroll) {
      onLazyLoad?.();
    }
  }, [data, hasMore, loading]);

  return (
    <div ref={wrapperRef}>
      <DataTable
        value={data}
        scrollable
        scrollHeight={scrollHeight}
        sortIcon={sortIconTemplate}
        sortField={sortField}
        sortOrder={sortOrder === "asc" ? 1 : -1}
        onSort={(e) =>
          onSort?.(e.sortField, e.sortOrder === 1 ? "asc" : "desc")
        }
        onRowClick={onRowClick}
        className="table-bordered p-datatable custom-table small "
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            style={col.style}
            body={(row) =>
              row.__skeleton ? (
                <Skeleton width="80%" height="1rem" />
              ) : col.body ? (
                col.body(row)
              ) : (
                row[col.field]
              )
            }
          />
        ))}
      </DataTable>
    </div>
  );
}
