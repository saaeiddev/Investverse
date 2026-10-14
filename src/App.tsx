import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesCombined, CircleHelp, Compass, Globe2, Layers3, Maximize, Pause, Play, RotateCcw, Scale, Settings2, ShieldCheck, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { investments } from './data/investments';
import { useStore } from './store/useStore';
import type { Mode } from './store/useStore';
import type { AssetId } from './utils/finance';
import { useI18n } from './i18n/useI18n';
import DistrictIcon from './components/ui/DistrictIcon';
import InfoPanel from './components/ui/InfoPanel';
import PortfolioPanel from './components/ui/PortfolioPanel';
import GrowthPanel from './components/ui/GrowthPanel';
import RiskPanel from './components/ui/RiskPanel';
import LearnView from './components/ui/LearnView';
import Settings from './components/ui/Settings';
const WorldScene=lazy(()=>import('./scenes/WorldScene'));
const CompareView=lazy(()=>import('./components/ui/CompareView'));

const navigation:{id:Mode;en:string;fa:string;icon:LucideIcon}[]=[
  {id:'world',en:'Explore',fa:'کاوش',icon:Globe2},
  {id:'portfolio',en:'Portfolio lab',fa:'سبد سرمایه',icon:Layers3},
  {id:'growth',en:'Growth',fa:'رشد',icon:ChartNoAxesCombined},
  {id:'risk',en:'Risk lab',fa:'ریسک',icon:ShieldCheck},
  {id:'compare',en:'Compare',fa:'مقایسه',icon:Scale},
  {id:'learn',en:'Learn',fa:'آموزش',icon:BookOpen},
];
function Logo() {
  return <span className="brand"><svg viewBox="0 0 38 40" width="32" height="35" aria-hidden="true"><path d="M3 7 18 1l16 6v25l-16 7L3 32V7Z" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M10 11h4v17h-4zm8 0h4v11l5-11h4l-8 18h-5z" fill="currentColor"/></svg><span>INVESTVERSE<small>A WORLD OF POSSIBILITIES</small></span></span>;
}
function Loading() {const {t}=useI18n();return <div className="loading-world" role="status"><div className="loading-orbit"/><span>{t('Assembling your world…','در حال ساخت جهان شما…')}</span></div>;}

