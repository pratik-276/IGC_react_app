import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
} from "recharts";
import { Spin } from "antd";

const formatMonth = (monthString) => {
    const date = new Date(monthString + "-01");
    return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const GlobalCoverageTrendChart = ({ data, loading }) => {

    return (
        loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Spin size="default" />
            </div>
        ) : (
            !data || data.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                    No data available
                </div>
            ) : (
                <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={formatMonth}
                                tick={{ fontSize: 12 }}
                                axisLine={true}
                                tickLine={true}
                            />
                            <YAxis
                                label={{
                                    value: "% Coverage",
                                    angle: -90,
                                    position: "insideLeft",
                                    offset: 10,
                                    fontSize: 12,
                                }}
                                domain={[0, "auto"]}
                                tick={{ fontSize: 12 }}
                                axisLine={true}
                                tickLine={true}
                            />
                            <Tooltip
                                formatter={(value) => `${value.toFixed(2)}%`}
                                labelFormatter={(label) => formatMonth(label)}
                                contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc", color: "#000" }}
                                itemStyle={{ color: "#000" }}
                                labelStyle={{ color: "#000", fontWeight: 500 }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Line
                                type="linear"
                                dataKey="game_coverage"
                                stroke="#FFA500"
                                strokeWidth={2}
                                dot={true}
                                name="Game Coverage"
                            />
                            <Line
                                type="linear"
                                dataKey="provider_benchmark"
                                stroke="#ff2600"
                                strokeWidth={2}
                                dot={true}
                                name="Provider Benchmark"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )
        )
    );
};

export default GlobalCoverageTrendChart;
