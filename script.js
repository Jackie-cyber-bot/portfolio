function loadNavbar() {
    setActiveNavLink();
    initNavbar();
}

// Set active state for current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isProjectPage = currentPage.startsWith('project-');
    const hash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (isProjectPage) {
            // On project pages: Work is active
            link.classList.toggle('active', section === 'work');
        } else {
            // On index: active based on hash
            if (hash === '#about') {
                link.classList.toggle('active', section === 'about');
            } else {
                link.classList.toggle('active', section === 'work');
            }
        }
    });
}

// Scroll-based nav highlight on index page
function initScrollSpy() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const section = link.getAttribute('data-section');
                if (entry.isIntersecting) {
                    link.classList.toggle('active', section === 'about');
                } else {
                    link.classList.toggle('active', section === 'work');
                }
            });
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
}

// Initialize Navbar functionality
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Auto-update year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
}


document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    initCustomCursor();
    initHoloShimmer();
    initFlowerTrail();

    // Auto-update year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Hero gradient mesh blobs
    initHeroBlobs();

    // Hero glow effect
    initHeroGlow();

    // Scroll spy for single-page nav
    initScrollSpy();

    // Work cards entrance animation
    initCardReveal();

    // About section fade-up animation
    initAboutFade();

    // Back to Top button
    initBackToTop();

    // Navbar scroll border
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

});


function initParticleNetwork() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');

    const COUNT       = 72;
    const CONNECT_R   = 140;
    const REPEL_R     = 110;
    const REPEL_FORCE = 2.8;
    const SPEED       = 0.45;

    let W, H, mouse = { x: null, y: null };

    function resize() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = null; });

    const particles = Array.from({ length: COUNT }, () => ({
        x:      Math.random() * W,
        y:      Math.random() * H,
        vx:     (Math.random() - 0.5) * SPEED,
        vy:     (Math.random() - 0.5) * SPEED,
        angle:  Math.random() * Math.PI * 2,
        spin:   (Math.random() - 0.5) * 0.012,
        size:   2.5 + Math.random() * 2.5,
    }));

    function drawDaisy(x, y, size, angle) {
        const petals = 8;
        const petalL = size * 2.2;
        const petalW = size * 0.75;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Petals
        for (let i = 0; i < petals; i++) {
            ctx.save();
            ctx.rotate((i / petals) * Math.PI * 2);
            ctx.beginPath();
            ctx.ellipse(petalL / 2, 0, petalL / 2, petalW / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.82)';
            ctx.fill();
            ctx.restore();
        }

        // Center
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 218, 100, 0.95)';
        ctx.fill();

        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Move + bounce
        particles.forEach(p => {
            p.angle += p.spin;
            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < REPEL_R && dist > 0) {
                    const force = (1 - dist / REPEL_R) * REPEL_FORCE;
                    p.vx += (dx / dist) * force * 0.08;
                    p.vy += (dy / dist) * force * 0.08;
                }
            }

            // Speed cap
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > SPEED * 3) { p.vx *= 0.96; p.vy *= 0.96; }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            if (p.x > W) { p.x = W; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            if (p.y > H) { p.y = H; p.vy *= -1; }
        });

        // Connections — thin soft lines like stems
        for (let i = 0; i < COUNT; i++) {
            for (let j = i + 1; j < COUNT; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_R) {
                    const alpha = (1 - dist / CONNECT_R) * 0.28;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth   = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Daisies
        particles.forEach(p => drawDaisy(p.x, p.y, p.size, p.angle));

        requestAnimationFrame(draw);
    }

    draw();
}

