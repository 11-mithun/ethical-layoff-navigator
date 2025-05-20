
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      renderer.domElement.classList.add('three-canvas');
    }
    
    // Create particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x7c3aed, // Primary color
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add some floating objects
    const geometries = [
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
    ];
    
    const floatingObjects: THREE.Mesh[] = [];
    
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0d9488),
        transparent: true,
        opacity: 0.6,
        metalness: 0.2,
        roughness: 0.8,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
      
      floatingObjects.push(mesh);
      scene.add(mesh);
    }
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    camera.position.z = 5;
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate floating objects
      floatingObjects.forEach((obj, i) => {
        obj.rotation.x += 0.001 * (i % 3 + 1);
        obj.rotation.y += 0.002 * ((i + 1) % 3 + 1);
      });
      
      // Rotate particle mesh
      particlesMesh.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      geometries.forEach(geometry => geometry.dispose());
      floatingObjects.forEach(obj => {
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose();
        }
      });
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} />;
};

export default ThreeScene;
