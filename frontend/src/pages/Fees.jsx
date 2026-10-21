import {useEffect,useState} from 'react';
import api from '../services/api';
const empty={student_id:'',total_amount:'',paid_amount:'',payment_date:''};
export default function Fees(){
 const [list,setList]=useState([]),[students,setStudents]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[search,setSearch]=useState('');
 const load=()=>api.get('/fees').then(r=>setList(r.data));
 useEffect(()=>{load();api.get('/students').then(r=>setStudents(r.data))},[]);
 const save=async e=>{e.preventDefault(); try{if(edit) await api.put('/fees/'+edit,form); else await api.post('/fees',form); setForm(empty);setEdit(null);load()}catch(err){alert(err.response?.data?.message||'Failed to save fee record')}};
 const remove=async id=>{if(confirm('Delete this fee record?')){try{await api.delete('/fees/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete fee record')}}};
 const filtered=list.filter(f=>[f.student_code,f.student_name,f.total_amount].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section><div className="top"><div><h1>Fees</h1><p>Manage student fee records</p></div></div>
 <div className="panel"><h2>{edit?'Edit Fee Record':'Add Fee Record'}</h2><form className="grid-form" onSubmit={save}>
 <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} required><option value="">STUDENT</option>{students.map(s=><option key={s.id} value={s.id}>{s.student_id} - {s.name}</option>)}</select>
 <input placeholder="TOTAL AMOUNT" type="number" step="0.01" value={form.total_amount} onChange={e=>setForm({...form,total_amount:e.target.value})}/>
 <input placeholder="PAID AMOUNT" type="number" step="0.01" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})}/>
 <input type="date" value={form.payment_date} onChange={e=>setForm({...form,payment_date:e.target.value})}/>
 <button>{edit?'Update Fee':'Add Fee'}</button>{edit&&<button type="button" className="secondary" onClick={()=>{setEdit(null);setForm(empty)}}>Cancel</button>}
 </form></div>
 <div className="panel"><div className="toolbar"><h2>Fee List</h2><input className="search" placeholder="Search fees..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
 <div className="table-wrap"><table><thead><tr><th>Student ID</th><th>Name</th><th>Total</th><th>Paid</th><th>Balance</th><th>Payment Date</th><th>Actions</th></tr></thead><tbody>
 {filtered.map(f=><tr key={f.id}><td>{f.student_code}</td><td>{f.student_name||'-'}</td><td>{Number(f.total_amount).toLocaleString()}</td><td>{Number(f.paid_amount).toLocaleString()}</td><td>{(Number(f.total_amount)-Number(f.paid_amount)).toLocaleString()}</td><td>{f.payment_date||'-'}</td><td><button className="small" onClick={()=>{setEdit(f.id);setForm({student_id:f.student_id,total_amount:f.total_amount,paid_amount:f.paid_amount,payment_date:f.payment_date||''})}}>Edit</button><button className="small danger" onClick={()=>remove(f.id)}>Delete</button></td></tr>)}
 </tbody></table></div></div></section>
}