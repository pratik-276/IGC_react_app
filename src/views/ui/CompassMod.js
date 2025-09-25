import { useEffect, useState, useContext, useMemo } from "react";
import { Sidebar } from "primereact/sidebar";
import { Steps } from "primereact/steps";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import { Tooltip } from "primereact/tooltip";
import { MdInfoOutline } from "react-icons/md";

import { Spin } from "antd";

import CompassDataPage from "../modules/CompassDataPage";
import CompassData from "../../services/CompassApi";
import { ProfileSystem } from "../../context/ProfileContext";
import RequestCasinoModal from "./RequestCasinoModal";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./index.css";
import "./Compass.css";
import "./AccessBlur.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCircleCheck,
  FaSpinner,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import { addDays } from "date-fns";
import { FiMinusCircle } from "react-icons/fi";

const CompassMod = () => {
  const user_id = localStorage.getItem("user_id");

  const user_company = localStorage.getItem("user_company");

  const [open, setOpen] = useState(false);
  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";

  const [requestCasinoVisible, setRequestCasinoVisible] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [compassRead, setCompassRead] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCasino, setSelectedCasino] = useState([]);
  const [selectedGame, setSelectedGame] = useState([]);

  const [currentCasinoPage, setCurrentCasinoPage] = useState(1);
  const [casinoSearch, setCasinoSearch] = useState("");
  const [casinoData, setCasinoData] = useState([]);
  const [nextPageAvailable, setNextPageAvailable] = useState(true);
  const [loadingMoreCasinos, setLoadingMoreCasinos] = useState(false);

  const [currentGamePage, setCurrentGamePage] = useState(1);
  const [gameSearch, setGameSearch] = useState("");
  const [gameData, setGameData] = useState([]);
  const [nextGamePageAvailable, setNextGamePageAvailable] = useState(true);
  const [loadingMoreGames, setLoadingMoreGames] = useState(false);

  const [sectionTitleData, setSectionTitleData] = useState();
  const [sectionLoader, setSectionLoader] = useState(true);
  const [displayedGames, setDisplayedGames] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(sevenDaysLater);

  const [sectionTitle, setSectionTitle] = useState("");
  const [minPosition, setMinPosition] = useState(1);
  const [maxPosition, setMaxPosition] = useState(50);

  const [selectAllGames, setSelectAllGames] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (mode === "edit" && editData) {
      // Pre-fill Casino
      setSelectedCasino([
        { id: editData.operator_site_id, name: editData.name, site_url: "" },
      ]);

      // Pre-fill Game
      setSelectedGame([
        {
          game_id: editData.game_id,
          game_original_name: editData.game_original_name,
          game_provider_name: editData.game_provider,
        },
      ]);

      // Pre-fill details
      setStartDate(new Date(editData.start_date));
      setEndDate(new Date(editData.end_date));
      setSectionTitle(editData.section_name);
      setMinPosition(editData.min_position);
      setMaxPosition(editData.max_position);
    }
  }, [editData, mode]);

  const onStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const onEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const getCompassReadData = () => {
    setLoading(true);
    CompassData.compass_read({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res?.success) {
          setCompassRead(res?.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCompassReadData();
  }, [user_id]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getCasinoData(1, casinoSearch);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [casinoSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGameData(1, gameSearch);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [gameSearch]);

  useEffect(() => {
    const newDisplayedGames = {};

    for (const casino of selectedCasino) {
      for (const game of selectedGame) {
        const key = `${casino.id}-${game.game_id}`;
        newDisplayedGames[key] = true;
      }
    }

    setDisplayedGames(newDisplayedGames);
  }, [selectedCasino, selectedGame]);

  const getCasinoData = (page = 1, searchTerm = "") => {
    if (loadingMoreCasinos) return;

    setLoadingMoreCasinos(true);

    const payload = searchTerm.trim() ? { search_term: searchTerm.trim() } : {};

    CompassData.get_operator_updated(page, payload)
      .then((res) => {
        if (res?.results) {
          const newResults = res.results;
          setCasinoData((prev) =>
            page === 1 ? newResults : [...prev, ...newResults]
          );
          setCurrentCasinoPage(page);
          setNextPageAvailable(!!res.next);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoadingMoreCasinos(false);
      });
  };

  const getGameData = (page = 1, searchTerm = "") => {
    if (loadingMoreGames) return;

    setLoadingMoreGames(true);

    const payload = {
      search_term: searchTerm.trim() ? searchTerm.trim() : "",
      provider: user_company,
    };

    console.log(payload);
    CompassData.get_game_by_provider(page, payload)
      .then((res) => {
        if (res?.results) {
          const newResults = res.results;
          setGameData((prev) =>
            page === 1 ? newResults : [...prev, ...newResults]
          );
          setCurrentGamePage(page);
          setNextGamePageAvailable(!!res.next);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoadingMoreGames(false);
      });
  };

  const getSectionTitleData = (operator_id) => {
    CompassData.section_name_by_operator_site_id({ operator_id })
      .then((res) => {
        if (res?.success) {
          const transformed = res.data.map((item) => ({
            label: item.game_collection_title,
            value: item.game_collection_title,
          }));

          setSectionTitleData(transformed);
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSectionLoader(false);
      });
  };

  const settingMinPosition = (e) => {
    const min_position_val = e.target.value;
    if (min_position_val) {
      if (min_position_val < 1) {
        toast.error("Minimum Position can't be less than 1");
        return;
      }
      if (min_position_val > 100) {
        toast.error("Minimum Position can't be more than 100");
        return;
      }
      // if(maximum_position && min_position_val > maximum_position){
      //   console.log(maximum_position, min_position_val);
      //   toast.error("Minimum Position can't be more than maximum position");
      //   return;
      // }
    }
    setMinPosition(e.target.value);
  };

  const settingMaxPosition = (e) => {
    const max_position_val = e.target.value;
    if (max_position_val) {
      if (max_position_val < 1) {
        toast.error("Maximum Position can't be less than 1");
        return;
      }
      if (max_position_val > 100) {
        toast.error("Maximum Position can't be more than 100");
        return;
      }
    }
    setMaxPosition(e.target.value);
  };

  const handleSaveCompass = () => {
    setSubmitLoading(true);

    if (mode === "edit") {
      const payload = {
        id: editData.id,
        game_id: selectedGame[0].game_id,
        operator_id: selectedCasino[0].id,
        game_name: selectedGame[0].game_original_name,
        game_provider: selectedGame[0].game_provider_name,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        section_name: sectionTitle,
        min_position: minPosition,
        max_position: maxPosition,
      };

      // console.log("Edit Payload : ", payload);
      CompassData.compass_edit(payload)
        .then((res) => {
          if (res?.success) {
            toast.success("Compass updated successfully!");
            getCompassReadData();
            setOpen(false);
            resetForm();
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update Compass");
        })
        .finally(() => setSubmitLoading(false));
      return;
    }

    const data = [];

    const min_postion_int = parseInt(minPosition);
    const max_position_int = parseInt(maxPosition);
    if (min_postion_int > max_position_int) {
      toast.error("Minimum position can't be more than maximum position");
      setSubmitLoading(false);
      return;
    }
    if (!startDate) {
      toast.error("Start Date is required");
      setSubmitLoading(false);
      return;
    }
    if (!endDate) {
      toast.error("End Date is required");
      setSubmitLoading(false);
      return;
    }
    if (startDate > endDate) {
      toast.error("Start date can't be after End date");
      setSubmitLoading(false);
      return;
    }

    selectedCasino?.forEach((casino) => {
      selectedGame?.forEach((g) => {
        const uniqueId = `${casino.id}-${g.game_id}`;
        if (displayedGames[uniqueId]) {
          data.push({
            user_id: user_id,
            operator_id: casino.id,
            game_id: g.game_id,
            start_date: startDate,
            end_date: endDate,
            game_name: g.game_original_name,
            game_provider: g.game_provider_name,
            section_name: sectionTitle,
            min_position: minPosition,
            max_position: maxPosition,
          });
        }
      });
    });

    if (data.length === 0) {
      toast.error("No combinations selected to save.");
      return;
    }

    CompassData.compass_create(data)
      .then((res) => {
        if (res?.success === true) {
          toast.success("Combination Create Successfully!");
          setOpen(false);
          // setStartDate(formatDate(today));
          // setEndDate(formatDate(sevenDaysLater));
          // getCompassReadData();
          // setSelectedCasino([]);
          // setSelectedGame([]);
          // setSelectAllGames(false);
          // setDisplayedGames({});
          resetForm();

          CompassData.compass_create_mail({ user_id: user_id })
            .then((res) => {
              console.log("Compass Mailed");
            })
            .catch((err) => {
              console.log("Compass mail error");
            });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        handleFinish();
        setSubmitLoading(false);
      });
  };

  const resetForm = () => {
    setStartDate(today);
    setEndDate(sevenDaysLater);
    setSelectedCasino([]);
    setSelectedGame([]);
    setSelectAllGames(false);
    setDisplayedGames({});
    getCompassReadData();
    setMode("create");
    setEditData(null);
  };

  const tableRows = useMemo(() => {
    if (!selectedCasino?.length || !selectedGame?.length) return [];

    const rows = [];

    for (const casino of selectedCasino) {
      for (const gameItem of selectedGame) {
        const uniqueCasinoGameId = `${casino.id}-${gameItem.game_id}`;
        if (displayedGames[uniqueCasinoGameId]) {
          rows.push(
            <tr key={uniqueCasinoGameId} className="table-body-items-table">
              <td scope="row" style={{ width: "40%", fontSize: "14px" }}>
                <p className="m-0">{casino.name}</p>
                <a
                  href={casino.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    maxWidth: "250px",
                    color: "#392f6c",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={casino.site_url}
                >
                  {casino.site_url}
                </a>
              </td>
              <td style={{ width: "20%", fontSize: "14px" }}>
                <p className="m-0">{gameItem.game_original_name}</p>
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "200px",
                    color: "#392f6c",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={gameItem.game_provider_name}
                >
                  {gameItem.game_provider_name}
                </span>
              </td>
              <td className="text-end">
                <FiMinusCircle
                  style={{
                    fontSize: "25px",
                    color: "#607290",
                    cursor: "pointer",
                  }}
                  onClick={() => removeCombination(casino.id, gameItem.game_id)}
                />
              </td>
            </tr>
          );
        }
      }
    }

    return rows;
  }, [selectedCasino, selectedGame, displayedGames]);

  const removeCombination = (casinoId, gameId) => {
    const uniqueId = `${casinoId}-${gameId}`;

    setDisplayedGames((prev) => {
      const updated = { ...prev };
      delete updated[uniqueId];
      return updated;
    });

    setSelectedGame((prevGames) =>
      prevGames.filter((g) => g.game_id !== gameId)
    );

    setSelectedCasino((prevCasinos) => {
      const stillHasGame = selectedGame.some(
        (game) => displayedGames[`${casinoId}-${game.game_id}`]
      );

      if (!stillHasGame) {
        return prevCasinos.filter((c) => c.id !== casinoId);
      }
      return prevCasinos;
    });
  };

  const isCasinoChecked = (casino) => {
    return selectedCasino.some((selected) => selected.id === casino.id);
  };

  const handleCasinoCheckboxChange = (data) => {
    getSectionTitleData(data.id);
    setSelectedCasino([data]);
  };

  const isGameChecked = (game) => {
    return selectedGame.some((selected) => selected.game_id === game.game_id);
  };

  const handleGameCheckboxChange = (data) => {
    if (mode === "edit") {
      // single select
      setSelectedGame([data]);
    } else {
      // multi select (max 10)
      setSelectedGame((prev) => {
        const exists = prev.some((g) => g.game_id === data.game_id);
        if (exists) {
          return prev.filter((g) => g.game_id !== data.game_id);
        } else {
          if (prev.length < 10) {
            return [...prev, data];
          } else {
            toast.error("Only 10 games can be selected at once");
            return prev;
          }
        }
      });
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, stepItems.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    setOpen(false);
    setActiveStep(0);
    setCasinoSearch("");
    setGameSearch("");
    resetForm();
  };

  // Custom renderer for step icons
  const itemRenderer = (item, itemIndex) => {
    const isActive = activeStep === itemIndex;
    const backgroundColor = isActive ? "#392f6c" : "var(--surface-b)";
    const textColor = isActive ? "var(--surface-b)" : "#392f6c";

    return (
      <span
        className="inline-flex align-items-center justify-content-center border-circle border-1 h-3rem w-3rem z-1 cursor-pointer"
        style={{
          backgroundColor,
          color: textColor,
          marginTop: "-25px",
        }}
        onClick={() => setActiveStep(itemIndex)}
      >
        <i className={item.icon} />
      </span>
    );
  };

  const stepItems = [
    { icon: "pi pi-building", template: (item) => itemRenderer(item, 0) },
    { icon: "pi pi-desktop", template: (item) => itemRenderer(item, 1) },
    { icon: "pi pi-check", template: (item) => itemRenderer(item, 2) },
  ];

  const handleSelectAllGames = () => {
    setSelectAllGames((prev) => {
      if (prev) {
        setSelectedGame([]);
      } else {
        setSelectedGame([
          ...gameData
            .map((item, index) => ({
              ...item,
              id: index + 1,
            }))
            .slice(0, 10),
        ]);
      }
      return !prev;
    });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="d-flex flex-column h-full">
            {/* Header */}
            <div className="px-3">
              <h4
                className="m-md-0"
                style={{
                  color: "#392f6c",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Select Casino
              </h4>
              <span>Start configuration by adding operator first</span>
            </div>

            <div className="px-3 mt-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                  placeholder="Search Casino"
                  className="w-100"
                  value={casinoSearch}
                  onChange={(e) => setCasinoSearch(e.target.value)}
                />
              </IconField>
            </div>

            <div
              className="flex-1 overflow-auto px-3 mt-3 d-flex flex-column gap-1"
              style={{ minHeight: 0 }}
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                const nearBottom =
                  scrollTop + clientHeight >= scrollHeight - 50;

                if (nearBottom && nextPageAvailable && !loadingMoreCasinos) {
                  getCasinoData(currentCasinoPage + 1, casinoSearch);
                }
              }}
            >
              {casinoData.map((data) => (
                <div className="casino-data-display rounded-1" key={data.id}>
                  <input
                    type="checkbox"
                    className="casino-checkbox"
                    id={data.id}
                    checked={isCasinoChecked(data)}
                    onChange={() => handleCasinoCheckboxChange(data)}
                  />
                  <div className="casino-data-bar">
                    <label htmlFor={data.id}>{data.name}</label>
                    <a
                      href={data.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        maxWidth: "400px",
                        color: "#392f6c",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={data.site_url}
                    >
                      {data.site_url}
                    </a>
                  </div>
                </div>
              ))}

              {loadingMoreCasinos && (
                <div className="text-center py-2">
                  <Spin size="small" />
                </div>
              )}

              {casinoData.length === 0 && !loadingMoreCasinos && (
                <div className="text-center py-2">
                  <button
                    className="btn btn-link"
                    style={{ color: "#392f6c", fontWeight: 600 }}
                    onClick={() => setRequestCasinoVisible(true)}
                  >
                    + Request new casino
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="d-flex flex-column h-full">
            {/* Header */}
            <div className="px-3">
              <h4
                className="m-md-0"
                style={{
                  color: "#392f6c",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Select Game
              </h4>
              <span>Selected Games (Maximum 10 allowed)</span>
            </div>

            <div className="px-3 mt-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                  placeholder="Search Game"
                  className="w-100"
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                />
              </IconField>
            </div>

            <div
              className="flex-1 overflow-auto px-3 mt-3 d-flex flex-column gap-1"
              style={{ minHeight: 0 }}
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                const nearBottom =
                  scrollTop + clientHeight >= scrollHeight - 50;

                if (nearBottom && nextGamePageAvailable && !loadingMoreGames) {
                  getGameData(currentGamePage + 1, gameSearch);
                }
              }}
            >
              <div
                className="casino-data-display rounded-1"
                key="game_id_select_all"
              >
                <input
                  type="checkbox"
                  className="casino-checkbox"
                  id="game_id_select_all"
                  checked={selectAllGames}
                  onChange={() => handleSelectAllGames()}
                />
                <div className="casino-data-bar">
                  <label htmlFor="game_id_select_all">Select All</label>
                  <span
                    style={{
                      display: "inline-block",
                      maxWidth: "400px",
                      color: "#392f6c",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={" "}
                  >
                    {" "}
                  </span>
                </div>
              </div>
              {gameData.map((data) => (
                <div
                  className="casino-data-display rounded-1"
                  key={data.game_id}
                >
                  <input
                    type="checkbox"
                    className="casino-checkbox"
                    id={data.game_id}
                    checked={isGameChecked(data)}
                    onChange={() => handleGameCheckboxChange(data)}
                  />
                  <div className="casino-data-bar">
                    <label htmlFor={data.game_id}>
                      {data.game_original_name}
                    </label>
                    <span
                      style={{
                        display: "inline-block",
                        maxWidth: "400px",
                        color: "#392f6c",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={data.game_provider_name}
                    >
                      {data.game_provider_name}
                    </span>
                  </div>
                </div>
              ))}
              {loadingMoreCasinos && (
                <div className="text-center py-2">
                  <Spin size="small" />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="d-flex flex-column h-full">
            {/* Header */}

            <div className="px-3">
              <h4
                className="m-md-0"
                style={{
                  color: "#392f6c",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Tracker Details
              </h4>
              <span>
                All the combination below are formed according to your selection
                of games and casino. You can remove combination that you don’t
                want to track.
              </span>
            </div>

            <div className="px-3 mt-3">
              <div className="compass-data-table track_game_table pt-3">
                <table className="table table-bordered m-0">
                  <thead className="table-heading-name">
                    <tr>
                      <th scope="col" style={{ width: "50%" }}>
                        Casino Name
                      </th>
                      <th scope="col" style={{ width: "40%" }}>
                        Game Name
                      </th>
                      <th
                        scope="col"
                        style={{ width: "10%" }}
                        className="text-end"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body-items">
                    {selectedCasino?.length > 0 && selectedGame?.length > 0 ? (
                      tableRows
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center" }}>
                          Selet Casino and Games first
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="tracking-game-time pb-4">
                  <div
                    className="tracking-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1.5rem 0.5rem",
                    }}
                  >
                    <div className="form-group credit-field">
                      <FloatLabel>
                        <div className="d-flex align-items-center justify-content-start">
                          {/* <label htmlFor="minPosition">Min Position 
                          </label> */}
                          <p style={{ fontWeight: "bold" }} className="mb-0">
                            Tracking starts on
                          </p>
                          <MdInfoOutline
                            className="tracking-start-tooltip-target m-2"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <Tooltip
                            target=".tracking-start-tooltip-target"
                            content="Date when tracking for the casino game pair starts"
                            position="top"
                            className="custom-tooltip"
                          />
                        </div>
                        <Calendar
                          inputId="tracking_start"
                          value={startDate}
                          onChange={onStartDateChange}
                          required
                          className="w-full"
                          appendTo="self"
                          minDate={addDays(new Date(), 1)}
                        />
                        {/* <label htmlFor="tracking_start">
                          Tracking starts on
                        </label> */}
                      </FloatLabel>
                    </div>

                    <div className="form-group credit-field">
                      <FloatLabel>
                        <div className="d-flex align-items-center justify-content-start">
                          {/* <label htmlFor="minPosition">Min Position 
                          </label> */}
                          <p style={{ fontWeight: "bold" }} className="mb-0">
                            Tracking ends on
                          </p>
                          <MdInfoOutline
                            className="tracking-end-tooltip-target m-2"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <Tooltip
                            target=".tracking-end-tooltip-target"
                            content="Date when tracking for the casino game pair ends"
                            position="top"
                            className="custom-tooltip"
                          />
                        </div>
                        <Calendar
                          inputId="tracking_end"
                          value={endDate}
                          onChange={onEndDateChange}
                          required
                          className="w-full"
                          appendTo="self"
                          minDate={addDays(new Date(), 2)}
                        />
                        {/* <label htmlFor="tracking_end">Tracking ends on</label> */}
                      </FloatLabel>
                    </div>
                  </div>
                  <div
                    className="tracking-grid mt-4"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1.5rem 0.5rem",
                    }}
                  >
                    <div className="form-group credit-field">
                      <FloatLabel>
                        <div className="d-flex align-items-center justify-content-start">
                          {/* <label htmlFor="minPosition">Min Position 
                          </label> */}
                          <p style={{ fontWeight: "bold" }} className="mb-0">
                            Section Title
                          </p>
                          <MdInfoOutline
                            className="section-title-tooltip-target m-2"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <Tooltip
                            target=".section-title-tooltip-target"
                            content="Section within the casino where the selected games are expected to be present"
                            position="top"
                            className="custom-tooltip"
                          />
                        </div>
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          filter
                          loading={sectionLoader}
                          value={sectionTitle}
                          options={sectionTitleData}
                          onChange={(e) => setSectionTitle(e.value)}
                          appendTo="self"
                          className="w-full"
                        />
                        {/* <label htmlFor="dd-city">Section Title</label> */}
                      </FloatLabel>
                    </div>

                    <div className="form-group credit-field">
                      <FloatLabel>
                        <div className="d-flex align-items-center justify-content-start">
                          {/* <label htmlFor="minPosition">Min Position 
                          </label> */}
                          <p style={{ fontWeight: "bold" }} className="mb-0">
                            Min Position
                          </p>
                          <MdInfoOutline
                            className="min-tooltip-target m-2"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <Tooltip
                            target=".min-tooltip-target"
                            content="Minimum position within the section that the games can have"
                            position="top"
                            className="custom-tooltip"
                          />
                        </div>

                        <InputText
                          id="minPosition"
                          value={minPosition}
                          onChange={(e) => settingMinPosition(e)}
                          className="w-full"
                        />
                      </FloatLabel>
                    </div>

                    <div className="form-group credit-field">
                      <FloatLabel>
                        <div className="d-flex align-items-center justify-content-start">
                          {/* <label htmlFor="minPosition">Min Position 
                          </label> */}
                          <p style={{ fontWeight: "bold" }} className="mb-0">
                            Max Position
                          </p>
                          <MdInfoOutline
                            className="max-tooltip-target m-2"
                            style={{
                              fontSize: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <Tooltip
                            target=".max-tooltip-target"
                            content="Maximum position within the section that the games can have"
                            position="top"
                            className="custom-tooltip"
                          />
                        </div>
                        <InputText
                          id="maxPosition"
                          value={maxPosition}
                          onChange={(e) => settingMaxPosition(e)}
                          className="w-full"
                        />
                        {/* <label htmlFor="maxPosition">Max Position</label> */}
                      </FloatLabel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`w-100 h-100 ${isPlanExpired ? "overlay active" : ""}`}>
        <CompassDataPage
          open={open}
          // setOpen={setOpen}
          setOpen={(payload) => {
            if (typeof payload === "object") {
              setMode(payload.mode);
              setEditData(payload.data);
              setOpen(true);
            } else {
              setMode("create");
              setEditData(null);
              setOpen(payload);
            }
          }}
          compassRead={compassRead}
          loading={loading}
          getCompassReadData={getCompassReadData}
        />
      </div>

      <Sidebar
        visible={open}
        position="right"
        onHide={() => {
          setOpen(false);
          setActiveStep(0);
          resetForm();
        }}
        className="p-sidebar-md text-sm"
        header={
          <h4
            className="m-md-0 "
            style={{ color: "#392f6c", fontSize: "1.2rem" }}
          >
            {mode === "edit" ? "Edit Compass" : "Calibrate Compass"}
          </h4>
        }
      >
        <div className="flex flex-column h-full">
          <Steps
            model={stepItems}
            activeIndex={activeStep}
            readOnly={false}
            className="pt-5"
          />

          {/* Step Content - Take full available height */}
          <div className="flex-1 overflow-auto">{renderStepContent()}</div>

          {/* Bottom Buttons */}
          <div className="flex justify-content-end gap-2 border-top-1 surface-border pt-2">
            {activeStep > 0 && (
              <button className="btn-filter" onClick={handleBack}>
                <FaArrowLeft className="me-2" /> Back
              </button>
            )}
            {activeStep < stepItems.length - 1 ? (
              <button
                className="btn-filter"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !selectedCasino) ||
                  (activeStep === 1 && !selectedGame)
                }
              >
                Next <FaArrowRight className="ms-2" />
              </button>
            ) : (
              <button
                className="btn-filter"
                onClick={handleSaveCompass}
                loading={submitLoading}
                disabled={
                  !startDate ||
                  !endDate ||
                  !selectedCasino.length === 0 ||
                  selectedGame.length === 0 ||
                  submitLoading
                }
              >
                {submitLoading ? (
                  <FaSpinner className="me-2 spinner-icon" />
                ) : (
                  <FaCheck className="me-2" />
                )}{" "}
                Submit
              </button>
            )}
          </div>
        </div>
      </Sidebar>

      <RequestCasinoModal
        visible={requestCasinoVisible}
        onHide={() => setRequestCasinoVisible(false)}
        onSubmit={async (payload) => {
          // call API here
          console.log("Requesting casino with data:", payload);
          // await CompassData.request_new_casino(payload);
        }}
      />
    </>
  );
};

export default CompassMod;
