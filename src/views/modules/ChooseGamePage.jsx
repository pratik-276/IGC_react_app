import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import _ from "lodash";
import { useGameContext } from "../../context/gameContext";
import toast from "react-hot-toast";

const ChooseGamePage = ({ onGameDrawerClose, gameDrawer, setGameDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [gameData, setGameData] = useState([]);
  const [lastList, setLastList] = useState(false);

  const { selectedGame, addGame, removeGame, clearGame, gameList } =
    useGameContext();

  const filteredData = gameData.filter((data) =>
    data?.game_original_name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const fetchData = async () => {
    if (loading || lastList) return;
    setLoading(true);
    try {
      const response = await CompassData.get_game(currPage);
      if (response?.results?.length === 0) {
        setLastList(true);
      } else {
        setGameData((prevGameData) => [...prevGameData, ...response.results]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (gameDrawer) {
      fetchData();
    } else {
      setCurrPage(1);
      setGameData([]);
      setLastList(false);
      setLoader(true);
      if (listInnerRef.current) {
        listInnerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [gameDrawer, currPage]);

  const onScroll = _.debounce(() => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        !loading &&
        !lastList
      ) {
        setCurrPage((prevPage) => prevPage + 1);
      }
    }
  }, 300);

  const handleClose = () => {
    onGameDrawerClose();
    clearGame();
  };

  const handleBackButtonClick = () => {
    onGameDrawerClose();
    clearGame();
  };

  const handleCheckboxChange = (data) => {
    if (selectedGame.has(data)) {
      removeGame(data);
    } else {
      addGame(data);
    }
  };

  const handleSave = () => {
    const selectedArray = Array.from(selectedGame);
    gameList(selectedArray);
    setGameDrawer(false);
    toast.success("Game selected succesfully")
  };

  return (
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
            onClick={handleSave}
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
          </div>
        ) : (
          <div>
            {loader ? (
              <Loader />
            ) : (
              <div
                className="game-list-container"
                onScroll={onScroll}
                ref={listInnerRef}
                style={{ height: "500px", overflowY: "auto" }}
              >
                {filteredData.map((data) => (
                  <div className="casino-data-display" key={data?.id}>
                    <input
                      type="checkbox"
                      className="casino-checkbox"
                      id={data?.id}
                      checked={selectedGame.has(data)}
                      onChange={() => handleCheckboxChange(data)}
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

export default ChooseGamePage;
