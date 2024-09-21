import Video from "../assets/images/intro.mp4"

const Home = () => {
  return (
    <>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
            <video src={Video} autoPlay="true" style={{
              width: "800px",
              marginBottom: "50px"
            }} />
            <h4>Reports coming soon ...</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
