'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from '@/components/admin/AppointmentCard'
import Loading from '@/components/ui/Loading'

function getTodayDate(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo'
  })
}

function formatDateDisplay(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const today = getTodayDate()

  useEffect(() => {
    fetch(`/api/admin/appointments?date=${today}`)
      .then(r => r.json())
      .then(data => setAppointments(data.appointments ?? []))
      .finally(() => setLoading(false))
  }, [today])

  // Separa agendamentos por status
  const pending   = appointments.filter(a => a.status === 'pending')
  const confirmed = appointments.filter(a => a.status === 'confirmed')
  const others    = appointments.filter(a => !['pending', 'confirmed'].includes(a.status))

  return (
    <div>
      {/* Header da página */}
      <div className="mb-8">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-1">
          Visao geral
        </p>
        <h1 className="font-serif text-3xl font-bold text-white capitalize">
          {formatDateDisplay(today)}
        </h1>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-[#EBE0CE]/08 p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] mb-2">
            Total hoje
          </p>
          <p className="font-serif text-4xl font-bold text-white">
            {appointments.length}
          </p>
        </div>
        <div className="border border-[#EBE0CE]/08 p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] mb-2">
            Pendentes
          </p>
          <p className="font-serif text-4xl font-bold text-yellow-400">
            {pending.length}
          </p>
        </div>
        <div className="border border-[#EBE0CE]/08 p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] mb-2">
            Confirmados
          </p>
          <p className="font-serif text-4xl font-bold text-green-400">
            {confirmed.length}
          </p>
        </div>
      </div>

      {loading && <Loading text="Carregando agenda" />}

      {!loading && appointments.length === 0 && (
        <div className="border border-[#EBE0CE]/08 p-12 text-center">
          <p className="font-serif text-xl text-[#EBE0CE] mb-2">
            Nenhum agendamento hoje
          </p>
          <p className="text-[#8A7560] text-sm">
            Aproveite o dia!
          </p>
        </div>
      )}

      {/* Pendentes primeiro */}
      {pending.length > 0 && (
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-widest uppercase text-yellow-400 mb-3">
            Aguardando confirmacao
          </p>
          <div className="space-y-2">
            {pending.map(a => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}

      {/* Confirmados */}
      {confirmed.length > 0 && (
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-widest uppercase text-green-400 mb-3">
            Confirmados
          </p>
          <div className="space-y-2">
            {confirmed.map(a => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}

      {/* Outros (cancelados, concluídos) */}
      {others.length > 0 && (
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] mb-3">
            Outros
          </p>
          <div className="space-y-2">
            {others.map(a => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}