'use client'

import { useEffect, useState } from 'react'
import type { Service } from '@/types/database'

interface Props {
  onSelect: (service: Service) => void
}

const ICONS: Record<string, string> = {
  'box-braids': '✦',
  'nago': '◇',
  'tranca-simples': '❋',
  'mega-hair': '✧',
  'tranca-personalizada': '⬡',
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h${m}min`
}

export default function StepService({ onSelect }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Service | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setServices(d.services ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .service-card { background: #fff; border: 2px solid var(--border); border-radius: var(--radius); padding: 28px; cursor: pointer; transition: all 0.4s var(--transition); position: relative; overflow: hidden; text-align: left; width: 100%; font-family: 'Outfit', sans-serif; }
        .service-card:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .service-card.selected { border-color: var(--gold); background: linear-gradient(135deg, rgba(196,166,107,0.04), rgba(196,166,107,0.08)); box-shadow: 0 8px 30px rgba(196,166,107,0.15); }
        .service-card.selected::after { content: '✓'; position: absolute; top: 14px; right: 14px; width: 24px; height: 24px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; font-weight: 700; line-height: 24px; text-align: center; }
        .service-icon { width: 52px; height: 52px; background: rgba(196,166,107,0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 1.4rem; }
        .service-card h3 { font-size: 1.3rem; color: var(--moss); margin-bottom: 8px; }
        .service-card p { font-size: 0.82rem; color: var(--text-light); line-height: 1.6; margin-bottom: 14px; }
        .service-meta { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border); }
        .service-price { font-size: 0.9rem; font-weight: 600; color: var(--moss); }
        .service-duration { font-size: 0.75rem; color: var(--text-light); display: flex; align-items: center; gap: 4px; }
        .loading-text { text-align: center; padding: 60px; color: var(--text-light); font-size: 0.9rem; }
        @media (max-width: 768px) { .services-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .services-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="step-header">
        <span className="step-label">Passo 1 de 5</span>
        <h2 className="step-title">Escolha seu Servico</h2>
        <p className="step-subtitle">Selecione o estilo que fala com voce</p>
      </div>

      {loading ? (
        <div className="loading-text">Carregando servicos...</div>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <button
              key={service.id}
              className={`service-card ${selected?.id === service.id ? 'selected' : ''}`}
              onClick={() => setSelected(service)}
            >
              <div className="service-icon">
                {ICONS[service.slug] ?? '✦'}
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-meta">
                <span className="service-price">
                  A partir de R$ {service.price_min.toFixed(0)}
                </span>
                <span className="service-duration">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {formatDuration(service.duration_min)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="step-nav">
        <button className="btn-back hidden">Voltar</button>
        <button
          className="btn-next"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Continuar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </>
  )
}
