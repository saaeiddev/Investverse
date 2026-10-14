import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, AdaptiveDpr } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { investments } from '../data/investments';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n/useI18n';
import { makeDistrict, makeMetropolis, disposeModel } from './districts/models';
import { calculateGrowth, shocks } from '../utils/finance';
import type { AssetId } from '../utils/finance';
import DistrictIcon from '../components/ui/DistrictIcon';

export const positions = investments.map((_,i) => new THREE.Vector3(Math.cos(-Math.PI/2+i*Math.PI/5)*10.7,0,Math.sin(-Math.PI/2+i*Math.PI/5)*10.7));

function Reflections() {
  const { gl, scene } = useThree();
  useEffect(()=>{
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment(); const target = generator.fromScene(room,.04);
    scene.environment = target.texture;
    scene.environmentIntensity = .75;
    return ()=> { scene.environment=null;target.dispose();room.dispose();generator.dispose(); };
  },[gl,scene]);
  return null;
}

function Architecture() {
  const city = useMemo(()=>makeMetropolis(),[]);
  useEffect(()=>()=>disposeModel(city),[city]);
  return <primitive object={city} />;
}

function District({ index }: { index: number }) {
  const asset = investments[index]; const id = asset.id as AssetId;
  const model = useMemo(()=>makeDistrict(id,asset.color),[id,asset.color]);
  const group = useRef<THREE.Group>(null); const halo = useRef<THREE.Mesh>(null);
  const [hovered, hover] = useState(false);
  const selected = useStore(s=>s.selected === id); const hasSelection = useStore(s=>s.selected !== null);
  const lang = useStore(s=>s.lang); const mode = useStore(s=>s.mode);
  const amount = useStore(s=>s.allocation[id]);
  const shock=useStore(s=>s.shock);const severity=useStore(s=>s.severity);
  const select = useStore(s=>s.select); const reduced = useStore(s=>s.reduced);
  useEffect(()=>()=>disposeModel(model),[model]);
  useFrame((_,delta)=>{
    if(!group.current) return;
    const target=mode==='portfolio' ? .62+Math.sqrt(amount/100)*1.5 : mode==='risk' ? Math.max(.5,1+shocks[shock][id]*severity/200) : 1;
    const v=reduced?target:THREE.MathUtils.damp(group.current.scale.x,target,5,delta);
    group.current.scale.setScalar(v);
    if(halo.current) (halo.current.material as THREE.MeshBasicMaterial).opacity = selected?.85:hovered?.6:.15;
  });
  return <group position={positions[index]}>
    <group ref={group}>
      <primitive object={model}
        onPointerOver={(e: {stopPropagation:()=>void})=>{e.stopPropagation();hover(true);document.body.style.cursor='pointer';}}
        onPointerOut={()=>{hover(false);document.body.style.cursor='';}}
        onClick={(e: {stopPropagation:()=>void;delta:number})=>{if(e.delta>5)return;e.stopPropagation();select(id);}} />
      <DistrictAnimation id={id} color={asset.color}/>
      <mesh ref={halo} rotation={[-Math.PI/2,0,0]} position={[0,.045,0]}>
        <ringGeometry args={[2.3,2.34,6]} /><meshBasicMaterial color={asset.color} transparent opacity={.15} depthWrite={false} />
      </mesh>
    </group>
    {(!hasSelection || selected) && <Html position={[0,-.05,2.15]} center distanceFactor={36} zIndexRange={[3,0]} style={{pointerEvents:'none'}}>
      <button className={`map-label ${selected?'is-selected':''}`} style={{'--district':asset.color,pointerEvents:'auto'} as React.CSSProperties} onClick={()=>select(id)} aria-pressed={selected}>
        <span>{asset.code}</span>{asset.name[lang]}{mode==='portfolio'&&<b>{new Intl.NumberFormat(lang==='fa'?'fa-IR':'en-US').format(amount)}%</b>}
      </button>
    </Html>}
  </group>;
}

