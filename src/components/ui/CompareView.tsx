import { lazy, Suspense } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { investments, scoreNotes, categoryScoreNotes } from '../../data/investments';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import type { AssetId } from '../../utils/finance';
import DistrictIcon from './DistrictIcon';
import { Meter, SectionTitle } from './Shared';
const MiniScene=lazy(()=>import('../../scenes/WorldScene').then(m=>({default:m.MiniScene})));

export default function CompareView() {
  const {t,lang,num}=useI18n();const state=useStore();
  return <section className="full-view compare-view"><SectionTitle eyebrow={t('DIFFERENT PATHS. INFORMED CHOICES.','مسیرهای متفاوت، انتخاب آگاهانه')} title={t('See the bigger picture.','تصویر کامل‌تر را ببین.')} description={t('Compare up to three districts. Rotate each model to explore.','تا سه منطقه را مقایسه کن. برای بررسی، مدل‌ها را بچرخان.')}/>
    <div className="comparison-select" aria-label={t('Choose up to three investments','انتخاب حداکثر سه سرمایه‌گذاری')}>{investments.map(a=>{const chosen=state.comparison.includes(a.id as AssetId);return <button key={a.id} aria-pressed={chosen} disabled={!chosen&&state.comparison.length>=3} className={chosen?'active':''} onClick={()=>state.compare(a.id as AssetId)}><DistrictIcon id={a.id} size={17}/>{a.name[lang]}{chosen?<Check size={13}/>:<Plus size={13}/>}</button>;})}</div>
    <p className="fineprint">{num(state.comparison.length)} / {num(3)} · {scoreNotes[lang]}</p>
    {state.comparison.length===0?<div className="empty-state">{t('Choose two or three investments above to compare.','برای مقایسه، دو یا سه سرمایه‌گذاری را از بالا انتخاب کنید.')}</div>:<div className="comparison-grid">{state.comparison.map(id=>{const a=investments.find(x=>x.id===id)!;return <article className="compare-card" key={id} style={{'--district':a.color} as React.CSSProperties}>
      <div className="compare-card-top"><span className="eyebrow">{a.code} / {t('DISTRICT','منطقه')}</span><button className="icon-button" aria-label={`${t('Remove','حذف')} ${a.name[lang]}`} onClick={()=>state.compare(id)}><X size={15}/></button></div>
      <div className="mini-scene"><Suspense fallback={<div className="mini-fallback"><DistrictIcon id={id} size={55}/></div>}><MiniScene id={id}/></Suspense></div>
      <h3>{a.name[lang]}</h3><p className="compare-tagline">{a.tagline[lang]}</p>
      <div className="meters"><Meter label={t('Risk','ریسک')} value={a.risk} color={a.color}/><Meter label={t('Liquidity','نقدشوندگی')} value={a.liquid} color={a.color}/><Meter label={t('Complexity','پیچیدگی')} value={a.complexity} color={a.color}/></div>
      <p className="fineprint">{categoryScoreNotes[id][lang]}</p>
      <dl><dt>{t('How it works','سازوکار')}</dt><dd>{a.description[lang]}</dd><dt>{t('Time horizon','افق زمانی')}</dt><dd>{a.horizon[lang]}</dd><dt>{t('Access to your money','دسترسی به پول')}</dt><dd>{a.liquidity[lang]}</dd><dt>{t('Costs','هزینه‌ها')}</dt><dd>{a.costs[lang]}</dd><dt>{t('Principal advantage','مزیت اصلی')}</dt><dd className="positive">{a.benefits[0][lang]}</dd><dt>{t('Principal risks','ریسک‌های اصلی')}</dt><dd>{a.risks.map(r=>r[lang]).join(lang==='fa'?'؛ ': '; ')}</dd></dl>
      <button className="secondary-button" onClick={()=>{state.set({mode:'world'});state.select(id);}}>{t('Explore this district','کاوش این منطقه')}</button>
    </article>;})}</div>}
  </section>;
}
