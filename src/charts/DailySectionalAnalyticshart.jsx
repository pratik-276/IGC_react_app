import React from "react";
import { format } from 'date-fns';

const DailySectionalAnalyticsChart = ({ trackingDetails }) => {
    const dates = [...new Set(trackingDetails?.daywise_data?.map(t => t.created_date))].sort().reverse();

    // Organizing data to group by section name and then by section position
    const groupedData = {};
    trackingDetails?.daywise_data?.forEach(entry => {
        if (!groupedData[entry.section_name]) {
            groupedData[entry.section_name] = {};
        }

        if (!groupedData[entry.section_name][entry.section_position]) {
            groupedData[entry.section_name][entry.section_position] = dates.reduce((acc, date) => {
                acc[date] = null;
                return acc;
            }, {});
        }

        groupedData[entry.section_name][entry.section_position][entry.created_date] = entry.game_position;
    });

    // Flatten data for table rendering
    const tableData = [];
    Object.entries(groupedData).forEach(([section_name, positions]) => {
        let firstRow = true;
        Object.entries(positions).forEach(([section_position, gamePositions]) => {
            tableData.push({
                section_name: firstRow ? section_name : null, // Merge section names across rows
                section_position,
                ...gamePositions
            });
            firstRow = false;
        });
    });

    return (
        <div>
            <h5 className="font-semibold pl-2">Daily Sectional Analytics</h5>
            <div className="mt-2 " style={{ overflowX: 'auto', maxHeight: '400px' }}>
                <table style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2, borderBottom: '2px solid #392f6c' }} >
                        <tr>
                            <th style={{ padding: '8px', border: '1px solid #392f6c', textAlign: 'center' }}>Section Name</th>
                            <th style={{ padding: '8px', border: '1px solid #392f6c', textAlign: 'center' }}>Section Position</th>
                            {dates.map(date => (
                                <th key={date} style={{ padding: '8px', border: '1px solid #392f6c', textAlign: 'center', minWidth: '80px' }}>
                                    {format(new Date(date), 'MMM dd')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody >
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                {row.section_name !== null ? (
                                    <td
                                        rowSpan={Object.keys(groupedData[row.section_name]).length}
                                        style={{ padding: '4px', border: '1px solid #392f6c', textAlign: 'center' }}
                                    >
                                        {row.section_name}
                                    </td>
                                ) : null}
                                <td style={{ padding: '4px', border: '1px solid #392f6c', textAlign: 'center' }}>
                                    {row.section_position}
                                </td>
                                {dates.map(date => (
                                    <td key={date} style={{ padding: '4px', border: '1px solid #392f6c', textAlign: 'center', backgroundColor: row[date] ? '#DAD2FF' : 'transparent' }}>
                                        {row[date] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailySectionalAnalyticsChart;
