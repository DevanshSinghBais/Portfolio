import{a as e,i as t,r as n}from"./index-CxIZeVMz.js";import{_ as r,a as i,f as a,h as o,i as s,p as c,r as l,t as u,v as d}from"./three.module-Dp6Jmow-.js";var f=e(t(),1),p=n(),m={kicker:`HOLD STILL`,word:`COMPOSED`,sub:`a surface at rest`},h={kicker:`LOOK CLOSER`,word:`FRACTURED`,sub:`every calm surface has a fault line`},ee=`
  attribute vec2 aUv;
  attribute float aEdge;
  varying vec2 vUv;
  varying float vEdge;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vUv = aUv;
    vEdge = aEdge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalMatrix * normal;
    vViewDir = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`,g=`
  precision highp float;
  varying vec2 vUv;
  varying float vEdge;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  uniform sampler2D uFront;
  uniform sampler2D uBack;
  uniform float uOpen;
  uniform float uReveal;   // global floor so the card never reads fully dead

  void main() {
    vec3 N = normalize(vNormalV);
    vec3 V = normalize(vViewDir);
    float open = clamp(uOpen, 0.0, 1.0);
    float o = smoothstep(0.0, 1.0, open);

    // refraction: bend the back layer by the shard's tilt, harder as it opens
    vec2 off = N.xy * (0.010 + 0.060 * open);
    vec2 caDir = normalize(N.xy + vec2(1e-4));
    float ca = 0.004 + 0.016 * open;
    vec3 back;
    back.r = texture2D(uBack, vUv + off + caDir * ca).r;
    back.g = texture2D(uBack, vUv + off).g;
    back.b = texture2D(uBack, vUv + off - caDir * ca).b;

    vec3 front = texture2D(uFront, vUv).rgb;
    vec3 base = mix(front, back, o);

    // glass shading
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float bevel = smoothstep(0.0, 0.40, 1.0 - vEdge);   // 1 near the cut edge
    vec3 L = normalize(vec3(-0.5, 0.7, 0.75));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 42.0);

    vec3 col = base;
    col += fres * (0.10 + 0.10 * (1.0 - open)) * vec3(0.82, 0.90, 1.0); // cool rim, softer when open
    col += bevel * (0.05 + 0.18 * open) * vec3(1.0);      // cut edges catch light
    col += spec * (0.30 + 0.45 * open);                   // specular glint
    col -= bevel * (1.0 - open) * 0.17;                   // etched crack lines at rest
    col = mix(col, col * 1.03 + 0.015, uReveal);

    gl_FragColor = vec4(col, 1.0);
  }
`,_=`
  attribute vec2 aUv;
  varying vec2 vUv;
  void main() {
    vUv = aUv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,v=`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uBack;
  void main() {
    vec3 c = texture2D(uBack, vUv).rgb;
    vec2 q = vUv - 0.5;
    float vig = 1.0 - dot(q, q) * 0.55;
    gl_FragColor = vec4(c * vig, 1.0);
  }
