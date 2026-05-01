import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment, Stars, useTexture, Float as FloatDrei, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FEATURED_NFTS } from '../constants';

function FloatingPicture({ url, index }: { url: string; index: number }) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const orbitSpeed = 0.3;
      const angle = (index * (Math.PI * 2) / FEATURED_NFTS.length) + (time * orbitSpeed);
      const radius = 6.8;
      
      meshRef.current.position.x = Math.sin(angle) * radius;
      meshRef.current.position.z = Math.cos(angle) * radius;
      meshRef.current.position.y = Math.sin(time + index) * 0.5;
      meshRef.current.rotation.y = -angle + Math.PI;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.8, 3.5]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SceneContent() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const nftImages = useMemo(() => FEATURED_NFTS.map(nft => nft.image), []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <Environment preset="studio" />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#c19a6b" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <Sphere args={[2.2, 64, 64]}>
            <MeshDistortMaterial
              color="#E0E5EC"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={0.8}
            />
          </Sphere>
        </mesh>
      </Float>

      {/* Floating NFT Pictures moving in a circle */}
      {nftImages.map((url, i) => (
        <Suspense key={i} fallback={null}>
          <FloatingPicture 
            url={url}
            index={i}
          />
        </Suspense>
      ))}
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
