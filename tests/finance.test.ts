import { describe, expect, it } from 'vitest';
import { assetIds, calculateGrowth, defaultGrowth, presets, rebalance, shocks, shockResult, validAllocation } from '../src/utils/finance';

describe('Compound growth: independently derived financial identities',()=>{
  it('zero return and no fee exactly equals contributions',()=>{
    const r=calculateGrowth({...defaultGrowth,initial:1000,monthly:100,years:2,annual:0,fee:0,inflation:0});
    expect(r.value).toBe(3400);expect(r.growth).toBe(0);expect(r.real).toBe(3400);
  });
  it('uses an effective annual return, not annual / 12',()=>{
    expect(calculateGrowth({...defaultGrowth,initial:1000,monthly:0,years:1,annual:12,fee:0}).value).toBeCloseTo(1120,8);
  });
  it('matches the closed form for an annuity due at month end',()=>{
    const input={...defaultGrowth,initial:12000,monthly:350,years:17,annual:7.5,fee:0};
    const q=1.075**(1/12);const n=17*12;
    const expected=12000*q**n+350*(q**n-1)/(q-1);
    expect(calculateGrowth(input).value).toBeCloseTo(expected,6);
  });
  it('supports negative rates without NaN or a false gain',()=>{
    const r=calculateGrowth({...defaultGrowth,initial:1000,monthly:0,years:2,annual:-20,fee:0,inflation:0});
    expect(r.value).toBeCloseTo(640,8);expect(r.growth).toBeCloseTo(-360,8);
  });
  it('deducts proportional fees and discounts purchasing power',()=>{
    const r=calculateGrowth({...defaultGrowth,initial:1000,monthly:0,years:2,annual:10,fee:1,inflation:5});
    expect(r.value).toBeCloseTo(1000*(1.1*.99)**2,8);
    expect(r.real).toBeCloseTo(r.value/1.05**2,8);
    expect(r.netAnnual).toBeCloseTo(8.9,10);
  });
  it('returns exact year-end contributions and includes year zero',()=>{
    const r=calculateGrowth(defaultGrowth);expect(r.points).toHaveLength(21);
    expect(r.points[0]).toEqual({year:0,value:10000,contributions:10000,real:10000});
    expect(r.points[3].contributions).toBe(17200);expect(r.contributions).toBe(58000);
  });
  it('supports boundary assumptions without division by zero',()=>{
    for(const annual of [-99,0,100]){
      const r=calculateGrowth({...defaultGrowth,annual,years:60});
      expect(Number.isFinite(r.value)).toBe(true);expect(r.value).toBeGreaterThanOrEqual(0);
    }
  });
  it.each([{annual:-100},{annual:NaN},{fee:100},{fee:-1},{inflation:-100},{initial:-1},{monthly:-1},{years:0},{years:61},{years:1.5}])('rejects invalid inputs %o',patch=>{
    expect(()=>calculateGrowth({...defaultGrowth,...patch})).toThrow(RangeError);
  });
});

describe('Allocation invariants and corner cases',()=>{
  it('every preset is nonnegative and totals exactly 100',()=>{Object.values(presets).forEach(p=>expect(validAllocation(p)).toBe(true));});
  it('preserves the invariant for every category at every integer percentage',()=>{
    let allocation={...presets.balanced};
    for(const id of assetIds)for(let value=0;value<=100;value++){
      allocation=rebalance(allocation,id,value);expect(allocation[id]).toBe(value);expect(validAllocation(allocation)).toBe(true);
    }
  });
  it('handles a 100% position followed by a reduced position',()=>{
    const all=rebalance(presets.balanced,'gold',100);expect(all.gold).toBe(100);
    const next=rebalance(all,'gold',10);expect(next.gold).toBe(10);expect(validAllocation(next)).toBe(true);
    expect(assetIds.filter(id=>id!=='gold').every(id=>next[id]===10)).toBe(true);
  });
  it('uses proportional allocations and largest remainder rounding',()=>{
    const next=rebalance(presets.balanced,'stocks',40);
    expect(next.etfs).toBe(19);expect(next.bonds).toBe(15);expect(next.gold).toBe(8);expect(next.savings).toBe(7);expect(validAllocation(next)).toBe(true);
  });
  it('clamps user input and does not mutate previous state',()=>{
    const original={...presets.balanced};expect(rebalance(original,'gold',900).gold).toBe(100);
    expect(rebalance(original,'gold',-30).gold).toBe(0);expect(rebalance(original,'gold',NaN).gold).toBe(10);
    expect(original).toEqual(presets.balanced);
  });
  it.each([null,{},[],{...presets.balanced,gold:NaN},{...presets.balanced,gold:5},{...presets.balanced,gold:-1}])('rejects corrupt saved allocations %o',v=>expect(validAllocation(v)).toBe(false));
});

describe('Synthetic risk math',()=>{
  it('weights asset shocks by the current portfolio',()=>{
    expect(shockResult(rebalance(presets.balanced,'stocks',100),shocks.downturn)).toBe(-35);
    expect(shockResult(rebalance(presets.balanced,'gold',100),shocks.downturn)).toBe(5);
    expect(shockResult(presets.balanced,shocks.downturn,0)).toBe(0);
  });
  it('can show equity losses greater than initial capital under leverage',()=>{
    const allocation=rebalance(presets.balanced,'startups',100);
    expect(shockResult(allocation,shocks.downturn,1.5,2)).toBe(-180);
  });
  it('rejects invalid shock controls',()=>expect(()=>shockResult(presets.balanced,shocks.downturn,2)).toThrow(RangeError));
});
