import {
  GLTFLoader
} from "./chunk-CPYHHAA5.js";
import {
  FullScreenQuad,
  Pass,
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  ACESFilmicToneMapping,
  AddEquation,
  AdditiveBlending,
  AgXToneMapping,
  BackSide,
  CineonToneMapping,
  Clock,
  Color,
  ColorManagement,
  CustomBlending,
  DataTexture,
  DataTextureLoader,
  DataUtils,
  DepthStencilFormat,
  DepthTexture,
  DirectionalLight,
  DstAlphaFactor,
  DstColorFactor,
  EquirectangularReflectionMapping,
  Euler,
  FloatType,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  LinearToneMapping,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NeutralToneMapping,
  NoBlending,
  OneFactor,
  PCFSoftShadowMap,
  PerspectiveCamera,
  RGBAFormat,
  RawShaderMaterial,
  ReinhardToneMapping,
  RepeatWrapping,
  SRGBColorSpace,
  SRGBTransfer,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Texture,
  TextureLoader,
  UniformsUtils,
  UnsignedByteType,
  UnsignedInt248Type,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  ZeroFactor
} from "./chunk-4IYDSAYK.js";
import {
  __export
} from "./chunk-NWIHTO7D.js";

// dist/realism.js
var realism_exports = {};
__export(realism_exports, {
  environment: () => environment,
  flash: () => flash,
  model: () => model,
  pbr: () => pbr,
  render: () => render,
  setup: () => setup,
  shake: () => shake,
  state: () => state,
  sun: () => sun,
  tv: () => tv
});

// dist/three/addons/loaders/RGBELoader.js
var RGBELoader = class extends DataTextureLoader {
  constructor(manager) {
    super(manager);
    this.type = HalfFloatType;
  }
  // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
  parse(buffer) {
    const rgbe_read_error = 1, rgbe_write_error = 2, rgbe_format_error = 3, rgbe_memory_error = 4, rgbe_error = function(rgbe_error_code, msg) {
      switch (rgbe_error_code) {
        case rgbe_read_error:
          throw new Error("THREE.RGBELoader: Read Error: " + (msg || ""));
        case rgbe_write_error:
          throw new Error("THREE.RGBELoader: Write Error: " + (msg || ""));
        case rgbe_format_error:
          throw new Error("THREE.RGBELoader: Bad File Format: " + (msg || ""));
        default:
        case rgbe_memory_error:
          throw new Error("THREE.RGBELoader: Memory Error: " + (msg || ""));
      }
    }, RGBE_VALID_PROGRAMTYPE = 1, RGBE_VALID_FORMAT = 2, RGBE_VALID_DIMENSIONS = 4, NEWLINE = "\n", fgets = function(buffer2, lineLimit, consume) {
      const chunkSize = 128;
      lineLimit = !lineLimit ? 1024 : lineLimit;
      let p = buffer2.pos, i = -1, len = 0, s = "", chunk = String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
      while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer2.byteLength) {
        s += chunk;
        len += chunk.length;
        p += chunkSize;
        chunk += String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
      }
      if (-1 < i) {
        if (false !== consume) buffer2.pos += len + i + 1;
        return s + chunk.slice(0, i);
      }
      return false;
    }, RGBE_ReadHeader = function(buffer2) {
      const magic_token_re = /^#\?(\S+)/, gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, format_re = /^\s*FORMAT=(\S+)\s*$/, dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, header = {
        valid: 0,
        /* indicate which fields are valid */
        string: "",
        /* the actual header string */
        comments: "",
        /* comments found in header */
        programtype: "RGBE",
        /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */
        format: "",
        /* RGBE format, default 32-bit_rle_rgbe */
        gamma: 1,
        /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */
        exposure: 1,
        /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */
        width: 0,
        height: 0
        /* image dimensions, width/height */
      };
      let line, match;
      if (buffer2.pos >= buffer2.byteLength || !(line = fgets(buffer2))) {
        rgbe_error(rgbe_read_error, "no header found");
      }
      if (!(match = line.match(magic_token_re))) {
        rgbe_error(rgbe_format_error, "bad initial token");
      }
      header.valid |= RGBE_VALID_PROGRAMTYPE;
      header.programtype = match[1];
      header.string += line + "\n";
      while (true) {
        line = fgets(buffer2);
        if (false === line) break;
        header.string += line + "\n";
        if ("#" === line.charAt(0)) {
          header.comments += line + "\n";
          continue;
        }
        if (match = line.match(gamma_re)) {
          header.gamma = parseFloat(match[1]);
        }
        if (match = line.match(exposure_re)) {
          header.exposure = parseFloat(match[1]);
        }
        if (match = line.match(format_re)) {
          header.valid |= RGBE_VALID_FORMAT;
          header.format = match[1];
        }
        if (match = line.match(dimensions_re)) {
          header.valid |= RGBE_VALID_DIMENSIONS;
          header.height = parseInt(match[1], 10);
          header.width = parseInt(match[2], 10);
        }
        if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
      }
      if (!(header.valid & RGBE_VALID_FORMAT)) {
        rgbe_error(rgbe_format_error, "missing format specifier");
      }
      if (!(header.valid & RGBE_VALID_DIMENSIONS)) {
        rgbe_error(rgbe_format_error, "missing image size specifier");
      }
      return header;
    }, RGBE_ReadPixels_RLE = function(buffer2, w2, h2) {
      const scanline_width = w2;
      if (
        // run length encoding is not allowed so read flat
        scanline_width < 8 || scanline_width > 32767 || // this file is not run length encoded
        (2 !== buffer2[0] || 2 !== buffer2[1] || buffer2[2] & 128)
      ) {
        return new Uint8Array(buffer2);
      }
      if (scanline_width !== (buffer2[2] << 8 | buffer2[3])) {
        rgbe_error(rgbe_format_error, "wrong scanline width");
      }
      const data_rgba = new Uint8Array(4 * w2 * h2);
      if (!data_rgba.length) {
        rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
      }
      let offset = 0, pos = 0;
      const ptr_end = 4 * scanline_width;
      const rgbeStart = new Uint8Array(4);
      const scanline_buffer = new Uint8Array(ptr_end);
      let num_scanlines = h2;
      while (num_scanlines > 0 && pos < buffer2.byteLength) {
        if (pos + 4 > buffer2.byteLength) {
          rgbe_error(rgbe_read_error);
        }
        rgbeStart[0] = buffer2[pos++];
        rgbeStart[1] = buffer2[pos++];
        rgbeStart[2] = buffer2[pos++];
        rgbeStart[3] = buffer2[pos++];
        if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) {
          rgbe_error(rgbe_format_error, "bad rgbe scanline format");
        }
        let ptr = 0, count;
        while (ptr < ptr_end && pos < buffer2.byteLength) {
          count = buffer2[pos++];
          const isEncodedRun = count > 128;
          if (isEncodedRun) count -= 128;
          if (0 === count || ptr + count > ptr_end) {
            rgbe_error(rgbe_format_error, "bad scanline data");
          }
          if (isEncodedRun) {
            const byteValue = buffer2[pos++];
            for (let i = 0; i < count; i++) {
              scanline_buffer[ptr++] = byteValue;
            }
          } else {
            scanline_buffer.set(buffer2.subarray(pos, pos + count), ptr);
            ptr += count;
            pos += count;
          }
        }
        const l = scanline_width;
        for (let i = 0; i < l; i++) {
          let off = 0;
          data_rgba[offset] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 1] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 2] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 3] = scanline_buffer[i + off];
          offset += 4;
        }
        num_scanlines--;
      }
      return data_rgba;
    };
    const RGBEByteToRGBFloat = function(sourceArray, sourceOffset, destArray, destOffset) {
      const e = sourceArray[sourceOffset + 3];
      const scale = Math.pow(2, e - 128) / 255;
      destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
      destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
      destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
      destArray[destOffset + 3] = 1;
    };
    const RGBEByteToRGBHalf = function(sourceArray, sourceOffset, destArray, destOffset) {
      const e = sourceArray[sourceOffset + 3];
      const scale = Math.pow(2, e - 128) / 255;
      destArray[destOffset + 0] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
      destArray[destOffset + 1] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
      destArray[destOffset + 2] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
      destArray[destOffset + 3] = DataUtils.toHalfFloat(1);
    };
    const byteArray = new Uint8Array(buffer);
    byteArray.pos = 0;
    const rgbe_header_info = RGBE_ReadHeader(byteArray);
    const w = rgbe_header_info.width, h = rgbe_header_info.height, image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
    let data, type;
    let numElements;
    switch (this.type) {
      case FloatType:
        numElements = image_rgba_data.length / 4;
        const floatArray = new Float32Array(numElements * 4);
        for (let j = 0; j < numElements; j++) {
          RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
        }
        data = floatArray;
        type = FloatType;
        break;
      case HalfFloatType:
        numElements = image_rgba_data.length / 4;
        const halfArray = new Uint16Array(numElements * 4);
        for (let j = 0; j < numElements; j++) {
          RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);
        }
        data = halfArray;
        type = HalfFloatType;
        break;
      default:
        throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
        break;
    }
    return {
      width: w,
      height: h,
      data,
      header: rgbe_header_info.string,
      gamma: rgbe_header_info.gamma,
      exposure: rgbe_header_info.exposure,
      type
    };
  }
  setDataType(value) {
    this.type = value;
    return this;
  }
  load(url, onLoad, onProgress, onError) {
    function onLoadCallback(texture, texData) {
      switch (texture.type) {
        case FloatType:
        case HalfFloatType:
          texture.colorSpace = LinearSRGBColorSpace;
          texture.minFilter = LinearFilter;
          texture.magFilter = LinearFilter;
          texture.generateMipmaps = false;
          texture.flipY = true;
          break;
      }
      if (onLoad) onLoad(texture, texData);
    }
    return super.load(url, onLoadCallback, onProgress, onError);
  }
};

// dist/three/addons/shaders/CopyShader.js
var CopyShader = {
  name: "CopyShader",
  uniforms: {
    "tDiffuse": { value: null },
    "opacity": { value: 1 }
  },
  vertexShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		uniform float opacity;\n\n		uniform sampler2D tDiffuse;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = opacity * texel;\n\n\n		}"
  )
};

// dist/three/addons/postprocessing/MaskPass.js
var MaskPass = class extends Pass {
  constructor(scene, camera) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.clear = true;
    this.needsSwap = false;
    this.inverse = false;
  }
  render(renderer, writeBuffer, readBuffer) {
    const context = renderer.getContext();
    const state2 = renderer.state;
    state2.buffers.color.setMask(false);
    state2.buffers.depth.setMask(false);
    state2.buffers.color.setLocked(true);
    state2.buffers.depth.setLocked(true);
    let writeValue, clearValue;
    if (this.inverse) {
      writeValue = 0;
      clearValue = 1;
    } else {
      writeValue = 1;
      clearValue = 0;
    }
    state2.buffers.stencil.setTest(true);
    state2.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
    state2.buffers.stencil.setFunc(context.ALWAYS, writeValue, 4294967295);
    state2.buffers.stencil.setClear(clearValue);
    state2.buffers.stencil.setLocked(true);
    renderer.setRenderTarget(readBuffer);
    if (this.clear) renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(writeBuffer);
    if (this.clear) renderer.clear();
    renderer.render(this.scene, this.camera);
    state2.buffers.color.setLocked(false);
    state2.buffers.depth.setLocked(false);
    state2.buffers.color.setMask(true);
    state2.buffers.depth.setMask(true);
    state2.buffers.stencil.setLocked(false);
    state2.buffers.stencil.setFunc(context.EQUAL, 1, 4294967295);
    state2.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
    state2.buffers.stencil.setLocked(true);
  }
};
var ClearMaskPass = class extends Pass {
  constructor() {
    super();
    this.needsSwap = false;
  }
  render(renderer) {
    renderer.state.buffers.stencil.setLocked(false);
    renderer.state.buffers.stencil.setTest(false);
  }
};

