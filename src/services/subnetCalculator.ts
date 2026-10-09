import { SubnetCalcResult } from '../types/network';

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join('.');
}

function toBinaryString(long: number): string {
  return [
    ((long >>> 24) & 255).toString(2).padStart(8, '0'),
    ((long >>> 16) & 255).toString(2).padStart(8, '0'),
    ((long >>> 8) & 255).toString(2).padStart(8, '0'),
    (long & 255).toString(2).padStart(8, '0'),
  ].join('.');
}

export function calculateSubnet(ipInput: string, cidrInput: number): SubnetCalcResult | null {
  const ip = ipInput.trim();
  const cidr = Math.min(Math.max(Number(cidrInput), 0), 32);

  // Validate IP regex
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (!ipRegex.test(ip)) {
    return null;
  }

  const ipLong = ipToLong(ip);
  const maskLong = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const wildcardLong = ~maskLong >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const netmask = longToIp(maskLong);
  const wildcardMask = longToIp(wildcardLong);
  const networkAddress = longToIp(networkLong);
  const broadcastAddress = longToIp(broadcastLong);

  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts;
  if (cidr === 31 || cidr === 32) usableHosts = totalHosts; // Point-to-point / host

  let firstUsableIp = networkAddress;
  let lastUsableIp = broadcastAddress;

  if (cidr <= 30) {
    firstUsableIp = longToIp(networkLong + 1);
    lastUsableIp = longToIp(broadcastLong - 1);
  }

  // Determine IP Class
  const firstOctet = parseInt(ip.split('.')[0], 10);
  let ipClass = 'A';
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240) ipClass = 'E (Experimental)';

  // Determine Type (Private RFC 1918, Loopback, etc.)
  let ipType: SubnetCalcResult['ipType'] = 'Pública';
  const secondOctet = parseInt(ip.split('.')[1], 10);

  if (firstOctet === 10) {
    ipType = 'Privada (RFC 1918)';
  } else if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
    ipType = 'Privada (RFC 1918)';
  } else if (firstOctet === 192 && secondOctet === 168) {
    ipType = 'Privada (RFC 1918)';
  } else if (firstOctet === 127) {
    ipType = 'Loopback';
  } else if (firstOctet === 169 && secondOctet === 254) {
    ipType = 'Link-Local';
  } else if (firstOctet >= 240) {
    ipType = 'Reservada';
  }

  return {
    ip,
    cidr,
    netmask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    firstUsableIp,
    lastUsableIp,
    totalHosts,
    usableHosts,
    ipClass,
    ipType,
    binaryIp: toBinaryString(ipLong),
    binaryMask: toBinaryString(maskLong),
  };
}
