import { NetworkConnection, NetworkAlert } from '../types/network';

export type TrafficProfile = 'normal' | 'streaming4k' | 'gaming' | 'download' | 'congestion';

export const INITIAL_CONNECTIONS: NetworkConnection[] = [
  {
    id: 'conn-1',
    protocol: 'HTTPS',
    localAddress: '192.168.1.105',
    localPort: 54210,
    remoteAddress: '142.250.190.46',
    remotePort: 443,
    remoteHost: 'google.com',
    state: 'ESTABLISHED',
    processName: 'Chrome (Browser Core)',
    downloadRate: 245.5,
    uploadRate: 18.2,
    bytesTotal: 15420000,
    latencyMs: 14,
    durationSeconds: 340,
  },
  {
    id: 'conn-2',
    protocol: 'HTTPS',
    localAddress: '192.168.1.105',
    localPort: 54214,
    remoteAddress: '104.244.42.1',
    remotePort: 443,
    remoteHost: 'api.github.com',
    state: 'ESTABLISHED',
    processName: 'VS Code Sync',
    downloadRate: 14.8,
    uploadRate: 8.5,
    bytesTotal: 2310000,
    latencyMs: 38,
    durationSeconds: 1200,
  },
  {
    id: 'conn-3',
    protocol: 'QUIC',
    localAddress: '192.168.1.105',
    localPort: 60124,
    remoteAddress: '172.217.16.206',
    remotePort: 443,
    remoteHost: 'youtube-video-cdn.net',
    state: 'ESTABLISHED',
    processName: 'Video Stream Service',
    downloadRate: 1250.0,
    uploadRate: 42.1,
    bytesTotal: 98400000,
    latencyMs: 19,
    durationSeconds: 840,
  },
  {
    id: 'conn-4',
    protocol: 'DNS',
    localAddress: '192.168.1.105',
    localPort: 51200,
    remoteAddress: '1.1.1.1',
    remotePort: 53,
    remoteHost: 'cloudflare-dns.com',
    state: 'TIME_WAIT',
    processName: 'systemd-resolved',
    downloadRate: 0.5,
    uploadRate: 0.5,
    bytesTotal: 120400,
    latencyMs: 9,
    durationSeconds: 12,
  },
  {
    id: 'conn-5',
    protocol: 'WS',
    localAddress: '192.168.1.105',
    localPort: 58821,
    remoteAddress: '54.210.12.88',
    remotePort: 443,
    remoteHost: 'gateway.discord.gg',
    state: 'ESTABLISHED',
    processName: 'Discord Desktop',
    downloadRate: 12.0,
    uploadRate: 9.4,
    bytesTotal: 4500000,
    latencyMs: 25,
    durationSeconds: 3600,
  },
  {
    id: 'conn-6',
    protocol: 'TCP',
    localAddress: '0.0.0.0',
    localPort: 3000,
    remoteAddress: '0.0.0.0',
    remotePort: 0,
    remoteHost: 'localhost (Vite Dev)',
    state: 'LISTEN',
    processName: 'node (Vite Server)',
    downloadRate: 0,
    uploadRate: 0,
    bytesTotal: 8400000,
    latencyMs: 1,
    durationSeconds: 7200,
  },
  {
    id: 'conn-7',
    protocol: 'UDP',
    localAddress: '192.168.1.105',
    localPort: 50004,
    remoteAddress: '185.60.112.157',
    remotePort: 3724,
    remoteHost: 'eu-battle-net.blizzard.com',
    state: 'ESTABLISHED',
    processName: 'Game Client Engine',
    downloadRate: 85.0,
    uploadRate: 48.0,
    bytesTotal: 18500000,
    latencyMs: 28,
    durationSeconds: 1800,
  },
  {
    id: 'conn-8',
    protocol: 'TCP',
    localAddress: '192.168.1.105',
    localPort: 59102,
    remoteAddress: '13.107.4.52',
    remotePort: 443,
    remoteHost: 'onedrive.live.com',
    state: 'ESTABLISHED',
    processName: 'Cloud Storage Agent',
    downloadRate: 4.2,
    uploadRate: 110.0,
    bytesTotal: 45000000,
    latencyMs: 44,
    durationSeconds: 420,
  },
];

export const INITIAL_ALERTS: NetworkAlert[] = [
  {
    id: 'alert-1',
    timestamp: '07:48:12',
    severity: 'info',
    title: 'Nueva Conexión Cifrada QUIC Establecida',
    message: 'Flujo de datos UDP/443 de alto rendimiento iniciado con youtube-video-cdn.net.',
    category: 'connection',
  },
  {
    id: 'alert-2',
    timestamp: '07:50:35',
    severity: 'info',
    title: 'Resolución DNS Exitosa',
    message: 'Caché DNS local refrescada mediante Cloudflare DNS (1.1.1.1) con 9ms de latencia.',
    category: 'dns',
  },
  {
    id: 'alert-3',
    timestamp: '07:52:10',
    severity: 'warning',
    title: 'Incremento en Tráfico de Subida (Upload)',
    message: 'El proceso Cloud Storage Agent está utilizando más de 110 KB/s de ancho de banda saliente.',
    category: 'bandwidth',
  },
];

export function getProfileMultiplier(profile: TrafficProfile): { dlBase: number; ulBase: number; jitter: number; loss: number } {
  switch (profile) {
    case 'streaming4k':
      return { dlBase: 42.5, ulBase: 3.2, jitter: 1.5, loss: 0 };
    case 'gaming':
      return { dlBase: 8.5, ulBase: 4.8, jitter: 0.8, loss: 0 };
    case 'download':
      return { dlBase: 88.0, ulBase: 6.5, jitter: 3.8, loss: 0.2 };
    case 'congestion':
      return { dlBase: 12.0, ulBase: 15.0, jitter: 24.5, loss: 4.2 };
    case 'normal':
    default:
      return { dlBase: 24.0, ulBase: 5.5, jitter: 1.8, loss: 0.0 };
  }
}
