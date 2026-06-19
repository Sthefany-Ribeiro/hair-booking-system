'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleGoogleLogin() {
    setLoading(true)
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#0B0806] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-bold text-white">
            Afro Raíz
          </h1>
          <p className="font-mono text-[10px] tracking-[.22em] uppercase text-[#C49040] mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Card */}
        <div className="border border-[#EBE0CE]/08 p-8">

          <h2 className="font-serif text-xl text-white mb-2">
            Bem-vinda de volta
          </h2>
          <p className="text-[#8A7560] text-sm mb-8">
            Acesse com a sua conta Google para gerenciar os agendamentos.
          </p>

          {/* Erro de acesso não autorizado */}
          {error === 'unauthorized' && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">
                Essa conta Google nao tem permissao de acesso ao painel.
              </p>
            </div>
          )}

          {/* Botão Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-3
              bg-white text-[#1a1a1a]
              font-sans font-medium text-sm
              px-6 py-3.5
              hover:bg-gray-100
              transition-colors
              disabled:opacity-50
            "
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            )}
            {loading ? 'Redirecionando...' : 'Entrar com Google'}
          </button>

        </div>

        <p className="text-center text-[#8A7560] text-xs mt-8">
          Acesso restrito a administradores autorizados.
        </p>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}