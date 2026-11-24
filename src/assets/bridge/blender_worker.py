# Runs only inside a locally installed Blender. No client-supplied code is executed.
import bpy, json, sys, re
from mathutils import Matrix, Vector
from pathlib import Path
request=json.loads(Path(sys.argv[sys.argv.index('--')+1]).read_text())
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=request['source'])
operation=request['operation'];args=request['arguments'];output=request['output']
if operation=='rig_part':
    for obj in list(bpy.context.scene.objects):
        if obj.type!='MESH' or not re.search(r'door|hood|trunk|boot|lid|drawer|fuel.?cap',obj.name,re.I): continue
        if obj.parent and obj.parent.get('showtime_hinge'): continue
        name=obj.name;points=[obj.matrix_world@Vector(p) for p in obj.bound_box]
        lower=Vector(tuple(min(p[i] for p in points) for i in range(3)))
        upper=Vector(tuple(max(p[i] for p in points) for i in range(3)))
        # Geometric fallback only: accurate axes require named separated parts and model-specific pivots.
        center=(lower+upper)/2;axis='y'
        if re.search(r'hood|trunk|boot|lid',name,re.I): center.x=lower.x;axis='z'
        elif not re.search(r'drawer',name,re.I): center.x=upper.x
        hinge=bpy.data.objects.new(name+'_hinge',None);bpy.context.collection.objects.link(hinge)
        hinge.location=center;hinge['showtime_hinge']=True
        hinge['rig']={'axis':axis,'max':0.65 if 'drawer' in name.lower() else 70,'direction':1,'slide':'drawer' in name.lower()}
        world=obj.matrix_world.copy();obj.name=name+'_panel';obj.parent=hinge;obj.matrix_world=world
elif operation=='modify_material':
    description=args.get('description','').lower()
    colors={'red':(0.5,0.025,0.02,1),'blue':(0.025,0.12,0.25,1),'green':(0.12,0.25,0.17,1),'orange':(0.6,0.15,0.025,1),'ivory':(0.75,0.72,0.65,1)}
    for material in bpy.data.materials:
        material.use_nodes=True;node=material.node_tree.nodes.get('Principled BSDF')
        if not node: continue
        for word,color in colors.items():
            if word in description: node.inputs['Base Color'].default_value=color
        node.inputs['Roughness'].default_value=0.55 if any(word in description for word in ['matte','satin']) else 0.22
        node.inputs['Metallic'].default_value=0.7 if 'metal' in description else 0.15
if output.endswith('.fbx'):
    bpy.ops.export_scene.fbx(filepath=output,apply_unit_scale=True,add_leaf_bones=False,bake_anim=True)
else:
    bpy.ops.export_scene.gltf(filepath=output,export_format='GLB',export_extras=True,export_animations=True)
