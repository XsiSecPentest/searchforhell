import logo from "./logo.svg";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Box } from "@mui/system";
import AdminMembership from "./AdminMembership";
import QueryConsumables from "./QueryConsumables";
function App() {
  return (
    <div className="App">
      <Router>
        <Box sx={{ padding: "60px" }}></Box>
        <Routes>
          <Route path="/" element={<QueryConsumables />} />
          <Route path="/" element={<AdminMembership />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
