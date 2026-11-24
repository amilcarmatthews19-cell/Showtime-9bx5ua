import { ArrowUpRight } from 'lucide-react';
import { EXAMPLES } from '@/constants/studio';
import { useStudio } from '@/stores/StudioContext';
import tourer from '@/assets/tourer.webp';
import chair from '@/assets/chair.webp';
import cabinet from '@/assets/cabinet.webp';
const IMAGES=[tourer,chair,cabinet];
export default function ConceptRail(){const s=useStudio();return <div className="absolute bottom-[126px] left-1/2 -translate-x-1/2 z-10 w-[384px]"><div className="micro text-center mb-3 text-[9px]">A starting point, not a limitation</div><div className="flex gap-3">{EXAMPLES.slice(0,3).map((example,i)=><button key={example.family} onClick={()=>{s.setDraft(example.prompt);s.setDockOpen(true);s.setSheet('half');}} className="glass rounded-xl overflow-hidden flex-1 text-left hover:-translate-y-1"><div className="h-[67px] overflow-hidden"><img src={IMAGES[i]} alt={`${example.label} design inspiration`} className="w-full h-full object-cover"/></div><div className="px-3 py-2.5"><div className="flex justify-between items-center text-[10px] font-medium"><span>{example.label}</span><ArrowUpRight size={11}/></div></div></button>)}</div><p className="text-center text-[9px] text-subtle mt-2">Concept inspiration · generated as parametric models</p></div>;}
