import { useEffect, useRef } from 'react';

type Shape = {
  x: number;
  y: number;
  size: number;
  type: 'circle' | 'star' | 'ribbon' | 'diamond' | 'heart' | 'sparkle';
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
  twinkleOffset: number;
};

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, points: number, rotation: number) {
  const innerR = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + rotation;
    const radius = i % 2 === 0 ? r : innerR;
    if (i === 0) ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    else ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.6, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.6, 0);
  ctx.closePath();
  ctx.restore();
}

function drawRibbon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.rect(-size * 0.25, -size, size * 0.5, size * 2);
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.2, size * 0.1,
      size * 0.3, size * 0.3,
      size * Math.cos(angle), size * Math.sin(angle)
    );
    ctx.bezierCurveTo(
      size * 0.3, size * 0.3,
      size * 0.2, size * 0.1,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size / 30, size / 30);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.bezierCurveTo(0, -15, -15, -15, -15, -5);
  ctx.bezierCurveTo(-15, 5, 0, 15, 0, 22);
  ctx.bezierCurveTo(0, 15, 15, 5, 15, -5);
  ctx.bezierCurveTo(15, -15, 0, -15, 0, -10);
  ctx.closePath();
  ctx.restore();
}

const PALETTE = [
  [255, 215, 0],   // gold
  [255, 182, 193], // pink
  [216, 191, 216], // thistle
  [255, 165, 100], // peach
  [200, 162, 200], // violet
  [255, 240, 180], // champagne
  [252, 170, 200], // rose
  [180, 200, 255], // periwinkle
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

    const types: Shape['type'][] = ['circle', 'star', 'ribbon', 'diamond', 'heart', 'sparkle'];

    const makeShape = (overrideY?: number): Shape => {
      const rgb = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * canvas.width,
        y: overrideY !== undefined ? overrideY : Math.random() * canvas.height,
        size: Math.random() * 9 + 3,
        type,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.9 + 0.3),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        color: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      shapes = [];
      const count = Math.min(Math.floor(window.innerWidth / 12), 110);
      for (let i = 0; i < count; i++) shapes.push(makeShape());
    };

    const drawShape = (s: Shape) => {
      const twinkle = 0.55 + 0.45 * Math.sin(time * 0.04 + s.twinkleOffset);
      const a = Math.max(0, Math.min(1, s.alpha * twinkle));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.color;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;

      switch (s.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'star':
          drawStar(ctx, s.x, s.y, s.size, 5, s.rotation);
          ctx.fill();
          break;
        case 'ribbon':
          drawRibbon(ctx, s.x, s.y, s.size, s.rotation);
          ctx.fill();
          break;
        case 'diamond':
          drawDiamond(ctx, s.x, s.y, s.size, s.rotation);
          ctx.fill();
          break;
        case 'heart':
          drawHeart(ctx, s.x, s.y, s.size, s.rotation);
          ctx.fill();
          break;
        case 'sparkle':
          drawSparkle(ctx, s.x, s.y, s.size, s.rotation);
          break;
      }
    };

    const shootingStars: { x: number; y: number; len: number; speed: number; angle: number; alpha: number; life: number; maxLife: number }[] = [];

    const spawnShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.005) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4,
          len: Math.random() * 120 + 60,
          speed: Math.random() * 8 + 5,
          angle: Math.PI / 5 + Math.random() * 0.3,
          alpha: 0,
          life: 0,
          maxLife: 60 + Math.random() * 40,
        });
      }
    };

    const drawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.alpha = Math.sin((s.life / s.maxLife) * Math.PI);
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(255,255,240,${s.alpha * 0.9})`);
        grad.addColorStop(1, 'rgba(255,255,240,0)');

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnShootingStar();
      drawShootingStars();

      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.85 || s.alpha < 0.1) s.alphaSpeed *= -1;

        if (s.y < -20 || s.x < -20 || s.x > canvas.width + 20) {
          Object.assign(s, makeShape(canvas.height + 10));
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
      style={{ opacity: 0.65, mixBlendMode: 'screen' }}
    />
  );
}
