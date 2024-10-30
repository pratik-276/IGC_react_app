import React, { useEffect, useId, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import TextField from '@mui/material/TextField';
import { Range } from 'react-range';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaCaretUp, FaCaretDown, FaPlus } from "react-icons/fa6";
import "./index.css";
import call from "../../services/Call";
import { Button, Input } from "@mui/material";
import { Drawer } from "antd";

const CasinoRequests = () => {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        getCasinos();
    }, [])

    useEffect(() => {
        import('../../utils/DatatableBottomFix')
            .then(({datatableBottomItemFix}) => {
                console.log(datatableBottomItemFix())
            })
    }, [tableData])

    const getCasinos = () => {
        setLoading(true)
        const userId = localStorage.getItem('user_id')
        call({
            path: '/get_casino_requests',
            method: 'POST',
            data: {
                "user_id": userId
            }
        }).then((v) => {
            console.log(v.data)
            setTableData(v.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const updateRequest = (e) => {
        setLoading(true)
        const userId = localStorage.getItem('user_id')
        call({
            path: 'update_casino_requests',
            method: 'POST',
            data: {
                "request_id": e.newRowData.id,
                "current_user_id": parseInt(userId),
                "operator_name": e.newRowData.operator_name,
                "status": e.newRowData.status,
                "response": e.newRowData.response
            }
        }).then((v) => {
            console.log(v)
        }).finally(() => {
            getCasinos()
            setLoading(false)
        })
    }

    return (
        <div className="container">
            <div className="row align-items-center pb-3 pt-3">
                <div className="col-md-6">
                    <h3>Casino Requests</h3>
                </div>
                <div className="col-md-6 text-md-end">
                <Button onClick={() => setDrawerOpen(true)} size="medium" variant="outlined" style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }} endIcon={<FaPlus size={14} />}>
                    Create New Casino Request
                </Button>
                </div>
            </div>
            {!loading && <div className="tracker-details-body calibrate-compass-table">
                <DataTable
                    className="tracker-details-table"
                    paginator 
                    rows={10}
                    value={tableData}
                    tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first}-{last} out of {totalRecords}"
                    rowsPerPageOptions={[10, 20, 30]}
                    editMode="cell"
                >
                    <Column 
                        header={<div style={{ color: '#392F6C', fontWeight: 700 }}>Casino</div>}
                        field="operator_name" 
                        sortable
                    />
                    <Column 
                        field="operator_url" 
                        sortable 
                        header={<div style={{ color: '#392F6C', fontWeight: 700 }}>URL</div>}
                    />
                    <Column 
                        field="operator_country" 
                        sortable 
                        header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Geography</div>}
                    />
                    <Column 
                        field="status" 
                        sortable 
                        header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Status</div>}
                        editor={(options) => <Input variant="outlined" type="text"  value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} /> }
                        onCellEditComplete={(e) => {
                            console.log(e)
                            updateRequest(e)
                        }}
                    />
                    <Column 
                        field="response" 
                        sortable 
                        header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Response</div>}
                        editor={(options) => <Input variant="outlined" type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} /> }
                        onCellEditComplete={(e) => {
                            console.log(e)
                            updateRequest(e)
                        }} 
                    />
                    {/* <Column sortable header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Action</div>}></Column> */}
                </DataTable>
            </div>}
            
            {loading && 
                <div style={{ display: 'flex' }}>
                    <ProgressSpinner />
                </div>
            }

            <Drawer 
                className="profile_menu_drawer" 
                closable={true} 
                maskClosable={false} 
                title="Request New Casino" 
                onClose={() => setDrawerOpen(false)} 
                open={drawerOpen}
                footer={
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', gap: 5 }}>
                        <Button variant="contained" style={{ color: 'black', backgroundColor: 'white', marginBottom: '0.5rem' }}>
                            Back
                        </Button>
                        <Button variant="contained" style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }}>
                            Request Casino
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <TextField size="small" fullWidth label="Casino Name" variant="outlined" />
                    <TextField size="small" fullWidth label="Casino URL" variant="outlined" />
                    <TextField size="small" fullWidth label="Casino Geography" variant="outlined" />
                </div>
            </Drawer>
        </div>
    );
};

const ProgressBarRange = ({ values }) => {
    return (
        <div style={{ minWidth: '250px', padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '10px', color: 'white' }}>
                <h6>Worse</h6>
                <h6>Average</h6>
                <h6>Better</h6>
            </div>
            <Range
                step={1}
                min={1}
                max={100}
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
                <h6>100</h6>
            </div>
        </div>
    );
};

export default CasinoRequests;
