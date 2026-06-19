'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from '@/components/admin/AppointmentCard'
import Loading from '@/components/ui/Loading'
import type { AppointmentStatus } from '@/types/database'

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'Todos',       value: ''          },
  { label: 'Pendentes',   value: 'pending'   },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Cancelados',  value: 'cancelled' },
  { label: 'Concluidos',  value: 'completed' },
]

function getTodayDate(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  })
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [date, setDate]                 = useState(getTodayDate())
  const [status, setStatus]             = useState('')

  // Busca agendamentos sempre que mudar data ou status
  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams()
    if (date)   params.set('date', date)
    if (status) params.set('status', status)

    fetch(`/api/admin/appointments?${params.toString()}`)
      .then(r => r.json())
      .then(data => setAppointments(data.appointments ?? []))
      .finally(() => setLoading(false))
  }, [date, status])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-1">
          Painel
        </p>
        <h1 className="font-serif text-3xl font-bold text-white">
          Agendamentos
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* Filtro de data */}
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="
              bg-transparent border border-[#EBE0CE]/10
              px-4 py-2.5 text-sm text-[#EBE0CE]
              outline-none focus:border-[#C49040]/50
              [color-scheme:dark]
            "
          />
        </div>

        {/* Filtro de status */}
        <div>
          <label className="font-mono text-[10px] tracking-widests uppercase text-[#8A7560] block mb-2">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                className={`
                  px-4 py-2 text-xs font-mono border transition-colors
                  ${status === filter.value
                    ? 'border-[#C49040] text-[#C49040] bg-[#C49040]/10'
                    : 'border-[#EBE0CE]/10 text-[#8A7560] hover:border-[#EBE0CE]/30 hover:text-[#EBE0CE]'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Resultado */}
      {loading && <Loading text="Buscando agendamentos" />}

      {!loading && appointments.length === 0 && (
        <div className="border border-[#EBE0CE]/08 p-12 text-center">
          <p className="font-serif text-xl text-[#EBE0CE] mb-2">
            Nenhum agendamento encontrado
          </p>
          <p className="text-[#8A7560] text-sm">
            Tente mudar os filtros acima.
          </p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] mb-4">
            {appointments.length} resultado{appointments.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            {appointments.map(a => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}