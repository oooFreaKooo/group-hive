<template>
    <div
        ref="container3D"
    />
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps<{
    avatar?: string
}>()

// Refs and state
const container3D = ref<HTMLElement | null>(null)
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let mixer: THREE.AnimationMixer
let animationFrameId: number
let beeBody: THREE.Group
let beeHead: THREE.Group
let headMaterial: THREE.MeshStandardMaterial | null = null

// Watch for avatar changes
watch(() => props.avatar, (newAvatar) => {
    if (newAvatar && headMaterial) {
        // Load new texture
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(newAvatar, (texture) => {
            texture.flipY = false
            texture.repeat.set(3, 2)
            texture.center.set(0.18, 0.1)
            texture.offset.set(0, -0.5)
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
    camera.position.z = 3.5
    camera.position.y = 0.75

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
    renderer.domElement.style.background = 'var(--bs-light)'

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
    directionalLight.position.set(500, 500, 500)
    scene.add(directionalLight)
}

// Load models
const loadModels = async () => {
    const loader = new GLTFLoader()

    // Load bee body
    const bodyGLTF = await loader.loadAsync('/bee_body.glb')
    beeBody = bodyGLTF.scene
    beeBody.rotation.y = -0.45
    scene.add(beeBody)

    // Load bee head
    const headGLTF = await loader.loadAsync('/bee_head.glb')
    beeHead = headGLTF.scene
    beeHead.rotation.y = -0.45
    scene.add(beeHead)

    // Setup head material with avatar texture
    headMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.8,
    })

    // Apply material to head mesh
    beeHead.traverse((child) => {
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
            texture.center.set(0.18, 0.1)
            texture.offset.set(0, -0.5)
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
}

// Animation loop
const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    if (mixer) {
        mixer.update(0.016) // ~60fps
    }

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

    onBeforeUnmount(() => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animationFrameId)

        // Cleanup
        if (renderer) {
            renderer.dispose()
        }
        if (mixer) {
            mixer.stopAllAction()
        }
    })
})
</script>

<style scoped>

</style>
