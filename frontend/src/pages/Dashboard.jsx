import {useEffect,useState} from 'react';
import api from '../services/api';
export default function Dashboard(){
 const [data,setData]=useState({students:0,teachers:0,departments:0,courses:0});
 useEffect(()=>{api.get('/dashboard').then(r=>setData(r.data)).catch(()=>{})},[]);
 const cards=[['👨‍🎓','Students',data.students],['👨‍🏫','Teachers',data.teachers],['🏢','Departments',data.departments],['📚','Courses',data.courses]];
 return <section><div className="top"><div><h1>Dashboard</h1><p>Welcome to Student Management System</p></div></div><div className="cards">{cards.map(c=><div className="card" key={c[1]}><span>{c[0]}</span><div><b>{c[2]}</b><p>{c[1]}</p></div></div>)}</div><div className="panel"><h2>System Overview</h2><p>Use the sidebar to manage students and departments. More modules such as attendance, fees and results can be added next.</p></div></section>
}