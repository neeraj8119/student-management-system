import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={name:'',code:'',teacher_id:'',department_id:''};
export default function Courses(){
 const [list,setList]=useState([]),[departments,setDepartments]=useState([]),[teachers,setTeachers]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState('');
 const load=()=>api.get('/courses').then(r=>setList(r.data));
 useEffect(()=>{load();api.get('/departments').then(r=>setDepartments(r.data));api.get('/teachers').then(r=>setTeachers(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/courses/'+edit,form); else await api.post('/courses',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save course')}};
 const remove=async id=>{if(confirm('Delete this course?')){try{await api.delete('/courses/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete course')}}};
 const filtered=list.filter(c=>[c.name,c.code,c.teacher_name,c.department_name].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Courses</h1><p>Manage course records</p></div></div>
 <div className="panel"><h2>{edit?'Edit Course':'Add Course'}</h2><form className="grid-form" onSubmit={save}>
 <input placeholder="COURSE NAME" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
 <input placeholder="CODE" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required/>
 <select value={form.department_id} onChange={e=>setForm({...form,department_id:e.target.value})}><option value="">DEPARTMENT</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
 <select value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})}><option value="">TEACHER</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
 <button>{edit?'Update Course':'Add Course'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Course List</h2><input className="search" placeholder="Search courses..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>Name</th><th>Code</th><th>Department</th><th>Teacher</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.code}</td><td>{c.department_name||'-'}</td><td>{c.teacher_name||'-'}</td><td><button className="small" onClick={()=>{setEdit(c.id);setForm({name:c.name,code:c.code,teacher_id:c.teacher_id||'',department_id:c.department_id||''})}}>Edit</button><button className="small danger" onClick={()=>remove(c.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}