`;function te(e,t,n,r,i){let a=t-r,o=n-i,s=(t+r)/2,c=(n+i)/2,l=e=>(e.x-s)*a+(e.y-c)*o>=0,u=[];for(let t=0;t<e.length;t++){let n=e[t],r=e[(t+e.length-1)%e.length],i=l(n);if(i!==l(r)){let e=n.x-r.x,t=n.y-r.y,i=e*a+t*o;if(Math.abs(i)>1e-9){let n=((s-r.x)*a+(c-r.y)*o)/i;u.push({x:r.x+n*e,y:r.y+n*t})}}i&&u.push(n)}return u}function y(){let e=(0,f.useRef)(null);return(0,f.useEffect)(()=>{let t=e.current;if(!t)return;let n=new URLSearchParams(window.location.search).has(`card`),f=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,p=document.createElement(`canvas`);p.className=`kxf-gl`,t.appendChild(p);let y=new u({canvas:p,antialias:!0,alpha:!1});y.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),y.setClearColor(15331060,1);let b=new r,x=new o(40,1,.1,100);x.position.set(0,0,10),x.lookAt(0,0,0);let S=10*Math.tan(Math.PI/180*20),C=S,w=document.createElement(`canvas`),T=document.createElement(`canvas`),E=new i(w),D=new i(T);for(let e of[E,D])e.flipY=!1,e.minFilter=a,e.magFilter=a,e.generateMipmaps=!1;let O={uFront:{value:E},uBack:{value:D},uReveal:{value:0}},k=new d({vertexShader:_,fragmentShader:v,uniforms:{uBack:{value:D}}}),A=new s,j=new c(A,k);j.position.z=-.02,b.add(j);function ne(){let e=C*1.06,t=S*1.06,n=new Float32Array([-e,-t,0,e,-t,0,e,t,0,-e,t,0]),r=new Float32Array([.5-e/(2*C),.5+t/(2*S),.5+e/(2*C),.5+t/(2*S),.5+e/(2*C),.5-t/(2*S),.5-e/(2*C),.5-t/(2*S)]);A.setAttribute(`position`,new l(n,3)),A.setAttribute(`aUv`,new l(r,2)),A.setIndex([0,1,2,0,2,3])}let M=[];function N(){for(let e of M)b.remove(e.mesh),e.mesh.geometry.dispose(),e.mat.dispose();M=[]}function P(){N();let e=C*1.06,t=S*1.06,n=C/S,r=Math.max(4,Math.round(6*Math.sqrt(n))),i=Math.max(4,Math.round(6/Math.sqrt(n))),a=[];for(let n=0;n<i;n++)for(let o=0;o<r;o++){let s=(Math.random()-.5)*.9,c=(Math.random()-.5)*.9;a.push({x:-e+(o+.5+s)/r*2*e,y:-t+(n+.5+c)/i*2*t})}let o=[{x:-e,y:-t},{x:e,y:-t},{x:e,y:t},{x:-e,y:t}];for(let e=0;e<a.length;e++){let t=a[e],n=o;for(let r=0;r<a.length&&n.length>=3;r++)r!==e&&(n=te(n,t.x,t.y,a[r].x,a[r].y));if(n.length<3)continue;let r=0,i=0;for(let e of n)r+=e.x,i+=e.y;r/=n.length,i/=n.length;let u=n.length,f=new Float32Array((u+1)*3),p=new Float32Array((u+1)*2),m=new Float32Array(u+1);f[0]=0,f[1]=0,f[2]=0,p[0]=.5+r/(2*C),p[1]=.5-i/(2*S),m[0]=1;for(let e=0;e<u;e++){let t=n[e];f[(e+1)*3]=t.x-r,f[(e+1)*3+1]=t.y-i,f[(e+1)*3+2]=0,p[(e+1)*2]=.5+t.x/(2*C),p[(e+1)*2+1]=.5-t.y/(2*S),m[e+1]=0}let h=new Float32Array((u+1)*3);for(let e=0;e<=u;e++)h[e*3+2]=1;let _=[];for(let e=0;e<u;e++)_.push(0,e+1,(e+1)%u+1);let v=new s;v.setAttribute(`position`,new l(f,3)),v.setAttribute(`normal`,new l(h,3)),v.setAttribute(`aUv`,new l(p,2)),v.setAttribute(`aEdge`,new l(m,1)),v.setIndex(_);let y=new d({vertexShader:ee,fragmentShader:g,uniforms:{uFront:O.uFront,uBack:O.uBack,uReveal:O.uReveal,uOpen:{value:0}}}),x=new c(v,y);x.position.set(r,i,0),b.add(x),M.push({mesh:x,mat:y,cx:r,cy:i,open:0,ov:0,spin:(Math.random()-.5)*2,broken:!1,vx:0,vy:0,vz:0,rvx:0,rvy:0,rvz:0})}}function F(e,t){let n=e.getContext(`2d`);if(!n)return;let r=e.width,i=e.height;if(n.clearRect(0,0,r,i),t===`front`){let e=n.createLinearGradient(0,0,r*.4,i);e.addColorStop(0,`#f2f6fa`),e.addColorStop(.55,`#e3eaf1`),e.addColorStop(1,`#d4dde7`),n.fillStyle=e,n.fillRect(0,0,r,i);let t=n.createRadialGradient(r*.5,i*.42,0,r*.5,i*.42,i*.9);t.addColorStop(0,`rgba(255,255,255,0.5)`),t.addColorStop(1,`rgba(210,222,234,0)`),n.fillStyle=t,n.fillRect(0,0,r,i)}else{let e=n.createLinearGradient(0,0,r,i);e.addColorStop(0,`#0a0a16`),e.addColorStop(.42,`#241056`),e.addColorStop(.72,`#7a1e74`),e.addColorStop(1,`#c43a5f`),n.fillStyle=e,n.fillRect(0,0,r,i);let t=n.createRadialGradient(r*.7,i*.3,0,r*.7,i*.3,i*.8);t.addColorStop(0,`rgba(255,90,150,0.45)`),t.addColorStop(1,`rgba(255,90,150,0)`),n.fillStyle=t,n.fillRect(0,0,r,i);let a=n.createRadialGradient(r*.2,i*.7,0,r*.2,i*.7,i*.7);a.addColorStop(0,`rgba(80,120,255,0.4)`),a.addColorStop(1,`rgba(80,120,255,0)`),n.fillStyle=a,n.fillRect(0,0,r,i)}let a=t===`front`?m:h,o=t===`front`?`#8aa0b6`:`#fbeeff`,s=r*.5,c=a.word,l=Math.min(r*.16,i*.34);n.font=`800 ${Math.round(l)}px "Syne", system-ui, sans-serif`;let u=r*.84,d=n.measureText(c).width;d>u&&(l*=u/d),n.textAlign=`center`,n.textBaseline=`middle`,n.save(),n.fillStyle=o,n.globalAlpha=t===`front`?.55:.78,n.font=`500 ${Math.round(l*.11)}px "Spline Sans Mono", monospace`,I(n,a.kicker.toUpperCase(),s,i*.5-l*.72,l*.11*.42),n.restore(),n.save(),n.fillStyle=o,t===`front`?(n.globalAlpha=.92,n.shadowColor=`rgba(150,170,190,0.85)`,n.shadowBlur=l*.06):(n.shadowColor=`rgba(255,150,210,0.55)`,n.shadowBlur=l*.1),n.font=`800 ${Math.round(l)}px "Syne", system-ui, sans-serif`,n.fillText(c,s,i*.5),n.restore(),n.save(),n.fillStyle=o,n.globalAlpha=t===`front`?.4:.6,n.font=`400 ${Math.round(l*.085)}px "Spline Sans Mono", monospace`,I(n,a.sub.toUpperCase(),s,i*.5+l*.66,l*.085*.3),n.restore()}function I(e,t,n,r,i){let a=[...t].map(t=>e.measureText(t).width+i),o=n-(a.reduce((e,t)=>e+t,0)-i)/2,s=e.textAlign;e.textAlign=`left`;for(let n=0;n<t.length;n++)e.fillText(t[n],o,r),o+=a[n];e.textAlign=s}function L(){F(w,`front`),F(T,`back`),E.needsUpdate=!0,D.needsUpdate=!0}function R(){let e=t.clientWidth||window.innerWidth,n=t.clientHeight||window.innerHeight;y.setSize(e,n,!1);let r=e/n;x.aspect=r,x.updateProjectionMatrix(),S=10*Math.tan(Math.PI/180*20),C=S*r;let i=Math.min(window.devicePixelRatio||1,2),a=Math.round(e*i),o=Math.round(n*i),s=2200;a>s&&(o=Math.round(s/a*o),a=s);for(let e of[w,T])e.width=a,e.height=o;ne(),P(),L()}document.fonts&&`load`in document.fonts&&(document.fonts.load(`800 100px "Syne"`).then(L).catch(()=>{}),document.fonts.load(`500 40px "Spline Sans Mono"`).then(L).catch(()=>{})),R();let z=!1,B=new ResizeObserver(()=>{z||(z=!0,requestAnimationFrame(()=>{z=!1,R()}))});B.observe(t);let V={x:1e9,y:1e9},H=!1;function U(e,n){let r=t.getBoundingClientRect(),i=(e-r.left)/r.width,a=(n-r.top)/r.height;V.x=(i-.5)*2*C,V.y=(.5-a)*2*S}let W=e=>{H=!0,U(e.clientX,e.clientY)},G=()=>{H=!1,V.x=1e9,V.y=1e9};!n&&!f&&(t.addEventListener(`pointermove`,W),t.addEventListener(`pointerleave`,G));let K=.3,q=-S-3;function re(e,t,n){e.broken=!0;let r=e.cx-t,i=e.cy-n,a=Math.sqrt(r*r+i*i)||1;r/=a,i/=a,e.vx=r*(.5+Math.random()*1.4),e.vy=.7+Math.random()*1.2,e.vz=1+Math.random()*1.4,e.rvx=(Math.random()-.5)*6.5,e.rvy=(Math.random()-.5)*6.5,e.rvz=(Math.random()-.5)*5}function J(){for(let e of M)e.broken=!1,e.mesh.visible=!0,e.mesh.position.set(e.cx,e.cy,0),e.mesh.rotation.set(0,0,0),e.vx=e.vy=e.vz=e.rvx=e.rvy=e.rvz=0,e.ov=0,e.open=1,e.mat.uniforms.uOpen.value=1}if(f){M.forEach(e=>{e.cy<-S*.4&&e.cx>C*.2?e.mesh.visible=!1:(e.open=0,e.mat.uniforms.uOpen.value=0)}),O.uReveal.value=0;let e=()=>y.render(b,x);e();let t=window.setTimeout(e,420);return()=>{window.clearTimeout(t),B.disconnect(),N(),A.dispose(),k.dispose(),E.dispose(),D.dispose(),y.dispose(),p.remove()}}let Y=0,X=performance.now(),ie=X,Z=-1,Q=0;function $(e){let t=(e-ie)/1e3,r=Math.min(.033,(e-X)/1e3);X=e,O.uReveal.value=Math.min(1,O.uReveal.value+.02);let i=S*1.1,a=S*(n?.46:.4);n&&(V.x=C*.66*Math.sin(t*.75),V.y=S*.56*Math.sin(t*1.12+.6));let o=n||H,s=!0;for(let e of M){if(!e.broken){s=!1;let t=0;if(o){let n=V.x-e.cx,r=V.y-e.cy,o=Math.sqrt(n*n+r*r);if(o<a)re(e,V.x,V.y);else{let e=Math.max(0,1-o/i);t=Math.min(.3,e*e*.55)}}if(!e.broken){e.ov+=(t-e.open)*.18,e.ov*=.74,e.open+=e.ov,e.open<0&&(e.open=0,e.ov<0&&(e.ov=0));let n=e.open,r=e.cx-V.x,i=e.cy-V.y,a=Math.sqrt(r*r+i*i)||1;r/=a,i/=a,e.mesh.position.set(e.cx,e.cy,n*.5),e.mesh.rotation.set(i*n*K,-r*n*K,e.spin*n*.1),e.mat.uniforms.uOpen.value=n}}e.broken&&(e.vy+=-13*r,e.mesh.position.x+=e.vx*r,e.mesh.position.y+=e.vy*r,e.mesh.position.z+=e.vz*r,e.mesh.rotation.x+=e.rvx*r,e.mesh.rotation.y+=e.rvy*r,e.mesh.rotation.z+=e.rvz*r,e.open=Math.min(1,e.open+r*7),e.mat.uniforms.uOpen.value=e.open,e.mesh.position.y<q&&(e.mesh.visible=!1),e.mesh.visible&&(s=!1))}s?Z<0?Z=t:t-Z>1.6&&(J(),Z=-1):Z=-1,n||(H?Q=0:(Q+=r,Q>2.5&&M.some(e=>e.broken)&&(J(),Q=0))),y.render(b,x),Y=requestAnimationFrame($)}return Y=requestAnimationFrame($),()=>{cancelAnimationFrame(Y),B.disconnect(),t.removeEventListener(`pointermove`,W),t.removeEventListener(`pointerleave`,G),N(),A.dispose(),k.dispose(),E.dispose(),D.dispose(),y.dispose(),p.remove()}},[]),(0,p.jsxs)(`div`,{ref:e,className:`kxf-stage`,children:[(0,p.jsx)(`style`,{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Spline+Sans+Mono:wght@400;500&display=swap');
        .kxf-stage {
          position: fixed; inset: 0; overflow: hidden;
          background: #e9eef4; cursor: crosshair;
          font-family: "Spline Sans Mono", monospace;
        }
        .kxf-gl { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .kxf-chrome {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          color: #f3f1ea; mix-blend-mode: difference;
          text-transform: uppercase; letter-spacing: 0.16em;
        }
        .kxf-chrome span { position: absolute; font-size: 11px; font-weight: 500; white-space: nowrap; }
        .kxf-tl { top: 26px; left: 30px; font-weight: 700; letter-spacing: 0.04em; }
        .kxf-tr { top: 26px; right: 30px; }
        .kxf-bl { bottom: 26px; left: 30px; }
        .kxf-br { bottom: 26px; right: 30px; }
        @media (max-width: 640px) {
          .kxf-chrome span { font-size: 9px; letter-spacing: 0.12em; }
          .kxf-tl, .kxf-tr { top: 18px; }
          .kxf-tl, .kxf-bl { left: 18px; }
          .kxf-tr, .kxf-br { right: 18px; }
          .kxf-bl, .kxf-br { bottom: 18px; }
        }
      `}),(0,p.jsxs)(`div`,{className:`kxf-chrome`,children:[(0,p.jsx)(`span`,{className:`kxf-tl`,children:`Kexsio®`}),(0,p.jsx)(`span`,{className:`kxf-tr`,children:`Fracture · Shatter`}),(0,p.jsx)(`span`,{className:`kxf-bl`,children:`Move the cursor — break the surface`}),(0,p.jsx)(`span`,{className:`kxf-br`,children:`Shatter / 01`})]})]})}export{y as default};