import { Spin } from "antd";

const Loader = () => (
  <div className="h-100">
    <div className="row h-100 align-items-center justify-content-center">
      <div className="col-md-5">
        <div className="text-center">
          <div className="">
            <Spin size="large" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default Loader;
