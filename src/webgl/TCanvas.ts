import * as THREE from 'three'
import { gl } from './core/WebGL'
import { Assets, loadAssets } from './utils/assetLoader'
import { controls } from './utils/OrbitControls'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import 'glsl-noise/simplex/2d.glsl'
import { GUIController } from './utils/gui'
import { mouse2d } from './utils/Mouse2D'
import { lenis } from '../index'

const colorDummy = new THREE.Color()

const uniforms = {
  color: 0x51b1f5,
  lightIntensity: 0.7,
  noiseFactor: 2.0,
  rotate: false,
  elapsed: 0,
  uLightPos: new THREE.Vector3(0, 2, 4),
}

export class TCanvas {
  direction: number

  private assets: Assets = {
    // https://sketchfab.com/3d-models/deer-sculpture-e97f99c0216a4cae9a8b11d044d2694a
    model: { path: '/resources/deer.glb' },
  }

  constructor(private parentNode: ParentNode) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      this.addHelper()
      gl.requestAnimationFrame(this.anime)

      lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        if (direction !== 0) {
          this.direction = direction
        }
        uniforms.uLightPos.set(Math.sin(progress * Math.PI * 2) * 4, 2, Math.cos(progress * Math.PI * 2) * 4)
      })
    })
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#fff')
    gl.camera.position.set(-0.95, 1.57, 2.34)
  }

  // lil-gui
  private createObjects() {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        //uColor: { value: new THREE.Color(0x51b1f5) },
        uColor: { value: new THREE.Color(0x313131) },
        // position of spotlight
        uLightPos: {
          value: uniforms.uLightPos,
        },
        // default light color
        uLightColor: {
          value: new THREE.Color(0xffffff),
        },
        uLightIntensity: {
          value: uniforms.lightIntensity,
        },
        uNoiseFactor: {
          value: uniforms.noiseFactor,
        },
      },
      vertexShader,
      fragmentShader,
    })

    // --------------------
    // deer model
    const model = (this.assets.model.data as any).scene.children[0] as THREE.Mesh
    model.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.75, 0))
    model.material = material
    model.name = 'deer'
    gl.scene.add(model)

    const plane = new THREE.PlaneGeometry(100, 100, 10, 10)
    const planeMesh = new THREE.Mesh(plane, material)
    planeMesh.name = 'floor'
    planeMesh.position.set(0, -0.75, 0)
    planeMesh.rotation.set(-Math.PI / 2, 0, 0)
    gl.scene.add(planeMesh)
  }

  private addHelper() {
    const axesHelper = new THREE.AxesHelper(10)
    gl.scene.add(axesHelper)
  }

  // ----------------------------------
  // animation
  private anime = () => {
    // window.scrollBy(0, this.direction * 4)

    const model = gl.getMesh<THREE.ShaderMaterial>('deer')

    if (uniforms.rotate) {
      uniforms.elapsed += gl.time.delta
      model.material.uniforms.uLightPos.value = model.material.uniforms.uLightPos.value
        .clone()
        .set(Math.sin(uniforms.elapsed) * 5, 3, Math.cos(uniforms.elapsed) * 5)
    }

    model.material.uniforms.uLightPos.value = uniforms.uLightPos
    model.material.uniforms.uColor.value = colorDummy.setHex(uniforms.color)
    model.material.uniforms.uLightIntensity.value = uniforms.lightIntensity
    model.material.uniforms.uNoiseFactor.value = uniforms.noiseFactor

    // model.material.uniforms.uLightPos.value = v3Dummy
    //   .set(mouse2d.position[0] * 12, 5, -mouse2d.position[1] * 12)
    //   .clone()

    controls.update()
    controls.disable()
    gl.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