function initFlowerTrail() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const TAU = Math.PI * 2;
    let W, H;

    function resize() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const LAG_MS    = 300;
    const MIN_DIST  = 55;
    const MAX_PLANTS = 600;

    const GREENS = ['#1a5c12','#246b1a','#2d7a22','#357a20','#1c6e15','#228c20','#2a7a25','#3a8030'];
    const FPAL = [
        {p:'#FF1493',s:'#A0005A',c:'#FFD700'},{p:'#FF6347',s:'#CC2000',c:'#FFD700'},
        {p:'#FFD700',s:'#CC8000',c:'#FF7700'},{p:'#DA70D6',s:'#8B3090',c:'#FFE566'},
        {p:'#FF69B4',s:'#CC3070',c:'#FFA500'},{p:'#FFFFFF',s:'#BBCCBB',c:'#FFE066'},
        {p:'#9370DB',s:'#5030A0',c:'#FFD700'},{p:'#FF4500',s:'#CC2000',c:'#FFD700'},
    ];

    function brighten(hex, amt) {
        const n = parseInt(hex.slice(1), 16);
        return `rgb(${Math.max(0,Math.min(255,(n>>16)+amt))},${Math.max(0,Math.min(255,((n>>8)&0xff)+amt))},${Math.max(0,Math.min(255,(n&0xff)+amt))})`;
    }
    function easeOut(t)  { const c=Math.min(1,t); return 1-(1-c)**3; }
    function easeElastic(t) {
        t=Math.min(1,Math.max(0,t)); if(!t||t===1) return t;
        return Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(TAU/3))+1;
    }

    const trail  = [];
    const plants = [];
    let lastX = null, lastY = null;

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        trail.push({ x: e.clientX-r.left, y: e.clientY-r.top, t: performance.now() });
        if (trail.length > 400) trail.shift();
    });
    hero.addEventListener('mouseleave', () => { trail.length = 0; lastX = null; lastY = null; });

    hero.addEventListener('touchmove', e => {
        const r = hero.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - r.left;
        const y = touch.clientY - r.top;
        if (lastX === null) {
            lastX = x; lastY = y; spawnCluster(x, y);
        } else {
            const dx = x - lastX, dy = y - lastY;
            if (dx*dx + dy*dy >= MIN_DIST*MIN_DIST) {
                spawnCluster(x, y); lastX = x; lastY = y;
            }
        }
    }, { passive: true });
    hero.addEventListener('touchend', () => { lastX = null; lastY = null; });

    function lagPos(now) {
        const target = now - LAG_MS;
        for (let i = trail.length-1; i >= 0; i--)
            if (trail[i].t <= target) return trail[i];
        return null;
    }

    function spawnCluster(cx, cy) {
        const now = performance.now();
        const count = 9 + Math.floor(Math.random() * 8);
        for (let i = 0; i < count; i++) {
            plants.push({
                kind: 'grass',
                x: cx + (Math.random()-0.5)*160,
                y: cy + (Math.random()-0.5)*120,
                h: 18 + Math.random()*28,
                lean: (Math.random()-0.5)*0.85,
                color: GREENS[Math.floor(Math.random()*GREENS.length)],
                width: 1 + Math.random()*1.1,
                born: now + Math.random()*100,
                bloomDur: 200 + Math.random()*200,
                life: 1200 + Math.random()*700,
                dead: false,
            });
        }
        // 1-2 flowers per cluster, naturally sized
        const nFlowers = 1 + Math.floor(Math.random() * 2);
        for (let f = 0; f < nFlowers; f++) {
            const pal = FPAL[Math.floor(Math.random()*FPAL.length)];
            plants.push({
                kind: 'flower',
                x: cx + (Math.random()-0.5)*160,
                y: cy + (Math.random()-0.5)*120,
                rad: 4 + Math.random()*7,
                np: 5 + Math.floor(Math.random()*4),
                rot: Math.random()*TAU,
                p: pal.p, s: pal.s, c: pal.c,
                layer: Math.random() < 0.45 ? 0 : 1,
                born: now + 100 + f * 80 + Math.random()*120,
                bloomDur: 400 + Math.random()*300,
                life: 1500 + Math.random()*800,
                dead: false,
            });
        }
        if (plants.length > MAX_PLANTS) plants.splice(0, plants.length - MAX_PLANTS);
    }

    function drawBlade(p, age, alpha) {
        const grow = easeOut(age / p.bloomDur);
        if (grow <= 0) return;
        const h = p.h * grow;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.lineWidth = p.width; ctx.lineCap = 'round';
        const g = ctx.createLinearGradient(0, 0, 0, -h);
        g.addColorStop(0, p.color); g.addColorStop(1, brighten(p.color, 35));
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(Math.sin(p.lean*0.5)*h*0.35, -h*0.5, Math.sin(p.lean)*h, -h);
        ctx.stroke();
        ctx.restore();
    }

    function drawPetal(len, wid, color, tipAmt) {
        const g = ctx.createLinearGradient(0, 0, 0, -len);
        g.addColorStop(0, color); g.addColorStop(1, brighten(color, tipAmt));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo( wid, -len*0.3,  wid, -len*0.7, 0, -len);
        ctx.bezierCurveTo(-wid, -len*0.7, -wid, -len*0.3, 0,  0);
        ctx.fill();
        ctx.save(); ctx.globalAlpha *= 0.16;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-len); ctx.stroke();
        ctx.restore();
    }

    function drawFlower(p, age, alpha) {
        const grow = easeElastic(age / p.bloomDur);
        if (grow <= 0) return;
        const rad = p.rad*grow, len = rad*1.7, wid = rad*0.38, cRad = rad*0.32;
        ctx.save();
        ctx.globalAlpha = alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        // Back petals
        for (let i=0;i<p.np;i++) {
            ctx.save(); ctx.rotate((i/p.np)*TAU+Math.PI/p.np); ctx.scale(0.88,0.88);
            ctx.globalAlpha = alpha*0.55; drawPetal(len,wid,p.s,25); ctx.restore();
        }
        // Front petals
        ctx.globalAlpha = alpha;
        for (let i=0;i<p.np;i++) {
            ctx.save(); ctx.rotate((i/p.np)*TAU); drawPetal(len,wid,p.p,40); ctx.restore();
        }
        // Center
        const cg = ctx.createRadialGradient(0,0,0,0,0,cRad);
        cg.addColorStop(0,'#fffde8'); cg.addColorStop(0.5,p.c); cg.addColorStop(1,brighten(p.c,-40));
        ctx.globalAlpha = alpha; ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0,0,cRad,0,TAU); ctx.fill();
        // Stamens
        ctx.fillStyle = brighten(p.c, 60);
        for (let i=0;i<7;i++) {
            const a=(i/7)*TAU;
            ctx.beginPath(); ctx.arc(Math.cos(a)*cRad*0.6, Math.sin(a)*cRad*0.6, 0.9, 0, TAU); ctx.fill();
        }
        ctx.restore();
    }

    function loop(now) {
        const pos = lagPos(now);
        if (pos) {
            if (lastX === null) { lastX=pos.x; lastY=pos.y; spawnCluster(pos.x,pos.y); }
            else {
                const dx=pos.x-lastX, dy=pos.y-lastY;
                if (dx*dx+dy*dy >= MIN_DIST*MIN_DIST) { spawnCluster(pos.x,pos.y); lastX=pos.x; lastY=pos.y; }
            }
        }

        ctx.clearRect(0, 0, W, H);

        function drawPlant(p, now) {
            const age = now - p.born;
            if (age < 0) return false;
            if (age > p.life) { p.dead = true; return false; }
            const alpha = age > p.life-600 ? (p.life-age)/600 : 1;
            if (p.kind === 'grass') drawBlade(p, age, alpha);
            else drawFlower(p, age, alpha);
            return true;
        }

        // Pass 1: flowers under grass (layer 0)
        for (let i=plants.length-1;i>=0;i--) {
            const p=plants[i];
            if (p.kind==='flower' && p.layer===0) drawPlant(p, now);
        }
        // Pass 2: all grass
        for (let i=plants.length-1;i>=0;i--) {
            const p=plants[i];
            if (p.kind==='grass') drawPlant(p, now);
        }
        // Pass 3: flowers above grass (layer 1)
        for (let i=plants.length-1;i>=0;i--) {
            const p=plants[i];
            if (p.kind==='flower' && p.layer===1) drawPlant(p, now);
        }

        for (let i=plants.length-1;i>=0;i--) { if (plants[i].dead) plants.splice(i,1); }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function initTextScramble() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function scrambleEl(el, duration, delay) {
        // Parse child nodes to preserve <br> tags
        const parts = [];
        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) parts.push({ type: 'text', value: node.textContent });
            else if (node.nodeName === 'BR') parts.push({ type: 'br' });
        });

        const start = performance.now() + delay;

        function tick(now) {
            if (now < start) { requestAnimationFrame(tick); return; }
            const progress = Math.min(1, (now - start) / duration);
            let html = '';

            parts.forEach(part => {
                if (part.type === 'br') { html += '<br>'; return; }
                let out = '';
                for (let i = 0; i < part.value.length; i++) {
                    if (part.value[i] === ' ') { out += ' '; continue; }
                    // Each character resolves left-to-right as progress advances
                    const threshold = (i + 1) / part.value.length;
                    if (progress >= threshold) {
                        out += part.value[i];
                    } else {
                        out += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }
                html += out;
            });

            el.innerHTML = html;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    const name = document.querySelector('.hero-name');
    const role = document.querySelector('.hero-role-label');
    if (name) scrambleEl(name, 1200, 100);
    if (role) scrambleEl(role, 900,  500);
}

function initHoloShimmer() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.work-item-with-media').forEach(card => {
        const media = card.querySelector('.work-item-media-container');
        if (!media) return;

        const overlay = document.createElement('div');
        overlay.className = 'holo-overlay';
        media.appendChild(overlay);

        card.addEventListener('mousemove', e => {
            const rect = media.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            const hue   = x * 360;
            const angle = x * 160 + 10;

            overlay.style.background = `
                radial-gradient(circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.3) 0%, transparent 45%),
                linear-gradient(${angle}deg,
                    hsla(${hue}deg,      100%, 65%, 0.35) 0%,
                    hsla(${hue+60}deg,   100%, 65%, 0.28) 25%,
                    hsla(${hue+120}deg,  100%, 65%, 0.28) 50%,
                    hsla(${hue+220}deg,  100%, 65%, 0.28) 75%,
                    hsla(${hue+300}deg,  100%, 65%, 0.35) 100%
                )`;
            overlay.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
    });
}