// dist/three/addons/postprocessing/EffectComposer.js
var EffectComposer = class {
  constructor(renderer, renderTarget) {
    this.renderer = renderer;
    this._pixelRatio = renderer.getPixelRatio();
    if (renderTarget === void 0) {
      const size = renderer.getSize(new Vector2());
      this._width = size.width;
      this._height = size.height;
      renderTarget = new WebGLRenderTarget(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: HalfFloatType });
      renderTarget.texture.name = "EffectComposer.rt1";
    } else {
      this._width = renderTarget.width;
      this._height = renderTarget.height;
    }
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();
    this.renderTarget2.texture.name = "EffectComposer.rt2";
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
    this.renderToScreen = true;
    this.passes = [];
    this.copyPass = new ShaderPass(CopyShader);
    this.copyPass.material.blending = NoBlending;
    this.clock = new Clock();
  }
  swapBuffers() {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  }
  addPass(pass) {
    this.passes.push(pass);
    pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
    pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(pass) {
    const index = this.passes.indexOf(pass);
    if (index !== -1) {
      this.passes.splice(index, 1);
    }
  }
  isLastEnabledPass(passIndex) {
    for (let i = passIndex + 1; i < this.passes.length; i++) {
      if (this.passes[i].enabled) {
        return false;
      }
    }
    return true;
  }
  render(deltaTime) {
    if (deltaTime === void 0) {
      deltaTime = this.clock.getDelta();
    }
    const currentRenderTarget = this.renderer.getRenderTarget();
    let maskActive = false;
    for (let i = 0, il = this.passes.length; i < il; i++) {
      const pass = this.passes[i];
      if (pass.enabled === false) continue;
      pass.renderToScreen = this.renderToScreen && this.isLastEnabledPass(i);
      pass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive);
      if (pass.needsSwap) {
        if (maskActive) {
          const context = this.renderer.getContext();
          const stencil = this.renderer.state.buffers.stencil;
          stencil.setFunc(context.NOTEQUAL, 1, 4294967295);
          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime);
          stencil.setFunc(context.EQUAL, 1, 4294967295);
        }
        this.swapBuffers();
      }
      if (MaskPass !== void 0) {
        if (pass instanceof MaskPass) {
          maskActive = true;
        } else if (pass instanceof ClearMaskPass) {
          maskActive = false;
        }
      }
    }
    this.renderer.setRenderTarget(currentRenderTarget);
  }
  reset(renderTarget) {
    if (renderTarget === void 0) {
      const size = this.renderer.getSize(new Vector2());
      this._pixelRatio = this.renderer.getPixelRatio();
      this._width = size.width;
      this._height = size.height;
      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  }
  setSize(width, height) {
    this._width = width;
    this._height = height;
    const effectiveWidth = this._width * this._pixelRatio;
    const effectiveHeight = this._height * this._pixelRatio;
    this.renderTarget1.setSize(effectiveWidth, effectiveHeight);
    this.renderTarget2.setSize(effectiveWidth, effectiveHeight);
    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(effectiveWidth, effectiveHeight);
    }
  }
  setPixelRatio(pixelRatio) {
    this._pixelRatio = pixelRatio;
    this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.copyPass.dispose();
  }
};

// dist/three/addons/postprocessing/RenderPass.js
var RenderPass = class extends Pass {
  constructor(scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.overrideMaterial = overrideMaterial;
    this.clearColor = clearColor;
    this.clearAlpha = clearAlpha;
    this.clear = true;
    this.clearDepth = false;
    this.needsSwap = false;
    this._oldClearColor = new Color();
  }
  render(renderer, writeBuffer, readBuffer) {
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    let oldClearAlpha, oldOverrideMaterial;
    if (this.overrideMaterial !== null) {
      oldOverrideMaterial = this.scene.overrideMaterial;
      this.scene.overrideMaterial = this.overrideMaterial;
    }
    if (this.clearColor !== null) {
      renderer.getClearColor(this._oldClearColor);
      renderer.setClearColor(this.clearColor, renderer.getClearAlpha());
    }
    if (this.clearAlpha !== null) {
      oldClearAlpha = renderer.getClearAlpha();
      renderer.setClearAlpha(this.clearAlpha);
    }
    if (this.clearDepth == true) {
      renderer.clearDepth();
    }
    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
    if (this.clear === true) {
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }
    renderer.render(this.scene, this.camera);
    if (this.clearColor !== null) {
      renderer.setClearColor(this._oldClearColor);
    }
    if (this.clearAlpha !== null) {
      renderer.setClearAlpha(oldClearAlpha);
    }
    if (this.overrideMaterial !== null) {
      this.scene.overrideMaterial = oldOverrideMaterial;
    }
    renderer.autoClear = oldAutoClear;
  }
};

// dist/three/addons/shaders/LuminosityHighPassShader.js
var LuminosityHighPassShader = {
  name: "LuminosityHighPassShader",
  shaderID: "luminosityHighPass",
  uniforms: {
    "tDiffuse": { value: null },
    "luminosityThreshold": { value: 1 },
    "smoothWidth": { value: 1 },
    "defaultColor": { value: new Color(0) },
    "defaultOpacity": { value: 0 }
  },
  vertexShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		uniform sampler2D tDiffuse;\n		uniform vec3 defaultColor;\n		uniform float defaultOpacity;\n		uniform float luminosityThreshold;\n		uniform float smoothWidth;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n\n			float v = luminance( texel.xyz );\n\n			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );\n\n			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );\n\n			gl_FragColor = mix( outputColor, texel, alpha );\n\n		}"
  )
};

// dist/three/addons/postprocessing/UnrealBloomPass.js
var UnrealBloomPass = class _UnrealBloomPass extends Pass {
  constructor(resolution, strength, radius, threshold) {
    super();
    this.strength = strength !== void 0 ? strength : 1;
    this.radius = radius;
    this.threshold = threshold;
    this.resolution = resolution !== void 0 ? new Vector2(resolution.x, resolution.y) : new Vector2(256, 256);
    this.clearColor = new Color(0, 0, 0);
    this.renderTargetsHorizontal = [];
    this.renderTargetsVertical = [];
    this.nMips = 5;
    let resx = Math.round(this.resolution.x / 2);
    let resy = Math.round(this.resolution.y / 2);
    this.renderTargetBright = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
    this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
    this.renderTargetBright.texture.generateMipmaps = false;
    for (let i = 0; i < this.nMips; i++) {
      const renderTargetHorizontal = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
      renderTargetHorizontal.texture.name = "UnrealBloomPass.h" + i;
      renderTargetHorizontal.texture.generateMipmaps = false;
      this.renderTargetsHorizontal.push(renderTargetHorizontal);
      const renderTargetVertical = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
      renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;
      renderTargetVertical.texture.generateMipmaps = false;
      this.renderTargetsVertical.push(renderTargetVertical);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
    const highPassShader = LuminosityHighPassShader;
    this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms);
    this.highPassUniforms["luminosityThreshold"].value = threshold;
    this.highPassUniforms["smoothWidth"].value = 0.01;
    this.materialHighPassFilter = new ShaderMaterial({
      uniforms: this.highPassUniforms,
      vertexShader: highPassShader.vertexShader,
      fragmentShader: highPassShader.fragmentShader
    });
    this.separableBlurMaterials = [];
    const kernelSizeArray = [3, 5, 7, 9, 11];
    resx = Math.round(this.resolution.x / 2);
    resy = Math.round(this.resolution.y / 2);
    for (let i = 0; i < this.nMips; i++) {
      this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]));
      this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
    this.compositeMaterial = this.getCompositeMaterial(this.nMips);
    this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
    this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
    this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
    this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
    this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
    this.compositeMaterial.uniforms["bloomStrength"].value = strength;
    this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
    const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];
    this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
    this.bloomTintColors = [new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1)];
    this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
    const copyShader = CopyShader;
    this.copyUniforms = UniformsUtils.clone(copyShader.uniforms);
    this.blendMaterial = new ShaderMaterial({
      uniforms: this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    this.enabled = true;
    this.needsSwap = false;
    this._oldClearColor = new Color();
    this.oldClearAlpha = 1;
    this.basic = new MeshBasicMaterial();
    this.fsQuad = new FullScreenQuad(null);
  }
  dispose() {
    for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
      this.renderTargetsHorizontal[i].dispose();
    }
    for (let i = 0; i < this.renderTargetsVertical.length; i++) {
      this.renderTargetsVertical[i].dispose();
    }
    this.renderTargetBright.dispose();
    for (let i = 0; i < this.separableBlurMaterials.length; i++) {
      this.separableBlurMaterials[i].dispose();
    }
    this.compositeMaterial.dispose();
    this.blendMaterial.dispose();
    this.basic.dispose();
    this.fsQuad.dispose();
  }
  setSize(width, height) {
    let resx = Math.round(width / 2);
    let resy = Math.round(height / 2);
    this.renderTargetBright.setSize(resx, resy);
    for (let i = 0; i < this.nMips; i++) {
      this.renderTargetsHorizontal[i].setSize(resx, resy);
      this.renderTargetsVertical[i].setSize(resx, resy);
      this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
  }
  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    renderer.getClearColor(this._oldClearColor);
    this.oldClearAlpha = renderer.getClearAlpha();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setClearColor(this.clearColor, 0);
    if (maskActive) renderer.state.buffers.stencil.setTest(false);
    if (this.renderToScreen) {
      this.fsQuad.material = this.basic;
      this.basic.map = readBuffer.texture;
      renderer.setRenderTarget(null);
      renderer.clear();
      this.fsQuad.render(renderer);
    }
    this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
    this.highPassUniforms["luminosityThreshold"].value = this.threshold;
    this.fsQuad.material = this.materialHighPassFilter;
    renderer.setRenderTarget(this.renderTargetBright);
    renderer.clear();
    this.fsQuad.render(renderer);
    let inputRenderTarget = this.renderTargetBright;
    for (let i = 0; i < this.nMips; i++) {
      this.fsQuad.material = this.separableBlurMaterials[i];
      this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
      this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionX;
      renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
      renderer.clear();
      this.fsQuad.render(renderer);
      this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
      this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionY;
      renderer.setRenderTarget(this.renderTargetsVertical[i]);
      renderer.clear();
      this.fsQuad.render(renderer);
      inputRenderTarget = this.renderTargetsVertical[i];
    }
    this.fsQuad.material = this.compositeMaterial;
    this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
    this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;
    this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
    renderer.setRenderTarget(this.renderTargetsHorizontal[0]);
    renderer.clear();
    this.fsQuad.render(renderer);
    this.fsQuad.material = this.blendMaterial;
    this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;
    if (maskActive) renderer.state.buffers.stencil.setTest(true);
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(readBuffer);
      this.fsQuad.render(renderer);
    }
    renderer.setClearColor(this._oldClearColor, this.oldClearAlpha);
    renderer.autoClear = oldAutoClear;
  }
  getSeperableBlurMaterial(kernelRadius) {
    const coefficients = [];
    for (let i = 0; i < kernelRadius; i++) {
      coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (kernelRadius * kernelRadius)) / kernelRadius);
    }
    return new ShaderMaterial({
      defines: {
        "KERNEL_RADIUS": kernelRadius
      },
      uniforms: {
        "colorTexture": { value: null },
        "invSize": { value: new Vector2(0.5, 0.5) },
        // inverse texture size
        "direction": { value: new Vector2(0.5, 0.5) },
        "gaussianCoefficients": { value: coefficients }
        // precomputed Gaussian coefficients
      },
      vertexShader: "varying vec2 vUv;\n				void main() {\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n				}",
      fragmentShader: "#include <common>\n				varying vec2 vUv;\n				uniform sampler2D colorTexture;\n				uniform vec2 invSize;\n				uniform vec2 direction;\n				uniform float gaussianCoefficients[KERNEL_RADIUS];\n\n				void main() {\n					float weightSum = gaussianCoefficients[0];\n					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;\n					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\n						float x = float(i);\n						float w = gaussianCoefficients[i];\n						vec2 uvOffset = direction * invSize * x;\n						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;\n						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;\n						diffuseSum += (sample1 + sample2) * w;\n						weightSum += 2.0 * w;\n					}\n					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n				}"
    });
  }
  getCompositeMaterial(nMips) {
    return new ShaderMaterial({
      defines: {
        "NUM_MIPS": nMips
      },
      uniforms: {
        "blurTexture1": { value: null },
        "blurTexture2": { value: null },
        "blurTexture3": { value: null },
        "blurTexture4": { value: null },
        "blurTexture5": { value: null },
        "bloomStrength": { value: 1 },
        "bloomFactors": { value: null },
        "bloomTintColors": { value: null },
        "bloomRadius": { value: 0 }
      },
      vertexShader: "varying vec2 vUv;\n				void main() {\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n				}",
      fragmentShader: "varying vec2 vUv;\n				uniform sampler2D blurTexture1;\n				uniform sampler2D blurTexture2;\n				uniform sampler2D blurTexture3;\n				uniform sampler2D blurTexture4;\n				uniform sampler2D blurTexture5;\n				uniform float bloomStrength;\n				uniform float bloomRadius;\n				uniform float bloomFactors[NUM_MIPS];\n				uniform vec3 bloomTintColors[NUM_MIPS];\n\n				float lerpBloomFactor(const in float factor) {\n					float mirrorFactor = 1.2 - factor;\n					return mix(factor, mirrorFactor, bloomRadius);\n				}\n\n				void main() {\n					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +\n						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +\n						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +\n						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +\n						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );\n				}"
    });
  }
};
UnrealBloomPass.BlurDirectionX = new Vector2(1, 0);
UnrealBloomPass.BlurDirectionY = new Vector2(0, 1);

