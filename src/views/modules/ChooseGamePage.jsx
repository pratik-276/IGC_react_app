import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import CompassData from "../../services/CompassApi";
import Loader from "../../layouts/loader/Loader";

const ChooseGamePage = ({ setNewCasino }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
  const [loader, setLoader] = useState(true);

  const filteredData = gameData.filter((data) => {
    return data?.game_original_name
      ?.toLowerCase()
      ?.includes(searchQuery?.toLowerCase());
  });

  const showNewCasinoDrawer = () => {
    setNewCasino(true);
  };

  const getGameData = () => {
    CompassData.get_game()
      .then((res) => {
        if (res?.success === true) {
          setGameData(res?.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    getGameData();
  }, []);

  return (
    <>
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
              </>
            )}
          </div>
        )}
      </div>
      <div className="line">
        <span></span>
      </div>
    </>
  );
};

export default ChooseGamePage;
