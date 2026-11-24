import { useEffect,useState } from 'react';
import { useStudio } from '@/stores/StudioContext';
export function useMobileView(){const {settings}=useStudio();const [small,setSmall]=useState(()=>window.innerWidth<1024);useEffect(()=>{const query=window.matchMedia('(max-width: 1023px)');const listener=()=>setSmall(query.matches);query.addEventListener('change',listener);return()=>query.removeEventListener('change',listener);},[]);return settings.view==='mobile' || small;}
