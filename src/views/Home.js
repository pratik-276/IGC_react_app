import {
  Button,
  ButtonBase,
  InputAdornment,
  Link,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaGem, FaPlus, FaAngleRight } from "react-icons/fa6";
import Call from "./../services/Call";
import Video from "../assets/images/intro.mp4";
import { Card, CardBody, CardFooter, CardHeader, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import Autocomplete from "@mui/material/Autocomplete";
import toast from "react-hot-toast";
import CompassData from "../services/CompassApi";
import { useContactSales } from "../context/confirmationContext";
import RequestCasinoModal from "./ui/RequestCasinoModal";

const Home = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(null);
  const { showContactSalesConfirmation } = useContactSales();
  const [requestCasinoVisible, setRequestCasinoVisible] = useState(false);
  const [showNoCasino, setShowNoCasino] = useState(false);

  async function getData() {
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      const res = await Call({
        path: "get_profile",
        method: "POST",
        data: {
          user_id: userId,
        },
      });

      setProfile(res.data);
      localStorage.setItem("is_admin", res.data.is_admin);
      localStorage.setItem("provider_id", res.data.provider_id);
      // Patch for Admin Dashboard siderbar button visibility on first open
      navigate("/");

      // const _operators = await Call({
      //   path: 'get_operator_by_provider',
      //   method: 'POST'
      // })
      CompassData.get_operator_by_provider({
        provider: localStorage.getItem("user_company"),
      })
        .then((res) => {
          if (res?.success) {
            setOperators(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // setOperators(_operators.data)
      // console.log(_operators.data)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(searchText, searchInput);
    // console.log(isSearchMenuOpen != null, !isSearchMenuOpen, searchText != "", operators.map(op => op.name)?.includes(searchText))
  }, [searchText]);

  const navigate = useNavigate();

  const NoTrackerFound = ({ navigate }) => {
    return (
      <Card
        className="mt-5"
        style={{ backgroundColor: "#EDF5F0", maxWidth: "600px" }}
      >
        <CardBody
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h4 style={{ fontWeight: "bold" }}>No Casino Found</h4>
          </div>
          <div>
            {/* <Button onClick={() => navigate('casino-requests')} size="small" variant="outlined" style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }} endIcon={<FaPlus size={14} />}>
            Create New Casino Request
          </Button> */}
            <Button
              onClick={() => setRequestCasinoVisible(true)}
              size="small"
              variant="outlined"
              style={{
                color: "white",
                backgroundColor: "#392f6c",
                marginBottom: "0.5rem",
              }}
              endIcon={<FaPlus size={14} />}
            >
              Create New Casino Request
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      {loading && (
        <div style={{ display: "flex" }}>
          <ProgressSpinner />
        </div>
      )}
      {!loading && (
        <div className="container">
          <div className="d-flex flex-row justify-content-between">
            <div>
              <h3>{`${greetBasedOnTime()}, ${capitalizeFirstLetter(
                profile?.first_name
              )}`}</h3>
              <div className="compass-data">
                <span>we have kept all your reports ready for you</span>
              </div>
            </div>
            <div className="d-flex flex-column align-items-end">
              {/* <Button variant="contained" style={{ backgroundColor: '#392f6c', marginBottom: '0.5rem' }} startIcon={<FaGem />}  onClick={() => toast.error("Coming Soon")}>
              Upgrade Plan
            </Button> */}

              <Button
                className="btn-upgrade"
                onClick={showContactSalesConfirmation}
              >
                <FaGem /> <span>Upgrade Plan</span>
              </Button>
              {/* <div className="compass-data">
              <span>
                {profile?.plan_text_show}
              </span>
            </div> */}
            </div>
          </div>

          <div className="pt-5">
            <Card className="p-3">
              <CardBody>
                <h5 style={{ fontWeight: "600", marginBottom: "0px" }}>
                  Find and Track Casinos Now!
                </h5>
                <div className="compass-data pb-5">
                  <span>we have kept all your reports ready for you</span>
                </div>
                <div style={{ width: "250px" }}>
                  <Autocomplete
                    options={operators.map((op, index) => {
                      return { label: op.name, id: index, key: index };
                    })}
                    autoComplete
                    noOptionsText={"Other"}
                    size="small"
                    freeSolo
                    onOpen={(e) => setIsSearchMenuOpen(true)}
                    onClose={(e) => setIsSearchMenuOpen(false)}
                    value={searchText}
                    onChange={(e) => {
                      //console.log(e);
                      if (e._reactName == "onClick")
                        setSearchText(e.target.textContent);
                      else setSearchText(e.target.value);
                    }}
                    onInputChange={(e) => {
                      //console.log(e);
                      try{
                        const sText = e ? e.target ? e.target.value : "" : "";
                        setSearchText(e ? e.target ? e.target.value : "" : "");
                        if(!operators.some(op => op.name.toLowerCase().includes(sText.toLowerCase())) && sText !== ""){
                          setShowNoCasino(true);
                        }else{
                          setShowNoCasino(false);
                        }
                      } catch (error) {
                        console.error("Error in onChange handler:", error);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Casino (type and press enter)"
                      />
                    )}
                  />
                </div>
                {
                  // Not first time and menu is closed
                  isSearchMenuOpen != null &&
                  !isSearchMenuOpen &&
                  searchText != "" &&
                  operators.map((op) => op.name)?.includes(searchText) ? (
                    <div>
                      <TrackDetail
                        name={
                          operators.filter(
                            (o) =>
                              o.name.toLowerCase() == searchText.toLowerCase()
                          )[0].name
                        }
                        name_show={
                          operators
                          .filter(
                            (o) => o.name.toLowerCase() === searchText.toLowerCase()
                          )[0]
                          ? `${operators.filter(
                              (o) => o.name.toLowerCase() === searchText.toLowerCase()
                            )[0].name} (${operators.filter(
                              (o) => o.name.toLowerCase() === searchText.toLowerCase()
                            )[0].geographies} and more)`
                          : ""
                        }
                        url={
                          operators.filter(
                            (o) =>
                              o.name.toLowerCase() == searchText.toLowerCase()
                          )[0].site_url
                        }
                        navigate={navigate}
                      />
                    </div>
                  ) : isSearchMenuOpen != null &&
                    !isSearchMenuOpen &&
                    searchText != "" &&
                    !operators.map((op) => op.name)?.includes(searchText) ? (
                    <div>
                      <NoTrackerFound navigate={navigate} />
                    </div>
                  )
                   : showNoCasino ? (
                    <div>
                      <NoTrackerFound navigate={navigate} />
                    </div>
                  )
                  : (
                    ""
                  )
                }
              </CardBody>
            </Card>
          </div>

          <div className="pt-4">
            {/* <h5 style={{ fontSize: '20px', fontWeight: "500", marginBottom: '0px' }}>
            Free Reports
          </h5>
          <div className="compass-data pb-3">
            <span>
              Recommended based on your profile
            </span>
          </div> */}
            <div className="d-flex flex-row gap-3">
              <ReportCard
                onButtonPress={() => navigate("dashboard")}
                title="Positions Dashboard"
              />
              {/* <ReportCard
                onButtonPress={() => navigate("game-provider-marketshare")}
                title="Provider Marketshare"
              /> */}
              <ReportCard
                onButtonPress={() => navigate("game-rank-report")}
                title="Game Rank"
              />
              {/* <ReportCard onButtonPress={() => toast.error("Coming Soon")} title="Game Provider Marketshare" />
            <ReportCard onButtonPress={() => toast.error("Coming Soon")} title="Game Rank" /> */}
            </div>
          </div>

          {/* <div className="pt-4">
          <h5 style={{ fontSize: '20px', fontWeight: "500", marginBottom: '0px' }}>
            Premium Reports
          </h5>
          <div className="compass-data pb-3">
            <span>
              Recommended based on your profile
            </span>
          </div>
          <div className="d-flex flex-row gap-3 flex-wrap">
            <ReportCard onButtonPress={() => { }} title="Game Provider Marketshare" />
            <ReportCard onButtonPress={() => { }} title="Game Rank" />
            <ReportCard onButtonPress={() => { }} title="Game Provider Marketshare" />
          </div>
        </div> */}
        </div>
      )}

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

const ReportCard = ({ title, onButtonPress }) => {
  return (
    <Card style={{ minWidth: "300px" }}>
      <CardBody>
        <Image width="300px" src="report_placeholder.png" />
      </CardBody>
      <CardFooter>
        <div className="pb-2 font-semibold">{title}</div>
        <Button
          onClick={onButtonPress}
          size="small"
          variant="outlined"
          style={{
            color: "white",
            backgroundColor: "#392f6c",
            marginBottom: "0.5rem",
          }}
          endIcon={<FaAngleRight />}
        >
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
};

const TrackDetail = ({ name, name_show, url, navigate }) => {
  return (
    <Card
      className="mt-5"
      style={{ backgroundColor: "#EDF5F0", maxWidth: "800px" }}
    >
      <CardBody
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h5>
            <strong>{localStorage.getItem("user_company")}</strong> games are
            available on <strong>{name_show}</strong>
          </h5>
          <p>
            Example URL: <Link>{url}</Link>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* <Button onClick={() => navigate('game-tracking')} size="small" variant="outlined" style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }} endIcon={<FaAngleRight />}>
            View Tracker
          </Button> */}
          <Button
            onClick={() => {
              localStorage.setItem(
                "selectedCasinos",
                JSON.stringify([{ name: name, code: name }])
              );
              navigate("dashboard");
            }}
            size="small"
            variant="outlined"
            style={{
              color: "white",
              backgroundColor: "#392f6c",
              marginBottom: "0.5rem",
            }}
            endIcon={<FaAngleRight />}
          >
            View Tracker
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

function greetBasedOnTime() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

function capitalizeFirstLetter(str) {
  if (!str) return "";
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Home;
