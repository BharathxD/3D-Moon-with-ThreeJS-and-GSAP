import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Scene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current?.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    const models = [
      {
        name: "moon",
        file: "/assets/moon.gltf",
        position: new THREE.Vector3(0, 0, 0),
        scale: 10,
        visible: true,
      },
    ];

    models.forEach((modelInfo) => {
      loader.load(modelInfo.file, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelInfo.position);
        model.visible = modelInfo.visible;
        model.scale.set(modelInfo.scale, modelInfo.scale, modelInfo.scale);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        model.name = modelInfo.name;
        scene.add(ambientLight);
        scene.add(model);
      });
    });

    camera.position.z = 95;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      models.forEach(() => {
        const model = scene.getObjectByName("moon");
        if (model) model.rotation.y += 0.001;
      });
      renderer.render(scene, camera);
    };

    animate();

    return () => renderer.dispose();
  }, []);

  return <div ref={sceneRef}></div>;
};

export default Scene;
