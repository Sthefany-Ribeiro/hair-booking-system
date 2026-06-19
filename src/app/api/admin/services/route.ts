import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Lista todos os serviços (ativos e inativos)
export async function GET() {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order')

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar servicos' },
      { status: 500 }
    )
  }

  return NextResponse.json({ services: data })
}

// Cria um novo serviço
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, duration_min, price_min, price_max } = body

  if (!name || !duration_min || !price_min) {
    return NextResponse.json(
      { error: 'Nome, duracao e preco minimo sao obrigatorios' },
      { status: 400 }
    )
  }

  // Gera o slug a partir do nome
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('services')
    .insert({
      name,
      slug,
      description:  description ?? null,
      duration_min: Number(duration_min),
      price_min:    Number(price_min),
      price_max:    price_max ? Number(price_max) : null,
      is_active:    true,
      sort_order:   0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao criar servico' },
      { status: 500 }
    )
  }

  return NextResponse.json({ service: data }, { status: 201 })
}