import React, { useEffect, useState, useCallback, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useGameContext } from "../../context/gameContext";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { provider } from "../auth/config";

const ChooseGamePage = ({ onGameDrawerClose, gameDrawer, setGameDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [gameData, setGameData] = useState([]);
  const [noGamesFound, setNoGamesFound] = useState(false);
  const gameListContainerRef = useRef(null);

  const [localSelectedGames, setLocalSelectedGames] = useState([]);

  const { selectedGame, addGame, clearGame } = useGameContext();

  const fetchData = useCallback(async (query, page) => {
    setLoader(true);
    setNoGamesFound(false);
    const user_company = localStorage.getItem("user_company");
    try {
      const data = { search_term: query ?? "" };
      const res = await CompassData.get_game_by_provider(page, data);
      if (res) {
        if (res.results.length === 0) {
          setNoGamesFound(true);
        }
        // console.log("Game Data");
        // console.log(gameData);
        // const finalData = [...gameData, ...res.results];
        // const updatedResults = finalData.map((item, index) => ({
        //   ...item,
        //   id: index + 1,
        // }));
        // console.log(updatedResults);
        setGameData((prevResults) => [...prevResults, ...res.results]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  }, []);

  const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    if (gameDrawer) {
      setSearchQuery("");
      setGameData([]);
      setCurrPage(1);
      setNoGamesFound(false);

      debouncedFetchData("", 1);

      if (gameListContainerRef.current) {
        gameListContainerRef.current.scrollTop = 0;
      }
    }
  }, [gameDrawer, debouncedFetchData]);

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
    setCurrPage(1);
    debouncedFetchData("", 1);
    if (gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
  };

  const handleBackButtonClick = () => {
    onGameDrawerClose();
    clearGame();
    setCurrPage(1);
    debouncedFetchData("", 1);
    if (gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (gameDrawer) {
      const storedCasinos = JSON.parse(localStorage.getItem("games")) || [];
      setLocalSelectedGames(storedCasinos);
    }
  }, [gameDrawer]);

  useEffect(() => {
    setLocalSelectedGames(selectedGame);
  }, [selectedGame]);

  const isChecked = (game) => {
    return localSelectedGames.some((selected) => selected.id === game.id);
  };

  const handleCheckboxChange = (data) => {
    setLocalSelectedGames((prev) => {
      const exists = prev.some((casino) => casino.id === data.id);
      if (exists) {
        return prev.filter((casino) => casino.id !== data.id);
      } else {
        return [...prev, data];
      }
    });
  };

  const handleSave = () => {
    clearGame();
    localSelectedGames.forEach((casino) => addGame(casino));
    localStorage.setItem("games", JSON.stringify(localSelectedGames));
    setGameDrawer(false);
    toast.success("Game selected successfully");
    setSearchQuery("");
    setCurrPage(1);
    debouncedFetchData("", 1);
    if (gameListContainerRef.current) {
      gameListContainerRef.current.scrollTop = 0;
    }
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
            className={`compass-sidebar-back ${
              selectedGame.size === 0 ? "btn-disabled" : ""
            }`}
            onClick={handleSave}
            disabled={selectedGame.size === 0}
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
              {gameData.map((item, index) => ({
                ...item,
                id: index + 1,
              })).map((data) => (
                <div className="casino-data-display" key={data?.id}>
                  <input
                    type="checkbox"
                    className="casino-checkbox"
                    id={data?.id}
                    checked={isChecked(data)}
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
