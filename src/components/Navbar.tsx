import React from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  Globe,
  Radio,
  FileDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TrafficProfile } from '../services/mockTrafficGenerator';

interface NavbarProps {
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  profile: TrafficProfile;
  onProfileChange: (profile: TrafficProfile) => void;
  onOpenExport: () => void;
  onlineStatus: boolean;
  activeSockets: number;
  currentPing: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMonitoring,
  onToggleMonitoring,
  profile,
  onProfileChange,
  onOpenExport,
  onlineStatus,
  activeSockets,
  currentPing,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Analizador de Red
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Pro NOC
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Monitoreo en tiempo real • Entrada / Salida • Subida y Bajada
              </p>
            </div>
          </div>

          {/* Center telemetry status badges */}
          <div className="hidden lg:flex items-center space-x-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              {onlineStatus ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> En Línea
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-400 font-medium flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" /> Desconectado
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping:</span>
              <span className={`font-mono font-semibold ${currentPing < 30 ? 'text-emerald-400' : currentPing < 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                {currentPing} ms
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sockets:</span>
              <span className="font-mono font-semibold text-indigo-300">
                {activeSockets}
              </span>
            </div>
          </div>

          {/* Right Actions: Profiles, Live Toggle & Export */}
          <div className="flex items-center space-x-3">
            {/* Simulation Profile dropdown */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              <label htmlFor="traffic-profile-select" className="text-slate-400 text-[11px] sr-only">
                Perfil:
              </label>
              <select
                id="traffic-profile-select"
                value={profile}
                onChange={(e) => onProfileChange(e.target.value as TrafficProfile)}
                className="bg-transparent border-0 text-slate-200 text-xs py-0.5 px-2 focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="normal" className="bg-slate-900 text-slate-200">
                  Perfil: Tráfico Normal
                </option>
                <option value="streaming4k" className="bg-slate-900 text-slate-200">
                  Perfil: Streaming 4K Ultra HD
                </option>
                <option value="gaming" className="bg-slate-900 text-slate-200">
                  Perfil: Gaming (Baja Latencia)
                </option>
                <option value="download" className="bg-slate-900 text-slate-200">
                  Perfil: Descarga Masiva (Heavy Load)
                </option>
                <option value="congestion" className="bg-slate-900 text-slate-200">
                  Perfil: Red Congestionada (Stress Test)
                </option>
              </select>
            </div>

            {/* Toggle Pause / Live */}
            <button
              onClick={onToggleMonitoring}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isMonitoring
                  ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 border-amber-600/50 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isMonitoring ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span>{isMonitoring ? 'Monitoreo EN VIVO' : 'Monitoreo PAUSADO'}</span>
            </button>

            {/* Export Audit Report */}
            <button
              onClick={onOpenExport}
              title="Exportar Reporte de Red"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
