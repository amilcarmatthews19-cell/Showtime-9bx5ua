import { useStudio } from '@/stores/StudioContext';
import Modal from '@/components/features/Modal';
import SettingsContent from '@/components/features/SettingsContent';
export default function SettingsModal(){const s=useStudio();return <Modal open={s.settingsOpen} onClose={()=>s.setSettingsOpen(false)} title="Your studio, your setup." subtitle="On-device creation or your own GPU and Blender workstation."><SettingsContent/></Modal>;}
