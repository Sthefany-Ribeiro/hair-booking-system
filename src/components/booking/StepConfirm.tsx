'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import type { BookingStep } from '@/types/booking'

interface Props {
  booking: Required<BookingStep>
  onBack: () => void
}

type PageState = 'review' | 'loading' | 'success' | 'error'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

function formatDate(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatPhone(digits: string): string {
  if (digits.length === 11) {
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }
  return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
}

export default function StepConfirm({ booking, onBack }: Props) {
  const [state, setState] = useState<PageState>('review')
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const service  = booking.service!
  const date     = booking.date!
  const timeSlot = booking.timeSlot!
  const client   = booking.client!

  async function handleConfirm() {
    setState('loading')
    setErrorMsg(null)
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
      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao confirmar agendamento')
      }
      setAppointmentId(data.id)
      setState('success')
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Erro inesperado. Tente novamente.')
      setState('error')
    }
  }

  if (state === 'success') {
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'
    const msg = encodeURIComponent(
      'Ola! Agendei ' + service.name + ' para ' + formatDate(date) + ' as ' + timeSlot.label + '. Aguardo confirmacao!'
    )
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[#C49040]/10 border border-[#C49040]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-[#C49040]">ok</span>
        </div>
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-4">
          Solicitacao enviada
        </p>
        <h2 className="font-serif text-3xl font-bold text-white mb-4">
          Quase la!
        </h2>
        <p className="text-[#8A7560] text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Seu agendamento foi registrado e esta aguardando confirmacao.
        </p>
        <div className="border border-[#EBE0CE]/08 p-6 text-left max-w-sm mx-auto mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#8A7560] text-xs font-mono uppercase">Servico</span>
              <span className="text-[#EBE0CE] text-sm">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A7560] text-xs font-mono uppercase">Data</span>
              <span className="text-[#EBE0CE] text-sm">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A7560] text-xs font-mono uppercase">Horario</span>
              <span className="text-[#EBE0CE] text-sm">{timeSlot.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A7560] text-xs font-mono uppercase">Codigo</span>
              <span className="text-[#C49040] text-xs font-mono">{appointmentId ? appointmentId.slice(0, 8).toUpperCase() : ''}</span>
            </div>
          </div>
        </div>
        <a href={'https://wa.me/' + whatsapp + '?text=' + msg}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-6 py-3"
        >
          Confirmar pelo WhatsApp
        </a>
        <div className="mt-6">
          <a href="/" className="text-[#8A7560] text-xs hover:text-[#EBE0CE] transition-colors">
            Voltar ao site
          </a>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-xl text-red-400">x</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">
          Algo deu errado
        </h2>
        <p className="text-[#8A7560] text-sm mb-8 max-w-sm mx-auto">
          {errorMsg}
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onBack}>Voltar</Button>
          <Button onClick={handleConfirm}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-3">
          Passo 5
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
          Tudo certo
        </h1>
        <p className="text-[#8A7560] text-sm mt-4">
          Confira os dados antes de confirmar.
        </p>
      </div>
      <div className="border border-[#EBE0CE]/08 divide-y divide-[#EBE0CE]/08 mb-8">
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">Servico</span>
          <div className="text-right">
            <p className="text-[#EBE0CE] text-sm">{service.name}</p>
            <p className="text-[#8A7560] text-xs mt-0.5">~{formatDuration(service.duration_min)}</p>
          </div>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">Data</span>
          <p className="text-[#EBE0CE] text-sm">{formatDate(date)}</p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">Horario</span>
          <div className="text-right">
            <p className="text-[#EBE0CE] text-sm">{timeSlot.label}</p>
            <p className="text-[#8A7560] text-xs mt-0.5">ate {formatTime(timeSlot.end)}</p>
          </div>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">Nome</span>
          <p className="text-[#EBE0CE] text-sm">{client.name}</p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">WhatsApp</span>
          <p className="text-[#EBE0CE] text-sm">{formatPhone(client.phone)}</p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560]">E-mail</span>
          <p className="text-[#EBE0CE] text-sm">{client.email}</p>
        </div>
        {client.notes && (
          <div className="px-6 py-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">Obs</span>
            <p className="text-[#EBE0CE] text-sm">{client.notes}</p>
          </div>
        )}
      </div>
      <p className="text-[#8A7560] text-xs leading-relaxed mb-8">
        Ao confirmar, um evento sera criado na agenda da profissional.
      </p>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} disabled={state === 'loading'}>
          Voltar
        </Button>
        <Button onClick={handleConfirm} loading={state === 'loading'} fullWidth>
          Confirmar agendamento
        </Button>
      </div>
    </div>
  )
}
