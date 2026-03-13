function initSplashCursor(options = {}) {
    const config = Object.assign({
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 0.8,
        PRESSURE: 0.5,
        PRESSURE_ITERATIONS: 25,
        CURL: 20,
        SPLAT_RADIUS: 0.4,
        SPLAT_FORCE: 12000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true,
        PAUSED: false
    }, options);

    const canvas = document.getElementById('fluid');
    if (!canvas) {
        console.warn("Fluid canvas not found");
        return;
    }

    console.log("Splash Cursor Initializing...");

    function pointerPrototype() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
        this.color = [0, 0, 0];
    }

    let pointers = [new pointerPrototype()];

    function getWebGLContext(canvas) {
        const params = {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        };
        let gl = canvas.getContext('webgl2', params);
        const isWebGL2 = !!gl;
        if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

        let halfFloat;
        let supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
        let formatRGBA, formatRG, formatR;

        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default: return null;
            }
        }
        return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    const { gl, ext } = getWebGLContext(canvas);

    function compileShader(type, source, keywords) {
        source = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
        return shader;
    }

    function addKeywords(source, keywords) {
        if (!keywords) return source;
        let keywordsString = '';
        keywords.forEach(keyword => { keywordsString += '#define ' + keyword + '\n'; });
        return keywordsString + source;
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;
        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
    `;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            gl_FragColor = result / (1.0 + dissipation * dt);
        }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
            if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
            gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
        }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
            gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
        }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C; force.y *= -1.0;
            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
            float div = texture2D(uDivergence, vUv).x;
            gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
        }
    `);

    const gradienSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel - vec2(R - L, T - B), 0.0, 1.0);
        }
    `);

    function createProgram(vs, fs) {
        let p = gl.createProgram();
        gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
        let u = {}; let c = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for(let i=0; i<c; i++){ let n = gl.getActiveUniform(p, i).name; u[n] = gl.getUniformLocation(p, n); }
        return { p, u };
    }

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
        return (target, clear = false) => {
            if (target == null) { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
            else { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
            if (clear) { gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    })();

    let dye, velocity, divergence, curl, pressure;
    const copyP = createProgram(baseVertexShader, copyShader);
    const clearP = createProgram(baseVertexShader, clearShader);
    const splatP = createProgram(baseVertexShader, splatShader);
    const advectionP = createProgram(baseVertexShader, advectionShader);
    const divergenceP = createProgram(baseVertexShader, divergenceShader);
    const curlP = createProgram(baseVertexShader, curlShader);
    const vorticityP = createProgram(baseVertexShader, vorticityShader);
    const pressureP = createProgram(baseVertexShader, pressureShader);
    const gradSubtractP = createProgram(baseVertexShader, gradientSubtractShader);
    
    // Display keywords handling
    let displayPrograms = {};
    function getDisplayP(keywords) {
        let hash = keywords.join(',');
        if (!displayPrograms[hash]) {
            let fs = compileShader(gl.FRAGMENT_SHADER, displayShaderSource, keywords);
            displayPrograms[hash] = createProgram(baseVertexShader, fs);
        }
        return displayPrograms[hash];
    }

    function createFBO(w, h, internal, format, type, param) {
        gl.activeTexture(gl.TEXTURE0);
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        return { texture, fbo, width: w, height: h, texelX: 1/w, texelY: 1/h, attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
    }

    function createDoubleFBO(w, h, internal, format, type, param) {
        let f1 = createFBO(w, h, internal, format, type, param);
        let f2 = createFBO(w, h, internal, format, type, param);
        return { width: w, height: h, texelX: f1.texelX, texelY: f1.texelY, get read(){ return f1; }, get write(){ return f2; }, swap(){ let t=f1; f1=f2; f2=t; } };
    }

    function initFramebuffers() {
        let simRes = getRes(config.SIM_RESOLUTION); let dyeRes = getRes(config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType; const rgba = ext.formatRGBA; const rg = ext.formatRG; const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function getRes(r) {
        let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight; if (aspect<1) aspect = 1/aspect;
        let min = Math.round(r); let max = Math.round(r * aspect);
        return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    initFramebuffers();
    let lastTime = Date.now();

    function update() {
        let now = Date.now(); let dt = Math.min((now - lastTime)/1000, 0.016); lastTime = now;
        if (resize()) initFramebuffers();
        
        // Input Splats
        pointers.forEach(p => {
            if (p.moved) {
                p.moved = false;
                splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color);
            }
        });

        // Simulation Steps
        gl.disable(gl.BLEND);
        // Curl
        gl.useProgram(curlP.p); gl.uniform2f(curlP.u.texelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(curlP.u.uVelocity, velocity.read.attach(0)); blit(curl);
        // Vorticity
        gl.useProgram(vorticityP.p); gl.uniform2f(vorticityP.u.texelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(vorticityP.u.uVelocity, velocity.read.attach(0)); gl.uniform1i(vorticityP.u.uCurl, curl.attach(1));
        gl.uniform1f(vorticityP.u.curl, config.CURL); gl.uniform1f(vorticityP.u.dt, dt); blit(velocity.write); velocity.swap();
        // Divergence
        gl.useProgram(divergenceP.p); gl.uniform2f(divergenceP.u.texelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(divergenceP.u.uVelocity, velocity.read.attach(0)); blit(divergence);
        // Pressure Clear
        gl.useProgram(clearP.p); gl.uniform1i(clearP.u.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearP.u.value, config.PRESSURE); blit(pressure.write); pressure.swap();
        // Pressure Solve
        gl.useProgram(pressureP.p); gl.uniform2f(pressureP.u.texelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(pressureP.u.uDivergence, divergence.attach(0));
        for(let i=0; i<config.PRESSURE_ITERATIONS; i++){ gl.uniform1i(pressureP.u.uPressure, pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
        // Gradient Subtract
        gl.useProgram(gradSubtractP.p); gl.uniform2f(gradSubtractP.u.texelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(gradSubtractP.u.uPressure, pressure.read.attach(0)); gl.uniform1i(gradSubtractP.u.uVelocity, velocity.read.attach(1));
        blit(velocity.write); velocity.swap();
        // Advection
        gl.useProgram(advectionP.p); gl.uniform2f(advectionP.u.texelSize, velocity.texelX, velocity.texelY);
        if(!ext.supportLinearFiltering) gl.uniform2f(advectionP.u.dyeTexelSize, velocity.texelX, velocity.texelY);
        gl.uniform1i(advectionP.u.uVelocity, velocity.read.attach(0)); gl.uniform1i(advectionP.u.uSource, velocity.read.attach(0));
        gl.uniform1f(advectionP.u.dt, dt); gl.uniform1f(advectionP.u.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write); velocity.swap();
        
        if(!ext.supportLinearFiltering) gl.uniform2f(advectionP.u.dyeTexelSize, dye.texelX, dye.texelY);
        gl.uniform1i(advectionP.u.uVelocity, velocity.read.attach(0)); gl.uniform1i(advectionP.u.uSource, dye.read.attach(1));
        gl.uniform1f(advectionP.u.dissipation, config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();

        // Render to screen
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
        let dp = getDisplayP(config.SHADING ? ['SHADING'] : []);
        gl.useProgram(dp.p);
        if(config.SHADING) gl.uniform2f(dp.u.texelSize, 1/gl.drawingBufferWidth, 1/gl.drawingBufferHeight);
        gl.uniform1i(dp.u.uTexture, dye.read.attach(0));
        blit(null, true); // CLEAR SCREEN FIRST

        requestAnimationFrame(update);
    }

    function resize() {
        let w = Math.floor(canvas.clientWidth * window.devicePixelRatio);
        let h = Math.floor(canvas.clientHeight * window.devicePixelRatio);
        if (canvas.width != w || canvas.height != h) { canvas.width = w; canvas.height = h; return true; }
        return false;
    }

    function splat(x, y, dx, dy, color) {
        gl.useProgram(splatP.p);
        gl.uniform1i(splatP.u.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatP.u.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatP.u.point, x, y);
        gl.uniform3f(splatP.u.color, dx, dy, 0.0);
        gl.uniform1f(splatP.u.radius, config.SPLAT_RADIUS / 100);
        blit(velocity.write); velocity.swap();

        gl.uniform1i(splatP.u.uTarget, dye.read.attach(0));
        gl.uniform3f(splatP.u.color, color.r, color.g, color.b);
        blit(dye.write); dye.swap();
    }

    function generateColor() {
        const colors = [{r:2, g:1.6, b:0.2}, {r:2.5, g:2.3, b:0}, {r:1.8, g:1.4, b:0.4}];
        return colors[Math.floor(Math.random()*colors.length)];
    }

    const scale = (v) => v * window.devicePixelRatio;
    
    window.addEventListener('mousedown', e => {
        pointers[0].down = true; pointers[0].texcoordX = e.clientX / window.innerWidth; pointers[0].texcoordY = 1.0 - e.clientY / window.innerHeight;
        pointers[0].color = generateColor(); splat(pointers[0].texcoordX, pointers[0].texcoordY, (Math.random()-0.5)*200, (Math.random()-0.5)*200, pointers[0].color);
    });
    window.addEventListener('mousemove', e => {
        let p = pointers[0];
        let tx = e.clientX / window.innerWidth; let ty = 1.0 - e.clientY / window.innerHeight;
        p.deltaX = (tx - p.texcoordX) * aspectCorrX(); p.deltaY = (ty - p.texcoordY) * aspectCorrY();
        p.texcoordX = tx; p.texcoordY = ty; p.moved = true;
    });
    const aspectCorrX = () => { let a = canvas.width/canvas.height; return a < 1 ? a : 1; };
    const aspectCorrY = () => { let a = canvas.width/canvas.height; return a > 1 ? 1/a : 1; };

    update();
}

window.addEventListener('load', initSplashCursor);
