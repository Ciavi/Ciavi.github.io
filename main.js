import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#main-3d-scene');

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    premultipliedAlpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.autoClear = true;

const g_loader = new GLTFLoader();

const skyColor = 0x070B34;
const groundColor = 0x1e4e52;
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(100, 50, 0);
directionalLight.castShadow = true;

let ref_gripen = null;
let t_strobe_light = null;

g_loader.load('public/gripen/gripen_gear_off.glb', function (gltf) {
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            child.material.envMapIntensity = 1;
        }
    });
    ref_gripen = gltf.scene;

    // Navigation lights
    /* const g_light = new THREE.PointLight(0x11ff88, 400);
    g_light.position.set(47.101, -4.057, 9.797);
    ref_gripen.add(g_light);

    const r_light = new THREE.PointLight(0xff3535, 400);
    r_light.position.set(47.101, -4.057, -9.797);
    ref_gripen.add(r_light); */

    // Strobe lights
    t_strobe_light = new THREE.PointLight(0xccccff, 5000);
    t_strobe_light.position.set(-37.500, 21.489, 0);
    ref_gripen.add(t_strobe_light);

    // Formation lights
    const s_light_f = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_f.position.set(71.450, -3.279, 4.804);
    ref_gripen.add(s_light_f);

    const s_light_ft = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_ft.position.set(39.833, -1.727, 9.820);
    ref_gripen.add(s_light_ft);

    const s_light_fb = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_fb.position.set(36.994, -3.672, 9.723);
    ref_gripen.add(s_light_fb);

    const t_light_ft = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    t_light_ft.position.set(-12.285, 7.415, 1.844);
    ref_gripen.add(t_light_ft);

    const t_light_fb = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    t_light_fb.position.set(-9.472, 6.592, 2.127);
    ref_gripen.add(t_light_fb);

    const s_light_b = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_b.position.set(71.450, -3.279, -4.700);
    s_light_b.rotation.x = THREE.MathUtils.degToRad(180);
    ref_gripen.add(s_light_b);

    const s_light_bt = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_bt.position.set(39.833, -1.727, -9.820);
    s_light_bt.rotation.x = THREE.MathUtils.degToRad(180);
    ref_gripen.add(s_light_bt);

    const s_light_bb = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    s_light_bb.position.set(36.994, -3.672, -9.723);
    s_light_bb.rotation.x = THREE.MathUtils.degToRad(180);
    ref_gripen.add(s_light_bb);

    const t_light_bt = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    t_light_bt.position.set(-12.285, 7.415, -1.844);
    t_light_bt.rotation.x = THREE.MathUtils.degToRad(180);
    ref_gripen.add(t_light_bt);

    const t_light_bb = new THREE.RectAreaLight(0xccff88, 200, 2.5, 0.5);
    t_light_bb.position.set(-9.472, 6.592, -2.127);
    t_light_bb.rotation.x = THREE.MathUtils.degToRad(180);
    ref_gripen.add(t_light_bb);

    scene.add(ref_gripen);
    directionalLight.target = ref_gripen;
    scene.add(directionalLight);
}, undefined, function (error) {
    console.error(error);
});

/* const h_loader = new RGBELoader();
h_loader.load('public/kloppenheim_02_puresky_4k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
}); */

const b_loader = new THREE.TextureLoader();
b_loader.load('public/back.png', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});

scene.fog = new THREE.FogExp2(0x000000, 0.01);
renderer.setClearColor(scene.fog.color);

const backgroundClouds = [];
const clouds = [];

const t_loader = new THREE.TextureLoader();
t_loader.load('public/cloud_final.png', function (texture) {
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
        depthWrite: true,
        color: 0xccaa99,
    });

    function gaussianRandom(mean=0, stdev=1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    }

    for (let i = 0; i < 500; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            gaussianRandom(0, 300 * 0.4),
            gaussianRandom(0, 150 * 0.4),
            gaussianRandom(0, 300 * 0.4)
        );
        const size = 30 + Math.random() * 40; // 30 to 70
        sprite.scale.set(size, size, size);
        scene.add(sprite);
        clouds.push(sprite);
    }

    for (let i = 0; i < 500; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            gaussianRandom(0, 500 * 0.4),
            gaussianRandom(0, 300 * 0.4),
            gaussianRandom(0, 500 * 0.4) - 500
        );
        const size = 30 + Math.random() * 400; // 30 to 70
        sprite.scale.set(size, size, size);
        scene.add(sprite);
        backgroundClouds.push(sprite);
    }
});

camera.position.set(20, 40, 120);
camera.rotation.set(0, 0, 0);
camera.scale.set(1, 1, 1);
camera.lookAt(90, 0, -15);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const filmPass = new FilmPass(0.5, false);
composer.addPass(filmPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const fxaaPass = new FXAAPass();
composer.addPass(fxaaPass);

//const controls = new OrbitControls(camera, renderer.domElement);

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const clock = new THREE.Clock();

function animate() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        composer.setSize(canvas.width, canvas.height);
    }

    const elapsed = clock.getElapsedTime();
    const cycle = 3.0;
    const t = elapsed % cycle;

    if (t_strobe_light) {
        t_strobe_light.intensity = t < 0.1 ? 5000 : 0;
    }


    if (ref_gripen) {
        const angle = Math.sin(elapsed * 0.25) * THREE.MathUtils.degToRad(35);
        const offset = Math.cos(elapsed * 0.1) * 0.05;

        ref_gripen.rotation.x = angle;
        ref_gripen.position.y += offset;
    }

    for (let cloud of clouds) {
        cloud.position.x -= 3; // drift speed

        // Optionally, loop them back when they get too far
        if (cloud.position.x < -50) {
            cloud.position.x += 800;
        }
    }

    for (let cloud of backgroundClouds) {
        cloud.position.x -= 1; // drift speed

        // Optionally, loop them back when they get too far
        if (cloud.position.x < -250) {
            cloud.position.x += 1500;
        }
    }

    //controls.update();
    if (!window.mobileCheck()) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

composer.setAnimationLoop(animate);
