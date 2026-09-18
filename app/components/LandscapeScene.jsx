'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function terrainHeight(x, z) {
    const broad = Math.sin(x * 0.2 + z * 0.055) * 2.4;
    const crossing = Math.sin(x * 0.08 - z * 0.11) * 1.6;
    const detail = Math.sin(x * 0.53 + z * 0.18) * 0.28;
    const valley = -Math.exp(-(x * x) / 34) * 1.4;
    return broad + crossing + detail + valley - 1.2;
}

function createTerrain() {
    const geometry = new THREE.PlaneGeometry(58, 170, 84, 190);
    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position;
    const colors = [];
    const shadow = new THREE.Color('#173820');
    const grass = new THREE.Color('#789746');
    const light = new THREE.Color('#c2cc74');

    for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const z = position.getZ(index) - 55;
        const y = terrainHeight(x, z);
        position.setXYZ(index, x, y, z);

        const blend = THREE.MathUtils.clamp((y + 4.5) / 8.5, 0, 1);
        const color = shadow.clone().lerp(grass, Math.min(blend * 1.5, 1));
        if (blend > 0.62) color.lerp(light, (blend - 0.62) / 0.38);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    return new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.96,
            metalness: 0,
            flatShading: true,
        })
    );
}

function createSkyDome() {
    return new THREE.Mesh(
        new THREE.SphereGeometry(135, 48, 32),
        new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
                uResolution: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: `
                varying vec3 vDirection;

                void main() {
                    vDirection = normalize(position);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform vec2 uResolution;
                varying vec3 vDirection;

                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }

                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                }

                void main() {
                    vec3 direction = normalize(vDirection);
                    float height = direction.y * 0.5 + 0.5;
                    vec3 horizon = vec3(0.96, 0.73, 0.53);
                    vec3 middle = vec3(0.69, 0.70, 0.61);
                    vec3 zenith = vec3(0.37, 0.54, 0.54);
                    vec3 color = mix(horizon, middle, smoothstep(0.42, 0.66, height));
                    color = mix(color, zenith, smoothstep(0.66, 1.0, height));

                    vec2 screenUv = gl_FragCoord.xy / uResolution;
                    float aspect = uResolution.x / uResolution.y;
                    vec2 glowUv = (screenUv - vec2(0.18, 0.77)) * vec2(aspect, 1.0);
                    float glowDistance = length(glowUv);
                    float atmosphericGlow = 1.0 - smoothstep(0.0, 0.4, glowDistance);
                    color += vec3(1.0, 0.62, 0.36) * pow(atmosphericGlow, 1.65) * 0.34;

                    float cloudNoise = sin(direction.x * 19.0 + sin(direction.z * 11.0) * 1.8);
                    cloudNoise += sin(direction.z * 27.0 - direction.x * 7.0) * 0.42;
                    float cloudBand = smoothstep(0.48, 0.58, height) * (1.0 - smoothstep(0.72, 0.84, height));
                    float clouds = smoothstep(0.58, 1.05, cloudNoise) * cloudBand * 0.26;
                    color = mix(color, vec3(0.96, 0.91, 0.83), clouds);

                    float horizonHaze = 1.0 - smoothstep(0.46, 0.68, height);
                    color = mix(color, vec3(0.91, 0.88, 0.79), horizonHaze * 0.32);

                    float paperGrain = (hash(gl_FragCoord.xy * 0.37) - 0.5) * 0.018;
                    color += paperGrain;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        })
    );
}

function seededRandom(seed) {
    let value = seed;
    return () => {
        value = Math.sin(value) * 10000;
        return value - Math.floor(value);
    };
}

function createGrass(count) {
    const geometry = new THREE.PlaneGeometry(0.075, 0.4, 1, 3);
    geometry.translate(0, 0.2, 0);

    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            uTime: { value: 0 },
            uFogColor: { value: new THREE.Color('#9db5a5') },
            uFogNear: { value: 18 },
            uFogFar: { value: 74 },
        },
        vertexShader: `
            uniform float uTime;
            varying vec2 vUv;
            varying float vDepth;

            void main() {
                vUv = uv;
                vec3 transformed = position;
                float worldX = instanceMatrix[3].x;
                float worldZ = instanceMatrix[3].z;
                float gust = sin(uTime * 1.65 + worldX * 0.21 + worldZ * 0.17);
                gust += sin(uTime * 0.72 - worldX * 0.11 + worldZ * 0.08) * 0.42;
                float bend = pow(uv.y, 2.15);
                transformed.x *= mix(1.0, 0.08, uv.y);
                transformed.x += gust * bend * 0.1;
                transformed.z += abs(gust) * bend * 0.025;

                vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
                vDepth = -viewPosition.z;
                gl_Position = projectionMatrix * viewPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uFogColor;
            uniform float uFogNear;
            uniform float uFogFar;
            varying vec2 vUv;
            varying float vDepth;

            void main() {
                vec3 root = vec3(0.10, 0.25, 0.12);
                vec3 tip = vec3(0.67, 0.76, 0.28);
                vec3 color = mix(root, tip, vUv.y);
                float fog = smoothstep(uFogNear, uFogFar, vDepth);
                gl_FragColor = vec4(mix(color, uFogColor, fog), 1.0);
            }
        `,
    });

    const grass = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const random = seededRandom(19.87);

    for (let index = 0; index < count; index += 1) {
        const x = (random() - 0.5) * 54;
        const z = 26 - random() * 162;
        const height = terrainHeight(x, z);
        const scale = 0.65 + random() * 0.75;

        dummy.position.set(x, height + 0.015, z);
        dummy.rotation.set(0, random() * Math.PI, (random() - 0.5) * 0.08);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        grass.setMatrixAt(index, dummy.matrix);
    }

    grass.instanceMatrix.needsUpdate = true;
    grass.frustumCulled = false;
    return grass;
}

function createFlowerShape() {
    const shape = new THREE.Shape();
    const points = 36;

    for (let index = 0; index <= points; index += 1) {
        const angle = (index / points) * Math.PI * 2;
        const radius = 0.11 + Math.cos(angle * 6) * 0.055;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }

    return new THREE.ShapeGeometry(shape);
}

function createFlowers(count) {
    const stemGeometry = new THREE.CylinderGeometry(0.012, 0.018, 0.52, 5);
    stemGeometry.translate(0, 0.26, 0);
    const headGeometry = createFlowerShape();
    const centerGeometry = new THREE.CircleGeometry(0.036, 8);
    const windVertexShader = `
        uniform float uTime;
        uniform float uAnchorBase;
        varying vec3 vInstanceColor;

        void main() {
            float worldX = instanceMatrix[3].x;
            float worldZ = instanceMatrix[3].z;
            float gust = sin(uTime * 1.35 + worldX * 0.2 + worldZ * 0.16);
            gust += sin(uTime * 0.58 - worldX * 0.09 + worldZ * 0.07) * 0.36;
            float influence = mix(1.0, pow(uv.y, 2.0), uAnchorBase);
            vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
            instancePosition.x += gust * 0.055 * influence;
            instancePosition.y += sin(uTime * 0.9 + worldZ * 0.12) * 0.014 * influence;
            vInstanceColor = instanceColor;
            gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
        }
    `;
    const windFragmentShader = `
        precision highp float;
        varying vec3 vInstanceColor;

        void main() {
            gl_FragColor = vec4(vInstanceColor, 1.0);
        }
    `;
    const stemMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uAnchorBase: { value: 1 } },
        vertexShader: windVertexShader,
        fragmentShader: windFragmentShader,
    });
    const flowerMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uAnchorBase: { value: 0 } },
        vertexShader: windVertexShader,
        fragmentShader: windFragmentShader,
    });
    const stems = new THREE.InstancedMesh(stemGeometry, stemMaterial, count);
    const heads = new THREE.InstancedMesh(headGeometry, flowerMaterial, count);
    const centers = new THREE.InstancedMesh(centerGeometry, flowerMaterial, count);
    const colors = ['#ed7655', '#f2ddd3', '#f0b94c', '#9d79a8', '#fff0c7'];
    const random = seededRandom(47.12);
    const dummy = new THREE.Object3D();

    for (let index = 0; index < count; index += 1) {
        const x = (random() - 0.5) * 52;
        const z = 25 - random() * 158;
        const ground = terrainHeight(x, z);
        const height = 0.3 + random() * 0.5;
        const scale = 0.62 + random() * 0.9;

        dummy.position.set(x, ground + 0.01, z);
        dummy.rotation.set((random() - 0.5) * 0.08, random() * Math.PI, (random() - 0.5) * 0.13);
        dummy.scale.set(scale, height / 0.52, scale);
        dummy.updateMatrix();
        stems.setMatrixAt(index, dummy.matrix);
        stems.setColorAt(index, new THREE.Color('#355d2f'));

        dummy.position.set(x, ground + height, z);
        dummy.rotation.set(0, 0, random() * Math.PI);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        heads.setMatrixAt(index, dummy.matrix);
        heads.setColorAt(index, new THREE.Color(colors[Math.floor(random() * colors.length)]));

        dummy.position.z += 0.012;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        centers.setMatrixAt(index, dummy.matrix);
        centers.setColorAt(index, new THREE.Color('#f3c65f'));
    }

    stems.instanceMatrix.needsUpdate = true;
    stems.instanceColor.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    heads.instanceColor.needsUpdate = true;
    centers.instanceMatrix.needsUpdate = true;
    centers.instanceColor.needsUpdate = true;
    stems.frustumCulled = false;
    heads.frustumCulled = false;
    centers.frustumCulled = false;

    const group = new THREE.Group();
    group.add(stems, heads, centers);
    group.userData.windMaterials = [stemMaterial, flowerMaterial];
    return group;
}

function createButterflies(count) {
    const flock = new THREE.Group();
    const wingGeometry = new THREE.BufferGeometry();
    wingGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
        0, 0, 0, -0.22, 0.13, 0, -0.18, -0.12, 0,
        0, 0, 0, 0.22, 0.13, 0, 0.18, -0.12, 0,
    ], 3));
    const bodyGeometry = new THREE.CapsuleGeometry(0.025, 0.12, 2, 5);
    const wingMaterials = ['#ed7655', '#f3c65f', '#f4e5bc', '#d9a7c7'].map((color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.78 }));
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: '#173820' });
    const random = seededRandom(81.4);

    for (let index = 0; index < count; index += 1) {
        const butterfly = new THREE.Group();
        const wings = new THREE.Mesh(wingGeometry, wingMaterials[index % wingMaterials.length]);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        butterfly.add(wings, body);
        butterfly.userData = {
            baseX: (random() - 0.5) * 38,
            baseZ: 18 - random() * 142,
            height: 1.1 + random() * 2.2,
            radius: 0.8 + random() * 2.4,
            phase: random() * Math.PI * 2,
            speed: 0.22 + random() * 0.22,
            wings,
        };
        flock.add(butterfly);
    }

    flock.userData.resources = [wingGeometry, bodyGeometry, ...wingMaterials, bodyMaterial];
    return flock;
}

function updateButterflies(flock, time) {
    flock.children.forEach((butterfly) => {
        const { baseX, baseZ, height, radius, phase, speed, wings } = butterfly.userData;
        const travel = time * speed + phase;
        const x = baseX + Math.sin(travel) * radius;
        const z = baseZ + Math.cos(travel * 0.82) * radius;
        butterfly.position.set(x, terrainHeight(x, z) + height + Math.sin(travel * 3.2) * 0.22, z);
        butterfly.rotation.y = -travel + Math.PI / 2;
        butterfly.rotation.z = Math.sin(travel * 1.7) * 0.18;
        wings.scale.x = 0.28 + Math.abs(Math.sin(time * 8 + phase)) * 0.9;
    });
}

function createDriftingLeaves(count) {
    const geometry = new THREE.CircleGeometry(0.09, 5);
    const material = new THREE.MeshBasicMaterial({ color: '#ed7655', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const leaves = new THREE.InstancedMesh(geometry, material, count);
    const random = seededRandom(109.6);
    leaves.userData.items = Array.from({ length: count }, () => ({
        x: (random() - 0.5) * 46,
        z: 22 - random() * 154,
        height: 0.8 + random() * 3.6,
        drift: 0.5 + random() * 1.8,
        phase: random() * Math.PI * 2,
        speed: 0.18 + random() * 0.28,
    }));
    leaves.frustumCulled = false;
    return leaves;
}

function updateDriftingLeaves(leaves, time, dummy) {
    leaves.userData.items.forEach((leaf, index) => {
        const travel = time * leaf.speed + leaf.phase;
        const x = leaf.x + Math.sin(travel) * leaf.drift;
        const z = leaf.z + Math.cos(travel * 0.7) * leaf.drift;
        dummy.position.set(x, terrainHeight(x, z) + leaf.height + Math.sin(travel * 2.1) * 0.35, z);
        dummy.rotation.set(travel * 1.4, travel * 0.8, Math.sin(travel * 2.4));
        dummy.scale.setScalar(0.75 + Math.sin(travel * 1.8) * 0.18);
        dummy.updateMatrix();
        leaves.setMatrixAt(index, dummy.matrix);
    });
    leaves.instanceMatrix.needsUpdate = true;
}

function createDreamLights(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ['#fff0c7', '#f4d58b', '#ed9e84'];
    const random = seededRandom(208.2);
    const items = [];
    for (let index = 0; index < count; index += 1) {
        const color = new THREE.Color(palette[index % palette.length]);
        colors.set([color.r, color.g, color.b], index * 3);
        items.push({
            x: (random() - 0.5) * 24,
            y: 2 + random() * 8,
            depth: 10 + random() * 42,
            phase: random() * Math.PI * 2,
            speed: 0.18 + random() * 0.24,
        });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
        size: 0.11,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.78,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const lights = new THREE.Points(geometry, material);
    lights.userData.items = items;
    lights.frustumCulled = false;
    return lights;
}

function updateDreamLights(lights, camera, time) {
    const positions = lights.geometry.attributes.position.array;
    lights.userData.items.forEach((light, index) => {
        const travel = time * light.speed + light.phase;
        positions[index * 3] = light.x + Math.sin(travel * 1.7) * 2.4;
        positions[index * 3 + 1] = camera.position.y + light.y + Math.sin(travel * 2.3) * 0.7;
        positions[index * 3 + 2] = camera.position.z - light.depth + Math.cos(travel) * 2;
    });
    lights.geometry.attributes.position.needsUpdate = true;
}

function createCabin(x, z, scale, rotation = 0) {
    const cabin = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({ color: '#d9c7a2', roughness: 0.95 });
    const sideMaterial = new THREE.MeshStandardMaterial({ color: '#9b5e3c', roughness: 0.95 });
    const roofMaterial = new THREE.MeshStandardMaterial({ color: '#49372d', roughness: 0.92 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: '#28382e', roughness: 0.85 });
    const walls = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.65, 2.05), wallMaterial);
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.7, 2.1), sideMaterial);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.05, 1.25, 4), roofMaterial);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.05, 0.08), darkMaterial);
    const windowMaterial = new THREE.MeshBasicMaterial({ color: '#e9bd68' });
    const windowLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.48), windowMaterial);
    const windowRight = windowLeft.clone();

    walls.position.y = 0.84;
    side.position.set(-1.38, 0.84, 0);
    roof.position.y = 2.02;
    roof.rotation.y = Math.PI / 4;
    door.position.set(0, 0.54, 1.065);
    windowLeft.position.set(-0.78, 1.02, 1.071);
    windowRight.position.set(0.78, 1.02, 1.071);
    cabin.add(walls, side, roof, door, windowLeft, windowRight);
    cabin.position.set(x, terrainHeight(x, z) - 0.08, z);
    cabin.rotation.y = rotation;
    cabin.scale.setScalar(scale);
    return cabin;
}

function createVillage() {
    const village = new THREE.Group();
    village.add(
        createCabin(-9.5, -9, 1.15, 0.12),
        createCabin(11, -34, 0.95, -0.24),
        createCabin(-12.5, -65, 1.05, 0.18),
        createCabin(9, -96, 0.9, -0.12)
    );
    return village;
}

export default function LandscapeScene({ enabled = true }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;

        const canvas = canvasRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let renderer;

        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
        } catch {
            canvas?.classList.add('scene-fallback');
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#7fadae');
        scene.fog = new THREE.Fog('#cec0a2', 13, 64);

        const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);
        camera.position.set(0, 5.6, 14);

        const terrain = createTerrain();
        const sky = createSkyDome();
        const grass = createGrass(window.innerWidth < 700 ? 6500 : 15000);
        const flowers = createFlowers(window.innerWidth < 700 ? 480 : 1100);
        const butterflies = createButterflies(window.innerWidth < 700 ? 6 : 12);
        const driftingLeaves = createDriftingLeaves(window.innerWidth < 700 ? 18 : 38);
        const dreamLights = createDreamLights(window.innerWidth < 700 ? 36 : 90);
        const village = createVillage();
        scene.add(sky, terrain, grass, flowers, butterflies, driftingLeaves, dreamLights, village);

        const skyLight = new THREE.HemisphereLight('#dce7d7', '#173820', 2.2);
        const sunLight = new THREE.DirectionalLight('#ffd39a', 2.8);
        sunLight.position.set(-8, 16, 12);
        scene.add(skyLight, sunLight);

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

        const target = { progress: reducedMotion ? 0.06 : 0 };
        let current = target.progress;
        let frame = 0;
        const animationDummy = new THREE.Object3D();

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            renderer.setSize(width, height, false);
            sky.material.uniforms.uResolution.value.set(canvas.width, canvas.height);
            camera.aspect = width / Math.max(height, 1);
            camera.updateProjectionMatrix();
        };

        const updateTarget = () => {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            target.progress = reducedMotion ? 0.06 : Math.min(1, window.scrollY / maxScroll);
            if (!frame) frame = requestAnimationFrame(render);
        };

        const render = (time = 0) => {
            const difference = target.progress - current;
            current += difference * 0.1;
            const windTime = reducedMotion ? 0.8 : time * 0.001;
            grass.material.uniforms.uTime.value = windTime;
            flowers.userData.windMaterials.forEach((material) => {
                material.uniforms.uTime.value = windTime;
            });
            updateButterflies(butterflies, windTime);
            updateDriftingLeaves(driftingLeaves, windTime, animationDummy);

            camera.position.z = 14 - current * 67;
            camera.position.x = Math.sin(current * Math.PI * 1.35) * 2.1;
            camera.position.y = terrainHeight(camera.position.x, camera.position.z) + 3.05;
            camera.fov = 48 - current * 12;
            sky.position.copy(camera.position);
            camera.lookAt(
                Math.sin(current * Math.PI) * 1.1,
                camera.position.y + 0.12,
                camera.position.z - 24
            );
            camera.updateProjectionMatrix();
            updateDreamLights(dreamLights, camera, windTime);
            renderer.render(scene, camera);

            if (!reducedMotion || Math.abs(difference) > 0.0001) frame = requestAnimationFrame(render);
            else frame = 0;
        };

        resize();
        render();
        const handleResize = () => {
            resize();
            if (!frame) frame = requestAnimationFrame(render);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        if (!reducedMotion) window.addEventListener('scroll', updateTarget, { passive: true });

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', updateTarget);
            terrain.geometry.dispose();
            terrain.material.dispose();
            grass.geometry.dispose();
            grass.material.dispose();
            flowers.traverse((object) => {
                object.geometry?.dispose();
                object.material?.dispose();
            });
            butterflies.userData.resources.forEach((resource) => resource.dispose());
            driftingLeaves.geometry.dispose();
            driftingLeaves.material.dispose();
            dreamLights.geometry.dispose();
            dreamLights.material.dispose();
            village.traverse((object) => {
                object.geometry?.dispose();
                object.material?.dispose();
            });
            sky.geometry.dispose();
            sky.material.dispose();
            renderer.dispose();
        };
    }, [enabled]);

    if (!enabled) return <div className="landscape-scene scene-disabled" aria-hidden="true" />;
    return <canvas ref={canvasRef} className="landscape-scene" aria-hidden="true" />;
}
