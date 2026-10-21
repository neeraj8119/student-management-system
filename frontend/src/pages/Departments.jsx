import {useEffect,useState} from 'react';
import api from '../services/api';
export default function Departments(){
 const [items,setItems]=useState([]),[form,setForm]=useState({name:'',code:''});
  const load=()=>api.get('/departments').then(r=>setItems(r.data)); useEffect(()=>{load()},[]);
 const add=async e=>{e.preventDefault();try{await api.post('/departments',form);setForm({name:'',code:''});load()}catch(err){alert(err.response?.data?.message||'Failed to add department')}};
 const del=async id=>{if(confirm('Delete department?')){try{await api.delete('/departments/'+id);load()}catch(err){alert(err.response?.data?.message||'Failed to delete department')}}};
 return <section><div className="top"><div><h1>Departments</h1><p>Manage academic departments</p></div></div>
 <div className="panel"><form className="inline-form" onSubmit={add}><input placeholder="Department name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/><button>Add Department</button></form></div>
 <div className="panel"><h2>Department List</h2><div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Code</th><th>Action</th></tr></thead><tbody>{items.map(d=><tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.code}</td><td><button className="small danger" onClick={()=>del(d.id)}>Delete</button></td></tr>)}</tbody></table></div></div></section>
}