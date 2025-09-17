// src/components/RequestCasinoModal.js
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import CompassData from "../../services/CompassApi";

const RequestCasinoModal = ({ visible, onHide, onSubmit }) => {
  const [casinoName, setCasinoName] = useState("");
  const [casinoUrl, setCasinoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const user_id = localStorage.getItem("user_id");

  const handleSubmit = async () => {
    if (!casinoName || !casinoUrl) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      user_id: parseInt(user_id),
      operator_name: casinoName,
      operator_url: casinoUrl,
    };

    setLoading(true);
    CompassData.request_new_casino(payload)
      .then((res) => {
        if (res?.success) {
          toast.success("Casino request submitted");
          onHide();
          setCasinoName("");
          setCasinoUrl("");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button label="Cancel" severity="secondary" onClick={onHide} />
      <Button
        label={loading ? "Submitting..." : "Request Casino"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );

  return (
    <Dialog
      header="Request New Casino"
      draggable={false}
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      footer={footer}
    >
      <div className="flex flex-column gap-2 p-2">
        <div>
          <label className="fs-6" htmlFor="casinoName">
            Casino Name
          </label>
          <InputText
            id="casinoName"
            value={casinoName}
            onChange={(e) => setCasinoName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="fs-6" htmlFor="casinoUrl">
            URL
          </label>
          <InputText
            id="casinoUrl"
            value={casinoUrl}
            onChange={(e) => setCasinoUrl(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default RequestCasinoModal;
