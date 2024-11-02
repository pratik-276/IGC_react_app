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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import toast from "react-hot-toast";
import { ProgressBar } from 'primereact/progressbar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const GameProvideMarketshare = () => {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [regions, setRegions] = useState([])
    const [yearMonthList, setYearMonthList] = useState([])
    const [selectedRegion, setSelectedRegion] = useState("United States")
    const [selectedMonthYear, setSelectedMonthYear] = useState("")

    useEffect(() => {
        getPageData()
    }, [selectedRegion, selectedMonthYear])

    useEffect(() => {
        import('../../utils/DatatableBottomFix')
            .then(({datatableBottomItemFix}) => {
                console.log(datatableBottomItemFix())
            })
    }, [tableData])

    async function getRegions() {
        const res = await call({
            path: '/get_regions',
            method: 'GET'
        })
        
        setRegions(res.data)
    }

    function generateMonthYear() {
        const startYear = 2024;
        const endYear = 2024;

        const monthYearList = [];

        for (let year = startYear; year <= endYear; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month)
                // Format the month and year (e.g., "Jan 2024")
                const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })
                // Consider till current month 
                if (date > new Date()) break
                monthYearList.push(monthYear)
            }
        }

        setYearMonthList(monthYearList)
    }

    async function getMarketshareData() {
        const data = await call({
            path: `/get_provider_marketshare`,
            method: 'POST',
            data: {
                "region": selectedRegion,
                "month": selectedMonthYear
            }
        })

        console.log(Math.max(...data.data.map(d => parseFloat(d.market_share))))
        setTableData(data.data)
    }

    async function getPageData() {
        setLoading(true)
        try {
            await getRegions()
            await getMarketshareData()
            generateMonthYear()   
        } catch(e) {
            toast.error(e)
            setTableData([])
        }

        setLoading(false)
    }

    const changeTemplate = (row) => {
        let change = ';'
        if (row != null) {
            change = row?.change.replaceAll('%', '')
            change = parseFloat(change).toFixed(2)
        }
        return (
            <h6 className="font-normal text-secondary">
                {change < 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8d7da', color: '#dc3545' }}>{change}% <FaCaretDown /></span> : ''}
                {change == 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#faf3e8', color: '#dc9b00' }}>{change}% </span> : ''}
                {change > 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e6f9e6', color: '#28a745' }}>{change}% <FaCaretUp /></span> : ''}
            </h6>
        )
    }

    const marketshareTemplate = (row) => {
        const share = mapToRange(row.market_share, 0, Math.max(...tableData.map(d => parseFloat(d.market_share))))
        let bg = 'bg-info'

        if (parseFloat(row.market_share) < 3.0) {
            bg = 'bg-danger';
        } else if (parseFloat(row.market_share) > 3.0 && parseFloat(row.market_share) < 6.0) {
            bg = 'bg-warning';
        } else if (parseFloat(row.market_share) > 6.0) {
            bg = 'bg-success';
        } else {
            bg = 'bg-info';
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <div style={{ fontSize: '12px' }}>
                    {share}%
                </div>
                <div style={{ flex: 1 }} className="progress">
                    <div className={`progress-bar ${bg}`} role="progressbar" style={{ width: `${share}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="pb-3 pt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <h3>Game Provide Marketshare</h3>
                </div>
                <ProgressBar value={12}></ProgressBar>
                <div style={{display: 'flex', flexDirection: 'row', justifyItems: 'flex-end', gap: 5 }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="region-select">Region</InputLabel>
                            <Select
                                labelId="region-select"
                                value={selectedRegion}
                                label="Region"
                                onChange={(e) => setSelectedRegion(e.target.value)}
                            >
                                { regions.map((region) => <MenuItem value={region}>{region}</MenuItem> ) }
                            </Select>
                        </FormControl>
                    </div>
                    {/* <div style={{ flex: 1, minWidth: '200px' }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="month-select">Month</InputLabel>
                            <Select
                                labelId="month-select"
                                value={selectedMonthYear}
                                label="Month"
                                onChange={(e) => setSelectedMonthYear(e.target.value)}
                            >
                                { yearMonthList.map((ym) => <MenuItem value={ym}>{ym}</MenuItem> ) }
                            </Select>
                        </FormControl>
                    </div> */}
                </div>
            </div>
            {!loading && <div className="tracker-details-body calibrate-compass-table">
                <DataTable
                    paginator 
                    value={tableData}
                    rows={10}
                    totalRecords={tableData.length}
                    className="tracker-details-table"
                    tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first}-{last} out of {totalRecords}"
                    rowsPerPageOptions={[10, 20, 30]}
                >
                    <Column field="game_provider" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Game Provider</div>}></Column>
                    <Column field="unique_games" style={{ maxWidth: '100px' }} sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Unique Games</div>}></Column>
                    <Column field="unique_casinos" style={{ maxWidth: '100px' }} sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Unique Casinos</div>}></Column>
                    <Column field="market_share" style={{ minWidth: '200px' }} sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Marketshare</div>} body={marketshareTemplate}></Column>
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
    )
}

function mapToRange(value, oldMin, oldMax) {
    if (value < oldMin || value > oldMax) {
        throw new Error("Value out of range");
    }

    const mappedValue = ((value - oldMin) / (oldMax - oldMin)) * 100;
    return mappedValue.toFixed(0);
}

export default GameProvideMarketshare;
