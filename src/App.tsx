import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Gauge,
  Server,
  Calculator,
  Globe,
  Bell,
  Terminal,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { TrafficMonitor } from './components/TrafficMonitor';
import { SpeedTestPanel } from './components/SpeedTestPanel';
import { ConnectionsTable } from './components/ConnectionsTable';
import { SubnetCalculatorTool } from './components/SubnetCalculatorTool';
import { DnsLookupTool } from './components/DnsLookupTool';
import { DiagnosticsTools } from './components/DiagnosticsTools';
import { AlertsLog } from './components/AlertsLog';
import { ExportModal } from './components/ExportModal';
import {
  TrafficDataPoint,
  NetworkStats,
  NetworkConnection,
  NetworkAlert,
} from './types/network';
import {
  INITIAL_CONNECTIONS,
  INITIAL_ALERTS,
  TrafficProfile,
  getProfileMultiplier,
} from './services/mockTrafficGenerator';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'traffic' | 'speedtest' | 'connections' | 'diagnostics' | 'subnet' | 'dns' | 'alerts'
  >('traffic');

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [profile, setProfile] = useState<TrafficProfile>('normal');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // Network State
  const [connections, setConnections] = useState<NetworkConnection[]>(INITIAL_CONNECTIONS);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_ALERTS);

  // 60-second rolling traffic history
  const [history, setHistory] = useState<TrafficDataPoint[]>(() => {
    const points: TrafficDataPoint[] = [];
    const now = new Date();
    for (let i = 25; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 2000);
      const timeStr = t.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      points.push({
        time: timeStr,
        download: Math.round((18 + Math.random() * 15) * 10) / 10,
        upload: Math.round((4 + Math.random() * 5) * 10) / 10,
        packetsIn: Math.round(120 + Math.random() * 80),
        packetsOut: Math.round(45 + Math.random() * 30),
      });
    }
    return points;
  });

  const [stats, setStats] = useState<NetworkStats>({
    currentDownloadMbps: 22.4,
    currentUploadMbps: 5.8,
    peakDownloadMbps: 68.2,
    peakUploadMbps: 18.5,
    totalBytesDownloaded: 1450000000, // 1.45 GB
    totalBytesUploaded: 320000000, // 320 MB
    packetsInPerSec: 145,
    packetsOutPerSec: 52,
    currentPingMs: 14,
    jitterMs: 1.8,
    packetLossPercent: 0.0,
    activeSockets: INITIAL_CONNECTIONS.length,
  });

  // Track online status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live traffic tick loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMonitoring) return;

    timerRef.current = window.setInterval(() => {
      const { dlBase, ulBase, jitter, loss } = getProfileMultiplier(profile);

      // Random jitter
      const dlVariation = (Math.random() - 0.48) * (dlBase * 0.4);
      const ulVariation = (Math.random() - 0.48) * (ulBase * 0.4);
      const newDownload = Math.max(0.5, Math.round((dlBase + dlVariation) * 10) / 10);
      const newUpload = Math.max(0.2, Math.round((ulBase + ulVariation) * 10) / 10);

      const pktsIn = Math.round(newDownload * 12 + Math.random() * 20);
      const pktsOut = Math.round(newUpload * 10 + Math.random() * 15);
      const currentPing = Math.round(12 + Math.random() * 8 + (profile === 'congestion' ? 45 : 0));

      const nowTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Update history buffer
      setHistory((prev) => {
        const next = [
          ...prev.slice(1),
          {
            time: nowTime,
            download: newDownload,
            upload: newUpload,
            packetsIn: pktsIn,
            packetsOut: pktsOut,
          },
        ];
        return next;
      });

      // Update aggregate stats
      setStats((prev) => {
        const bytesIn = (newDownload * 1000000) / 8; // bits to bytes per sec
        const bytesOut = (newUpload * 1000000) / 8;
        return {
          currentDownloadMbps: newDownload,
          currentUploadMbps: newUpload,
          peakDownloadMbps: Math.max(prev.peakDownloadMbps, newDownload),
          peakUploadMbps: Math.max(prev.peakUploadMbps, newUpload),
          totalBytesDownloaded: prev.totalBytesDownloaded + bytesIn * 2,
          totalBytesUploaded: prev.totalBytesUploaded + bytesOut * 2,
          packetsInPerSec: pktsIn,
          packetsOutPerSec: pktsOut,
          currentPingMs: currentPing,
          jitterMs: Math.round((jitter + (Math.random() - 0.5) * 0.8) * 10) / 10,
          packetLossPercent: loss,
          activeSockets: connections.length,
        };
      });

      // Subtle fluctuation on active connections rates
      setConnections((prev) =>
        prev.map((c) => {
          if (c.state === 'LISTEN') return c;
          const deltaRate = (Math.random() - 0.5) * 10;
          return {
            ...c,
            downloadRate: Math.max(0.1, Math.round((c.downloadRate + deltaRate) * 10) / 10),
            bytesTotal: c.bytesTotal + Math.round(c.downloadRate * 1024),
          };
        })
      );
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isMonitoring, profile, connections.length]);

  const handleTerminateConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        severity: 'info',
        title: 'Socket Cerrado Manualmente',
        message: `El socket con ID ${id} fue terminado por el operador de red.`,
        category: 'connection',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        isMonitoring={isMonitoring}
        onToggleMonitoring={() => setIsMonitoring(!isMonitoring)}
        profile={profile}
        onProfileChange={(newProf) => setProfile(newProf)}
        onOpenExport={() => setIsExportOpen(true)}
        onlineStatus={onlineStatus}
        activeSockets={connections.length}
        currentPing={stats.currentPingMs}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('traffic')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'traffic'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Monitor de Tráfico (Entrada / Salida)</span>
          </button>

          <button
            onClick={() => setActiveTab('speedtest')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'speedtest'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Test de Velocidad (Speedtest)</span>
          </button>

          <button
            onClick={() => setActiveTab('connections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'connections'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Sockets & Conexiones ({connections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'diagnostics'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Diagnósticos de Red (Ping & Puertos)</span>
          </button>

          <button
            onClick={() => setActiveTab('subnet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'subnet'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculadora de Subredes IPv4</span>
          </button>

          <button
            onClick={() => setActiveTab('dns')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'dns'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Consulta DNS (DoH)</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'alerts'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alertas ({alerts.length})</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'traffic' && (
          <TrafficMonitor history={history} stats={stats} />
        )}

        {activeTab === 'speedtest' && (
          <SpeedTestPanel
            onSpeedTestComplete={(res) => {
              setAlerts((prev) => [
                {
                  id: `alert-${Date.now()}`,
                  timestamp: res.timestamp,
                  severity: 'info',
                  title: 'Test de Velocidad Concluido',
                  message: `Velocidad registrada: ${res.downloadSpeed} Mbps Bajada / ${res.uploadSpeed} Mbps Subida (Ping: ${res.ping}ms).`,
                  category: 'bandwidth',
                },
                ...prev,
              ]);
            }}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsTable
            connections={connections}
            onTerminateConnection={handleTerminateConnection}
          />
        )}

        {activeTab === 'diagnostics' && <DiagnosticsTools />}

        {activeTab === 'subnet' && <SubnetCalculatorTool />}

        {activeTab === 'dns' && <DnsLookupTool />}

        {activeTab === 'alerts' && (
          <AlertsLog alerts={alerts} onClearAlerts={() => setAlerts([])} />
        )}

        {/* Quick Footer Summary Bar */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Cpu className="w-4 h-4 text-cyan-400" /> Motor de Análisis de Red
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ArrowDownCircle className="w-3.5 h-3.5" /> Bajada: {stats.currentDownloadMbps} Mbps
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-400">
              <ArrowUpCircle className="w-3.5 h-3.5" /> Subida: {stats.currentUploadMbps} Mbps
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Protocolos: IPv4 / IPv6 / TCP / UDP / QUIC
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400">
              {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </main>

      {/* Export Audit Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        stats={stats}
        connections={connections}
        alerts={alerts}
      />
    </div>
  );
}
export default App;
