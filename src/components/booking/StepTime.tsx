'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import type { Service } from '@/types/database'
import type { TimeSlot } from '@/types/booking'

interface Props {
  service: Service
  date: string
  onSelect: (slot: TimeSlot) => void
  onBack: () => void
}

function formatDateDisplay(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

export default function StepTime({ service, date, onSelect, onBack }: Props) {
  const [slots, setSlots]       = useState<TimeSlot[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [selected, setSelected] = useState<TimeSlot | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setSelected(null)

    fetch(`/api/availability?service_id=${service.id}&date=${date}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setSlots(data.slots)
      })
      .catch(() => setError('Não foi possível verificar a disponibilidade.'))
      .finally(() => setLoading(false))
  }, [service.id, date])

  if (loading) return <Loading text="Verificando disponibilidade" />

  return (
    <div>
      {/* Título */}
      <div className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-3">
          Passo 3 · {service.name}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
          Escolha o<br />
          <em className="italic text-[#C49040]">horário ideal.</em>
        </h1>
        <p className="text-[#8A7560] text-sm mt-4">
          {formatDateDisplay(date)} · duração ~{formatDuration(service.duration_min)}
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div className="py-10 text-center">
          <p className="text-[#8A7560]">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              fetch(`/api/availability?service_id=${service.id}&date=${date}`)
                .then(r => r.json())
                .then(data => setSlots(data.slots))
                .catch(() => setError('Não foi possível verificar a disponibilidade.'))
                .finally(() => setLoading(false))
            }}
            className="text-[#C49040] text-sm mt-4 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Sem horários */}
      {!error && slots.length === 0 && (
        <div className="border border-[#EBE0CE]/08 p-10 text-center">
          <p className="font-serif text-xl text-[#EBE0CE] mb-2">
            Nenhum horário disponível
          </p>
          <p className="text-[#8A7560] text-sm">
            Não há vagas para {service.name} nessa data.
            Tente outro dia.
          </p>
          <button
            onClick={onBack}
            className="text-[#C49040] text-sm mt-6 hover:underline"
          >
            ← Escolher outra data
          </button>
        </div>
      )}

      {/* Grid de horários */}
      {!error && slots.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
            {slots.map(slot => {
              const isSelected = selected?.start === slot.start

              return (
                <button
                  key={slot.start}
                  onClick={() => setSelected(slot)}
                  className={`
                    py-3.5 text-center font-mono text-sm
                    border transition-all duration-150
                    ${isSelected
                      ? 'border-[#C49040] bg-[#C49040] text-[#0B0806] font-bold'
                      : 'border-[#EBE0CE]/10 text-[#EBE0CE] hover:border-[#C49040]/50 hover:text-[#C49040]'
                    }
                  `}
                >
                  {slot.label}
                </button>
              )
            })}
          </div>

          {/* Horário selecionado */}
          {selected && (
            <div className="mb-6 px-4 py-3 border border-[#C49040]/30 bg-[#C49040]/05">
              <p className="text-sm text-[#8A7560]">
                Início às{' '}
                <span className="text-[#EBE0CE] font-medium">{selected.label}</span>
                {' '}· Término aproximado às{' '}
                <span className="text-[#EBE0CE] font-medium">
                  {new Date(selected.end).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                  })}
                </span>
              </p>
            </div>
          )}
        </>
      )}

      {/* Navegação */}
      <div className="flex gap-4 mt-8">
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          fullWidth
        >
          Preencher dados →
        </Button>
      </div>
    </div>
  )
}