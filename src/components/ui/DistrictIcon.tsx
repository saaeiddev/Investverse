const paths: Record<string, string> = {
  stocks: 'M4 20V11h4v9m3 0V5h4v15m3 0V9h3v11M3 7l5-3 5 1 7-3',
  property: 'M3 21V9l6-4 6 4v12M15 21V3h6v18M6 12h1m3 0h1m-5 4h1m3 0h1m7-9h1m-1 4h1m-1 4h1M8 21v-3h3v3',
  gold: 'M4 14h8l3 6H2l2-6Zm11 0h5l2 6h-7M8 5h8l3 6H5l3-6Z',
  crypto: 'm12 2 6 3v6l-6 3-6-3V5l6-3Zm-6 9-4 3v6l6 3 6-3v-6m4-3 4 3v6l-6 3M6 5l6 3 6-3M12 8v6',
  bonds: 'M5 3h14v18H5V3Zm3 4h8M8 10h8M8 13h3m3 3 2 2 4-4M8 17h2',
  etfs: 'M3 8h18l-2 13H5L3 8Zm4 0 3-6m7 6-3-6M8 12v5m4-5v5m4-5v5',
  savings: 'm2 8 10-6 10 6H2Zm2 3v7m5-7v7m6-7v7m5-7v7M2 21h20M2 18h20',
  startups: 'M9 15 5 19m4-13c4-5 11-4 11-4s1 7-4 11l-5 3-5-5 3-5Zm2 10-1 5 4-3m-8-7-4 1 3-4m9 0h.01M3 21l4-4',
  funds: 'M12 2v5M4 11V7h16v4M3 14h5v7H3v-7Zm7-3h4v10h-4V11Zm6 3h5v7h-5v-7Z',
  reits: 'M2 12h6v9H2v-9Zm9-9h6v18h-6V3Zm9 9h2v9h-2M4 15h2m-2 3h2m7-12h2m-2 4h2m-2 4h2M7 9l5-3m5 3 4 3',
};
export default function DistrictIcon({ id, size = 22 }: { id: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[id] || paths.stocks} /></svg>;
}
