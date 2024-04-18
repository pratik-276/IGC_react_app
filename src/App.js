import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"

const App = () => {
  const routing = useRoutes(Themeroutes);

  return <div className="dark">{routing}</div>;
};

export default App;