function CapitalFlow() {
  const dots = useRef<THREE.InstancedMesh>(null);
  const temp = useMemo(()=>new THREE.Object3D(),[]);
  const reduced = useStore(s=>s.reduced);
  useFrame(({clock})=>{
    if(!dots.current)return;
    for(let i=0;i<40;i++) {
      const a=-Math.PI/2+(i%10)*Math.PI/5;
      const f=reduced?(i%4)/4:((clock.elapsedTime*.13+Math.floor(i/10)/4)%1);
      temp.position.set(Math.cos(a)*(3.7+f*7),.055,Math.sin(a)*(3.7+f*7));
      temp.scale.setScalar(.7+.5*Math.sin(f*Math.PI));temp.updateMatrix();dots.current.setMatrixAt(i,temp.matrix);
    }
    dots.current.instanceMatrix.needsUpdate=true;
  });
  return <instancedMesh ref={dots} args={[undefined,undefined,40]} frustumCulled={false}>
    <sphereGeometry args={[.045,5,4]} /><meshBasicMaterial color="#ffe0a7" />
  </instancedMesh>;
}

function GrowthSculpture() {
  const mode=useStore(s=>s.mode); const input=useStore(s=>s.growth);const reduced=useStore(s=>s.reduced);
  const ref=useRef<THREE.Group>(null);
  const factors=useMemo(()=>{
    const points=calculateGrowth(input).points;
    const count=Math.min(12,input.years);
    const values=Array.from({length:count},(_,i)=>points[Math.round((i+1)/count*(points.length-1))].value);
    const max=Math.max(1,...values);return values.map(v=>Math.max(.03,v/max*6));
  },[input]);
  useFrame((_,delta)=>{ref.current?.children.forEach((c,i)=>{c.scale.y=reduced?factors[i]:THREE.MathUtils.damp(c.scale.y,factors[i],3,delta);c.position.y=c.scale.y/2;});});
  if(mode!=='growth') return null;
  return <group ref={ref} position={[-5,.3,6]}>
    {factors.map((_,i)=><mesh key={i} position={[i*.62,.5,0]}><boxGeometry args={[.4,1,.4]} /><meshStandardMaterial color="#e6b56d" metalness={.8} roughness={.3} emissive="#ba7f35" emissiveIntensity={.18} /></mesh>)}
  </group>;
}

