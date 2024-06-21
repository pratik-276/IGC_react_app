import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

const ChooseGamePage = ({ setNewCasino, onGameDrawerClose, gameDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [gameData, setGameData] = useState([]);
  const [lastList, setLastList] = useState(false);

  const filteredData = gameData.filter((data) => {
    return data?.game_original_name
      ?.toLowerCase()
      ?.includes(searchQuery?.toLowerCase());
  });

  const showNewCasinoDrawer = () => {
    setNewCasino(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await CompassData.get_game(currPage);
      if (!response?.results) {
        setLastList(true);
        return;
      }
      setPrevPage(currPage);
      setGameData((prevGameData) => [...prevGameData, ...response?.results]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!lastList && prevPage !== currPage) {
    fetchData();
  }
}, [currPage, lastList, prevPage]);

const onScroll = () => {
  if (listInnerRef.current) {
    const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      setCurrPage((prevPage) => prevPage + 1);
    }
  }
};

const closeDrawer = () => {
  setCurrPage(1)
}

const handleClose = () => {
  onGameDrawerClose();
  closeDrawer();
};

const handleBackButtonClick = () => {
  setCurrPage(1); 
  onGameDrawerClose(); 
};


return (
  <>
    <Drawer
      title="Choose Game"
      width="50%"
      className="choose_casino_drawer"
      closable={true}
      maskClosable={false}
      onClose={handleClose}
      open={gameDrawer}
      closeIcon={<CloseOutlined className="custom-close-icon" />}
      footer={
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handleBackButtonClick}
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
        {filteredData.length === 0 ? (
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
                <div
                  className="game-list-container"
                  onScroll={onScroll}
                  ref={listInnerRef}
                  style={{ height: '500px', overflowY: 'auto' }}
                >
                  {filteredData.map((data, index) => (
                    <div className="casino-data-display" key={data?.id}>
                      <input
                        type="checkbox"
                        className="casino-checkbox"
                        id={data?.id}
                      />
                      <div className="casino-data-bar">
                        <label htmlFor={data?.id}>
                          {data?.game_original_name}
                        </label>
                        <span style={{ color: "#8A92A6" }}>
                          {data?.game_provider_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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

export default ChooseGamePage;
