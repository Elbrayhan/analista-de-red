import React, { useState, useMemo } from 'react';
import {
  NetworkConnection,
  NetworkProtocol,
  ConnectionState,
} from '../types/network';
import {
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle,
  Clock,
  Radio,
  Server,
  Terminal,
} from 'lucide-react';
import { formatRateKB, formatBytes } from '../utils/formatters';

interface ConnectionsTableProps {
  connections: NetworkConnection[];
  onTerminateConnection: (id: string) => void;
}

export const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections,
  onTerminateConnection,
}) => {
  const [search, setSearch] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'downloadRate' | 'uploadRate' | 'bytesTotal' | 'latencyMs'>('downloadRate');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedConn, setSelectedConn] = useState<NetworkConnection | null>(null);

  const filteredConnections = useMemo(() => {
    return connections
      .filter((c) => {
        const matchesSearch =
          c.remoteHost.toLowerCase().includes(search.toLowerCase()) ||
          c.remoteAddress.includes(search) ||
          c.processName.toLowerCase().includes(search.toLowerCase()) ||
          c.localPort.toString().includes(search) ||
          c.remotePort.toString().includes(search);

        const matchesProtocol =
          selectedProtocol === 'ALL' || c.protocol === selectedProtocol;

        const matchesState =
          selectedState === 'ALL' || c.state === selectedState;

        return matchesSearch && matchesProtocol && matchesState;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [connections, search, selectedProtocol, selectedState, sortField, sortAsc]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStateBadge = (state: ConnectionState) => {
    switch (state) {
      case 'ESTABLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle className="w-2.5 h-2.5" /> ESTABLISHED
          </span>
        );
      case 'LISTEN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Radio className="w-2.5 h-2.5" /> LISTEN
          </span>
        );
      case 'TIME_WAIT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950 text-amber-400 border border-amber-800">
            <Clock className="w-2.5 h-2.5" /> TIME_WAIT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">
            {state}
          </span>
        );
    }
  };

  const getProtocolBadge = (protocol: NetworkProtocol) => {
    const colors: Record<string, string> = {
      HTTPS: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
      QUIC: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60',
      TCP: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60',
      UDP: 'bg-blue-900/60 text-blue-300 border-blue-700/60',
      WS: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
      DNS: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
      ICMP: 'bg-rose-900/60 text-rose-300 border-rose-700/60',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          colors[protocol] || 'bg-slate-800 text-slate-300'
        }`}
      >
        {protocol}
      </span>
    );
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            Tabla de Sockets y Conexiones de Red Activas
          </h3>
          <p className="text-xs text-slate-400">
            Mostrando {filteredConnections.length} de {connections.length} conexiones abiertas (Entrada y Salida)
          </p>
        </div>

        {/* Search & Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar IP, puerto o proceso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Protocol filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="bg-transparent border-0 text-slate-300 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">Protocolo: Todos</option>
              <option value="HTTPS" className="bg-slate-900 text-slate-200">HTTPS</option>
              <option value="QUIC" className="bg-slate-900 text-slate-200">QUIC</option>
              <option value="TCP" className="bg-slate-900 text-slate-200">TCP</option>
              <option value="UDP" className="bg-slate-900 text-slate-200">UDP</option>
              <option value="WS" className="bg-slate-900 text-slate-200">WebSocket</option>
              <option value="DNS" className="bg-slate-900 text-slate-200">DNS</option>
            </select>
          </div>

          {/* State filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">Estado: Todos</option>
            <option value="ESTABLISHED" className="bg-slate-900 text-slate-200">ESTABLISHED</option>
            <option value="LISTEN" className="bg-slate-900 text-slate-200">LISTEN</option>
            <option value="TIME_WAIT" className="bg-slate-900 text-slate-200">TIME_WAIT</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Protocolo</th>
              <th className="py-3 px-3">Proceso / Servicio</th>
              <th className="py-3 px-3">Dirección Local</th>
              <th className="py-3 px-3">Host Remoto (Destino)</th>
              <th className="py-3 px-3">Estado</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('downloadRate')}
              >
                <div className="flex items-center gap-1">
                  <span>↓ Bajada</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('uploadRate')}
              >
                <div className="flex items-center gap-1">
                  <span>↑ Subida</span>
                  <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('latencyMs')}
              >
                <div className="flex items-center gap-1">
                  <span>RTT</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filteredConnections.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No se encontraron conexiones que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredConnections.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-900/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedConn(c)}
                >
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getProtocolBadge(c.protocol)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{c.processName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {c.localAddress}:{c.localPort}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-white font-medium truncate max-w-[170px]">
                        {c.remoteHost}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {c.remoteAddress}:{c.remotePort}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getStateBadge(c.state)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                    {formatRateKB(c.downloadRate)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400 whitespace-nowrap">
                    {formatRateKB(c.uploadRate)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-400 whitespace-nowrap">
                    {c.latencyMs} ms
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTerminateConnection(c.id);
                      }}
                      title="Cerrar Socket"
                      className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] transition"
                    >
                      Terminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Connection Detail Modal */}
      {selectedConn && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedConn(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Detalles del Socket: {selectedConn.remoteHost}
              </h4>
              <button
                onClick={() => setSelectedConn(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Proceso</span>
                <span className="font-semibold text-slate-200">{selectedConn.processName}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Protocolo</span>
                <span className="font-semibold text-slate-200">{selectedConn.protocol}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Socket Local</span>
                <span className="font-mono text-cyan-300">{selectedConn.localAddress}:{selectedConn.localPort}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Socket Remoto</span>
                <span className="font-mono text-cyan-300">{selectedConn.remoteAddress}:{selectedConn.remotePort}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Velocidad de Bajada</span>
                <span className="font-mono text-emerald-400 font-bold">{formatRateKB(selectedConn.downloadRate)}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Velocidad de Subida</span>
                <span className="font-mono text-indigo-400 font-bold">{formatRateKB(selectedConn.uploadRate)}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Volumen Acumulado</span>
                <span className="font-mono text-slate-200">{formatBytes(selectedConn.bytesTotal)}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">RTT / Latencia</span>
                <span className="font-mono text-amber-400 font-bold">{selectedConn.latencyMs} ms</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedConn(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
