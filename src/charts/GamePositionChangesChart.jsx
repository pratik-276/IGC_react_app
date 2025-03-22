import React, { useEffect, useRef } from "react";

const MyChart = ({ trackingDetails }) => {
  console.log(trackingDetails)

  const sections = [... new Set(trackingDetails?.daywise_data?.map(t => t.section_name))]
  const dates = [...new Set(trackingDetails?.daywise_data?.map(t => t.created_date))]

  const minLength = 12;
  if (dates.length < minLength) {
    const additionalElements = dates.length < 12 ? Array(minLength - dates.length).fill('-') : [];
    dates.push(...additionalElements);
  }

  const chartData = sections?.map(s => {
    const sectionWiseData = trackingDetails?.daywise_data?.filter(d => d.section_name == s)

    const dateWiseData = [
      ...dates.map(d => sectionWiseData
        .filter(s => s.created_date == d)
        .map(s => s.game_position)
        .at(0) ?? ''
      )
    ]

    return {
      name: s,
      data: dateWiseData.reverse()
    }
  })
  chartData.push({
    name: 'Date',
    data: dates.reverse()
  })

  console.log(chartData)

  return (
    <div>
      <div className="mb-5">
        {/* <h5 className="m-0">Game Position Changes</h5> */}
        <h5 className="font-semibold pl-2">Daily Sectional Analytics</h5>
      </div>
      <div style={{ overflowX: 'scroll', overflowY: 'clip' }}>
        {
          chartData.map(d => {
            return (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{
                  minWidth: '100px',
                  width: '100px',
                  paddingRight: 120,
                  paddingLeft: '10px',
                  fontSize: 15,
                  color: '#607D8B',
                  display: 'flex',
                  alignItems: d.name.toLowerCase() == 'date' ? 'flex-start' : 'center',
                  paddingTop: d.name.toLowerCase() == 'date' ? '5px' : '0px',
                  paddingBottom: d.name.toLowerCase() == 'date' ? '15px' : '0px',
                }}>
                  <div>
                    {d.name}
                  </div>
                </div>
                {
                  d.data.reverse().map(v => {
                    if (v == '') {
                      return (
                        <div style={{
                          height: 110,
                          minWidth: 110,
                          margin: '0px',
                          border: '1px dashed #0000004D',
                        }}>
                        </div>
                      )
                    } else if (d.name.toLowerCase() == 'date') {
                      return (
                        <div style={{
                          minWidth: 110,
                          margin: '0px',
                          fontSize: 13,
                          textAlign: 'center',
                          paddingTop: '5px',
                          paddingBottom: '15px',
                          color: '#607D8B',
                        }}>
                          {
                            isValidDate(v) ?
                              new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(v)) :
                              v
                          }
                        </div>
                      )
                    } else {
                      return (
                        <div style={{
                          height: 110,
                          minWidth: 110,
                          margin: '0px',
                          color: '#392f6c',
                          fontSize: 22,
                          fontWeight: '600',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #0000004D',
                          background: '#dff0f7',
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
  )
}

function isValidDate(date) {
  return !isNaN(Date.parse(date));
}


export default MyChart;
