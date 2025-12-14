tailwind.config = {
    theme: {
        extend: {
            colors: {
                "brand-dark": "#0B1120",
                "brand-navy": "#1e1b36",
                "brand-accent": "#2dd4bf",
                "brand-blue": "#2563eb",
            },
            fontFamily: {
                serif: ["Cinzel", "serif"],
                sans: ["Manrope", "sans-serif"],
            },
            animation: {
                slideIn: "slideIn 1s ease-out forwards",
                slideUp: "slideUp 0.8s ease-out forwards",
            },
            keyframes: {
                slideIn: {
                    from: { transform: "translateX(50px)", opacity: "0" },
                    to: { transform: "translateX(0)", opacity: "1" },
                },
                slideUp: {
                    from: { transform: "translateY(50px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
};

const canvas = document.getElementById("cityCanvas");
const ctx = canvas.getContext("2d");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

let width, height;
let buildings = [];
let mouseX = 0;
let mouseY = 0;

const colors = {
    bg: "#0B1120",
    houseBodyStart: "#1e1b36",
    houseBodyEnd: "#0f0e17",
    stroke: "#2563eb",
    eyeWhite: "#FFFFFF",
    pupil: "#2dd4bf",
};

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    generateCity();
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
    setTimeout(() => {
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";
    }, 50);
});

// Touch support for interaction on mobile
window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
});

class House {
    constructor(x, w) {
        this.x = x;
        this.w = w;
        this.bodyH = Math.random() * (height * 0.4) + height * 0.2;
        this.roofH = this.w * 0.6;
        this.totalH = this.bodyH + this.roofH;
        this.currentH = 0;
        this.eyeSize = this.w * 0.12;
        this.eyeSpacing = this.w * 0.25;
        this.eyeYOffsetFromRoof = 30 + Math.random() * 20;
        this.growthSpeed = 0.05 + Math.random() * 0.05;
    }

    draw() {
        if (this.currentH < this.totalH) {
            this.currentH += (this.totalH - this.currentH) * this.growthSpeed;
        }
        const centerX = this.x + this.w / 2;
        const dx = mouseX - centerX;

        // Kurangi skew sensitivity di mobile biar ga pusing
        let skewDivisor = width < 768 ? 2000 : 1500;
        let skew = dx / skewDivisor;
        if (skew > 0.2) skew = 0.2;
        if (skew < -0.2) skew = -0.2;

        ctx.save();
        ctx.translate(this.x + this.w / 2, height);
        ctx.transform(1, 0, skew, 1, 0, 0);
        ctx.translate(-(this.x + this.w / 2), -height);

        const drawBaseY = height;
        const progress = this.currentH / this.totalH;
        const drawBodyH = this.bodyH * progress;
        const drawRoofH = this.roofH * progress;

        const bodyTopY = drawBaseY - drawBodyH;
        const roofTopY = bodyTopY - drawRoofH;

        const grd = ctx.createLinearGradient(
            this.x,
            bodyTopY,
            this.x,
            height
        );
        grd.addColorStop(0, colors.houseBodyStart);
        grd.addColorStop(1, colors.houseBodyEnd);

        ctx.fillStyle = grd;
        ctx.fillRect(this.x, bodyTopY, this.w, drawBodyH);
        ctx.strokeStyle = "rgba(37, 99, 235, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, bodyTopY, this.w, drawBodyH);

        ctx.beginPath();
        ctx.moveTo(this.x, bodyTopY);
        ctx.lineTo(this.x + this.w / 2, roofTopY);
        ctx.lineTo(this.x + this.w, bodyTopY);
        ctx.closePath();
        ctx.fillStyle = "#16142a";
        ctx.fill();
        ctx.stroke();

        if (progress > 0.8) {
            const eyeY = bodyTopY + this.eyeYOffsetFromRoof;
            const centerX = this.x + this.w / 2;
            this.drawEye(centerX - this.eyeSpacing, eyeY);
            this.drawEye(centerX + this.eyeSpacing, eyeY);
        }
        ctx.restore();
    }

    drawEye(x, y) {
        ctx.beginPath();
        ctx.fillStyle = colors.eyeWhite;
        ctx.ellipse(
            x,
            y,
            this.eyeSize,
            this.eyeSize * 1.1,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        const angle = Math.atan2(mouseY - y, mouseX - x);
        const maxMove = this.eyeSize * 0.4;
        const pupilX = x + Math.cos(angle) * maxMove;
        const pupilY = y + Math.sin(angle) * maxMove;

        ctx.beginPath();
        ctx.fillStyle = colors.pupil;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.pupil;
        ctx.arc(pupilX, pupilY, this.eyeSize * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function generateCity() {
    buildings = [];
    let currentX = -50;

    // LOGIC RESPONSIVE:
    // Mobile (<768px): Kota menuhin layar (limitX = width)
    // Desktop (>=768px): Kota cuma 55% layar (limitX = width * 0.55)
    const isMobile = width < 768;
    const limitX = isMobile ? width + 50 : width * 0.55;

    while (currentX < limitX) {
        const w = 70 + Math.random() * 60;
        buildings.push(new House(currentX, w));
        currentX += w - 20;
    }
}

function animate() {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);
    buildings.forEach((b) => b.draw());
    requestAnimationFrame(animate);
}
resize();
animate();

// --- UI Logic ---
const infoView = document.getElementById("infoView");
const aiView = document.getElementById("aiView");
const aiToggleBtn = document.getElementById("aiToggleBtn");
let isAIMode = false;

function toggleAIMode() {
    isAIMode = !isAIMode;
    const isMobile = window.innerWidth < 768;
    const mobileText = isMobile ? "AI" : "Konsultasi AI";
    const closeText = isMobile ? "Tutup" : "Tutup AI";

    if (isAIMode) {
        infoView.classList.remove("opacity-100", "translate-x-0");
        infoView.classList.add(
            "opacity-0",
            "-translate-x-10",
            "pointer-events-none"
        );

        aiView.classList.remove(
            "opacity-0",
            "translate-x-10",
            "pointer-events-none"
        );
        aiView.classList.add("opacity-100", "translate-x-0");

        aiToggleBtn.innerHTML = `<i class="fa-solid fa-xmark mr-2"></i> <span class="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wide">${closeText}</span>`;
        aiToggleBtn.classList.add("bg-brand-accent", "text-brand-dark");
    } else {
        aiView.classList.remove("opacity-100", "translate-x-0");
        aiView.classList.add(
            "opacity-0",
            "translate-x-10",
            "pointer-events-none"
        );

        infoView.classList.remove(
            "opacity-0",
            "-translate-x-10",
            "pointer-events-none"
        );
        infoView.classList.add("opacity-100", "translate-x-0");

        aiToggleBtn.innerHTML = `<span class="text-lg md:text-xl">✨</span> <span class="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wide group-hover:text-brand-dark hidden md:inline">Konsultasi AI</span> <span class="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wide group-hover:text-brand-dark md:hidden">AI</span>`;
        aiToggleBtn.classList.remove("bg-brand-accent", "text-brand-dark");
    }
}

// --- Gemini AI Logic ---
async function generateVision() {
    const promptInput = document.getElementById("userPrompt");
    const responseArea = document.getElementById("aiResponseArea");
    const generateBtn = document.getElementById("generateBtn");
    const systemStatus = document.getElementById("systemStatus");
    const userText = promptInput.value.trim();

    if (!userText) return;

    // UI Loading State
    generateBtn.disabled = true;
    generateBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> GENERATING...';
    systemStatus.innerText = "PROCESSING";
    systemStatus.className = "text-brand-accent animate-pulse";

    responseArea.classList.remove("hidden");
    responseArea.innerHTML =
        '<span class="typing-cursor">AI sedang merancang konsep...</span>';

    try {
        // Check if GoogleGenerativeAI is available
        if (!window.GoogleGenerativeAI) {
            throw new Error(
                "Module AI belum siap. Tunggu sebentar atau refresh halaman."
            );
        }

        // Initialize API
        const apiKey = ""; // Runtime environment provides this
        const genAI = new window.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-preview-09-2025",
        });

        const systemPrompt = `
                    Kamu adalah 'Rumah Andalan Visionary Architect', AI konsultan arsitektur yang canggih, puitis, dan futuristik. 
                    Tugasmu adalah membaca deskripsi gaya hidup pengguna, lalu memberikan konsep hunian yang sangat personal.
                    
                    Panduan Respon:
                    1. Gunakan Bahasa Indonesia yang elegan, agak puitis tapi tetap profesional (seperti arsitek kelas dunia).
                    2. Usulkan nama konsep rumah (contoh: "The Sanctuary of Silence").
                    3. Jelaskan 3 fitur utama rumah tersebut yang nyambung sama request user.
                    4. Akhiri dengan kalimat: "Rumah Andalan siap mewujudkan visi ini segera."
                    5. Format output menggunakan HTML tags sederhana (<b>, <br>, <i>) untuk styling.
                `;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: systemPrompt + "\n\nUser Request: " + userText },
                    ],
                },
            ],
        });

        const response = await result.response;
        const text = response.text();

        // Typewriter Effect
        responseArea.innerHTML = "";
        let i = 0;
        const speed = 10; // Faster typing for mobile feel

        function typeWriter() {
            if (i < text.length) {
                if (text.charAt(i) === "<") {
                    let tag = "";
                    while (text.charAt(i) !== ">" && i < text.length) {
                        tag += text.charAt(i);
                        i++;
                    }
                    tag += ">";
                    responseArea.innerHTML += tag;
                    i++;
                } else {
                    responseArea.innerHTML += text.charAt(i);
                    i++;
                }

                responseArea.scrollTop = responseArea.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                generateBtn.disabled = false;
                generateBtn.innerHTML =
                    '<span>GENERATE VISION</span> <i class="fa-solid fa-wand-magic-sparkles"></i>';
                systemStatus.innerText = "COMPLETED";
                systemStatus.className = "text-green-500";
            }
        }
        typeWriter();
    } catch (error) {
        console.error("Gemini Error:", error);
        let errorMsg = "Gagal terhubung ke AI.";
        if (error.message.includes("API key")) {
            errorMsg = "API Key Error. Coba refresh.";
        } else if (error.message.includes("Module")) {
            errorMsg = error.message;
        }

        responseArea.innerHTML = `<span class="text-red-400">Error: ${errorMsg}</span>`;
        generateBtn.disabled = false;
        generateBtn.innerHTML =
            '<span>GENERATE VISION</span> <i class="fa-solid fa-wand-magic-sparkles"></i>';
        systemStatus.innerText = "ERROR";
        systemStatus.className = "text-red-500";
    }
}