export default function App() {
  const state=useStore();const {t,lang,num}=useI18n();
  const [tourPaused,pauseTour]=useState(false);const [help,setHelp]=useState(false);
  const isFull=state.mode==='learn'||state.mode==='compare';
  const showPanel=state.mode!=='world'||!!state.selected;
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';document.documentElement.dataset.motion=state.reduced?'reduced':'full';},[lang,state.reduced]);
  useEffect(()=>{
    const read=()=>{const mode=location.hash.slice(1) as Mode;if(navigation.some(n=>n.id===mode))useStore.getState().set({mode});};
    read();window.addEventListener('hashchange',read);return()=>window.removeEventListener('hashchange',read);
  },[]);
  useEffect(()=>{if(location.hash!==`#${state.mode}`)history.replaceState(null,'',`#${state.mode}`);},[state.mode]);
  useEffect(()=>{if(state.mode!=='world'&&state.tour)state.set({tour:false});},[state.mode,state.tour,state.set]);
  const tourGo=(index:number)=>{if(index>=investments.length){state.set({tour:false});state.select(null);return;}const n=Math.max(0,index);state.set({tourIndex:n});state.select(investments[n].id as AssetId);};
  useEffect(()=>{
    if(!state.tour||tourPaused)return;
    const timer=window.setTimeout(()=>{const current=useStore.getState();if(current.tourIndex>=9){current.set({tour:false});current.select(null);}else{const next=current.tourIndex+1;current.set({tourIndex:next});current.select(investments[next].id as AssetId);}},11000);
    return()=>window.clearTimeout(timer);
  },[state.tour,state.tourIndex,tourPaused]);
  const startTour=()=>{pauseTour(false);state.set({mode:'world',tour:true,tourIndex:0});state.select('stocks');};
  const setMode=(mode:Mode)=>{state.set({mode,tour:false});if(mode!=='world')state.select(null);};
  return <div className={`app-shell mode-${state.mode} ${showPanel?'has-panel':''}`}>
    <a className="skip-link" href="#main-content">{t('Skip to content','رفتن به محتوا')}</a>
    <header className="app-header"><button className="brand-button" onClick={()=>{setMode('world');state.select(null);}} aria-label={t('Investverse home','صفحه اصلی اینوست‌ورس')}><Logo/></button>
      <nav className="main-nav" aria-label={t('Main navigation','ناوبری اصلی')}>{navigation.map(n=><button key={n.id} className={state.mode===n.id?'active':''} aria-current={state.mode===n.id?'page':undefined} onClick={()=>setMode(n.id)}><n.icon size={15}/><span>{t(n.en,n.fa)}</span></button>)}</nav>
      <div className="header-actions"><button className="language-button" onClick={()=>state.set({lang:lang==='en'?'fa':'en'})} aria-label={lang==='en'?'Switch to Persian':'تغییر به انگلیسی'}><Globe2 size={15}/>{lang==='en'?'FA':'EN'}</button><button className="icon-button" onClick={()=>state.set({settings:true})} aria-label={t('Open settings','باز کردن تنظیمات')}><Settings2 size={18}/></button></div>
    </header>
    <main className="workbench" id="main-content">
      {!isFull&&<aside className="district-sidebar" aria-label={t('Investment districts','منطقه‌های سرمایه‌گذاری')}>
        <div className="sidebar-heading"><span className="eyebrow">{t('THE DISTRICTS','منطقه‌ها')}</span><span>{num(10)}</span></div>
        <div className="district-navigation">{investments.map((a,i)=><button className={`district-nav-item ${state.selected===a.id?'active':''}`} key={a.id} style={{'--district':a.color} as React.CSSProperties} onClick={()=>{state.set({tour:false});state.select(a.id as AssetId);}} aria-pressed={state.selected===a.id} title={a.name[lang]}><span className="district-number">{num(i+1).padStart(lang==='fa'?1:2,'0')}</span><span className="district-nav-icon"><DistrictIcon id={a.id}/></span><span className="district-nav-copy">{a.name[lang]}<small>{a.tagline[lang]}</small></span><ArrowUpRight className="district-nav-arrow" size={13}/></button>)}</div>
        <div className="sidebar-bottom"><span className="tiny-label">{t('CURIOUS WHERE TO BEGIN?','از کجا شروع کنیم؟')}</span><button onClick={startTour}><Play size={12} fill="currentColor"/>{t('Take a guided tour','تور راهنما')}<ArrowRight size={15}/></button><div className="sidebar-footnote"><span className="status-dot"/>{t('An interactive learning experience','یک تجربه یادگیری تعاملی')}</div></div>
      </aside>}
      {isFull?<Suspense fallback={<Loading/>}>{state.mode==='compare'?<CompareView/>:<LearnView/>}</Suspense>:<div className="visual-layout">
        <section className="world-stage" aria-label={t('Interactive three-dimensional investment metropolis','شهر تعاملی سه‌بعدی سرمایه‌گذاری')}>
          <div className="scene-container"><Suspense fallback={<Loading/>}><WorldScene/></Suspense></div>
          <div className="scene-vignette"/>
          <div className={`world-introduction ${state.selected?'compact':''}`}>
            <span className="eyebrow"><i className="status-dot"/>{t('THE INTERACTIVE WORLD OF INVESTING','جهان تعاملی سرمایه‌گذاری')}</span>
            {!state.selected&&<><h1>{state.mode==='world'?<>{t('A new perspective','نگاهی تازه')}<br/><em>{t('on investing.','به سرمایه‌گذاری.')}</em></>:state.mode==='portfolio'?<>{t('One world.','یک جهان.')}<br/><em>{t('Your balance.','تعادل شما.')}</em></>:state.mode==='growth'?<>{t('Small beginnings.','شروع‌های کوچک.')}<br/><em>{t('Long horizons.','افق‌های بلند.')}</em></>:<>{t('Every opportunity','هر فرصت')}<br/><em>{t('has another side.','روی دیگری دارد.')}</em></>}</h1>
            <p>{state.mode==='world'?t('Explore the assets. Understand the possibilities.\nBuild your own financial perspective.','دارایی‌ها را کشف کن. فرصت‌ها را بشناس.\nنگاه مالی خودت را بساز.'):state.mode==='portfolio'?t('Your allocation gives this city its shape.','تخصیص سرمایه‌ات به این شهر شکل می‌دهد.'):state.mode==='growth'?t('A hypothetical journey through time.','یک سفر فرضی در گذر زمان.'):t('Explore what could happen, before it happens.','پیش از وقوع، پیامدهای احتمالی را بررسی کن.')}</p></>}
          </div>
          {state.mode==='world'&&!state.selected&&<div className="world-index"><span>01 — 10</span><div>{t('DISTINCT DISTRICTS','منطقه متمایز')}<br/>{t('CONNECTED POSSIBILITIES','فرصت‌های به‌هم‌پیوسته')}</div><Compass size={28}/></div>}
          {state.selected&&<button className="back-to-world" onClick={()=>{state.set({tour:false});state.select(null);}}><ArrowRight size={14}/>{t('World overview','نمای کلی جهان')}</button>}
          {state.mode==='world'&&!state.selected&&<div className="world-cta"><div className="coordinates"><span>INV / 360°</span><i/></div><h2>{t('Every district, a different possibility.','هر منطقه، یک امکان متفاوت.')}</h2><p>{t('Select a building or choose a district to step inside.','برای ورود، یک ساختمان یا منطقه را انتخاب کن.')}</p><button className="primary-button" onClick={()=>state.select('stocks')}>{t('Start exploring','شروع کاوش')}<ArrowUpRight size={17}/></button></div>}
          {state.tour&&<div className="tour-control" aria-live="polite"><div><span className="eyebrow">{t('GUIDED EXPLORATION','تور راهنما')}</span><b>{num(state.tourIndex+1)} / {num(10)} · {investments[state.tourIndex].name[lang]}</b></div><div className="button-row"><button className="icon-button" disabled={state.tourIndex===0} aria-label={t('Previous district','منطقه قبلی')} onClick={()=>tourGo(state.tourIndex-1)}><ChevronLeft size={17}/></button><button className="icon-button" aria-label={tourPaused?t('Resume tour','ادامه تور'):t('Pause tour','توقف تور')} onClick={()=>pauseTour(!tourPaused)}>{tourPaused?<Play size={16}/>:<Pause size={16}/>}</button><button className="icon-button" aria-label={t('Next district','منطقه بعدی')} onClick={()=>tourGo(state.tourIndex+1)}><ChevronRight size={17}/></button><button className="icon-button" aria-label={t('End tour','پایان تور')} onClick={()=>state.set({tour:false})}><X size={16}/></button></div></div>}
          <div className="world-tools"><div className="world-hint"><span className="mouse-outline"/>{t('DRAG TO ROTATE','کشیدن برای چرخش')}<i/> <Maximize size={12}/>{t('SCROLL TO ZOOM','اسکرول برای بزرگ‌نمایی')}</div><div className="button-row"><button className="icon-button" title={t('Reset camera','بازنشانی دوربین')} aria-label={t('Reset camera','بازنشانی دوربین')} onClick={()=>{state.set({tour:false});state.select(null);}}><RotateCcw size={16}/></button><button className="icon-button" aria-label={state.sound?t('Mute sound','قطع صدا'):t('Enable sound','فعال‌سازی صدا')} onClick={()=>state.set({sound:!state.sound})}>{state.sound?<Volume2 size={16}/>:<VolumeX size={16}/>}</button><button className={`icon-button ${help?'active':''}`} aria-label={t('Interaction help','راهنمای تعامل')} aria-expanded={help} onClick={()=>setHelp(!help)}><CircleHelp size={16}/></button></div></div>
          {help&&<div className="help-popover"><button className="icon-button" onClick={()=>setHelp(false)} aria-label={t('Close help','بستن راهنما')}><X size={14}/></button><b>{t('A world at your fingertips','جهانی زیر انگشتان شما')}</b><p>{t('Drag to orbit. Scroll or pinch to zoom. Click a building or district label to focus. Use the district list with Tab and Enter for keyboard navigation. Reset camera returns to the full city.','برای چرخش بکشید. با اسکرول یا دو انگشت بزرگ‌نمایی کنید. ساختمان یا برچسب منطقه را انتخاب کنید. با Tab و Enter می‌توانید فهرست منطقه‌ها را مرور کنید. بازنشانی دوربین، کل شهر را نشان می‌دهد.')}</p></div>}
          {state.mode==='growth'&&<span className="scene-annotation">{t('Gold columns represent yearly hypothetical values; normalized height.','ستون‌های طلایی نماینده ارزش فرضی سالانه با ارتفاع نسبی‌اند.')}</span>}
          {state.mode==='risk'&&<span className="scene-annotation">{t('District scale responds to synthetic asset shocks.','اندازه منطقه‌ها به شوک فرضی دارایی پاسخ می‌دهد.')}</span>}
        </section>
        {state.mode==='world'&&state.selected&&<InfoPanel/>}
        {state.mode==='portfolio'&&<PortfolioPanel/>}
        {state.mode==='growth'&&<GrowthPanel/>}
        {state.mode==='risk'&&<RiskPanel/>}
      </div>}
    </main>
    <footer className="app-footer"><span><i className="status-dot"/>{t('EDUCATIONAL EXPERIENCE','تجربه آموزشی')}<span className="footer-divider">/</span>{t('No live market data · No guaranteed returns','بدون داده زنده بازار · بدون تضمین بازده')}</span><a href="https://amirsaeiddehghan.ir" target="_blank" rel="noreferrer">{t('Created by','طراحی و ساخت:')} <b>{t('Amir Saeid Dehghan','امیر سعید دهقان')}</b><ArrowUpRight size={11}/></a></footer>
    {state.settings&&<Settings/>}
  </div>;
}
