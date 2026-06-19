'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import type { AppointmentStatus } from '@/types/database'

interface Appointment {
  id:            string
  client_name:   string
  client_email:  string
  client_phone:  string
  start_at:      string
  end_at:        string
  status:        AppointmentStatus
  notes:         string | null
  gcal_link:     string | null
  confirmed_at:  string | null
  cancelled_at:  string | null
  cancel_reason: string | null
  services: {
    name:        string
    duration_min: number
    price_min:   number
    price_max:   number | null
  } | null
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'long',
    day:     '2-digit',
    month:   'long',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour:    '2-digit',
    minute:  '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

function formatPhone(digits: string): string {
  if (digits.length === 11) {
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }
  return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
}

export default function AppointmentDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading]         = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [cancelReason, setCancelReason]   = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carrega os dados do agendamento
  useEffect(() => {
    fetch(`/api/admin/appointments/${id}`)
      .then(r => r.json())
      .then(data => setAppointment(data.appointment))
      .catch(() => setError('Erro ao carregar agendamento'))
      .finally(() => setLoading(false))
  }, [id])

  // Confirma o agendamento
  async function handleConfirm() {
    setActionLoading(true)
    setError(null)

    const res = await fetch(`/api/admin/appointments/${id}/confirm`, {
      method: 'POST',
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setActionLoading(false)
      return
    }

    // Atualiza o estado local sem precisar recarregar a página
    setAppointment(a => a ? { ...a, status: 'confirmed' } : a)
    setActionLoading(false)
  }

  // Cancela o agendamento
  async function handleCancel() {
    if (!cancelReason.trim()) {
      setError('Informe o motivo do cancelamento')
      return
    }

    setActionLoading(true)
    setError(null)

    const res = await fetch(`/api/admin/appointments/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: cancelReason }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setActionLoading(false)
      return
    }

    setAppointment(a => a ? { ...a, status: 'cancelled', cancel_reason: cancelReason } : a)
    setShowCancelForm(false)
    setActionLoading(false)
  }

  if (loading) return (
    <div className="ml-56 p-8">
      <Loading text="Carregando agendamento" />
    </div>
  )

  if (!appointment) return (
    <div className="text-center py-20">
      <p className="text-[#8A7560]">Agendamento nao encontrado.</p>
      <button
        onClick={() => router.back()}
        className="text-[#C49040] text-sm mt-4 hover:underline"
      >
        Voltar
      </button>
    </div>
  )

  const isPending   = appointment.status === 'pending'
  const isCancelled = appointment.status === 'cancelled'

  return (
    <div className="max-w-2xl">

      {/* Voltar */}
      <button
        onClick={() => router.back()}
        className="text-[#8A7560] text-sm hover:text-[#EBE0CE] transition-colors mb-8 flex items-center gap-2"
      >
        Voltar
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-2">
            Agendamento
          </p>
          <h1 className="font-serif text-3xl font-bold text-white">
            {appointment.client_name}
          </h1>
          <p className="text-[#8A7560] text-sm mt-1">
            {appointment.services?.name}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      {/* Dados do agendamento */}
      <div className="border border-[#EBE0CE]/08 divide-y divide-[#EBE0CE]/08 mb-6">

        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">
            Data e horario
          </span>
          <div className="text-right">
            <p className="text-[#EBE0CE] text-sm capitalize">
              {formatDateTime(appointment.start_at)}
            </p>
            <p className="text-[#8A7560] text-xs mt-0.5">
              ate {formatTime(appointment.end_at)}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">
            Servico
          </span>
          <div className="text-right">
            <p className="text-[#EBE0CE] text-sm">{appointment.services?.name}</p>
            <p className="text-[#8A7560] text-xs mt-0.5">
              {formatDuration(appointment.services?.duration_min ?? 0)}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">
            WhatsApp
          </span>
          
            <a href={`https://wa.me/55${appointment.client_phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C49040] text-sm hover:underline"
          >
            {formatPhone(appointment.client_phone)}
          </a>
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">
            E-mail
          </span>
          <p className="text-[#EBE0CE] text-sm">{appointment.client_email}</p>
        </div>

        {appointment.notes && (
          <div className="px-6 py-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
              Observacoes
            </span>
            <p className="text-[#EBE0CE] text-sm leading-relaxed">
              {appointment.notes}
            </p>
          </div>
        )}

        {isCancelled && appointment.cancel_reason && (
          <div className="px-6 py-4 bg-red-500/05">
            <span className="font-mono text-[10px] tracking-widest uppercase text-red-400 block mb-2">
              Motivo do cancelamento
            </span>
            <p className="text-[#EBE0CE] text-sm">{appointment.cancel_reason}</p>
          </div>
        )}

      </div>

      {/* Link do Google Calendar */}
      {appointment.gcal_link && (
        
          <a href={appointment.gcal_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#8A7560] text-xs hover:text-[#C49040] transition-colors mb-8"
        >
          Ver no Google Calendar
        </a>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Acoes — só aparecem se o agendamento ainda pode ser alterado */}
      {isPending && !showCancelForm && (
        <div className="flex gap-4">
          <Button
            onClick={handleConfirm}
            loading={actionLoading}
            fullWidth
          >
            Confirmar agendamento
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCancelForm(true)}
            disabled={actionLoading}
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Formulário de cancelamento */}
      {showCancelForm && (
        <div className="border border-red-500/20 p-6">
          <p className="text-[#EBE0CE] text-sm font-medium mb-4">
            Motivo do cancelamento
          </p>
          <textarea
            value={cancelReason}
            onChange={e => {
              setCancelReason(e.target.value)
              setError(null)
            }}
            placeholder="Ex: Horario indisponivel, reagendar para outra data..."
            rows={3}
            className="
              w-full bg-transparent border border-[#EBE0CE]/10
              px-4 py-3 text-sm text-[#EBE0CE]
              placeholder:text-[#8A7560]/60
              outline-none focus:border-red-500/50
              resize-none mb-4
            "
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelForm(false)
                setCancelReason('')
                setError(null)
              }}
              disabled={actionLoading}
            >
              Voltar
            </Button>
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="
                flex-1 bg-red-500/10 border border-red-500/30
                text-red-400 text-sm font-medium
                px-6 py-3
                hover:bg-red-500/20
                transition-colors
                disabled:opacity-50
              "
            >
              {actionLoading ? 'Cancelando...' : 'Confirmar cancelamento'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}