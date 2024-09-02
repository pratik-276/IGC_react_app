import React, { useEffect } from "react";
import anychart from "anychart";
import dayjs from "dayjs";

const GameSectionChangesChart = ({ trackingDetails }) => {

  const data =
    trackingDetails?.daywise_data?.map((item) => [
      dayjs(item.created_date).format("YYYY-MM-DD"),
      item.overall_game_position - 1,
      item.overall_game_position + 1,
    ]) || [];


    const ysection = trackingDetails?.daywise_data

  useEffect(() => {
    if (data?.length === 0) return;

    const chart = anychart.cartesian();

    const rangeBarSeries = chart.rangeBar(data);

    const xAxis = chart.xAxis();
    // xAxis.title("Date");

    xAxis.labels().format(function () {
      return dayjs(this.value).format("DD MMM YYYY");
    });

    xAxis.labels().rotation(-45);

    xAxis.labels().padding(0, 0, 5, 0);

    // chart.yAxis().title("Overall Game Position");

    chart.container("container");

    chart.draw();
  }, [data]);

  return (
    <>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Section Changes</h5>
      </div>
      <div id="container" style={{ width: "100%", height: "300px" }}></div>
    </>
  );
};

export default GameSectionChangesChart;
