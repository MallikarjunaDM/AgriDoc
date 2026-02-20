"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface AuroraBorealisShaderProps {
    /** Optional className for the canvas container */
    className?: string;
    /** Height in px/css string. Default: 100% */
    height?: string;
    /** Whether to show the cursor light dot */
    showCursorLight?: boolean;
}

const AuroraBorealisShader: React.FC<AuroraBorealisShaderProps> = ({
    className = "",
    height = "100%",
    showCursorLight = false,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const clock = new THREE.Clock();

        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i), random(i + vec2(1.0,0.0)), u.x),
          mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p); p *= 2.0; a *= 0.5;
        }
        return v;
      }
      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse          - 0.5 * iResolution.xy) / iResolution.y;
        float t = iTime * 0.18;
        vec2 p = uv; p.y += 0.4;
        float f = fbm(vec2(p.x * 2.2, p.y + t));
        float curtain = smoothstep(0.08, 0.55, f) * (1.0 - p.y * 0.8);
        float d = length(uv - mouse);
        float flare = smoothstep(0.3, 0.0, d);
        /* green aurora palette */
        vec3 c1 = vec3(0.05, 0.75, 0.35);   /* emerald */
        vec3 c2 = vec3(0.02, 0.55, 0.68);   /* teal */
        vec3 fc = vec3(0.8, 1.0, 0.9);
        vec3 color = mix(c1, c2, clamp(uv.y + 0.5, 0.0, 1.0)) * curtain;
        color += fc * flare * curtain * 1.8;
        /* keep it subtle — multiply down so it overlays rather than overpowers */
        gl_FragColor = vec4(color * 0.9, curtain * 0.85);
      }
    `;

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            iMouse: { value: new THREE.Vector2(-100, -100) },
        };

        const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            uniforms.iResolution.value.set(w, h);
        };
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
        onResize();

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = container.clientHeight - (e.clientY - rect.top);
            uniforms.iMouse.value.set(x, y);
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        container.addEventListener("mousemove", onMouseMove);

        renderer.setAnimationLoop(() => {
            uniforms.iTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        });

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener("mousemove", onMouseMove);
            renderer.setAnimationLoop(null);
            const canvas = renderer.domElement;
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            material.dispose();
            mesh.geometry.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <>
            <div
                ref={containerRef}
                className={className}
                style={{ position: "absolute", inset: 0, width: "100%", height, pointerEvents: "none", zIndex: 0 }}
                aria-hidden="true"
            />
            {showCursorLight && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.45)",
                        transform: `translate(${mousePos.x - 8}px, ${mousePos.y - 8}px)`,
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                />
            )}
        </>
    );
};

export default AuroraBorealisShader;
