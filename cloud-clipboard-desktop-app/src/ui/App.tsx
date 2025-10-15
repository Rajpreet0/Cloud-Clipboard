import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PairDevice from "./pages/PairDevice";
import './App.css'
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/pair" element={<PairDevice/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/users" element={<Team/>}/>
      </Routes>
    </Router>
  )
}

export default App
