// ── FLAMES Logic & UI ──

const FLAMES_DATA = {
    F: { emoji: '👫', word: 'Friends',  meaning: 'You share a warm, genuine friendship. Perfect companions!' },
    L: { emoji: '💕', word: 'Love',     meaning: 'A romantic connection — the sparks are real between you two.' },
    A: { emoji: '🥰', word: 'Affection',meaning: 'Deep care and tenderness — you genuinely adore each other.' },
    M: { emoji: '💍', word: 'Marriage', meaning: 'Soulmates alert! According to FLAMES, you two are meant to be together for the long haul.' },
    E: { emoji: '😤', word: 'Enemies',  meaning: 'There might be some friction here — but remember, even rivals have an interesting dynamic.' },
    S: { emoji: '👯', word: 'Siblings', meaning: 'You\'re like siblings — you might bicker sometimes, but deep down there\'s a genuine bond.' }
};

let currentTicket = null;
let skipAnim = false;

// Initialize audio bridge on load + pre-warm fonts so download stays in user-gesture
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const playIcon = document.getElementById('music-icon-play');
    const pauseIcon = document.getElementById('music-icon-pause');
    const toggleBtn = document.getElementById('music-toggle');

    if (window.AudioBridge && bgMusic) {
        window.AudioBridge.init(bgMusic, 'music-icon-play', 'music-icon-pause');
        toggleBtn.addEventListener('click', () => {
            window.AudioBridge.toggle(bgMusic, 'music-icon-play', 'music-icon-pause');
        });
    }

    // Pre-warm fonts eagerly so buildTicketCanvas needs no await later
    ensureFonts();
});

function runFlames(name1, name2) {
    const a = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
    const b = name2.toLowerCase().replace(/[^a-z]/g, '').split('');

    const usedA = new Array(a.length).fill(false);
    const usedB = new Array(b.length).fill(false);
    const strikePairs = [];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (!usedA[i] && !usedB[j] && a[i] === b[j]) {
                usedA[i] = true;
                usedB[j] = true;
                strikePairs.push({ i, j, letter: a[i] });
                break;
            }
        }
    }

    const count = usedA.filter(u => !u).length + usedB.filter(u => !u).length;

    let indices = [0, 1, 2, 3, 4, 5];
    const eliminated = [];
    let start = 0;

    while (indices.length > 1) {
        const pos = (start + count - 1) % indices.length;
        eliminated.push(indices[pos]);
        indices.splice(pos, 1);
        start = pos % indices.length;
    }

    return { a, b, count, strikePairs, eliminated, winner: ['F','L','A','M','E','S'][indices[0]] };
}

function renderNameRow(rowEl, letters) {
    rowEl.innerHTML = '';
    letters.forEach((ch, i) => {
        const span = document.createElement('div');
        span.className = 'strike-letter';
        span.dataset.idx = i;
        span.textContent = ch.toUpperCase();
        rowEl.appendChild(span);
    });
}

function wait(ms) {
    return new Promise(r => {
        if (skipAnim) return r();
        const start = performance.now();
        const check = setInterval(() => {
            if (skipAnim || (performance.now() - start >= ms)) {
                clearInterval(check);
                r();
            }
        }, 16);
    });
}

async function animateStrikes(rowA, rowB, pairs, statusEl) {
    if (pairs.length === 0) {
        statusEl.textContent = 'No matching letters — every letter counts!';
        await wait(700);
        return;
    }
    for (const { i, j, letter } of pairs) {
        const lA = rowA.querySelector(`[data-idx="${i}"]`);
        const lB = rowB.querySelector(`[data-idx="${j}"]`);
        statusEl.textContent = `Cancelling matching “${letter.toUpperCase()}”…`;
        lA.classList.add('matching');
        lB.classList.add('matching');
        await wait(280);
        lA.classList.remove('matching');
        lB.classList.remove('matching');
        lA.classList.add('struck');
        lB.classList.add('struck');
        await wait(330);
    }
    statusEl.textContent = 'All matching pairs cancelled ✓';
    await wait(500);
}

async function animateFlamesElimination(count, statusEl) {
    const letters = ['F', 'L', 'A', 'M', 'E', 'S'];
    let alive = letters.map(l => document.querySelector(`.flame-box[data-l="${l}"]`));
    let start = 0;
    while (alive.length > 1) {
        let idx = start;
        for (let s = 1; s <= count; s++) {
            idx = (start + s - 1) % alive.length;
            const box = alive[idx];
            box.classList.add('counting');
            if (statusEl) statusEl.textContent = `Counting ${s} of ${count}…`;
            await wait(Math.max(95, 185 - s * 6));
            if (s < count) box.classList.remove('counting');
        }
        const landed = alive[idx];
        await wait(300);
        landed.classList.remove('counting');
        landed.classList.add('eliminated');
        if (statusEl) statusEl.textContent = `${landed.dataset.l} is out! ${alive.length - 1} left…`;
        alive.splice(idx, 1);
        start = idx % alive.length;
        await wait(alive.length === 1 ? 250 : 480);
    }
    statusEl && (statusEl.textContent = '');
    return alive[0].dataset.l;
}

