import { useEffect, useRef } from 'react';

type Shape = {
  x: number;
  y: number;
  size: number;
  type: 'circle' | 'star' | 'ribbon' | 'diamond' | 'sparkle' | 'ring';
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  alphaSpeed: number;
  r: number; g: number; b: number;
  twinkleOffset: number;
  layer: number;
};

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, points: number, rot: number) {
  const inner = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + rot - Math.PI / 2;
    const radius = i % 2 === 0 ? r : inner;
    i === 0
      ? ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle))
      : ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.55, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.55, 0);
  ctx.closePath();
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size * 0.25, size * 0.1, size * 0.35, size * 0.35, size * Math.cos(a), size * Math.sin(a));
    ctx.bezierCurveTo(size * 0.35, size * 0.35, size * 0.25, size * 0.1, 0, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* Royal jewel palette: gold, champagne, sapphire, amethyst, rose-gold, silver */
const JEWELS: [number, number, number][] = [
  [212, 175, 55],   // antique gold
  [255, 215, 120],  // champagne gold
  [245, 217, 138],  // pale gold
  [100, 130, 220],  // royal sapphire
  [140, 80, 210],   // amethyst
  [180, 140, 220],  // pale amethyst
  [210, 180, 255],  // lavender
  [200, 165, 90],   // bronze-gold
  [255, 255, 200],  // icy white-gold
];

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let shapes: Shape[] = [];
    let animId: number;
    let time = 0;
    const types: Shape['type'][] = ['circle', 'star', 'ribbon', 'diamond', 'sparkle', 'ring'];

    const makeShape = (overrideY?: number): Shape => {
      const [r, g, b] = JEWELS[Math.floor(Math.random() * JEWELS.length)];
      const layer = Math.floor(Math.random() * 3); // 0=far, 1=mid, 2=near
      const speed = 0.15 + layer * 0.25;
      return {
        x: Math.random() * canvas.width,
        y: overrideY !== undefined ? overrideY : Math.random() * canvas.height,
        size: (2 + Math.random() * 5) * (1 + layer * 0.5),
        type: types[Math.floor(Math.random() * types.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(speed + Math.random() * 0.4),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        alpha: Math.random() * 0.5 + 0.15,
        alphaSpeed: (0.003 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
        r, g, b,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer,
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      shapes = [];
      const count = Math.min(Math.floor(window.innerWidth / 10), 130);
      for (let i = 0; i < count; i++) shapes.push(makeShape());
    };

    /* ── Shooting stars ── */
    const shots: { x: number; y: number; len: number; speed: number; angle: number; life: number; maxLife: number; r: number; g: number; b: number }[] = [];

    const spawnShot = () => {
      if (shots.length < 4 && Math.random() < 0.007) {
        const [r, g, b] = [[212,175,55],[100,130,220],[140,80,210]][Math.floor(Math.random()*3)];
        shots.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.35,
          len: 80 + Math.random() * 140,
          speed: 6 + Math.random() * 7,
          angle: Math.PI / 5.5 + Math.random() * 0.35,
          life: 0,
          maxLife: 50 + Math.random() * 50,
          r, g, b,
        });
      }
    };

    const drawShots = () => {
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i];
        s.life++;
        const alpha = Math.sin((s.life / s.maxLife) * Math.PI) * 0.9;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const head = `rgba(${s.r},${s.g},${s.b},${alpha})`;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        grad.addColorStop(0, head);
        grad.addColorStop(0.3, `rgba(${s.r},${s.g},${s.b},${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 + s.layer * 0;
        ctx.stroke();

        /* Head glow */
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
        glow.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${alpha})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.restore();

        if (s.life >= s.maxLife) shots.splice(i, 1);
      }
    };

    /* ── Nebula blobs (slow, large, atmospheric) ── */
    const nebula = [
      { x: 0.25, y: 0.2, r: 300, r1: 80, g1: 30, b1: 150, speed: 0.0004 },
      { x: 0.75, y: 0.6, r: 250, r1: 20, g1: 10, b1: 100, speed: 0.0003 },
      { x: 0.5,  y: 0.85, r: 280, r1: 140, g1: 80, b1: 20, speed: 0.0005 },
    ];

    const drawNebula = () => {
      nebula.forEach((n) => {
        const cx = n.x * canvas.width + Math.sin(time * n.speed * 100) * 40;
        const cy = n.y * canvas.height + Math.cos(time * n.speed * 80) * 30;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
        grad.addColorStop(0, `rgba(${n.r1},${n.g1},${n.b1},0.06)`);
        grad.addColorStop(0.5, `rgba(${n.r1},${n.g1},${n.b1},0.03)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawShape = (s: Shape) => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.05 + s.twinkleOffset);
      const a = Math.max(0, Math.min(1, s.alpha * twinkle));
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;

      switch (s.type) {
        case 'circle': {
          /* Glowing orb */
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2);
          grad.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${a})`);
          grad.addColorStop(0.5, `rgba(${s.r},${s.g},${s.b},${a * 0.3})`);
          grad.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'star':
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          drawStar(ctx, s.x, s.y, s.size, 5, s.rotation);
          ctx.fill();
          break;
        case 'ribbon':
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          ctx.fillRect(-s.size * 0.22, -s.size, s.size * 0.44, s.size * 2);
          ctx.restore();
          break;
        case 'diamond':
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          drawDiamond(ctx, s.x, s.y, s.size, s.rotation);
          ctx.fill();
          break;
        case 'sparkle':
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          drawSparkle(ctx, s.x, s.y, s.size, s.rotation);
          break;
        case 'ring':
          ctx.strokeStyle = `rgb(${s.r},${s.g},${s.b})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.stroke();
          break;
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawNebula();
      spawnShot();
      drawShots();

      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.75 || s.alpha < 0.08) s.alphaSpeed *= -1;
        if (s.y < -20 || s.x < -30 || s.x > canvas.width + 30) {
          Object.assign(s, makeShape(canvas.height + 15));
        }
        drawShape(s);
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