function DistrictAnimation({id,color}:{id:AssetId;color:string}) {
  const particles=useRef<THREE.InstancedMesh>(null);const door=useRef<THREE.Group>(null);
  const object=useMemo(()=>new THREE.Object3D(),[]);const reduced=useStore(s=>s.reduced);
  const selected=useStore(s=>s.selected===id);
  useFrame(({clock},delta)=>{
    const time=reduced?1.5:clock.elapsedTime;
    if(door.current)door.current.rotation.y=reduced?(selected?-1.35:0):THREE.MathUtils.damp(door.current.rotation.y,selected?-1.35:0,3,delta);
    if(!particles.current)return;
    for(let i=0;i<8;i++) {
      const f=(time*.16+i/8)%1;object.scale.set(1,1,1);object.rotation.set(0,0,0);
      switch(id) {
        case 'stocks': {const h=.1+(1+Math.sin(time+i*.8))*.15;object.position.set(-1.3+i*.35,.08+h/2,1.1);object.scale.set(.6,h*10,.6);break;}
        case 'property': object.position.set(-1.2+i%3*.9,.4+f*1.4,1.35);object.scale.setScalar(.55);break;
        case 'gold': object.position.set(-1.2+i*.34,2.43,-.25);object.scale.setScalar(.45+Math.sin(time+i)*.15);break;
        case 'crypto': {const a=Math.floor(i/2)*Math.PI/2+.78;object.position.set(Math.cos(a)*1.35*(1-f),1.1+f*1.5,Math.sin(a)*1.1*(1-f));object.scale.setScalar(.55);break;}
        case 'bonds': object.position.set(-1.1+(i%4)*.72,1.8-f*1.3,.8);object.rotation.x=Math.PI/2;object.scale.setScalar(.65);break;
        case 'etfs': {const a=time*.35+i*Math.PI/4;object.position.set(Math.cos(a)*1.02,2.65,Math.sin(a)*1.02);object.scale.setScalar(.65);break;}
        case 'savings': object.position.set(.8,2.55+(i*.11),-.6);object.scale.setScalar(i<Math.floor(time%5/5*8)||reduced?.8:.05);break;
        case 'startups': object.position.set(-1+f*2,1.1+f*1.1,1);object.scale.setScalar(.6);break;
        case 'funds': {const a=i*Math.PI/4;object.position.set(Math.cos(a)*f*1.3,1.8-f*.6,Math.sin(a)*f*1.3);object.scale.setScalar(.6);break;}
        case 'reits': object.position.set(-1+f*2.3,.2,1.55);object.scale.setScalar(.7);break;
      }
      object.updateMatrix();particles.current.setMatrixAt(i,object.matrix);
    }
    particles.current.instanceMatrix.needsUpdate=true;
  });
  return <>
    <instancedMesh ref={particles} args={[undefined,undefined,8]} frustumCulled={false}>
      {['bonds','savings','reits'].includes(id)?<cylinderGeometry args={[.09,.09,.045,12]}/>:<boxGeometry args={[.09,.09,.09]}/>}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.7} metalness={.6} roughness={.3}/>
    </instancedMesh>
    {id==='gold'&&<group ref={door} position={[-.85,1.35,1.15]}><group position={[.85,0,0]}>
      <mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.83,.83,.18,40]}/><meshStandardMaterial color="#718596" metalness={.9} roughness={.25}/></mesh>
      <mesh position={[0,0,.1]}><torusGeometry args={[.64,.04,6,40]}/><meshStandardMaterial color="#e8b877" metalness={.95} roughness={.25}/></mesh>
      {[0,Math.PI/3,Math.PI*2/3].map(a=><mesh key={a} position={[0,0,.15]} rotation={[0,0,a]}><boxGeometry args={[1.05,.04,.06]}/><meshStandardMaterial color="#a1aeb5" metalness={.9} roughness={.2}/></mesh>)}
    </group></group>}
  </>;
}

function CameraRig() {
  const controls=useRef<OrbitControlsImpl>(null);const camera=useThree(s=>s.camera);
  const selected=useStore(s=>s.selected); const revision=useStore(s=>s.sceneRevision);
  const reduced=useStore(s=>s.reduced);const size=useThree(s=>s.size);
  const animating=useRef(true); const desired=useRef(new THREE.Vector3()); const target=useRef(new THREE.Vector3());
  useEffect(()=>{
    const index=investments.findIndex(a=>a.id===selected);
    if(index>=0){const p=positions[index];target.current.copy(p).add(new THREE.Vector3(0,1,0));desired.current.copy(p).add(new THREE.Vector3(7,6.5,9));}
    else {target.current.set(0,.4,0);const f=size.width<640?1.35:size.width<1000?1.16:1;desired.current.set(27*f,24*f,33*f);}
    animating.current=true;
  },[selected,revision,size.width]);
  useFrame((_,delta)=>{
    if(!controls.current||!animating.current)return;
    const a=reduced?1:1-Math.exp(-3.2*delta);
    camera.position.lerp(desired.current,a);controls.current.target.lerp(target.current,a);controls.current.update();
    if(camera.position.distanceTo(desired.current)<.025)animating.current=false;
  });
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.08}
    minDistance={7} maxDistance={72} minPolarAngle={.22} maxPolarAngle={Math.PI*.48}
    enablePan={false} rotateSpeed={.55} zoomSpeed={.65} onStart={()=>{animating.current=false;}} />;
}

