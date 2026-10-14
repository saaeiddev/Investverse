import { RotateCcw, ArrowUpRight } from 'lucide-react';
import { investments } from '../../data/investments';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import type { AssetId } from '../../utils/finance';
import { Field, SectionTitle } from './Shared';
import DistrictIcon from './DistrictIcon';

export default function PortfolioPanel() {
  const state=useStore();const {lang,t,money,percent}=useI18n();
  let cumulative=0;const gradient=investments.map(a=>{const start=cumulative;cumulative+=state.allocation[a.id as AssetId];return `${a.color} ${start}% ${cumulative}%`;}).join(',');
  return <section className="side-panel portfolio-panel" aria-label={t('Portfolio lab','آزمایشگاه سبد')}>
    <SectionTitle eyebrow={t('YOUR CAPITAL, CONNECTED','سرمایه شما، به‌هم‌پیوسته')} title={t('Build your balance.','تعادل خودت را بساز.')} description={t('Move a slider. Watch your world change.','سهم‌ها را تغییر بده و تغییر جهان را ببین.')}/>
    <Field label={t('Virtual investment budget','بودجه فرضی سرمایه‌گذاری')} value={state.budget} min={0} max={1e12} step={100} onChange={budget=>state.set({budget})} suffix={state.currency}/>
    <div className="portfolio-overview"><div className="allocation-donut" style={{background:`conic-gradient(${gradient})`}} role="img" aria-label={t('Allocation totals 100 percent','مجموع تخصیص ۱۰۰ درصد است')}><div><b>{percent(100)}</b><span>{t('ALLOCATED','تخصیص‌یافته')}</span></div></div><div className="portfolio-key"><span className="positive"><i className="status-dot"/>{t('Fully allocated','تخصیص کامل')}</span><p>{t('Other allocations rebalance proportionally. Total stays at 100%.','بقیه سهم‌ها متناسب تنظیم می‌شوند. مجموع همیشه ۱۰۰٪ است.')}</p></div></div>
    <div className="segmented presets" aria-label={t('Illustrative portfolio presets','سبدهای نمونه آموزشی')}>{[['conservative','Conservative','محافظه‌کار'],['balanced','Balanced','متعادل'],['growth','Growth','رشد']].map(([key,en,fa])=><button key={key} className={state.preset===key?'active':''} aria-pressed={state.preset===key} onClick={()=>state.applyPreset(key)}>{t(en,fa)}</button>)}</div>
    <p className="fineprint">{t('Illustrative examples only. Asset types can overlap; a fund can already hold stocks, bonds or REITs.','صرفاً مثال آموزشی. دسته‌ها می‌توانند هم‌پوشانی داشته باشند؛ صندوق ممکن است شامل سهام، اوراق یا ریت باشد.')}</p>
    <div className="allocation-list">{investments.map(a=>{const id=a.id as AssetId;return <div className={`allocation-item ${state.selected===id?'selected':''}`} key={id} style={{'--district':a.color} as React.CSSProperties}>
      <div className="allocation-top"><button className="allocation-name" onClick={()=>state.select(id)}><DistrictIcon id={id} size={18}/>{a.name[lang]}</button><label className="percent-input"><input type="number" min={0} max={100} step={1} value={state.allocation[id]} aria-label={`${a.name[lang]} ${t('allocation percentage','درصد تخصیص')}`} onChange={e=>state.allocate(id,Number(e.target.value))}/><span>%</span></label></div>
      <input type="range" min={0} max={100} step={1} value={state.allocation[id]} aria-label={`${a.name[lang]} ${t('allocation','تخصیص')}`} onChange={e=>state.allocate(id,Number(e.target.value))} style={{accentColor:a.color}}/>
      <span className="allocation-amount">{money(state.budget*state.allocation[id]/100)}</span>
    </div>;})}</div>
    <div className="panel-actions"><button className="primary-button" onClick={()=>state.set({mode:'risk',selected:null})}>{t('Stress-test this portfolio','آزمون فشار این سبد')}<ArrowUpRight size={16}/></button><button className="text-button" onClick={()=>state.applyPreset('balanced')}><RotateCcw size={14}/>{t('Reset allocation','بازنشانی تخصیص')}</button></div>
  </section>;
}
