import { useRef } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import { toast } from 'sonner';
interface Props {mobile:boolean;}
export default function RendererHealth({mobile}:Props){const {gl,setDpr}=useThree();const sample=useRef({elapsed:0,frames:0,reduced:false});useFrame((_,dt)=>{if(!mobile||sample.current.reduced||document.hidden)return;const value=sample.current;value.elapsed+=Math.min(dt,.25);value.frames++;if(value.elapsed<3)return;const fps=value.frames/value.elapsed;if(fps<38){setDpr(1);value.reduced=true;console.log('[Showtime] Adaptive performance', {fps,dpr:1,drawCalls:gl.info.render.calls});toast.info('Render resolution reduced to keep interaction responsive.');}value.elapsed=0;value.frames=0;});return null;}
