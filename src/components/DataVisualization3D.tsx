
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionResult } from '@/services/mlService';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface DataVisualization3DProps {
  results: PredictionResult[];
}

const DataVisualization3D: React.FC<DataVisualization3DProps> = ({ results }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || results.length === 0) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create employee data points visualization
    const createDataPoints = () => {
      // Group employees by department for color coding
      const departments = [...new Set(results.map(r => r.employee.department))];
      const departmentColors: Record<string, THREE.Color> = {
        'Engineering': new THREE.Color(0x8B5CF6),    // Purple
        'Marketing': new THREE.Color(0x0EA5E9),      // Blue
        'Sales': new THREE.Color(0xF97316),          // Orange
        'Product': new THREE.Color(0x10B981),        // Green
        'HR': new THREE.Color(0xD946EF),             // Pink
        'Finance': new THREE.Color(0xF59E0B),        // Amber
        'Operations': new THREE.Color(0x6366F1),     // Indigo
      };
      
      // Add fallback colors for any departments not in our mapping
      departments.forEach(dept => {
        if (!departmentColors[dept]) {
          departmentColors[dept] = new THREE.Color(Math.random() * 0xffffff);
        }
      });
      
      // Create a group to hold all employee data points
      const dataGroup = new THREE.Group();
      
      // Create a point for each employee
      const maxScale = 5; // max scale of the visualization
      
      results.forEach((result, i) => {
        // Position is based on fairness (x), transparency (z), and performance (y)
        const x = (result.ethicalMetrics.fairness / 100 * 2 - 1) * maxScale;
        const y = (result.employee.performance / 5) * maxScale - maxScale/2;
        const z = (result.ethicalMetrics.transparency / 100 * 2 - 1) * maxScale;
        
        // Size based on years of experience
        const size = 0.2 + result.employee.yearsOfExperience / 20;
        
        // Create different geometry based on prediction
        let geometry;
        if (result.prediction === 'retain') {
          geometry = new THREE.SphereGeometry(size, 16, 16);
        } else {
          geometry = new THREE.BoxGeometry(size, size, size);
        }
        
        // Material based on department
        const material = new THREE.MeshStandardMaterial({
          color: departmentColors[result.employee.department],
          transparent: true,
          opacity: 0.8,
          metalness: 0.2,
          roughness: 0.7
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData = { employeeData: result }; // Store employee data for interaction
        
        dataGroup.add(mesh);
        
        // Add a connecting line to the base
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, -maxScale/2, z),
          new THREE.Vector3(x, y, z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ 
          color: departmentColors[result.employee.department],
          transparent: true,
          opacity: 0.3
        });
        const line = new THREE.Line(lineGeo, lineMat);
        dataGroup.add(line);
      });
      
      // Add coordinate grid for reference
      const gridHelper = new THREE.GridHelper(maxScale * 2, 10, 0x444444, 0x222222);
      scene.add(gridHelper);
      
      // Create department legend
      const legendMeshes: THREE.Mesh[] = [];
      Object.entries(departmentColors).forEach(([dept, color], index) => {
        if (results.some(r => r.employee.department === dept)) {
          const legendGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
          const legendMaterial = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.8 });
          const legendMesh = new THREE.Mesh(legendGeometry, legendMaterial);
          legendMesh.position.set(-maxScale + 0.5, maxScale - 0.5 - index * 0.6, -maxScale + 0.5);
          legendMeshes.push(legendMesh);
          scene.add(legendMesh);
        }
      });
      
      return { dataGroup, legendMeshes };
    };
    
    const { dataGroup, legendMeshes } = createDataPoints();
    scene.add(dataGroup);
    
    // Set camera position
    camera.position.z = 10;
    camera.position.y = 5;
    camera.position.x = 5;
    camera.lookAt(0, 0, 0);
    
    // Add axis helper
    const axisHelper = new THREE.AxesHelper(5);
    scene.add(axisHelper);
    
    // Label the axes
    const createSpriteText = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#ffffff';
      context.font = '32px Arial';
      context.textAlign = 'center';
      context.fillText(text, 128, 40);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(2, 0.5, 1);
      scene.add(sprite);
      
      return sprite;
    };
    
    const xLabel = createSpriteText("Fairness", new THREE.Vector3(6, 0, 0));
    const yLabel = createSpriteText("Performance", new THREE.Vector3(0, 6, 0));
    const zLabel = createSpriteText("Transparency", new THREE.Vector3(0, 0, 6));
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose of geometries and materials
      dataGroup.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      legendMeshes.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [results]);
  
  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle>3D Ethics & Performance Visualization</CardTitle>
        <CardDescription>
          Interactive 3D view of employee data with ethical dimensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs mb-2 text-muted-foreground">
          <span className="font-medium">X-axis</span>: Fairness | 
          <span className="font-medium"> Y-axis</span>: Performance | 
          <span className="font-medium"> Z-axis</span>: Transparency | 
          <span className="font-medium"> Shapes</span>: Spheres = Retained, Cubes = Layoff
        </div>
        <div 
          ref={containerRef} 
          className="h-[500px] w-full bg-background/20 rounded-md"
          style={{ cursor: 'grab' }}
        />
        <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
          <p>This 3D visualization plots employees based on ethical metrics and performance. 
          Drag to rotate, scroll to zoom, and right-click to pan the view.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization3D;
