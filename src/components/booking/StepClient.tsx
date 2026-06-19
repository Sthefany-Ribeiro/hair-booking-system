'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import type { BookingStep } from '@/types/booking'

interface Props {
  onSubmit: (client: BookingStep['client']) => void
  onBack: () => void
}

interface FormState {
  name:  string
  phone: string
  email: string
  notes: string
}

interface FormErrors {
  name?:  string
  phone?: string
  email?: string
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2)  return digits
  if (digits.length <= 6)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
}

export default function StepClient({ onSubmit, onBack }: Props) {
  const [form, setForm] = useState<FormState>({
    name:  '',
    phone: '',
    email: '',
    notes: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function handleChange(field: keyof FormState, value: string) {
    if (field === 'phone') {
      setForm(f => ({ ...f, phone: formatPhone(value) }))
    } else {
      setForm(f => ({ ...f, [field]: value }))
    }
    if (errors[field as keyof FormErrors]) {
      setErrors(e => ({ ...e, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Informe seu nome completo'
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = 'Informe um telefone válido com DDD'
    }
    if (!validateEmail(form.email)) {
      newErrors.email = 'Informe um e-mail válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit() {
    if (!validate()) return

    onSubmit({
      name:  form.name.trim(),
      phone: form.phone.replace(/\D/g, ''),
      email: form.email.trim().toLowerCase(),
      notes: form.notes.trim(),
    })
  }

  const inputClass = (hasError: boolean) => `
    w-full bg-transparent border px-4 py-3.5
    font-sans text-sm text-[#EBE0CE]
    placeholder:text-[#8A7560]/60
    outline-none transition-colors duration-200
    ${hasError
      ? 'border-red-500/50 focus:border-red-500'
      : 'border-[#EBE0CE]/10 focus:border-[#C49040]/60'
    }
  `

  return (
    <div>
      {/* Título */}
      <div className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#C49040] mb-3">
          Passo 4
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
          Seus dados<br />
          <em className="italic text-[#C49040]">para contato.</em>
        </h1>
        <p className="text-[#8A7560] text-sm mt-4">
          Usamos apenas para confirmar o seu agendamento.
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-5">

        {/* Nome */}
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            placeholder="Como prefere ser chamada?"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
            WhatsApp *
          </label>
          <input
            type="tel"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className={inputClass(!!errors.phone)}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
            E-mail *
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-[#8A7560] block mb-2">
            Observações <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            placeholder="Referências de estilo, comprimento desejado, dúvidas..."
            value={form.notes}
            onChange={e => handleChange('notes', e.target.value)}
            rows={3}
            className={`${inputClass(false)} resize-none`}
          />
        </div>

      </div>

      {/* Navegação */}
      <div className="flex gap-4 mt-8">
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button onClick={handleSubmit} fullWidth>
          Revisar agendamento →
        </Button>
      </div>
    </div>
  )
}