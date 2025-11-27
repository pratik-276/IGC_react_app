import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import { MdInfoOutline, MdContentCopy } from 'react-icons/md';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';


const InfoCard = ({ header, tooltip, tooltipTarget, value, widthMod }) => {

    const handleCopy = () => {
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="flex-1" style={widthMod ? { width: "25%" } : {}}>
            <div
                className="d-flex flex-column justify-content-center gap-1 w-100 h-100 pl-3 pt-2"
                style={{
                    borderTop: "1px solid #392f6c",
                    borderRight: "1px solid #392f6c",
                    borderBottom: "1px solid #392f6c",
                    borderLeft: "6px solid #392f6c",
                }}
            >
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">{header}</h5>
                    <Tooltip
                        target={`.${tooltipTarget}`}
                        content={tooltip}
                        position="top"
                        className="custom-tooltip"
                    />
                    <MdInfoOutline
                        className={`${tooltipTarget} m-2`}
                        style={{
                            fontSize: "16px",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    />
                </div>
                <h5 className="font-semibold">
                    {header === "URL" ? (
                        <div className="d-flex align-items-center justify-content-between">
                            <span style={{
                                flex: 1,
                                whiteSpace: "nowrap", // Prevents wrapping
                                overflow: "hidden",  // Hides overflowing content
                                textOverflow: "ellipsis",  // Adds the "..."
                            }}
                                title={value}
                            >{value}</span>
                            <CopyToClipboard text={value} onCopy={handleCopy}>
                                <MdContentCopy
                                    className="ml-2 cursor-pointer"
                                    style={{ fontSize: "20px", color: "#392f6c", paddingRight: "5px" }}
                                />
                            </CopyToClipboard>
                        </div>
                    ) : (
                        value
                    )}
                </h5>
            </div>
        </div>
    );
};

export default InfoCard;
