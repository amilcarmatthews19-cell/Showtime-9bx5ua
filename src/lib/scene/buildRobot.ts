import * as THREE from 'three';
import type { ModelSpec, StudioScene } from '@/types/studio';
import { box,cylinder,material,paint,pivot,SCENE_COLORS as C } from '@/lib/scene/primitives';
export function buildRobot(spec:ModelSpec):StudioScene {
 const group=new THREE.Group();group.name='studio_robot';const parts:StudioScene['parts']=[];const finish=paint(spec),joint=material(C.rubber,.5,.35),metal=material(C.chrome,.8,.25);
 box(group,'body',[.9,.85,.58],finish,[0,1.24,0],.09);box(group,'chest_panel',[.48,.34,.035],joint,[0,1.3,.31]);
 const head=pivot(group,parts,'head','Head rotation',[0,1.72,0],'y',90,1);cylinder(head,'neck',.1,.1,.15,metal,[0,0,0]);box(head,'head_shell',[.7,.48,.55],finish,[0,.28,0],.08);box(head,'visor',[.54,.15,.025],joint,[0,.3,.29]);for(const x of [-.15,.15])box(head,'optic',[.065,.05,.03],material('#abdacb',.3,.15),[x,.3,.31],.01);
 for(const side of [-1,1]){box(group,'foot',[.35,.15,.58],joint,[side*.28,.1,.06]);cylinder(group,'leg',.11,.13,.68,metal,[side*.28,.49,0]);const arm=pivot(group,parts,`arm_${side===-1?'left':'right'}`,`${side===-1?'Left':'Right'} arm`,[side*.6,1.55,0],'z',110,side);cylinder(arm,'shoulder',.14,.14,.2,joint,[0,0,0],[0,0,Math.PI/2]);box(arm,'upper_arm',[.22,.52,.25],finish,[side*.06,-.29,0],.055);const hand=pivot(arm,parts,`hand_${side===-1?'left':'right'}`,`${side===-1?'Left':'Right'} wrist`,[side*.06,-.61,0],'y',90,side);box(hand,'gripper',[.25,.22,.26],metal,[0,-.08,0],.03);for(const z of [-.12,.12])box(hand,'finger',[.075,.19,.065],joint,[0,-.25,z],.015);}
 return {group,parts};
}
