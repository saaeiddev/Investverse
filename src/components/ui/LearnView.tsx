import { useState } from 'react';
import { Search, Bookmark, ArrowUpRight } from 'lucide-react';
import { glossary, investments, sources, educationalNotice } from '../../data/investments';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import type { AssetId } from '../../utils/finance';
import DistrictIcon from './DistrictIcon';
import { SectionTitle, ExternalLink } from './Shared';

const normalize=(s:string)=>s.toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').trim();
export default function LearnView() {
  const {t,lang,num}=useI18n();const state=useStore();const [query,setQuery]=useState('');
  const filtered=glossary.filter(g=>normalize(`${g.term.en} ${g.term.fa} ${g.definition.en} ${g.definition.fa}`).includes(normalize(query)));
  return <section className="full-view learn-view"><SectionTitle eyebrow={t('KNOWLEDGE COMPOUNDS, TOO','دانش هم رشد مرکب دارد')} title={t('Understand the language.','زبان سرمایه‌گذاری را بشناس.')} description={educationalNotice[lang]}/>
    <div className="learning-intro"><div><h3>{t('Start with a question.','با یک پرسش شروع کن.')}</h3><p>{t('What do I own? How could I earn? How could I lose? When could I get my money back? Explore a district to connect each question to an investment.','مالک چه چیزی هستم؟ چطور درآمد دارم؟ چطور زیان می‌کنم؟ چه زمانی می‌توانم پولم را پس بگیرم؟ پاسخ هر پرسش را در منطقه مربوط به آن پیدا کن.')}</p><button className="text-button" onClick={()=>{state.set({mode:'world',tour:true,tourIndex:0});state.select('stocks');}}>{t('Take the guided tour','شروع تور راهنما')}<ArrowUpRight size={16}/></button></div><div><h3><Bookmark size={17}/>{t('Your reading list','فهرست مطالعه شما')}</h3>{state.bookmarks.length===0?<p>{t('Bookmark any district to keep it here for your next visit.','هر منطقه را نشان کنید تا در بازدید بعدی اینجا باشد.')}</p>:<div className="bookmark-list">{state.bookmarks.map(id=>{const a=investments.find(x=>x.id===id)!;return <button key={id} onClick={()=>{state.set({mode:'world'});state.select(id as AssetId);}}><DistrictIcon id={id} size={17}/>{a.name[lang]}<ArrowUpRight size={13}/></button>;})}</div>}</div></div>
    <label className="search-field"><Search size={19}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('Search the investment glossary…','جست‌وجو در واژه‌نامه سرمایه‌گذاری…')} aria-label={t('Search glossary in English or Persian','جست‌وجوی واژه‌نامه به فارسی یا انگلیسی')}/><span>{num(filtered.length)} {t('terms','واژه')}</span></label>
    <div className="glossary-grid">{filtered.map(g=><article key={g.term.en}><span className="glossary-mark">↗</span><h3>{g.term[lang]}</h3>{lang==='fa'&&<span className="english-term" lang="en" dir="ltr">{g.term.en}</span>}<p>{g.definition[lang]}</p></article>)}</div>
    {filtered.length===0&&<div className="empty-state">{t('No matching terms. Try “risk” or “inflation”.','واژه‌ای پیدا نشد. «ریسک» یا «تورم» را امتحان کنید.')}</div>}
    <details className="source-library"><summary>{t('Education sources & reading material','منابع آموزشی و مطالعه بیشتر')} · {num(sources.length)}</summary><p>{t('Primary sources from regulators and public investor education services. Legal, tax and insurance details are jurisdiction-specific. No live prices or historical performance series are used.','منابع اصلی از نهادهای ناظر و خدمات عمومی آموزش سرمایه‌گذار. قوانین، مالیات و بیمه به کشور وابسته‌اند. از قیمت زنده یا سری داده بازده تاریخی استفاده نشده است.')}</p><div>{sources.map(s=><ExternalLink key={s.id} url={s.url}>{s.title}</ExternalLink>)}</div></details>
  </section>;
}
