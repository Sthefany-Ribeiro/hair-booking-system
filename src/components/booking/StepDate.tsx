'use client'

import { useState } from 'react'
import type { Service } from '@/types/database'

interface Props {
  service: Service
  onSelect: (date: string) => void
  onBack: () => void
}

const MONTHS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
const CLOSED = [0, 1] // domingo e segunda

function pad(d: string): string {
  return `${d}T12:00:00`
}

function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

export default function StepDate({ service, onSelect, onBack }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate())
  const maxKey = toKey(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function isDisabled(day: number): boolean {
    const key = toKey(viewYear, viewMonth, day)
    if (key < todayKey || key > maxKey) return true
    const dow = new Date(viewYear, viewMonth, day).getDay()
    return CLOSED.includes(dow)
  }

  return (
    <>
      <style>{`
        .calendar-wrapper { background: #fff; border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-md); max-width: 520px; margin: 0 auto; }
        .calendar-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .calendar-nav h3 { font-size: 1.4rem; color: var(--moss); }
        .calendar-nav button { width: 40px; height: 40px; border-radius: 50%; background: var(--beige); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; color: var(--moss); font-size: 1.1rem; }
        .calendar-nav button:hover { background: var(--gold); color: #fff; }
        .calendar-nav button:disabled { opacity: 0.3; cursor: not-allowed; }
        .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px; }
        .calendar-weekdays span { text-align: center; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-light); padding: 8px 0; }
        .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.88rem; font-weight: 400; cursor: pointer; transition: all 0.3s var(--transition); border: none; background: none; color: var(--text-dark); font-family: 'Outfit', sans-serif; }
        .cal-day:hover:not(.disabled):not(.empty) { background: var(--beige); }
        .cal-day.selected { background: var(--gold) !important; color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(196,166,107,0.3); }
        .cal-day.disabled { color: var(--border); cursor: not-allowed; }
        .cal-day.empty { cursor: default; }
        .cal-day.today { border: 2px solid var(--gold); font-weight: 600; }
        .selected-badge { display: inline-flex; align-items: center; gap: 10px; background: var(--beige); padding: 12px 24px; border-radius: 60px; font-size: 0.88rem; color: var(--moss); margin: 24px auto 0; display: flex; justify-content: center; max-width: 520px; }
        @media (max-width: 768px) { .calendar-wrapper { padding: 24px; } }
      `}</style>

      <div className="step-header">
        <span className="step-label">Passo 2 de 5 · {service.name}</span>
        <h2 className="step-title">Escolha a Data</h2>
        <p className="step-subtitle">Selecione o dia de preferencia para seu atendimento</p>
      </div>

      <div className="calendar-wrapper">
        <div className="calendar-nav">
          <button onClick={prevMonth} disabled={!canGoPrev} aria-label="Mes anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h3>{MONTHS[viewMonth]} {viewYear}</h3>
          <button onClick={nextMonth} aria-label="Proximo mes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="calendar-days">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} className="cal-day empty" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = toKey(viewYear, viewMonth, day)
            const disabled = isDisabled(day)
            const isToday = key === todayKey
            const isSel = selected === key
            return (
              <button
                key={day}
                className={`cal-day ${disabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}`}
                onClick={() => !disabled && setSelected(key)}
                disabled={disabled}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="selected-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A66B" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {new Date(pad(selected)).toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}
        </div>
      )}

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
