import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Text,
} from "recharts";
import dayjs from "dayjs";

const CompassGraph = ({ graphDetails = [], min_position, max_position }) => {
    if (!graphDetails || graphDetails.length === 0) {
        return <p className="text-center mt-3">No graph data available</p>;
    }

    const chartData = graphDetails.map((d) => ({
        date: dayjs(d.created_date).format("MMM DD"),
        game_position: d.game_position,
    }));

    const minPos =
        min_position ?? Math.min(...chartData.map((item) => item.game_position));
    const maxPos =
        max_position ?? Math.max(...chartData.map((item) => item.game_position));

    const CustomTick = ({ x, y, payload }) => (
        <Text x={x} y={y} dy={15} textAnchor="middle" fill="#666" fontSize={12}>
            {payload?.value}
        </Text>
    );

    return (
        <div style={{ width: "100%", height: 250, marginTop: "1rem" }}>
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                    <CartesianGrid strokeDasharray="5 5" vertical={false} />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tick={<CustomTick />}
                        interval={0}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        domain={[0, maxPos]}
                    />

                    <Tooltip
                        formatter={(value) => [`${value}`, "Position"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />

                    <Area
                        type="linear"
                        dataKey="game_position"
                        stroke="#5865F2"
                        fill="rgba(88, 101, 242, 0.1)"
                        strokeWidth={2}
                    />

                    <ReferenceLine
                        y={minPos}
                        stroke="#00FFFF"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ value: "Min", position: "insideBottomLeft" }}
                    />
                    <ReferenceLine
                        y={maxPos}
                        stroke="#DA70D6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ value: "Max", position: "insideTopLeft" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CompassGraph;
