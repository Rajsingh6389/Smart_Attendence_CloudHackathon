import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import AddStudent from "./AddStudent";
import Attendance from "./Attendance";
import Dashboard from "./Dashboard";
import Home from "./Home";
import About from "./Home/About";


function App() {
  return (
    <Routes>
      {/* Layout Route */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-student" element={<AddStudent />}/>
        <Route path="/attendance" element={<Attendance/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/live" element={<Live />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/about" element={<About />} />


      </Route>
    </Routes>
  );
}

export default App;
