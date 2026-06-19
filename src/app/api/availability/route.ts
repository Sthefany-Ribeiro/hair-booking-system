import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGCalBusySlots } from '@/lib/google-calendar/availability'
import { calculateAvailableSlots } from '@/lib/utils/slots'
import type { WorkingHours } from '@/types/database'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const serviceId = searchParams.get('service_id')
  const date      = searchParams.get('date')

  if (!serviceId || !date) {
    return NextResponse.json(
      { error: 'service_id e date são obrigatórios' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Busca o serviço
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id, duration_min')
    .eq('id', serviceId)
    .eq('is_active', true)
    .single()

  if (serviceError || !service) {
    return NextResponse.json(
      { error: 'Serviço não encontrado' },
      { status: 404 }
    )
  }

  // Busca configurações do negócio
  const { data: configRows } = await supabase
    .from('business_config')
    .select('key, value')
    .in('key', ['working_hours', 'appointment_buffer_min', 'min_advance_hours'])

  const config: Record<string, any> = {}
  configRows?.forEach(row => { config[row.key] = row.value })

  const workingHours  = config['working_hours'] as WorkingHours
  const bufferMin     = (config['appointment_buffer_min'] as { value: number })?.value ?? 30
  const minAdvanceHours = (config['min_advance_hours'] as { value: number })?.value ?? 2

  // Busca agendamentos já existentes no dia
  const dayStart = `${date}T00:00:00-03:00`
  const dayEnd   = `${date}T23:59:59-03:00`

  const { data: appointments } = await supabase
    .from('appointments')
    .select('start_at, end_at')
    .neq('status', 'cancelled')
    .gte('start_at', dayStart)
    .lte('start_at', dayEnd)

  // Busca bloqueios manuais do dia
  const { data: blocks } = await supabase
    .from('blocked_periods')
    .select('start_at, end_at')
    .lte('start_at', dayEnd)
    .gte('end_at', dayStart)

  // Busca eventos do Google Calendar
  let gcalBusy: { start: Date; end: Date }[] = []
  try {
    gcalBusy = await getGCalBusySlots(date)
  } catch {
    console.error('Google Calendar indisponível — continuando sem eventos externos')
  }

  // Monta array de períodos ocupados
  const busySlots = [
    ...(appointments ?? []).map(a => ({
      start: new Date(a.start_at),
      end:   new Date(a.end_at)
    })),
    ...(blocks ?? []).map(b => ({
      start: new Date(b.start_at),
      end:   new Date(b.end_at)
    })),
    ...gcalBusy
  ]

  // Calcula slots disponíveis
  const slots = calculateAvailableSlots({
    date,
    serviceDuration: service.duration_min,
    bufferMin,
    minAdvanceHours,
    workingHours,
    busySlots
  })

  // Serializa as datas para string antes de retornar
  const serialized = slots.map(slot => ({
    start: slot.start.toISOString(),
    end:   slot.end.toISOString(),
    label: slot.label
  }))

  return NextResponse.json({ slots: serialized })
}