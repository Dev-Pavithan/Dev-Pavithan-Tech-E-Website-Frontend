
import {
    CameraControls,
    ContactShadows,
    Environment,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import AvatarCenter from "./AvatarCenter"; 

export const ExperienceCenter = () => {
    const cameraControls = useRef();

    useEffect(() => {
        // Set the camera to zoom in on the model
        cameraControls.current.setLookAt(0, 1.5, 2.5, 0, 1.2, 0); // Adjusted position for zoom
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
                <AvatarCenter />
            </Suspense>
            <ContactShadows opacity={0.7} />
        </>
    );
};
