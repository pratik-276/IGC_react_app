import React from "react";

const DailySectionalAnalyticsChart = ({ trackingDetails }) => {
    // Extract unique section names and dates
    const sections = [...new Set(trackingDetails?.daywise_data?.map(t => t.section_name))];
    const dates = [...new Set(trackingDetails?.daywise_data?.map(t => t.created_date))];

    // Create table data based on section names and dates
    const tableData = sections.map((section) => {
        // Get all game positions for this section across different dates
        const sectionData = trackingDetails?.daywise_data?.filter(d => d.section_name === section);
        const gamePositions = dates.map(date => {
            const dataForDate = sectionData.find(d => d.created_date === date);
            return dataForDate ? dataForDate.game_position : '';  // Return game_position or empty string if not found
        });

        return {
            section_name: section,
            section_position: sectionData.length > 0 ? sectionData[0].section_position : '', // Assuming section_position is the same for all dates
            game_positions: gamePositions
        };
    });

    // Add "Date" row for headers
    const dateHeaders = dates.map(date => (
        <th
            key={date}
            style={{
                padding: '8px',
                border: '1px solid #392f6c',
                textAlign: 'center',
                fontWeight: 'normal',
                whiteSpace: 'nowrap',
            }}
        >
            {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))}
        </th>
    ));

    return (
        <div>
            <div >
                {/* Tracker Details Table */}
                <h5 className="font-semibold pl-2">Daily Sectional Analytics</h5>

                <div className="mt-2" style={{ overflowX: 'auto' }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}
                        className="p-3"
                    >
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '8px',
                                    border: '1px solid #392f6c',
                                    textAlign: 'center',
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap',
                                }}>Section Name</th>
                                <th style={{
                                    padding: '8px',
                                    border: '1px solid #392f6c',
                                    textAlign: 'center',
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap',
                                }}>Section Position</th>
                                {dateHeaders}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #392f6c',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {row.section_name}
                                    </td>
                                    <td
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #392f6c',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {row.section_position}
                                    </td>
                                    {row.game_positions.map((gamePos, idx) => (
                                        <td
                                            key={idx}
                                            style={{
                                                padding: '8px',
                                                border: '1px solid #392f6c',
                                                textAlign: 'center',
                                                backgroundColor: gamePos ? '#f1f1f1' : 'transparent',
                                            }}
                                        >
                                            {gamePos ? gamePos : ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailySectionalAnalyticsChart;
