import { Chart } from "primereact/chart";
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

export const gameTrendTemplate = (rowData) => {
  const trend = rowData.game_count_trend;

  if (!trend || !trend.values) return <span>-</span>;

  const chartData = {
    labels: trend.labels,
    datasets: [
      {
        data: trend.values,
        fill: false,
        borderColor: "#6366F1",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        intersect: false,
        mode: "index",
        backgroundColor: "#111827",
        borderColor: "#6366F1",
        borderWidth: 1,
        padding: 8,
        cornerRadius: 6,
        titleColor: "#9CA3AF",
        bodyColor: "#F9FAFB",
        titleFont: { size: 10, weight: "500" },
        bodyFont: { size: 12, weight: "600" },
        callbacks: {
          title: () => null,
          label: (item) => `${item.label} : ${item.raw}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "30px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Chart
        type="line"
        data={chartData}
        options={chartOptions}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
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
