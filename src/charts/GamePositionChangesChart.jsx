import React, { useEffect, useRef } from "react";
// import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import dayjs from "dayjs";
import Chart from "react-apexcharts";


// Chart.register(...registerables);
// Chart.register(annotationPlugin);

const MyChart = ({ trackingDetails }) => {
  console.log(trackingDetails)

  const sections = [... new Set(trackingDetails?.daywise_data.map(t => t.section_name))]
  const dates = [...new Set(trackingDetails?.daywise_data.map(t => t.created_date))]

  const chartData = sections.map(s => {
    const sectionWiseData = trackingDetails?.daywise_data.filter(d => d.section_name == s)

    const dateWiseData = [
      ... dates.map(d => sectionWiseData
        .filter(s => s.created_date == d)
        .map(s => s.section_position)
        .at(0) ?? ''
      )
    ]
  
    return {
      name: s,
      data: dateWiseData
    }
  })
  chartData.push({
    name: 'Date',
    data: dates
  })

  const chartRef = useRef(null);

  // useEffect(() => {
  //   let xValue = 1;
  //   const data = trackingDetails?.daywise_data.map(
  //     ({ created_date, section_position, section_name, game_position }) => ({
  //       x_label: dayjs(created_date).format("MMM DD"),
  //       x: xValue++,
  //       width: 1,
  //       height: 1,
  //       y: section_position,
  //       y_label: section_name + " - " + section_position,
  //       label: game_position,
  //     })
  //   );
  //   console.log(data);

  //   const uniqueYLabels = [...new Set(data.map((o) => o.y_label))];

  //   const rectangles = data.map((o) => ({
  //     type: "box",
  //     backgroundColor: "rgba(0, 0, 254, 0.4)",
  //     xMin: o.x - 2,
  //     yMin: o.y - 2,
  //     xMax: o.x + o.width - 2,
  //     yMax: o.y + o.height - 2,
  //   }));

  //   const labels = data.map((o) => ({
  //     type: "label",
  //     content: o.label,
  //     color: "white",
  //     font: {
  //       size: 16,
  //     },
  //     position: {
  //       x: "center",
  //       y: "center",
  //     },
  //     xValue: o.x + o.width / 2 - 2,
  //     yValue: o.y + o.height / 2 - 2,
  //   }));

  //   const ctx = chartRef.current.getContext("2d");
  //   new Chart(ctx, {
  //     type: "scatter",
  //     options: {
  //       plugins: {
  //         annotation: {
  //           annotations: rectangles.concat(labels),
  //         },
  //       },
  //       scales: {
  //         x: {
  //           position: "bottom",
  //           reverse: true,
  //           suggestedMin: 0,
  //           ticks: {
  //             stepSize: 1,
  //             callback: (value, index) => {
  //               const customXLabels = data.map((item) => item.x_label);
  //               return customXLabels[value] || "";
  //             },
  //           },
  //         },
  //         y: {
  //           suggestedMin: 1,
  //           reverse: true,
  //           ticks: {
  //             stepSize: 1,
  //             callback: (value) => {
  //               return uniqueYLabels[value] || "";
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return () => {
  //     if (chartRef.current) {
  //       Chart.getChart(chartRef.current).destroy();
  //     }
  //   };
  // }, []);

  return (
    <div>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Position Changes</h5>
      </div>
      {/* <Chart 
        options={{
          chart: {
            id: "basic-bar",
            type: 'bar',
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          xaxis: {
            categories: dates
          },
          colors: ['#2962ff', '#26c6da', '#f62d51', '#39c449', '#ffbc34', '#1e2a35', '#eaf2fb', '#35363b'],
          plotOptions: {
            bar: {
              horizontal: false
            },
          }
        }}
        series={[
          {
            name: 'test',
            data: [1, 2, 3]
          },
          {
            name: 'test 2',
            data: [1, 2, 3]
          }
        ]}
        type="bar"
        height={500}
      /> */}
      <div style={{ overflowX: 'scroll', overflowY: 'clip' }}>
        {
          chartData.map(d => {
            return (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ 
                  height: 50, 
                  minWidth: '100px', 
                  width: '100px', 
                  paddingRight: '10px',
                  borderRadius: 10, 
                  fontSize: 15, 
                  fontWeight: 'bold', 
                  color: '#1634a9',
                  display: 'flex',
                  alignItems: d.name.toLowerCase() == 'date' ? 'flex-start' : 'center'
                }}>
                  {d.name}
                </div>
                {
                  d.data.reverse().map(v => { 
                    if (v == '') {
                      return (
                        <div style={{ 
                          height: 50, 
                          minWidth: 60,
                          margin: '2px',
                          background: 'linear-gradient(90deg, rgba(84, 112, 222, 0.02) 35%, rgba(84, 112, 222, 0.08) 100%)', 
                          borderRadius: 10,
                        }}>
                        </div>
                      )
                    } else if (d.name.toLowerCase() == 'date') {
                      return (
                        <div style={{ 
                          height: 50, 
                          minWidth: 60, 
                          margin: '2px',
                          borderRadius: 10,
                          fontSize: 13,
                          textAlign: 'center'
                        }}>
                          {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(v))}
                        </div>
                      )
                    } else {
                      return (
                        <div style={{ 
                          height: 50, 
                          minWidth: 60, 
                          margin: '2px',
                          background: 'linear-gradient(90deg, rgba(84, 112, 222, 0.08) 35%, rgba(84, 112, 222, 0.12) 100%)', 
                          borderRadius: 10,
                          color: '#1634a9',
                          fontSize: 15,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          {v}
                        </div>
                      )
                    }
                  })
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default MyChart;
