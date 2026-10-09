export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

export function formatSpeed(mbps: number, decimals: number = 2): string {
  if (mbps < 0.001) return '0.00 Mbps';
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(decimals)} Gbps`;
  }
  return `${mbps.toFixed(decimals)} Mbps`;
}

export function formatRateKB(kbPerSec: number): string {
  if (kbPerSec >= 1024) {
    return `${(kbPerSec / 1024).toFixed(2)} MB/s`;
  }
  return `${kbPerSec.toFixed(1)} KB/s`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}
