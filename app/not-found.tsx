import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6 text-[#131b2e]">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-[#dae2fd] shadow-xl text-center space-y-5 animate-fade-in transition-all duration-300">
        <div className="w-12 h-12 bg-emerald-100 text-[#003b1b] rounded-xl mx-auto flex items-center justify-center font-bold text-2xl transition-transform duration-300 hover:scale-110">
          🔍
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">404 - Page Not Found</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The AgroFlow terminal page or resource you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2.5">
            Quick Navigation Links
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href="/"
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-800 transition-all duration-200 text-center hover:-translate-y-0.5 active:translate-y-0"
            >
              Main Hub
            </Link>
            <Link
              href="/"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[#003b1b] transition-all duration-200 text-center font-bold hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In Terminal
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block w-full py-3 bg-[#003b1b] text-[#b1f2be] font-bold text-xs rounded-xl shadow-md hover:bg-[#14532d] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          Return to Hub Terminal
        </Link>
      </div>
    </div>
  );
}
