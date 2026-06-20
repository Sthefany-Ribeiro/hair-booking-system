'use client'

import { useState } from 'react'
import StepService from './StepService'
import StepDate from './StepDate'
import StepTime from './StepTime'
import StepClient from './StepClient'
import StepConfirm from './StepConfirm'
import type { BookingStep } from '@/types/booking'
import type { Service } from '@/types/database'
import Link from 'next/link'

const STEPS = [
  { num: 1, label: 'Servico' },
  { num: 2, label: 'Data' },
  { num: 3, label: 'Horario' },
  { num: 4, label: 'Dados' },
  { num: 5, label: 'Confirmar' },
]

const EMPTY: BookingStep = { service: null, date: null, timeSlot: null, client: null }

export default function BookingWizard() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingStep>(EMPTY)

  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => s - 1)

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --moss: #2F4F3E;
          --moss-light: #3d6350;
          --gold: #C4A66B;
          --gold-light: #d4bc88;
          --gold-dark: #a88d55;
          --beige: #F8F4EE;
          --offwhite: #FCFBF8;
          --text-dark: #1a1a1a;
          --text-mid: #4a4a4a;
          --text-light: #7a7a7a;
          --border: #e8e4dd;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
          --shadow-md: 0 8px 30px rgba(0,0,0,0.06);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.08);
          --radius: 16px;
          --radius-sm: 10px;
          --radius-lg: 24px;
          --transition: cubic-bezier(0.22, 1, 0.36, 1);
        }
        body { font-family: 'Outfit', sans-serif; background: var(--offwhite); color: var(--text-dark); min-height: 100vh; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4 { font-family: 'Cormorant Garamond', serif; font-weight: 400; }

        .booking-header { background: var(--moss); padding: 20px 0; position: sticky; top: 0; z-index: 100; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
        .header-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; color: #fff; letter-spacing: 0.02em; text-decoration: none; }
        .header-logo span { color: var(--gold); }
        .header-back { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.7); font-size: 0.85rem; text-decoration: none; transition: color 0.3s; }
        .header-back:hover { color: #fff; }

        .booking-container { max-width: 900px; margin: 0 auto; padding: 48px 24px 80px; }

        .progress-bar { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 48px; padding: 0 20px; }
        .progress-step { display: flex; align-items: center; gap: 0; }
        .progress-dot { width: 36px; height: 36px; border-radius: 50%; background: var(--beige); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 600; color: var(--text-light); transition: all 0.4s var(--transition); position: relative; flex-shrink: 0; }
        .progress-dot.active { background: var(--gold); border-color: var(--gold); color: #fff; box-shadow: 0 4px 16px rgba(196,166,107,0.3); }
        .progress-dot.completed { background: var(--moss); border-color: var(--moss); color: #fff; }
        .progress-line { width: 48px; height: 2px; background: var(--border); transition: background 0.4s; }
        .progress-line.completed { background: var(--moss); }
        .progress-label { position: absolute; top: 42px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-light); white-space: nowrap; opacity: 0; transition: opacity 0.3s; }
        .progress-dot.active .progress-label, .progress-dot.completed .progress-label { opacity: 1; color: var(--moss); }

        .step-header { text-align: center; margin-bottom: 40px; }
        .step-label { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; display: block; }
        .step-title { font-size: clamp(1.8rem, 4vw, 2.6rem); color: var(--moss); margin-bottom: 10px; letter-spacing: -0.02em; }
        .step-subtitle { font-size: 0.95rem; color: var(--text-light); font-weight: 300; }

        .step-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--border); }
        .btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: none; border: 2px solid var(--border); border-radius: 60px; font-size: 0.85rem; font-weight: 500; color: var(--text-mid); cursor: pointer; transition: all 0.3s; font-family: 'Outfit', sans-serif; }
        .btn-back:hover { border-color: var(--moss); color: var(--moss); }
        .btn-back.hidden { visibility: hidden; }
        .btn-next { display: inline-flex; align-items: center; gap: 10px; padding: 14px 36px; background: var(--gold); border: none; border-radius: 60px; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; color: #fff; cursor: pointer; transition: all 0.4s var(--transition); box-shadow: 0 6px 20px rgba(196,166,107,0.25); font-family: 'Outfit', sans-serif; }
        .btn-next:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(196,166,107,0.35); }
        .btn-next:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 480px) {
          .step-nav { flex-direction: column-reverse; gap: 12px; }
          .step-nav .btn-back, .step-nav .btn-next { width: 100%; justify-content: center; }
          .progress-line { width: 28px; }
          .progress-label { display: none; }
        }
      `}</style>

      {/* Header */}
      <header className="booking-header">
        <div className="header-inner">
          <Link href="/" className="header-logo">Afro <span>Raiz</span></Link>
          <Link href="/" className="header-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar ao site
          </Link>
        </div>
      </header>

      <div className="booking-container">
        {/* Progress Bar */}
        <div className="progress-bar">
          {STEPS.map((s, i) => (
            <div key={s.num} className="progress-step">
              <div className={`progress-dot ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`}>
                {i < step ? (
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 4l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : s.num}
                <span className="progress-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`progress-line ${i < step ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 0 && (
          <StepService
            onSelect={(service) => { setBooking(b => ({ ...b, service, date: null, timeSlot: null })); goNext() }}
          />
        )}
        {step === 1 && booking.service && (
          <StepDate
            service={booking.service}
            onSelect={(date) => { setBooking(b => ({ ...b, date, timeSlot: null })); goNext() }}
            onBack={goBack}
          />
        )}
        {step === 2 && booking.service && booking.date && (
          <StepTime
            service={booking.service}
            date={booking.date}
            onSelect={(slot) => { setBooking(b => ({ ...b, timeSlot: slot })); goNext() }}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <StepClient
            onSubmit={(client) => { setBooking(b => ({ ...b, client })); goNext() }}
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
    </>
  )
}
