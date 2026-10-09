import React from 'react';
import {
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  Trash2,
} from 'lucide-react';
import { NetworkAlert } from '../types/network';

interface AlertsLogProps {
  alerts: NetworkAlert[];
  onClearAlerts: () => void;
}

export const AlertsLog: React.FC<AlertsLogProps> = ({ alerts, onClearAlerts }) => {
  const getSeverityIcon = (sev: NetworkAlert['severity']) => {
    switch (sev) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const getSeverityBadge = (sev: NetworkAlert['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'warning':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'info':
      default:
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Registro de Eventos y Alertas de Red (Syslog / IDS)
          </h3>
          <p className="text-xs text-slate-400">
            Detección de anomalías, fluctuaciones de latencia y aperturas de sockets
          </p>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={onClearAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs border border-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Registro</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
            <CheckCircle className="w-6 h-6 text-emerald-500/50" />
            <span>No hay alertas activas. Todos los parámetros de red están dentro de los umbrales normales.</span>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(a.severity)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{a.title}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase border ${getSeverityBadge(
                        a.severity
                      )}`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {a.message}
                  </p>
                </div>
              </div>

              <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap">
                {a.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
