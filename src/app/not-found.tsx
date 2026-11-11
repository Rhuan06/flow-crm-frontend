import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center">
        <div className="relative bg-white rounded-3xl border border-white shadow-xl shadow-blue-900/5 px-8 py-12 sm:px-14 sm:py-16 overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-100/60 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-100/60 rounded-full blur-2xl" />

          <div className="relative">
            {/* Ícone */}
            <div className="flex justify-center mb-7">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 4h.01M10.3 3.86L2.55 17.28A2 2 0 004.28 20.3h15.44a2 2 0 001.73-3.02L13.7 3.86a2 2 0 00-3.46 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Código */}
            <div className="relative">
              <span className="text-8xl sm:text-9xl font-black tracking-tighter text-blue-600/10 select-none">
                404
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl font-black tracking-tight text-blue-600">
                404
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              Ops! Página não encontrada
            </h1>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mt-4">
              Parece que você chegou a um endereço que não existe. A página
              pode ter sido movida, removida ou o link pode estar incorreto.
            </p>

            {/* Botão */}
            <div className="mt-9">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-7 tracking-wide">
          <span className="font-semibold text-slate-500">FlowCRM</span>
          {' '}· Sistema de Gestão de Clientes e Vendas
        </p>
      </div>
    </main>
  );
}