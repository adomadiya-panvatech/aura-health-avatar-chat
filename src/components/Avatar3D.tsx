
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { AvatarState } from "./HealthcareAvatar";

interface Avatar3DProps {
  avatarState: AvatarState;
}

const AvatarMesh = ({ avatarState }: { avatarState: AvatarState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x6c63ff),
    roughness: 0.4,
    metalness: 0.5,
  }), []);

  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    roughness: 0.2,
    metalness: 0.8,
  }), []);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    const time = state.clock.elapsedTime;

    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    headRef.current.rotation.y = Math.sin(time * 0.8) * 0.4;

    if (avatarState.isSpeaking) {
      headRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.1);
    } else {
      headRef.current.scale.setScalar(1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <mesh material={bodyMaterial} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.8, 1.5, 4, 8]} />
      </mesh>
      <mesh ref={headRef} material={headMaterial} position={[0, 2, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
};

export const Avatar3D = ({ avatarState }: Avatar3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#8a2be2" />
        <Environment preset="sunset" />
        <AvatarMesh avatarState={avatarState} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
};
