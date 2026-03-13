function initSplashCursor(options = {}) {
    const config = Object.assign({
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.0, // Slower fade for better visibility
        VELOCITY_DISSIPATION: 0.6,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30.0, // More swirls
        SPLAT_RADIUS: 0.5,
        SPLAT_FORCE: 15000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true,
        PAUSED: false
    }, options);

    const canvas = document.getElementById('fluid');
    if (!canvas) return;

    function getWebGLContext(canvas) {
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext('webgl2', params);
        if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
        
        let halfFloat;
        let supportLinearFiltering;
        if (gl instanceof WebGL2RenderingContext) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }
        
        const halfFloatTexType = (gl instanceof WebGL2RenderingContext) ? gl.HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);
        
        let formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        let formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        let formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);

        return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE ? { internalFormat, format } : null;
    }

    const { gl, ext } = getWebGLContext(canvas);
    if (!gl) return;

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    function createProgram(vsSource, fsSource) {
        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        return program;
    }

    const baseVertexShader = `
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
    `;

    const splatShader = `
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
    `;

    const displayShader = `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
            gl_FragColor = vec4(c, a);
        }
    `;

    const advectionShader = `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;
        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
        }
    `;

    const divergenceShader = `
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
            gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
        }
    `;

    const pressureShader = `
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
    `;

    const gradientSubtractShader = `
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
    `;

    const splatProg = createProgram(baseVertexShader, splatShader);
    const displayProg = createProgram(baseVertexShader, displayShader);
    const advectionProg = createProgram(baseVertexShader, advectionShader);
    const divergenceProg = createProgram(baseVertexShader, divergenceShader);
    const pressureProg = createProgram(baseVertexShader, pressureShader);
    const gradSubtractProg = createProgram(baseVertexShader, gradientSubtractShader);

    const blit = (() => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
        const elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
        return (target) => {
            if (target == null) { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
            else { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    })();

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
        return { texture, fbo, width: w, height: h, attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
    }

    function createDoubleFBO(w, h, internal, format, type, param) {
        let f1 = createFBO(w, h, internal, format, type, param);
        let f2 = createFBO(w, h, internal, format, type, param);
        return { width: w, height: h, get read(){ return f1; }, get write(){ return f2; }, swap(){ let t=f1; f1=f2; f2=t; } };
    }

    let dye, velocity, divergence, pressure;
    function initFBOs() {
        let w = gl.drawingBufferWidth; let h = gl.drawingBufferHeight;
        let simW = Math.round(w * 0.25); let simH = Math.round(h * 0.25);
        const type = ext.halfFloatTexType; const rgba = ext.formatRGBA; const rg = ext.formatRG; const r = ext.formatR;
        dye = createDoubleFBO(w, h, rgba.internalFormat, rgba.format, type, gl.LINEAR);
        velocity = createDoubleFBO(simW, simH, rg.internalFormat, rg.format, type, gl.LINEAR);
        divergence = createFBO(simW, simH, r.internalFormat, r.format, type, gl.NEAREST);
        pressure = createDoubleFBO(simW, simH, r.internalFormat, r.format, type, gl.NEAREST);
    }

    initFBOs();

    let lastTime = Date.now();
    let mouse = { x: 0, y: 0, px: 0, py: 0, down: false, moved: false };

    function update() {
        let now = Date.now(); let dt = Math.min((now - lastTime)/1000, 0.016); lastTime = now;
        gl.disable(gl.BLEND);

        if (mouse.moved) {
            mouse.moved = false;
            let dx = (mouse.x - mouse.px) * config.SPLAT_FORCE;
            let dy = (mouse.y - mouse.py) * config.SPLAT_FORCE;
            splat(mouse.x, mouse.y, dx, dy, {r:2.5, g:2.0, b:0.4}); // Gold
            mouse.px = mouse.x; mouse.py = mouse.y;
        }

        // Advection
        gl.useProgram(advectionProg);
        gl.uniform2f(gl.getUniformLocation(advectionProg, "texelSize"), 1/velocity.width, 1/velocity.height);
        gl.uniform1i(gl.getUniformLocation(advectionProg, "uVelocity"), velocity.read.attach(0));
        gl.uniform1i(gl.getUniformLocation(advectionProg, "uSource"), velocity.read.attach(0));
        gl.uniform1f(gl.getUniformLocation(advectionProg, "dt"), dt);
        gl.uniform1f(gl.getUniformLocation(advectionProg, "dissipation"), config.VELOCITY_DISSIPATION);
        blit(velocity.write); velocity.swap();

        gl.uniform2f(gl.getUniformLocation(advectionProg, "texelSize"), 1/dye.width, 1/dye.height);
        gl.uniform1i(gl.getUniformLocation(advectionProg, "uSource"), dye.read.attach(1));
        gl.uniform1f(gl.getUniformLocation(advectionProg, "dissipation"), config.DENSITY_DISSIPATION);
        blit(dye.write); dye.swap();

        // Divergence
        gl.useProgram(divergenceProg);
        gl.uniform2f(gl.getUniformLocation(divergenceProg, "texelSize"), 1/velocity.width, 1/velocity.height);
        gl.uniform1i(gl.getUniformLocation(divergenceProg, "uVelocity"), velocity.read.attach(0));
        blit(divergence);

        // Pressure
        gl.useProgram(pressureProg);
        gl.uniform2f(gl.getUniformLocation(pressureProg, "texelSize"), 1/velocity.width, 1/velocity.height);
        gl.uniform1i(gl.getUniformLocation(pressureProg, "uDivergence"), divergence.attach(0));
        for(let i=0; i<config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(gl.getUniformLocation(pressureProg, "uPressure"), pressure.read.attach(1));
            blit(pressure.write); pressure.swap();
        }

        // Gradient Subtract
        gl.useProgram(gradSubtractProg);
        gl.uniform2f(gl.getUniformLocation(gradSubtractProg, "texelSize"), 1/velocity.width, 1/velocity.height);
        gl.uniform1i(gl.getUniformLocation(gradSubtractProg, "uPressure"), pressure.read.attach(0));
        gl.uniform1i(gl.getUniformLocation(gradSubtractProg, "uVelocity"), velocity.read.attach(1));
        blit(velocity.write); velocity.swap();

        // Display
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(displayProg);
        gl.uniform1i(gl.getUniformLocation(displayProg, "uTexture"), dye.read.attach(0));
        blit(null);

        requestAnimationFrame(update);
    }

    function splat(x, y, dx, dy, color) {
        gl.useProgram(splatProg);
        gl.uniform1i(gl.getUniformLocation(splatProg, "uTarget"), velocity.read.attach(0));
        gl.uniform1f(gl.getUniformLocation(splatProg, "aspectRatio"), canvas.width / canvas.height);
        gl.uniform2f(gl.getUniformLocation(splatProg, "point"), x, y);
        gl.uniform3f(gl.getUniformLocation(splatProg, "color"), dx, dy, 0.0);
        gl.uniform1f(gl.getUniformLocation(splatProg, "radius"), config.SPLAT_RADIUS / 100);
        blit(velocity.write); velocity.swap();

        gl.uniform1i(gl.getUniformLocation(splatProg, "uTarget"), dye.read.attach(0));
        gl.uniform3f(gl.getUniformLocation(splatProg, "color"), color.r, color.g, color.b);
        blit(dye.write); dye.swap();
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = 1.0 - e.clientY / window.innerHeight;
        mouse.moved = true;
    });

    function resize() {
        let w = window.innerWidth * window.devicePixelRatio;
        let h = window.innerHeight * window.devicePixelRatio;
        if (canvas.width != w || canvas.height != h) {
            canvas.width = w; canvas.height = h;
            return true;
        }
        return false;
    }

    update();
}

window.addEventListener('load', initSplashCursor);
