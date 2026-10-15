import{c as e,f as t,g as n,h as r,i,m as a,t as o,v as s,y as c}from"./index-CKF_uRCw.js";import{n as l,t as u}from"./GlassCard-D1kOcGkd.js";var d=a(`arrow-right`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),f=c(s(),1),p=n(),m=`#version 300 es
precision highp float;
in vec2 aPoint;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFrame;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uCount;
uniform float uThickness;
uniform float uSoftness;
uniform float uWaves;
uniform float uSplit;
uniform float uFray;
uniform float uSeed;
uniform vec2 uTurn;
uniform vec4 uPart;
uniform float uTaper;
out float vEdge;
out float vBand;
out float vDraw;
out float vAlpha;
out float vIndex;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

void main() {
  float perc = float(gl_InstanceID) / uCount;
  float x = aPoint.x;
  float pixel = 1.0 / max(uResolution.x, uResolution.y);
  float splitPoint = uSplit + perc * uFray;
  float amplitudeNormal = smoothstep(splitPoint, max(0.7, splitPoint + 0.2), x);
  float finalAmplitude = amplitudeNormal * 0.5 * uAmplitude * (1.0 + (uMouse.y - 0.5) * 0.2);
  float timeScaled = uTime / 10.0 + (uMouse.x - 0.5);
  float blur = smoothstep(splitPoint, splitPoint + 0.05, x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(timeScaled * 2.5 + uSeed, (x * uWaves + perc) * 2.5)),
    Perlin2D(vec2(timeScaled * 3.5 + uSeed, (x * uWaves + timeScaled) * 3.5)) / 1.5,
    x * 0.3
  );
  float y = 0.5 + (perc - 0.5) * uDistance + xnoise / 2.0 * finalAmplitude;
  vec2 local = vec2((x - 0.5) * uFrame.x, (y - 0.5) * uFrame.y);
  if (uPart.z > 0.0) {
    vec2 delta = local - uPart.xy;
    float reach = uPart.w;
    float pull = exp(-dot(delta, delta) / (reach * reach));
    local.y += delta.y * pull * uPart.z;
  }
  float width = 7.0 * uThickness * pixel * (1.0 - perc);
  float band = (width / 2.0 + 10.0 * uSoftness * pixel * blur) * uFrame.y;
  float draw = max(band, 1.0);
  local.y += aPoint.y * draw;
  vec2 turned = vec2(local.x * uTurn.x - local.y * uTurn.y, local.x * uTurn.y + local.y * uTurn.x);
  gl_Position = vec4(turned / (uResolution * 0.5), 0.0, 1.0);
  vEdge = aPoint.y * draw;
  vBand = band;
  vDraw = draw;
  vAlpha = 1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3)) * uTaper;
  vIndex = perc;
}`,h=`#version 300 es
precision highp float;
in float vEdge;
in float vBand;
in float vDraw;
in float vAlpha;
in float vIndex;
uniform vec3 uColor;
uniform vec3 uAccent;
out vec4 outColor;
void main() {
  float coverage = (1.0 - smoothstep(0.0, vDraw, abs(vEdge))) * (vBand / vDraw) * vAlpha;
  outColor = vec4(mix(uColor, uAccent, vIndex) * coverage, coverage);
}`,g=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,_=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uLines;
uniform vec2 uResolution;
uniform float uFade;
uniform float uOpacity;
uniform float uCurve;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / edge, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec4 lines = texture(uLines, vUv);
  float alpha = lines.a;
  vec3 color = alpha > 0.0001 ? lines.rgb / alpha : vec3(0.0);
  float mask = uOpacity;
  if (uFade > 0.0) {
    vec2 px = vUv * uResolution;
    float edge = uFade * min(uResolution.x, uResolution.y) * 0.5;
    mask *= smootherstep(edge, px.x) * smootherstep(edge, uResolution.x - px.x);
    mask *= smootherstep(edge, px.y) * smootherstep(edge, uResolution.y - px.y);
  }
  outColor = vec4(color * pow(alpha, uCurve), alpha) * mask;
}`,v=1920,y=(e,t,n)=>Math.min(n,Math.max(t,e)),b=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},x=(e,t,n)=>{let r=b(e,e.VERTEX_SHADER,t),i=b(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return!r||!i||!a?null:(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),e.getProgramParameter(a,e.LINK_STATUS)?a:(e.deleteProgram(a),null))},S=(e,t,n)=>{let r={};for(let i of n)r[i]=e.getUniformLocation(t,i);return r},C=({color:e=[1,1,1],accentColor:t,amplitude:n=1.7,distance:r=.4,enableMouseInteraction:i=!1,lineCount:a=90,thickness:o=.6,softness:s=1.3,speed:c=.6,waves:l=1.05,split:u=.04,fray:d=.5,angle:b=25,seed:C=0,parting:w=0,taper:T=.85,brightness:E=1.4,fade:D=0,opacity:O=1,paused:k=!1,...A})=>{let j=(0,f.useRef)(null),M=(0,f.useRef)(null),N=(0,f.useRef)(null),P={color:e,accentColor:t,colorKey:`${Array.isArray(e)?e.join(`,`):String(e)}|${Array.isArray(t)?t.join(`,`):String(t??``)}`,amplitude:n,distance:r,enableMouseInteraction:i,lineCount:y(Math.round(a),1,400),thickness:Math.max(0,o),softness:Math.max(0,s),speed:c,waves:Math.max(0,l),split:y(u,0,1),fray:y(d,0,1),angle:b,seed:C,parting:y(w,0,1),taper:y(T,0,1),brightness:y(E,.25,2),fade:y(D,0,1),opacity:y(O,0,1),paused:k},F=(0,f.useRef)(P);F.current=P,(0,f.useEffect)(()=>{let e=j.current,t=M.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=x(n,m,h),i=x(n,g,_);if(!r||!i)return;let a=S(n,r,[`uTime`,`uResolution`,`uFrame`,`uAmplitude`,`uDistance`,`uMouse`,`uCount`,`uThickness`,`uSoftness`,`uWaves`,`uSplit`,`uFray`,`uSeed`,`uTurn`,`uPart`,`uTaper`,`uColor`,`uAccent`]),o=S(n,i,[`uLines`,`uResolution`,`uFade`,`uOpacity`,`uCurve`]),s=n.createVertexArray(),c=n.createBuffer();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,c);let l=n.getAttribLocation(r,`aPoint`);n.enableVertexAttribArray(l),n.vertexAttribPointer(l,2,n.FLOAT,!1,0,0);let u=n.createVertexArray(),d=n.createBuffer();n.bindVertexArray(u),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let f=n.getAttribLocation(i,`aPosition`);n.enableVertexAttribArray(f),n.vertexAttribPointer(f,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let p=n.createTexture(),b=n.createFramebuffer();n.bindTexture(n.TEXTURE_2D,p),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let C=document.createElement(`canvas`);C.width=1,C.height=1;let w=C.getContext(`2d`,{willReadFrequently:!0}),T=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,E={time:0,width:1,height:1,segments:0,colorKey:``,color:[1,1,1],accent:[1,1,1],mouse:[.5,.5],targetMouse:[.5,.5],pointer:[0,0],targetPointer:[0,0],presence:0,inside:!1},D=0,O=0,k=!0,A=!0,P=e=>{if(Array.isArray(e))return[0,1,2].map(t=>y(Number(e[t]??1),0,1));if(!w)return[1,1,1];w.clearRect(0,0,1,1),w.fillStyle=`#ffffff`,w.fillStyle=String(e),w.fillRect(0,0,1,1);let[t,n,r]=w.getImageData(0,0,1,1).data;return[t/255,n/255,r/255]},I=e=>{e.colorKey!==E.colorKey&&(E.colorKey=e.colorKey,E.color=P(e.color),E.accent=e.accentColor===void 0||e.accentColor===null?E.color:P(e.accentColor))},L=e=>{if(e===E.segments)return;E.segments=e;let t=new Float32Array((e+1)*4);for(let n=0;n<=e;n++){let r=n/e;t.set([r,-1,r,1],n*4)}n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,t,n.STATIC_DRAW)},R=()=>{let r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(window.devicePixelRatio||1,2),o=Math.max(r,i)*a,s=o>v?a*v/o:a;t.width=Math.max(1,Math.round(r*s)),t.height=Math.max(1,Math.round(i*s)),E.width=r,E.height=i,n.bindTexture(n.TEXTURE_2D,p),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,t.width,t.height,0,n.RGBA,n.UNSIGNED_BYTE,null),n.bindFramebuffer(n.FRAMEBUFFER,b),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,p,0),n.bindFramebuffer(n.FRAMEBUFFER,null),L(y(Math.round(r/3),96,640)),z()},z=()=>{let e=F.current;I(e);let c=t.width,l=t.height,d=e.angle*Math.PI/180,f=Math.cos(d),m=Math.sin(d),h=Math.abs(c*f)+Math.abs(l*m),g=Math.abs(c*m)+Math.abs(l*f),_=c/E.width,v=e.enableMouseInteraction?E.mouse:[.5,.5],y=e.parting*E.presence*2,x=E.pointer[0]*_,S=E.pointer[1]*_,C=[x*f+S*m,-x*m+S*f];n.bindFramebuffer(n.FRAMEBUFFER,b),n.viewport(0,0,c,l),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r),n.uniform1f(a.uTime,E.time),n.uniform2f(a.uResolution,c,l),n.uniform2f(a.uFrame,h,g),n.uniform1f(a.uAmplitude,e.amplitude),n.uniform1f(a.uDistance,e.distance),n.uniform2f(a.uMouse,v[0],v[1]),n.uniform1f(a.uCount,e.lineCount),n.uniform1f(a.uThickness,e.thickness),n.uniform1f(a.uSoftness,e.softness),n.uniform1f(a.uWaves,e.waves),n.uniform1f(a.uSplit,e.split),n.uniform1f(a.uFray,e.fray),n.uniform1f(a.uSeed,e.seed*13.37),n.uniform2f(a.uTurn,f,m),n.uniform4f(a.uPart,C[0],C[1],y,Math.min(c,l)*.16),n.uniform1f(a.uTaper,e.taper),n.uniform3f(a.uColor,E.color[0],E.color[1],E.color[2]),n.uniform3f(a.uAccent,E.accent[0],E.accent[1],E.accent[2]),n.bindVertexArray(s),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,(E.segments+1)*2,e.lineCount),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,c,l),n.disable(n.BLEND),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(i),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p),n.uniform1i(o.uLines,0),n.uniform2f(o.uResolution,c,l),n.uniform1f(o.uFade,e.fade),n.uniform1f(o.uOpacity,e.opacity),n.uniform1f(o.uCurve,2/e.brightness),n.bindVertexArray(u),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},B=e=>{if(D=0,!A||!k||document.hidden)return;let t=F.current,n=O?Math.min(.05,(e-O)/1e3):1/60;O=e;let r=!t.paused&&!T;r&&(E.time+=n*t.speed);let i=1-Math.exp(-n*3);E.mouse[0]+=(E.targetMouse[0]-E.mouse[0])*i,E.mouse[1]+=(E.targetMouse[1]-E.mouse[1])*i;let a=1-Math.exp(-n*10);E.pointer[0]+=(E.targetPointer[0]-E.pointer[0])*a,E.pointer[1]+=(E.targetPointer[1]-E.pointer[1])*a,E.presence+=((E.inside&&t.parting>0?1:0)-E.presence)*(1-Math.exp(-n*4)),z();let o=Math.abs(E.targetMouse[0]-E.mouse[0])>5e-4||Math.abs(E.targetMouse[1]-E.mouse[1])>5e-4||Math.abs(E.targetPointer[0]-E.pointer[0])>.05||Math.abs(E.targetPointer[1]-E.pointer[1])>.05||Math.abs((E.inside&&t.parting>0?1:0)-E.presence)>.002;r||o?D=requestAnimationFrame(B):O=0},V=()=>{!D&&A&&k&&!document.hidden&&(D=requestAnimationFrame(B))},H=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width),i=(t.clientY-n.top)/Math.max(1,n.height),a=r>=0&&r<=1&&i>=0&&i<=1;a?(E.targetMouse=[r,1-i],E.targetPointer=[t.clientX-n.left-n.width/2,n.height/2-(t.clientY-n.top)],!E.inside&&E.presence<.01&&(E.pointer=[...E.targetPointer])):E.inside&&(E.targetMouse=[.5,.5]),E.inside=a,V()},U=()=>{E.inside=!1,E.targetMouse=[.5,.5],V()},W=()=>{O=0,V()},G=new ResizeObserver(R);G.observe(e);let K=new IntersectionObserver(e=>{k=e.some(e=>e.isIntersecting),k&&(O=0,V())});return K.observe(e),window.addEventListener(`pointermove`,H,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,U),document.addEventListener(`visibilitychange`,W),R(),N.current=()=>{D||z(),V()},()=>{A=!1,cancelAnimationFrame(D),N.current=null,G.disconnect(),K.disconnect(),window.removeEventListener(`pointermove`,H),document.documentElement.removeEventListener(`pointerleave`,U),document.removeEventListener(`visibilitychange`,W),n.deleteFramebuffer(b),n.deleteTexture(p),n.deleteBuffer(c),n.deleteBuffer(d),n.deleteVertexArray(s),n.deleteVertexArray(u),n.deleteProgram(r),n.deleteProgram(i)}},[]),(0,f.useEffect)(()=>{N.current?.()});let{className:I=``,...L}=A;return(0,p.jsx)(`div`,{ref:j,className:`relative h-full w-full${I?` ${I}`:``}`,...L,children:(0,p.jsx)(`canvas`,{ref:M,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};function w(){return(0,p.jsxs)(`div`,{className:`flex flex-col gap-12`,children:[(0,p.jsx)(l,{children:(0,p.jsxs)(u,{as:`section`,className:`relative overflow-hidden p-7 sm:p-10 min-h-[500px]`,children:[(0,p.jsx)(`div`,{className:`absolute inset-0 z-0`,children:(0,p.jsx)(C,{color:`#7C3AED`,lineCount:90,thickness:.6,softness:1.3,amplitude:1.7,distance:.4,waves:1.05,speed:.6,split:.04,fray:.5,angle:25,taper:.85,brightness:1.4,parting:0,enableMouseInteraction:!0,fade:0,opacity:1,seed:0})}),(0,p.jsxs)(`div`,{className:`relative z-10 pointer-events-none`,children:[(0,p.jsx)(`div`,{className:`pointer-events-auto inline-block`,children:(0,p.jsx)(o,{label:e.status})}),(0,p.jsx)(`p`,{className:`mt-6 text-lg text-muted-foreground`,children:e.greeting}),(0,p.jsx)(`h1`,{className:`mt-2 max-w-[22ch] text-display font-extrabold tracking-tight`,children:e.title}),(0,p.jsx)(`p`,{className:`mt-4 max-w-[62ch] text-muted-foreground`,children:e.intro}),(0,p.jsxs)(`div`,{className:`mt-7 flex flex-wrap gap-3 pointer-events-auto`,children:[(0,p.jsxs)(r,{to:`/work`,className:`inline-flex min-h-11 items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5`,children:[`View My Work`,(0,p.jsx)(d,{"aria-hidden":`true`,className:`size-4`})]}),(0,p.jsxs)(r,{to:`/contact`,className:`inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-muted/80 backdrop-blur-sm px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-strong`,children:[(0,p.jsx)(t,{"aria-hidden":`true`,className:`size-4`}),`Contact Me`]})]})]})]})}),(0,p.jsx)(`section`,{"aria-label":`Profile summary`,className:`grid gap-4 sm:grid-cols-2 xl:grid-cols-4`,children:i.map((e,t)=>(0,p.jsx)(l,{delay:.06*(t+1),children:(0,p.jsxs)(u,{interactive:!0,className:`h-full`,children:[(0,p.jsxs)(`p`,{className:`label-eyebrow`,children:[e.no,` — `,e.label]}),(0,p.jsx)(`p`,{className:`mt-3 text-lg font-bold`,children:e.value})]})},e.no))}),(0,p.jsx)(l,{delay:.3,children:(0,p.jsxs)(u,{as:`section`,"aria-label":`Current activity`,className:`grid gap-4 sm:grid-cols-3`,children:[(0,p.jsxs)(`div`,{className:`inset-panel p-4`,children:[(0,p.jsx)(`p`,{className:`label-eyebrow`,children:`Current focus`}),(0,p.jsx)(`p`,{className:`mt-1.5 font-semibold`,children:e.meta.focus})]}),(0,p.jsxs)(`div`,{className:`inset-panel p-4`,children:[(0,p.jsx)(`p`,{className:`label-eyebrow`,children:`Projects`}),(0,p.jsx)(`p`,{className:`mt-1.5 font-semibold`,children:`04+`})]}),(0,p.jsxs)(`div`,{className:`inset-panel p-4`,children:[(0,p.jsx)(`p`,{className:`label-eyebrow`,children:`Design tool`}),(0,p.jsx)(`p`,{className:`mt-1.5 font-semibold`,children:e.meta.designTool})]})]})})]})}export{w as component};