// dist/three/addons/shaders/GTAOShader.js
var GTAOShader = {
  name: "GTAOShader",
  defines: {
    PERSPECTIVE_CAMERA: 1,
    SAMPLES: 16,
    NORMAL_VECTOR_TYPE: 1,
    DEPTH_SWIZZLING: "x",
    SCREEN_SPACE_RADIUS: 0,
    SCREEN_SPACE_RADIUS_SCALE: 100,
    SCENE_CLIP_BOX: 0
  },
  uniforms: {
    tNormal: { value: null },
    tDepth: { value: null },
    tNoise: { value: null },
    resolution: { value: new Vector2() },
    cameraNear: { value: null },
    cameraFar: { value: null },
    cameraProjectionMatrix: { value: new Matrix4() },
    cameraProjectionMatrixInverse: { value: new Matrix4() },
    cameraWorldMatrix: { value: new Matrix4() },
    radius: { value: 0.25 },
    distanceExponent: { value: 1 },
    thickness: { value: 1 },
    distanceFallOff: { value: 1 },
    scale: { value: 1 },
    sceneBoxMin: { value: new Vector3(-1, -1, -1) },
    sceneBoxMax: { value: new Vector3(1, 1, 1) }
  },
  vertexShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n		varying vec2 vUv;\n		uniform highp sampler2D tNormal;\n		uniform highp sampler2D tDepth;\n		uniform sampler2D tNoise;\n		uniform vec2 resolution;\n		uniform float cameraNear;\n		uniform float cameraFar;\n		uniform mat4 cameraProjectionMatrix;\n		uniform mat4 cameraProjectionMatrixInverse;		\n		uniform mat4 cameraWorldMatrix;\n		uniform float radius;\n		uniform float distanceExponent;\n		uniform float thickness;\n		uniform float distanceFallOff;\n		uniform float scale;\n		#if SCENE_CLIP_BOX == 1\n			uniform vec3 sceneBoxMin;\n			uniform vec3 sceneBoxMax;\n		#endif\n		\n		#include <common>\n		#include <packing>\n\n		#ifndef FRAGMENT_OUTPUT\n		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)\n		#endif\n\n		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {\n			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);\n			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;\n			return viewSpacePosition.xyz / viewSpacePosition.w;\n		}\n\n		float getDepth(const vec2 uv) {  \n			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;\n		}\n\n		float fetchDepth(const ivec2 uv) {   \n			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;\n		}\n\n		float getViewZ(const in float depth) {\n			#if PERSPECTIVE_CAMERA == 1\n				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);\n			#else\n				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);\n			#endif\n		}\n\n		vec3 computeNormalFromDepth(const vec2 uv) {\n			vec2 size = vec2(textureSize(tDepth, 0));\n			ivec2 p = ivec2(uv * size);\n			float c0 = fetchDepth(p);\n			float l2 = fetchDepth(p - ivec2(2, 0));\n			float l1 = fetchDepth(p - ivec2(1, 0));\n			float r1 = fetchDepth(p + ivec2(1, 0));\n			float r2 = fetchDepth(p + ivec2(2, 0));\n			float b2 = fetchDepth(p - ivec2(0, 2));\n			float b1 = fetchDepth(p - ivec2(0, 1));\n			float t1 = fetchDepth(p + ivec2(0, 1));\n			float t2 = fetchDepth(p + ivec2(0, 2));\n			float dl = abs((2.0 * l1 - l2) - c0);\n			float dr = abs((2.0 * r1 - r2) - c0);\n			float db = abs((2.0 * b1 - b2) - c0);\n			float dt = abs((2.0 * t1 - t2) - c0);\n			vec3 ce = getViewPosition(uv, c0).xyz;\n			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;\n			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;\n			return normalize(cross(dpdx, dpdy));\n		}\n\n		vec3 getViewNormal(const vec2 uv) {\n			#if NORMAL_VECTOR_TYPE == 2\n				return normalize(textureLod(tNormal, uv, 0.).rgb);\n			#elif NORMAL_VECTOR_TYPE == 1\n				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);\n			#else\n				return computeNormalFromDepth(uv);\n			#endif\n		}\n\n		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {\n			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);\n			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;\n			float sampleSceneDepth = getDepth(sampleUv);\n			return vec3(sampleUv, sampleSceneDepth);\n		}\n		\n		void main() {\n			float depth = getDepth(vUv.xy);\n			if (depth >= 1.0) {\n				discard;\n				return;\n			}\n			vec3 viewPos = getViewPosition(vUv, depth);\n			vec3 viewNormal = getViewNormal(vUv);\n\n			float radiusToUse = radius;\n			float distanceFalloffToUse = thickness;\n			#if SCREEN_SPACE_RADIUS == 1\n				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;\n				radiusToUse *= radiusScale;\n				distanceFalloffToUse *= radiusScale;\n			#endif\n\n			#if SCENE_CLIP_BOX == 1\n				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;\n				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));\n				if (boxDistance > radiusToUse) {\n					discard;\n					return;\n				}\n			#endif\n			\n			vec2 noiseResolution = vec2(textureSize(tNoise, 0));\n			vec2 noiseUv = vUv * resolution / noiseResolution;\n			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);\n			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;\n			vec3 tangent = normalize(vec3(randomVec.xy, 0.));\n			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);\n			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));\n\n			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;\n			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;\n			float ao = 0.0;\n			for (int i = 0; i < DIRECTIONS; ++i) {\n				\n				float angle = float(i) / float(DIRECTIONS) * PI;\n				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); \n				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);\n\n				vec3 viewDir = normalize(-viewPos.xyz);\n				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));\n				vec3 sliceTangent = cross(sliceBitangent, viewDir);\n				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));\n				\n				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);\n				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));\n				\n				for (int j = 0; j < STEPS; ++j) {\n					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	\n\n					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);\n					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);\n					vec3 viewDelta = sampleSceneViewPos - viewPos;\n					if (abs(viewDelta.z) < thickness) {\n						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));\n						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));\n					}		\n\n					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);\n					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);\n					viewDelta = sampleSceneViewPos - viewPos;\n					if (abs(viewDelta.z) < thickness) {\n						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));\n						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));\n					}\n				}\n\n				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);\n				float nx = dot(normalInSlice, sliceTangent);\n				float ny = dot(normalInSlice, viewDir);\n				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);\n				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);\n				float occlusion = nx * nxb + ny * nyb;\n				ao += occlusion;\n			}\n\n			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		\n		#if SCENE_CLIP_BOX == 1\n			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));\n		#endif\n			ao = pow(ao, scale);\n\n			gl_FragColor = FRAGMENT_OUTPUT;\n		}"
  )
};
var GTAODepthShader = {
  name: "GTAODepthShader",
  defines: {
    PERSPECTIVE_CAMERA: 1
  },
  uniforms: {
    tDepth: { value: null },
    cameraNear: { value: null },
    cameraFar: { value: null }
  },
  vertexShader: (
    /* glsl */
    "\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n		uniform sampler2D tDepth;\n		uniform float cameraNear;\n		uniform float cameraFar;\n		varying vec2 vUv;\n\n		#include <packing>\n\n		float getLinearDepth( const in vec2 screenPosition ) {\n			#if PERSPECTIVE_CAMERA == 1\n				float fragCoordZ = texture2D( tDepth, screenPosition ).x;\n				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );\n				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );\n			#else\n				return texture2D( tDepth, screenPosition ).x;\n			#endif\n		}\n\n		void main() {\n			float depth = getLinearDepth( vUv );\n			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );\n\n		}"
  )
};
var GTAOBlendShader = {
  name: "GTAOBlendShader",
  uniforms: {
    tDiffuse: { value: null },
    intensity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    "\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n		uniform float intensity;\n		uniform sampler2D tDiffuse;\n		varying vec2 vUv;\n\n		void main() {\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);\n		}"
  )
};
function generateMagicSquareNoise(size = 5) {
  const noiseSize = Math.floor(size) % 2 === 0 ? Math.floor(size) + 1 : Math.floor(size);
  const magicSquare = generateMagicSquare(noiseSize);
  const noiseSquareSize = magicSquare.length;
  const data = new Uint8Array(noiseSquareSize * 4);
  for (let inx = 0; inx < noiseSquareSize; ++inx) {
    const iAng = magicSquare[inx];
    const angle = 2 * Math.PI * iAng / noiseSquareSize;
    const randomVec = new Vector3(
      Math.cos(angle),
      Math.sin(angle),
      0
    ).normalize();
    data[inx * 4] = (randomVec.x * 0.5 + 0.5) * 255;
    data[inx * 4 + 1] = (randomVec.y * 0.5 + 0.5) * 255;
    data[inx * 4 + 2] = 127;
    data[inx * 4 + 3] = 255;
  }
  const noiseTexture = new DataTexture(data, noiseSize, noiseSize);
  noiseTexture.wrapS = RepeatWrapping;
  noiseTexture.wrapT = RepeatWrapping;
  noiseTexture.needsUpdate = true;
  return noiseTexture;
}
function generateMagicSquare(size) {
  const noiseSize = Math.floor(size) % 2 === 0 ? Math.floor(size) + 1 : Math.floor(size);
  const noiseSquareSize = noiseSize * noiseSize;
  const magicSquare = Array(noiseSquareSize).fill(0);
  let i = Math.floor(noiseSize / 2);
  let j = noiseSize - 1;
  for (let num = 1; num <= noiseSquareSize; ) {
    if (i === -1 && j === noiseSize) {
      j = noiseSize - 2;
      i = 0;
    } else {
      if (j === noiseSize) {
        j = 0;
      }
      if (i < 0) {
        i = noiseSize - 1;
      }
    }
    if (magicSquare[i * noiseSize + j] !== 0) {
      j -= 2;
      i++;
      continue;
    } else {
      magicSquare[i * noiseSize + j] = num++;
    }
    j++;
    i--;
  }
  return magicSquare;
}

