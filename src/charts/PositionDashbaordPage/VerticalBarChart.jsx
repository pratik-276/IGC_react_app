import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Spin } from "antd";

export default function VerticalBarChart({
    data,
    loading,
    xKey,   // label/category
    yKey,   // value
    xLabel,
    barColor = "#8884d8",
    height = 350,
    highlightKey,
    highlightValues = [],
    onBarClick
}) {
    const isHighlighted = (val) => {
        if (!highlightValues || highlightValues.length === 0) return true;
        return highlightValues.some(
            hv => val.toLowerCase().includes(hv.toLowerCase())
        );
    };

    return loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
            <Spin size="default" />
        </div>
    ) : !data || data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
            No data available
        </div>
    ) : (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey={xKey}
                        tick={{ fontSize: 11 }}
                        width={100}
                    // interval={0}
                    />
                    <Tooltip />
                    <Bar dataKey={yKey} name={xLabel}>
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                cursor="pointer"
                                onClick={() => {
                                    if (typeof onBarClick === "function") {
                                        onBarClick(entry);
                                    }
                                }}
                                fill={
                                    isHighlighted(entry[highlightKey])
                                        ? barColor
                                        : "#e8d0f7"
                                }
                            />

                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
