import { bridgeFetch,boundedBytes } from '@/lib/networkSafety';
import { resolveAssetResult } from '@/lib/adapterResult';
import { MCPClient } from '@/lib/MCPClient';
import { saveAsset,loadAsset } from '@/lib/assetStore';
import { parseAsset } from '@/lib/scene/importAsset';
import { disposeModel } from '@/lib/scene/buildModel';
import type { GenerationRequest } from '@/lib/GenerationService';
import type { StudioSettings } from '@/types/studio';
export async function generateExternal(request:GenerationRequest,settings:StudioSettings,payload:Record<string,unknown>,progress:(message:string)=>void){
 if(request.previous?.assetKey){const previous=await loadAsset(request.previous.assetKey);payload.previous_glb_base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(new Blob([previous]));});}
 progress(settings.imageGuided&&request.references.length?'Reconstructing from your reference images…':'Synthesizing geometry on your workstation…');let bytes:ArrayBuffer;
 if(settings.backend==='mcp'){const client=new MCPClient(settings.mcpEndpoint);try{const result=await client.callTool('generate_mesh',payload);if(settings.multiTool){progress('Rigging and finishing in Blender…');await client.callTool('rig_part',{parts:['doors','hood','trunk','lids','drawers'],detect:true});await client.callTool('modify_material',{description:request.correction||request.prompt});bytes=await resolveAssetResult(await client.callTool('export_scene',{format:'glb',include_hierarchy:true}),settings.mcpEndpoint);}else bytes=await resolveAssetResult(result,settings.mcpEndpoint);}finally{client.close();}}
 else{const response=await bridgeFetch(settings.endpoint.replace(/\/$/,'')+'/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)},300000);bytes=response.headers.get('content-type')?.includes('json')?await resolveAssetResult(await response.json(),settings.endpoint):await boundedBytes(response);}
 progress('Validating mesh and resource budgets…');const checked=await parseAsset(bytes,[],settings.safeMode!==false);disposeModel(checked.group);const key=crypto.randomUUID();await saveAsset(key,bytes);return key;
}
