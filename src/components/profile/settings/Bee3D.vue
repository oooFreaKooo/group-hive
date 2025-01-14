<template>
    <div
        ref="container3D"
        :class="{ 'overflow-hidden': !props.isPopover }"
    />
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps<{
    avatar?: string
    isPopover?: boolean
}>()

// Refs and state
const container3D = ref<HTMLElement | null>(null)
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let mixer: THREE.AnimationMixer
let controls: OrbitControls
const animationFrameId = ref<number | null>(null)
let headMaterial: THREE.MeshStandardMaterial | null = null

// Watch for avatar changes
watch(() => props.avatar, (newAvatar) => {
    if (newAvatar && headMaterial) {
        // Load new texture
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(newAvatar, (texture) => {
            texture.flipY = false
            texture.repeat.set(3, 2)
            texture.center.set(0.15, 0.0)
            texture.offset.set(0.01, -0.5)
            texture.colorSpace = THREE.SRGBColorSpace
            if (headMaterial) {
                headMaterial.map = texture
                headMaterial.needsUpdate = true
            }
        })
    }
}, { immediate: true })

// Initialize Three.js scene
const initScene = () => {
    // Scene setup
    scene = new THREE.Scene()

    // Get container dimensions
    const containerWidth = container3D.value?.clientWidth || 300
    const containerHeight = container3D.value?.clientHeight || 300

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        containerWidth / containerHeight,
        0.1,
        1000,
    )
    camera.position.z = 7.5
    camera.position.x = 0.0
    camera.position.y = 1.5

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(containerWidth, containerHeight)
    container3D.value?.appendChild(renderer.domElement)

    // Set canvas style to stay within container
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    if (props.isPopover) {
        renderer.domElement.style.background = 'transparent'
    } else {
        renderer.domElement.style.background = 'var(--bs-dark-subtle)'
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2)
    directionalLight.position.set(500, 500, 500)
    scene.add(directionalLight)

    // Set up OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 5
    controls.maxDistance = 10
    controls.enablePan = false
    controls.target.set(0, 1.5, 0)
}

// Load models
const loadModels = async () => {
    const loader = new GLTFLoader()
    const rotationY = -0.25
    const rotationX = 0.15

    // Load bee body
    const bodyGLTF = await loader.loadAsync('/bee_body.glb')
    bodyGLTF.scene.rotation.y = rotationY
    bodyGLTF.scene.rotation.x = rotationX
    scene.add(bodyGLTF.scene)

    // Load bee head
    const headGLTF = await loader.loadAsync('/bee_head.glb')
    headGLTF.scene.rotation.y = rotationY
    headGLTF.scene.rotation.x = rotationX
    scene.add(headGLTF.scene)

    // Load bee head
    const antennaGLTF = await loader.loadAsync('/bee_antenna.glb')
    antennaGLTF.scene.rotation.y = rotationY
    antennaGLTF.scene.rotation.x = rotationX
    scene.add(antennaGLTF.scene)

    // Setup head material with avatar texture
    headMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.0,
        roughness: 0.4,
    })

    // Apply material to head mesh
    headGLTF.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = headMaterial
        }
    })

    // If avatar is already set, load it
    if (props.avatar && headMaterial) {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(props.avatar, (texture) => {
            texture.flipY = false
            texture.repeat.set(3, 2)
            texture.center.set(0.15, 0.0)
            texture.offset.set(0.01, -0.5)
            texture.colorSpace = THREE.SRGBColorSpace
            if (headMaterial) {
                headMaterial.map = texture
                headMaterial.needsUpdate = true
            }
        })
    }

    // Setup animations
    mixer = new THREE.AnimationMixer(scene)

    mixer.clipAction(bodyGLTF.animations[0]).play()
    mixer.clipAction(headGLTF.animations[0]).play()
    mixer.clipAction(antennaGLTF.animations[2]).play()
}

// Animation loop
const animate = () => {
    animationFrameId.value = requestAnimationFrame(animate)

    if (mixer) {
        mixer.update(0.016) // ~60fps
    }

    controls.update() // Update controls in animation loop
    renderer.render(scene, camera)
}

// Handle window resize
const onResize = () => {
    if (!container3D.value || !camera || !renderer) { return }

    const containerWidth = container3D.value.clientWidth
    const containerHeight = container3D.value.clientHeight

    camera.aspect = containerWidth / containerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerWidth, containerHeight)
}

// Lifecycle hooks
onMounted(async () => {
    initScene()
    await loadModels()
    animate()

    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(onResize)
    if (container3D.value) {
        resizeObserver.observe(container3D.value)
    }

    window.addEventListener('resize', onResize)
})
</script>

<style scoped>

</style>
