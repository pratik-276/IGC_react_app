import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import { MdInfoOutline, MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

const KpiCard = ({ header, tooltip, tooltipTarget, value, trend }) => {

    const renderTrendIcon = () => {
        if (trend === 'up') {
            return <MdArrowDropUp style={{ color: 'green', fontSize: '24px' }} />;
        } else if (trend === 'down') {
            return <MdArrowDropDown style={{ color: 'red', fontSize: '24px' }} />;
        } else {
            return null;
        }
    };

    return (
        <div className="flex-1">
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
                <h5 className="font-semibold">{value !== null && value !== undefined ? value : '-'}{renderTrendIcon()}</h5>

            </div>
        </div>
    );
};

export default KpiCard;
