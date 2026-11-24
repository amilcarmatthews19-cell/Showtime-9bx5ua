import { ContactShadows,Environment,Lightformer } from '@react-three/drei';
import { useFrame,useThree } from '@react-three/fiber';
import { Color,MathUtils } from 'three';
import { useMemo } from 'react';
import { useStudio } from '@/stores/StudioContext';
import { SCENE_COLORS as C } from '@/lib/scene/primitives';
interface Props {mobile:boolean;}
export default function StudioEnvironment({mobile}:Props){
 const {dark,shadows,exposure}=useStudio();const {scene,gl}=useThree();const target=useMemo(()=>new Color(dark?C.floorDark:C.floorLight),[dark]);
 useFrame((_,dt)=>{if(!(scene.background instanceof Color))scene.background=target.clone();scene.background.lerp(target,Math.min(dt*5,1));gl.toneMappingExposure=MathUtils.damp(gl.toneMappingExposure,exposure,5,dt);});
 return <><ambientLight intensity={dark?.35:1.1}/><directionalLight position={[4,8,3]} intensity={dark?2:3} color={C.light} castShadow={shadows} shadow-mapSize={[mobile?512:1024,mobile?512:1024]}/><spotLight position={[-4,5,-4]} intensity={dark?75:30} angle={.7} penumbra={1} color={C.rim}/><spotLight position={[1,4,5]} intensity={35} angle={.8} penumbra={1}/>
 <Environment resolution={mobile?128:256}><Lightformer form="rect" intensity={3} position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[6,3,1]}/><Lightformer form="rect" intensity={dark?4:2} position={[-5,2,-2]} rotation={[0,Math.PI/2,0]} scale={[3,5,1]}/><Lightformer form="rect" intensity={2} position={[5,2,1]} rotation={[0,-Math.PI/2,0]} scale={[3,5,1]}/></Environment>
 <group userData={{showroom:true}}><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color={dark?C.floorDark:C.floorLight} roughness={.3} metalness={.15}/></mesh>
 <mesh position={[0,.025,0]} receiveShadow><cylinderGeometry args={[2.48,2.48,.16,mobile?64:128]}/><meshPhysicalMaterial color={dark?C.podiumDark:C.podiumLight} metalness={.2} roughness={.28} clearcoat={.55}/></mesh>
 <mesh position={[0,.104,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.39,2.397,128]}/><meshBasicMaterial color={dark?'#64736d':'#b0b8af'}/></mesh>
 {shadows && <ContactShadows frames={mobile?1:Infinity} position={[0,.112,0]} opacity={dark?.55:.3} scale={12} blur={2.5} far={4} resolution={mobile?256:512} color="#16201a"/>}</group></>;
}
