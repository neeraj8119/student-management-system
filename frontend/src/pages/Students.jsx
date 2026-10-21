import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={student_id:'',name:'',email:'',phone:'',gender:'',date_of_birth:'',department_id:'',course_id:'',address:''};
export default function Students(){
 const [students,setStudents]=useState([]),[departments,setDepartments]=useState([]),[courses,setCourses]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState('');
 const load=()=>api.get('/students').then(r=>setStudents(r.data));
 useEffect(()=>{load();api.get('/departments').then(r=>setDepartments(r.data));api.get('/courses').then(r=>setCourses(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/students/'+edit,form); else await api.post('/students',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save student')}};
 const remove=async id=>{if(confirm('Delete this student?')){try{await api.delete('/students/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete student')}}};
 const filtered=students.filter(s=>[s.student_id,s.name,s.email,s.department_name,s.course_name].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Students</h1><p>Manage student records</p></div></div>
 <div className="panel"><h2>{edit?'Edit Student':'Add Student'}</h2><form className="grid-form" onSubmit={save}>
 <input placeholder="STUDENT ID" value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} required/>
 <input placeholder="NAME" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
 <input placeholder="EMAIL" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
 <input placeholder="PHONE" maxLength={10} pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})}/>
 <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">GENDER</option><option>Male</option><option>Female</option><option>Other</option></select>
 <input type="date" value={form.date_of_birth} onChange={e=>setForm({...form,date_of_birth:e.target.value})}/>
 <select value={form.department_id} onChange={e=>setForm({...form,department_id:e.target.value,course_id:''})}><option value="">DEPARTMENT</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
 <select value={form.course_id} onChange={e=>setForm({...form,course_id:e.target.value})}><option value="">COURSE</option>{courses.filter(c=>!form.department_id||String(c.department_id)===String(form.department_id)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
 <input placeholder="ADDRESS" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
 <button>{edit?'Update Student':'Add Student'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Student List</h2><input className="search" placeholder="Search students..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Course</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(s=><tr key={s.id}><td>{s.student_id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td><td>{s.department_name||'-'}</td><td>{s.course_name||'-'}</td><td><button className="small" onClick={()=>{setEdit(s.id);setForm({...empty,...s})}}>Edit</button><button className="small danger" onClick={()=>remove(s.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}