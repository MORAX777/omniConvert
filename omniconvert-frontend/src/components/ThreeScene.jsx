import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0f172a, 0.02); 

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const mainObj = new THREE.Mesh(geometry, material);
        scene.add(mainObj);

        const particlesGeom = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        particlesGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x818cf8,
            transparent: true,
            opacity: 0.8
        });
        const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
        scene.add(particlesMesh);

        const animate = () => {
            requestAnimationFrame(animate);
            mainObj.rotation.x += 0.001;
            mainObj.rotation.y += 0.002;
            particlesMesh.rotation.y -= 0.0005;
            const time = Date.now() * 0.001;
            mainObj.scale.setScalar(1 + Math.sin(time) * 0.05);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, background: "linear-gradient(to bottom, #0f172a, #1e293b)" }} />
    );
};
export default ThreeScene;
