import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/useI18n';
import { Modal } from './Shared';

export default function Settings() {
  const state=useStore();const {t}=useI18n();
  return <Modal title={t('Make yourself at home.','اینجا را مطابق سلیقه‌ات تنظیم کن.')} onClose={()=>state.set({settings:false})}>
    <label className="field"><span>{t('Language','زبان')}</span><select value={state.lang} onChange={e=>state.set({lang:e.target.value as 'en'|'fa'})}><option value="en">English</option><option value="fa">فارسی</option></select></label>
    <label className="field"><span>{t('Graphics quality','کیفیت گرافیک')}</span><select value={state.quality} onChange={e=>state.set({quality:e.target.value as 'auto'|'high'|'low'})}><option value="auto">{t('Adaptive','خودکار')}</option><option value="high">{t('High · shadows & reflections','بالا · سایه و بازتاب')}</option><option value="low">{t('Light · for mobile devices','سبک · برای دستگاه‌های همراه')}</option></select></label>
    <label className="field"><span>{t('Simulation currency','واحد پول شبیه‌سازی')}</span><select value={state.currency} onChange={e=>state.set({currency:e.target.value as 'USD'|'EUR'|'IRR'})}><option value="USD">USD · {t('US dollar','دلار آمریکا')}</option><option value="EUR">EUR · {t('Euro','یورو')}</option><option value="IRR">IRR · {t('Iranian rial','ریال ایران')}</option></select><small>{t('Changes the unit label only. Amounts are not converted using exchange rates.','فقط واحد نمایش را تغییر می‌دهد. مبلغ‌ها با نرخ ارز تبدیل نمی‌شوند.')}</small></label>
    <label className="toggle-row"><span>{t('Reduced motion','کاهش حرکت')}<small>{t('Instant camera transitions and still capital paths','جابجایی فوری دوربین و مسیرهای ثابت سرمایه')}</small></span><input type="checkbox" role="switch" checked={state.reduced} onChange={e=>state.set({reduced:e.target.checked})}/></label>
    <label className="toggle-row"><span>{t('Interface sounds','صدای رابط کاربری')}<small>{t('Subtle tones when selecting a district','صدای کوتاه هنگام انتخاب منطقه')}</small></span><input type="checkbox" role="switch" checked={state.sound} onChange={e=>state.set({sound:e.target.checked})}/></label>
    <div className="settings-note"><p>{t('Settings, bookmarks and your virtual allocation stay in this browser. No account, tracking or live market connection. Enter only fictional budgets.','تنظیمات، نشان‌ها و تخصیص فرضی در همین مرورگر ذخیره می‌شوند. بدون حساب کاربری، رهگیری یا اتصال زنده به بازار. فقط بودجه فرضی وارد کنید.')}</p><button className="secondary-button" onClick={()=>{state.reset();state.set({settings:false});}}>{t('Reset all simulations','بازنشانی همه شبیه‌سازی‌ها')}</button></div>
  </Modal>;
}
