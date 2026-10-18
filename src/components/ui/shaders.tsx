import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Full-bleed WebGL backgrounds. Each renders one fragment shader on a single
// triangle, pauses when off screen or in a hidden tab, draws one still frame
// under prefers-reduced-motion, and falls back to a CSS gradient without WebGL.

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const HEAD = "precision highp float;uniform vec2 r;uniform float t;\nvec3 BG=vec3(.035,.035,.043);\n";
const GRAIN =
	"float grain(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453)-.5;}\n";

// Stripe-style ribbon sweeping in from the top right, blue to orange
const RIBBON = `${HEAD}${GRAIN}
vec3 pal(float s){
  vec3 a=vec3(.30,.40,1.),b=vec3(.62,.30,.96),c=vec3(.94,.22,.62),d=vec3(1.,.55,.28);
  s=clamp(s,0.,1.);
  if(s<.34) return mix(a,b,s/.34);
  if(s<.67) return mix(b,c,(s-.34)/.33);
  return mix(c,d,(s-.67)/.33);
}
void main(){
  vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;
  vec2 p=vec2(uv.x*asp,uv.y);
  vec3 col=BG;
  for(int i=0;i<4;i++){
    float fi=float(i);float y=p.y;
    float cx=asp*(.50+.07*fi)+(1.-y)*asp*.32+.06*sin(y*2.4+t*.30+fi*1.9);
    float w=.22+.16*(1.-y)+.03*sin(t*.25+fi*2.3);
    float s=(p.x-cx)/w;
    float m=smoothstep(1.,.15,abs(s))*(.55+.12*fi);
    float str=.82+.18*sin(s*70.+y*9.+fi*3.1+t*.5);
    col=mix(col,pal(s*.5+.5+fi*.1-.15)*str,m);
  }
  col+=grain(gl_FragCoord.xy)*.035;
  gl_FragColor=vec4(col,1.);
}`;

// Sunrise arc rising from the bottom edge, slowly breathing
const SUNRISE = `${HEAD}${GRAIN}
void main(){
  vec2 p=(gl_FragCoord.xy-vec2(r.x*.5,-r.y*.42))/r.y;
  p.x*=.42;
  float d=length(p)+.025*sin(t*.55);
  vec3 orange=vec3(.95,.48,.20),pink=vec3(.93,.45,.62),blue=vec3(.25,.45,.98),navy=vec3(.09,.12,.30);
  vec3 c=mix(orange,pink,smoothstep(.30,.62,d));
  c=mix(c,blue,smoothstep(.58,.90,d));
  c=mix(c,navy,smoothstep(.86,1.08,d));
  c=mix(c,BG,smoothstep(1.02,1.30,d));
  c+=grain(gl_FragCoord.xy)*.04;
  gl_FragColor=vec4(c,1.);
}`;

const STILL_TIME = 12;
const MAX_DPR = 1.5;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("createShader failed");
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
	}
	return shader;
}

interface ShaderCanvasProps {
	frag: string;
	fallback: string;
	className?: string;
}

function ShaderCanvas({ frag, fallback, className }: ShaderCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let gl: WebGLRenderingContext | null = null;
		let uRes: WebGLUniformLocation | null = null;
		let uTime: WebGLUniformLocation | null = null;
		try {
			gl = canvas.getContext("webgl", {
				antialias: false,
				alpha: false,
				powerPreference: "low-power",
			});
			if (!gl) throw new Error("WebGL unavailable");
			const prog = gl.createProgram();
			if (!prog) throw new Error("createProgram failed");
			gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
			gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, frag));
			gl.linkProgram(prog);
			gl.useProgram(prog);
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
			const loc = gl.getAttribLocation(prog, "p");
			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
			uRes = gl.getUniformLocation(prog, "r");
			uTime = gl.getUniformLocation(prog, "t");
		} catch (err) {
			console.warn(err);
			setFailed(true);
			return;
		}

		const ctx = gl;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
		let visible = false;
		let raf = 0;
		let time = STILL_TIME;

		const draw = () => {
			ctx.uniform2f(uRes, canvas.width, canvas.height);
			ctx.uniform1f(uTime, time);
			ctx.drawArrays(ctx.TRIANGLES, 0, 3);
		};
		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
			const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
			const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
			ctx.viewport(0, 0, w, h);
			draw();
		};
		const frame = (ms: number) => {
			time = STILL_TIME + ms / 1000;
			draw();
			raf = requestAnimationFrame(frame);
		};
		const sync = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			if (visible && !reduce.matches && !document.hidden) {
				raf = requestAnimationFrame(frame);
			}
		};

		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		const ro = new ResizeObserver(resize);
		io.observe(canvas);
		ro.observe(canvas);
		document.addEventListener("visibilitychange", sync);
		reduce.addEventListener("change", sync);
		resize();

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			ro.disconnect();
			document.removeEventListener("visibilitychange", sync);
			reduce.removeEventListener("change", sync);
			ctx.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [frag]);

	return (
		<div
			aria-hidden="true"
			className={cn("pointer-events-none absolute inset-0 -z-10", className)}
			style={failed ? { background: fallback } : undefined}
		>
			{!failed && <canvas ref={canvasRef} className="block size-full" />}
		</div>
	);
}

export function RibbonShader({ className }: { className?: string }) {
	return (
		<ShaderCanvas
			frag={RIBBON}
			className={className}
			fallback="linear-gradient(115deg, #09090b 45%, #5b6cff 62%, #c64cf2 72%, #f0389f 82%, #ff8a4c 95%)"
		/>
	);
}

export function SunriseShader({ className }: { className?: string }) {
	return (
		<ShaderCanvas
			frag={SUNRISE}
			className={className}
			fallback="radial-gradient(120% 140% at 50% 135%, #f27a33 20%, #ec729e 40%, #4073fa 60%, #171e4d 75%, #09090b 90%)"
		/>
	);
}
