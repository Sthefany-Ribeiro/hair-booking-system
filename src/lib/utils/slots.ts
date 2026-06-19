import { getDayOfWeek, addMinutes } from './date'

export interface BusySlot {
  start: Date
  end:   Date
}

export interface AvailableSlot {
  start: Date
  end:   Date
  label: string
}

interface GetSlotsInput {
  date:            string
  serviceDuration: number
  bufferMin:       number
  minAdvanceHours: number
  workingHours:    Record<string, { open: boolean; start?: string; end?: string }>
  busySlots:       BusySlot[]
}

export function calculateAvailableSlots(input: GetSlotsInput): AvailableSlot[] {
  const {
    date,
    serviceDuration,
    bufferMin,
    minAdvanceHours,
    workingHours,
    busySlots
  } = input

  // 1. Verifica se o dia está aberto
  const dayOfWeek = getDayOfWeek(date)
  const dayConfig = workingHours[dayOfWeek]

  if (!dayConfig?.open || !dayConfig.start || !dayConfig.end) {
    return []
  }

  // 2. Define abertura e fechamento do dia
  const [openHour,  openMin]  = dayConfig.start.split(':').map(Number)
  const [closeHour, closeMin] = dayConfig.end.split(':').map(Number)

  const openTime  = new Date(`${date}T${pad(openHour)}:${pad(openMin)}:00-03:00`)
  const closeTime = new Date(`${date}T${pad(closeHour)}:${pad(closeMin)}:00-03:00`)

  // 3. Tempo total bloqueado por slot = duração do serviço + buffer
  const totalBlockMs  = (serviceDuration + bufferMin) * 60_000

  // 4. Antecedência mínima a partir de agora
  const minAdvanceMs  = minAdvanceHours * 3_600_000
  const earliestStart = new Date(Date.now() + minAdvanceMs)

  // 5. Mescla e ordena todos os períodos ocupados
  const merged = mergeBusySlots(busySlots)

  // 6. Gera os slots de 30 em 30 minutos dentro do horário de funcionamento
  const slots: AvailableSlot[] = []
  let cursor = openTime.getTime()

  while (cursor + totalBlockMs <= closeTime.getTime()) {
    const slotStart = new Date(cursor)
    const slotEnd   = new Date(cursor + totalBlockMs)

    // Ignora slots no passado ou sem antecedência mínima
    if (slotStart >= earliestStart) {
      const hasConflict = merged.some(busy =>
        slotStart < busy.end && slotEnd > busy.start
      )

      if (!hasConflict) {
        slots.push({
          start: slotStart,
          end:   addMinutes(slotStart, serviceDuration),
          label: slotStart.toLocaleTimeString('pt-BR', {
            hour:     '2-digit',
            minute:   '2-digit',
            timeZone: 'America/Sao_Paulo'
          })
        })
      }
    }

    cursor += 30 * 60_000
  }

  return slots
}

function mergeBusySlots(slots: BusySlot[]): BusySlot[] {
  if (slots.length === 0) return []

  const sorted = [...slots].sort((a, b) => a.start.getTime() - b.start.getTime())
  const merged = [{ ...sorted[0] }]

  for (let i = 1; i < sorted.length; i++) {
    const last    = merged[merged.length - 1]
    const current = sorted[i]

    if (current.start <= last.end) {
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()))
    } else {
      merged.push({ ...current })
    }
  }

  return merged
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}