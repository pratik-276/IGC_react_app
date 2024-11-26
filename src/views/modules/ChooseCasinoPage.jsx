import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useCasinoContext } from "../../context/casinoContext";
import toast from "react-hot-toast";

const ChooseCasinoPage = ({
  setNewCasino,
  onCasinoDrawerClose,
  casinoDrawer,
  setCasinoDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [casinoData, setCasinoData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [localSelectedCasinos, setLocalSelectedCasinos] = useState([]);

  const { selectedCasinos, addCasino, clearCasinos } = useCasinoContext();

  useEffect(() => {
    getCasinoData();
  }, []);

  const getCasinoData = () => {
    CompassData.get_operator()
      .then((res) => {
        if (res?.success) {
          setCasinoData(res.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (casinoDrawer) {
      const storedCasinos = JSON.parse(localStorage.getItem("casinos")) || [];
      setLocalSelectedCasinos(storedCasinos);
    }
  }, [casinoDrawer]);

  useEffect(() => {
    setLocalSelectedCasinos(selectedCasinos);
  }, [selectedCasinos]);

  const filteredData = casinoData.filter((data) =>
    data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeDrawer = () => {
    setSearchQuery("");
    onCasinoDrawerClose();
  };

  const isChecked = (casino) => {
    return localSelectedCasinos.some((selected) => selected.id === casino.id);
  };

  const handleCheckboxChange = (data) => {
    setLocalSelectedCasinos((prev) => {
      const exists = prev.some((casino) => casino.id === data.id);
      if (exists) {
        return prev.filter((casino) => casino.id !== data.id);
      } else {
        return [...prev, data];
      }
    });
  };

  const handleSave = () => {
    clearCasinos();
    localSelectedCasinos.forEach((casino) => addCasino(casino));
    localStorage.setItem("casinos", JSON.stringify(localSelectedCasinos));
    setCasinoDrawer(false);
    toast.success("Casino selected successfully");
    setSearchQuery("");
  };

  return (
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
            onClick={handleSave}
            disabled={localSelectedCasinos.length === 0}
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
            placeholder="Search Casino"
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
              <span>No Casinos Found</span>
            </div>
            <div className="request-demo" onClick={() => setNewCasino(true)}>
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
                {filteredData.map((data) => (
                  <div className="casino-data-display" key={data.id}>
                    <input
                      type="checkbox"
                      className="casino-checkbox"
                      id={data.id}
                      checked={isChecked(data)}
                      onChange={() => handleCheckboxChange(data)}
                    />
                    <div className="casino-data-bar">
                      {/* <label htmlFor={data.id}>{data.name} ({data.state === "" ? "" : data.state + ", "}{data.country})</label> */}
                      <label htmlFor={data.id}>{data.name}</label>
                      <Link to={data.site_url} target="_blank">
                        {data.site_url}
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
  );
};

export default ChooseCasinoPage;
