'use client'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">KLEBER ERP</h1>
          <div className="flex gap-4">
            <a href="/" className="hover:text-blue-200">Dashboard</a>
            <a href="/assets" className="hover:text-blue-200">Activos</a>
            <a href="/trips" className="hover:text-blue-200">Viajes</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
