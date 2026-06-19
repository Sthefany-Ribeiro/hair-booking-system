'use client'

import { useEffect, useState } from 'react'
import Loading from '@/components/ui/Loading'
import type { Service } from '@/types/database'

interface Props {
  onSelect: (service: Service) => void
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

function formatPrice(min: number, max: number | null): string {
  if (!max || max === min) return `R$ ${min.toFixed(0)}`
  return `a partir de R$ ${min.toFixed(0)}`
}

export default function StepService({ onSelect }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setServices(data.services)
      })
      .catch(() => setError('Não foi possível carregar os serviços.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading text="Buscando serviços" />

  if (error) return (
    <div className="text-center py-20">
      <p className="text-[#8A7560]">{error}</p>
    </div>
  )

  return (
    <div>
      {/* Título */}
      <div className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-3">
          Passo 1
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
          Qual serviço<br />
          <em className="italic text-[#C49040]">você deseja?</em>
        </h1>
        <p className="text-[#8A7560] text-sm mt-4 leading-relaxed">
          Cada serviço tem duração exclusiva reservada para você.
        </p>
      </div>

      {/* Lista de serviços */}
      <ul className="space-y-0">
        {services.map((service, i) => (
          <li key={service.id}>
            <button
              onClick={() => onSelect(service)}
              className="
                w-full text-left
                flex items-center gap-6
                py-6 border-b border-[#EBE0CE]/08
                hover:bg-[#EBE0CE]/03
                transition-all duration-200
                group
              "
            >
              {/* Número */}
              <span className="font-mono text-xs text-[#8A7560] w-6 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-xl text-[#EBE0CE] group-hover:text-white transition-colors">
                  {service.name}
                </p>
                {service.description && (
                  <p className="text-[#8A7560] text-xs mt-1 truncate">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Duração */}
              <div className="text-right shrink-0">
                <p className="font-mono text-xs text-[#8A7560]">
                  ~{formatDuration(service.duration_min)}
                </p>
                <p className="text-[#EBE0CE] text-sm mt-0.5">
                  {formatPrice(service.price_min, service.price_max)}
                </p>
              </div>

              {/* Seta */}
              <span className="
                text-[#C49040] text-sm
                opacity-0 -translate-x-2
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-200
                shrink-0
              ">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}