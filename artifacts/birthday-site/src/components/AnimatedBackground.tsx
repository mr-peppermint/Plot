import { useEffect, useRef } from 'react';

type Shape = {
  x: number; y: number; size: number;
  type: 'circle' | 'star' | 'sparkle' | 'ring' | 'spore' | 'orb';
  vx: number; vy: number;
  rotation: number; rotationSpeed: number;
  alpha: number; alphaSpeed: number;
  r: number; g: number; b: number;
  twinkleOffset: number;
};

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  const inner = r * 0.42;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 + rot - Math.PI / 2;
    const radius = i % 2 === 0 ? r : inner;
    i === 0
      ? ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle))
      : ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size * 0.22, size * 0.08, size * 0.3, size * 0.3, size * Math.cos(a), size * Math.sin(a));
    ctx.bezierCurveTo(size * 0.3, size * 0.3, size * 0.22, size * 0.08, 0, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSpore(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.5);
  ctx.lineTo(x, y - size * 1.8);
  ctx.strokeStyle = ctx.fillStyle as string;
  ctx.lineWidth = 0.6;
  ctx.stroke();
  [-0.6, 0.6].forEach(angle => {
    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.0);
    ctx.lineTo(x + Math.sin(angle) * size * 0.7, y - size * 1.0 - Math.cos(angle) * size * 0.5);
    ctx.stroke();
  });
}

/* Stranger Things palette: amber, cyan, purple, red, white */
const PALETTE: [number, number, number][] = [
  [232, 160,  32],  // warm amber (fairy lights)
  [ 79, 200, 240],  // electric cyan (Eleven)
  [255, 220,  80],  // golden yellow
  [180, 120, 255],  // upside-down purple
  [255,  80,  80],  // neon red
  [200, 230, 255],  // ice blue / starlight
  [255, 160,  40],  // amber orange
  [100, 210, 255],  // bright cyan
  [255, 200,  60],  // warm gold
  [220, 180, 255],  // soft violet
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
    const types: Shape['type'][] = ['circle', 'star', 'sparkle', 'ring', 'spore', 'orb'];

    const makeShape = (overrideY?: number): Shape => {
      const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return {
        x: Math.random() * canvas.width,
        y: overrideY !== undefined ? overrideY : Math.random() * canvas.height,
        size: Math.random() * 7 + 2,
        type: types[Math.floor(Math.random() * types.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.6 + 0.15),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        alpha: Math.random() * 0.5 + 0.1,
        alphaSpeed: (0.002 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
        r, g, b,
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      shapes = [];
      const count = Math.min(Math.floor(window.innerWidth / 11), 130);
      for (let i = 0; i < count; i++) shapes.push(makeShape());
    };

    /* Shooting stars — cyan & white */
    const shots: { x: number; y: number; len: number; speed: number; angle: number; life: number; maxLife: number; r: number; g: number; b: number }[] = [];
    const spawnShot = () => {
      if (shots.length < 3 && Math.random() < 0.005) {
        const col = [[79,200,240],[255,255,255],[232,160,32]][Math.floor(Math.random()*3)];
        shots.push({ x: Math.random() * canvas.width * 0.8, y: Math.random() * canvas.height * 0.35,
          len: 80 + Math.random() * 130, speed: 6 + Math.random() * 7,
          angle: Math.PI / 5.5 + Math.random() * 0.35, life: 0,
          maxLife: 40 + Math.random() * 45, r: col[0], g: col[1], b: col[2] });
      }
    };
    const drawShots = () => {
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i];
        s.life++;
        const alpha = Math.sin((s.life / s.maxLife) * Math.PI) * 0.9;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
        grad.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${alpha})`);
        grad.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
        if (s.life >= s.maxLife) shots.splice(i, 1);
      }
    };

    /* Nebula blobs — deep navy / teal / purple tones */
    const nebula = [
      { x: 0.2, y: 0.25, r: 300, r1: 20,  g1: 60,  b1: 160, speed: 0.0004 },
      { x: 0.8, y: 0.55, r: 260, r1: 80,  g1: 30,  b1: 140, speed: 0.0003 },
      { x: 0.5, y: 0.82, r: 280, r1: 30,  g1: 100, b1: 180, speed: 0.0005 },
    ];
    const drawNebula = () => {
      nebula.forEach((n) => {
        const cx = n.x * canvas.width + Math.sin(time * n.speed * 100) * 30;
        const cy = n.y * canvas.height + Math.cos(time * n.speed * 80) * 24;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
        grad.addColorStop(0, `rgba(${n.r1},${n.g1},${n.b1},0.08)`);
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
        case 'orb':
        case 'circle': {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.4);
          g.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${a})`);
          g.addColorStop(0.4, `rgba(${s.r},${s.g},${s.b},${a * 0.5})`);
          g.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'star':
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          drawStar(ctx, s.x, s.y, s.size, s.rotation);
          ctx.fill();
          break;
        case 'sparkle':
          ctx.fillStyle = `rgb(${s.r},${s.g},${s.b})`;
          drawSparkle(ctx, s.x, s.y, s.size, s.rotation);
          break;
        case 'spore':
          ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},0.7)`;
          drawSpore(ctx, s.x, s.y, s.size * 0.7);
          break;
        case 'ring':
          ctx.strokeStyle = `rgb(${s.r},${s.g},${s.b})`;
          ctx.lineWidth = 0.7;
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
        s.x += s.vx; s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.7 || s.alpha < 0.06) s.alphaSpeed *= -1;
        if (s.y < -20 || s.x < -30 || s.x > canvas.width + 30)
          Object.assign(s, makeShape(canvas.height + 15));
        drawShape(s);
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.75 }} />;
}
