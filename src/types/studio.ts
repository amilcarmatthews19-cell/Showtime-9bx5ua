import type { Group } from 'three';
export type ObjectFamily = 'car' | 'chair' | 'cabinet' | 'robot' | 'lamp';
export type RenderMode = 'pbr' | 'clay' | 'wireframe';
export type CameraAngle = 'hero' | 'front' | 'side' | 'rear' | 'top' | 'detail';
export type Backend = 'procedural' | 'local' | 'mcp';
export type StudioTool = 'orbit' | 'translate' | 'rotate' | 'scale';
export interface ScaleConstraint { x:number; y:number; width:number; height:number; meters:number; }
export interface ReferenceImage { id:string; name:string; data:string; constraint?:ScaleConstraint; }
export interface ProceduralParameters { complexity:number; roundness:number; detail:number; }
export interface ModelSpec { family:ObjectFamily; color:string; roughness:number; metalness:number; width:number; maxAngle:number; parameters?:ProceduralParameters; dimensions?:{width?:number;height?:number;depth?:number}; }
export interface GenerationVersion { id:string; prompt:string; correction:string; notes:string; references:ReferenceImage[]; spec:ModelSpec; createdAt:string; assetKey?:string; thumbnail?:string; source?:Backend|'import'; }
export interface RigPart { name:string; label:string; axis:'x'|'y'|'z'; max:number; direction:number; slide?:boolean; }
export interface StudioSettings { backend:Backend; endpoint:string; mcpEndpoint:string; view:'auto'|'mobile'|'desktop'; multiTool?:boolean; imageGuided?:boolean; safeMode?:boolean; }
export interface StudioScene { group:Group; parts:RigPart[]; }
export interface ConnectionHealth { status:'checking'|'ready'|'offline'|'bridge'; message:string; }
export interface ViewportCapture { capture:(format:'png'|'jpg',width:number,transparent:boolean)=>Promise<Blob>; thumbnail:()=>string; }