function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
    const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
    const label = Object.assign(document.createElement('span'), { className: 'cursor-label', textContent: 'View' });
    ring.appendChild(label);
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function tick() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(tick);
    })();

    // Project cards → full "View" state
    document.querySelectorAll('.work-link').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.classList.add('view'); dot.classList.add('hidden'); });
        el.addEventListener('mouseleave', () => { ring.classList.remove('view'); dot.classList.remove('hidden'); });
    });

    // Other links/buttons → mild grow
    document.querySelectorAll('a:not(.work-link), button').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

function initHeroStars() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const COUNT = 16;
    for (let i = 0; i < COUNT; i++) {
        const star = document.createElement('span');
        star.className = 'hero-star';
        const size = (3 + Math.random() * 3).toFixed(1); // 3–6px
        const duration = (2.5 + Math.random() * 2.5).toFixed(2);
        // Delay between -20% and -80% of duration: guarantees stars start
        // somewhere in the visible middle of their cycle (not at opacity-0 endpoints)
        const delay = (-((0.2 + Math.random() * 0.6) * parseFloat(duration))).toFixed(2);
        star.style.cssText = `width:${size}px;height:${size}px;left:${(Math.random()*88+6).toFixed(1)}%;top:${(Math.random()*80+10).toFixed(1)}%;animation:star-sparkle ${duration}s ease-in-out ${delay}s infinite;`;
        hero.appendChild(star);
    }
}

