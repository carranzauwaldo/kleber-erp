export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-4xl font-bold mb-2">KLEBER ERP</h1>
        <p className="text-xl text-gray-600">ERP modular para gestión de transportes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-2">📦 Activos</h3>
          <p className="text-gray-600">Gestiona tu flota de vehículos y maquinaria</p>
          <a href="/assets" className="text-blue-600 hover:underline mt-4 block">Ver activos →</a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-2">🚗 Viajes</h3>
          <p className="text-gray-600">Registra y controla tus viajes operativos</p>
          <a href="/trips" className="text-blue-600 hover:underline mt-4 block">Ver viajes →</a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-2">📊 Reportes</h3>
          <p className="text-gray-600">Análisis financiero y operativo</p>
          <a href="/reports" className="text-blue-600 hover:underline mt-4 block">Ver reportes →</a>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm text-gray-600">
          <strong>Status:</strong> Fase 0.5 - Setup inicial completado
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Próximo:</strong> Fase 1 - Autenticación y permisos
        </p>
      </div>
    </div>
  )
}
