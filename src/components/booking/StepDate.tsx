'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import type { Service } from '@/types/database'

interface Props {
  service: Service
  onSelect: (date: string) => void
  onBack: () => void
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Dias da semana que a profissional NÃO atende (0=Dom, 1=Seg)
const CLOSED_DAYS = [0, 1]

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function StepDate({ service, onSelect, onBack }: Props) {
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected]   = useState<string | null>(null)

  // Limite máximo: 60 dias à frente
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  function isDisabled(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day)
    const dateKey = formatDateKey(viewYear, viewMonth, day)
    const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

    // Passado
    if (dateKey < todayKey) return true

    // Além do limite
    if (date > maxDate) return true

    // Dia fechado
    if (CLOSED_DAYS.includes(date.getDay())) return true

    return false
  }

  // Dias do mês atual
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Dia da semana do primeiro dia do mês
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  // Não pode navegar para mês anterior ao atual
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth())

  return (
    <div>
      {/* Título */}
      <div className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-3">
          Passo 2 · {service.name}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
          Qual a melhor<br />
          <em className="italic text-[#C49040]">data para você?</em>
        </h1>
        <p className="text-[#8A7560] text-sm mt-4">
          Segunda e domingo não há atendimento.
        </p>
      </div>

      {/* Calendário */}
      <div className="border border-[#EBE0CE]/08 p-6">

        {/* Navegação do mês */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center text-[#8A7560] hover:text-[#EBE0CE] disabled:opacity-20 transition-colors"
          >
            ←
          </button>
          <p className="font-serif text-lg text-white">
            {MONTHS[viewMonth]} {viewYear}
          </p>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center text-[#8A7560] hover:text-[#EBE0CE] transition-colors"
          >
            →
          </button>
        </div>

        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center font-mono text-[10px] text-[#8A7560] tracking-widest uppercase py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Dias */}
        <div className="grid grid-cols-7 gap-1">
          {/* Espaços vazios antes do primeiro dia */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Dias do mês */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateKey = formatDateKey(viewYear, viewMonth, day)
            const disabled = isDisabled(day)
            const isSelected = selected === dateKey

            return (
              <button
                key={day}
                onClick={() => !disabled && setSelected(dateKey)}
                disabled={disabled}
                className={`
                  aspect-square flex items-center justify-center
                  text-sm font-mono transition-all duration-150
                  ${isSelected
                    ? 'bg-[#C49040] text-[#0B0806] font-bold'
                    : disabled
                      ? 'text-[#EBE0CE]/15 cursor-not-allowed'
                      : 'text-[#EBE0CE] hover:bg-[#EBE0CE]/08'
                  }
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Data selecionada */}
      {selected && (
        <div className="mt-4 px-4 py-3 border border-[#C49040]/30 bg-[#C49040]/05">
          <p className="text-sm text-[#8A7560]">
            Data selecionada:{' '}
            <span className="text-[#EBE0CE]">
              {new Date(selected + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
              })}
            </span>
          </p>
        </div>
      )}

      {/* Navegação */}
      <div className="flex gap-4 mt-8">
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          fullWidth
        >
          Escolher horário →
        </Button>
      </div>
    </div>
  )
}