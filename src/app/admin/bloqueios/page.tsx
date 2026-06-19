'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

interface BlockedPeriod {
  id:       string
  title:    string
  start_at: string
  end_at:   string
  type:     string
}

const TYPE_LABELS: Record<string, string> = {
  vacation: 'Ferias',
  day_off:  'Folga',
  other:    'Outro',
}

const TYPE_COLORS: Record<string, string> = {
  vacation: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  day_off:  'text-blue-400 border-blue-500/30 bg-blue-500/10',
  other:    'text-[#8A7560] border-[#EBE0CE]/10 bg-transparent',
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day:     '2-digit',
    month:   '2-digit',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function toLocalDatetimeValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function BloqueiosPage() {
  const [blocks, setBlocks]     = useState<BlockedPeriod[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const [form, setForm] = useState({
    title:    '',
    start_at: '',
    end_at:   '',
    type:     'day_off',
  })

  function loadBlocks() {
    setLoading(true)
    fetch('/api/admin/blocked-periods')
      .then(r => r.json())
      .then(data => setBlocks(data.blocks ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBlocks() }, [])

  async function handleSave() {
    if (!form.title || !form.start_at || !form.end_at) {
      setError('Todos os campos sao obrigatorios')
      return
    }

    setSaving(true)
    setError(null)

    const res = await fetch('/api/admin/blocked-periods', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        start_at: new Date(form.start_at).toISOString(),
        end_at:   new Date(form.end_at).toISOString(),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setSaving(false)
      return
    }

    setShowForm(false)
    setForm({ title: '', start_at: '', end_at: '', type: 'day_off' })
    loadBlocks()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este bloqueio?')) return

    await fetch(`/api/admin/blocked-periods?id=${id}`, {
      method: 'DELETE',
    })

    loadBlocks()
  }

  const inputClass = `
    w-full bg-transparent border border-[#EBE0CE]/10
    px-4 py-3 text-sm text-[#EBE0CE]
    placeholder:text-[#8A7560]/60
    outline-none focus:border-[#C49040]/60
    transition-colors [color-scheme:dark]
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
            Bloqueios
          </h1>
          <p className="text-[#8A7560] text-sm mt-1">
            Folgas, ferias e periodos sem atendimento.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Novo bloqueio
          </Button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="border border-[#C49040]/20 p-6 mb-8">
          <h2 className="font-serif text-xl text-white mb-6">
            Novo periodo bloqueado
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-4">

            {/* Titulo */}
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                Titulo *
              </label>
              <input
                type="text"
                placeholder="Ex: Ferias de julho, Feriado nacional..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                Tipo
              </label>
              <div className="flex gap-2">
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setForm(f => ({ ...f, type: value }))}
                    className={`
                      px-4 py-2 text-xs font-mono border transition-colors
                      ${form.type === value
                        ? TYPE_COLORS[value]
                        : 'border-[#EBE0CE]/10 text-[#8A7560] hover:border-[#EBE0CE]/30'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* Inicio */}
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                  Inicio *
                </label>
                <input
                  type="datetime-local"
                  value={form.start_at}
                  onChange={e => setForm(f => ({ ...f, start_at: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Fim */}
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
                  Fim *
                </label>
                <input
                  type="datetime-local"
                  value={form.end_at}
                  onChange={e => setForm(f => ({ ...f, end_at: e.target.value }))}
                  className={inputClass}
                />
              </div>

            </div>

          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                setError(null)
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Salvar bloqueio
            </Button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading && <Loading text="Carregando bloqueios" />}

      {!loading && blocks.length === 0 && (
        <div className="border border-[#EBE0CE]/08 p-12 text-center">
          <p className="font-serif text-xl text-[#EBE0CE] mb-2">
            Nenhum bloqueio ativo
          </p>
          <p className="text-[#8A7560] text-sm">
            Adicione folgas e ferias para bloquear horarios automaticamente.
          </p>
        </div>
      )}

      {!loading && blocks.length > 0 && (
        <div className="space-y-2">
          {blocks.map(block => (
            <div
              key={block.id}
              className="border border-[#EBE0CE]/08 p-5 flex items-center gap-6"
            >
              {/* Tipo */}
              <span className={`
                font-mono text-[10px] px-2.5 py-1 border shrink-0
                ${TYPE_COLORS[block.type] ?? TYPE_COLORS.other}
              `}>
                {TYPE_LABELS[block.type] ?? 'Outro'}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#EBE0CE] font-medium">{block.title}</p>
                <p className="text-[#8A7560] text-xs mt-0.5">
                  {formatDateTime(block.start_at)} ate {formatDateTime(block.end_at)}
                </p>
              </div>

              {/* Remover */}
              <button
                onClick={() => handleDelete(block.id)}
                className="text-[#8A7560] text-xs hover:text-red-400 transition-colors px-3 py-1.5 border border-[#EBE0CE]/10 hover:border-red-500/30 shrink-0"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}