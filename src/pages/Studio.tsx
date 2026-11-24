import { useRef,useState } from 'react';
import { Upload,Eye } from 'lucide-react';
import { useMobileView } from '@/hooks/useMobileView';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useStudio } from '@/stores/StudioContext';
import ShowroomCanvas from '@/components/features/ShowroomCanvas';
import LeftDock from '@/components/layout/LeftDock';
import RightInspector from '@/components/layout/RightInspector';
import MobileSheet from '@/components/layout/MobileSheet';
import StageOverview from '@/components/features/StageOverview';
import CameraToolbar from '@/components/features/CameraToolbar';
import GenerationProgress from '@/components/features/GenerationProgress';
import ViewportContextMenu from '@/components/features/ViewportContextMenu';
import Tutorial from '@/components/features/Tutorial';
import Celebration from '@/components/features/Celebration';
export default function Studio(){const mobile=useMobileView();const s=useStudio();useKeyboard();const [drag,setDrag]=useState(false);const depth=useRef(0);return <main className={`studio-workspace ${mobile||s.readOnly?'compact':'docked'} ${!s.dockOpen?'dock-collapsed':''}`} onDragEnter={event=>{if(s.readOnly)return;event.preventDefault();depth.current++;setDrag(true);}} onDragOver={event=>event.preventDefault()} onDragLeave={()=>{if(--depth.current<=0)setDrag(false);}} onDrop={event=>{event.preventDefault();depth.current=0;setDrag(false);if(!s.readOnly)void s.importFiles(Array.from(event.dataTransfer.files));}}>{!mobile&&!s.readOnly&&<LeftDock/>}<div className="viewport-shell min-w-0 relative overflow-hidden" style={mobile&&!s.readOnly?{bottom:s.sheet==='half'?'46%':s.sheet==='full'?'90%':96}:undefined}><ShowroomCanvas/><StageOverview mobile={mobile||s.readOnly}/><CameraToolbar mobile={mobile}/><ViewportContextMenu/>{s.readOnly&&<span className="absolute top-3 left-3 glass rounded-xl p-3 text-sm flex gap-2"><Eye size={17}/>Read-only snapshot</span>}</div>{!mobile&&!s.readOnly&&<RightInspector/>}{mobile&&!s.readOnly&&<MobileSheet/>}{drag&&<div className="absolute inset-0 z-40 bg-panel/95 border-2 border-primary flex items-center justify-center pointer-events-none"><div className="text-center"><Upload size={40} className="mx-auto text-primary"/><h2 className="text-2xl font-semibold mt-4">Drop your model into Showtime</h2><p className="text-subtle mt-3">GLB, or glTF with its BIN and textures · 80 MB maximum</p></div></div>}<GenerationProgress/><Tutorial mobile={mobile}/><Celebration/></main>;}
