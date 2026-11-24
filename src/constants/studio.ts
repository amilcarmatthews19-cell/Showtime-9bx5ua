import type { CameraAngle, ObjectFamily } from '@/types/studio';
export const EXAMPLES: { family: ObjectFamily; label: string; prompt: string; number: string }[] = [
{family:'car',label:'Grand tourer',number:'01',prompt:'A luxury metallic sage green sports car with four articulated doors, opening hood, trunk and fuel cap. Gloss paint, black panoramic glass, alloy wheels.'},
{family:'chair',label:'Lounge chair',number:'02',prompt:'A sculptural warm cognac leather lounge chair with a walnut shell, swivel base and adjustable articulated backrest.'},
{family:'cabinet',label:'Storage cabinet',number:'03',prompt:'A minimalist ivory cabinet with walnut legs, two hinged doors and two sliding drawers with brass handles.'},
{family:'robot',label:'Studio robot',number:'04',prompt:'A compact industrial robot in satin orange with an articulated head, arms and hands. Dark metal joints.'},
{family:'lamp',label:'Task light',number:'05',prompt:'A brushed brass architectural desk lamp with articulated arm and adjustable shade, on a circular base.'}
];
export const CAMERA_POSITIONS: Record<CameraAngle, [number,number,number]> = {hero:[5,3.2,5],front:[6,1.7,0],side:[0,1.8,6],rear:[-6,1.7,0],top:[.01,7,.01],detail:[2.8,1.8,2.8]};
export const DEFAULT_SETTINGS = { backend: 'procedural' as const, endpoint:'http://localhost:8000', mcpEndpoint:'ws://localhost:8765', view:'auto' as const, multiTool:false, imageGuided:true, safeMode:true };
