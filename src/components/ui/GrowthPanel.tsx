import { useMemo, useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { calculateGrowth } from '../../utils/finance';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import { Field, SectionTitle } from './Shared';
import type { GrowthPoint } from '../../utils/finance';

function GrowthChart({points}:{points:GrowthPoint[]}) {
  const {t,money,num}=useI18n();const [hover,setHover]=useState<number|null>(null);
  const max=Math.max(1,...points.flatMap(p=>[p.value,p.contributions,p.real]));
  const x=(i:number)=>12+i/(points.length-1)*336,y=(n:number)=>170-n/max*145;
  const line=(key:'value'|'contributions'|'real')=>points.map((p,i)=>`${i?'L':'M'}${x(i)},${y(p[key])}`).join(' ');
  const active=Math.min(hover??points.length-1,points.length-1);const p=points[active];
  return <div className="growth-chart"><div className="chart-current"><span>{t('Year','سال')} {num(p.year)}</span><b>{money(p.value)}</b></div><svg viewBox="0 0 360 195" role="img" aria-label={t('Hypothetical growth over time. Use the year slider for exact values.','رشد فرضی در طول زمان؛ برای مقدار دقیق از اسلایدر سال استفاده کنید.')} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setHover(Math.max(0,Math.min(points.length-1,Math.round(((e.clientX-r.left)/r.width*360-12)/336*(points.length-1)))));}} onPointerLeave={()=>setHover(null)}>
    <defs><linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e4b571" stopOpacity=".23"/><stop offset="100%" stopColor="#e4b571" stopOpacity="0"/></linearGradient></defs>
    {[.25,.5,.75,1].map(v=><line key={v} x1="12" x2="348" y1={y(max*v)} y2={y(max*v)} stroke="#ffffff12" strokeDasharray="3 4"/>)}
    <path d={`${line('value')} L348,170 L12,170Z`} fill="url(#growth-fill)"/>
    <path d={line('contributions')} fill="none" stroke="#76889e" strokeWidth="1.5" strokeDasharray="4 3"/>
    <path d={line('real')} fill="none" stroke="#66cfc8" strokeWidth="1.5"/>
    <path d={line('value')} fill="none" stroke="#e4b571" strokeWidth="2.5"/>
    <line x1={x(active)} x2={x(active)} y1="18" y2="170" stroke="#ffffff40"/><circle cx={x(active)} cy={y(p.value)} r="4" fill="#e4b571" stroke="#151d28" strokeWidth="2"/>
    <text x="12" y="189">{num(0)}</text><text x="348" y="189" textAnchor="end">{num(points.length-1)} {t('years','سال')}</text>
  </svg><input type="range" min={0} max={points.length-1} value={active} aria-label={t('Inspect year','بررسی سال')} onChange={e=>setHover(Number(e.target.value))}/><div className="chart-legend"><span><i style={{background:'#e4b571'}}/>{t('Value','ارزش')}</span><span><i style={{background:'#66cfc8'}}/>{t('Real value','ارزش واقعی')}</span><span><i style={{background:'#76889e'}}/>{t('Contributions','واریزی')}</span></div><div className="chart-detail"><span>{t('Contributions','مجموع واریزی')}: {money(p.contributions)}</span><span>{t('Real value','ارزش واقعی')}: {money(p.real)}</span></div></div>;
}
export default function GrowthPanel() {
  const {t,money,percent}=useI18n(); const state=useStore();const input=state.growth;
  const result=useMemo(()=>calculateGrowth(input),[input]);
  const update=(key:keyof typeof input)=>(n:number)=>state.set({growth:{...input,[key]:key==='years'?Math.round(n):n}});
  return <section className="side-panel growth-panel" aria-label={t('Compound growth simulator','شبیه‌ساز رشد مرکب')}>
    <SectionTitle eyebrow={t('TIME IS A DIMENSION','زمان، یک بُعد دیگر است')} title={t('Let time do its thing.','اثر زمان را ببین.')} description={t('Explore your assumptions. Never a prediction.','فرض‌هایت را بررسی کن؛ این پیش‌بینی نیست.')}/>
    <div className="result-hero"><span>{t('HYPOTHETICAL ENDING VALUE','ارزش فرضی پایان دوره')}</span><strong>{money(result.value)}</strong><small><TrendingUp size={13}/>{t('After','پس از')} {input.years} {t('years','سال')}</small></div>
    <GrowthChart points={result.points}/>
    <div className="form-grid"><Field label={t('Starting capital','سرمایه اولیه')} value={input.initial} onChange={update('initial')} min={0} max={1e10} step={100}/><Field label={t('Monthly addition','واریز ماهانه')} value={input.monthly} onChange={update('monthly')} min={0} max={1e8} step={50}/><Field label={t('Years invested','مدت سرمایه‌گذاری')} value={input.years} onChange={update('years')} min={1} max={60}/><Field label={t('Annual return','بازده سالانه')} value={input.annual} onChange={update('annual')} min={-99} max={100} step={.5} suffix="%"/><Field label={t('Annual inflation','تورم سالانه')} value={input.inflation} onChange={update('inflation')} min={-20} max={100} step={.5} suffix="%"/><Field label={t('Annual fee','کارمزد سالانه')} value={input.fee} onChange={update('fee')} min={0} max={20} step={.05} suffix="%"/></div>
    <div className="segmented"><button onClick={()=>state.set({growth:{...input,annual:0}})}>{t('Zero return','بازده صفر')}</button><button onClick={()=>state.set({growth:{...input,annual:-5}})}>{t('Negative return','بازده منفی')}</button><button onClick={()=>state.set({growth:{...input,annual:6}})}>{t('6% example','مثال ۶٪')}</button></div>
    <dl className="result-list"><div><dt>{t('Total contributions','مجموع واریزی')}</dt><dd>{money(result.contributions)}</dd></div><div><dt>{t('Hypothetical gain / loss','سود / زیان فرضی')}</dt><dd className={result.growth>=0?'positive':'negative'}>{money(result.growth)}</dd></div><div><dt>{t('Inflation-adjusted value','ارزش تعدیل‌شده با تورم')}</dt><dd>{money(result.real)}</dd></div><div><dt>{t('Net annual return after fee','بازده خالص سالانه پس از کارمزد')}</dt><dd>{percent(result.netAnnual,2)}</dd></div></dl>
    <div className="note"><Info size={16}/><p>{t('Effective annual rates converted to monthly compounding. Contributions arrive at month end. Fee is charged proportionally; real value is in today’s purchasing power. Constant rates, no taxes, no market fluctuations. Independent of your asset allocation.','نرخ مؤثر سالانه به نرخ ماهانه تبدیل می‌شود. واریز در پایان ماه است و کارمزد به‌صورت نسبتی اعمال می‌شود. ارزش واقعی بر حسب قدرت خرید امروز است. نرخ‌ها ثابت‌اند؛ مالیات و نوسان لحاظ نشده‌اند. این محاسبه مستقل از تخصیص سبد است.')}</p></div>
  </section>;
}
