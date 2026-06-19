import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCalendarEvent } from '@/lib/google-calendar/events'
import type { CreateAppointmentInput } from '@/types/booking'

export async function POST(req: NextRequest) {
  const body: CreateAppointmentInput = await req.json()

  const { service_id, client_name, client_email, client_phone, start_at, notes } = body

  // Validação básica
  if (!service_id || !client_name || !client_email || !client_phone || !start_at) {
    return NextResponse.json(
      { error: 'Todos os campos obrigatórios devem ser preenchidos' },
      { status: 400 }
    )
  }

  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  console.log('body recebido:', { service_id, client_name, client_email, client_phone, start_at })

  // Busca o serviço para calcular o end_at
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('name, duration_min')
    .eq('id', service_id)
    .single()

  if (serviceError || !service) {
    return NextResponse.json(
      { error: 'Serviço não encontrado' },
      { status: 404 }
    )
  }

  const startAt = new Date(start_at)
  const endAt   = new Date(startAt.getTime() + service.duration_min * 60_000)

  // Verifica conflito de horário no banco (double-check)
  const { count } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'cancelled')
    .lt('start_at', endAt.toISOString())
    .gt('end_at', startAt.toISOString())

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Horário não disponível. Por favor escolha outro horário.' },
      { status: 409 }
    )
  }

  // Cria evento no Google Calendar
  let gcalEventId: string | null = null
  let gcalLink:    string | null = null

  try {
    const event = await createCalendarEvent({
      summary:     ` ${service.name} — ${client_name}`,
      description: `Cliente: ${client_name}\nTelefone: ${client_phone}\nE-mail: ${client_email}${notes ? `\nObs: ${notes}` : ''}`,
      startAt,
      endAt
    })
    gcalEventId = event.id
    gcalLink    = event.htmlLink
  } catch (e) {
    console.error('Erro ao criar evento no Google Calendar:', e)
  }

  // Salva o agendamento no banco
  const { data: appointment, error: insertError } = await supabase
    .from('appointments')
    .insert({
      service_id,
      client_name,
      client_email,
      client_phone,
      start_at:     startAt.toISOString(),
      end_at:       endAt.toISOString(),
      notes:        notes ?? null,
      gcal_event_id: gcalEventId,
      gcal_link:    gcalLink,
      status:       'pending'
    })
    .select('id, gcal_link')
    .single()

  console.log('erro ao inserir:', insertError)
  if (insertError) {
    return NextResponse.json(
      { error: 'Erro ao salvar agendamento' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { id: appointment.id, gcal_link: appointment.gcal_link },
    { status: 201 }
  )
}