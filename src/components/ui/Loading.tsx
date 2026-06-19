export default function Loading({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-8 h-8 border-2 border-[#C49040] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#8A7560] text-sm tracking-widest uppercase font-mono">
        {text}
      </p>
    </div>
  )
}