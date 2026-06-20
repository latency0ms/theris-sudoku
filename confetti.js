/**
 * confetti.js - Lightweight Vanilla JS Confetti Effect
 */

class Confetti {
    static shoot() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff4d4d', '#4dabff', '#ffeb3b', '#4caf50', '#e91e63', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: width / 2,
                y: height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.8) * 20,
                size: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function update() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // Gravity
                p.opacity -= 0.01;
                p.rotation += p.rotationSpeed;

                if (p.opacity <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(update);
            } else {
                document.body.removeChild(canvas);
            }
        }

        update();
    }
}

window.Confetti = Confetti;