// dist/three/addons/shaders/PoissonDenoiseShader.js
var PoissonDenoiseShader = {
  name: "PoissonDenoiseShader",
  defines: {
    "SAMPLES": 16,
    "SAMPLE_VECTORS": generatePdSamplePointInitializer(16, 2, 1),
    "NORMAL_VECTOR_TYPE": 1,
    "DEPTH_VALUE_SOURCE": 0
  },
  uniforms: {
    "tDiffuse": { value: null },
    "tNormal": { value: null },
    "tDepth": { value: null },
    "tNoise": { value: null },
    "resolution": { value: new Vector2() },
    "cameraProjectionMatrixInverse": { value: new Matrix4() },
    "lumaPhi": { value: 5 },
    "depthPhi": { value: 5 },
    "normalPhi": { value: 5 },
    "radius": { value: 4 },
    "index": { value: 0 }
  },
  vertexShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		varying vec2 vUv;\n\n		uniform sampler2D tDiffuse;\n		uniform sampler2D tNormal;\n		uniform sampler2D tDepth;\n		uniform sampler2D tNoise;\n		uniform vec2 resolution;\n		uniform mat4 cameraProjectionMatrixInverse;\n		uniform float lumaPhi;\n		uniform float depthPhi;\n		uniform float normalPhi;\n		uniform float radius;\n		uniform int index;\n		\n		#include <common>\n		#include <packing>\n\n		#ifndef SAMPLE_LUMINANCE\n		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)\n		#endif\n\n		#ifndef FRAGMENT_OUTPUT\n		#define FRAGMENT_OUTPUT vec4(denoised, 1.)\n		#endif\n\n		float getLuminance(const in vec3 a) {\n			return SAMPLE_LUMINANCE;\n		}\n\n		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;\n\n		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {\n			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);\n			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;\n			return viewSpacePosition.xyz / viewSpacePosition.w;\n		}\n		\n		float getDepth(const vec2 uv) {\n		#if DEPTH_VALUE_SOURCE == 1    \n			return textureLod(tDepth, uv.xy, 0.0).a;\n		#else\n			return textureLod(tDepth, uv.xy, 0.0).r;\n		#endif\n		}\n\n		float fetchDepth(const ivec2 uv) {\n			#if DEPTH_VALUE_SOURCE == 1    \n				return texelFetch(tDepth, uv.xy, 0).a;\n			#else\n				return texelFetch(tDepth, uv.xy, 0).r;\n			#endif\n		}\n\n		vec3 computeNormalFromDepth(const vec2 uv) {\n			vec2 size = vec2(textureSize(tDepth, 0));\n			ivec2 p = ivec2(uv * size);\n			float c0 = fetchDepth(p);\n			float l2 = fetchDepth(p - ivec2(2, 0));\n			float l1 = fetchDepth(p - ivec2(1, 0));\n			float r1 = fetchDepth(p + ivec2(1, 0));\n			float r2 = fetchDepth(p + ivec2(2, 0));\n			float b2 = fetchDepth(p - ivec2(0, 2));\n			float b1 = fetchDepth(p - ivec2(0, 1));\n			float t1 = fetchDepth(p + ivec2(0, 1));\n			float t2 = fetchDepth(p + ivec2(0, 2));\n			float dl = abs((2.0 * l1 - l2) - c0);\n			float dr = abs((2.0 * r1 - r2) - c0);\n			float db = abs((2.0 * b1 - b2) - c0);\n			float dt = abs((2.0 * t1 - t2) - c0);\n			vec3 ce = getViewPosition(uv, c0).xyz;\n			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz\n									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;\n			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz\n									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;\n			return normalize(cross(dpdx, dpdy));\n		}\n\n		vec3 getViewNormal(const vec2 uv) {\n		#if NORMAL_VECTOR_TYPE == 2\n			return normalize(textureLod(tNormal, uv, 0.).rgb);\n		#elif NORMAL_VECTOR_TYPE == 1\n			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);\n		#else\n			return computeNormalFromDepth(uv);\n		#endif\n		}\n\n		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {\n			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);\n			float sampleDepth = getDepth(sampleUv);\n			vec3 sampleNormal = getViewNormal(sampleUv);\n			vec3 neighborColor = sampleTexel.rgb;\n			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);\n			\n			float normalDiff = dot(viewNormal, sampleNormal);\n			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);\n			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));\n			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);\n			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));\n			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);\n			float w = lumaSimilarity * depthSimilarity * normalSimilarity;\n		\n			denoised += w * neighborColor;\n			totalWeight += w;\n		}\n		\n		void main() {\n			float depth = getDepth(vUv.xy);	\n			vec3 viewNormal = getViewNormal(vUv);	\n			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {\n				discard;\n				return;\n			}\n			vec4 texel = textureLod(tDiffuse, vUv, 0.0);\n			vec3 center = texel.rgb;\n			vec3 viewPos = getViewPosition(vUv, depth);\n\n			vec2 noiseResolution = vec2(textureSize(tNoise, 0));\n			vec2 noiseUv = vUv * resolution / noiseResolution;\n			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);\n      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));\n    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);\n		\n			float totalWeight = 1.0;\n			vec3 denoised = texel.rgb;\n			for (int i = 0; i < SAMPLES; i++) {\n				vec3 sampleDir = poissonDisk[i];\n				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);\n				vec2 sampleUv = vUv + offset;\n				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);\n			}\n		\n			if (totalWeight > 0.) { \n				denoised /= totalWeight;\n			}\n			gl_FragColor = FRAGMENT_OUTPUT;\n		}"
  )
};
function generatePdSamplePointInitializer(samples, rings, radiusExponent) {
  const poissonDisk = generateDenoiseSamples(
    samples,
    rings,
    radiusExponent
  );
  let glslCode = "vec3[SAMPLES](";
  for (let i = 0; i < samples; i++) {
    const sample = poissonDisk[i];
    glslCode += "vec3(".concat(sample.x, ", ").concat(sample.y, ", ").concat(sample.z, ")").concat(i < samples - 1 ? "," : ")");
  }
  return glslCode;
}
function generateDenoiseSamples(numSamples, numRings, radiusExponent) {
  const samples = [];
  for (let i = 0; i < numSamples; i++) {
    const angle = 2 * Math.PI * numRings * i / numSamples;
    const radius = Math.pow(i / (numSamples - 1), radiusExponent);
    samples.push(new Vector3(Math.cos(angle), Math.sin(angle), radius));
  }
  return samples;
}

