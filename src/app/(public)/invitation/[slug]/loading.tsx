export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-[#1B2A4A]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#E2D9CE] border-t-[#B39365] rounded-full animate-spin" />
        <p className="text-sm font-serif tracking-widest text-[#8A7968] uppercase animate-pulse">
          Memuat Undangan...
        </p>
      </div>
    </div>
  )
}
