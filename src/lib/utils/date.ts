export function toSaoPauloDate(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour:     '2-digit',
    minute:   '2-digit',
    timeZone: 'America/Sao_Paulo'
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day:     '2-digit',
    month:   'long',
    year:    'numeric',
    timeZone: 'America/Sao_Paulo'
  })
}

export function getDayOfWeek(date: string): string {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]
  const d = new Date(`${date}T12:00:00`)
  return days[d.getDay()]
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}