import { useEffect, useState, useContext, useMemo } from "react";
import RequestedCasinoData from "./RequestedCasinoData";
import CompassData from "../../services/CompassApi";
import { ProfileSystem } from "../../context/ProfileContext";
import RequestCasinoModal from "./RequestCasinoModal";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./index.css";
import "./Compass.css";
import "./AccessBlur.css";

const RequestedCasinos = () => {
  const user_id = localStorage.getItem("user_id");

  const user_company = localStorage.getItem("user_company");

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";

  const [requestCasinoVisible, setRequestCasinoVisible] = useState(false);

  const [casinoRequestData, setCasinoRequestData] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);



  const getCasinoRequestData = () => {
    setLoading(true);
    CompassData.get_casino_requests({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res?.success) {
          setCasinoRequestData(res?.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCasinoRequestData();
  }, [user_id]);


  return (
    <>
      <div className={`w-100 h-100 ${isPlanExpired ? "overlay active" : ""}`}>
        <RequestedCasinoData
          setRequestCasinoModalVisible={setRequestCasinoVisible}
          casinoRequestData={casinoRequestData}
          loading={loading}
          getCasinoRequestData={getCasinoRequestData}
        />
      </div>

      
      <RequestCasinoModal
        visible={requestCasinoVisible}
        onHide={() => setRequestCasinoVisible(false)}
        onSubmit={async (payload) => {
          // call API here
          console.log("Requesting casino with data:", payload);
          getCasinoRequestData();
          // await CompassData.request_new_casino(payload);
        }}
      />
    </>
  );
};

export default RequestedCasinos;
