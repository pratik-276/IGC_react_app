import React, { useEffect, useState, useCallback, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useGameContext } from "../../context/gameContext";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const ChooseGamePage = ({ onGameDrawerClose, gameDrawer, setGameDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [gameData, setGameData] = useState([]);
  const [noGamesFound, setNoGamesFound] = useState(false);
  const gameListContainerRef = useRef(null);
  const { selectedGame, addGame, removeGame, clearGame, gameList } =
    useGameContext();

  const debouncedFetchData = useCallback(
    debounce(async (query, page) => {
      setLoader(true);
      setNoGamesFound(false);
      try {
        const data = {
          search_term: query ?? "",
        };
        const res = await CompassData.get_game(page, data);
        if (res) {
          if (res.results.length === 0) {
            setNoGamesFound(true);
          }
          setGameData((prevData) => [...prevData, ...res.results]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      setGameData([]);
      setNoGamesFound(false);
      setCurrPage(1);
      debouncedFetchData(searchQuery, 1);
    }
  }, [searchQuery, debouncedFetchData]);

  useEffect(() => {
    if (!searchQuery) {
      debouncedFetchData("", currPage);
    }
  }, [currPage, searchQuery, debouncedFetchData]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight && !loader) {
      setCurrPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (gameDrawer && gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
  }, [gameDrawer]);

  const handleClose = () => {
    onGameDrawerClose();
    clearGame();
    if (gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
  };

  const handleBackButtonClick = () => {
    onGameDrawerClose();
    clearGame();
    if (gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
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
    toast.success("Game selected successfully");
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
        <div
          className="game-list-container"
          ref={gameListContainerRef}
          style={{
            height: "500px",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
          onScroll={handleScroll}
        >
          {noGamesFound ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>No games found</p>
            </div>
          ) : (
            <>
              {gameData.map((data) => (
                <div className="casino-data-display" key={data?.id}>
                  <input
                    type="checkbox"
                    className="casino-checkbox"
                    id={data?.id}
                    checked={selectedGame.has(data)}
                    onChange={() => handleCheckboxChange(data)}
                  />
                  <div className="casino-data-bar">
                    <label htmlFor={data?.id}>{data?.game_original_name}</label>
                    <span style={{ color: "#8A92A6" }}>
                      {data?.game_provider_name}
                    </span>
                  </div>
                </div>
              ))}
              {loader && (
                <div
                  className="loader-container"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  <Loader />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ChooseGamePage;
