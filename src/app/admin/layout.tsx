import Sidebar from '@/components/admin/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verifica sessão no servidor — camada extra de segurança além do middleware
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B0806]">

      {/* Sidebar fixa na esquerda */}
      <Sidebar />

      {/* Conteúdo principal — margem esquerda igual à largura da sidebar */}
      <main className="ml-56 min-h-screen">

        {/* Header com info do usuário */}
        <header className="
          h-14 px-8
          border-b border-[#EBE0CE]/06
          flex items-center justify-between
        ">
          <div />
          <div className="flex items-center gap-3">
            <p className="text-[#8A7560] text-xs">{user.email}</p>
            <div className="
              w-7 h-7 rounded-full
              bg-[#C49040]/20
              flex items-center justify-center
              text-[#C49040] text-xs font-bold
            ">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Conteúdo da página atual */}
        <div className="p-8">
          {children}
        </div>

      </main>
    </div>
  )
}