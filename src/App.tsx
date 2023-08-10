import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current?.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    const models = [
      {
        name: "moon",
        file: "/assets/moon.gltf",
        position: new THREE.Vector3(0, -29, 0),
        scale: 12,
        visible: true,
      },
    ];

    models.forEach((modelInfo) => {
      loader.load(modelInfo.file, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelInfo.position);
        model.visible = modelInfo.visible;

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        scene.add(directionalLight);

        model.scale.set(modelInfo.scale, modelInfo.scale, modelInfo.scale);
        model.name = modelInfo.name;
        scene.add(model);
      });
    });

    camera.position.z = 95;

    // GSAP animation
    gsap.to(models[0].position, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: sceneRef.current,
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    });

    gsap.to(models[0], {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: sceneRef.current,
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    });

    const animate = () => {
      requestAnimationFrame(animate);
      models.forEach(() => {
        const model = scene.getObjectByName("moon");
        if (model) model.rotation.x += -0.001;
      });
      renderer.render(scene, camera);
    };

    animate();

    return () => renderer.dispose();
  }, []);

  return <div ref={sceneRef}></div>;
};

export default App;
