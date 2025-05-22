const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 10; // Ukuran setiap segmen ular dan makanan
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
let food = {};
let dx = 1; // Kecepatan X (awal bergerak ke kanan)
let dy = 0; // Kecepatan Y
let score = 0;
let gameInterval;
const gameSpeed = 150; // Milliseconds per frame (semakin kecil, semakin cepat)

// Fungsi untuk menggambar lingkaran (segmen ular dan makanan)
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk membuat makanan baru
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// Fungsi untuk menggambar semua objek game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

    // Gambar makanan
    drawCircle(food.x, food.y, gridSize / 2, 'red');

    // Gambar ular
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const radius = gridSize / 2; // Radius untuk segmen ular
        const color = (i === 0) ? 'lime' : 'green'; // Kepala ular berbeda warna
        drawCircle(segment.x, segment.y, radius, color);

        // Tambahkan garis untuk menghubungkan segmen, menciptakan efek "ular"
        if (i > 0) {
            const prevSegment = snake[i - 1];
            ctx.beginPath();
            ctx.moveTo(prevSegment.x * gridSize + gridSize / 2, prevSegment.y * gridSize + gridSize / 2);
            ctx.lineTo(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = gridSize / 2; // Tebal garis mengikuti ukuran segmen
            ctx.stroke();
            ctx.closePath();
        }
    }
}

// Fungsi untuk mengupdate posisi ular dan logika game
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Logika dinding tembus (teleportasi)
    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;

    snake.unshift(head); // Tambahkan kepala baru

    // Cek apakah ular makan makanan
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop(); // Hapus ekor jika tidak makan
    }

    // Cek tabrakan dengan diri sendiri
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameInterval);
            alert(`Game Over! Skor Anda: ${score}`);
            document.location.reload(); // Muat ulang halaman untuk memulai ulang
        }
    }

    draw(); // Gambar ulang
}

// Event listener untuk kontrol panah
document.addEventListener('keydown', e => {
    const keyPressed = e.key;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingLeft = dx === -1;
    const goingRight = dx === 1;

    if (keyPressed === 'ArrowLeft' && !goingRight) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === 'ArrowUp' && !goingDown) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === 'ArrowRight' && !goingLeft) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === 'ArrowDown' && !goingUp) {
        dx = 0;
        dy = 1;
    }
});

// Inisialisasi game
generateFood();
gameInterval = setInterval(update, gameSpeed);
draw(); // Gambar inisial
