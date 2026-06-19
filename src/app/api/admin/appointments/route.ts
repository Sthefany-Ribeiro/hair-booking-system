import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Sempre usa service_role no painel admin — bypassa RLS
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date   = searchParams.get('date')
  const status = searchParams.get('status')

  const supabase = getAdminClient()

  let query = supabase
    .from('appointments')
    .select(`
      *,
      services (
        name,
        duration_min,
        price_min
      )
    `)
    .order('start_at', { ascending: true })

  // Filtra por data se informada
  if (date) {
    const dayStart = `${date}T00:00:00+00:00`
    const dayEnd   = `${date}T23:59:59+00:00`
    query = query
      .gte('start_at', dayStart)
      .lte('start_at', dayEnd)
  }

  // Filtra por status se informado
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    )
  }

  return NextResponse.json({ appointments: data })
}