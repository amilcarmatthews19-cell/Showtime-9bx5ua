import { useEffect,useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame,useThree } from '@react-three/fiber';
import { Box3,MOUSE,TOUCH,Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_POSITIONS } from '@/constants/studio';
import { useStudio } from '@/stores/StudioContext';
export default function CameraRig(){const s=useStudio();const {camera:cam}=useThree();const controls=useRef<OrbitControlsImpl>(null);const destination=useRef(new Vector3(...CAMERA_POSITIONS.hero));const moving=useRef(false);const target=useRef(new Vector3(0,.65,0));
 useEffect(()=>{const bounds=s.modelRef.current?new Box3().setFromObject(s.modelRef.current):null;const size=bounds?.getSize(new Vector3());const scale=size?Math.max(1,Math.max(size.x,size.y,size.z)/4):1;destination.current.set(...CAMERA_POSITIONS[s.camera]).multiplyScalar(scale);target.current.set(0,size?Math.min(size.y*.5,3):.65,0);moving.current=true;},[s.camera,s.cameraKey,s.parts]);
 useFrame((_,dt)=>{if(moving.current){cam.position.lerp(destination.current,Math.min(dt*8,1));controls.current?.target.lerp(target.current,Math.min(dt*8,1));if(cam.position.distanceTo(destination.current)<.01)moving.current=false;controls.current?.update();}});
 return <OrbitControls ref={controls} makeDefault target={[0,.65,0]} minDistance={.3} maxDistance={100} maxPolarAngle={Math.PI/2-.015} enableDamping dampingFactor={.1} autoRotate={s.rotate} autoRotateSpeed={.7} mouseButtons={{LEFT:MOUSE.PAN,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.ROTATE}} touches={{ONE:TOUCH.PAN,TWO:TOUCH.DOLLY_ROTATE}} onStart={()=>{moving.current=false;}}/>;
}
