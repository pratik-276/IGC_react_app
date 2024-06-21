import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ChooseCasinoPage = ({ setNewCasino, onCasinoDrawerClose, casinoDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [casinoData, setCasinoData] = useState([]);
  const [loader, setLoader] = useState(true);

  const filteredData = casinoData?.filter((data) => {
    return data?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  const showNewCasinoDrawer = () => {
    setNewCasino(true);
  };

  const getCasinoData = () => {
    CompassData.get_operator()
      .then((res) => {
        if (res?.success === true) {
          setCasinoData(res?.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getCasinoData();
  }, []);

  const closeDrawer = () => {
    setSearchQuery("")
    onCasinoDrawerClose()
  }

  return (
    <>

      <Drawer
        title="Choose Casino"
        width="50%"
        className="choose_casino_drawer"
        closable={true}
        maskClosable={false}
        onClose={closeDrawer}
        open={casinoDrawer}
        closeIcon={<CloseOutlined className="custom-close-icon" />}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={closeDrawer}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            <button
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Save
            </button>
          </div>
        }
      >
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
          {filteredData?.length === 0 ? (
            <div className="casedata-no-data-search">
              <div className="no-search-result">
                <span>No Search result found</span>
              </div>
              <div className="request-demo" onClick={showNewCasinoDrawer}>
                <AiOutlinePlus className="me-2" />
                <span>Request New Casino</span>
              </div>
            </div>
          ) : (
            <div>
              {loader ? (
                <Loader />
              ) : (
                <>
                  {filteredData?.map((data, index) => (
                    <div className="casino-data-display" key={data?.id}>
                      <input
                        type="checkbox"
                        className="casino-checkbox"
                        id={data?.id}
                      />
                      <div className="casino-data-bar">
                        <label htmlFor={data?.id}>{data?.name}</label>
                        <Link to={data?.site_url} target="_blank">
                          {data?.site_url}
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        <div className="line">
          <span></span>
        </div>
      </Drawer>
    </>
  );
};

export default ChooseCasinoPage;
