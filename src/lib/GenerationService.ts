import type { GenerationVersion, ModelSpec, ProceduralParameters, ReferenceImage, StudioSettings } from '@/types/studio';
import { generateExternal } from '@/lib/localGeneration';
import { readDimensions } from '@/lib/referenceDimensions';
export interface GenerationRequest { prompt: string; correction?: string; notes?: string; references: ReferenceImage[]; previous?: GenerationVersion; parameters?:ProceduralParameters; }
const COLORS: [RegExp,string][] = [[/midnight|navy/i,'#162c43'],[/blue/i,'#42677c'],[/red|crimson/i,'#a52b25'],[/orange/i,'#ca692d'],[/sage/i,'#7b9584'],[/green|emerald/i,'#315e4c'],[/cognac|brown|walnut/i,'#9f6540'],[/brass|gold/i,'#b49a5e'],[/ivory|cream|white/i,'#ddd9cd'],[/black|obsidian/i,'#222728'],[/silver/i,'#a5acae']];
function parseSpec(request: GenerationRequest): ModelSpec {
 const text = `${request.prompt} ${request.notes || ''}`; const latest = request.correction || text;
 const family = request.previous?.spec.family || (/cabinet|drawer|wardrobe|dresser/i.test(text) ? 'cabinet' : /chair|seat|lounge/i.test(text) ? 'chair' : /robot|android/i.test(text) ? 'robot' : /lamp|light|luminaire/i.test(text) ? 'lamp' : 'car');
 const color = COLORS.find(([pattern]) => pattern.test(latest))?.[1] || request.previous?.spec.color || '#7b9584';
 return {family,color,parameters:request.parameters || request.previous?.spec.parameters,dimensions:readDimensions(request.notes || '',request.references) || request.previous?.spec.dimensions,roughness:/satin|matte|brushed/i.test(latest)?.48:/gloss|polish/i.test(latest)?.15:request.previous?.spec.roughness ?? .24,metalness:/wood|leather/i.test(text)?.15:.65,width:/widen|wider/i.test(latest)?Math.min((request.previous?.spec.width || 1)*1.12,1.8):request.previous?.spec.width || 1,maxAngle:/increase.*angle|wider.*open/i.test(latest)?Math.min((request.previous?.spec.maxAngle || 70)+15,110):request.previous?.spec.maxAngle || 70};
}
export class GenerationService {
 static async generate(request: GenerationRequest, settings: StudioSettings, onProgress: (step: string) => void): Promise<GenerationVersion> {
 console.log('[Showtime] Generation', {backend:settings.backend,prompt:request.prompt,family:request.previous?.spec.family,referenceCount:request.references.length});
 const assetKey=settings.backend!=='procedural'?await generateExternal(request,settings,this.createAdapterPayload(request,settings),onProgress):undefined;
 const stages = ['Shaping your idea…', 'Building parametric geometry…', 'Rigging articulated hinges…', 'Preparing studio materials…'];
 for (const stage of stages) { onProgress(stage); await new Promise(resolve => setTimeout(resolve, 450)); }
 return {id:crypto.randomUUID(),assetKey,source:settings.backend,prompt:request.prompt,correction:request.correction || '',notes:request.notes || '',references:request.references,spec:parseSpec(request),createdAt:new Date().toISOString()};
 }
 static createAdapterPayload(request:GenerationRequest,settings?:StudioSettings) {return {prompt:request.prompt,images:request.references.map(image=>image.data),scale_constraints:request.references.map(image=>({name:image.name,...image.constraint})),articulation:'Separate named pivot groups with realistic hinge origins',feedback:request.correction || '',metadata:request.notes || '',previous:request.previous?.spec,previous_asset_id:request.previous?.assetKey,parameters:request.parameters,image_guided:!!settings?.imageGuided,multi_tool:!!settings?.multiTool,safe_mode:settings?.safeMode!==false};}
}
