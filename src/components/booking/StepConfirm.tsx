'use client'

import { useState } from 'react'
import type { BookingStep } from '@/types/booking'

interface Props {
  booking: Required<BookingStep>
  onBack: () => void
}

type State = 'review' | 'loading' | 'success' | 'error'

function formatDuration(min: number): string {
  const h = Math.floor(min/60); const m = min%60
  return m === 0 ? `${h}h` : `${h}h${m}min`
}

function formatDate(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' })
}

function formatPhone(digits: string): string {
  if (digits.length === 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
}

export default function StepConfirm({ booking, onBack }: Props) {
  const [state, setState] = useState<State>('review')
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const service = booking.service!
  const date = booking.date!
  const timeSlot = booking.timeSlot!
  const client = booking.client!

  async function handleConfirm() {
    setState('loading')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          client_name: client.name,
          client_email: client.email,
          client_phone: client.phone,
          start_at: timeSlot.start,
          notes: client.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao confirmar agendamento')
      setAppointmentId(data.id)
      setState('success')
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Erro inesperado. Tente novamente.')
      setState('error')
    }
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'
  const msg = encodeURIComponent('Ola! Agendei ' + service.name + ' para ' + formatDate(date) + ' as ' + timeSlot.label + '. Aguardo confirmacao!')

  if (state === 'success') {
    return (
      <>
        <style>{`
          .confirmation-wrapper { max-width: 520px; margin: 0 auto; text-align: center; }
          .confirmation-icon { width: 88px; height: 88px; background: linear-gradient(135deg, var(--gold), var(--gold-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; box-shadow: 0 12px 40px rgba(196,166,107,0.3); animation: scaleIn 0.5s var(--transition); }
          @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .confirmation-icon svg { stroke: #fff; }
          .confirmation-title { font-size: 2.2rem; color: var(--moss); margin-bottom: 12px; }
          .confirmation-text { font-size: 1rem; color: var(--text-light); line-height: 1.7; margin-bottom: 36px; }
          .confirmation-details { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow-md); margin-bottom: 32px; text-align: left; }
          .review-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }
          .review-row:last-child { border-bottom: none; }
          .review-icon { width: 44px; height: 44px; min-width: 44px; background: rgba(196,166,107,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
          .review-icon svg { stroke: var(--gold); }
          .review-info h4 { font-family: 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
          .review-info p { font-size: 0.95rem; color: var(--text-dark); }
          .confirmation-code { font-size: 0.78rem; color: var(--text-light); margin-bottom: 32px; }
          .confirmation-code strong { color: var(--moss); font-family: 'Cormorant Garamond', serif; font-size: 1rem; }
          .confirmation-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          .btn-whatsapp { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: #25D366; color: #fff; border-radius: 60px; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; text-decoration: none; transition: all 0.3s; font-family: 'Outfit', sans-serif; }
          .btn-whatsapp:hover { background: #20bd5a; transform: translateY(-2px); }
          .btn-home { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--beige); color: var(--moss); border-radius: 60px; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; text-decoration: none; transition: all 0.3s; border: 2px solid var(--border); font-family: 'Outfit', sans-serif; }
          .btn-home:hover { border-color: var(--gold); }
          @media (max-width: 480px) { .confirmation-actions { flex-direction: column; } }
        `}</style>
        <div className="confirmation-wrapper">
          <div className="confirmation-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 className="confirmation-title">Solicitacao enviada!</h2>
          <p className="confirmation-text">Seu agendamento foi registrado e esta aguardando confirmacao. Voce recebera um retorno em breve.</p>

          <div className="confirmation-details">
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div className="review-info"><h4>Servico</h4><p>{service.name}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
              <div className="review-info"><h4>Data</h4><p style={{textTransform:'capitalize'}}>{formatDate(date)}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
              <div className="review-info"><h4>Horario</h4><p>{timeSlot.label} — ~{formatDuration(service.duration_min)}</p></div>
            </div>
          </div>

          {appointmentId && (
            <p className="confirmation-code">
              Codigo do agendamento: <strong>#{appointmentId.slice(0,8).toUpperCase()}</strong>
            </p>
          )}

          <div className="confirmation-actions">
            <a href={'https://wa.me/' + whatsapp + '?text=' + msg} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Confirmar pelo WhatsApp
            </a>
            <a href="/" className="btn-home">Voltar ao site</a>
          </div>
        </div>
      </>
    )
  }

  if (state === 'error') {
    return (
      <>
        <style>{`
          .error-wrapper { max-width: 480px; margin: 0 auto; text-align: center; padding: 48px 0; }
          .error-icon { width: 72px; height: 72px; background: rgba(229,62,62,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
          .error-title { font-size: 2rem; color: var(--moss); margin-bottom: 12px; }
          .error-text { color: var(--text-light); margin-bottom: 32px; font-size: 0.95rem; }
          .error-actions { display: flex; gap: 12px; justify-content: center; }
        `}</style>
        <div className="error-wrapper">
          <div className="error-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
          </div>
          <h2 className="error-title">Algo deu errado</h2>
          <p className="error-text">{errorMsg}</p>
          <div className="error-actions">
            <button className="btn-back" onClick={onBack}>Voltar</button>
            <button className="btn-next" onClick={handleConfirm}>Tentar novamente</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .review-wrapper { max-width: 560px; margin: 0 auto; }
        .review-card { background: #fff; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
        .review-card-header { background: var(--moss); padding: 32px; text-align: center; }
        .review-card-header h3 { font-size: 1.6rem; color: #fff; margin-bottom: 4px; }
        .review-card-header p { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
        .review-card-body { padding: 32px; }
        .review-row { display: flex; align-items: flex-start; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); }
        .review-row:last-child { border-bottom: none; }
        .review-icon { width: 44px; height: 44px; min-width: 44px; background: rgba(196,166,107,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .review-icon svg { stroke: var(--gold); }
        .review-info h4 { font-family: 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
        .review-info p { font-size: 0.95rem; color: var(--text-dark); }
        .review-total { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; background: var(--beige); }
        .review-total span { font-size: 0.85rem; font-weight: 500; color: var(--text-mid); }
        .review-total strong { font-size: 1.3rem; font-weight: 600; color: var(--moss); }
        .review-note { font-size: 0.82rem; color: var(--text-light); text-align: center; margin-top: 20px; line-height: 1.6; }
        .loading-spinner { display: flex; align-items: center; gap: 10px; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="step-header">
        <span className="step-label">Passo 5 de 5</span>
        <h2 className="step-title">Revisar e Confirmar</h2>
        <p className="step-subtitle">Verifique os dados antes de finalizar</p>
      </div>

      <div className="review-wrapper">
        <div className="review-card">
          <div className="review-card-header">
            <h3>{client.name}</h3>
            <p>{service.name}</p>
          </div>
          <div className="review-card-body">
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div className="review-info"><h4>Servico</h4><p>{service.name} · ~{formatDuration(service.duration_min)}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
              <div className="review-info"><h4>Data</h4><p style={{textTransform:'capitalize'}}>{formatDate(date)}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
              <div className="review-info"><h4>Horario</h4><p>{timeSlot.label} — ate ~{formatTime(timeSlot.end)}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.98 1.18 2 2 0 012.98 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121.9 14l.02 2.92z"/></svg></div>
              <div className="review-info"><h4>WhatsApp</h4><p>{formatPhone(client.phone)}</p></div>
            </div>
            <div className="review-row">
              <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg></div>
              <div className="review-info"><h4>E-mail</h4><p>{client.email}</p></div>
            </div>
            {client.notes && (
              <div className="review-row">
                <div className="review-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
                <div className="review-info"><h4>Observacoes</h4><p>{client.notes}</p></div>
              </div>
            )}
          </div>
          <div className="review-total">
            <span>Preco estimado</span>
            <strong>A partir de R$ {service.price_min.toFixed(0)}</strong>
          </div>
        </div>

        <p className="review-note">
          Ao confirmar, um evento sera criado na agenda e voce recebera um retorno sobre a confirmacao.
        </p>
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack} disabled={state === 'loading'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar
        </button>
        <button className="btn-next" onClick={handleConfirm} disabled={state === 'loading'}>
          {state === 'loading' ? (
            <span className="loading-spinner">
              <span className="spinner" />
              Confirmando...
            </span>
          ) : (
            <>
              Confirmar agendamento
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </>
  )
}
