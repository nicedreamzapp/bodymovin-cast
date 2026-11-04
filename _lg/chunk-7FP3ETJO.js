import {
  FullScreenQuad,
  Pass
} from "./chunk-UBB4M7UR.js";
import {
  Color,
  HalfFloatType,
  MeshDepthMaterial,
  NearestFilter,
  NoBlending,
  RGBADepthPacking,
  ShaderMaterial,
  UniformsUtils,
  WebGLRenderTarget
} from "./chunk-4IYDSAYK.js";

// dist/three/addons/shaders/BokehShader.js
var BokehShader = {
  name: "BokehShader",
  defines: {
    "DEPTH_PACKING": 1,
    "PERSPECTIVE_CAMERA": 1
  },
  uniforms: {
    "tColor": { value: null },
    "tDepth": { value: null },
    "focus": { value: 1 },
    "aspect": { value: 1 },
    "aperture": { value: 0.025 },
    "maxblur": { value: 0.01 },
    "nearClip": { value: 1 },
    "farClip": { value: 1e3 }
  },
  vertexShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		#include <common>\n\n		varying vec2 vUv;\n\n		uniform sampler2D tColor;\n		uniform sampler2D tDepth;\n\n		uniform float maxblur; // max blur amount\n		uniform float aperture; // aperture - bigger values for shallower depth of field\n\n		uniform float nearClip;\n		uniform float farClip;\n\n		uniform float focus;\n		uniform float aspect;\n\n		#include <packing>\n\n		float getDepth( const in vec2 screenPosition ) {\n			#if DEPTH_PACKING == 1\n			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );\n			#else\n			return texture2D( tDepth, screenPosition ).x;\n			#endif\n		}\n\n		float getViewZ( const in float depth ) {\n			#if PERSPECTIVE_CAMERA == 1\n			return perspectiveDepthToViewZ( depth, nearClip, farClip );\n			#else\n			return orthographicDepthToViewZ( depth, nearClip, farClip );\n			#endif\n		}\n\n\n		void main() {\n\n			vec2 aspectcorrect = vec2( 1.0, aspect );\n\n			float viewZ = getViewZ( getDepth( vUv ) );\n\n			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation\n\n			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );\n\n			vec2 dofblur9 = dofblur * 0.9;\n			vec2 dofblur7 = dofblur * 0.7;\n			vec2 dofblur4 = dofblur * 0.4;\n\n			vec4 col = vec4( 0.0 );\n\n			col += texture2D( tColor, vUv.xy );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );\n\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\n\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );\n\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\n			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );\n\n			gl_FragColor = col / 41.0;\n			gl_FragColor.a = 1.0;\n\n		}"
  )
};

// dist/three/addons/postprocessing/BokehPass.js
var BokehPass = class extends Pass {
  constructor(scene, camera, params) {
    super();
    this.scene = scene;
    this.camera = camera;
    const focus = params.focus !== void 0 ? params.focus : 1;
    const aperture = params.aperture !== void 0 ? params.aperture : 0.025;
    const maxblur = params.maxblur !== void 0 ? params.maxblur : 1;
    this.renderTargetDepth = new WebGLRenderTarget(1, 1, {
      // will be resized later
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      type: HalfFloatType
    });
    this.renderTargetDepth.texture.name = "BokehPass.depth";
    this.materialDepth = new MeshDepthMaterial();
    this.materialDepth.depthPacking = RGBADepthPacking;
    this.materialDepth.blending = NoBlending;
    const bokehShader = BokehShader;
    const bokehUniforms = UniformsUtils.clone(bokehShader.uniforms);
    bokehUniforms["tDepth"].value = this.renderTargetDepth.texture;
    bokehUniforms["focus"].value = focus;
    bokehUniforms["aspect"].value = camera.aspect;
    bokehUniforms["aperture"].value = aperture;
    bokehUniforms["maxblur"].value = maxblur;
    bokehUniforms["nearClip"].value = camera.near;
    bokehUniforms["farClip"].value = camera.far;
    this.materialBokeh = new ShaderMaterial({
      defines: Object.assign({}, bokehShader.defines),
      uniforms: bokehUniforms,
      vertexShader: bokehShader.vertexShader,
      fragmentShader: bokehShader.fragmentShader
    });
    this.uniforms = bokehUniforms;
    this.fsQuad = new FullScreenQuad(this.materialBokeh);
    this._oldClearColor = new Color();
  }
  render(renderer, writeBuffer, readBuffer) {
    this.scene.overrideMaterial = this.materialDepth;
    renderer.getClearColor(this._oldClearColor);
    const oldClearAlpha = renderer.getClearAlpha();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setClearColor(16777215);
    renderer.setClearAlpha(1);
    renderer.setRenderTarget(this.renderTargetDepth);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    this.uniforms["tColor"].value = readBuffer.texture;
    this.uniforms["nearClip"].value = this.camera.near;
    this.uniforms["farClip"].value = this.camera.far;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      renderer.clear();
      this.fsQuad.render(renderer);
    }
    this.scene.overrideMaterial = null;
    renderer.setClearColor(this._oldClearColor);
    renderer.setClearAlpha(oldClearAlpha);
    renderer.autoClear = oldAutoClear;
  }
  setSize(width, height) {
    this.materialBokeh.uniforms["aspect"].value = width / height;
    this.renderTargetDepth.setSize(width, height);
  }
  dispose() {
    this.renderTargetDepth.dispose();
    this.materialDepth.dispose();
    this.materialBokeh.dispose();
    this.fsQuad.dispose();
  }
};

export {
  BokehPass
};
