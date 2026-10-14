import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Original architectural models. Geometry is merged by material, including windows,
 * mullions, terraces and roof equipment; no external model or texture requests. */
class Architecture {
  bins = new Map<string, THREE.BufferGeometry[]>();
  materials: Record<string, THREE.MeshStandardMaterial>;
  constructor(accent: string) {
    this.materials = {
      stone: new THREE.MeshStandardMaterial({ color: '#c0c7cb', roughness: .64, metalness: .25 }),
      dark: new THREE.MeshStandardMaterial({ color: '#222d3b', roughness: .45, metalness: .7 }),
      edge: new THREE.MeshStandardMaterial({ color: '#6e8391', roughness: .28, metalness: .85 }),
      glass: new THREE.MeshStandardMaterial({ color: '#365766', roughness: .18, metalness: .72 }),
      light: new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: .75, roughness: .3, metalness: .4 }),
      warm: new THREE.MeshStandardMaterial({ color: '#f6d394', emissive: '#f6ce85', emissiveIntensity: .5, roughness: .3 }),
      gold: new THREE.MeshStandardMaterial({ color: '#f3b954', metalness: .97, roughness: .21 }),
      green: new THREE.MeshStandardMaterial({ color: '#365f53', roughness: .8 }),
    };
  }
  add(g: THREE.BufferGeometry, p: number[], mat = 'dark', rot?: number[]) {
    // Polyhedra are non-indexed; normalize them before merging with indexed architecture.
    if (!g.index) g.setIndex(Array.from({length:g.getAttribute('position').count},(_,i)=>i));
    const m = new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...(rot || [0,0,0]) as [number,number,number])), new THREE.Vector3(1,1,1));
    g.applyMatrix4(m); const list = this.bins.get(mat) || []; list.push(g); this.bins.set(mat,list);
  }
  box(x:number,y:number,z:number,w:number,h:number,d:number,mat='dark',ry=0) { this.add(new THREE.BoxGeometry(w,h,d),[x,y,z],mat,[0,ry,0]); }
  cyl(x:number,y:number,z:number,r:number,h:number,mat='dark',sides=24,rt=r) { this.add(new THREE.CylinderGeometry(rt,r,h,sides),[x,y,z],mat); }
  torus(x:number,y:number,z:number,r:number,tube:number,mat='edge',rotation:[number,number,number]=[Math.PI/2,0,0]) { this.add(new THREE.TorusGeometry(r,tube,6,40),[x,y,z],mat,rotation); }
  beam(a:number[], b:number[], radius=.025,mat='light') {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b); const dir = end.clone().sub(start);
    const g = new THREE.CylinderGeometry(radius,radius,dir.length(),5);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()));
    this.add(g,start.add(end).multiplyScalar(.5).toArray(),mat);
  }
  tower(x:number,z:number,w:number,d:number,h:number,style=0) {
    this.box(x,.23,z,w+.2,.25,d+.2,'stone');
    this.box(x,h/2+.3,z,w,h,d,'glass');
    // Structural corner columns and floor plates.
    for (const sx of [-1,1]) for (const sz of [-1,1]) this.box(x+sx*w*.48,h/2+.3,z+sz*d*.48,.055,h+.1,.055,'edge');
    const floors = Math.floor(h/.28);
    for(let f=0;f<=floors;f++) {
      const y=.35+f*.28;
      this.box(x,y,z,w+.06,.035,d+.06,style===1 && f%3===0?'stone':'edge');
      for(let c=0;c<Math.floor(w/.19);c++) {
        if ((f*7+c*3+style)%6===0) continue;
        for(const side of [-1,1]) this.box(x-w/2+.11+c*.19,y+.12,z+side*(d/2+.008),.11,.14,.008,(f+c+style)%5===0?'warm':'light');
      }
      for(let c=0;c<Math.floor(d/.22);c++) {
        if((f+c*3)%4===0) continue;
        for(const side of [-1,1]) this.box(x+side*(w/2+.01),y+.12,z-d/2+.13+c*.22,.008,.13,.12,(f+c)%6===0?'warm':'glass');
      }
    }
    this.box(x,h+.36,z,w+.12,.1,d+.12,'stone');
    this.box(x+.1,h+.53,z,w*.4,.25,d*.4,'dark');
    this.box(x-.15,h+.67,z,.05,.55,.05,'edge');
  }
  tree(x:number,z:number) {
    this.cyl(x,.3,z,.03,.45,'edge',5); this.cyl(x,.62,z,.22,.45,'green',6,.07);
    this.box(x,.1,z,.45,.1,.45,'stone');
  }
  finish() {
    const group = new THREE.Group();
    this.bins.forEach((geos, key) => {
      const merged = mergeGeometries(geos); geos.forEach(g=>g.dispose());
      if (!merged) return;
      const mesh = new THREE.Mesh(merged,this.materials[key]); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh);
    });
    Object.entries(this.materials).forEach(([key,material])=>{if(!this.bins.has(key))material.dispose();});
    return group;
  }
}

