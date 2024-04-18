import React, { useState } from "react";
import "./index.css";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { data } from "./dummydata";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";

const Compass = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((data) => {
    return data?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className="compass h-100">
        {data?.length == 0 ? (
          <>
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-md-5">
                <div className="compass-text text-center">
                  <p>Currently there are no games or Casino configured</p>
                  <button
                    className="btn game_add_btn"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCalibrate"
                    aria-controls="offcanvasCalibrate"
                  >
                    Calibrate Casino or Game <FaPlus className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="compass-data">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h3>Calibrate Compass</h3>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    className="btn game_add_btn"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCalibrate"
                    aria-controls="offcanvasCalibrate"
                  >
                    Calibrate Casino or Game <FaPlus className="ms-2" />
                  </button>
                </div>
              </div>
              <div className="compass-data-table pt-3">
                <table class="table table-bordered">
                  <thead className="table-heading-name">
                    <tr>
                      <th scope="col">Operator Name</th>
                      <th scope="col">Game Name </th>
                      <th scope="col">Tracking Timeline</th>
                      <th scope="col">Credits consumed</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-items">
                    {data?.map((datas) => {
                      return (
                        <tr key={datas.name}>
                          <td scope="row" style={{ width: "30%" }}>
                            <p className="m-0">{datas.name}</p>
                            <Link to="/">{datas.link}</Link>
                          </td>
                          <td style={{ width: "30%" }}>
                            <p className="m-0">{datas.gameName}</p>
                            <Link to="/">{datas.link}</Link>
                          </td>
                          <td>
                            <span className="tracking-time">
                              {datas.Timeline}
                            </span>
                          </td>
                          <td style={{ width: "15%" }}>
                            <span className="credits">{datas.Credits}</span>
                          </td>
                          <td className="text-center">
                            <span className="action-btn"></span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        class="offcanvas offcanvas-end compass-sidebar"
        tabindex="-1"
        id="offcanvasCalibrate"
        aria-labelledby="offcanvasRightCalibrate"
        data-bs-backdrop="static"
      >
        <div class="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Calibrate
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setSelectedOption("")}
          ></button>
        </div>
        <div class="offcanvas-body select-casino-game-body">
          <div
            className={`calibrate-title ${
              selectedOption === "Casino 1" ? "selected" : ""
            }`}
            onClick={() => handleSelectOption("Casino 1")}
          >
            <span>Select Casino</span>
            <div className="calibrate-content mt-3">
              <div className="calibrate-icon">
                <CiCirclePlus />
              </div>
              <p>Start calibrating by adding Casino.</p>
            </div>
          </div>
          <div
            className={`calibrate-title mt-4 ${
              selectedOption === "Casino 2" ? "selected" : ""
            }`}
            onClick={() => handleSelectOption("Casino 2")}
          >
            <span>Select Game</span>

            <div className="calibrate-content mt-3">
              <div className="calibrate-icon">
                <CiCirclePlus />
              </div>
              <div>
                <p>Start calibrating by adding Casino.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="offcanvas-footer">
          <div
            id="offcanvasRightCalibrate"
            className="sidebar-model-heading text-end"
          >
            <button
              className="compass-sidebar-back"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={() => setSelectedOption("")}
            >
              Back
            </button>
            {selectedOption == "Casino 1" ? (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                data-bs-toggle="offcanvas"
                data-bs-target="#casinoSelected"
                aria-controls="casinoSelected"
                disabled={!selectedOption}
                onClick={() => setSelectedOption("")}
              >
                Next
              </button>
            ) : (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
                disabled={!selectedOption}
                onClick={() => setSelectedOption("")}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* For Choose CASINO */}
      <div
        class="offcanvas offcanvas-end casino-sidebar"
        tabindex="-1"
        id="casinoSelected"
        aria-labelledby="offcanvasRightLabelCasino"
      >
        <div class="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Choose Casino
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body p-0 bg-white">
          <div className="">
            <div className="search-bar position-relative">
              <div className="serching">
                <input
                  type="text"
                  placeholder="search game here"
                  className="search-casino-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="casino-search-icon">
                  <IoIosSearch style={{ fontSize: "20px" }} />
                </div>
              </div>
              {filteredData.length === 0 ? (
                <div className="casedata-no-data-search">
                  <div className="no-search-result">
                    <span>No Search result found</span>
                  </div>
                  <div
                    className="request-demo"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRequestCasino"
                    aria-controls="offcanvasRequestCasino"
                  >
                    <AiOutlinePlus className="me-2" />
                    <span>Request New Casino</span>
                  </div>
                </div>
              ) : (
                <div>
                  {filteredData.map((data, index) => (
                    <div className="casino-data-display" key={data.id}>
                      <input
                        type="checkbox"
                        className="casino-checkbox"
                        id={data.id}
                      />
                      <div className="casino-data-bar">
                        <label htmlFor={data.id}>{data.name}</label>
                        <Link>{data.link}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="line">
            <span></span>
          </div>
        </div>
        <div class="offcanvas-footer">
          <div
            id="offcanvasRightCalibrate"
            className="sidebar-model-heading text-end"
          >
            <button
              className="compass-sidebar-back"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              Back
            </button>
            <button className="compass-sidebar-next" disabled>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* For Choose Select Game */}
      <div
        class="offcanvas offcanvas-end casino-sidebar"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Select Game
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div class="offcanvas-body">...</div>
      </div>

      {/* For Request a new casino */}

      <div
        class="offcanvas offcanvas-end casino-sidebar"
        tabindex="-1"
        id="offcanvasRequestCasino"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-header">
          <h5 id="offcanvasRightCalibrate" className="sidebar-model-heading">
            Choose Casino
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div class="offcanvas-body bg-white p-4">
          <div className="row">
            <div className="col-md-8">
              <div className="casino-input-field">
                <div className="form-group">
                  <label htmlFor="">Enter Casino Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name here"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Enter URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL here"
                  />
                </div>
              </div>
            </div>

            <div className="url-preview mt-5">
              <h5>
                <b>URL Preview</b>
              </h5>
              {/* <span>Enter Url for a preview</span> */}
              <div>
                <img
                  src="https://s3-alpha-sig.figma.com/img/66b8/d95a/fc1a137a2cf4ad184c535dfc86e74b37?Expires=1714348800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=J-9rv-H17~h~wD5JUkbUIRpcg2AaBERK38fDTtxLbhaLFC~sdXACDJ-ZuXol-Jv7Y68KRFmTiHhmum2Dllfi9XCMXmuXZWmL-gS-RyxqIiAEs6KLnvqMcJq4RbxHJ4O5TASp8Wb8q-9sTiYig387LJtzuHLrvt16~Zdk2MFeh6oixg-WAP1QaFAM~B7UIQRIspaClZ54yegdWgRGjPLYZt9g~WB6EQbHdIxCaib-kAqRkACGXWfJXfhdIZcdUWNeLOA9Gt0oXa6HZwsQOXOH4fp-E8YMSyylkKNumODMahgby~Pbe-UEqhucn77u7WzaqGWPiw2TRm4cAxik36aCZA__"
                  alt=""
                  className="w-100 bordered mt-3"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="offcanvas-footer">
          <div
            id="offcanvasRightCalibrate"
            className="sidebar-model-heading text-end"
          >
            <button
              className="compass-sidebar-back"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              Back
            </button>
            <button className="new-request-casino-btn" disabled>
              Request Casino
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compass;
