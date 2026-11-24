import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight,GitBranch } from 'lucide-react';
import { correctionSchema,type CorrectionValues } from '@/lib/validations';
import { useStudio } from '@/stores/StudioContext';
import type { ReferenceImage } from '@/types/studio';
import ReferenceUpload from '@/components/features/ReferenceUpload';
import SpecsDrawer from '@/components/forms/SpecsDrawer';
export default function RefineForm(){const s=useStudio();const [images,setImages]=useState<ReferenceImage[]>([]);const {register,handleSubmit,setValue,reset,formState:{errors}}=useForm<CorrectionValues>({resolver:zodResolver(correctionSchema),defaultValues:{correction:'',notes:''}});if(!s.current)return <p className="text-sm text-subtle leading-relaxed">Create an object to start refining. Every revision becomes a new version.</p>;
 return <form className="space-y-5" onSubmit={handleSubmit(async values=>{if(!s.current)return;const success=await s.generate({prompt:s.current.prompt,correction:values.correction,notes:values.notes || s.current.notes,references:[...s.current.references,...images].slice(-6),previous:s.current});if(success){reset();setImages([]);}})}><div className="rounded-xl bg-muted/50 p-3 flex gap-2 text-xs text-subtle"><GitBranch size={16} className="shrink-0"/><p className="leading-relaxed">Refine your current design. The original stays in your version history.</p></div><div><label htmlFor="correction" className="micro block mb-3">What would you change?</label><textarea id="correction" {...register('correction')} className="field text-[13px] leading-relaxed" rows={5} placeholder="Make the paint satin midnight blue, widen the body and increase the hood opening angle…" aria-invalid={!!errors.correction}/>{errors.correction&&<p role="alert" className="text-xs text-accent mt-2">! {errors.correction.message}</p>}</div><ReferenceUpload images={images} onChange={setImages} compact/><SpecsDrawer registration={register('notes')} onAttach={text=>setValue('notes',text)} error={errors.notes?.message}/><button disabled={s.busy} className="primary w-full justify-between">{s.busy?'Refining geometry…':'Generate refinement'}<ArrowUpRight size={16}/></button></form>;
}
