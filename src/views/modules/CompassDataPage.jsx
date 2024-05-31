import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Loader from "../../layouts/loader/Loader";
import { FaChartLine, FaPlus } from "react-icons/fa6";
import { CiPause1 } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "react-bootstrap";
import CompassData from "../../services/CompassApi";
import toast from "react-hot-toast";

const options = ["Pause", "inProgress", "Not Available"];
const options1 = ["one", "two", "three"];
const options2 = ["one", "two", "three"];
const options3 = [5, 10, 15, 20];
const options4 = ["5", "10", "15", "20"];

const CompassDataPage = ({ setOpen }) => {
  const user_id = localStorage.getItem("user_id");

  const [compassRead, setCompassRead] = useState([]);
  const [loader, setLoader] = useState(true);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // For Get Compass Data
  const getCompassReadData = () => {
    CompassData.compass_read({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res?.success === true) {
          setCompassRead(res?.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  // For Delete Compass Data
  const handleDelete = () => {
    CompassData.compass_delete({ id: selectedItems })
      .then((res) => {
        if (res?.success === true) {
          getCompassReadData();
          toast.success(res?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCompassReadData();
  }, [user_id]);

  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.id);
    if (event.target.checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const toggleSelectAll = () => {
    const allIds = compassRead.map((datas) => datas?.id);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const showFirstDrawer = () => {
    setOpen(true);
  };

  // Pagination function start section
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };
  const paginatedItems = paginate(compassRead, currentPage, itemsPerPage);
  const totalPages = Math.ceil(compassRead?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (option) => {
    setItemsPerPage(parseInt(option.value));
  };
  // Pagination function end section


  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="compass h-100">
            <>
              {paginatedItems?.length === 0 ? (
                <>
                  <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-md-5">
                      <div className="compass-text text-center">
                        <p>Currently there are no games or Casino configured</p>
                        <button
                          className="btn game_add_btn"
                          onClick={showFirstDrawer}
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
                        <span>
                          Track, add, delete all your games and operators
                        </span>
                      </div>

                      <div className="col-md-6 text-end">
                        <button
                          className="btn game_add_btn"
                          onClick={showFirstDrawer}
                        >
                          Calibrate Casino or Game <FaPlus className="ms-2" />
                        </button>
                      </div>
                    </div>
                    <div className="compass-data-border mb-3">
                      <span></span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="calibrate-dropdown">
                        <Dropdown options={options} placeholder="Status" />
                        <Dropdown options={options1} placeholder="Operator" />
                        <Dropdown options={options2} placeholder="Game" />
                        <Dropdown options={options3} placeholder="All Time" />
                      </div>

                      <div className="compass-right-icon">
                        <div className="compass-search">
                          <FaChartLine />
                        </div>
                        <div className="compass-search" onClick={handleDelete}>
                          <i className="bi bi-trash3"></i>
                        </div>
                        <div className="compass-search">
                          <CiPause1 />
                        </div>
                        <div className="compass-search">
                          <IoMdSearch />
                        </div>
                      </div>
                    </div>
                    <div className="compass-data-table pt-3">
                      <table className="table table-bordered">
                        <thead className="table-heading-name">
                          <tr>
                            <th scope="col">
                              <input
                                type="checkbox"
                                className="casino-checkbox"
                                onChange={toggleSelectAll}
                                checked={selectAll}
                              />
                            </th>
                            <th scope="col">Created On</th>
                            <th scope="col">Operator Name</th>
                            <th scope="col">Game Name </th>
                            <th scope="col" className="text-center">
                              Tracking Timeline
                            </th>
                            <th scope="col" className="text-center">
                              Credits consumed
                            </th>
                            <th scope="col" className="text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="table-body-items">
                          {paginatedItems?.map((datas, index) => {
                            const startDate = new Date(datas?.start_date);
                            const formattedStartDate = startDate
                              ?.toLocaleDateString("en-GB")
                              .replace(/\//g, "-");
                            const endDate = new Date(datas?.end_date);
                            const formattedEndDate = endDate
                              ?.toLocaleDateString("en-GB")
                              .replace(/\//g, "-");
                            return (
                              <tr
                                key={index}
                                className="table-body-items-table"
                              >
                                <td style={{ width: "5%" }}>
                                  <input
                                    type="checkbox"
                                    className="casino-checkbox"
                                    id={datas.id}
                                    onChange={handleCheckboxChange}
                                  />
                                </td>
                                <td style={{ width: "13%" }}>
                                  <span className="m-0">-</span>
                                </td>
                                <td style={{ width: "20%", fontSize: "14px" }}>
                                  <p className="m-0">{datas?.name}</p>
                                </td>
                                <td style={{ width: "20%", fontSize: "14px" }}>
                                  <p className="m-0">
                                    {datas?.game_original_name}
                                  </p>
                                </td>
                                <td className="text-center">
                                  <span className="tracking-time">
                                    {formattedStartDate} to {formattedEndDate}
                                  </span>
                                </td>
                                <td
                                  style={{ width: "15%" }}
                                  className="text-center"
                                >
                                  {/* <span className="credits">{datas.Credits}</span> */}
                                  <span className="credits">-</span>
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

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span>
                          Showing {(currentPage - 1) * itemsPerPage + 1} -
                          {Math.min(
                            currentPage * itemsPerPage,
                            compassRead?.length
                          )}
                          &nbsp;out of&nbsp;
                          {compassRead?.length}
                        </span>
                      </div>
                      <div>
                        {totalPages > 1 && (
                          <div className="d-flex justify-content-center orderlist_pagination">
                            <Pagination className="custom-pagination">
                              <Pagination.Prev
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                              >
                                <MdKeyboardArrowLeft className="me-2" /> Prev
                              </Pagination.Prev>
                              {[...Array(totalPages).keys()].map((page) => {
                                if (
                                  page === 0 ||
                                  page === totalPages - 1 ||
                                  (page >= currentPage - 1 &&
                                    page <= currentPage + 1)
                                ) {
                                  return (
                                    <Pagination.Item
                                      key={page}
                                      active={page + 1 === currentPage}
                                      onClick={() => handlePageChange(page + 1)}
                                      className="custom-pagination-item"
                                    >
                                      {page + 1}
                                    </Pagination.Item>
                                  );
                                } else if (
                                  (page === 1 && currentPage > 4) ||
                                  (page === totalPages - 2 &&
                                    currentPage < totalPages - 3)
                                ) {
                                  return (
                                    <Pagination.Item
                                      key={page}
                                      disabled
                                      className="custom-pagination-item"
                                    >
                                      ...
                                    </Pagination.Item>
                                  );
                                }
                                return null;
                              })}
                              <Pagination.Next
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                disabled={currentPage === totalPages}
                              >
                                Next
                                <MdKeyboardArrowRight className="ms-2" />
                              </Pagination.Next>
                            </Pagination>
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center pagination_per_select">
                        <span className="me-1">Items per Page: </span>
                        <Dropdown
                          options={options4.map((option) => ({
                            value: option,
                            label: option,
                          }))}
                          onChange={handleItemsPerPageChange}
                          value={itemsPerPage?.toString()}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </div>
        </>
      )}
    </>
  );
};

export default CompassDataPage;
