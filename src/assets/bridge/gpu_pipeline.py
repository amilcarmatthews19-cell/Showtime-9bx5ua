# Trusted private-workstation pipeline. Models and Blender are installed separately.
import base64, importlib.util, json, os, shlex, shutil, subprocess, tempfile, threading
from pathlib import Path
from fastapi import HTTPException
from pydantic import BaseModel, Field
LOCK=threading.RLock();CURRENT=None;MODEL=None;ROOT=Path(tempfile.mkdtemp(prefix='showtime-'))
class GenerateRequest(BaseModel):
    prompt:str=Field(max_length=4000)
    images:list[str]=Field(default_factory=list,max_length=6)
    feedback:str=Field(default='',max_length=4000)
    metadata:str=Field(default='',max_length=8000)
    articulation:str=Field(default='',max_length=4000)
    previous:dict|None=None
    previous_glb_base64:str|None=Field(default=None,max_length=112000000)
    scale_constraints:list[dict]=Field(default_factory=list)
    image_guided:bool=True
    multi_tool:bool=False
    safe_mode:bool=True
    parameters:dict|None=None
class ExportRequest(BaseModel):
    format:str
    glb_base64:str=Field(max_length=112000000)
def prune():
    files=sorted(ROOT.iterdir(),key=lambda path:path.stat().st_mtime,reverse=True)
    for path in files[60:]:
        if path!=CURRENT: path.unlink(missing_ok=True)
def worker(operation,arguments,source=None):
    global CURRENT
    with LOCK:
        source=source or CURRENT
        if not source: raise HTTPException(409,'Generate or provide an asset first')
        blender=shutil.which(os.environ.get('BLENDER_BIN','blender'))
        if not blender: raise HTTPException(503,'Install Blender for FBX and rig tools')
        output=ROOT/(os.urandom(8).hex()+('.fbx' if arguments.get('format')=='fbx' else '.glb'))
        request=output.with_suffix('.json');request.write_text(json.dumps({'operation':operation,'arguments':arguments,'source':str(source),'output':str(output)}))
        run=subprocess.run([blender,'--background','--python',str(Path(__file__).with_name('blender_worker.py')),'--',str(request)],capture_output=True,timeout=150)
        if run.returncode or not output.is_file(): raise HTTPException(500,run.stderr.decode(errors='replace')[-400:] or 'Blender produced no asset')
        if output.stat().st_size>80000000: raise HTTPException(413,'Export exceeds 80 MB')
        if output.suffix=='.glb': CURRENT=output
        return output
def generate_asset(request):
    global CURRENT,MODEL
    with LOCK:
        prune();output=ROOT/(os.urandom(8).hex()+'.glb');command=os.environ.get('SHOWTIME_GENERATOR')
        if command:
            spec=output.with_suffix('.json');spec.write_text(request.model_dump_json())
            subprocess.run(shlex.split(command)+['--request',str(spec),'--output',str(output)],check=True,timeout=240)
        elif os.environ.get('SHOWTIME_MODEL')=='hunyuan' and request.images and request.image_guided:
            from PIL import Image
            from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
            data=request.images[0].split(',')[-1]
            if len(data)>12000000: raise HTTPException(413,'Reference image exceeds 8 MB')
            image_file=output.with_suffix('.png');image_file.write_bytes(base64.b64decode(data,validate=True))
            if MODEL is None: MODEL=Hunyuan3DDiTFlowMatchingPipeline.from_pretrained('tencent/Hunyuan3D-2')
            mesh=MODEL(image=Image.open(image_file).convert('RGBA'))[0]
            boxes=request.scale_constraints
            if boxes and boxes[0].get('meters'): mesh.apply_scale(float(boxes[0]['meters'])/max(mesh.extents))
            mesh.export(output)
        else: raise HTTPException(503,'Configure SHOWTIME_GENERATOR for text/multiview, or install Hunyuan and enable image guidance')
        if not output.is_file() or output.stat().st_size>80000000: raise HTTPException(500,'Generator must return GLB under 80 MB')
        CURRENT=output
        if request.multi_tool:
            worker('rig_part',{'detect':True});worker('modify_material',{'description':request.feedback or request.prompt});output=CURRENT
        return output
def health():
    command=os.environ.get('SHOWTIME_GENERATOR')
    configured=bool(command and shutil.which(shlex.split(command)[0])) or (os.environ.get('SHOWTIME_MODEL')=='hunyuan' and importlib.util.find_spec('hy3dgen') is not None)
    return {'status':'ready' if configured else 'bridge_ready','generator_ready':configured,'fbx_ready':bool(shutil.which(os.environ.get('BLENDER_BIN','blender')))}
def decode_source(data):
    if len(data)>112000000: raise HTTPException(413,'Asset exceeds 80 MB')
    path=ROOT/(os.urandom(8).hex()+'.glb');path.write_bytes(base64.b64decode(data,validate=True));return path
