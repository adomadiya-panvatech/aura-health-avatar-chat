
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import { AvatarState } from "./HealthcareAvatar";

interface Avatar3DProps {
  avatarState: AvatarState;
}

const AvatarMesh = ({ avatarState }: { avatarState: AvatarState }) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Create avatar geometry
  const headGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const bodyGeometry = useMemo(() => new THREE.CapsuleGeometry(0.8, 1.5, 16, 32), []);
  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.1, 16, 16), []);

  // Materials with healthcare theme
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0xffdbac),
    roughness: 0.8,
    metalness: 0.1
  }), []);
  
  const clothingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x4a90e2), // Medical blue
    roughness: 0.6,
    metalness: 0.2
  }), []);
  
  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x2c3e50),
    roughness: 0.1,
    metalness: 0.8
  }), []);

  const mouthMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x8b4513),
    roughness: 0.7
  }), []);

  // Animation loop
  useFrame((state) => {
    if (!avatarRef.current || !headRef.current || !eyesRef.current || !mouthRef.current) return;

    const time = state.clock.elapsedTime;

    // Breathing animation
    const breathingScale = 1 + Math.sin(time * 1.5) * 0.02;
    avatarRef.current.scale.setScalar(breathingScale);

    // Head movements based on avatar state
    if (avatarState.isListening) {
      headRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      headRef.current.rotation.x = Math.sin(time * 1.5) * 0.05;
    } else if (avatarState.isSpeaking) {
      // More animated speaking gestures
      headRef.current.rotation.y = Math.sin(time * 3) * 0.15;
      headRef.current.rotation.x = 0.05 + Math.sin(time * 2) * 0.03;
      
      // Mouth animation for speaking
      const mouthScale = 1 + Math.sin(time * 8) * 0.3;
      mouthRef.current.scale.setScalar(mouthScale);
    } else {
      // Gentle idle animation
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      headRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
      mouthRef.current.scale.setScalar(1);
    }

    // Eye blinking
    if (Math.sin(time * 0.7) > 0.98) {
      eyesRef.current.scale.y = 0.1;
    } else {
      eyesRef.current.scale.y = 1;
    }

    // Expression-based animations
    switch (avatarState.expression) {
      case 'happy':
        headRef.current.position.y = 0.5 + Math.sin(time * 4) * 0.1;
        break;
      case 'thinking':
        headRef.current.rotation.z = Math.sin(time * 1) * 0.1;
        break;
      case 'concerned':
        headRef.current.rotation.x = -0.1;
        break;
      default:
        headRef.current.position.y = 0.5;
        headRef.current.rotation.z = 0;
    }

    // Gesture animations
    if (avatarState.gesture === 'greeting') {
      avatarRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    } else {
      avatarRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={avatarRef} position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, -1, 0]} geometry={bodyGeometry} material={clothingMaterial}>
        {/* Medical badge/logo */}
        <mesh position={[0, 0.5, 0.8]} scale={[0.3, 0.3, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]} geometry={headGeometry} material={skinMaterial}>
        {/* Eyes */}
        <group ref={eyesRef}>
          <mesh position={[-0.3, 0.2, 0.8]} geometry={eyeGeometry} material={eyeMaterial} />
          <mesh position={[0.3, 0.2, 0.8]} geometry={eyeGeometry} material={eyeMaterial} />
        </group>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.2, 0.8]} scale={[0.3, 0.1, 0.1]}>
          <sphereGeometry args={[1, 8, 8]} />
          <primitive object={mouthMaterial} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.7, 0]} scale={[1.1, 0.3, 1.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </mesh>
      </mesh>
      
      {/* Medical coat collar */}
      <mesh position={[0, 0, 0.1]} scale={[1.2, 0.2, 1.2]}>
        <cylinderGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export const Avatar3D = ({ avatarState }: Avatar3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} color="#4a90e2" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar */}
        <AvatarMesh avatarState={avatarState} />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={!avatarState.isSpeaking && !avatarState.isListening}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
