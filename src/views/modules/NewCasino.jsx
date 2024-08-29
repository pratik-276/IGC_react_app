import React, { useState } from "react";
import CompassData from "../../services/CompassApi";
import toast from "react-hot-toast";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const NewCasino = (props) => {
  const { onNewCasinoDrawerClose, newCasino, setCasinoDrawer, setNewCasino } =
    props;

  const user_id = localStorage.getItem("user_id");

  const [operator_name, setOperator_Name] = useState("");
  const [operator_url, setOperator_URl] = useState("");

  const handleSubmit = () => {
    CompassData.request_new_casino({
      user_id,
      operator_name,
      operator_url,
    })
      .then((res) => {
        if (res?.success === true) {
          console.log("res", res.message);
          toast.success(res?.message);
          setCasinoDrawer(true);
          setOperator_Name("");
          setOperator_URl("");
          setNewCasino(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Drawer
        title="Request New Casino"
        width="50%"
        className="choose_casino_drawer"
        closable={true}
        maskClosable={false}
        onClose={onNewCasinoDrawerClose}
        open={newCasino}
        closeIcon={<CloseOutlined className="custom-close-icon" />}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onNewCasinoDrawerClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            <button
              style={{ marginRight: 8 }}
              // className="compass-sidebar-back"
              className={`compass-sidebar-back ${
                !operator_name || !operator_url ? "btn-disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={!operator_name || !operator_url}
            >
              Request Casino
            </button>
          </div>
        }
      >
        <div className="bg-white p-4">
          <div className="row">
            <div className="col-md-8">
              <div className="casino-input-field new_casino_add">
                <div className="form-group">
                  <label htmlFor="">Enter Casino Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name here"
                    value={operator_name}
                    onChange={(e) => setOperator_Name(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Enter URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL here"
                    value={operator_url}
                    onChange={(e) => setOperator_URl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="url-preview mt-5">
              <h5>
                <b>URL Preview</b>
              </h5>
              <div>
                <img
                  src="https://play-lh.googleusercontent.com/FNVQyeiRF2_1PtLj6vXRjvr4-IGwdaShsTvjSFS_v8TmdHdllJ5lUAHlweR5B44dNQ=w526-h296-rw"
                  alt=""
                  className="w-100 bordered mt-3"
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NewCasino;
