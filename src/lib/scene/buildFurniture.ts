import * as THREE from 'three';
import type { ModelSpec, StudioScene } from '@/types/studio';
import { box,cylinder,material,paint,pivot,SCENE_COLORS as C } from '@/lib/scene/primitives';
export function buildFurniture(spec:ModelSpec):StudioScene {
 const group=new THREE.Group();group.name=spec.family;const parts:StudioScene['parts']=[];const finish=paint(spec),wood=material(C.walnut,.1,.55),chrome=material(C.chrome,.9,.2),dark=material(C.rubber,.3,.55);
 if(spec.family==='cabinet'){
 box(group,'body',[2.35,1.65,.85],wood,[0,1.25,0]);box(group,'inner_shelf',[2.15,.06,.78],finish,[0,1.1,.05]);
 for(const x of [-1,1])for(const z of [-.3,.3])cylinder(group,'leg',.045,.07,.45,wood,[x,.25,z]);
 for(const side of [-1,1]){const door=pivot(group,parts,`door_${side===-1?'left':'right'}`,`${side===-1?'Left':'Right'} door`,[side*1.15,1.1,.48],'y',spec.maxAngle,side);box(door,'door_panel',[1.1,1.18,.06],finish,[-side*.55,0,0]);cylinder(door,'handle',.018,.018,.22,chrome,[-side*.97,0,.06]);const drawer=pivot(group,parts,`drawer_${side===-1?'left':'right'}`,`${side===-1?'Left':'Right'} drawer`,[side*.575,1.88,.48],'z',.6,1,true);box(drawer,'drawer_front',[1.09,.31,.06],finish,[0,0,0]);box(drawer,'drawer_box',[1.01,.22,.65],wood,[0,-.02,-.34]);box(drawer,'handle',[.26,.035,.04],chrome,[0,0,.065],.012);}
 }else if(spec.family==='chair'){
 cylinder(group,'base',.55,.59,.06,dark,[0,.05,0]);cylinder(group,'stem',.065,.065,.61,chrome,[0,.36,0]);const swivel=pivot(group,parts,'swivel','Swivel base',[0,.7,0],'y',180,1);box(swivel,'walnut_shell',[1.3,.18,1.18],wood,[0,0,0],.09);box(swivel,'seat_cushion',[1.23,.2,1.13],finish,[0,.15,0],.09);
 const back=pivot(swivel,parts,'backrest','Recline backrest',[0,.13,-.53],'x',35,-1);box(back,'back_shell',[1.3,1.22,.16],wood,[0,.58,-.015],.08);box(back,'back_cushion',[1.23,1.15,.16],finish,[0,.6,.1],.08);box(back,'headrest',[.88,.24,.14],finish,[0,1.08,.15],.06);
 for(const x of [-.7,.7]){cylinder(swivel,'arm_support',.028,.028,.4,chrome,[x,.27,0]);box(swivel,'armrest',[.16,.12,.85],wood,[x,.49,.02],.045);}
 }else if(spec.family==='lamp'){
 cylinder(group,'base',.52,.56,.08,finish,[0,.055,0]);cylinder(group,'stem',.045,.045,.55,finish,[0,.35,0]);const arm=pivot(group,parts,'arm','Lamp arm',[0,.6,0],'z',55,1);cylinder(arm,'lower_arm',.025,.025,1.05,finish,[.14,.5,0],[0,0,-.28]);cylinder(arm,'pivot_joint',.075,.075,.12,dark,[.28,1.01,0],[Math.PI/2,0,0]);const upper=pivot(arm,parts,'upper_arm','Upper arm',[.28,1.01,0],'z',60,-1);cylinder(upper,'upper_rod',.025,.025,.85,finish,[-.3,.3,0],[0,0,.8]);const shade=pivot(upper,parts,'shade','Shade tilt',[-.6,.62,0],'z',60,1);cylinder(shade,'shade_shell',.13,.32,.28,finish,[0,-.12,0]);cylinder(shade,'diffuser',.29,.29,.015,material('#fff3d1',.05,.3),[0,-.265,0]);
 }return {group,parts};
}
