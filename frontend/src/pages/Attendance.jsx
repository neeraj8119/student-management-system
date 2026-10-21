import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={student_id:'',attendance_date:'',status:'Present'};
export default function Attendance(){
 const [list,setList]=useState([]),[students,setStudents]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState('');
 const load=()=>api.get('/attendance').then(r=>setList(r.data));
 useEffect(()=>{load();api.get('/students').then(r=>setStudents(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/attendance/'+edit,form); else await api.post('/attendance',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save attendance')}};
 const remove=async id=>{if(confirm('Delete this attendance record?')){try{await api.delete('/attendance/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete attendance')}}};
 const filtered=list.filter(a=>[a.student_code,a.student_name,a.attendance_date,a.status].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Attendance</h1><p>Mark and manage student attendance</p></div></div>
 <div className="panel"><h2>{edit?'Edit Attendance':'Mark Attendance'}</h2><form className="grid-form" onSubmit={save}>
 <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} required><option value="">STUDENT</option>{students.map(s=><option key={s.id} value={s.id}>{s.student_id} - {s.name}</option>)}</select>
 <input type="date" value={form.attendance_date} onChange={e=>setForm({...form,attendance_date:e.target.value})} required/>
 <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="Present">Present</option><option value="Absent">Absent</option></select>
 <button>{edit?'Update Attendance':'Save Attendance'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Attendance List</h2><input className="search" placeholder="Search attendance..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>Student ID</th><th>Name</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(a=><tr key={a.id}><td>{a.student_code}</td><td>{a.student_name||'-'}</td><td>{a.attendance_date}</td><td>{a.status}</td><td><button className="small" onClick={()=>{setEdit(a.id);setForm({student_id:a.student_id,attendance_date:a.attendance_date,status:a.status})}}>Edit</button><button className="small danger" onClick={()=>remove(a.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}