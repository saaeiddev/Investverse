import { beforeAll, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { investments } from '../src/data/investments';
import type { AssetId } from '../src/utils/finance';

const saved=new Map<string,string>();
vi.stubGlobal('localStorage',{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v),removeItem:(k:string)=>saved.delete(k)});
// SSR intentionally reads Zustand's initial snapshot. Inject the current snapshot
// for these content-render tests; browser subscription behavior is a separate check.
vi.mock('../src/store/useStore',async importOriginal=>{
  const actual=await importOriginal<typeof import('../src/store/useStore')>();
  const bound=actual.useStore;
  return {...actual,useStore:Object.assign((selector?:(s:ReturnType<typeof bound.getState>)=>unknown)=>selector?selector(bound.getState()):bound.getState(),bound)};
});
const {useStore}=await import('../src/store/useStore');
const {default:InfoPanel}=await import('../src/components/ui/InfoPanel');
const {default:PortfolioPanel}=await import('../src/components/ui/PortfolioPanel');
const {default:GrowthPanel}=await import('../src/components/ui/GrowthPanel');
const {default:RiskPanel}=await import('../src/components/ui/RiskPanel');
const {default:LearnView}=await import('../src/components/ui/LearnView');

describe('Bilingual interface integration and persisted settings',()=>{
  beforeAll(()=>useStore.getState().reset());
  it('renders every district and its educational content in both languages',()=>{
    for(const lang of ['en','fa'] as const)for(const asset of investments){
      useStore.setState({lang,selected:asset.id as AssetId});
      const html=renderToStaticMarkup(<InfoPanel/>);
      expect(html).toContain(asset.name[lang]);expect(html).toContain(asset.benefits[0][lang]);
      expect(html).not.toContain('undefined');expect(html).not.toContain('NaN');
    }
  });
  it('renders working financial outputs and glossary in both languages',()=>{
    for(const lang of ['en','fa'] as const){
      useStore.setState({lang});
      for(const component of [<PortfolioPanel/>,<GrowthPanel/>,<RiskPanel/>,<LearnView/>]){
        const html=renderToStaticMarkup(component);expect(html.length).toBeGreaterThan(2000);expect(html).not.toContain('NaN');expect(html).not.toContain('undefined');
      }
    }
  });
  it('persists bookmarks, language, currency and exact allocation, without financial budgets',async()=>{
    const s=useStore.getState();s.set({lang:'fa',currency:'IRR'});s.bookmark('gold');s.allocate('gold',31);
    const raw=JSON.parse(saved.get('investverse-v1')!);expect(raw.state.lang).toBe('fa');expect(raw.state.currency).toBe('IRR');expect(raw.state.allocation.gold).toBe(31);
    expect(raw.state.bookmarks).toContain('gold');expect(raw.state.budget).toBeUndefined();expect(raw.state.growth).toBeUndefined();
    await useStore.persist.rehydrate();expect(useStore.getState().allocation.gold).toBe(31);
  });
  it('recovers safe defaults from invalid persisted data',async()=>{
    saved.set('investverse-v1',JSON.stringify({version:1,state:{lang:'bad',allocation:{gold:1000},bookmarks:['gold','missing'],currency:'bad',quality:'ultra'}}));
    await useStore.persist.rehydrate();const s=useStore.getState();
    expect(s.lang).toBe('en');expect(s.currency).toBe('USD');expect(s.quality).toBe('auto');expect(s.bookmarks).toEqual(['gold']);expect(Object.values(s.allocation).reduce((a,b)=>a+b,0)).toBe(100);
  });
});