function hashName(str, mult) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * mult + str.charCodeAt(i)) >>> 0;
    return h;
}

function compatScore(n1, n2, letter) {
    const s = (n1 + '&' + n2).toLowerCase().replace(/[^a-z]/g, '');
    const h = hashName(s, 31);
    const ranges = { M: [88, 99], L: [80, 96], A: [72, 90], F: [58, 80], S: [48, 70], E: [20, 46] };
    const [lo, hi] = ranges[letter] || [50, 80];
    return lo + (h % (hi - lo + 1));
}

function makeTicketId(n1, n2, letter) {
    const s = (n1 + n2).toLowerCase().replace(/[^a-z]/g, '');
    return 'FL-' + letter + String(hashName(s, 131) % 10000).toString().padStart(4, '0');
}

function launchHearts() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.className = 'heart-burst';
    const set = ['💖', '💕', '💘', '💗', '🔥', '✨'];
    for (let i = 0; i < 16; i++) {
        const s = document.createElement('span');
        s.textContent = set[i % set.length];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.setProperty('--r', (Math.random() * 120 - 60) + 'deg');
        s.style.animationDuration = (2.4 + Math.random() * 1.8) + 's';
        s.style.animationDelay = (Math.random() * 0.5) + 's';
        s.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
        layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4800);
}

function showResult(letter, n1, n2) {
    const data = FLAMES_DATA[letter];
    document.querySelectorAll('.flame-box').forEach(b => {
        if (b.dataset.l === letter) b.classList.add('winner');
    });
    document.getElementById('countDisplay').textContent = '';

    const score = compatScore(n1, n2, letter);
    const id = makeTicketId(n1, n2, letter);
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    currentTicket = { n1, n2, letter, word: data.word, emoji: data.emoji, meaning: data.meaning, score, id, date };

    document.getElementById('tkNames').textContent = `${n1}  ❤  ${n2}`;
    document.getElementById('tkEmoji').textContent = data.emoji;
    document.getElementById('tkWord').textContent = `${data.word}!`;
    document.getElementById('tkMeaning').textContent = data.meaning;
    document.getElementById('tkScore').textContent = `${score}%`;
    document.getElementById('tkId').textContent = id;
    document.getElementById('tkDate').textContent = date;

    const container = document.getElementById('flamesContainer');
    container.classList.add('has-result');
    
    const ticketCol = document.getElementById('ticketColumn');
    ticketCol.style.display = 'block';

    const fill = document.getElementById('tkFill');
    fill.style.width = '0%';
    requestAnimationFrame(() => { 
        setTimeout(() => {
            fill.style.width = `${score}%`;
        }, 100);
    });
    
    setTimeout(() => {
        ticketCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    launchHearts();

    const btn = document.getElementById('calcBtn');
    btn.disabled = false;
    btn.textContent = 'Try New Names';
}

async function calculateFlames() {
    const n1 = document.getElementById('name1').value.trim();
    const n2 = document.getElementById('name2').value.trim();

    if (!n1 || !n2) {
        alert('Please enter both names!');
        return;
    }

    const cleanA = n1.replace(/[^a-zA-Z]/g, '');
    const cleanB = n2.replace(/[^a-zA-Z]/g, '');

    if (!cleanA || !cleanB) {
        alert('Names must contain at least one letter!');
        return;
    }

    // Reset UI
    document.getElementById('flamesContainer').classList.remove('has-result');
    document.getElementById('ticketColumn').style.display = 'none';
    document.querySelectorAll('.flame-box').forEach(b => b.classList.remove('eliminated', 'winner'));

    const btn = document.getElementById('calcBtn');
    btn.disabled = true;

    skipAnim = false;
    const { a, b, count, strikePairs, eliminated, winner } = runFlames(n1, n2);

    // Render and animate name letter strikes
    const stage = document.getElementById('strikeStage');
    const rowA = document.getElementById('strikeName1');
    const rowB = document.getElementById('strikeName2');
    const status = document.getElementById('strikeStatus');
    document.getElementById('strikeName1Label').textContent = n1;
    document.getElementById('strikeName2Label').textContent = n2;
    renderNameRow(rowA, a);
    renderNameRow(rowB, b);
    status.textContent = 'Crossing out matching letters…';
    stage.classList.add('visible');
    stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    await animateStrikes(rowA, rowB, strikePairs, status);

    const countEl = document.getElementById('countDisplay');
    countEl.textContent = `${count} letters left — counting through F·L·A·M·E·S…`;
    await wait(650);

    const animatedWinner = await animateFlamesElimination(count, countEl);

    countEl.textContent = 'And the result is…';
    await wait(550);
    showResult(animatedWinner, n1, n2);
}

function resetCalculator() {
    document.getElementById('name1').value = '';
    document.getElementById('name2').value = '';
    document.getElementById('flamesContainer').classList.remove('has-result');
    document.getElementById('ticketColumn').style.display = 'none';
    document.getElementById('countDisplay').textContent = '';
    const stage = document.getElementById('strikeStage');
    stage.classList.remove('visible');
    document.getElementById('strikeName1').innerHTML = '';
    document.getElementById('strikeName2').innerHTML = '';
    document.getElementById('strikeStatus').textContent = '';
    document.querySelectorAll('.flame-box')
        .forEach(b => b.classList.remove('eliminated', 'winner'));
    const btn = document.getElementById('calcBtn');
    btn.innerHTML = 'Calculate <i data-lucide="calculator" style="width: 14px; height: 14px; color: #0a0a22;"></i>';
    if (window.lucide) lucide.createIcons();
    currentTicket = null;
    document.getElementById('name1').focus();
}

// ── Ticket Export (Canvas) ──
async function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return;
    try {
        await Promise.all([
            document.fonts.load("700 80px 'Playfair Display'"),
            document.fonts.load("700 80px 'Caveat'"),
            document.fonts.load("600 30px 'DM Sans'"),
            document.fonts.load("700 30px 'DM Sans'")
        ]);
        await document.fonts.ready;
    } catch (_) {}
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function wrapCenter(ctx, text, cx, y, maxW, lh) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
        else line = test;
    }
    if (line) lines.push(line);
    lines.forEach((ln, i) => ctx.fillText(ln, cx, y + i * lh));
    return lines.length;
}

