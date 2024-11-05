import {
    CameraControls,
    ContactShadows,
    Environment,
    useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import AvatarLanding from "./Avatar"; 

export const ExperienceLanding = () => {
    const cameraControls = useRef();

    useEffect(() => {
        // Set the camera to zoom in on the model
        cameraControls.current.setLookAt(0, 1.8, 1.9, 0, 1.34, 0); // Adjusted position for zoom
    }, []);

    return (
        <>
            <CameraControls
                ref={cameraControls}
                maxDistance={5}  // Maximum distance the camera can zoom out
                minDistance={1}  // Minimum distance to zoom in
            />
            <Environment preset="sunset" />
            <Suspense fallback={null}>
                <AvatarLanding />
            </Suspense>
            <ContactShadows opacity={0.7} />
        </>
    );
};

// Preload the GLTF models
useGLTF.preload("/models/64f1a714fe61576b46f27ca2.glb");
useGLTF.preload("/models/Dancing.glb");
// useGLTF.preload("/models/animations.glb");
// useGLTF.preload("/models/standing.glb");
// useGLTF.preload("/models/talikng01.glb");
// useGLTF.preload("/models/talikng02.glb");
