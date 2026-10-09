export interface TrafficDataPoint {
  time: string;
  download: number; // in Mbps
  upload: number; // in Mbps
  packetsIn: number;
  packetsOut: number;
}

export type NetworkProtocol = 'TCP' | 'UDP' | 'ICMP' | 'HTTPS' | 'DNS' | 'QUIC' | 'WS';
export type ConnectionState = 'ESTABLISHED' | 'LISTEN' | 'TIME_WAIT' | 'CLOSE_WAIT' | 'SYN_SENT';

export interface NetworkConnection {
  id: string;
  protocol: NetworkProtocol;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  remoteHost: string;
  state: ConnectionState;
  processName: string;
  downloadRate: number; // in KB/s
  uploadRate: number; // in KB/s
  bytesTotal: number;
  latencyMs: number;
  durationSeconds: number;
}

export interface NetworkStats {
  currentDownloadMbps: number;
  currentUploadMbps: number;
  peakDownloadMbps: number;
  peakUploadMbps: number;
  totalBytesDownloaded: number;
  totalBytesUploaded: number;
  packetsInPerSec: number;
  packetsOutPerSec: number;
  currentPingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  activeSockets: number;
}

export type SpeedTestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

export interface SpeedTestResult {
  id: string;
  timestamp: string;
  ping: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  server: string;
  isp: string;
}

export interface DnsRecord {
  type: string;
  name: string;
  data: string;
  TTL: number;
}

export interface DnsLookupResult {
  domain: string;
  provider: string;
  records: DnsRecord[];
  queryTimeMs: number;
  status: 'SUCCESS' | 'NXDOMAIN' | 'ERROR';
  rawResponse?: unknown;
}

export interface SubnetCalcResult {
  ip: string;
  cidr: number;
  netmask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipType: 'Privada (RFC 1918)' | 'Pública' | 'Loopback' | 'Link-Local' | 'Reservada';
  binaryIp: string;
  binaryMask: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface NetworkAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  category: 'bandwidth' | 'latency' | 'security' | 'connection' | 'dns';
}

export interface ClientNetworkInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  isp?: string;
  org?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  online: boolean;
}
