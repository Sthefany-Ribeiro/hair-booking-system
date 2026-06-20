'use client'

import { useState } from 'react'
import type { BookingStep } from '@/types/booking'

interface Props {
  onSubmit: (client: BookingStep['client']) => void
  onBack: () => void
}

interface Form { name: string; phone: string; email: string; notes: string }
interface Errors { name?: string; phone?: string; email?: string }

function formatPhone(v: string): string {
  const d = v.replace(/\D/g,'').slice(0,11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

export default function StepClient({ onSubmit, onBack }: Props) {
  const [form, setForm] = useState<Form>({ name:'', phone:'', email:'', notes:'' })
  const [errors, setErrors] = useState<Errors>({})

  function change(field: keyof Form, value: string) {
    const v = field === 'phone' ? formatPhone(value) : value
    setForm(f => ({ ...f, [field]: v }))
    if (errors[field as keyof Errors]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Informe seu nome completo'
    if (form.phone.replace(/\D/g,'').length < 10) e.phone = 'Informe um telefone valido com DDD'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Informe um e-mail valido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    onSubmit({ name: form.name.trim(), phone: form.phone.replace(/\D/g,''), email: form.email.trim().toLowerCase(), notes: form.notes.trim() })
  }

  const inp = (hasErr: boolean) => `form-input${hasErr ? ' error' : ''}`

  return (
    <>
      <style>{`
        .form-wrapper { max-width: 560px; margin: 0 auto; background: #fff; border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-md); }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--moss); margin-bottom: 8px; }
        .form-group label .req { color: var(--gold); }
        .form-input { width: 100%; padding: 14px 18px; border: 2px solid var(--border); border-radius: var(--radius-sm); font-family: 'Outfit', sans-serif; font-size: 0.92rem; color: var(--text-dark); background: var(--offwhite); transition: all 0.3s; outline: none; }
        .form-input:focus { border-color: var(--gold); background: #fff; box-shadow: 0 0 0 4px rgba(196,166,107,0.1); }
        .form-input::placeholder { color: var(--text-light); font-weight: 300; }
        .form-input.error { border-color: #e53e3e; }
        .form-input.error:focus { box-shadow: 0 0 0 4px rgba(229,62,62,0.1); }
        .form-textarea { width: 100%; padding: 14px 18px; border: 2px solid var(--border); border-radius: var(--radius-sm); font-family: 'Outfit', sans-serif; font-size: 0.92rem; color: var(--text-dark); background: var(--offwhite); transition: all 0.3s; outline: none; min-height: 100px; resize: vertical; }
        .form-textarea:focus { border-color: var(--gold); background: #fff; box-shadow: 0 0 0 4px rgba(196,166,107,0.1); }
        .form-textarea::placeholder { color: var(--text-light); font-weight: 300; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field-error { font-size: 0.78rem; color: #e53e3e; margin-top: 6px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } .form-wrapper { padding: 28px; } }
      `}</style>

      <div className="step-header">
        <span className="step-label">Passo 4 de 5</span>
        <h2 className="step-title">Seus Dados</h2>
        <p className="step-subtitle">Para confirmarmos seu agendamento</p>
      </div>

      <div className="form-wrapper">
        <div className="form-group">
          <label>Nome completo <span className="req">*</span></label>
          <input type="text" className={inp(!!errors.name)} placeholder="Como prefere ser chamada?" value={form.name} onChange={e => change('name', e.target.value)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>WhatsApp <span className="req">*</span></label>
            <input type="tel" className={inp(!!errors.phone)} placeholder="(11) 99999-9999" value={form.phone} onChange={e => change('phone', e.target.value)} />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label>E-mail <span className="req">*</span></label>
            <input type="email" className={inp(!!errors.email)} placeholder="seu@email.com" value={form.email} onChange={e => change('email', e.target.value)} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Observacoes <span style={{fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:'0.75rem', color:'var(--text-light)'}}>(opcional)</span></label>
          <textarea className="form-textarea" placeholder="Referencias de estilo, comprimento desejado, duvidas..." value={form.notes} onChange={e => change('notes', e.target.value)} rows={3} />
        </div>
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar
        </button>
        <button className="btn-next" onClick={submit}>
          Revisar agendamento
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </>
  )
}