// dist/three/addons/math/SimplexNoise.js
var SimplexNoise = class {
  constructor(r = Math) {
    this.grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1]
    ];
    this.grad4 = [
      [0, 1, 1, 1],
      [0, 1, 1, -1],
      [0, 1, -1, 1],
      [0, 1, -1, -1],
      [0, -1, 1, 1],
      [0, -1, 1, -1],
      [0, -1, -1, 1],
      [0, -1, -1, -1],
      [1, 0, 1, 1],
      [1, 0, 1, -1],
      [1, 0, -1, 1],
      [1, 0, -1, -1],
      [-1, 0, 1, 1],
      [-1, 0, 1, -1],
      [-1, 0, -1, 1],
      [-1, 0, -1, -1],
      [1, 1, 0, 1],
      [1, 1, 0, -1],
      [1, -1, 0, 1],
      [1, -1, 0, -1],
      [-1, 1, 0, 1],
      [-1, 1, 0, -1],
      [-1, -1, 0, 1],
      [-1, -1, 0, -1],
      [1, 1, 1, 0],
      [1, 1, -1, 0],
      [1, -1, 1, 0],
      [1, -1, -1, 0],
      [-1, 1, 1, 0],
      [-1, 1, -1, 0],
      [-1, -1, 1, 0],
      [-1, -1, -1, 0]
    ];
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(r.random() * 256);
    }
    this.perm = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
    this.simplex = [
      [0, 1, 2, 3],
      [0, 1, 3, 2],
      [0, 0, 0, 0],
      [0, 2, 3, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 2, 3, 0],
      [0, 2, 1, 3],
      [0, 0, 0, 0],
      [0, 3, 1, 2],
      [0, 3, 2, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 3, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 2, 0, 3],
      [0, 0, 0, 0],
      [1, 3, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 3, 0, 1],
      [2, 3, 1, 0],
      [1, 0, 2, 3],
      [1, 0, 3, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 3, 1],
      [0, 0, 0, 0],
      [2, 1, 3, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 1, 3],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 0, 1, 2],
      [3, 0, 2, 1],
      [0, 0, 0, 0],
      [3, 1, 2, 0],
      [2, 1, 0, 3],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 1, 0, 2],
      [0, 0, 0, 0],
      [3, 2, 0, 1],
      [3, 2, 1, 0]
    ];
  }
  dot(g, x, y) {
    return g[0] * x + g[1] * y;
  }
  dot3(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
  }
  dot4(g, x, y, z, w) {
    return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
  }
  noise(xin, yin) {
    let n0;
    let n1;
    let n2;
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    let i1;
    let j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }
    return 70 * (n0 + n1 + n2);
  }
  // 3D simplex noise
  noise3d(xin, yin, zin) {
    let n0;
    let n1;
    let n2;
    let n3;
    const F3 = 1 / 3;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const G3 = 1 / 6;
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;
    let i1;
    let j1;
    let k1;
    let i2;
    let j2;
    let k2;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0;
    else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  }
  // 4D simplex noise
  noise4d(x, y, z, w) {
    const grad4 = this.grad4;
    const simplex = this.simplex;
    const perm = this.perm;
    const F4 = (Math.sqrt(5) - 1) / 4;
    const G4 = (5 - Math.sqrt(5)) / 20;
    let n0;
    let n1;
    let n2;
    let n3;
    let n4;
    const s = (x + y + z + w) * F4;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const l = Math.floor(w + s);
    const t = (i + j + k + l) * G4;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const W0 = l - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;
    const w0 = w - W0;
    const c1 = x0 > y0 ? 32 : 0;
    const c2 = x0 > z0 ? 16 : 0;
    const c3 = y0 > z0 ? 8 : 0;
    const c4 = x0 > w0 ? 4 : 0;
    const c5 = y0 > w0 ? 2 : 0;
    const c6 = z0 > w0 ? 1 : 0;
    const c = c1 + c2 + c3 + c4 + c5 + c6;
    const i1 = simplex[c][0] >= 3 ? 1 : 0;
    const j1 = simplex[c][1] >= 3 ? 1 : 0;
    const k1 = simplex[c][2] >= 3 ? 1 : 0;
    const l1 = simplex[c][3] >= 3 ? 1 : 0;
    const i2 = simplex[c][0] >= 2 ? 1 : 0;
    const j2 = simplex[c][1] >= 2 ? 1 : 0;
    const k2 = simplex[c][2] >= 2 ? 1 : 0;
    const l2 = simplex[c][3] >= 2 ? 1 : 0;
    const i3 = simplex[c][0] >= 1 ? 1 : 0;
    const j3 = simplex[c][1] >= 1 ? 1 : 0;
    const k3 = simplex[c][2] >= 1 ? 1 : 0;
    const l3 = simplex[c][3] >= 1 ? 1 : 0;
    const x1 = x0 - i1 + G4;
    const y1 = y0 - j1 + G4;
    const z1 = z0 - k1 + G4;
    const w1 = w0 - l1 + G4;
    const x2 = x0 - i2 + 2 * G4;
    const y2 = y0 - j2 + 2 * G4;
    const z2 = z0 - k2 + 2 * G4;
    const w2 = w0 - l2 + 2 * G4;
    const x3 = x0 - i3 + 3 * G4;
    const y3 = y0 - j3 + 3 * G4;
    const z3 = z0 - k3 + 3 * G4;
    const w3 = w0 - l3 + 3 * G4;
    const x4 = x0 - 1 + 4 * G4;
    const y4 = y0 - 1 + 4 * G4;
    const z4 = z0 - 1 + 4 * G4;
    const w4 = w0 - 1 + 4 * G4;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const ll = l & 255;
    const gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
    const gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
    const gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
    if (t0 < 0) n0 = 0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot4(grad4[gi0], x0, y0, z0, w0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
    if (t1 < 0) n1 = 0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot4(grad4[gi1], x1, y1, z1, w1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
    if (t2 < 0) n2 = 0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot4(grad4[gi2], x2, y2, z2, w2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
    if (t3 < 0) n3 = 0;
    else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot4(grad4[gi3], x3, y3, z3, w3);
    }
    let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
    if (t4 < 0) n4 = 0;
    else {
      t4 *= t4;
      n4 = t4 * t4 * this.dot4(grad4[gi4], x4, y4, z4, w4);
    }
    return 27 * (n0 + n1 + n2 + n3 + n4);
  }
};

// dist/three/addons/postprocessing/GTAOPass.js
var GTAOPass = class _GTAOPass extends Pass {
  constructor(scene, camera, width, height, parameters, aoParameters, pdParameters) {
    super();
    this.width = width !== void 0 ? width : 512;
    this.height = height !== void 0 ? height : 512;
    this.clear = true;
    this.camera = camera;
    this.scene = scene;
    this.output = 0;
    this._renderGBuffer = true;
    this._visibilityCache = /* @__PURE__ */ new Map();
    this.blendIntensity = 1;
    this.pdRings = 2;
    this.pdRadiusExponent = 2;
    this.pdSamples = 16;
    this.gtaoNoiseTexture = generateMagicSquareNoise();
    this.pdNoiseTexture = this.generateNoise();
    this.gtaoRenderTarget = new WebGLRenderTarget(this.width, this.height, { type: HalfFloatType });
    this.pdRenderTarget = this.gtaoRenderTarget.clone();
    this.gtaoMaterial = new ShaderMaterial({
      defines: Object.assign({}, GTAOShader.defines),
      uniforms: UniformsUtils.clone(GTAOShader.uniforms),
      vertexShader: GTAOShader.vertexShader,
      fragmentShader: GTAOShader.fragmentShader,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false
    });
    this.gtaoMaterial.defines.PERSPECTIVE_CAMERA = this.camera.isPerspectiveCamera ? 1 : 0;
    this.gtaoMaterial.uniforms.tNoise.value = this.gtaoNoiseTexture;
    this.gtaoMaterial.uniforms.resolution.value.set(this.width, this.height);
    this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near;
    this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far;
    this.normalMaterial = new MeshNormalMaterial();
    this.normalMaterial.blending = NoBlending;
    this.pdMaterial = new ShaderMaterial({
      defines: Object.assign({}, PoissonDenoiseShader.defines),
      uniforms: UniformsUtils.clone(PoissonDenoiseShader.uniforms),
      vertexShader: PoissonDenoiseShader.vertexShader,
      fragmentShader: PoissonDenoiseShader.fragmentShader,
      depthTest: false,
      depthWrite: false
    });
    this.pdMaterial.uniforms.tDiffuse.value = this.gtaoRenderTarget.texture;
    this.pdMaterial.uniforms.tNoise.value = this.pdNoiseTexture;
    this.pdMaterial.uniforms.resolution.value.set(this.width, this.height);
    this.pdMaterial.uniforms.lumaPhi.value = 10;
    this.pdMaterial.uniforms.depthPhi.value = 2;
    this.pdMaterial.uniforms.normalPhi.value = 3;
    this.pdMaterial.uniforms.radius.value = 8;
    this.depthRenderMaterial = new ShaderMaterial({
      defines: Object.assign({}, GTAODepthShader.defines),
      uniforms: UniformsUtils.clone(GTAODepthShader.uniforms),
      vertexShader: GTAODepthShader.vertexShader,
      fragmentShader: GTAODepthShader.fragmentShader,
      blending: NoBlending
    });
    this.depthRenderMaterial.uniforms.cameraNear.value = this.camera.near;
    this.depthRenderMaterial.uniforms.cameraFar.value = this.camera.far;
    this.copyMaterial = new ShaderMaterial({
      uniforms: UniformsUtils.clone(CopyShader.uniforms),
      vertexShader: CopyShader.vertexShader,
      fragmentShader: CopyShader.fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blendSrc: DstColorFactor,
      blendDst: ZeroFactor,
      blendEquation: AddEquation,
      blendSrcAlpha: DstAlphaFactor,
      blendDstAlpha: ZeroFactor,
      blendEquationAlpha: AddEquation
    });
    this.blendMaterial = new ShaderMaterial({
      uniforms: UniformsUtils.clone(GTAOBlendShader.uniforms),
      vertexShader: GTAOBlendShader.vertexShader,
      fragmentShader: GTAOBlendShader.fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: CustomBlending,
      blendSrc: DstColorFactor,
      blendDst: ZeroFactor,
      blendEquation: AddEquation,
      blendSrcAlpha: DstAlphaFactor,
      blendDstAlpha: ZeroFactor,
      blendEquationAlpha: AddEquation
    });
    this.fsQuad = new FullScreenQuad(null);
    this.originalClearColor = new Color();
    this.setGBuffer(parameters ? parameters.depthTexture : void 0, parameters ? parameters.normalTexture : void 0);
    if (aoParameters !== void 0) {
      this.updateGtaoMaterial(aoParameters);
    }
    if (pdParameters !== void 0) {
      this.updatePdMaterial(pdParameters);
    }
  }
  dispose() {
    this.gtaoNoiseTexture.dispose();
    this.pdNoiseTexture.dispose();
    this.normalRenderTarget.dispose();
    this.gtaoRenderTarget.dispose();
    this.pdRenderTarget.dispose();
    this.normalMaterial.dispose();
    this.pdMaterial.dispose();
    this.copyMaterial.dispose();
    this.depthRenderMaterial.dispose();
    this.fsQuad.dispose();
  }
  get gtaoMap() {
    return this.pdRenderTarget.texture;
  }
  setGBuffer(depthTexture, normalTexture) {
    if (depthTexture !== void 0) {
      this.depthTexture = depthTexture;
      this.normalTexture = normalTexture;
      this._renderGBuffer = false;
    } else {
      this.depthTexture = new DepthTexture();
      this.depthTexture.format = DepthStencilFormat;
      this.depthTexture.type = UnsignedInt248Type;
      this.normalRenderTarget = new WebGLRenderTarget(this.width, this.height, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        type: HalfFloatType,
        depthTexture: this.depthTexture
      });
      this.normalTexture = this.normalRenderTarget.texture;
      this._renderGBuffer = true;
    }
    const normalVectorType = this.normalTexture ? 1 : 0;
    const depthValueSource = this.depthTexture === this.normalTexture ? "w" : "x";
    this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE = normalVectorType;
    this.gtaoMaterial.defines.DEPTH_SWIZZLING = depthValueSource;
    this.gtaoMaterial.uniforms.tNormal.value = this.normalTexture;
    this.gtaoMaterial.uniforms.tDepth.value = this.depthTexture;
    this.pdMaterial.defines.NORMAL_VECTOR_TYPE = normalVectorType;
    this.pdMaterial.defines.DEPTH_SWIZZLING = depthValueSource;
    this.pdMaterial.uniforms.tNormal.value = this.normalTexture;
    this.pdMaterial.uniforms.tDepth.value = this.depthTexture;
    this.depthRenderMaterial.uniforms.tDepth.value = this.normalRenderTarget.depthTexture;
  }
  setSceneClipBox(box) {
    if (box) {
      this.gtaoMaterial.needsUpdate = this.gtaoMaterial.defines.SCENE_CLIP_BOX !== 1;
      this.gtaoMaterial.defines.SCENE_CLIP_BOX = 1;
      this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(box.min);
      this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(box.max);
    } else {
      this.gtaoMaterial.needsUpdate = this.gtaoMaterial.defines.SCENE_CLIP_BOX === 0;
      this.gtaoMaterial.defines.SCENE_CLIP_BOX = 0;
    }
  }
  updateGtaoMaterial(parameters) {
    if (parameters.radius !== void 0) {
      this.gtaoMaterial.uniforms.radius.value = parameters.radius;
    }
    if (parameters.distanceExponent !== void 0) {
      this.gtaoMaterial.uniforms.distanceExponent.value = parameters.distanceExponent;
    }
    if (parameters.thickness !== void 0) {
      this.gtaoMaterial.uniforms.thickness.value = parameters.thickness;
    }
    if (parameters.distanceFallOff !== void 0) {
      this.gtaoMaterial.uniforms.distanceFallOff.value = parameters.distanceFallOff;
      this.gtaoMaterial.needsUpdate = true;
    }
    if (parameters.scale !== void 0) {
      this.gtaoMaterial.uniforms.scale.value = parameters.scale;
    }
    if (parameters.samples !== void 0 && parameters.samples !== this.gtaoMaterial.defines.SAMPLES) {
      this.gtaoMaterial.defines.SAMPLES = parameters.samples;
      this.gtaoMaterial.needsUpdate = true;
    }
    if (parameters.screenSpaceRadius !== void 0 && (parameters.screenSpaceRadius ? 1 : 0) !== this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS) {
      this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS = parameters.screenSpaceRadius ? 1 : 0;
      this.gtaoMaterial.needsUpdate = true;
    }
  }
  updatePdMaterial(parameters) {
    let updateShader = false;
    if (parameters.lumaPhi !== void 0) {
      this.pdMaterial.uniforms.lumaPhi.value = parameters.lumaPhi;
    }
    if (parameters.depthPhi !== void 0) {
      this.pdMaterial.uniforms.depthPhi.value = parameters.depthPhi;
    }
    if (parameters.normalPhi !== void 0) {
      this.pdMaterial.uniforms.normalPhi.value = parameters.normalPhi;
    }
    if (parameters.radius !== void 0 && parameters.radius !== this.radius) {
      this.pdMaterial.uniforms.radius.value = parameters.radius;
    }
    if (parameters.radiusExponent !== void 0 && parameters.radiusExponent !== this.pdRadiusExponent) {
      this.pdRadiusExponent = parameters.radiusExponent;
      updateShader = true;
    }
    if (parameters.rings !== void 0 && parameters.rings !== this.pdRings) {
      this.pdRings = parameters.rings;
      updateShader = true;
    }
    if (parameters.samples !== void 0 && parameters.samples !== this.pdSamples) {
      this.pdSamples = parameters.samples;
      updateShader = true;
    }
    if (updateShader) {
      this.pdMaterial.defines.SAMPLES = this.pdSamples;
      this.pdMaterial.defines.SAMPLE_VECTORS = generatePdSamplePointInitializer(this.pdSamples, this.pdRings, this.pdRadiusExponent);
      this.pdMaterial.needsUpdate = true;
    }
  }
  render(renderer, writeBuffer, readBuffer) {
    if (this._renderGBuffer) {
      this.overrideVisibility();
      this.renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 7829503, 1);
      this.restoreVisibility();
    }
    this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near;
    this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far;
    this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix);
    this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse);
    this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld);
    this.renderPass(renderer, this.gtaoMaterial, this.gtaoRenderTarget, 16777215, 1);
    this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse);
    this.renderPass(renderer, this.pdMaterial, this.pdRenderTarget, 16777215, 1);
    switch (this.output) {
      case _GTAOPass.OUTPUT.Off:
        break;
      case _GTAOPass.OUTPUT.Diffuse:
        this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this.copyMaterial.blending = NoBlending;
        this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      case _GTAOPass.OUTPUT.AO:
        this.copyMaterial.uniforms.tDiffuse.value = this.gtaoRenderTarget.texture;
        this.copyMaterial.blending = NoBlending;
        this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      case _GTAOPass.OUTPUT.Denoise:
        this.copyMaterial.uniforms.tDiffuse.value = this.pdRenderTarget.texture;
        this.copyMaterial.blending = NoBlending;
        this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      case _GTAOPass.OUTPUT.Depth:
        this.depthRenderMaterial.uniforms.cameraNear.value = this.camera.near;
        this.depthRenderMaterial.uniforms.cameraFar.value = this.camera.far;
        this.renderPass(renderer, this.depthRenderMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      case _GTAOPass.OUTPUT.Normal:
        this.copyMaterial.uniforms.tDiffuse.value = this.normalRenderTarget.texture;
        this.copyMaterial.blending = NoBlending;
        this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      case _GTAOPass.OUTPUT.Default:
        this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this.copyMaterial.blending = NoBlending;
        this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
        this.blendMaterial.uniforms.intensity.value = this.blendIntensity;
        this.blendMaterial.uniforms.tDiffuse.value = this.pdRenderTarget.texture;
        this.renderPass(renderer, this.blendMaterial, this.renderToScreen ? null : writeBuffer);
        break;
      default:
        console.warn("THREE.GTAOPass: Unknown output type.");
    }
  }
  renderPass(renderer, passMaterial, renderTarget, clearColor, clearAlpha) {
    renderer.getClearColor(this.originalClearColor);
    const originalClearAlpha = renderer.getClearAlpha();
    const originalAutoClear = renderer.autoClear;
    renderer.setRenderTarget(renderTarget);
    renderer.autoClear = false;
    if (clearColor !== void 0 && clearColor !== null) {
      renderer.setClearColor(clearColor);
      renderer.setClearAlpha(clearAlpha || 0);
      renderer.clear();
    }
    this.fsQuad.material = passMaterial;
    this.fsQuad.render(renderer);
    renderer.autoClear = originalAutoClear;
    renderer.setClearColor(this.originalClearColor);
    renderer.setClearAlpha(originalClearAlpha);
  }
  renderOverride(renderer, overrideMaterial, renderTarget, clearColor, clearAlpha) {
    renderer.getClearColor(this.originalClearColor);
    const originalClearAlpha = renderer.getClearAlpha();
    const originalAutoClear = renderer.autoClear;
    renderer.setRenderTarget(renderTarget);
    renderer.autoClear = false;
    clearColor = overrideMaterial.clearColor || clearColor;
    clearAlpha = overrideMaterial.clearAlpha || clearAlpha;
    if (clearColor !== void 0 && clearColor !== null) {
      renderer.setClearColor(clearColor);
      renderer.setClearAlpha(clearAlpha || 0);
      renderer.clear();
    }
    this.scene.overrideMaterial = overrideMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = null;
    renderer.autoClear = originalAutoClear;
    renderer.setClearColor(this.originalClearColor);
    renderer.setClearAlpha(originalClearAlpha);
  }
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.gtaoRenderTarget.setSize(width, height);
    this.normalRenderTarget.setSize(width, height);
    this.pdRenderTarget.setSize(width, height);
    this.gtaoMaterial.uniforms.resolution.value.set(width, height);
    this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix);
    this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse);
    this.pdMaterial.uniforms.resolution.value.set(width, height);
    this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse);
  }
  overrideVisibility() {
    const scene = this.scene;
    const cache = this._visibilityCache;
    scene.traverse(function(object) {
      cache.set(object, object.visible);
      if (object.isPoints || object.isLine) object.visible = false;
    });
  }
  restoreVisibility() {
    const scene = this.scene;
    const cache = this._visibilityCache;
    scene.traverse(function(object) {
      const visible = cache.get(object);
      object.visible = visible;
    });
    cache.clear();
  }
  generateNoise(size = 64) {
    const simplex = new SimplexNoise();
    const arraySize = size * size * 4;
    const data = new Uint8Array(arraySize);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = i;
        const y = j;
        data[(i * size + j) * 4] = (simplex.noise(x, y) * 0.5 + 0.5) * 255;
        data[(i * size + j) * 4 + 1] = (simplex.noise(x + size, y) * 0.5 + 0.5) * 255;
        data[(i * size + j) * 4 + 2] = (simplex.noise(x, y + size) * 0.5 + 0.5) * 255;
        data[(i * size + j) * 4 + 3] = (simplex.noise(x + size, y + size) * 0.5 + 0.5) * 255;
      }
    }
    const noiseTexture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
    noiseTexture.wrapS = RepeatWrapping;
    noiseTexture.wrapT = RepeatWrapping;
    noiseTexture.needsUpdate = true;
    return noiseTexture;
  }
};
GTAOPass.OUTPUT = {
  "Off": -1,
  "Default": 0,
  "Diffuse": 1,
  "Depth": 2,
  "Normal": 3,
  "AO": 4,
  "Denoise": 5
};

