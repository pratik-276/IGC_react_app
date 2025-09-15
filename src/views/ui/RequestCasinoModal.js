// src/components/RequestCasinoModal.js
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import toast from "react-hot-toast";

const RequestCasinoModal = ({ visible, onHide, onSubmit }) => {
  const [casinoName, setCasinoName] = useState("");
  const [casinoUrl, setCasinoUrl] = useState("");
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const user_id = localStorage.getItem("user_id");

  const countries = [
    { label: "India", value: "India" },
    { label: "USA", value: "USA" },
    { label: "UK", value: "UK" },
  ];

  const handleSubmit = async () => {
    if (!casinoName || !casinoUrl || !country) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      user_id: parseInt(user_id),
      operator_name: casinoName,
      operator_url: casinoUrl,
      country: country,
    };

    setLoading(true);
    try {
      await onSubmit(payload);
      toast.success("Casino request submitted");
      onHide();
      setCasinoName("");
      setCasinoUrl("");
      setCountry(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit request");
    } finally {
      setLoading(false);
    }
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
      <div className="flex flex-column gap-3 p-2">
        <span className="p-float-label">
          <InputText
            id="casinoName"
            value={casinoName}
            onChange={(e) => setCasinoName(e.target.value)}
            className="w-full"
          />
          <label htmlFor="casinoName">Enter Casino Name</label>
        </span>

        <span className="p-float-label">
          <InputText
            id="casinoUrl"
            value={casinoUrl}
            onChange={(e) => setCasinoUrl(e.target.value)}
            className="w-full"
          />
          <label htmlFor="casinoUrl">Enter URL</label>
        </span>

        <span className="p-float-label">
          <Dropdown
            id="country"
            value={country}
            options={countries}
            onChange={(e) => setCountry(e.value)}
            className="w-full"
          />
          <label htmlFor="country">Select Country</label>
        </span>
      </div>
    </Dialog>
  );
};

export default RequestCasinoModal;
