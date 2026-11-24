import { useCallback,useEffect,useState } from 'react';
import { toast } from 'sonner';
import type { GenerationVersion } from '@/types/studio';
export function useProjectHistory(){const [versions,setVersions]=useState<GenerationVersion[]>([]);const [loaded,setLoaded]=useState(false);
 useEffect(()=>{void Promise.resolve().then(()=>JSON.parse(localStorage.getItem('showtime-versions')||'[]') as GenerationVersion[]).then(data=>{if(Array.isArray(data))setVersions(old=>[...data.filter(v=>v?.id&&v.spec),...old].slice(-20));}).catch(()=>toast.info('Saved history could not be read. New designs can still be created.')).finally(()=>setLoaded(true));},[]);
 useEffect(()=>{if(!loaded)return;void Promise.resolve().then(()=>localStorage.setItem('showtime-versions',JSON.stringify(versions.map(v=>({...v,references:[]}))))).catch(()=>toast.warning('Device storage is full. Export your project before leaving.'));},[versions,loaded]);
 const addVersion=useCallback((version:GenerationVersion)=>setVersions(old=>[...old,version].slice(-20)),[]);
 const updateThumbnail=useCallback((id:string,thumbnail:string)=>setVersions(old=>old.map(v=>v.id===id&&!v.thumbnail?{...v,thumbnail}:v)),[]);
 return {versions,addVersion,updateThumbnail};
}