// dist/three/addons/shaders/SMAAShader.js
var SMAAEdgesShader = {
  name: "SMAAEdgesShader",
  defines: {
    "SMAA_THRESHOLD": "0.1"
  },
  uniforms: {
    "tDiffuse": { value: null },
    "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
  },
  vertexShader: (
    /* glsl */
    "\n\n		uniform vec2 resolution;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[ 3 ];\n\n		void SMAAEdgeDetectionVS( vec2 texcoord ) {\n			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component\n			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component\n			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component\n		}\n\n		void main() {\n\n			vUv = uv;\n\n			SMAAEdgeDetectionVS( vUv );\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		uniform sampler2D tDiffuse;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[ 3 ];\n\n		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {\n			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );\n\n			// Calculate color deltas:\n			vec4 delta;\n			vec3 C = texture2D( colorTex, texcoord ).rgb;\n\n			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;\n			vec3 t = abs( C - Cleft );\n			delta.x = max( max( t.r, t.g ), t.b );\n\n			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;\n			t = abs( C - Ctop );\n			delta.y = max( max( t.r, t.g ), t.b );\n\n			// We do the usual threshold:\n			vec2 edges = step( threshold, delta.xy );\n\n			// Then discard if there is no edge:\n			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )\n				discard;\n\n			// Calculate right and bottom deltas:\n			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;\n			t = abs( C - Cright );\n			delta.z = max( max( t.r, t.g ), t.b );\n\n			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;\n			t = abs( C - Cbottom );\n			delta.w = max( max( t.r, t.g ), t.b );\n\n			// Calculate the maximum delta in the direct neighborhood:\n			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );\n\n			// Calculate left-left and top-top deltas:\n			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;\n			t = abs( C - Cleftleft );\n			delta.z = max( max( t.r, t.g ), t.b );\n\n			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;\n			t = abs( C - Ctoptop );\n			delta.w = max( max( t.r, t.g ), t.b );\n\n			// Calculate the final maximum delta:\n			maxDelta = max( max( maxDelta, delta.z ), delta.w );\n\n			// Local contrast adaptation in action:\n			edges.xy *= step( 0.5 * maxDelta, delta.xy );\n\n			return vec4( edges, 0.0, 0.0 );\n		}\n\n		void main() {\n\n			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );\n\n		}"
  )
};
var SMAAWeightsShader = {
  name: "SMAAWeightsShader",
  defines: {
    "SMAA_MAX_SEARCH_STEPS": "8",
    "SMAA_AREATEX_MAX_DISTANCE": "16",
    "SMAA_AREATEX_PIXEL_SIZE": "( 1.0 / vec2( 160.0, 560.0 ) )",
    "SMAA_AREATEX_SUBTEX_SIZE": "( 1.0 / 7.0 )"
  },
  uniforms: {
    "tDiffuse": { value: null },
    "tArea": { value: null },
    "tSearch": { value: null },
    "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
  },
  vertexShader: (
    /* glsl */
    "\n\n		uniform vec2 resolution;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[ 3 ];\n		varying vec2 vPixcoord;\n\n		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {\n			vPixcoord = texcoord / resolution;\n\n			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):\n			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components\n			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components\n\n			// And these for the searches, they indicate the ends of the loops:\n			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );\n\n		}\n\n		void main() {\n\n			vUv = uv;\n\n			SMAABlendingWeightCalculationVS( vUv );\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )\n\n		uniform sampler2D tDiffuse;\n		uniform sampler2D tArea;\n		uniform sampler2D tSearch;\n		uniform vec2 resolution;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[3];\n		varying vec2 vPixcoord;\n\n		#if __VERSION__ == 100\n		vec2 round( vec2 x ) {\n			return sign( x ) * floor( abs( x ) + 0.5 );\n		}\n		#endif\n\n		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {\n			// Not required if searchTex accesses are set to point:\n			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);\n			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +\n			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;\n			e.r = bias + e.r * scale;\n			return 255.0 * texture2D( searchTex, e, 0.0 ).r;\n		}\n\n		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\n			/**\n				* @PSEUDO_GATHER4\n				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to\n				* sample between edge, thus fetching four edges in a row.\n				* Sampling with different offsets in each direction allows to disambiguate\n				* which edges are active from the four fetched ones.\n				*/\n			vec2 e = vec2( 0.0, 1.0 );\n\n			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for\n				e = texture2D( edgesTex, texcoord, 0.0 ).rg;\n				texcoord -= vec2( 2.0, 0.0 ) * resolution;\n				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n			}\n\n			// We correct the previous (-0.25, -0.125) offset we applied:\n			texcoord.x += 0.25 * resolution.x;\n\n			// The searches are bias by 1, so adjust the coords accordingly:\n			texcoord.x += resolution.x;\n\n			// Disambiguate the length added by the last step:\n			texcoord.x += 2.0 * resolution.x; // Undo last step\n			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);\n\n			return texcoord.x;\n		}\n\n		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\n			vec2 e = vec2( 0.0, 1.0 );\n\n			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for\n				e = texture2D( edgesTex, texcoord, 0.0 ).rg;\n				texcoord += vec2( 2.0, 0.0 ) * resolution;\n				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n			}\n\n			texcoord.x -= 0.25 * resolution.x;\n			texcoord.x -= resolution.x;\n			texcoord.x -= 2.0 * resolution.x;\n			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );\n\n			return texcoord.x;\n		}\n\n		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\n			vec2 e = vec2( 1.0, 0.0 );\n\n			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for\n				e = texture2D( edgesTex, texcoord, 0.0 ).rg;\n				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign\n				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n			}\n\n			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign\n			texcoord.y -= resolution.y; // WebGL port note: Changed sign\n			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign\n			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign\n\n			return texcoord.y;\n		}\n\n		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\n			vec2 e = vec2( 1.0, 0.0 );\n\n			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for\n				e = texture2D( edgesTex, texcoord, 0.0 ).rg;\n				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign\n				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n			}\n\n			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign\n			texcoord.y += resolution.y; // WebGL port note: Changed sign\n			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign\n			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign\n\n			return texcoord.y;\n		}\n\n		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {\n			// Rounding prevents precision errors of bilinear filtering:\n			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;\n\n			// We do a scale and bias for mapping to texel space:\n			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );\n\n			// Move to proper place, according to the subpixel offset:\n			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;\n\n			return texture2D( areaTex, texcoord, 0.0 ).rg;\n		}\n\n		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {\n			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );\n\n			vec2 e = texture2D( edgesTex, texcoord ).rg;\n\n			if ( e.g > 0.0 ) { // Edge at north\n				vec2 d;\n\n				// Find the distance to the left:\n				vec2 coords;\n				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );\n				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)\n				d.x = coords.x;\n\n				// Now fetch the left crossing edges, two at a time using bilinear\n				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to\n				// discern what value each edge has:\n				float e1 = texture2D( edgesTex, coords, 0.0 ).r;\n\n				// Find the distance to the right:\n				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );\n				d.y = coords.x;\n\n				// We want the distances to be in pixel units (doing this here allow to\n				// better interleave arithmetic and memory accesses):\n				d = d / resolution.x - pixcoord.x;\n\n				// SMAAArea below needs a sqrt, as the areas texture is compressed\n				// quadratically:\n				vec2 sqrt_d = sqrt( abs( d ) );\n\n				// Fetch the right crossing edges:\n				coords.y -= 1.0 * resolution.y; // WebGL port note: Added\n				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;\n\n				// Ok, we know how this pattern looks like, now it is time for getting\n				// the actual area:\n				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );\n			}\n\n			if ( e.r > 0.0 ) { // Edge at west\n				vec2 d;\n\n				// Find the distance to the top:\n				vec2 coords;\n\n				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );\n				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;\n				d.x = coords.y;\n\n				// Fetch the top crossing edges:\n				float e1 = texture2D( edgesTex, coords, 0.0 ).g;\n\n				// Find the distance to the bottom:\n				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );\n				d.y = coords.y;\n\n				// We want the distances to be in pixel units:\n				d = d / resolution.y - pixcoord.y;\n\n				// SMAAArea below needs a sqrt, as the areas texture is compressed\n				// quadratically:\n				vec2 sqrt_d = sqrt( abs( d ) );\n\n				// Fetch the bottom crossing edges:\n				coords.y -= 1.0 * resolution.y; // WebGL port note: Added\n				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;\n\n				// Get the area for this direction:\n				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );\n			}\n\n			return weights;\n		}\n\n		void main() {\n\n			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );\n\n		}"
  )
};
var SMAABlendShader = {
  name: "SMAABlendShader",
  uniforms: {
    "tDiffuse": { value: null },
    "tColor": { value: null },
    "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
  },
  vertexShader: (
    /* glsl */
    "\n\n		uniform vec2 resolution;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[ 2 ];\n\n		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {\n			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component\n			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component\n		}\n\n		void main() {\n\n			vUv = uv;\n\n			SMAANeighborhoodBlendingVS( vUv );\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n\n		uniform sampler2D tDiffuse;\n		uniform sampler2D tColor;\n		uniform vec2 resolution;\n\n		varying vec2 vUv;\n		varying vec4 vOffset[ 2 ];\n\n		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {\n			// Fetch the blending weights for current pixel:\n			vec4 a;\n			a.xz = texture2D( blendTex, texcoord ).xz;\n			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;\n			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;\n\n			// Is there any blending weight with a value greater than 0.0?\n			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {\n				return texture2D( colorTex, texcoord, 0.0 );\n			} else {\n				// Up to 4 lines can be crossing a pixel (one through each edge). We\n				// favor blending by choosing the line with the maximum weight for each\n				// direction:\n				vec2 offset;\n				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right\n				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs\n\n				// Then we go in the direction that has the maximum weight:\n				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical\n					offset.y = 0.0;\n				} else {\n					offset.x = 0.0;\n				}\n\n				// Fetch the opposite color and lerp by hand:\n				vec4 C = texture2D( colorTex, texcoord, 0.0 );\n				texcoord += sign( offset ) * resolution;\n				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );\n				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );\n\n				// WebGL port note: Added gamma correction\n				C.xyz = pow(C.xyz, vec3(2.2));\n				Cop.xyz = pow(Cop.xyz, vec3(2.2));\n				vec4 mixed = mix(C, Cop, s);\n				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));\n\n				return mixed;\n			}\n		}\n\n		void main() {\n\n			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );\n\n		}"
  )
};

// dist/three/addons/postprocessing/SMAAPass.js
var SMAAPass = class extends Pass {
  constructor(width, height) {
    super();
    this.edgesRT = new WebGLRenderTarget(width, height, {
      depthBuffer: false,
      type: HalfFloatType
    });
    this.edgesRT.texture.name = "SMAAPass.edges";
    this.weightsRT = new WebGLRenderTarget(width, height, {
      depthBuffer: false,
      type: HalfFloatType
    });
    this.weightsRT.texture.name = "SMAAPass.weights";
    const scope = this;
    const areaTextureImage = new Image();
    areaTextureImage.src = this.getAreaTexture();
    areaTextureImage.onload = function() {
      scope.areaTexture.needsUpdate = true;
    };
    this.areaTexture = new Texture();
    this.areaTexture.name = "SMAAPass.area";
    this.areaTexture.image = areaTextureImage;
    this.areaTexture.minFilter = LinearFilter;
    this.areaTexture.generateMipmaps = false;
    this.areaTexture.flipY = false;
    const searchTextureImage = new Image();
    searchTextureImage.src = this.getSearchTexture();
    searchTextureImage.onload = function() {
      scope.searchTexture.needsUpdate = true;
    };
    this.searchTexture = new Texture();
    this.searchTexture.name = "SMAAPass.search";
    this.searchTexture.image = searchTextureImage;
    this.searchTexture.magFilter = NearestFilter;
    this.searchTexture.minFilter = NearestFilter;
    this.searchTexture.generateMipmaps = false;
    this.searchTexture.flipY = false;
    this.uniformsEdges = UniformsUtils.clone(SMAAEdgesShader.uniforms);
    this.uniformsEdges["resolution"].value.set(1 / width, 1 / height);
    this.materialEdges = new ShaderMaterial({
      defines: Object.assign({}, SMAAEdgesShader.defines),
      uniforms: this.uniformsEdges,
      vertexShader: SMAAEdgesShader.vertexShader,
      fragmentShader: SMAAEdgesShader.fragmentShader
    });
    this.uniformsWeights = UniformsUtils.clone(SMAAWeightsShader.uniforms);
    this.uniformsWeights["resolution"].value.set(1 / width, 1 / height);
    this.uniformsWeights["tDiffuse"].value = this.edgesRT.texture;
    this.uniformsWeights["tArea"].value = this.areaTexture;
    this.uniformsWeights["tSearch"].value = this.searchTexture;
    this.materialWeights = new ShaderMaterial({
      defines: Object.assign({}, SMAAWeightsShader.defines),
      uniforms: this.uniformsWeights,
      vertexShader: SMAAWeightsShader.vertexShader,
      fragmentShader: SMAAWeightsShader.fragmentShader
    });
    this.uniformsBlend = UniformsUtils.clone(SMAABlendShader.uniforms);
    this.uniformsBlend["resolution"].value.set(1 / width, 1 / height);
    this.uniformsBlend["tDiffuse"].value = this.weightsRT.texture;
    this.materialBlend = new ShaderMaterial({
      uniforms: this.uniformsBlend,
      vertexShader: SMAABlendShader.vertexShader,
      fragmentShader: SMAABlendShader.fragmentShader
    });
    this.fsQuad = new FullScreenQuad(null);
  }
  render(renderer, writeBuffer, readBuffer) {
    this.uniformsEdges["tDiffuse"].value = readBuffer.texture;
    this.fsQuad.material = this.materialEdges;
    renderer.setRenderTarget(this.edgesRT);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
    this.fsQuad.material = this.materialWeights;
    renderer.setRenderTarget(this.weightsRT);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
    this.uniformsBlend["tColor"].value = readBuffer.texture;
    this.fsQuad.material = this.materialBlend;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
  setSize(width, height) {
    this.edgesRT.setSize(width, height);
    this.weightsRT.setSize(width, height);
    this.materialEdges.uniforms["resolution"].value.set(1 / width, 1 / height);
    this.materialWeights.uniforms["resolution"].value.set(1 / width, 1 / height);
    this.materialBlend.uniforms["resolution"].value.set(1 / width, 1 / height);
  }
  getAreaTexture() {
    return "data:image/png;base64,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";
  }
  getSearchTexture() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII=";
  }
  dispose() {
    this.edgesRT.dispose();
    this.weightsRT.dispose();
    this.areaTexture.dispose();
    this.searchTexture.dispose();
    this.materialEdges.dispose();
    this.materialWeights.dispose();
    this.materialBlend.dispose();
    this.fsQuad.dispose();
  }
};

