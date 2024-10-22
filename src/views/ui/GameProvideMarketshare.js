import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import TextField from '@mui/material/TextField';
import { Range } from 'react-range';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import "./index.css";
import call from "../../services/Call";

const GameProvideMarketshare = () => {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [currentAvgPosition, setCurrentAvgPosition] = useState(0)

    useEffect(() => {
        setLoading(true)
        call({
            path: '/get_provider_marketshare',
            method: 'POST',
            data: {
                "region": "",
                "month": ""
            }
        }).then((v) => {
            setTableData(v.results)
            console.log(v.results[0])
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const changeTemplate = (row) => {
        let change = ';'
        if (row != null) {
            change = row?.change.replaceAll('%', '')
        }
        return (
            <h6 className="font-normal text-secondary">
                {change < 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8d7da', color: '#dc3545' }}>{change}% <FaCaretDown /></span> : ''}
                {change == 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#faf3e8', color: '#dc9b00' }}>{change}% </span> : ''}
                {change > 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e6f9e6', color: '#28a745' }}>{change}% <FaCaretUp /></span> : ''}
            </h6>
        )
    }

    return (
        <div>
            <div className="row align-items-center pb-3 pt-3">
                <div className="col-md-6">
                    <h3>Game Provide Marketshare</h3>
                </div>
                <div className="col-md-6 text-md-end">
                    <TextField size="small" label="Search" variant="outlined" />
                </div>
            </div>
            {!loading && <div className="tracker-details-body calibrate-compass-table">
                <DataTable
                    className="tracker-details-table"
                    paginator rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    value={tableData}
                    tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    paginatorClassName="justify-content-between"
                    currentPageReportTemplate="Showing {first}-{last} out of {totalRecords}"
                >
                    <Column field="game_provider" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Game Provider</div>}></Column>
                    <Column field="unique_games" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Unique Games</div>}></Column>
                    <Column field="unique_casinos" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Unique Casinos</div>}></Column>
                    <Column field="market_share" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Marketshare</div>}></Column>
                    <Column field="major_market" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Market</div>}></Column>
                    <Column field="change" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Change</div>} body={changeTemplate}></Column>
                </DataTable>
            </div>}

            {loading && 
                <div style={{ display: 'flex' }}>
                    <ProgressSpinner />
                </div>
            }
        </div>
    );
};

export default GameProvideMarketshare;
