import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PairDevice from "./pages/PairDevice";
import './App.css'
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/router/ProtectedRoutes";
import { ClipsProvider } from "@/context/ClipsContext";

function App() {

  return (
    <Router>
      <AuthProvider>
        <ClipsProvider>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/pair" element={<PairDevice/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/users" element={<ProtectedRoute><Team/></ProtectedRoute>}/>
            <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
          </Routes>
        </ClipsProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
