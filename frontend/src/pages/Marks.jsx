import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={student_id:'',subject:'',marks:'',max_marks:'100'};
const DEFAULT_SUBJECTS=['Data Structures','Operating Systems','Database Management Systems','Computer Networks','Object Oriented Programming','Software Engineering','Discrete Mathematics','Java Programming','Web Technologies','Cloud Computing'];
export default function Marks(){
 const [list,setList]=useState([]),[students,setStudents]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState(''),[open,setOpen]=useState(false);
 const subjects=[...new Set([...DEFAULT_SUBJECTS,...list.map(m=>m.subject).filter(Boolean)])];
 const filteredSubjects=subjects.filter(s=>s.toLowerCase().includes(form.subject.toLowerCase()));
 const load=()=>api.get('/marks').then(r=>setList(r.data));
 useEffect(()=>{load();api.get('/students').then(r=>setStudents(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/marks/'+edit,form); else await api.post('/marks',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save marks')}};
 const remove=async id=>{if(confirm('Delete this marks record?')){try{await api.delete('/marks/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete marks record')}}};
 const filtered=list.filter(m=>[m.student_code,m.student_name,m.subject].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Marks</h1><p>Manage student marks and results</p></div></div>
 <div className="panel"><h2>{edit?'Edit Marks':'Add Marks'}</h2><form className="grid-form" onSubmit={save}>
 <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} required><option value="">STUDENT</option>{students.map(s=><option key={s.id} value={s.id}>{s.student_id} - {s.name}</option>)}</select>
 <div className="combo"><input placeholder="SUBJECT" value={form.subject} onChange={e=>{setForm({...form,subject:e.target.value});setOpen(true)}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),120)} required/>{open&&filteredSubjects.length>0&&<div className="combo-list">{filteredSubjects.map(s=><div key={s} onMouseDown={()=>setForm({...form,subject:s})}>{s}</div>)}</div>}</div>
 <input placeholder="MARKS OBTAINED" type="number" step="0.01" value={form.marks} onChange={e=>setForm({...form,marks:e.target.value})}/>
 <input placeholder="MAX MARKS" type="number" step="0.01" value={form.max_marks} onChange={e=>setForm({...form,max_marks:e.target.value})}/>
 <button>{edit?'Update Marks':'Add Marks'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Marks List</h2><input className="search" placeholder="Search marks..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>Student ID</th><th>Name</th><th>Subject</th><th>Marks</th><th>Max</th><th>Percentage</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(m=><tr key={m.id}><td>{m.student_code}</td><td>{m.student_name||'-'}</td><td>{m.subject}</td><td>{Number(m.marks).toLocaleString()}</td><td>{Number(m.max_marks).toLocaleString()}</td><td>{Number(m.max_marks)>0?((Number(m.marks)/Number(m.max_marks))*100).toFixed(1)+'%':'-'}</td><td><button className="small" onClick={()=>{setEdit(m.id);setForm({student_id:m.student_id,subject:m.subject,marks:m.marks,max_marks:m.max_marks})}}>Edit</button><button className="small danger" onClick={()=>remove(m.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}