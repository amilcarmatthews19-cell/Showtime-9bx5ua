import * as THREE from 'three';
import type { ModelSpec, StudioScene } from '@/types/studio';
import { box,cylinder,material,mesh,paint,pivot,SCENE_COLORS as C } from '@/lib/scene/primitives';
export function buildCar(spec:ModelSpec):StudioScene {
 const group=new THREE.Group();group.name='grand_tourer';const parts:StudioScene['parts']=[];const body=paint(spec), rubber=material(C.rubber,.05,.85),chrome=material(C.chrome,.95,.18),glass=material(C.glass,.55,.12);const width=.82*spec.width;
 const profile=new THREE.Shape();profile.moveTo(-1.85,.37);profile.quadraticCurveTo(-2.08,.6,-1.91,.83);profile.quadraticCurveTo(-1.3,1,-.75,.98);profile.lineTo(.75,.96);profile.quadraticCurveTo(1.65,.92,1.98,.72);profile.lineTo(2,.43);profile.quadraticCurveTo(1.2,.3,-1.85,.37);
 const geo=new THREE.ExtrudeGeometry(profile,{depth:width*2,bevelEnabled:true,bevelSize:.06,bevelThickness:.05,bevelSegments:4,curveSegments:18});geo.translate(0,0,-width);mesh(group,'body',geo,body);
 box(group,'lower_sill',[3.65,.12,width*2+.08],rubber,[0,.38,0]);
 const roofShape=new THREE.Shape();roofShape.moveTo(-1.15,.9);roofShape.lineTo(-.65,1.49);roofShape.quadraticCurveTo(-.4,1.6,.15,1.57);roofShape.lineTo(.68,1.43);roofShape.lineTo(1.1,.94);roofShape.closePath();
 const roofGeo=new THREE.ExtrudeGeometry(roofShape,{depth:width*1.72,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:3});roofGeo.translate(0,0,-width*.86);mesh(group,'panoramic_glass',roofGeo,glass);
 box(group,'roof_spine',[.85,.045,.11],body,[-.22,1.57,0]);
 for(const side of [-1,1]) {
 for(const [x,suffix] of [[.54,'f'],[-.67,'r']] as const){
 const door=pivot(group,parts,`door_${suffix}${side===1?'l':'r'}`,`${suffix==='f'?'Front':'Rear'} ${side===1?'left':'right'} door`,[x+.47,.73,side*(width+.025)],'y',spec.maxAngle,-side);
 box(door,'door_panel',[.98,.46,.045],body,[-.46,0,0],.025);box(door,'window_frame',[.96,.025,.055],chrome,[-.46,.24,0],.008);box(door,'door_handle',[.13,.025,.025],chrome,[-.78,.12,side*.035],.008);
 }
 box(group,'side_mirror',[.2,.08,.15],body,[.73,1.08,side*(width+.14)],.025);
 for(const x of [-1.25,1.25]){const wheel=pivot(group,parts,`wheel_${x>0?'f':'r'}${side===1?'l':'r'}`,`${x>0?'Front':'Rear'} ${side===1?'left':'right'} wheel`,[x,.42,side*(width+.035)],'z',180,side);cylinder(wheel,'tire',.405,.405,.25,rubber,[0,0,0],[Math.PI/2,0,0]);cylinder(wheel,'alloy_rim',.285,.285,.265,chrome,[0,0,0],[Math.PI/2,0,0]);cylinder(wheel,'hub',.075,.075,.28,rubber,[0,0,0],[Math.PI/2,0,0]);for(let j=0;j<7;j++){const spoke=box(wheel,'rim_spoke',[.05,.48,.015],rubber,[0,0,side*.14],.006);spoke.rotation.z=j*Math.PI/7;} }
 box(group,'headlight',[.05,.065,.42],material('#f5f0cf',.1,.12),[1.98,.76,side*.49],.015);box(group,'rear_light',[.04,.055,.5],material('#a93127',.2,.18),[-1.96,.77,side*.45],.01);
 }
 const hood=pivot(group,parts,'hood','Hood',[.8,.97,0],'z',spec.maxAngle,1);box(hood,'hood_panel',[1.04,.035,width*1.85],body,[.52,-.015,0],.018);
 const trunk=pivot(group,parts,'trunk','Trunk',[-1.15,.97,0],'z',spec.maxAngle,-1);box(trunk,'trunk_panel',[.7,.035,width*1.85],body,[-.35,-.015,0],.018);
 const fuel=pivot(group,parts,'fuel_cap','Fuel cap',[-1.35,.88,width+.075],'y',90,-1);box(fuel,'cap_panel',[.16,.14,.018],body,[-.08,0,0],.012);
 box(group,'front_grille',[.055,.17,.82],rubber,[2,.52,0],.018);for(let i=0;i<7;i++)box(group,'grille_fin',[.06,.012,.78],chrome,[2.035,.45+i*.023,0],.004);
 group.scale.setScalar(.86);return {group,parts};
}
