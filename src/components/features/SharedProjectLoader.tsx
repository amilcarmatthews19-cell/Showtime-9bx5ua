import { useEffect,useRef } from 'react';
import { toast } from 'sonner';
import { readShare } from '@/lib/projectShare';
import { useStudio } from '@/stores/StudioContext';
export default function SharedProjectLoader(){const s=useStudio();const loaded=useRef(false);useEffect(()=>{if(loaded.current||!location.hash.startsWith('#view='))return;loaded.current=true;void readShare(location.hash).then(data=>{s.openShared(data.version,{});s.setCamera(data.camera);if(data.dark!==s.dark)s.toggleTheme();toast.success('Read-only project snapshot opened.');}).catch(error=>toast.error(error instanceof Error?error.message:'Shared project could not be opened.'));},[s.openShared,s.setCamera,s.dark,s.toggleTheme]);return null;}
