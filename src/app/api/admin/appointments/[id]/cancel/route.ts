import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { deleteCalendarEvent } from '@/lib/google-calendar/events'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { reason } = await req.json()
  const supabase = getAdminClient()

  // Busca o agendamento
  const { data: appointment, error: fetchError } = await supabase
    .from('appointments')
    .select('gcal_event_id, status, client_name, client_phone')
    .eq('id', id)
    .single()

  if (fetchError || !appointment) {
    return NextResponse.json(
      { error: 'Agendamento nao encontrado' },
      { status: 404 }
    )
  }

  if (appointment.status === 'cancelled') {
    return NextResponse.json(
      { error: 'Agendamento ja esta cancelado' },
      { status: 400 }
    )
  }

  // Atualiza status no banco
  const { error: updateError } = await supabase
    .from('appointments')
    .update({
      status:        'cancelled',
      cancelled_at:  new Date().toISOString(),
      cancel_reason: reason ?? null,
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Erro ao cancelar agendamento' },
      { status: 500 }
    )
  }

  // Remove evento do Google Calendar — libera o horário automaticamente
  if (appointment.gcal_event_id) {
    try {
      await deleteCalendarEvent(appointment.gcal_event_id)
    } catch {
      console.error('Erro ao remover evento do Google Calendar')
    }
  }

  return NextResponse.json({ success: true })
}