import { useState, useEffect } from "react";
import PageHeader from "../../../component/PageHeader";
import { MultiSelect } from "primereact/multiselect";
import GameData from "../../../services/GameTracker";
import GameRankData from "../../../services/GameRank";

const GameLaunchAnalysisPage = () => {
  const user_company = localStorage.getItem("user_company");

  const [showFilter, setShowFilter] = useState(true);

  const [gamesList, setGamesList] = useState([]);
  const [casinosList, setCasinosList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [regions, setRegions] = useState([]);


  const [gamesLoader, setGamesLoader] = useState(false);
  const [casinosLoader, setCasinosLoader] = useState(false);
  const [countryLoader, setCountryLoader] = useState(false);
  const [regionLoader, setRegionLoader] = useState(false);

  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedCasinos, setSelectedCasinos] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const breadcrumb = [{ label: "Analysis" }];

  const fetchRegions = async () => {
    setRegionLoader(true);
    try {
      const res = await GameRankData.get_regions();
      if (res?.success === true) {
        const cleaned = res.data
          .filter((r) => r !== null && typeof r === "string")
          .map((r) => ({ label: r, value: r }));
        setRegions(cleaned);
      } else {
        console.error("Failed to fetch regions");
      }
    } catch (err) {
      console.error("fetchRegions error:", err);
    } finally {
      setRegionLoader(false);
    }
  };

  const fetchCountries = async () => {
    setCountryLoader(true);
    try {
      const res = await GameData.get_countries_provider_dashboard({
        game_provider: user_company,
      });
      if (res?.success === true) {
        setCountryList(res.data ?? []);
      } else {
        console.error("Failed to fetch countries");
      }
    } catch (err) {
      console.error("fetchCountries error:", err);
    } finally {
      setCountryLoader(false);
    }
  };

  const fetchCasinos = async () => {
    setCasinosLoader(true);
    try {
      const res = await GameData.get_casinos_provider_dashboard({
        game_provider: user_company,
      });
      if (res?.success === true) {
        setCasinosList(res.data ?? []);
      } else {
        console.error("Failed to fetch casinos");
      }
    } catch (err) {
      console.error("fetchCasinos error:", err);
    } finally {
      setCasinosLoader(false);
    }
  };

  const fetchGames = async () => {
    setGamesLoader(true);
    try {
      const res = await GameData.get_games_provider_dashboard({
        game_provider: user_company,
      });
      if (res?.success === true) {
        setGamesList(res.data ?? []);
      } else {
        console.error("Failed to fetch games");
      }
    } catch (err) {
      console.error("fetchGames error:", err);
    } finally {
      setGamesLoader(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchCountries();
    fetchCasinos();
    fetchGames();
  }, []);

  return (
    <div className="game-launch-analysis-page">
      <div className="game-launch-analysis-page__content">

        <PageHeader
          title="Game Launch Analysis"
          subtitle="Performance insights for casino game positioning"
          breadcrumb={breadcrumb}
          onToggleFilter={() => setShowFilter((prev) => !prev)}
          features={{
            search: false,
            filters: true,
            download: true,
            chat: false,
          }}
        />

        {showFilter && (
          <div className="game-launch-analysis-page__filter-bar">

            <MultiSelect
              options={regions}
              optionLabel="label"
              optionValue="value"
              filter
              placeholder="Select Region"
              loading={regionLoader}
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.value)}
              className="game-launch-analysis-page__filter-select"
            />

            <MultiSelect
              options={countryList}
              optionLabel="country_name"
              optionValue="country_name"
              filter
              placeholder="Select Country"
              loading={countryLoader}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.value)}
              className="game-launch-analysis-page__filter-select"
            />

            <MultiSelect
              options={casinosList}
              optionLabel="casino_name"
              optionValue="operator_id"
              filter
              placeholder="Select Casinos"
              loading={casinosLoader}
              value={selectedCasinos}
              onChange={(e) => setSelectedCasinos(e.value)}
              className="game-launch-analysis-page__filter-select"
            />

            <MultiSelect
              options={gamesList}
              optionLabel="game_name"
              optionValue="game_id"
              filter
              placeholder="Select Games"
              loading={gamesLoader}
              value={selectedGames}
              onChange={(e) => setSelectedGames(e.value)}
              className="game-launch-analysis-page__filter-select"
            />

          </div>
        )}

      </div>
    </div>
  );
};

export default GameLaunchAnalysisPage;