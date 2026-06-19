import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('blocked_periods')
    .select('*')
    .gte('end_at', new Date().toISOString())
    .order('start_at')

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar bloqueios' },
      { status: 500 }
    )
  }

  return NextResponse.json({ blocks: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, start_at, end_at, type } = body

  if (!title || !start_at || !end_at) {
    return NextResponse.json(
      { error: 'Titulo, inicio e fim sao obrigatorios' },
      { status: 400 }
    )
  }

  if (new Date(end_at) <= new Date(start_at)) {
    return NextResponse.json(
      { error: 'A data de fim deve ser maior que a data de inicio' },
      { status: 400 }
    )
  }

  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('blocked_periods')
    .insert({
      title,
      start_at,
      end_at,
      type: type ?? 'other',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao criar bloqueio' },
      { status: 500 }
    )
  }

  return NextResponse.json({ block: data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'ID obrigatorio' },
      { status: 400 }
    )
  }

  const supabase = getAdminClient()

  const { error } = await supabase
    .from('blocked_periods')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao remover bloqueio' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}