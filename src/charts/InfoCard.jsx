import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import { MdInfoOutline } from 'react-icons/md';

const InfoCard = ({ header, tooltip, tooltipTarget, value, widthMod }) => {

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
                <h5 className="font-semibold">{value}</h5>
            </div>
        </div>
    );
};

export default InfoCard;
