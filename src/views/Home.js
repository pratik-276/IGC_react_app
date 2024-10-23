import { Button, InputAdornment, Link, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FaGem, FaMagnifyingGlass, FaAngleRight } from "react-icons/fa6";
import Call from "./../services/Call";
import Video from "../assets/images/intro.mp4"
import { Card, CardBody, CardFooter, CardHeader, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

const Home = () => {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)

  async function getData() {
    setLoading(true)

    try {
      const userId = localStorage.getItem("user_id");
      const res = await Call({
        path: "get_profile",
        method: "POST",
        data: {
          user_id: userId
        }
      })

      setProfile(res.data)

      // const operator = await Call({
      //   path: 'get_operator',
      //   method: 'GET'
      // })
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const navigate = useNavigate()

  return (
    <>
      {loading &&
        <div style={{ display: 'flex' }}>
          <ProgressSpinner />
        </div>
      }
      {!loading && <div className="container">
        <div className="d-flex flex-row justify-content-between">
          <div>
            <h3>{`${greetBasedOnTime()}, ${capitalizeFirstLetter(profile?.first_name)}`}</h3>
            <div className="compass-data">
              <span>
                we have kept all your reports ready for you
              </span>
            </div>
          </div>
          <div>
            <Button variant="contained" style={{ backgroundColor: '#392f6c', marginBottom: '0.5rem' }} startIcon={<FaGem />}>
              Upgrade Plan
            </Button>
            <div className="compass-data">
              <span>
                Your trial Plan ends on Dec 4, 2024
              </span>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <Card className="p-3">
            <CardBody>
              <h5 style={{ fontWeight: "600", marginBottom: '0px' }}>
                Find and Track casinos Now!
              </h5>
              <div className="compass-data pb-5">
                <span>
                  we have kept all your reports ready for you
                </span>
              </div>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaMagnifyingGlass />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </CardBody>
          </Card>
        </div>

        <div className="pt-4">
          <h5 style={{ fontSize: '20px', fontWeight: "500", marginBottom: '0px' }}>
            Free Reports
          </h5>
          <div className="compass-data pb-3">
            <span>
              Recommended based on your profile
            </span>
          </div>
          <div className="d-flex flex-row gap-3">
            <ReportCard onButtonPress={() => navigate('game-provider-marketshare')} title="Game Provider Marketshare" />
            <ReportCard onButtonPress={() => navigate('game-rank-report')} title="Game Rank" />
          </div>
        </div>

        <div className="pt-4">
          <h5 style={{ fontSize: '20px', fontWeight: "500", marginBottom: '0px' }}>
            Premium Reports
          </h5>
          <div className="compass-data pb-3">
            <span>
              Recommended based on your profile
            </span>
          </div>
          <div className="d-flex flex-row gap-3 flex-wrap">
            <ReportCard onButtonPress={() => { }} title="Game Provide Marketshare" />
            <ReportCard onButtonPress={() => { }} title="Game Rank" />
            <ReportCard onButtonPress={() => { }} title="Game Provide Marketshare" />
          </div>
        </div>
      </div>}
    </>
  );
};

const ReportCard = ({ title, onButtonPress }) => {
  return (
    <Card style={{ minWidth: '300px' }}>
      <CardBody>
        <Image width="300px" src="report_placeholder.png" />
      </CardBody>
      <CardFooter>
        <div className="pb-2 font-semibold">{title}</div>
        <Button onClick={onButtonPress} size="small" variant="outlined" style={{ color: 'white', backgroundColor: '#392f6c', marginBottom: '0.5rem' }} endIcon={<FaAngleRight />}>
          View Report
        </Button>
      </CardFooter>
    </Card>
  )
}

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
  if (!str) return ""
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Home;