function buildTicketCanvas() {
    const t = currentTicket;
    if (!t) return null;
    
    const W = 1080, H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const cx = W / 2;

    // background
    ctx.fillStyle = '#393452';
    ctx.fillRect(0, 0, W, H);

    // ticket card
    const m = 70, tw = W - 2 * m, th = H - 2 * m, x = m, y = m;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#2A2641';
    roundRect(ctx, x, y, tw, th, 40); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#E6C998'; ctx.lineWidth = 5; roundRect(ctx, x, y, tw, th, 40); ctx.stroke();
    ctx.strokeStyle = '#C9A96E'; ctx.lineWidth = 2; roundRect(ctx, x + 14, y + 14, tw - 28, th - 28, 28); ctx.stroke();

    // stamp
    ctx.save();
    ctx.translate(x + tw - 92, y + 92);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#E6C998'; ctx.lineWidth = 3.5;
    roundRect(ctx, -78, -40, 156, 80, 10); ctx.stroke();
    ctx.fillStyle = '#E6C998'; ctx.textAlign = 'center';
    ctx.font = "700 26px 'Playfair Display', serif";
    ctx.fillText('★ FLAMES ★', 0, -4);
    ctx.font = "700 22px 'Playfair Display', serif";
    ctx.fillText('OFFICIAL', 0, 26);
    ctx.restore();

    ctx.textAlign = 'center';
    
    // kicker
    ctx.font = "600 24px 'DM Sans', sans-serif";
    ctx.fillStyle = '#C9A96E';
    ctx.fillText('♡ ADMIT TWO · NO REFUNDS ON FEELINGS ♡', cx, y + 80);

    // title
    ctx.font = "700 52px 'Playfair Display', serif";
    ctx.fillStyle = '#E6C998';
    ctx.fillText('FLAMES Love Ticket', cx, y + 160);

    // names
    ctx.font = "700 110px 'Caveat', cursive";
    ctx.fillStyle = '#FFFFFF';
    wrapCenter(ctx, `${t.n1}  ❤  ${t.n2}`, cx, y + 320, tw - 120, 110);

    // result
    ctx.font = "700 80px 'Playfair Display', serif";
    ctx.fillStyle = '#E6C998';
    ctx.fillText(`${t.emoji} ${t.word}!`, cx, y + 540);

    // compatibility
    ctx.font = "700 26px 'DM Sans', sans-serif";
    ctx.fillStyle = '#C9A96E';
    ctx.textAlign = 'left';
    ctx.fillText('COMPATIBILITY', cx - 240, y + 680);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#E6C998';
    ctx.font = "700 34px 'DM Sans', sans-serif";
    ctx.fillText(`${t.score}%`, cx + 240, y + 682);

    // track
    ctx.fillStyle = '#1c192d';
    ctx.strokeStyle = '#464065';
    ctx.lineWidth = 2;
    roundRect(ctx, cx - 240, y + 705, 480, 24, 12);
    ctx.fill(); ctx.stroke();

    // fill
    const grd = ctx.createLinearGradient(cx - 240, 0, cx - 240 + 480, 0);
    grd.addColorStop(0, '#C9A96E');
    grd.addColorStop(1, '#E6C998');
    ctx.fillStyle = grd;
    roundRect(ctx, cx - 240, y + 705, 480 * (t.score / 100), 24, 12);
    ctx.fill();

    // meaning
    ctx.font = "italic 400 32px 'Playfair Display', serif";
    ctx.fillStyle = '#E0D8C8';
    ctx.textAlign = 'center';
    wrapCenter(ctx, t.meaning, cx, y + 820, tw - 160, 42);

    // perforation Y-coordinate
    const py = y + 1040;

    // barcode
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#C9A96E'; // gold
    let bx = x + 50;
    const bEndX = x + tw - 50;
    while (bx < bEndX) {
        if (bx + 4 <= bEndX) ctx.fillRect(bx, py - 110, 4, 70);
        if (bx + 13 <= bEndX) ctx.fillRect(bx + 10, py - 110, 3, 70);
        bx += 22;
    }
    ctx.restore();

    // perforation
    ctx.beginPath();
    ctx.setLineDash([15, 20]);
    ctx.moveTo(x + 25, py);
    ctx.lineTo(x + tw - 25, py);
    ctx.strokeStyle = '#464065';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // notches
    ctx.fillStyle = '#393452';
    ctx.beginPath();
    ctx.arc(x, py, 25, -Math.PI/2, Math.PI/2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + tw, py, 25, Math.PI/2, -Math.PI/2);
    ctx.fill();
    ctx.strokeStyle = '#E6C998';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, py, 25, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + tw, py, 25, Math.PI/2, -Math.PI/2);
    ctx.stroke();

    // stub
    ctx.font = "700 24px 'DM Sans', sans-serif";
    ctx.fillStyle = '#C9A96E';
    ctx.textAlign = 'left';
    ctx.fillText('TICKET NO', x + 70, py + 70);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText(t.id, x + 70, py + 110);

    ctx.font = "700 24px 'DM Sans', sans-serif";
    ctx.fillStyle = '#C9A96E';
    ctx.textAlign = 'center';
    ctx.fillText('ISSUED', cx, py + 70);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText(t.date, cx, py + 110);

    ctx.font = "700 24px 'DM Sans', sans-serif";
    ctx.fillStyle = '#C9A96E';
    ctx.textAlign = 'right';
    ctx.fillText('PLAY FREE AT', x + tw - 70, py + 70);
    ctx.fillStyle = '#E6C998';
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText('LADS SIMULATOR', x + tw - 70, py + 110);

    return cv;
}

