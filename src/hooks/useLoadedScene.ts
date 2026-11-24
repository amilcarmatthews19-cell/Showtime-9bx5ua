import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import { loadAsset } from '@/lib/assetStore';
import { parseAsset } from '@/lib/scene/importAsset';
import { buildModel,disposeModel } from '@/lib/scene/buildModel';
import type { GenerationVersion,StudioScene } from '@/types/studio';
export function useLoadedScene(current:GenerationVersion|null,safe:boolean){const [scene,setScene]=useState<StudioScene|null>(null);useEffect(()=>{let active=true;let loaded:StudioScene|null=null;setScene(null);if(!current)return;const task=current.assetKey?loadAsset(current.assetKey).then(bytes=>parseAsset(bytes,[],safe)):Promise.resolve(buildModel(current.spec));void task.then(result=>{loaded=result;if(active)setScene(result);else disposeModel(result.group);}).catch(error=>{if(active)toast.error(error instanceof Error?error.message:'This model could not be loaded.');});return()=>{active=false;if(loaded)disposeModel(loaded.group);};},[current?.id,safe]);return scene;}
