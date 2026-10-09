import React, { useState } from 'react';
import { Calculator, Network, Check, Copy } from 'lucide-react';
import { calculateSubnet } from '../services/subnetCalculator';
import { SubnetCalcResult } from '../types/network';

export const SubnetCalculatorTool: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.50');
  const [cidr, setCidr] = useState(24);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const calcResult: SubnetCalcResult | null = calculateSubnet(ip, cidr);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const presetCIDRs = [8, 16, 24, 26, 28, 29, 30];

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          Calculadora de Subredes IPv4 y Máscaras CIDR
        </h3>
        <p className="text-xs text-slate-400">
          Cálculo exacto de dirección de red, broadcast, rango utilizable de hosts, wildcard y binario
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-6 space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Dirección IPv4
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-6 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300">
              Máscara CIDR (/{cidr})
            </label>
            <span className="font-mono text-cyan-400 font-bold">
              {calcResult?.netmask}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="32"
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value, 10))}
              className="flex-1 accent-cyan-500 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-900 border border-slate-700 rounded text-cyan-300 w-12 text-center">
              /{cidr}
            </span>
          </div>
        </div>

        {/* Quick CIDR buttons */}
        <div className="md:col-span-12 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
          <span className="text-xs text-slate-500">Prefijos comunes:</span>
          {presetCIDRs.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setCidr(p)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
                cidr === p
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              /{p}
            </button>
          ))}
        </div>
      </div>

      {/* Results Cards */}
      {calcResult ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Red */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Dirección de Red</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold font-mono text-emerald-400">
                  {calcResult.networkAddress}/{calcResult.cidr}
                </span>
                <button
                  onClick={() => copyToClipboard(calcResult.networkAddress, 'network')}
                  className="text-slate-500 hover:text-white p-1"
                >
                  {copiedField === 'network' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Broadcast */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Dirección Broadcast</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold font-mono text-indigo-400">
                  {calcResult.broadcastAddress}
                </span>
                <button
                  onClick={() => copyToClipboard(calcResult.broadcastAddress, 'broadcast')}
                  className="text-slate-500 hover:text-white p-1"
                >
                  {copiedField === 'broadcast' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Usable Hosts */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Hosts Utilizables</span>
              <span className="text-base font-bold font-mono text-white">
                {calcResult.usableHosts.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Total direcciones: {calcResult.totalHosts.toLocaleString()}
              </span>
            </div>

            {/* Classification */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Clase y Ámbito</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800">
                  Clase {calcResult.ipClass}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-medium text-[11px] border border-emerald-800">
                  {calcResult.ipType}
                </span>
              </div>
            </div>
          </div>

          {/* Rango de IPs */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="text-slate-400 block font-semibold flex items-center gap-1.5">
              <Network className="w-4 h-4 text-cyan-400" />
              Rango de Direcciones IP Asignables
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm">
              <div className="text-slate-300">
                <span className="text-slate-500 text-xs">Primera IP Útil: </span>
                <span className="text-emerald-400 font-bold">{calcResult.firstUsableIp}</span>
              </div>
              <span className="hidden sm:inline text-slate-600 font-sans">➔</span>
              <div className="text-slate-300">
                <span className="text-slate-500 text-xs">Última IP Útil: </span>
                <span className="text-indigo-400 font-bold">{calcResult.lastUsableIp}</span>
              </div>
            </div>
          </div>

          {/* Binary View */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
            <span className="text-slate-400 font-semibold block">
              Representación Binaria
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-2 rounded">
                <span className="text-slate-400">IP Binaria:</span>
                <span className="text-cyan-300 tracking-wider">{calcResult.binaryIp}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-2 rounded">
                <span className="text-slate-400">Máscara Binaria:</span>
                <span className="text-emerald-300 tracking-wider">{calcResult.binaryMask}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-rose-400 bg-rose-950/20 border border-rose-900 rounded-xl text-xs">
          Formato de dirección IP inválido. Por favor ingrese una dirección IPv4 válida (ej. 192.168.1.1).
        </div>
      )}
    </div>
  );
};
