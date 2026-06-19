'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import type { Service } from '@/types/database'

interface ServiceForm {
  name:         string
  description:  string
  duration_min: string
  price_min:    string
  price_max:    string
  is_active:    boolean
}

const EMPTY_FORM: ServiceForm = {
  name:         '',
  description:  '',
  duration_min: '',
  price_min:    '',
  price_max:    '',
  is_active:    true,
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${m}min`
}

export default function ServicosPage() {
  const [services, setServices]     = useState<Service[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [form, setForm]             = useState<ServiceForm>(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  // Carrega serviços
  function loadServices() {
    setLoading(true)
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(data => setServices(data.services ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadServices() }, [])

  // Abre formulário para novo serviço
  function handleNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  // Abre formulário para editar serviço existente
  function handleEdit(service: Service) {
    setForm({
      name:         service.name,
      description:  service.description ?? '',
      duration_min: String(service.duration_min),
      price_min:    String(service.price_min),
      price_max:    service.price_max ? String(service.price_max) : '',
      is_active:    service.is_active,
    })
    setEditingId(service.id)
    setError(null)
    setShowForm(true)
  }

  // Salva novo serviço ou atualiza existente
  async function handleSave() {
    if (!form.name || !form.duration_min || !form.price_min) {
      setError('Nome, duracao e preco minimo sao obrigatorios')
      return
    }

    setSaving(true)
    setError(null)

    const url    = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services'
    const method = editingId ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setSaving(false)
      return
    }

    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    loadServices()
    setSaving(false)
  }

  // Ativa ou desativa serviço
  async function handleToggle(service: Service) {
    await fetch(`/api/admin/services/${service.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...service, is_active: !service.is_active }),
    })
    loadServices()
  }

  const inputClass = `
    w-full bg-transparent border border-[#EBE0CE]/10
    px-4 py-3 text-sm text-[#EBE0CE]
    placeholder:text-[#8A7560]/60
    outline-none focus:border-[#C49040]/60
    transition-colors
  `

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-1">
            Painel
          </p>
          <h1 className="font-serif text-3xl font-bold text-white">
            Servicos
          </h1>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>
            + Novo servico
          </Button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="border border-[#C49040]/20 p-6 mb-8">
          <h2 className="font-serif text-xl text-white mb-6">
            {editingId ? 'Editar servico' : 'Novo servico'}
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-4">

            {/* Nome */}
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                Nome *
              </label>
              <input
                type="text"
                placeholder="Ex: Box Braids"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Descricao */}
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                Descricao
              </label>
              <textarea
                placeholder="Breve descricao do servico..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">

              {/* Duracao */}
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                  Duracao (min) *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 300"
                  value={form.duration_min}
                  onChange={e => setForm(f => ({ ...f, duration_min: e.target.value }))}
                  className={inputClass}
                />
                {form.duration_min && (
                  <p className="text-[#C49040] text-xs mt-1 font-mono">
                    = {formatDuration(Number(form.duration_min))}
                  </p>
                )}
              </div>

              {/* Preco minimo */}
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                  Preco minimo (R$) *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 350"
                  value={form.price_min}
                  onChange={e => setForm(f => ({ ...f, price_min: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Preco maximo */}
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                  Preco maximo (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 500"
                  value={form.price_max}
                  onChange={e => setForm(f => ({ ...f, price_max: e.target.value }))}
                  className={inputClass}
                />
              </div>

            </div>

            {/* Ativo */}
            {editingId && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-[#C49040]"
                />
                <label htmlFor="is_active" className="text-sm text-[#EBE0CE]">
                  Servico ativo (visivel para clientes)
                </label>
              </div>
            )}

          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Acoes */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setError(null)
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editingId ? 'Salvar alteracoes' : 'Criar servico'}
            </Button>
          </div>
        </div>
      )}

      {/* Lista de serviços */}
      {loading && <Loading text="Carregando servicos" />}

      {!loading && services.length === 0 && (
        <div className="border border-[#EBE0CE]/08 p-12 text-center">
          <p className="font-serif text-xl text-[#EBE0CE] mb-2">
            Nenhum servico cadastrado
          </p>
          <p className="text-[#8A7560] text-sm">
            Clique em "Novo servico" para comecar.
          </p>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="space-y-2">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`
                border p-5 flex items-center gap-6
                transition-colors
                ${service.is_active
                  ? 'border-[#EBE0CE]/08'
                  : 'border-[#EBE0CE]/04 opacity-50'
                }
              `}
            >
              {/* Numero */}
              <span className="font-mono text-xs text-[#8A7560] w-6 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-[#EBE0CE] font-medium">{service.name}</p>
                  {!service.is_active && (
                    <span className="font-mono text-[10px] text-[#8A7560] border border-[#EBE0CE]/10 px-2 py-0.5">
                      inativo
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-[#8A7560] text-xs mt-0.5 truncate">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Duracao */}
              <p className="font-mono text-xs text-[#8A7560] shrink-0">
                {formatDuration(service.duration_min)}
              </p>

              {/* Preco */}
              <p className="text-[#EBE0CE] text-sm shrink-0">
                R$ {service.price_min.toFixed(0)}
                {service.price_max ? ` – ${service.price_max.toFixed(0)}` : ''}
              </p>

              {/* Acoes */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-[#8A7560] text-xs hover:text-[#C49040] transition-colors px-3 py-1.5 border border-[#EBE0CE]/10 hover:border-[#C49040]/30"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggle(service)}
                  className={`
                    text-xs px-3 py-1.5 border transition-colors
                    ${service.is_active
                      ? 'text-[#8A7560] border-[#EBE0CE]/10 hover:text-red-400 hover:border-red-500/30'
                      : 'text-green-400 border-green-500/30 hover:border-green-400'
                    }
                  `}
                >
                  {service.is_active ? 'Desativar' : 'Ativar'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}