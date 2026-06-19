'use client'

import { useState } from 'react'
import StepService from './StepService'
import StepDate from './StepDate'
import StepTime from './StepTime'
import StepClient from './StepClient'
import StepConfirm from './StepConfirm'
import type { BookingStep } from '@/types/booking'
import type { Service } from '@/types/database'

const STEPS = ['Serviço', 'Data', 'Horário', 'Seus dados', 'Confirmar']

const EMPTY_BOOKING: BookingStep = {
  service:  null,
  date:     null,
  timeSlot: null,
  client:   null,
}

export default function BookingWizard() {
  const [step, setStep]       = useState(0)
  const [booking, setBooking] = useState<BookingStep>(EMPTY_BOOKING)

  function goNext() { setStep(s => s + 1) }
  function goBack() { setStep(s => s - 1) }

  function selectService(service: Service) {
    setBooking(b => ({ ...b, service, date: null, timeSlot: null }))
    goNext()
  }

  function selectDate(date: string) {
    setBooking(b => ({ ...b, date, timeSlot: null }))
    goNext()
  }

  function selectTime(timeSlot: BookingStep['timeSlot']) {
    setBooking(b => ({ ...b, timeSlot }))
    goNext()
  }

  function submitClient(client: BookingStep['client']) {
    setBooking(b => ({ ...b, client }))
    goNext()
  }

  return (
    <div className="min-h-screen bg-[#0B0806] text-[#EBE0CE]">

      {/* Header */}
      <div className="border-b border-[#EBE0CE]/08 px-6 py-5 flex items-center justify-between">
        <a href="/" className="flex flex-col leading-none">
          <span className="font-serif text-lg text-white tracking-wide">Afro Raíz</span>
          <span className="font-mono text-[9px] tracking-[.22em] uppercase text-[#C49040] mt-0.5">
            São Paulo · SP
          </span>
        </a>
        <a href="/" className="text-[#8A7560] text-xs hover:text-[#EBE0CE] transition-colors">
          ← Voltar ao site
        </a>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono
                  transition-all duration-300
                  ${i < step  ? 'bg-[#C49040] text-[#0B0806]' : ''}
                  ${i === step ? 'bg-[#C49040] text-[#0B0806] ring-4 ring-[#C49040]/20' : ''}
                  ${i > step  ? 'border border-[#EBE0CE]/15 text-[#8A7560]' : ''}
                `}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`
                  text-[10px] tracking-widest uppercase font-mono hidden sm:block
                  ${i === step ? 'text-[#C49040]' : 'text-[#8A7560]'}
                `}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mb-5 transition-all duration-500"
                  style={{ background: i < step ? '#C49040' : 'rgba(235,224,206,0.08)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        {step === 0 && (
          <StepService onSelect={selectService} />
        )}
        {step === 1 && booking.service && (
          <StepDate
            service={booking.service}
            onSelect={selectDate}
            onBack={goBack}
          />
        )}
        {step === 2 && booking.service && booking.date && (
          <StepTime
            service={booking.service}
            date={booking.date}
            onSelect={selectTime}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <StepClient
            onSubmit={submitClient}
            onBack={goBack}
          />
        )}
        {step === 4 && booking.service && booking.date && booking.timeSlot && booking.client && (
          <StepConfirm
            booking={booking as Required<BookingStep>}
            onBack={goBack}
          />
        )}
      </div>

    </div>
  )
}