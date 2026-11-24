# pip install fastapi 'uvicorn[standard]' pillow
# Download all three bridge files to the same directory.
# Install Hunyuan3D-2 separately and set SHOWTIME_MODEL=hunyuan, or
# SHOWTIME_GENERATOR='your_cli' (receives --request FILE --output FILE).
# CORS_ORIGINS=http://localhost:5173 uvicorn server_bridge:app --host 0.0.0.0 --port 8000
# MCP URL: ws://YOUR_PC:8000/mcp. HTTPS sites require HTTPS/WSS reverse proxy.
# Private trusted LAN only. Do not expose this unauthenticated development bridge publicly.
import asyncio,base64,json,os
from fastapi import FastAPI,HTTPException,WebSocket,WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from gpu_pipeline import GenerateRequest,ExportRequest,generate_asset,worker,health,decode_source
app=FastAPI(title='Showtime GPU + Blender Bridge')
ORIGINS=os.environ.get('CORS_ORIGINS','http://localhost:5173,http://127.0.0.1:5173').split(',')
app.add_middleware(CORSMiddleware,allow_origins=ORIGINS,allow_methods=['GET','POST'],allow_headers=['Content-Type'])
@app.get('/health')
def status(): return health()
@app.post('/generate')
def generate(request:GenerateRequest): return FileResponse(generate_asset(request),media_type='model/gltf-binary')
@app.post('/export')
def export(request:ExportRequest):
    if request.format!='fbx': raise HTTPException(400,'Only FBX conversion is handled here')
    path=worker('export_scene',{'format':'fbx'},decode_source(request.glb_base64))
    return FileResponse(path,media_type='application/octet-stream')
@app.websocket('/mcp')
async def mcp(socket:WebSocket):
    if socket.headers.get('origin') not in ORIGINS: await socket.close(code=1008);return
    await socket.accept()
    try:
        while True:
            message=await socket.receive_json();identifier=message.get('id');method=message.get('method')
            if identifier is None: continue
            try:
                if method=='initialize': result={'protocolVersion':'2024-11-05','capabilities':{'tools':{}},'serverInfo':{'name':'Showtime Blender','version':'2'}}
                elif method=='tools/list': result={'tools':[{'name':name,'description':name,'inputSchema':{'type':'object','additionalProperties':True}} for name in ['generate_mesh','rig_part','modify_material','export_scene']]}
                elif method=='tools/call':
                    params=message['params'];name=params['name'];args=params.get('arguments',{})
                    if name=='generate_mesh':
                        args['multi_tool']=False
                        path=await asyncio.to_thread(generate_asset,GenerateRequest(**args))
                    elif name=='export_scene' and args.get('glb_base64'): path=await asyncio.to_thread(worker,name,args,decode_source(args['glb_base64']))
                    elif name in ['rig_part','modify_material','export_scene']: path=await asyncio.to_thread(worker,name,args)
                    else: raise ValueError('Tool not allowed')
                    data={'complete':True} if name in ['rig_part','modify_material'] else {'glb_base64':base64.b64encode(path.read_bytes()).decode()}
                    result={'content':[{'type':'text','text':json.dumps(data)}]}
                else: raise ValueError('Method not supported')
                await socket.send_json({'jsonrpc':'2.0','id':identifier,'result':result})
            except Exception as error: await socket.send_json({'jsonrpc':'2.0','id':identifier,'error':{'code':-32000,'message':str(error)[:400]}})
    except WebSocketDisconnect: pass
