import { FaCaretUp, FaCaretDown } from "react-icons/fa6";

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

const marketshareTemplate = (row) => {
  const share = mapToRange(row.normalized_share, 0, 100); // use normalized_share for graph
  let bg = "bg-info";

  if (parseFloat(row.normalized_share) < 3.0) {
    bg = "bg-danger";
  } else if (
    parseFloat(row.normalized_share) >= 3.0 &&
    parseFloat(row.normalized_share) < 6.0
  ) {
    bg = "bg-warning";
  } else if (parseFloat(row.normalized_share) >= 6.0) {
    bg = "bg-success";
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <div style={{ fontSize: "12px", flex: 0.3 }}>
        {parseFloat(row.market_share).toFixed(2)}%
      </div>
      <div style={{ flex: 1 }} className="progress">
        <div
          className={`progress-bar ${bg}`}
          role="progressbar"
          style={{ width: `${share}%` }}
          aria-valuenow={share}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

const changeTemplate = (row) => {
  let change = 0;
  if (row != null) {
    change = parseFloat(row?.change).toFixed(2);
  }

  return (
    <h6 className="font-normal text-secondary">
      {change < 0 ? (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "center",
            color: "#dc3545",
          }}
        >
          {change}% <FaCaretDown />
        </span>
      ) : (
        ""
      )}
      {change == 0 ? (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "center",
            color: "#dc9b00",
          }}
        >
          {change}%
        </span>
      ) : (
        ""
      )}
      {change > 0 ? (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "center",
            color: "#28a745",
          }}
        >
          {change}% <FaCaretUp />
        </span>
      ) : (
        ""
      )}
    </h6>
  );
};

function mapToRange(value, oldMin, oldMax) {
  if (value < oldMin || value > oldMax) {
    throw new Error("Value out of range");
  }

  const mappedValue = ((value - oldMin) / (oldMax - oldMin)) * 100;
  return mappedValue.toFixed(0);
}

export { marketshareTemplate, changeTemplate, sortIconTemplate };
