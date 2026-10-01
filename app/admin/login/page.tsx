'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('');
    try {
      const response = await fetch('http://localhost:4000/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Login failed');
      localStorage.setItem('traceability_admin_token', data.token);
      router.push('/admin/batches');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Login failed'); }
    finally { setLoading(false); }
  }

  return <main className="admin-auth"><div className="admin-auth-card">
    <p className="admin-eyebrow">Traceability CMS</p><h1>Staff sign in</h1>
    <p className="admin-muted">Manage recycled-plastic batches and their current status.</p>
    <form onSubmit={submit} className="admin-form">
      <label htmlFor="email">Staff email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {message && <p className="admin-error" role="alert">{message}</p>}
      <button className="admin-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </div></main>;
}