// dist/three/addons/shaders/OutputShader.js
var OutputShader = {
  name: "OutputShader",
  uniforms: {
    "tDiffuse": { value: null },
    "toneMappingExposure": { value: 1 }
  },
  vertexShader: (
    /* glsl */
    "\n		precision highp float;\n\n		uniform mat4 modelViewMatrix;\n		uniform mat4 projectionMatrix;\n\n		attribute vec3 position;\n		attribute vec2 uv;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}"
  ),
  fragmentShader: (
    /* glsl */
    "\n	\n		precision highp float;\n\n		uniform sampler2D tDiffuse;\n\n		#include <tonemapping_pars_fragment>\n		#include <colorspace_pars_fragment>\n\n		varying vec2 vUv;\n\n		void main() {\n\n			gl_FragColor = texture2D( tDiffuse, vUv );\n\n			// tone mapping\n\n			#ifdef LINEAR_TONE_MAPPING\n\n				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n\n			#elif defined( REINHARD_TONE_MAPPING )\n\n				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n\n			#elif defined( CINEON_TONE_MAPPING )\n\n				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n\n			#elif defined( ACES_FILMIC_TONE_MAPPING )\n\n				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n\n			#elif defined( AGX_TONE_MAPPING )\n\n				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n\n			#elif defined( NEUTRAL_TONE_MAPPING )\n\n				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n\n			#endif\n\n			// color space\n\n			#ifdef SRGB_TRANSFER\n\n				gl_FragColor = sRGBTransferOETF( gl_FragColor );\n\n			#endif\n\n		}"
  )
};

// dist/three/addons/postprocessing/OutputPass.js
var OutputPass = class extends Pass {
  constructor() {
    super();
    const shader = OutputShader;
    this.uniforms = UniformsUtils.clone(shader.uniforms);
    this.material = new RawShaderMaterial({
      name: shader.name,
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });
    this.fsQuad = new FullScreenQuad(this.material);
    this._outputColorSpace = null;
    this._toneMapping = null;
  }
  render(renderer, writeBuffer, readBuffer) {
    this.uniforms["tDiffuse"].value = readBuffer.texture;
    this.uniforms["toneMappingExposure"].value = renderer.toneMappingExposure;
    if (this._outputColorSpace !== renderer.outputColorSpace || this._toneMapping !== renderer.toneMapping) {
      this._outputColorSpace = renderer.outputColorSpace;
      this._toneMapping = renderer.toneMapping;
      this.material.defines = {};
      if (ColorManagement.getTransfer(this._outputColorSpace) === SRGBTransfer) this.material.defines.SRGB_TRANSFER = "";
      if (this._toneMapping === LinearToneMapping) this.material.defines.LINEAR_TONE_MAPPING = "";
      else if (this._toneMapping === ReinhardToneMapping) this.material.defines.REINHARD_TONE_MAPPING = "";
      else if (this._toneMapping === CineonToneMapping) this.material.defines.CINEON_TONE_MAPPING = "";
      else if (this._toneMapping === ACESFilmicToneMapping) this.material.defines.ACES_FILMIC_TONE_MAPPING = "";
      else if (this._toneMapping === AgXToneMapping) this.material.defines.AGX_TONE_MAPPING = "";
      else if (this._toneMapping === NeutralToneMapping) this.material.defines.NEUTRAL_TONE_MAPPING = "";
      this.material.needsUpdate = true;
    }
    if (this.renderToScreen === true) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
      this.fsQuad.render(renderer);
    }
  }
  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }
};

