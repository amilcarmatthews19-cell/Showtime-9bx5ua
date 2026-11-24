import { useEffect } from 'react';
import { useFrame,type ThreeEvent } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useStudio } from '@/stores/StudioContext';
import { useLoadedScene } from '@/hooks/useLoadedScene';
import { applyRenderMode } from '@/lib/scene/buildModel';
import TransformGizmo from '@/components/features/TransformGizmo';
export default function StudioModel(){
 const s=useStudio();const scene=useLoadedScene(s.current,s.settings.safeMode!==false);
 useEffect(()=>{s.modelRef.current=scene?.group||null;s.setParts(scene?.parts||[]);return()=>{s.modelRef.current=null;};},[scene,s.modelRef,s.setParts]);
 useEffect(()=>{if(!scene||!s.current)return;const id=s.current.id;const timer=setTimeout(()=>{const thumbnail=s.captureRef.current?.thumbnail();if(thumbnail)s.updateThumbnail(id,thumbnail);},1000);return()=>clearTimeout(timer);},[scene,s.current?.id,s.captureRef,s.updateThumbnail]);
 useFrame((_,dt)=>{if(!scene)return;applyRenderMode(scene.group,s.renderMode,Math.min(dt,.05));scene.parts.forEach(part=>{const node=scene.group.getObjectByName(part.name);if(!node||(s.selectedNode===node&&s.tool!=='orbit'))return;const target=(s.angles[part.name]||0)*part.direction;const index=['x','y','z'].indexOf(part.axis);if(part.slide){const closed=node.userData.closedPosition as number[];node.position[part.axis]=MathUtils.damp(node.position[part.axis],closed[index]+target,9,Math.min(dt,.05));}else{const closed=node.userData.closedRotation as number[]|undefined;node.rotation[part.axis]=MathUtils.damp(node.rotation[part.axis],(closed?.[index]||0)+target*Math.PI/180,9,Math.min(dt,.05));}});});
 function select(event:ThreeEvent<MouseEvent>,articulate=true){event.stopPropagation();let node=event.object;while(node.parent&&node!==scene?.group&&!node.userData.rig)node=node.parent;s.setSelectedNode(node);if(articulate&&s.tool==='orbit'&&node.userData.rig)s.togglePart(node.name);}
 return scene?<><primitive object={scene.group} position={[0,.15,0]} onClick={select} onContextMenu={(event:ThreeEvent<MouseEvent>)=>select(event,false)} dispose={null}/><TransformGizmo/></>:null;
}
