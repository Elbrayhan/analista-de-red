import React, { useState } from 'react';
import {
  Gauge,
  Play,
  RotateCcw,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Activity,
  Award,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { SpeedTestPhase, SpeedTestResult } from '../types/network';
import { runSpeedTest } from '../services/networkSpeedTest';

interface SpeedTestPanelProps {
  onSpeedTestComplete?: (result: SpeedTestResult) => void;
}

export const SpeedTestPanel: React.FC<SpeedTestPanelProps> = ({ onSpeedTestComplete }) => {
  const [phase, setPhase] = useState<SpeedTestPhase>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [liveSpeed, setLiveSpeed] = useState<number>(0);
  const [currentPing, setCurrentPing] = useState<number | null>(null);
  const [currentJitter, setCurrentJitter] = useState<number | null>(null);
  const [finalDownload, setFinalDownload] = useState<number | null>(null);
  const [finalUpload, setFinalUpload] = useState<number | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);

  const startTest = async () => {
    if (phase !== 'idle' && phase !== 'completed' && phase !== 'error') return;

    setPhase('ping');
    setProgress(0);
    setLiveSpeed(0);
    setCurrentPing(null);
    setCurrentJitter(null);
    setFinalDownload(null);
    setFinalUpload(null);

    try {
      const result = await runSpeedTest({
        onPhaseChange: (newPhase) => setPhase(newPhase),
        onProgress: (prog, speed) => {
          setProgress(prog);
          setLiveSpeed(speed);
        },
        onPingComplete: (p, j) => {
          setCurrentPing(p);
          setCurrentJitter(j);
        },
        onDownloadComplete: (dl) => {
          setFinalDownload(dl);
        },
        onUploadComplete: (ul) => {
          setFinalUpload(ul);
        },
      });

      setHistory((prev) => [result, ...prev.slice(0, 4)]);
      if (onSpeedTestComplete) onSpeedTestComplete(result);
    } catch {
      setPhase('error');
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'ping':
        return 'Calculando latencia de ida y vuelta (Ping) y jitter...';
      case 'download':
        return 'Midiendo velocidad de bajada (Inbound throughput)...';
      case 'upload':
        return 'Midiendo velocidad de subida (Outbound throughput)...';
      case 'completed':
        return '¡Test de velocidad completado con éxito!';
      case 'error':
        return 'Error al ejecutar el test. Verifique su conectividad.';
      case 'idle':
      default:
        return 'Listo para realizar prueba de ancho de banda y latencia.';
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            Test de Velocidad de Red (Speed Test Integral)
          </h3>
          <p className="text-xs text-slate-400">
            Prueba de latencia (Ping), jitter, velocidad real de bajada y subida
          </p>
        </div>

        <button
          onClick={startTest}
          disabled={phase === 'ping' || phase === 'download' || phase === 'upload'}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg ${
            phase === 'ping' || phase === 'download' || phase === 'upload'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-900/30 active:scale-95'
          }`}
        >
          {phase === 'ping' || phase === 'download' || phase === 'upload' ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Ejecutando Test...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Iniciar Test de Velocidad</span>
            </>
          )}
        </button>
      </div>

      {/* Speedometer Radial Gauge & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Speedometer Dial (Left) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/70 rounded-xl border border-slate-800 relative">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#1e293b"
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset="66"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={
                  phase === 'upload'
                    ? '#6366f1'
                    : phase === 'download'
                    ? '#10b981'
                    : '#06b6d4'
                }
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (Math.min(progress, 100) / 100) * 198}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                {phase === 'upload' ? 'Subida' : phase === 'download' ? 'Bajada' : 'Velocidad'}
              </span>
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight my-0.5">
                {liveSpeed > 0
                  ? liveSpeed.toFixed(1)
                  : finalDownload !== null
                  ? finalDownload.toFixed(1)
                  : '0.0'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Mbps</span>
              {phase !== 'idle' && (
                <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                  {progress}%
                </span>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 text-center font-medium">
            {getPhaseDescription()}
          </p>
        </div>

        {/* Real-Time Metrics & Badges (Right) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-4">
          {/* Bajada */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ArrowDownCircle className="w-4 h-4" /> Bajada (Download)
              </span>
              {finalDownload !== null && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {finalDownload !== null ? finalDownload.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-slate-400 ml-1">Mbps</span>
            </div>
          </div>

          {/* Subida */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <ArrowUpCircle className="w-4 h-4" /> Subida (Upload)
              </span>
              {finalUpload !== null && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {finalUpload !== null ? finalUpload.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-slate-400 ml-1">Mbps</span>
            </div>
          </div>

          {/* Latencia (Ping) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Clock className="w-4 h-4" /> Latencia (Ping)
              </span>
              {currentPing !== null && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {currentPing !== null ? currentPing : '--'}
              </span>
              <span className="text-xs text-slate-400 ml-1">ms</span>
            </div>
          </div>

          {/* Jitter */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <Activity className="w-4 h-4" /> Jitter (Variación)
              </span>
              {currentJitter !== null && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {currentJitter !== null ? `±${currentJitter}` : '--'}
              </span>
              <span className="text-xs text-slate-400 ml-1">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* History of runs */}
      {history.length > 0 && (
        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Historial de Pruebas de Velocidad
          </h4>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
                    {item.grade}
                  </span>
                  <span className="text-slate-400 font-mono">{item.timestamp}</span>
                  <span className="hidden sm:inline text-slate-500">•</span>
                  <span className="hidden sm:inline text-slate-400 flex items-center gap-1">
                    <Server className="w-3 h-3 text-slate-500" /> {item.server}
                  </span>
                </div>
                <div className="flex items-center space-x-4 font-mono font-medium">
                  <span className="text-emerald-400">↓ {item.downloadSpeed.toFixed(1)} Mb/s</span>
                  <span className="text-indigo-400">↑ {item.uploadSpeed.toFixed(1)} Mb/s</span>
                  <span className="text-amber-400">{item.ping} ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
