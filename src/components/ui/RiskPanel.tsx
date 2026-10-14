import { ShieldAlert, ChevronDown } from 'lucide-react';
import { investments, scoreNotes } from '../../data/investments';
import { shocks, shockResult } from '../../utils/finance';
import type { AssetId } from '../../utils/finance';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import { SectionTitle } from './Shared';

export default function RiskPanel() {
  const state=useStore();const {lang,t,money,percent,num}=useI18n();
  const market=shockResult(state.allocation,shocks[state.shock],state.severity,1);
  const change=((1+market/100)*(1+state.fx/100*state.foreign/100)-1)*100*state.leverage;
  const after=state.budget*(1+change/100);
  const concentration=Math.max(...Object.values(state.allocation));
  const risks=[
    ['Market volatility','نوسان بازار','Prices can move sharply in either direction. A drawdown measures a decline from a previous peak.','قیمت‌ها می‌توانند به‌شدت بالا یا پایین بروند. افت سرمایه، کاهش ارزش نسبت به اوج قبلی است.'],
    ['Liquidity restrictions','محدودیت نقدشوندگی','A quoted price does not mean you can sell immediately. Property, private equity and some funds may lock up your capital.','وجود قیمت به معنای فروش فوری نیست. ملک، سهام خصوصی و بعضی صندوق‌ها ممکن است سرمایه را برای مدتی قفل کنند.'],
    ['Inflation risk','ریسک تورم','Stable nominal money can lose purchasing power. Compare real values in the growth simulator.','پول با ارزش اسمی ثابت ممکن است قدرت خریدش را از دست بدهد. ارزش واقعی را در شبیه‌ساز رشد مقایسه کنید.'],
    ['Concentration risk','ریسک تمرکز','Holding many funds does not guarantee diversification if their underlying investments overlap.','اگر دارایی‌های پایه صندوق‌ها هم‌پوشانی داشته باشند، تعداد زیاد صندوق تنوع واقعی را تضمین نمی‌کند.'],
    ['Credit risk','ریسک اعتباری','An issuer or counterparty may miss payments or default. A high coupon does not remove this risk.','ناشر یا طرف مقابل ممکن است پرداخت نکند یا نکول کند. پرداخت دوره‌ای بالا این ریسک را حذف نمی‌کند.'],
    ['Leverage risk','ریسک اهرم','Borrowing amplifies gains and losses. Losses can exceed your invested equity; margin calls can force sales.','وام سود و زیان را تشدید می‌کند. زیان می‌تواند از سرمایه شما بیشتر شود و اخطار وجه تضمین فروش اجباری ایجاد کند.'],
    ['Currency risk','ریسک ارز','Changes in exchange rates can alter the value of unhedged foreign investments in your home currency.','تغییر نرخ ارز می‌تواند ارزش سرمایه‌گذاری خارجی بدون پوشش ریسک را بر حسب پول داخلی تغییر دهد.'],
    ['Interest-rate risk','ریسک نرخ بهره','Higher market rates generally lower existing fixed-rate bond prices. Sensitivity depends on duration and other terms.','نرخ بازار بالاتر معمولاً قیمت اوراق موجود با نرخ ثابت را پایین می‌آورد. حساسیت به دیرش و سایر شرایط وابسته است.'],
  ];
  return <section className="side-panel risk-panel" aria-label={t('Risk laboratory','آزمایشگاه ریسک')}>
    <SectionTitle eyebrow={t('LOOK BEYOND THE UPSIDE','فراتر از سود احتمالی')} title={t('What if things change?','اگر شرایط تغییر کند؟')} description={t('Stress-test your current virtual allocation.','تخصیص فرضی فعلی‌ات را تحت فشار بگذار.')}/>
    <div className="synthetic-badge"><ShieldAlert size={14}/>{t('SYNTHETIC EDUCATIONAL SCENARIO','سناریوی ساختگی آموزشی')}</div>
    <label className="field"><span>{t('Hypothetical scenario','سناریوی فرضی')}</span><select value={state.shock} onChange={e=>state.set({shock:e.target.value})}><option value="downturn">{t('Broad market downturn','افت گسترده بازار')}</option><option value="rates">{t('Interest rates rise','افزایش نرخ بهره')}</option><option value="liquidity">{t('Liquidity squeeze','کمبود نقدشوندگی')}</option></select></label>
    <div className="result-hero risk-result"><span>{t('ILLUSTRATIVE PORTFOLIO CHANGE','تغییر فرضی سبد')}</span><strong className={change<0?'negative':'positive'}>{percent(change,1)}</strong><small>{money(state.budget)} → {money(after)}</small></div>
    <label className="slider-field"><span>{t('Shock intensity','شدت شوک')}<b>{percent(state.severity*100)}</b></span><input type="range" min={0} max={150} value={Math.round(state.severity*100)} onChange={e=>state.set({severity:Number(e.target.value)/100})}/></label>
    <label className="slider-field"><span>{t('Exposure / invested equity','دارایی / سرمایه شخصی')}<b>{num(state.leverage,1)}×</b></span><input type="range" min={1} max={2} step={.1} value={state.leverage} onChange={e=>state.set({leverage:Number(e.target.value)})}/></label>
    <details><summary>{t('Explore currency risk','بررسی ریسک ارز')}<ChevronDown size={16}/></summary><label className="slider-field"><span>{t('Unhedged foreign share','سهم خارجی بدون پوشش')}<b>{percent(state.foreign)}</b></span><input type="range" min={0} max={100} value={state.foreign} onChange={e=>state.set({foreign:Number(e.target.value)})}/></label><label className="slider-field"><span>{t('Foreign currency movement','تغییر ارزش ارز خارجی')}<b>{percent(state.fx)}</b></span><input type="range" min={-30} max={30} value={state.fx} onChange={e=>state.set({fx:Number(e.target.value)})}/></label></details>
    <div className="shock-table"><div className="table-heading"><span>{t('ASSET SHOCKS','شوک هر دارایی')}</span><small>{t('Before leverage & currency','پیش از اهرم و ارز')}</small></div>{investments.map(a=>{const id=a.id as AssetId;const value=Math.max(-100,shocks[state.shock][id]*state.severity);return <div className="shock-row" key={id}><span>{a.name[lang]}<small>{percent(state.allocation[id])}</small></span><div className="shock-track"><i style={{width:`${Math.min(100,Math.abs(value))}%`,background:value<0?'#ee8293':'#86e2bd'}}/></div><b className={value<0?'negative':'positive'}>{percent(value,1)}</b></div>;})}</div>
    <p className="fineprint">{t('These invented shocks are neither historical data nor forecasts. They are assumptions for teaching. Listed asset classes are simplified proxies; funds may overlap. Borrowing costs, taxes, defaults and forced liquidation are not modeled. Currency movement applies proportionally to the exposed share, then leverage amplifies the result.','این شوک‌های ساختگی، داده تاریخی یا پیش‌بینی نیستند؛ فرض‌های آموزشی‌اند. دسته‌ها نماینده ساده‌شده‌اند و صندوق‌ها ممکن است هم‌پوشانی داشته باشند. هزینه وام، مالیات، نکول و فروش اجباری مدل نشده‌اند. اثر ارز متناسب با سهم خارجی اعمال می‌شود و سپس اهرم نتیجه را تشدید می‌کند.')}</p>
    <div className="concentration"><span>{t('Largest category allocation','بزرگ‌ترین سهم سبد')}</span><strong>{percent(concentration)}</strong></div>
    <p className="fineprint">{scoreNotes[lang]}</p>
    <h3>{t('Eight risks worth understanding','هشت ریسک مهم')}</h3>{risks.map(([en,fa,desc,faDesc])=><details key={en}><summary>{t(en,fa)}<ChevronDown size={15}/></summary><p>{t(desc,faDesc)}</p></details>)}
  </section>;
}
