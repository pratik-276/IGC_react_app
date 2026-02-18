import { Chart } from "primereact/chart";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { CountryCodes } from "./CountryCode";

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

const gameTrendTemplate = (rowData) => {
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
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        intersect: false,
        mode: "index",
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
        height: "40px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
      }}
    >
      <Chart
        type="line"
        data={chartData}
        options={chartOptions}
        style={{ width: "160px", height: "30px" }}
      />
    </div>
  );
};

const countryBodyTemplate = (rowData) => {
  const matchedCountry = CountryCodes.find(
    (c) => c.name.toLowerCase() === rowData.country_name?.toLowerCase(),
  );

  const countryCode = matchedCountry?.code?.toLowerCase();
  return (
    <div className="flex align-items-center gap-2 ps-2">
      {countryCode ? (
        <img
          alt={rowData.country_name}
          src={`https://flagcdn.com/w40/${countryCode}.png`}
          style={{
            width: "24px",
            height: "18px",
            objectFit: "cover",
            borderRadius: "2px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
          }}
        />
      ) : (
        <img
          alt={rowData.country_name}
          src="flag_placeholder.png"
          style={{
            width: "24px",
            height: "18px",
            objectFit: "cover",
            borderRadius: "2px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
          }}
        />
      )}

      <span>{rowData.country_name}</span>
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        paddingRight: "4px",
      }}
    >
      <div
        style={{
          width: "40px",
          textAlign: "right",
          fontSize: "12px",
        }}
      >
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
            width: "65px",
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "right",
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
            width: "65px",
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "right",
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
            width: "65px",
            display: "inline-block",
            fontSize: "0.875em",
            borderRadius: "0.25em",
            fontWeight: "bold",
            textAlign: "right",
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

const textTemplate =
  (field, align = "left") =>
  (rowData) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            align === "right"
              ? "flex-end"
              : align === "center"
                ? "center"
                : "flex-start",
          width: "100%",
          paddingLeft: "14px",
        }}
      >
        {rowData[field] ?? "-"}
      </div>
    );
  };

function mapToRange(value, oldMin, oldMax) {
  if (value < oldMin || value > oldMax) {
    throw new Error("Value out of range");
  }

  const mappedValue = ((value - oldMin) / (oldMax - oldMin)) * 100;
  return mappedValue.toFixed(0);
}

export {
  countryBodyTemplate,
  gameTrendTemplate,
  marketshareTemplate,
  changeTemplate,
  textTemplate,
  sortIconTemplate,
};
