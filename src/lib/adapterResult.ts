import { boundedBytes,bridgeFetch } from '@/lib/networkSafety';
export async function resolveAssetResult(result:unknown,endpoint:string):Promise<ArrayBuffer>{
 if(!result||typeof result!=='object')throw new Error('Bridge must return a GLB binary, {url}, or {glb_base64}.');const data=result as Record<string,unknown>;
 if(data.structuredContent)return resolveAssetResult(data.structuredContent,endpoint);
 if(Array.isArray(data.content)){for(const item of data.content){if(item&&typeof item==='object'&&'text' in item&&typeof item.text==='string'){const parsed=await Promise.resolve().then(()=>JSON.parse(item.text)).catch(()=>({url:item.text}));return resolveAssetResult(parsed,endpoint);}}}
 const base64=data.glb_base64||data.base64;if(typeof base64==='string'){if(base64.length>112*1024*1024)throw new Error('Bridge asset is too large.');const decoded=atob(base64.replace(/^data:[^,]+,/,''));return Uint8Array.from(decoded,c=>c.charCodeAt(0)).buffer;}
 const path=data.url||data.glb_url||data.model_url||data.asset_url;if(typeof path!=='string')throw new Error('Tool must export a GLB and return {url} or {glb_base64}.');const base=new URL(endpoint.replace(/^ws/,'http'));const url=new URL(path,base);if(url.origin!==base.origin)throw new Error('Asset URL must use the configured bridge origin.');return boundedBytes(await bridgeFetch(url.href,{},60000));
}