function downloadTicket() {
    if (!currentTicket) return;
    const btn = document.getElementById('tkDownload');
    const oldText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        const cv = buildTicketCanvas();
        if (!cv) throw new Error('Canvas generation failed');
        
        const dataUrl = cv.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `FLAMES_${currentTicket.n1}_${currentTicket.n2}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        btn.textContent = 'Saved! ✓';
        setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 2000);
    } catch (e) {
        console.error(e);
        btn.textContent = 'Error!';
        setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 2000);
    }
}

async function shareTicket() {
    if (!currentTicket) return;
    const btn = document.getElementById('tkShare');
    const oldText = btn.textContent;
    
    if (navigator.share) {
        try {
            btn.textContent = 'Preparing...';
            const cv = await buildTicketCanvas();
            cv.toBlob(async (blob) => {
                const file = new File([blob], `FLAMES_Ticket.png`, { type: 'image/png' });
                try {
                    await navigator.share({
                        title: 'FLAMES Love Ticket',
                        text: `Check out our FLAMES compatibility! ❤️`,
                        files: [file]
                    });
                    btn.textContent = oldText;
                } catch (e) {
                    btn.textContent = oldText;
                }
            }, 'image/png');
        } catch (e) {
            btn.textContent = 'Screenshot to share!';
            setTimeout(() => { btn.textContent = oldText; }, 2000);
        }
    } else {
        btn.textContent = 'Screenshot to share!';
        setTimeout(() => { btn.textContent = oldText; }, 2000);
    }
}
