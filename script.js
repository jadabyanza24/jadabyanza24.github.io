/* ================= WINDOW MANAGEMENT ================= */
let highestZIndex = 100;

function bringToFront(element) {
    highestZIndex += 1;
    element.style.zIndex = highestZIndex;
}

function makeDraggable(windowEl) {
    const header = windowEl.querySelector('.window-header');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('control')) return; 
        isDragging = true;
        bringToFront(windowEl);
        startX = e.clientX;
        startY = e.clientY;
        const rect = windowEl.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        windowEl.style.transition = 'none'; 
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        windowEl.style.left = `${initialLeft + dx}px`;
        windowEl.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        windowEl.style.transition = 'transform 0.2s, opacity 0.2s';
    });
}

document.querySelectorAll('.window').forEach(win => {
    makeDraggable(win);
    win.addEventListener('mousedown', () => bringToFront(win));
});

function openApp(appId) {
    const app = document.getElementById(appId);
    app.classList.remove('hidden');
    bringToFront(app);
    document.getElementById(`dot-${appId}`).classList.add('active');
    if(appId === 'terminal-app') setTimeout(() => document.getElementById('terminal-input').focus(), 100);
}

function closeApp(appId) {
    document.getElementById(appId).classList.add('hidden');
    document.getElementById(`dot-${appId}`).classList.remove('active');
}

function minimizeApp(appId) { document.getElementById(appId).classList.add('hidden'); }
function maximizeApp(appId) { document.getElementById(appId).classList.toggle('maximized'); }

/* ================= EXPLORER CONTENT ================= */
const folderData = {
    'AI_Research': `
        <h2 style="margin-bottom:10px; color:#5C4033; font-family:'Inter', sans-serif;"><i class="ph-bold ph-brain" style="color:#FFD3B6; margin-right:8px;"></i> AI Research Lab</h2>
        <div class="file-card">
            <strong style="color:#5C4033; font-family:'Inter', sans-serif;">ClarityAI (PKM-KC)</strong><br>
            <small style="color:#8D6E63; font-family:'Inter', sans-serif;">Medical Decision Support System for real-time Acne Vulgaris triage.</small>
        </div>
        <div class="file-card">
            <strong style="color:#5C4033; font-family:'Inter', sans-serif;">LostFindings</strong><br>
            <small style="color:#8D6E63; font-family:'Inter', sans-serif;">Lost & Found platform with AI characteristic detection.</small>
        </div>`,
    'Figma_Design_Systems': `
        <h2 style="margin-bottom:10px; color:#5C4033; font-family:'Inter', sans-serif;"><i class="ph-bold ph-palette" style="color:#FF8B94; margin-right:8px;"></i> Design Archive</h2>
        <div class="file-card"><strong style="color:#5C4033; font-family:'Inter', sans-serif;">Dozzie UI</strong><br><small style="color:#8D6E63; font-family:'Inter', sans-serif;">Task management with AI scheduling.</small></div>
        <div class="file-card"><strong style="color:#5C4033; font-family:'Inter', sans-serif;">Toddler Superapps</strong><br><small style="color:#8D6E63; font-family:'Inter', sans-serif;">Pediatric telehealth marketplace.</small></div>`
};

function openFolder(name, iconClass) {
    openApp('explorer-app');
    
    let titleIconColor = '#FFD3B6';
    if(name === 'Figma_Design_Systems') titleIconColor = '#FF8B94';
    
    document.getElementById('explorer-title').innerHTML = `<i class="ph-bold ${iconClass}" style="color: ${titleIconColor}; font-size: 1.1rem; margin-right: 5px;"></i> ${name.replace(/_/g, ' ')}`;
    document.getElementById('explorer-content').innerHTML = folderData[name] || '<p>Empty folder.</p>';
}

/* ================= TERMINAL ENGINE ================= */
const output = document.getElementById('terminal-output');
const input = document.getElementById('terminal-input');

document.getElementById('terminal-app').addEventListener('click', () => {
    input.focus();
});

const welcomeMsg = `<div style="margin-bottom:1rem;"><span class="highlight">Jad_AI OS v2.0 (Pastel Edition) Initialized...</span><br>Welcome, visitor. Type <span style="color:#FF8B94; font-weight:700;">/help</span> to start.</div>`;
output.innerHTML = welcomeMsg;

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (!cmd) return;
        
        const row = document.createElement('div');
        row.innerHTML = `<span class="prompt">visitor@jados:~$</span> ${input.value}`;
        row.className = 'cmd-echo';
        output.appendChild(row);

        const response = document.createElement('div');
        response.style.marginBottom = '1rem';

        if(cmd === '/help') response.innerHTML = `Commands: <span class="highlight">/about, /projects, /gui, /clear, /cv</span>`;
        else if(cmd === '/about') response.innerHTML = `I am Jad, a CS student @ BINUS specializing in AI & UI/UX.`;
        else if(cmd === '/projects' || cmd === '/gui') { 
            response.innerHTML = `Opening Explorer...`; 
            setTimeout(() => openFolder('AI_Research', 'ph-brain'), 500); 
        }
        else if(cmd === '/cv') {
            response.innerHTML = `Opening CV...`;
            setTimeout(() => window.open('https://drive.google.com/open?id=1X6vljWe0EK5FPqpOSLqDHW3zJ2YD1hu4', '_blank'), 500);
        }
        else if(cmd === '/clear') { output.innerHTML = ''; response.innerHTML = ''; }
        else response.innerHTML = `<span style="color:#FF7B72; font-weight:600;">Unknown command. Type /help</span>`;

        output.appendChild(response);
        input.value = '';
        output.scrollTop = output.scrollHeight;
    }
});

/* ================= CLOCK ================= */
function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true };
    document.getElementById('clock').innerText = now.toLocaleString('en-US', options);
}
setInterval(updateClock, 1000);
updateClock();

/* ================= CAT POKE (INTERACTIVE) ================= */
function pokeCat() {
    const speech = document.getElementById('cat-speech');
    speech.classList.add('show');
    
    setTimeout(() => {
        speech.classList.remove('show');
    }, 2000);
}