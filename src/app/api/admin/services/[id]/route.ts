import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Atualiza um serviço
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }   = await params
  const body     = await req.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('services')
    .update({
      name:         body.name,
      description:  body.description ?? null,
      duration_min: Number(body.duration_min),
      price_min:    Number(body.price_min),
      price_max:    body.price_max ? Number(body.price_max) : null,
      is_active:    body.is_active,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar servico' },
      { status: 500 }
    )
  }

  return NextResponse.json({ service: data })
}

// Desativa um serviço (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }   = await params
  const supabase = getAdminClient()

  const { error } = await supabase
    .from('services')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao desativar servico' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}