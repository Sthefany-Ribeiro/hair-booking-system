import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { updateCalendarEvent } from '@/lib/google-calendar/events'

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
  const supabase = getAdminClient()

  // Busca o agendamento
  const { data: appointment, error: fetchError } = await supabase
    .from('appointments')
    .select('*, services(name)')
    .eq('id', id)
    .single()

  if (fetchError || !appointment) {
    return NextResponse.json(
      { error: 'Agendamento nao encontrado' },
      { status: 404 }
    )
  }

  if (appointment.status !== 'pending') {
    return NextResponse.json(
      { error: 'Apenas agendamentos pendentes podem ser confirmados' },
      { status: 400 }
    )
  }

  // Atualiza status no banco
  const { error: updateError } = await supabase
    .from('appointments')
    .update({
      status:       'confirmed',
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Erro ao confirmar agendamento' },
      { status: 500 }
    )
  }

  // Atualiza evento no Google Calendar — muda cor para verde e remove o emoji de pendente
  if (appointment.gcal_event_id) {
    try {
      await updateCalendarEvent(
        appointment.gcal_event_id,
        `${appointment.services?.name} — ${appointment.client_name}`
      )
    } catch {
      console.error('Erro ao atualizar evento no Google Calendar')
    }
  }

  return NextResponse.json({ success: true })
}