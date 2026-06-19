import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      services (
        name,
        duration_min,
        price_min,
        price_max
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Agendamento nao encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json({ appointment: data })
}