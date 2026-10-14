import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';

export function SectionTitle({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}) {
  return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>;
}
export function Meter({label,value,color='#e3b373'}:{label:string;value:number;color?:string}) {
  const {num}=useI18n();return <div className="meter"><div><span>{label}</span><b>{num(value)}<small>/ {num(5)}</small></b></div><div role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={1} aria-valuemax={5}>{[1,2,3,4,5].map(n=><i key={n} style={{background:n<=value?color:undefined}}/>)}</div></div>;
}
export function Field({label,value,onChange,min,max,step=1,suffix='',help}:{label:string;value:number;onChange:(n:number)=>void;min:number;max:number;step?:number;suffix?:string;help?:string}) {
  return <label className="field"><span>{label}<small>{suffix}</small></span><input type="number" value={value} min={min} max={max} step={step} onChange={e=>{if(e.target.value==='')return;const n=Number(e.target.value);if(Number.isFinite(n))onChange(Math.max(min,Math.min(max,n)));}} />{help&&<small>{help}</small>}</label>;
}
export function Modal({children,title,onClose}:{children:ReactNode;title:string;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);const {t}=useI18n();
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
  return <dialog className="modal" ref={ref} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}} aria-label={title}><div className="modal-inner"><div className="modal-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label={t('Close','بستن')}><X size={19}/></button></div>{children}</div></dialog>;
}
export function ExternalLink({url,children}:{url:string;children:ReactNode}) {
  return <a href={url} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={13}/></a>;
}
