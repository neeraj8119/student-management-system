import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/auth/login', form);
      localStorage.setItem('token', r.data.token);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">🎓</div>
        <h1>Student Management</h1>
        <p>Admin Portal</p>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>
        <small>Demo: admin@gmail.com / admin123</small>
      </form>
    </div>
  );
}
