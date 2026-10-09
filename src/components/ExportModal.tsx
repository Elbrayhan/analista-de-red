import React from 'react';
import {
  FileText,
  Download,
  X,
  Share2,
} from 'lucide-react';
import { NetworkStats, NetworkConnection, NetworkAlert } from '../types/network';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: NetworkStats;
  connections: NetworkConnection[];
  alerts: NetworkAlert[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  connections,
  alerts,
}) => {
  if (!isOpen) return null;

  const generateReportJSON = () => {
    return JSON.stringify(
      {
        reportTitle: 'Auditoría de Red - Analizador de Red Pro',
        generatedAt: new Date().toISOString(),
        summary: stats,
        activeConnections: connections,
        incidentLogs: alerts,
      },
      null,
      2
    );
  };

  const downloadJSON = () => {
    const data = generateReportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-red-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    let csv = 'ID,Protocolo,Proceso,LocalAddress,LocalPort,RemoteHost,RemoteAddress,RemotePort,Estado,DownloadRate_KBps,UploadRate_KBps,Latency_ms\n';
    connections.forEach((c) => {
      csv += `"${c.id}","${c.protocol}","${c.processName}","${c.localAddress}",${c.localPort},"${c.remoteHost}","${c.remoteAddress}",${c.remotePort},"${c.state}",${c.downloadRate},${c.uploadRate},${c.latencyMs}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conexiones-red-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-xl w-full space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-bold text-white">
              Exportar Reporte de Análisis de Red
            </h4>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Genere un volcado completo de la sesión de monitoreo con estadísticas de tráfico acumuladas, lista detallada de sockets y registro de alertas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={downloadJSON}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 flex items-center gap-3 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-800 text-cyan-400 group-hover:scale-105 transition">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">Formato JSON Completo</span>
              <span className="text-[11px] text-slate-400">
                Estructura jerárquica con métricas y alertas
              </span>
            </div>
          </button>

          <button
            onClick={downloadCSV}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-3 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-800 text-emerald-400 group-hover:scale-105 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">Formato CSV (Tabular)</span>
              <span className="text-[11px] text-slate-400">
                Compatible con Excel y software de análisis
              </span>
            </div>
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 max-h-36 overflow-y-auto">
          <pre>{generateReportJSON().slice(0, 420)}...</pre>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