export function makeDistrict(id:string, color:string) {
  const b = new Architecture(color);
  b.box(0,-.1,0,4,.2,3.5,'dark');
  b.box(0,.012,0,4.03,.025,3.53,'edge');
  b.box(0,.035,-1.73,4,.04,.025,'light'); b.box(0,.035,1.73,4,.04,.025,'light');
  if(id==='stocks') {
    b.tower(-.65,-.2,1.1,1.15,4.6); b.tower(.6,-.5,.85,.9,3.4); b.tower(.8,.65,.7,.75,2.2);
    b.box(-.75,2.4,.39,1.2,.75,.05,'dark');
    const ys=[2.2,2.37,2.3,2.5,2.43,2.62];
    ys.slice(1).forEach((y,i)=>b.beam([i*.2-1.25,ys[i],.43],[(i+1)*.2-1.25,y,.43],.021));
    for(let i=0;i<6;i++) b.box(-1.45+i*.35,.15,1.2,.18,.2,.18,'edge');
    b.beam([-1.3,.1,1.15],[1.3,.1,1.15],.018,'warm');
  } else if(id==='property') {
    b.tower(-.9,-.5,1.1,.9,1.9,1); b.tower(.5,-.6,1.2,1.0,2.8,1);
    for(let i=0;i<3;i++) {
      b.box(-1.15+i*.9,.45,.9,.72,.7,.8,'stone');
      b.add(new THREE.ConeGeometry(.57,.42,4),[-1.15+i*.9,.98,.9],'dark',[0,Math.PI/4,0]);
      b.box(-1.15+i*.9,.5,1.305,.36,.35,.01,'warm');
    }
    b.cyl(1.45,1.6,.25,.045,3.1,'gold',6);
    b.beam([.3,3.1,.25],[1.8,3.1,.25],.045,'gold');
    b.beam([1.4,3.6,.25],[.4,3.1,.25],.015,'gold'); b.beam([.4,3.1,.25],[.4,2.3,.25],.01,'edge');
    b.tree(-1.7,.2); b.tree(1.5,1.25);
  } else if(id==='gold') {
    b.box(0,.28,0,3.4,.5,2.8,'stone'); b.box(0,1.3,-.9,3.2,2,0.6,'dark');
    b.box(-1.45,1.3,0,.3,2,2,'edge'); b.box(1.45,1.3,0,.3,2,2,'edge'); b.box(0,2.32,0,3.3,.18,2.65,'dark');
    for(const side of [-1,1])for(let k=0;k<6;k++){
      b.box(side*1.3,.65+k*.27,-.2,.06,.035,1.7,'gold');
      b.add(new THREE.CylinderGeometry(.045,.045,.04,8),[side*1.46,.55+k*.3,1.02],'gold',[Math.PI/2,0,0]);
    }
    b.box(0,.52,.1,2.5,.06,1.65,'edge');
    for(let row=0;row<3;row++) for(let col=0;col<4-row;col++) {
      b.box(col*.53-(3-row)*.265,.65+row*.24,.2,.47,.22,.78,'gold');
      b.box(col*.53-(3-row)*.265,.763+row*.24,.2,.27,.008,.22,'warm');
    }
    // The articulated vault door is rendered by DistrictAnimation.
  } else if(id==='crypto') {
    b.cyl(0,.18,0,1.6,.3,'dark',6); b.torus(0,.36,0,1.35,.025,'light');
    const nodes=[[0,2.6,0],[-1.1,1.2,-.8],[1.1,1.2,-.8],[1.1,1.2,.8],[-1.1,1.2,.8],[0,.8,0]];
    nodes.forEach((p,i)=>{
      b.add(new THREE.IcosahedronGeometry(i===0?.62:.3,0),p,i===0?'edge':'glass');
      b.cyl(p[0],.45,p[2],.25,.15,'edge',6);
      if(i>0)b.beam(nodes[0],p,.02,'light');
      if(i>1)b.beam(nodes[i-1],p,.015,'warm');
    });
    for(let i=0;i<4;i++) {b.box(-1.5+i,.75,-1.4,.4,1.2,.35,'dark'); for(let k=0;k<6;k++) b.box(-1.5+i,.28+k*.16,-1.21,.25,.025,.01,'light');}
  } else if(id==='bonds') {
    b.box(0,.25,0,3.3,.4,2.7,'stone');
    b.box(0,1.55,-.7,2.7,2.3,.7,'stone'); b.box(0,1.6,-.33,2.25,1.7,.04,'dark');
    for(let i=0;i<5;i++) b.box(-.65+i*.32,1.1+i*.17,-.29,.18,.4+i*.3,.04,'light');
    for(let i=0;i<4;i++) {b.cyl(-1.1+i*.72,.95,.7,.1,1.1,'edge',12);b.torus(-1.1+i*.72,1.52,.7,.14,.022,'gold');}
    b.box(0,1.6,.7,3,.18,.55,'stone');
    for(let i=0;i<6;i++) b.box(-1.25+i*.5,.48,1.2,.25,.04,.3,'gold');
  } else if(id==='etfs') {
    b.cyl(0,.3,0,1.6,.5,'edge',12); b.torus(0,.6,0,1.45,.06,'light');
    for(let i=0;i<6;i++) {
      const a=i*Math.PI/3; const x=Math.cos(a), z=Math.sin(a);
      b.tower(x,z,.5,.5,.7+(i%3)*.5,i%2);
      b.beam([x,2.6,z],[x,.6,z],.018,'edge');
    }
    b.torus(0,2.6,0,1.02,.045,'gold');
    b.cyl(0,1.25,0,.3,1.2,'dark',8);b.cyl(0,1.9,0,.35,.1,'light',8);
  } else if(id==='savings') {
    for(let i=0;i<3;i++)b.box(0,.12+i*.13,0,3.6-i*.25,.13,2.8-i*.2,'stone');
    b.box(0,1.35,-.6,2.9,1.9,1.2,'dark');
    for(let i=0;i<5;i++) {b.cyl(-1.2+i*.6,1.25,.65,.12,1.65,'stone',12);b.cyl(-1.2+i*.6,.48,.65,.18,.13,'edge',12);b.cyl(-1.2+i*.6,2.1,.65,.18,.13,'edge',12);}
    b.box(0,2.25,0,3.4,.2,2.4,'stone'); b.add(new THREE.CylinderGeometry(0,1.85,.65,3),[0,2.68,.1],'stone',[0,0,Math.PI/2]);
    b.torus(0,1.35,.04,.4,.055,'gold',[0,0,0]);
    b.box(0,1.35,.1,.06,.55,.04,'gold');
    b.tree(-1.6,1.3);b.tree(1.6,1.3);
  } else if(id==='startups') {
    b.box(0,.2,0,3.5,.35,2.8,'stone');
    b.tower(-1,-.35,.8,.9,1.1,1);b.tower(0,-.35,.8,.9,1.8,1);b.tower(1,-.35,.8,.9,2.7,1);
    for(let i=0;i<3;i++){b.cyl(-1+i,.6,1.0,.3,.55,'dark',6);b.cyl(-1+i,.92,1,.32,.04,'light',6);}
    b.beam([-1,1.1,1],[0,1.6,1],.03,'gold');b.beam([0,1.6,1],[1,2.2,1],.03,'gold');
    b.add(new THREE.ConeGeometry(.14,.4,8),[1.1,2.35,1],'gold',[0,0,-.7]);
  } else if(id==='funds') {
    b.cyl(0,.25,0,1.6,.4,'dark',8);b.cyl(0,1.2,0,.65,1.8,'glass',12);b.cyl(0,2.15,0,.8,.16,'edge',12);
    for(let i=0;i<6;i++) {
      const a=i*Math.PI/3, x=Math.cos(a)*1.3,z=Math.sin(a)*1.3;
      b.box(x,.65,z,.5,1,.5,'stone',a);b.beam([0,1.8,0],[x,1.2,z],.025,'light');
      for(let j=0;j<4;j++)b.box(x,.35+j*.19,z+.27,.32,.035,.03,'warm',a);
    }
    b.torus(0,1.2,0,.67,.025,'light');b.torus(0,1.8,0,.67,.025,'light');
  } else {
    b.tower(-.9,-.6,1,1,2.8,1);b.tower(.65,-.5,1.1,.9,1.9);
    b.box(0,.5,.9,2.9,.8,.9,'stone'); b.box(0,.94,.9,3.1,.12,1,'dark');
    for(let i=0;i<6;i++) b.box(-1.2+i*.48,.48,1.36,.32,.55,.02,'glass');
    b.beam([-1,.1,1.55],[1.3,.1,1.55],.025,'gold'); b.tree(1.6,-1.2);
  }
  // Ground-level details give all districts a consistent architectural scale.
  for (const x of [-1.85,1.85]) { b.cyl(x,.42,1.5,.018,.75,'edge',5); b.box(x,.82,1.5,.12,.035,.12,'warm'); }
  return b.finish();
}

