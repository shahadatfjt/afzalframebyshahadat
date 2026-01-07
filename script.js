const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const zoom = document.getElementById("zoom");
const downloadBtn = document.getElementById("download");

// ✅ FIXED EXPORT SIZE
const CANVAS_SIZE = 1080;

// real canvas resolution (DOWNLOAD)
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// display size (MOBILE VIEW)
canvas.style.width = "360px";
canvas.style.height = "360px";

// Frame
const frame = new Image();
frame.src = "frame.png";

// User image
const userImage = new Image();
let imgX = CANVAS_SIZE / 2;
let imgY = CANVAS_SIZE / 2;
let imgW = 0;
let imgH = 0;
let scale = 1;

// Draw
function draw() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (userImage.src) {
        const drawW = imgW * scale;
        const drawH = imgH * scale;

        ctx.drawImage(
            userImage,
            imgX - drawW / 2,
            imgY - drawH / 2,
            drawW,
            drawH
        );
    }

    ctx.drawImage(frame, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

// Show frame on load
frame.onload = draw;

// Upload
upload.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        userImage.src = reader.result;
        userImage.onload = () => {

            const ratio = Math.min(
                CANVAS_SIZE / userImage.width,
                CANVAS_SIZE / userImage.height
            );

            imgW = userImage.width * ratio;
            imgH = userImage.height * ratio;
            imgX = CANVAS_SIZE / 2;
            imgY = CANVAS_SIZE / 2;

            draw();
        };
    };
    reader.readAsDataURL(file);
});

// Zoom
zoom.addEventListener("input", () => {
    scale = zoom.value;
    draw();
});

// Drag (mouse)
let isDragging = false;
let startX, startY;

canvas.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.offsetX - imgX;
    startY = e.offsetY - imgY;
});

canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;
    imgX = e.offsetX - startX;
    imgY = e.offsetY - startY;
    draw();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

// Touch
canvas.addEventListener("touchstart", e => {
    isDragging = true;
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    startX = t.clientX - r.left - imgX;
    startY = t.clientY - r.top - imgY;
});

canvas.addEventListener("touchmove", e => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    imgX = t.clientX - r.left - startX;
    imgY = t.clientY - r.top - startY;
    draw();
});

canvas.addEventListener("touchend", () => isDragging = false);

// Download (ALWAYS 1080×1080)
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "framed-photo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
