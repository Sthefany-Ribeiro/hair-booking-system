'use client'

import { useEffect, useState } from 'react'
import type { Service } from '@/types/database'
import type { TimeSlot } from '@/types/booking'

interface Props {
  service: Service
  date: string
  onSelect: (slot: TimeSlot) => void
  onBack: () => void
}

function formatDate(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' })
}

function formatDuration(min: number): string {
  const h = Math.floor(min/60); const m = min%60
  return m === 0 ? `${h}h` : `${h}h${m}min`
}

function formatEndTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' })
}

export default function StepTime({ service, date, onSelect, onBack }: Props) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<TimeSlot | null>(null)

  useEffect(() => {
    setLoading(true); setError(null); setSelected(null)
    fetch(`/api/availability?service_id=${service.id}&date=${date}`)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setSlots(d.slots) })
      .catch(() => setError('Nao foi possivel verificar a disponibilidade.'))
      .finally(() => setLoading(false))
  }, [service.id, date])

  const morning = slots.filter(s => new Date(s.start).getHours() < 12)
  const afternoon = slots.filter(s => new Date(s.start).getHours() >= 12)

  return (
    <>
      <style>{`
        .time-wrapper { max-width: 600px; margin: 0 auto; }
        .date-badge { display: inline-flex; align-items: center; gap: 10px; background: var(--beige); padding: 12px 24px; border-radius: 60px; font-size: 0.88rem; color: var(--moss); margin-bottom: 32px; }
        .date-badge svg { stroke: var(--gold); }
        .time-period { margin-bottom: 32px; }
        .time-period h4 { font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; }
        .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .time-slot { padding: 14px; background: #fff; border: 2px solid var(--border); border-radius: var(--radius-sm); text-align: center; font-size: 0.88rem; font-weight: 500; color: var(--text-dark); cursor: pointer; transition: all 0.3s var(--transition); font-family: 'Outfit', sans-serif; }
        .time-slot:hover { border-color: var(--gold); background: rgba(196,166,107,0.04); }
        .time-slot.selected { border-color: var(--gold); background: var(--gold); color: #fff; box-shadow: 0 4px 16px rgba(196,166,107,0.3); }
        .selected-time-info { background: var(--beige); border-radius: var(--radius-sm); padding: 16px 20px; margin-top: 16px; font-size: 0.88rem; color: var(--moss); }
        .no-slots { text-align: center; padding: 48px; background: #fff; border-radius: var(--radius); }
        .no-slots p { color: var(--text-light); margin-bottom: 16px; }
        .link-back { color: var(--gold); font-size: 0.85rem; cursor: pointer; background: none; border: none; font-family: 'Outfit', sans-serif; }
        .loading-text { text-align: center; padding: 60px; color: var(--text-light); }
        @media (max-width: 768px) { .time-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .time-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="step-header">
        <span className="step-label">Passo 3 de 5 · {service.name}</span>
        <h2 className="step-title">Escolha o Horario</h2>
        <p className="step-subtitle">Duracao do servico: ~{formatDuration(service.duration_min)}</p>
      </div>

      <div className="time-wrapper">
        <div className="date-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {formatDate(date)}
        </div>

        {loading && <div className="loading-text">Verificando disponibilidade...</div>}

        {error && (
          <div className="no-slots">
            <p>{error}</p>
            <button className="link-back" onClick={onBack}>Escolher outra data</button>
          </div>
        )}

        {!loading && !error && slots.length === 0 && (
          <div className="no-slots">
            <p>Nenhum horario disponivel para {service.name} nesta data.</p>
            <button className="link-back" onClick={onBack}>Escolher outra data</button>
          </div>
        )}

        {!loading && !error && slots.length > 0 && (
          <>
            {morning.length > 0 && (
              <div className="time-period">
                <h4>Manha</h4>
                <div className="time-grid">
                  {morning.map(slot => (
                    <button
                      key={slot.start}
                      className={`time-slot ${selected?.start === slot.start ? 'selected' : ''}`}
                      onClick={() => setSelected(slot)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {afternoon.length > 0 && (
              <div className="time-period">
                <h4>Tarde</h4>
                <div className="time-grid">
                  {afternoon.map(slot => (
                    <button
                      key={slot.start}
                      className={`time-slot ${selected?.start === slot.start ? 'selected' : ''}`}
                      onClick={() => setSelected(slot)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selected && (
              <div className="selected-time-info">
                Inicio as <strong>{selected.label}</strong> · Termino aproximado as <strong>{formatEndTime(selected.end)}</strong>
              </div>
            )}
          </>
        )}
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar
        </button>
        <button className="btn-next" disabled={!selected} onClick={() => selected && onSelect(selected)}>
          Continuar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </>
  )
}