function initHeroBlobs() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const blobData = [
        { x: 15, y: 20, color: 'rgba(80, 110, 220, 0.42)',  size: 480, fx: 0.00080, fy: 0.00060, px: 0.0, py: 1.2 },
        { x: 80, y: 65, color: 'rgba(130, 80, 200, 0.36)',  size: 420, fx: 0.00060, fy: 0.00090, px: 2.1, py: 0.5 },
        { x: 60, y: 15, color: 'rgba(100, 150, 240, 0.32)', size: 360, fx: 0.00100, fy: 0.00070, px: 1.0, py: 3.0 },
        { x: 20, y: 78, color: 'rgba(160, 100, 220, 0.30)', size: 340, fx: 0.00070, fy: 0.00110, px: 3.5, py: 0.8 },
        { x: 50, y: 50, color: 'rgba(90, 130, 230, 0.24)',  size: 500, fx: 0.00050, fy: 0.00065, px: 1.8, py: 2.2 },
        { x: 88, y: 25, color: 'rgba(140, 70, 210, 0.26)',  size: 320, fx: 0.00090, fy: 0.00055, px: 4.0, py: 1.5 },
    ];

    const FLOAT_AMP   = 28;
    const REPEL_R     = 240;
    const REPEL_S     = 90;
    const HOVER_R     = 300;
    const HOVER_S     = 180;
    const LERP        = 0.07;

    let mouseX = null, mouseY = null, isHovered = false;

    const blobs = blobData.map(data => {
        const el = document.createElement('div');
        el.className = 'hero-blob';
        el.style.cssText = `width:${data.size}px;height:${data.size}px;left:${data.x}%;top:${data.y}%;background:radial-gradient(circle,${data.color} 0%,transparent 70%);`;
        hero.appendChild(el);
        return { el, homeX: data.x, homeY: data.y, fx: data.fx, fy: data.fy, px: data.px, py: data.py, curX: 0, curY: 0 };
    });

    function setPointer(clientX, clientY) {
        const rect = hero.getBoundingClientRect();
        mouseX = clientX - rect.left;
        mouseY = clientY - rect.top;
    }

    hero.addEventListener('mousemove', e => setPointer(e.clientX, e.clientY));
    hero.addEventListener('mouseenter', () => { isHovered = true;  hero.classList.add('blob-hover'); });
    hero.addEventListener('mouseleave', () => { isHovered = false; mouseX = null; mouseY = null; hero.classList.remove('blob-hover'); });

    hero.addEventListener('touchstart', e => {
        isHovered = true;
        hero.classList.add('blob-hover');
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    hero.addEventListener('touchmove', e => {
        e.preventDefault();
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    hero.addEventListener('touchend', () => {
        isHovered = false;
        mouseX = null;
        mouseY = null;
        hero.classList.remove('blob-hover');
    });

    function animate(t) {
        const rect = hero.getBoundingClientRect();
        const rR = isHovered ? HOVER_R : REPEL_R;
        const rS = isHovered ? HOVER_S : REPEL_S;

        blobs.forEach(blob => {
            const floatX = Math.sin(t * blob.fx + blob.px) * FLOAT_AMP;
            const floatY = Math.cos(t * blob.fy + blob.py) * FLOAT_AMP;

            let repelX = 0, repelY = 0;
            if (mouseX !== null) {
                const bx = (blob.homeX / 100) * rect.width  + floatX;
                const by = (blob.homeY / 100) * rect.height + floatY;
                const dx = bx - mouseX;
                const dy = by - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < rR && dist > 0) {
                    const force = (1 - dist / rR) * rS;
                    const angle = Math.atan2(dy, dx);
                    repelX = Math.cos(angle) * force;
                    repelY = Math.sin(angle) * force;
                }
            }

            const targetX = floatX + repelX;
            const targetY = floatY + repelY;
            blob.curX += (targetX - blob.curX) * LERP;
            blob.curY += (targetY - blob.curY) * LERP;
            blob.el.style.transform = `translate(calc(-50% + ${blob.curX.toFixed(2)}px), calc(-50% + ${blob.curY.toFixed(2)}px))`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function initHeroGlow() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.className = 'hero-glow';
    hero.appendChild(glow);

    hero.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
    hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top  = (e.clientY - rect.top)  + 'px';
    });
}

function initCardReveal() {
    const cards = document.querySelectorAll('.work-item');
    if (!cards.length) return;

    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    cards.forEach((card, i) => {
        const revealDelay = i * 0.08;
        card.dataset.tiltDelay = (revealDelay + 0.7) * 1000; // reveal finishes + buffer
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        card.style.transition = `opacity 0.6s ease ${revealDelay}s, transform 0.6s ease ${revealDelay}s`;
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);

                // After reveal animation completes, hand off to tilt
                if (!isTouchDevice) {
                    setTimeout(() => {
                        entry.target.style.cssText = '';
                        enableTilt(entry.target);
                    }, parseFloat(entry.target.dataset.tiltDelay));
                }
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

function enableTilt(card) {
    const isFeatured = card.classList.contains('work-item-featured');
    const maxAngle   = isFeatured ? 6 : 10;
    card.classList.add('tilt-enabled');

    // Shine overlay
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;

        const rotY =  (x - 0.5) * maxAngle * 2;
        const rotX = -(y - 0.5) * maxAngle * 2;

        card.style.transition = 'none';
        card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

        shine.style.opacity    = '1';
        shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        shine.style.opacity   = '0';
    });
}

function initAboutFade() {
    const items = document.querySelectorAll('.about-fade');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(el => observer.observe(el));
}



function initBackToTop() {
    // Create button
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
        document.body.appendChild(btn);
    }
    
    // Show/hide on scroll
    function toggleVisibility() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check
    
    // Scroll to top on click
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


