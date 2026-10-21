import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={name:'',email:'',phone:'',department_id:''};
export default function Teachers(){
 const [list,setList]=useState([]),[departments,setDepartments]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState('');
 const load=()=>api.get('/teachers').then(r=>setList(r.data));
 useEffect(()=>{load();api.get('/departments').then(r=>setDepartments(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/teachers/'+edit,form); else await api.post('/teachers',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save teacher')}};
 const remove=async id=>{if(confirm('Delete this teacher?')){try{await api.delete('/teachers/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete teacher')}}};
 const filtered=list.filter(t=>[t.name,t.email,t.department_name].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Teachers</h1><p>Manage teacher records</p></div></div>
 <div className="panel"><h2>{edit?'Edit Teacher':'Add Teacher'}</h2><form className="grid-form" onSubmit={save}>
 <input placeholder="NAME" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
 <input placeholder="EMAIL" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
 <input placeholder="PHONE" maxLength={10} pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})}/>
 <select value={form.department_id} onChange={e=>setForm({...form,department_id:e.target.value})}><option value="">DEPARTMENT</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
 <button>{edit?'Update Teacher':'Add Teacher'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Teacher List</h2><input className="search" placeholder="Search teachers..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(t=><tr key={t.id}><td>{t.name}</td><td>{t.email||'-'}</td><td>{t.phone||'-'}</td><td>{t.department_name||'-'}</td><td><button className="small" onClick={()=>{setEdit(t.id);setForm({name:t.name,email:t.email||'',phone:t.phone||'',department_id:t.department_id||''})}}>Edit</button><button className="small danger" onClick={()=>remove(t.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}