import { useState } from 'react';
import { ArrowRight, Bookmark, Check, ChevronDown, Scale, X } from 'lucide-react';
import { investments, sources, scoreNotes, categoryScoreNotes } from '../../data/investments';
import { useStore } from '../../store/useStore';
import type { AssetId } from '../../utils/finance';
import { useI18n } from '../../i18n/useI18n';
import DistrictIcon from './DistrictIcon';
import { ExternalLink, Meter } from './Shared';

export default function InfoPanel() {
  const {lang,t}=useI18n();const id=useStore(s=>s.selected); const state=useStore();const [answer,setAnswer]=useState<number|null>(null);
  const asset=investments.find(a=>a.id===id);if(!asset)return null;
  const saved=state.bookmarks.includes(asset.id as AssetId);
  return <section className="side-panel info-panel" aria-label={asset.name[lang]} style={{'--district':asset.color} as React.CSSProperties} key={asset.id}>
    <div className="panel-top"><span className="eyebrow">{t('DISTRICT','منطقه')} / {asset.code}</span><div className="button-row"><button className={`icon-button ${saved?'active':''}`} onClick={()=>state.bookmark(id!)} aria-label={saved?t('Remove bookmark','حذف نشان'):t('Bookmark district','نشان کردن منطقه')} aria-pressed={saved}><Bookmark size={17} fill={saved?'currentColor':'none'}/></button><button className="icon-button" aria-label={t('Return to world','بازگشت به جهان')} onClick={()=>state.select(null)}><X size={18}/></button></div></div>
    <div className="district-heading"><div className="district-emblem"><DistrictIcon id={asset.id} size={36}/></div><h2>{asset.name[lang]}</h2><p>{asset.tagline[lang]}</p></div>
    <p className="body-copy">{asset.description[lang]}</p>
    <div className="meters"><Meter label={t('Risk','ریسک')} value={asset.risk} color={asset.color}/><Meter label={t('Liquidity','نقدشوندگی')} value={asset.liquid} color={asset.color}/><Meter label={t('Complexity','پیچیدگی')} value={asset.complexity} color={asset.color}/></div>
    <p className="fineprint">{scoreNotes[lang]} {categoryScoreNotes[id!]?.[lang]}</p>
    <div className="fact-pair"><div><span>{t('TIME HORIZON','افق زمانی')}</span><b>{asset.horizon[lang]}</b></div><div><span>{t('INCOME','درآمد')}</span><b>{asset.income[lang]}</b></div></div>
    <details open><summary>{t('Why investors use it','چرا سرمایه‌گذاران انتخابش می‌کنند')}<ChevronDown size={16}/></summary><p>{asset.goals[lang]}</p><ul className="benefits">{asset.benefits.map((x,i)=><li key={i}><Check size={14}/>{x[lang]}</li>)}</ul></details>
    <details open><summary>{t('Understand the risks','ریسک‌ها را بشناسید')}<ChevronDown size={16}/></summary><ul className="risks">{asset.risks.map((x,i)=><li key={i}>{x[lang]}</li>)}</ul></details>
    <details><summary>{t('Before you start','پیش از شروع')}<ChevronDown size={16}/></summary><dl><dt>{t('Liquidity','نقدشوندگی')}</dt><dd>{asset.liquidity[lang]}</dd><dt>{t('Access & minimums','دسترسی و حداقل سرمایه')}</dt><dd>{asset.entry[lang]}</dd><dt>{t('Costs to consider','هزینه‌های قابل توجه')}</dt><dd>{asset.costs[lang]}</dd><dt>{t('Common instruments','ابزارهای متداول')}</dt><dd>{asset.examples[lang]}</dd></dl><p>{asset.beginner[lang]}</p></details>
    <details><summary>{t('A 20-second knowledge check','یک پرسش کوتاه آموزشی')}<ChevronDown size={16}/></summary><p>{t('Does spreading money across these districts eliminate the possibility of a loss?','آیا تقسیم پول بین این منطقه‌ها، احتمال زیان را کاملاً از بین می‌برد؟')}</p><div className="segmented"><button onClick={()=>setAnswer(0)}>{t('Yes','بله')}</button><button onClick={()=>setAnswer(1)}>{t('No','خیر')}</button></div>{answer!==null&&<p className={answer===1?'positive':'caution'} role="status">{answer===1?t('Correct. Diversification reduces concentration; investments can still fall together.','درست است. تنوع، تمرکز را کم می‌کند؛ اما چند سرمایه‌گذاری ممکن است هم‌زمان افت کنند.'):t('Not quite. Diversification cannot eliminate market risk or guarantee a profit.','خیر؛ تنوع‌بخشی ریسک بازار را حذف نمی‌کند و سود را تضمین نمی‌کند.')}</p>}</details>
    <div className="panel-actions"><button className="primary-button" onClick={()=>state.set({mode:'portfolio'})}>{t('Experiment with allocation','آزمایش تخصیص سرمایه')}<ArrowRight size={16}/></button><button className="secondary-button" onClick={()=>{if(!state.comparison.includes(id!))state.set({comparison:[...state.comparison.filter(x=>x!==id).slice(0,2),id!]});state.set({mode:'compare'});}}><Scale size={16}/>{t('Compare this investment','مقایسه این سرمایه‌گذاری')}</button></div>
    <details className="sources"><summary>{t('Read the source material','منابع آموزشی')}<ChevronDown size={16}/></summary>{sources.filter(s=>asset.sourceIds.includes(s.id)).map(s=><ExternalLink key={s.id} url={s.url}>{s.title}</ExternalLink>)}</details>
  </section>;
}
