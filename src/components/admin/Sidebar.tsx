'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Define os itens do menu
const NAV_ITEMS = [
  { href: '/admin',              label: 'Dashboard',      icon: '◈' },
  { href: '/admin/agendamentos', label: 'Agendamentos',   icon: '◷' },
  { href: '/admin/servicos',     label: 'Servicos',       icon: '✦' },
  { href: '/admin/bloqueios',    label: 'Bloqueios',      icon: '◻' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  // Função de logout — encerra a sessão e redireciona para login
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="
      fixed top-0 left-0 h-screen w-56
      bg-[#0E0B08] border-r border-[#EBE0CE]/06
      flex flex-col
      z-50
    ">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#EBE0CE]/06">
        <p className="font-serif text-lg font-bold text-white">Afro Raiz</p>
        <p className="font-mono text-[9px] tracking-[.2em] uppercase text-[#C49040] mt-0.5">
          Admin
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4">
        {NAV_ITEMS.map(item => {
          // Verifica se o item está ativo comparando com a URL atual
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                px-3 py-2.5 mb-1
                text-sm transition-colors
                ${isActive
                  ? 'bg-[#C49040]/10 text-[#C49040] border-l-2 border-[#C49040]'
                  : 'text-[#8A7560] hover:text-[#EBE0CE] hover:bg-[#EBE0CE]/04'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#EBE0CE]/06">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-3 py-2.5
            text-sm text-[#8A7560]
            hover:text-red-400
            transition-colors
          "
        >
          <span>→</span>
          Sair
        </button>
      </div>
    </aside>
  )
}