// dist/realism.js
var ASSETS = new URL("./assets/", new URL("realism.js", location.href).href).href;
var R = null;
var state = () => R;
var tv = typeof window !== "undefined" && !!window.BP_TV;
var TV_PX = 960 * 540;
function setup(canvas, { fov = 50, near = 0.05, far = 400, tier } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: tv, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  if (tv) Object.defineProperty(renderer.shadowMap, "enabled", { get: () => false, set() {
  }, configurable: true });
  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, innerWidth / innerHeight, near, far);
  const weak = /Android|iPhone|iPad/.test(navigator.userAgent) && Math.min(screen.width, screen.height) < 500;
  const lowMem = weak && navigator.deviceMemory && navigator.deviceMemory <= 3;
  const quality = { tier: tier != null ? tier : tv || lowMem ? 0 : weak ? 1 : 2, fps: 60, frames: 0, t0: performance.now(), graceUntil: performance.now() + 4e3, tv };
  if (tv) quality.maxTier = quality.tier;
  R = { renderer, scene, camera, quality, composer: null, passes: {}, shakeAmt: 0, flashEl: null, basePos: new Vector3(), tv, tierFns: [] };
  R.onTier = (fn) => {
    R.tierFns.push(fn);
  };
  buildComposer();
  const resize = () => {
    let px = quality.tier === 2 ? Math.min(2, devicePixelRatio) : quality.tier === 1 ? Math.min(1.5, devicePixelRatio) : 1;
    if (tv) px = Math.min(px, Math.sqrt(TV_PX / Math.max(1, innerWidth * innerHeight)));
    renderer.setPixelRatio(px);
    renderer.setSize(innerWidth, innerHeight, tv);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    R.composer.setPixelRatio(px);
    R.composer.setSize(innerWidth, innerHeight);
  };
  R.resize = resize;
  addEventListener("resize", () => {
    resize();
    quality.graceUntil = performance.now() + 2e3;
  });
  resize();
  R.grace = (ms = 2e3) => {
    quality.graceUntil = performance.now() + ms;
  };
  return R;
}
var trueSkyOn = () => {
  const s = R.sky;
  return !!(s && s.parent && s.visible && s.userData.trueColor !== false);
};
var maskRT = null;
var maskQuad = null;
function captureMask(renderer, readBuffer) {
  const w = readBuffer.width, h = readBuffer.height;
  if (!maskRT) maskRT = new WebGLRenderTarget(w, h, { depthBuffer: false, minFilter: LinearFilter, magFilter: LinearFilter });
  else if (maskRT.width !== w || maskRT.height !== h) maskRT.setSize(w, h);
  if (!maskQuad) maskQuad = new FullScreenQuad(new RawShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    depthTest: false,
    depthWrite: false,
    vertexShader: "precision highp float; uniform mat4 modelViewMatrix, projectionMatrix; attribute vec3 position; attribute vec2 uv; varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "precision highp float; uniform sampler2D tDiffuse; varying vec2 vUv; void main() { gl_FragColor = vec4(vec3(clamp(texture2D(tDiffuse, vUv).a, 0.0, 1.0)), 1.0); }"
  }));
  maskQuad.material.uniforms.tDiffuse.value = readBuffer.texture;
  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(maskRT);
  maskQuad.render(renderer);
  renderer.setRenderTarget(prev);
}
var alphaQuad = null;
function restoreAlpha(renderer, readBuffer) {
  if (!alphaQuad) alphaQuad = new FullScreenQuad(new RawShaderMaterial({
    depthTest: false,
    depthWrite: false,
    blending: CustomBlending,
    blendEquation: AddEquation,
    blendSrc: ZeroFactor,
    blendDst: OneFactor,
    blendEquationAlpha: AddEquation,
    blendSrcAlpha: OneFactor,
    blendDstAlpha: ZeroFactor,
    vertexShader: "precision highp float; uniform mat4 modelViewMatrix, projectionMatrix; attribute vec3 position; void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "precision highp float; void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }"
  }));
  const prev = renderer.getRenderTarget(), ac = renderer.autoClear;
  renderer.autoClear = false;
  renderer.setRenderTarget(readBuffer);
  alphaQuad.render(renderer);
  renderer.setRenderTarget(prev);
  renderer.autoClear = ac;
}
function trueColorOutput() {
  const op = new OutputPass(), m = op.material;
  const fs = m.fragmentShader.replace("uniform sampler2D tDiffuse;", "uniform sampler2D tDiffuse;\nuniform sampler2D tMask;\nuniform float uMaskOn;").replace("gl_FragColor = texture2D( tDiffuse, vUv );", "gl_FragColor = texture2D( tDiffuse, vUv );\nvec3 bpPhoto = clamp( gl_FragColor.rgb, 0.0, 1.0 );\nfloat bpMask = uMaskOn > 1.5 ? clamp( gl_FragColor.a, 0.0, 1.0 ) : uMaskOn > 0.5 ? texture2D( tMask, vUv ).r : 1.0;").replace("// color space", "if ( uMaskOn > 0.5 ) { gl_FragColor.rgb = mix( bpPhoto, gl_FragColor.rgb, bpMask ); gl_FragColor.a = 1.0; }\n// color space");
  if ((fs.match(/bpPhoto|uMaskOn|bpMask/g) || []).length < 7) {
    console.warn("realism.js: OutputShader changed, true-color backdrop disabled");
    return op;
  }
  m.fragmentShader = fs;
  op.uniforms.tMask = { value: null };
  op.uniforms.uMaskOn = { value: 0 };
  const r0 = op.render.bind(op);
  op.render = (renderer, ...a) => {
    const s = R.sky, fast = fastMask() && s && s.parent && s.visible && s.material.blending === CustomBlending;
    const on = trueSkyOn() && (fast || maskRT);
    op.uniforms.uMaskOn.value = !on ? 0 : fast ? 2 : 1;
    op.uniforms.tMask.value = on && !fast ? maskRT.texture : null;
    r0(renderer, ...a);
  };
  return op;
}
function photoSafeBloom(b) {
  const m = b.materialHighPassFilter, line = "gl_FragColor = mix( outputColor, texel, alpha );";
  if (!m.fragmentShader.includes(line)) return;
  b.highPassUniforms.tMask = { value: null };
  b.highPassUniforms.uMaskOn = { value: 0 };
  m.fragmentShader = m.fragmentShader.replace("uniform sampler2D tDiffuse;", "uniform sampler2D tDiffuse;\nuniform sampler2D tMask;\nuniform float uMaskOn;").replace(line, line + "\nif ( uMaskOn > 0.5 ) gl_FragColor.rgb *= texture2D( tMask, vUv ).r;");
  m.needsUpdate = true;
  const r0 = b.render.bind(b);
  b.render = (...a) => {
    const on = trueSkyOn() && maskRT && !R.photoBloom;
    b.highPassUniforms.uMaskOn.value = on ? 1 : 0;
    b.highPassUniforms.tMask.value = on ? maskRT.texture : null;
    r0(...a);
  };
}
function disposeComposer(c) {
  if (!c) return;
  for (const p of c.passes) if (p.__kit && p.dispose) try {
    p.dispose();
  } catch (_) {
  }
  try {
    c.renderTarget1.dispose();
    c.renderTarget2.dispose();
    c.copyPass && c.copyPass.dispose && c.copyPass.dispose();
  } catch (_) {
  }
}
var fastMask = () => R.tv && R.composer && R.composer.passes.every((p) => !p.enabled || p.__kit);
function buildComposer() {
  const { renderer, scene, camera, quality } = R;
  disposeComposer(R.composer);
  const c = tv ? new EffectComposer(renderer, new WebGLRenderTarget(innerWidth, innerHeight, { type: HalfFloatType, samples: 4 })) : new EffectComposer(renderer);
  const rp = new RenderPass(scene, camera), rp0 = rp.render.bind(rp);
  rp.__kit = true;
  rp.render = (renderer2, writeBuffer, readBuffer, ...a) => {
    rp0(renderer2, writeBuffer, readBuffer, ...a);
    const s = R.sky;
    if (s && s.parent && s.visible && s.material.blending === CustomBlending) {
      if (fastMask()) return;
      if (trueSkyOn()) captureMask(renderer2, readBuffer);
      restoreAlpha(renderer2, readBuffer);
    }
  };
  c.addPass(rp);
  if (quality.tier >= 2) {
    const ao = new GTAOPass(scene, camera, innerWidth, innerHeight);
    ao.blendIntensity = 0.85;
    ao.__kit = true;
    c.addPass(ao);
    R.passes.ao = ao;
    const ao0 = ao.render.bind(ao);
    ao.render = (...a) => {
      const s = trueSkyOn() ? R.sky : null;
      if (s) s.visible = false;
      try {
        ao0(...a);
      } finally {
        if (s) s.visible = true;
      }
    };
    ao.__noSky = true;
  }
  if (quality.tier >= 1) {
    const b = new UnrealBloomPass(new Vector2(innerWidth, innerHeight), 0.35, 0.5, 0.88);
    b.__kit = true;
    c.addPass(b);
    R.passes.bloom = b;
    photoSafeBloom(b);
  }
  const op = trueColorOutput();
  op.__kit = true;
  c.addPass(op);
  if (quality.tier >= 2) {
    const sm = new SMAAPass(innerWidth * renderer.getPixelRatio(), innerHeight * renderer.getPixelRatio());
    sm.__kit = true;
    c.addPass(sm);
  }
  R.composer = c;
}
var hdrCache = {};
var hdrRes = () => R && R.quality.tier >= 2 ? "2k" : "1k";
var photoRes = () => !R || R.quality.tier >= 2 ? "4k" : R.quality.tier === 1 || R.tv ? "2k" : "1k";
async function environment(scene, renderer, name, opts = {}) {
  var _a;
  const { background = true, blur = 0, intensity = 1, rotation = 0, skyRotation, exact = false, trueColor = true } = opts;
  const res = hdrRes();
  const tex = hdrCache[_a = name + res] || (hdrCache[_a] = await new RGBELoader().loadAsync("".concat(ASSETS, "hdri/").concat(name, "_").concat(res, ".hdr")));
  if (R) R.env = { scene, renderer, name, opts, res, tex };
  tex.mapping = EquirectangularReflectionMapping;
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  scene.environmentRotation = new Euler(0, rotation, 0);
  if (background) {
    const bgRes = photoRes();
    const bgLoad = (r) => new TextureLoader().loadAsync("".concat(ASSETS, "backdrops/").concat(name, "_").concat(r, ".jpg"));
    const bg = await bgLoad(bgRes).catch(() => bgRes === "4k" ? null : bgLoad("4k")).catch(() => null);
    if (bg && (exact || blur === 0 && trueColor !== false)) {
      const skyR = R ? Math.min(500, R.camera.far * 0.9) : 350;
      const sky = new Mesh(new SphereGeometry(skyR, 96, 48), new MeshBasicMaterial({ map: bg, side: BackSide, toneMapped: false, depthWrite: false, fog: false }));
      bg.colorSpace = SRGBColorSpace;
      bg.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sky.scale.x = -1;
      sky.rotation.y = (skyRotation != null ? skyRotation : rotation) + Math.PI;
      sky.renderOrder = -1e3;
      sky.name = "photoSky";
      sky.frustumCulled = false;
      const bgI = { value: 1 };
      sky.material.onBeforeCompile = (sh) => {
        sh.uniforms.uBgI = bgI;
        sh.fragmentShader = "uniform float uBgI;\n" + sh.fragmentShader.replace("#include <opaque_fragment>", "outgoingLight *= uBgI;\n#include <opaque_fragment>");
      };
      sky.onBeforeRender = (r, s, cam) => {
        var _a2;
        sky.position.setFromMatrixPosition(cam.matrixWorld);
        sky.updateMatrixWorld();
        bgI.value = (_a2 = s.backgroundIntensity) != null ? _a2 : 1;
      };
      sky.userData.trueColor = trueColor;
      if (trueColor) Object.assign(sky.material, {
        blending: CustomBlending,
        blendEquation: AddEquation,
        blendSrc: OneFactor,
        blendDst: ZeroFactor,
        blendEquationAlpha: AddEquation,
        blendSrcAlpha: ZeroFactor,
        blendDstAlpha: ZeroFactor
      });
      if (R && R.sky && R.sky.parent) R.sky.parent.remove(R.sky);
      scene.add(sky);
      scene.background = null;
      if (R) R.sky = sky;
      if (R) R.env.bgRes = bgRes;
    } else if (bg) {
      bg.mapping = EquirectangularReflectionMapping;
      bg.colorSpace = SRGBColorSpace;
      scene.background = bg;
      if (R) R.env.bgRes = bgRes;
    } else scene.background = tex;
    scene.backgroundBlurriness = blur;
    scene.backgroundRotation = new Euler(0, skyRotation != null ? skyRotation : rotation, 0);
  }
  return tex;
}
var texLoader = new TextureLoader();
var pbrSize = (kind) => !R || R.quality.tier >= 2 ? "2k" : R.quality.tier === 1 ? "1k" : R.tv && kind === "Diffuse" ? "1k" : "512";
var PBR_SLOTS = { map: "Diffuse", normalMap: "nor_gl", roughnessMap: "Rough", aoMap: "AO" };
var pbrMats = /* @__PURE__ */ new Set();
function pbrTex(base, kind, repeat, srgb, mat, slot) {
  const t = texLoader.load("".concat(base).concat(kind, "_").concat(pbrSize(kind), ".jpg"), void 0, void 0, () => {
    if (mat && mat[slot] === t) {
      mat[slot] = null;
      mat.needsUpdate = true;
    }
  });
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = R && R.tv ? 4 : 8;
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.userData.kitSize = pbrSize(kind);
  return t;
}
function pbr(name, { repeat = [1, 1], color, roughness, metalness = 0, normalScale = 1, envMapIntensity = 1, physical = false, clearcoat = 0 } = {}) {
  const base = "".concat(ASSETS, "textures/").concat(name, "/").concat(name, "_");
  const P = physical ? MeshPhysicalMaterial : MeshStandardMaterial;
  const m = new P({ metalness, envMapIntensity });
  for (const [slot, kind] of Object.entries(PBR_SLOTS)) m[slot] = pbrTex(base, kind, repeat, slot === "map", m, slot);
  m.userData.kitPbr = base;
  pbrMats.add(m);
  m.normalScale = new Vector2(normalScale, normalScale);
  if (roughness !== void 0) m.roughness = roughness;
  if (color) m.color = new Color(color);
  if (physical) {
    m.clearcoat = clearcoat;
    m.clearcoatRoughness = 0.05;
  }
  return m;
}
var gltf = new GLTFLoader();
var modelCache = {};
async function model(name) {
  const g = modelCache[name] || (modelCache[name] = await gltf.loadAsync("".concat(ASSETS, "models/").concat(name, "/").concat(name, ".gltf")));
  const copy = g.scene.clone(true);
  copy.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return copy;
}
function sun(scene, { color = 16777215, intensity = 2.5, position = [4, 9, 5], target = [0, 0, 0], size = 12 } = {}) {
  const l = new DirectionalLight(color, intensity);
  l.position.set(...position);
  l.target.position.set(...target);
  l.castShadow = true;
  const q = R && R.quality.tier >= 2 ? 2048 : 1024;
  l.shadow.mapSize.set(q, q);
  l.shadow.bias = -3e-4;
  l.shadow.normalBias = 0.02;
  Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 0.5, far: 60 });
  scene.add(l, l.target);
  return l;
}
function shake(amount = 0.3) {
  if (R) R.shakeAmt = Math.max(R.shakeAmt, amount);
}
function flash(color = 16777215, strength = 0.35) {
  if (!R) return;
  if (!R.flashEl) {
    R.flashEl = document.createElement("div");
    Object.assign(R.flashEl.style, { position: "fixed", inset: 0, pointerEvents: "none", transition: "opacity .25s", opacity: 0, zIndex: 3 });
    document.body.appendChild(R.flashEl);
  }
  R.flashEl.style.background = "#" + new Color(color).getHexString();
  R.flashEl.style.transition = "none";
  R.flashEl.style.opacity = strength;
  requestAnimationFrame(() => {
    R.flashEl.style.transition = "opacity .35s";
    R.flashEl.style.opacity = 0;
  });
}
function retier() {
  R.passes = {};
  buildComposer();
  R.resize();
  const old = /* @__PURE__ */ new Set();
  for (const m of pbrMats) {
    for (const [slot, kind] of Object.entries(PBR_SLOTS)) {
      const t = m[slot];
      if (!t || !t.userData.kitSize || t.userData.kitSize === pbrSize(kind)) continue;
      const nt = pbrTex(m.userData.kitPbr, kind, [t.repeat.x, t.repeat.y], slot === "map", m, slot);
      nt.offset.copy(t.offset);
      nt.rotation = t.rotation;
      nt.center.copy(t.center);
      m[slot] = nt;
      old.add(t);
    }
  }
  for (const t of old) t.dispose();
  const E = R.env;
  if (E) {
    if (E.res !== hdrRes() && E.scene.environment === E.tex) {
      const res = hdrRes(), key = E.name + res, from = E.tex;
      (hdrCache[key] ? Promise.resolve(hdrCache[key]) : new RGBELoader().loadAsync("".concat(ASSETS, "hdri/").concat(E.name, "_").concat(res, ".hdr"))).then((tex) => {
        hdrCache[key] = tex;
        tex.mapping = EquirectangularReflectionMapping;
        if (E.scene.environment === from) E.scene.environment = tex;
        if (E.scene.background === from) E.scene.background = tex;
        E.tex = tex;
        E.res = res;
        delete hdrCache[E.name + (res === "2k" ? "1k" : "2k")];
        from.dispose();
      }).catch(() => {
      });
    }
    const sky = R.sky, want = photoRes();
    if (E.bgRes && E.bgRes !== want && (sky && sky.parent || E.scene.background && E.scene.background.isTexture && E.scene.background !== E.tex)) {
      new TextureLoader().loadAsync("".concat(ASSETS, "backdrops/").concat(E.name, "_").concat(want, ".jpg")).then((bg) => {
        bg.colorSpace = SRGBColorSpace;
        E.bgRes = want;
        if (sky && sky.parent && sky.material.map) {
          const from = sky.material.map;
          bg.anisotropy = from.anisotropy;
          sky.material.map = bg;
          from.dispose();
        } else if (E.scene.background && E.scene.background.isTexture) {
          const from = E.scene.background;
          bg.mapping = EquirectangularReflectionMapping;
          E.scene.background = bg;
          from.dispose();
        }
      }).catch(() => {
      });
    }
  }
  for (const fn of R.tierFns) try {
    fn(R.quality.tier);
  } catch (e) {
    console.warn(e);
  }
  try {
    dispatchEvent(new CustomEvent("bp-tier", { detail: { tier: R.quality.tier } }));
  } catch (_) {
  }
}
function render(dt = 1 / 60) {
  var _a;
  const { camera, composer, quality } = R;
  if (R.shakeAmt > 1e-3) {
    R.basePos.copy(camera.position);
    camera.position.x += (Math.random() - 0.5) * R.shakeAmt * 0.1;
    camera.position.y += (Math.random() - 0.5) * R.shakeAmt * 0.1;
    composer.render(dt);
    camera.position.copy(R.basePos);
    R.shakeAmt *= 0.88;
  } else composer.render(dt);
  quality.frames++;
  const now = performance.now();
  if (now < quality.graceUntil) {
    quality.frames = 0;
    quality.t0 = now;
    return;
  }
  if (now - quality.t0 > 2e3) {
    quality.fps = quality.frames * 1e3 / (now - quality.t0);
    quality.frames = 0;
    quality.t0 = now;
    (_a = quality.maxTier) != null ? _a : quality.maxTier = quality.tier;
    if (quality.fps < 45 && quality.tier > 0) {
      quality.tier--;
      quality.goodFor = 0;
      retier();
    } else if (quality.fps > 58 && quality.tier < quality.maxTier) {
      quality.goodFor = (quality.goodFor || 0) + 1;
      if (quality.goodFor >= 5) {
        quality.tier++;
        quality.goodFor = 0;
        retier();
      }
    } else quality.goodFor = 0;
  }
}

export {
  SimplexNoise,
  OutputPass,
  state,
  tv,
  setup,
  environment,
  pbr,
  model,
  sun,
  shake,
  flash,
  render,
  realism_exports
};
