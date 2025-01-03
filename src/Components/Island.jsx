import * as THREE from 'three';
import { useUnzipData } from '../Functions/UnzipData';
import { useFetchData } from '../Functions/FetchData';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';


const Island = () => {
    const {data, error, loading} = useFetchData();
    const mountRef = useRef(null);
    useEffect(() => {
        if(!data || loading || error) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width,height);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        //const axesHelper = new THREE.AxesHelper(100);
        //scene.add(axesHelper);




        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(data);
        
        const jsonData = JSON.parse(jsonString);
        console.log(typeof jsonData);
        const scaleFactor = 500;
        const elevationScaleFactor = 500;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        jsonData.forEach((point) => {
            vertices.push(point.x / scaleFactor, point.y / scaleFactor, point.elevation / elevationScaleFactor);
            const [r,g,b] = point.color;
            colors.push(r/255, g/255, b/255);
            minX = Math.min(minX, point.x / scaleFactor);
            maxX = Math.max(maxX, point.x / scaleFactor);
            minY = Math.min(minY, point.y / scaleFactor);
            maxY = Math.max(maxY, point.y / scaleFactor);
            minZ = Math.min(minZ, point.elevation / elevationScaleFactor);
            maxZ = Math.max(maxZ, point.elevation / elevationScaleFactor);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        console.log("MinZ", minZ);
        console.log("MaxZ", maxZ);
        


        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 20, 
            vertexColors: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1,1,1).normalize();
        scene.add(ambientLight);
        scene.add(directionalLight);

        camera.position.set(centerX, centerY, 500);
        controls.target.set(centerX, centerY, centerZ);

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            controls.dispose();
        };
    }, [data, loading, error]   )
    
    if (loading) return <div>Loading Block Island Data.....</div>;
    if(error) return <div>There was an error loading the data</div>;

    return <div ref={mountRef} style={{width:"100vw", height: "100vh"}}></div>;
}

export default Island;