export function makeMetropolis() {
  const b = new Architecture('#6fd0cc');
  b.cyl(0,-.7,0,15.8,.65,'dark',12); b.cyl(0,-.32,0,15.65,.12,'edge',12); b.cyl(0,-.2,0,15.45,.12,'dark',12);
  b.torus(0,-.48,0,15.35,.035,'light'); b.torus(0,-.88,0,14.9,.04,'warm');
  b.cyl(0,-1.6,0,9,1.2,'dark',12,13.5); b.cyl(0,-2.35,0,8,.3,'edge',12);
  b.cyl(0,-2.65,0,5.5,.25,'dark',12); b.torus(0,-2.8,0,5,.045,'light');
  for(let i=-14;i<=14;i++) {const len=Math.sqrt(Math.max(0,14.8**2-i**2))*2; b.box(i,-.12,0,.012,.008,len,'edge');b.box(0,-.12,i,len,.008,.012,'edge');}
  b.cyl(0,.08,0,3.9,.35,'stone',8);b.cyl(0,.29,0,3.5,.08,'edge',8);
  b.tower(-.7,-.5,1.35,1.3,6.4); b.tower(.8,.1,1,1.05,4.9);b.tower(-1.2,1,1.05,.9,3.1);
  b.tower(1.3,-1.5,.8,.9,3.2);b.tower(-2,-1.4,.7,.75,2.5);b.tower(.4,1.7,.7,.7,2.2);
  b.beam([-.7,6.9,-.5],[-.7,8,-.5],.035,'gold');
  b.box(-.7,5.8,-.5,1.45,.09,1.4,'gold');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;b.tree(Math.cos(a)*3.05,Math.sin(a)*3.05);}
  for(let i=0;i<10;i++){
    const a=-Math.PI/2+i*Math.PI/5;
    const x=Math.cos(a)*10.7,z=Math.sin(a)*10.7;
    b.beam([Math.cos(a)*3.7,-.02,Math.sin(a)*3.7],[x,-.02,z],.024,'warm');
    b.beam([Math.cos(a+.025)*3.7,-.02,Math.sin(a+.025)*3.7],[x+Math.sin(a)*.2,-.02,z-Math.cos(a)*.2],.016,'light');
  }
  b.torus(0,-.02,0,6.4,.02,'edge');b.torus(0,-.02,0,13.6,.018,'light');
  return b.finish();
}

export function disposeModel(group: THREE.Group) {
  const materials = new Set<THREE.Material>();
  group.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose(); (Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));}});
  materials.forEach(m=>m.dispose());
}
