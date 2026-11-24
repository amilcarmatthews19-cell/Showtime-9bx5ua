import type { Group } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { downloadFile } from '@/lib/utils';
import { prepareExport } from '@/lib/exportPreparation';
import { exportObj } from '@/lib/exportObj';
import { bridgeFetch,boundedBytes } from '@/lib/networkSafety';
import { MCPClient } from '@/lib/MCPClient';
import { resolveAssetResult } from '@/lib/adapterResult';
import type { GenerationVersion,StudioSettings } from '@/types/studio';
export type ExportFormat='glb'|'gltf'|'obj'|'stl'|'fbx'|'png'|'jpg'|'json';
export async function exportScene(source:Group,format:ExportFormat,closed:boolean,current:GenerationVersion,versions:GenerationVersion[],selected:string[]=[],settings?:StudioSettings){
 const scene=prepareExport(source,closed,selected);const stem=`showtime-${current.source==='import'?'asset':current.spec.family}-v${versions.findIndex(v=>v.id===current.id)+1}`;
 if(format==='obj'){exportObj(scene,stem);return;}
 if(format==='stl'){const data=new STLExporter().parse(scene,{binary:true});downloadFile(data.buffer as ArrayBuffer,stem+'.stl','model/stl');return;}
 if(format==='json'){downloadFile(JSON.stringify({application:'Showtime',currentVersion:current.id,versions,pose:closed?'closed':'current',scene:scene.toJSON()},null,2),stem+'.json','application/json');return;}
 if(format==='fbx'){if(!settings||settings.backend==='procedural')throw new Error('FBX requires a connected local Blender export bridge. Choose Local GPU or MCP in Settings.');const data=await new GLTFExporter().parseAsync(scene,{binary:true,trs:true,animations:scene.animations}) as ArrayBuffer;const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(new Blob([data]));});let result:ArrayBuffer;if(settings.backend==='mcp'){const client=new MCPClient(settings.mcpEndpoint);try{result=await resolveAssetResult(await client.callTool('export_scene',{format:'fbx',glb_base64:base64}),settings.mcpEndpoint);}finally{client.close();}}else{const response=await bridgeFetch(settings.endpoint.replace(/\/$/,'')+'/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({format:'fbx',glb_base64:base64})},120000);result=response.headers.get('content-type')?.includes('json')?await resolveAssetResult(await response.json(),settings.endpoint):await boundedBytes(response);}downloadFile(result,stem+'.fbx','application/octet-stream');return;}
 const result=await new GLTFExporter().parseAsync(scene,{binary:format==='glb',onlyVisible:true,trs:true,animations:scene.animations});if(format==='glb')downloadFile(result as ArrayBuffer,stem+'.glb','model/gltf-binary');else downloadFile(JSON.stringify(result,null,2),stem+'.gltf','model/gltf+json');
}
