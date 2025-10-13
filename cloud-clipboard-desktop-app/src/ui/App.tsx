import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PairDevice from "./pages/PairDevice";
import './App.css'
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/pair" element={<PairDevice/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
