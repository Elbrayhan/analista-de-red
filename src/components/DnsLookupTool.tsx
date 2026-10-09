import React, { useState } from 'react';
import { Search, Globe, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { lookupDns } from '../services/dnsService';
import { DnsLookupResult } from '../types/network';

export const DnsLookupTool: React.FC = () => {
  const [domain, setDomain] = useState('google.com');
  const [recordType, setRecordType] = useState('A');
  const [provider, setProvider] = useState<'google' | 'cloudflare'>('cloudflare');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsLookupResult | null>(null);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    try {
      const res = await lookupDns(domain, recordType, provider);
      setResult(res);
    } catch {
      // Handled in service fallback
    } finally {
      setLoading(false);
    }
  };

  const quickDomains = ['google.com', 'cloudflare.com', 'github.com', 'microsoft.com', 'wikipedia.org'];

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Herramienta de Consulta DNS Segura (DNS-over-HTTPS / DoH)
        </h3>
        <p className="text-xs text-slate-400">
          Inspeccione registros DNS autoritativos (A, AAAA, MX, TXT, CNAME) con resolución cifrada
        </p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleLookup} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Ingrese dominio (ej: google.com)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="A">Tipo A (IPv4)</option>
            <option value="AAAA">Tipo AAAA (IPv6)</option>
            <option value="MX">Tipo MX (Correo)</option>
            <option value="TXT">Tipo TXT (SPF/DKIM)</option>
            <option value="CNAME">Tipo CNAME (Alias)</option>
            <option value="NS">Tipo NS (Servidores de Nombres)</option>
            <option value="ALL">Todos los Registros</option>
          </select>

          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'google' | 'cloudflare')}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="cloudflare">Cloudflare DNS (1.1.1.1)</option>
            <option value="google">Google Public DNS (8.8.8.8)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-900/30 disabled:opacity-50"
          >
            {loading ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Consultar DNS</span>
          </button>
        </div>

        {/* Quick Domain Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 text-[11px]">Sugeridos:</span>
          {quickDomains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDomain(d);
              }}
              className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition"
            >
              {d}
            </button>
          ))}
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Proveedor: <strong className="text-white">{result.provider}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tiempo de Respuesta: <strong className="text-cyan-300">{result.queryTimeMs} ms</strong></span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              {result.status}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Nombre de Dominio</th>
                  <th className="py-2.5 px-3">Valor / Destino</th>
                  <th className="py-2.5 px-3 text-right">TTL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {result.records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No se encontraron registros {recordType} para este dominio.
                    </td>
                  </tr>
                ) : (
                  result.records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{r.name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white break-all">
                        {r.data}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-right">
                        {r.TTL}s
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