function Scene({low}:{low:boolean}) {
  const gl=useThree(s=>s.gl);
  useEffect(()=>{
    const lost=(e:Event)=>{e.preventDefault();window.dispatchEvent(new Event('investverse-context-lost'));};
    gl.domElement.addEventListener('webglcontextlost',lost);
    return ()=>gl.domElement.removeEventListener('webglcontextlost',lost);
  },[gl]);
  return <>
    <color attach="background" args={['#111923']} /><fog attach="fog" args={['#111923',62,120]} />
    <ambientLight intensity={.7} />
    <hemisphereLight args={['#b2d8e3','#1a1d27',1.3]} />
    <directionalLight position={[-12,22,12]} intensity={3.8} color="#ffe5bb" castShadow={!low} shadow-mapSize={[2048,2048]} shadow-camera-left={-23} shadow-camera-right={23} shadow-camera-top={23} shadow-camera-bottom={-23} shadow-normalBias={.04} />
    <directionalLight position={[18,10,-12]} intensity={2.2} color="#73c1d4" />
    <Reflections /><Architecture />
    {investments.map((a,i)=><District key={a.id} index={i}/>)}
    <CapitalFlow /><GrowthSculpture /><CameraRig /><AdaptiveDpr pixelated />
    <mesh position={[0,-3.25,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[220,220]} /><meshStandardMaterial color="#0e151f" roughness={1} metalness={.1} />
    </mesh>
  </>;
}

class Boundary extends Component<{children:ReactNode;fallback:ReactNode},{error:boolean}> {
  state={error:false}; static getDerivedStateFromError(){return {error:true};}
  render(){return this.state.error?this.props.fallback:this.props.children;}
}
function Fallback() {
  const {t,lang}=useI18n();const select=useStore(s=>s.select);const selected=useStore(s=>s.selected);
  return <div className="world-fallback"><span className="eyebrow">INVESTVERSE / ATLAS</span><h2>{t('Explore the investment atlas','اطلس سرمایه‌گذاری را کشف کنید')}</h2><p>{t('3D is unavailable on this device. Every lesson and simulator is available below.','نمای سه‌بعدی در این دستگاه در دسترس نیست. همه درس‌ها و شبیه‌سازها همچنان فعال‌اند.')}</p><div className="atlas-grid">{investments.map(a=><button key={a.id} className={selected===a.id?'active':''} onClick={()=>select(a.id as AssetId)} style={{'--district':a.color} as React.CSSProperties}><DistrictIcon id={a.id}/><span>{a.name[lang]}</span><small>{a.code}</small></button>)}</div></div>;
}
export default function WorldScene() {
  const quality=useStore(s=>s.quality);const [failed,setFailed]=useState(false);
  const [compact,setCompact]=useState(()=>window.innerWidth<768);
  useEffect(()=>{const resize=()=>setCompact(window.innerWidth<768);window.addEventListener('resize',resize);const lost=()=>setFailed(true);window.addEventListener('investverse-context-lost',lost);return()=>{window.removeEventListener('resize',resize);window.removeEventListener('investverse-context-lost',lost);};},[]);
  const low=quality==='low'||(quality==='auto'&&compact);
  if(failed) return <Fallback/>;
  return <Boundary fallback={<Fallback/>}><Canvas shadows={!low} camera={{position:[27,24,33],fov:40,near:.1,far:180}} dpr={low?1:[1,1.75]} gl={{antialias:!low,alpha:false,powerPreference:'high-performance'}} fallback={<Fallback/>} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12;}}>
    <Suspense fallback={null}><Scene low={low}/></Suspense>
  </Canvas></Boundary>;
}

export function MiniScene({id}:{id:AssetId}) {
  const asset=investments.find(a=>a.id===id)!;
  const model=useMemo(()=>makeDistrict(id,asset.color),[id,asset.color]);
  useEffect(()=>()=>disposeModel(model),[model]);
  return <Boundary fallback={<div className="mini-fallback"><DistrictIcon id={id} size={65}/></div>}><Canvas dpr={1} camera={{position:[5,4.5,7],fov:42}} gl={{alpha:true,antialias:true}} fallback={<div className="mini-fallback"><DistrictIcon id={id} size={65}/></div>}>
    <ambientLight intensity={1.4}/><directionalLight position={[4,8,5]} intensity={3}/><Reflections/>
    <group position={[0,-1,0]}><primitive object={model}/><DistrictAnimation id={id} color={asset.color}/></group><OrbitControls enablePan={false} enableZoom={false} minPolarAngle={.3} maxPolarAngle={1.5}/>
  </Canvas></Boundary>;
}
