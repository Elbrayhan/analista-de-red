import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  Layers,
  Gauge,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrafficDataPoint, NetworkStats } from '../types/network';
import { formatBytes, formatSpeed } from '../utils/formatters';

interface TrafficMonitorProps {
  history: TrafficDataPoint[];
  stats: NetworkStats;
}

export const TrafficMonitor: React.FC<TrafficMonitorProps> = ({ history, stats }) => {
  const [showDownload, setShowDownload] = useState(true);
  const [showUpload, setShowUpload] = useState(true);

  // Compute protocol distribution percentages
  const protocols = [
    { name: 'HTTPS', percent: 45, color: 'bg-emerald-400', count: '1.2 GB' },
    { name: 'QUIC / UDP', percent: 28, color: 'bg-cyan-400', count: '740 MB' },
    { name: 'TCP Raw', percent: 18, color: 'bg-indigo-400', count: '480 MB' },
    { name: 'WebSocket', percent: 7, color: 'bg-purple-400', count: '185 MB' },
    { name: 'DNS / ICMP', percent: 2, color: 'bg-amber-400', count: '52 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bajada / Download / Entrada */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900/90 border border-emerald-500/30 p-5 shadow-lg shadow-emerald-950/20">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              Bajada (Entrada)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono">
              Inbound
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white glow-emerald">
              {stats.currentDownloadMbps.toFixed(2)}
            </span>
            <span className="text-xs font-medium text-slate-400">Mbps</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Pico: </span>
              <span className="font-mono text-emerald-300 font-medium">
                {formatSpeed(stats.peakDownloadMbps)}
              </span>
            </div>
            <div>
              <span>Total: </span>
              <span className="font-mono text-slate-200 font-medium">
                {formatBytes(stats.totalBytesDownloaded)}
              </span>
            </div>
          </div>
        </div>

        {/* Subida / Upload / Salida */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900/90 border border-indigo-500/30 p-5 shadow-lg shadow-indigo-950/20">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
              Subida (Salida)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-mono">
              Outbound
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white glow-indigo">
              {stats.currentUploadMbps.toFixed(2)}
            </span>
            <span className="text-xs font-medium text-slate-400">Mbps</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Pico: </span>
              <span className="font-mono text-indigo-300 font-medium">
                {formatSpeed(stats.peakUploadMbps)}
              </span>
            </div>
            <div>
              <span>Total: </span>
              <span className="font-mono text-slate-200 font-medium">
                {formatBytes(stats.totalBytesUploaded)}
              </span>
            </div>
          </div>
        </div>

        {/* Paquetes / Sockets */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900/90 border border-cyan-500/30 p-5 shadow-lg shadow-cyan-950/20">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Flujo de Paquetes
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono">
              Pkts/seg
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white glow-cyan">
              {(stats.packetsInPerSec + stats.packetsOutPerSec).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400">pps</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Entrada: </span>
              <span className="font-mono text-emerald-300 font-medium">
                {stats.packetsInPerSec} pps
              </span>
            </div>
            <div>
              <span>Salida: </span>
              <span className="font-mono text-indigo-300 font-medium">
                {stats.packetsOutPerSec} pps
              </span>
            </div>
          </div>
        </div>

        {/* Latencia & Calidad de Enlace */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900/90 border border-slate-700 p-5 shadow-lg shadow-slate-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-400" />
              Calidad de Enlace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              RTT & Jitter
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {stats.currentPingMs}
            </span>
            <span className="text-xs font-medium text-slate-400">ms ping</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Jitter: </span>
              <span className="font-mono text-amber-300 font-medium">
                ±{stats.jitterMs.toFixed(1)} ms
              </span>
            </div>
            <div>
              <span>Pérdida: </span>
              <span className="font-mono text-slate-200 font-medium">
                {stats.packetLossPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Real-Time Graph */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Monitor Gráfico Continuo de Ancho de Banda (Mbps)
            </h3>
            <p className="text-xs text-slate-400">
              Historial de tráfico de entrada (Download) y salida (Upload) en los últimos 60 segundos
            </p>
          </div>

          {/* Visibility toggles */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowDownload(!showDownload)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                showDownload
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Bajada / Entrada
            </button>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                showUpload
                  ? 'bg-indigo-950/70 border-indigo-600 text-indigo-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              Subida / Salida
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                unit=" Mb"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                        <p className="font-mono text-slate-400 font-semibold">{label}</p>
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <span
                              className="font-medium flex items-center gap-1.5"
                              style={{ color: entry.color }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name === 'download' ? 'Bajada:' : 'Subida:'}
                            </span>
                            <span className="font-mono font-bold text-white">
                              {Number(entry.value).toFixed(2)} Mbps
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {showDownload && (
                <Area
                  type="monotone"
                  dataKey="download"
                  name="download"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#downloadGradient)"
                  isAnimationActive={false}
                />
              )}
              {showUpload && (
                <Area
                  type="monotone"
                  dataKey="upload"
                  name="upload"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#uploadGradient)"
                  isAnimationActive={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Protocol Distribution Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Distribución de Tráfico por Protocolo de Transporte
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cifrado TLS 1.3 / QUIC Activo
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            {protocols.map((p, i) => (
              <div
                key={i}
                className={`${p.color} h-full transition-all duration-300`}
                style={{ width: `${p.percent}%` }}
                title={`${p.name}: ${p.percent}% (${p.count})`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs">
            {protocols.map((p, i) => (
              <div key={i} className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                <div className="flex flex-col">
                  <span className="text-slate-200 font-medium text-[11px]">{p.name}</span>
                  <span className="text-slate-400 text-[10px] font-mono">{p.percent}% • {p.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
