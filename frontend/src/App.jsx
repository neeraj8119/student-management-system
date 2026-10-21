import {useState} from 'react';
import {Routes,Route,Navigate,useNavigate,Link} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Marks from './pages/Marks';
import './styles.css';

function Layout(){
 const nav=useNavigate();
 const [open,setOpen]=useState(false);
 const logout=()=>{localStorage.clear();nav('/login')};
 return <div className={"app"+(open?" menu-open":"")}>
 <button className="menu-btn" aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)}>{open?'✕':'☰'}</button>
 <div className="backdrop" onClick={()=>setOpen(false)}/>
 <aside><h2>🎓 EduAdmin</h2><nav onClick={()=>setOpen(false)}>
  <Link to="/">🏠 Dashboard</Link><Link to="/students">👨‍🎓 Students</Link><Link to="/teachers">👨‍🏫 Teachers</Link><Link to="/courses">📚 Courses</Link><Link to="/departments">🏢 Departments</Link><Link to="/attendance">📅 Attendance</Link><Link to="/fees">💰 Fees</Link><Link to="/marks">📝 Marks</Link>
 </nav><button className="logout" onClick={logout}>Logout</button></aside>
 <main><Routes><Route path="/" element={<Dashboard/>}/><Route path="/students" element={<Students/>}/><Route path="/teachers" element={<Teachers/>}/><Route path="/courses" element={<Courses/>}/><Route path="/departments" element={<Departments/>}/><Route path="/attendance" element={<Attendance/>}/><Route path="/fees" element={<Fees/>}/><Route path="/marks" element={<Marks/>}/></Routes></main></div>
}
function Protected(){return localStorage.getItem('token')?<Layout/>:<Navigate to="/login"/>}
export default function App(){return <Routes><Route path="/login" element={<Login/>}/><Route path="/*" element={<Protected/>}/></Routes>}