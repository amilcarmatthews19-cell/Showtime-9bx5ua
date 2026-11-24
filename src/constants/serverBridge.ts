import server from '@/assets/bridge/server_bridge.py?raw';
import blender from '@/assets/bridge/blender_worker.py?raw';
import pipeline from '@/assets/bridge/gpu_pipeline.py?raw';
export const GPU_PIPELINE=pipeline;
export const SERVER_BRIDGE=server;
export const BLENDER_WORKER=blender;
