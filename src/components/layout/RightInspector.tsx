import { Scan } from 'lucide-react';
import { useStudio } from '@/stores/StudioContext';
import PartsPanel from '@/components/features/PartsPanel';
import LightingPanel from '@/components/features/LightingPanel';
import MaterialPanel from '@/components/features/MaterialPanel';
interface Props {mobile?:boolean;}
export default function RightInspector({mobile=false}:Props){const s=useStudio();const title=s.current?.assetKey?(s.current.source==='import'?'Imported asset':'Reconstructed asset'):s.current?s.current.spec.family==='car'?'Grand tourer':s.current.spec.family.charAt(0).toUpperCase()+s.current.spec.family.slice(1):'The finer details.';return <aside aria-label="Object inspector" className={mobile?'p-5':'glass studio-inspector rounded-2xl p-4 overflow-y-auto scrollbar'}><div className="flex items-center justify-between mb-5"><div><p className="micro mb-2">INSPECTOR</p><h2 className="font-display text-lg font-semibold">{title}</h2></div><Scan size={18} className="text-subtle"/></div><div data-tour="rigging"><PartsPanel/></div><LightingPanel/><MaterialPanel/><p className="mt-5 pt-4 border-t border-border text-xs text-subtle leading-relaxed">Performance safeguards reduce GPU workload and pause background rendering. Browser APIs cannot guarantee frame rate or measure device temperature.</p></aside>;}
