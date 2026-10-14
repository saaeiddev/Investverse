import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { assetIds } from '../src/utils/finance';
import { investments, glossary, sources, categoryScoreNotes } from '../src/data/investments';
import { makeDistrict, makeMetropolis, disposeModel } from '../src/scenes/districts/models';

describe('Complete bilingual educational content',()=>{
  it('has all ten categories, localized required fields, and valid source IDs',()=>{
    expect(investments.map(a=>a.id)).toEqual([...assetIds]);
    const ids=new Set(sources.map(s=>s.id));
    for(const a of investments){
      for(const value of [a.name,a.tagline,a.description,a.goals,a.liquidity,a.horizon,a.entry,a.income,a.costs,a.examples,a.beginner,...a.benefits,...a.risks,categoryScoreNotes[a.id]]){
        expect(value.en.length).toBeGreaterThan(2);expect(value.fa).toMatch(/[\u0600-\u06ff]/);
      }
      expect(a.sourceIds.length).toBeGreaterThan(0);a.sourceIds.forEach(id=>expect(ids.has(id)).toBe(true));
      for(const score of [a.risk,a.liquid,a.complexity])expect(score>=1&&score<=5).toBe(true);
    }
  });
  it('has a bilingual searchable glossary and secure official source links',()=>{
    expect(glossary.length).toBeGreaterThanOrEqual(20);
    glossary.forEach(g=>{expect(g.term.fa).toBeTruthy();expect(g.definition.fa).toBeTruthy();});
    sources.forEach(s=>expect(new URL(s.url).protocol).toBe('https:'));
  });
});

describe('Procedural geometry integrity and raycasting',()=>{
  it('generates all ten distinct, detailed, finite district models',()=>{
    const counts=new Set<number>();
    for(const a of investments){
      const model=makeDistrict(a.id,a.color);model.updateMatrixWorld(true);
      let vertices=0;
      model.traverse(o=>{if(o instanceof THREE.Mesh){
        const p=o.geometry.getAttribute('position');vertices+=p.count;
        for(let i=0;i<p.array.length;i++)expect(Number.isFinite(p.array[i])).toBe(true);
        o.geometry.computeBoundingSphere();expect(o.geometry.boundingSphere!.radius).toBeGreaterThan(0);
      }});
      expect(model.children.length).toBeGreaterThan(4);expect(model.children.length).toBeLessThanOrEqual(8);
      expect(vertices).toBeGreaterThan(0);counts.add(vertices);
      const bounds=new THREE.Box3().setFromObject(model);expect(bounds.min.y).toBeGreaterThan(-1);expect(bounds.max.y).toBeLessThan(7);
      const origin=new THREE.Vector3(0,8,0);const ray=new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0));
      expect(ray.intersectObject(model,true).length).toBeGreaterThan(0);
      disposeModel(model);
    }
    expect(counts.size).toBe(10);
  });
  it('merges the metropolis into at most eight material meshes',()=>{
    const city=makeMetropolis();expect(city.children.length).toBeLessThanOrEqual(8);
    city.updateMatrixWorld(true);const size=new THREE.Box3().setFromObject(city).getSize(new THREE.Vector3());
    expect(size.x).toBeGreaterThan(30);expect(size.y).toBeGreaterThan(9);disposeModel(city);
  });
});
