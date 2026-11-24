import { validateEndpoint } from '@/lib/networkSafety';
export type MCPTool='generate_mesh'|'rig_part'|'modify_material'|'export_scene';
interface MCPResponse {jsonrpc?:string;id?:string;result?:unknown;error?:{message:string};}
export class MCPClient {
 private socket?:WebSocket;private pending=new Map<string,{resolve:(value:unknown)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>();
 constructor(public endpoint='ws://localhost:8765'){}
 async connect(){validateEndpoint(this.endpoint,true);if(this.socket?.readyState===WebSocket.OPEN)return;await new Promise<void>((resolve,reject)=>{const socket=new WebSocket(this.endpoint);this.socket=socket;const timer=setTimeout(()=>{socket.close();reject(new Error('MCP connection timed out.'));},8000);socket.onopen=()=>{clearTimeout(timer);resolve();};socket.onerror=()=>{clearTimeout(timer);reject(new Error('MCP bridge is unreachable. Check WSS, firewall and bridge URL.'));};socket.onmessage=event=>{if(typeof event.data!=='string'||event.data.length>112*1024*1024)return;void Promise.resolve().then(()=>JSON.parse(event.data) as MCPResponse).then(message=>{if(!message.id)return;const call=this.pending.get(message.id);if(!call)return;clearTimeout(call.timer);this.pending.delete(message.id);message.error?call.reject(new Error(message.error.message)):call.resolve(message.result);}).catch(()=>console.warn('[Showtime] Invalid MCP message ignored'));};socket.onclose=()=>{this.pending.forEach(call=>{clearTimeout(call.timer);call.reject(new Error('MCP bridge disconnected.'));});this.pending.clear();};});
 const info=await this.request('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'Showtime',version:'2.0'}},12000);console.log('[Showtime] MCP initialized',info);this.socket?.send(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'}));
 }
 private request(method:string,params:Record<string,unknown>,timeout=300000){if(this.socket?.readyState!==WebSocket.OPEN)return Promise.reject(new Error('MCP is not connected.'));const id=crypto.randomUUID();return new Promise<unknown>((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error(`MCP ${method} timed out.`));},timeout);this.pending.set(id,{resolve,reject,timer});this.socket!.send(JSON.stringify({jsonrpc:'2.0',id,method,params}));});}
 async callTool(name:MCPTool,args:Record<string,unknown>){await this.connect();console.log('[Showtime] MCP tool',name);const result=await this.request('tools/call',{name,arguments:args});if(result&&typeof result==='object'&&'isError' in result&&result.isError)throw new Error('The MCP tool reported a failure. Check the Blender bridge logs.');return result;}
 async listTools(){await this.connect();return this.request('tools/list',{},12000);}
 close(){this.socket?.close();}
 static tools:MCPTool[]=['generate_mesh','rig_part','modify_material','export_scene'];
}
