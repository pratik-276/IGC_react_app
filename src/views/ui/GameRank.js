import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import TextField from '@mui/material/TextField';
import { Range } from 'react-range';
import { Tooltip } from 'primereact/tooltip';
import { FilterMatchMode } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import "./index.css";
import call from "../../services/Call";

const GameRank = () => {
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [tableData, setTableData] = useState([])
    const [currentAvgPosition, setCurrentAvgPosition] = useState(0)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })


    useEffect(() => {
        setLoading(true)
        call({
            path: 'get_game_rank',
            method: 'POST',
            data: {
                "search_term": searchTerm
            }
        }).then((v) => {
            setTableData(v.data)
            console.log(v.data[0])
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        import('../../utils/DatatableBottomFix')
            .then(({datatableBottomItemFix}) => {
                console.log(datatableBottomItemFix())
            })
    }, [tableData])


    const gameNameTemplate = (row) => {
        return (
            <h6 className="font-semibold text-capitalize" style={{ color: '#222222' }}>
                {row?.game_name}
            </h6>
        )
    }

    const gameProviderTemplate = (row) => {
        return (
            <h6 className="font-semibold text-capitalize" style={{ color: '#222222' }}>
                {row?.game_provider}
            </h6>
        )
    }

    const countryRankTemplate = (row) => {
        return (
            <h6 className="font-semibold text-capitalize" style={{ color: '#222222' }}>
                {parseFloat(row?.country_rank)}
            </h6>
        )
    }

    const averagePositionTemplate = (row) => {
        return (
            <h6
                onMouseEnter={() => setCurrentAvgPosition(row?.avg_position)}
                onMouseLeave={() => setCurrentAvgPosition(0)}
                className="font-normal text-secondary"
                style={{ color: '#8A92A6' }}
            >
                <span className="custom-tooltip-btn">
                    {row?.avg_position}
                </span>
            </h6>
        )
    }

    const casinoPresentTemplate = (row) => {
        return (
            <h6 className="font-normal text-secondary" style={{ color: '#8A92A6' }}>
                {row?.casino_present}
            </h6>
        )
    }

    const stabilityTemplate = (row) => {
        let stability = 'low'
        if (row.stability < 5) stability = 'high'
        else if (row.stability > 5 && row.stability <= 10) stability = 'medium'
        else stability = 'low'

        return (
            <h6 className="font-normal text-secondary">
                {stability === 'low' ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8d7da', color: '#dc3545' }} className="text-capitalize">low</span> : ''}
                {stability === 'medium' ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#faf3e8', color: '#dc9b00' }} className="text-capitalize">medium</span> : ''}
                {stability === 'high' ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e6f9e6', color: '#28a745' }} className="text-capitalize">high</span> : ''}
            </h6>
        )
    }

    const changeTemplate = (row) => {
        let change = ';'
        if (row != null) {
            change = row?.change
        }
        return (
            <h6 className="font-normal text-secondary">
                {change < 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8d7da', color: '#dc3545' }}>{change} <FaCaretDown /></span> : ''}
                {change == 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#faf3e8', color: '#dc9b00' }}>{change} </span> : ''}
                {change > 0 ? <span style={{ display: 'inline-block', padding: '0.5em 0.75em', fontSize: '0.875em', borderRadius: '0.25em', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e6f9e6', color: '#28a745' }}>{change} <FaCaretUp /></span> : ''}
            </h6>
        )
    }

    const renderHeader = () => {
        return (
            <div className="row align-items-center pb-3 pt-3">
                <div className="col-md-6">
                    <h3>Game Rank</h3>
                </div>
                <div className="col-md-6 text-md-end">
                    <TextField size="small" label="Search" variant="outlined" value={filters.global.value} onChange={(e) => setFilters((f) => { return { global: { ...f.global, value: e.target.value } }} )} />
                </div>
            </div>
        );
    };


    return (
        <div className="container">
            {loading ? 
                <div className="col-md-6">
                    <h3>Game Rank</h3>
                </div> : ''
            }
            {!loading && <div className="tracker-details-body calibrate-compass-table">
                <DataTable
                    className="tracker-details-table"
                    paginator 
                    rows={10}
                    value={tableData}
                    header={renderHeader}
                    sortField="country_rank"
                    sortOrder={1}
                    filterDisplay="row"
                    filters={filters}
                    tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first}-{last} out of {totalRecords}"
                    rowsPerPageOptions={[10, 20, 30]}
                >
                    <Column field="game_name" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Game Name</div>} body={gameNameTemplate}></Column>
                    <Column field="game_provider" sortable header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Game Provider</div>} body={gameProviderTemplate}></Column>
                    <Column field="country_rank" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Rank</div>} body={countryRankTemplate}></Column>
                    <Column field="avg_position" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Avg. Position</div>} body={averagePositionTemplate}></Column>
                    <Column field="casino_present" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Casino Present</div>} body={casinoPresentTemplate}></Column>
                    <Column field="stability" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Stability</div>} body={stabilityTemplate}></Column>
                    <Column field="change" sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Change</div>} body={changeTemplate}></Column>
                </DataTable>
            </div>}
            {!loading && <Tooltip
                position="top"
                target=".custom-tooltip-btn">
                <div>
                    <ProgressBarRange values={[currentAvgPosition]} />
                </div>
            </Tooltip>}
            
            {loading && 
                <div style={{ display: 'flex' }}>
                    <ProgressSpinner />
                </div>
            }
        </div>
    );
};

const ProgressBarRange = ({ values }) => {
    return (
        <div style={{ minWidth: '250px', padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '10px', color: 'white' }}>
                <h6>Better</h6>
                <h6>Average</h6>
                <h6>Worse</h6>
            </div>
            <Range
                step={1}
                min={1}
                max={10000}
                values={values}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '6px',
                            background: 'linear-gradient(to left, red, yellow, green)',
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props, value }) => {
                    console.log(props); return (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '20px',
                                width: '20px',
                                borderRadius: '20px',
                                backgroundColor: 'white',
                            }}
                        />
                    )
                }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '10px' }}>
                <h6>1</h6>
                <h6>10000</h6>
            </div>
        </div>
    );
};

export default GameRank;
