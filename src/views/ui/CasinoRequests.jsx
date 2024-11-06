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
import { Button, Input, InputLabel, MenuItem, NativeSelect, Select } from "@mui/material";
import { Drawer } from "antd";

const emptyCasinoRequest = {
    name: "",
    url: "",
    geography: "",
}

const statuses = [
    'Pending', 
    'Processing',
    'Accepted' 
]

const CasinoRequests = () => {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [casinoRequest, setCasinoRequest] = useState(emptyCasinoRequest)
    const [errors, setErrors] = useState(emptyCasinoRequest)
    const [regions, setRegions] = useState([])

    const isAdmin = localStorage.getItem('is_admin')

    async function getRegions() {
        const res = await call({
            path: '/get_regions',
            method: 'GET'
        })

        setRegions(res.data)
    }

    useEffect(() => {
        getRegions()
        getCasinos()
    }, [])

    useEffect(() => {
        import('../../utils/DatatableBottomFix')
            .then(({ datatableBottomItemFix }) => {
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
                "request_id": e.newData.id,
                "current_user_id": parseInt(userId),
                "operator_name": e.newData.operator_name,
                "status": e.newData.status,
                "response": e.newData.response ?? ""
            }
        }).then((v) => {
            console.log(v)
        }).finally(() => {
            getCasinos()
            setLoading(false)
        })
    }

    const saveNewCasinoRequest = ({ name, url, geography }) => {
        setLoading(true)

        if (!isValidUrl(url)) {
            setErrors((e) => { return { ...e, url: "Enter valid URL" } })
            setLoading(false)
            return
        }

        if (name == "") {
            setErrors((e) => { return { ...e, name: "Enter casino name" } })
            setLoading(false)
            return
        }

        if (geography == "") {
            setErrors((e) => { return { ...e, geography: "Enter geography/country" } })
            setLoading(false)
            return
        }

        const userId = localStorage.getItem('user_id')
        call({
            path: 'request_new_casino',
            method: 'POST',
            data: {
                "user_id": parseInt(userId),
                "operator_name": name,
                "operator_url": url,
                "operator_country": geography
            }
        }).then((v) => {
            console.log(v)
            setDrawerOpen(false)
            setErrors(emptyCasinoRequest)
            setCasinoRequest(emptyCasinoRequest)
        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setLoading(false)
            getCasinos()
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
                    editMode="row"
                    onRowEditComplete={(e) => {
                        // console.log(e)
                        updateRequest(e)
                    }}
                >
                    {
                        isAdmin == 1 &&
                        <Column
                            header={<div style={{ color: '#392F6C', fontWeight: 700 }}>User ID</div>}
                            field="user_id"
                            sortable
                        />
                    }
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
                        editor={(options) => 
                            <Select size="small" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}>
                                {statuses.map(s => <MenuItem value={s}>{s}</MenuItem>)}
                            </Select>
                        }
                    />
                    <Column
                        field="response"
                        sortable
                        header={<div style={{ color: '#392F6C', fontWeight: 500 }}>Response</div>}
                        editor={(options) => <TextField multiline type="text" size="small" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
                    />
                    {isAdmin == 1 ? 
                        <Column
                            rowEditor={true}
                            bodyStyle={{ textAlign: 'center' }}
                        /> : ''
                    }
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
                        <Button
                            variant="contained"
                            style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }}
                            onClick={() => {
                                if (isAdmin == 1)
                                    saveNewCasinoRequest({ ...casinoRequest })
                            }}
                        >
                            Request Casino
                        </Button>
                    </div>
                }
            >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <InputLabel variant="standard" className="pt-2">
                        Casino Name
                    </InputLabel>
                    <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        value={casinoRequest.name}
                        onChange={(e) => setCasinoRequest((req) => { return { ...req, name: e.target.value } })}
                        error={errors.name !== ""}
                        helperText={errors.name}
                    />
                    <InputLabel variant="standard" className="pt-2">
                        Casino URL
                    </InputLabel>
                    <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        value={casinoRequest.url}
                        onChange={(e) => setCasinoRequest((req) => { return { ...req, url: e.target.value } })}
                        error={errors.url !== ""}
                        helperText={errors.url}
                    />
                    <InputLabel variant="standard" htmlFor="uncontrolled-native" className="pt-2">
                        Casino Geography
                    </InputLabel>
                    <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        value={casinoRequest.geography}
                        onChange={(e) => setCasinoRequest((req) => { return { ...req, geography: e.target.value } })}
                        error={errors.geography !== ""}
                        helperText={errors.geography}
                    />
                </div>
            </Drawer>
        </div>
    )
}

const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}


export default CasinoRequests;
