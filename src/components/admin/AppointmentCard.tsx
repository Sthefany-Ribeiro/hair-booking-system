import StatusBadge from './StatusBadge'
import type { AppointmentStatus } from '@/types/database'
import Link from 'next/link'

interface Props {
  appointment: {
    id: string
    client_name: string
    client_phone: string
    start_at: string
    end_at: string
    status: AppointmentStatus
    notes: string | null
    services: {
      name: string
      duration_min: number
    } | null
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

export default function AppointmentCard({ appointment }: Props) {
  const { id, client_name, client_phone, start_at, end_at, status, notes, services } = appointment

  return (
    <Link
      href={`/admin/agendamentos/${id}`}
      className="
        block
        border border-[#EBE0CE]/08
        hover:border-[#C49040]/30
        transition-colors
        p-5
      "
    >
      {/* Linha superior: horário + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <p className="font-mono text-sm text-[#C49040]">
            {formatTime(start_at)}
          </p>
          <span className="text-[#EBE0CE]/20 text-xs">→</span>
          <p className="font-mono text-sm text-[#8A7560]">
            {formatTime(end_at)}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Nome da cliente e serviço */}
      <div className="mb-2">
        <p className="text-[#EBE0CE] font-medium">{client_name}</p>
        <p className="text-[#8A7560] text-sm mt-0.5">
          {services?.name} · {formatDuration(services?.duration_min ?? 0)}
        </p>
      </div>

      {/* Telefone */}
      <p className="font-mono text-xs text-[#8A7560]">{client_phone}</p>

      {/* Observações */}
      {notes && (
        <p className="text-[#8A7560] text-xs mt-2 border-t border-[#EBE0CE]/06 pt-2 italic">
          {notes}
        </p>
      )}
    </Link>
  )
}