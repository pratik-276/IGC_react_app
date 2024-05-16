import React from "react";

const NewCasino = () => {
  return (
    <>
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Enter URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL here"
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
    </>
  );
};

export default NewCasino;
