import { z } from 'zod';
export const briefSchema=z.object({prompt:z.string().trim().min(8,'Describe your object in at least 8 characters.').max(4000,'Keep your brief under 4,000 characters.'),notes:z.string().max(8000,'Keep notes under 8,000 characters.')});
export const correctionSchema=z.object({correction:z.string().trim().min(5,'Add a correction of at least 5 characters.').max(4000),notes:z.string().max(8000)});
export const settingsSchema=z.object({endpoint:z.string().url('Enter a complete HTTP address.').refine(value=>/^https?:\/\//.test(value),'Use http:// or https://.'),mcpEndpoint:z.string().url('Enter a valid WebSocket address.').refine(value=>/^wss?:\/\//.test(value),'Use ws:// or wss://.')});
export type BriefValues=z.infer<typeof briefSchema>;
export type CorrectionValues=z.infer<typeof correctionSchema>;
export type ConnectionValues=z.infer<typeof settingsSchema>;
