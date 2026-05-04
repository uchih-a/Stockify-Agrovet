import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, BarChart3, MessageCircle, Package, Sprout } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    description: 'Track stock levels, expiry dates, and get low-stock alerts automatically.',
    icon: Package,
    title: 'Smart Inventory',
  },
  {
    description: 'Powered by Gemini 1.5 for crop disease support, livestock guidance, and dosage help.',
    icon: MessageCircle,
    title: 'AI Advisor (AgroBot)',
  },
  {
    description: 'Revenue charts, farmer activity insights, and AI-generated business reports.',
    icon: BarChart3,
    title: 'Rich Analytics',
  },
];

const stats = [
  { label: 'Products Tracked', value: 2400 },
  { label: 'Farmers Registered', value: 500 },
  { label: 'System Uptime', value: 99.9, suffix: '%' },
  { label: 'Product Categories', value: 15, suffix: '+' },
];

const headlineText = 'Where Precision\nMeets the Harvest.';

export function HomePage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const statsRefs = useRef([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const headlineChars = useMemo(
    () =>
      headlineText.split('').map((char, index) =>
        char === '\n' ? (
          <span key={`break-${index}`} style={{ display: 'block', width: '100%' }} />
        ) : (
          <span key={`${char}-${index}`} className="headline-char" style={{ display: 'inline-block' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ),
      ),
    [],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    let animationFrame = 0;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--color-primary').trim() || '#0f5238';
    const amber = styles.getPropertyValue('--color-amber').trim() || '#ba7517';

    const particles = Array.from({ length: 350 }, (_, index) => ({
      color: index % 2 === 0 ? primary : amber,
      opacity: Math.random() * 0.4 + 0.3,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    }));

    const onMouseMove = (event) => {
      mouse = { x: event.clientX, y: event.clientY };
    };

    const onMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          particle.x += dx * 0.0008;
          particle.y += dy * 0.0008;
        }

        particle.x = (particle.x + particle.vx + canvas.width) % canvas.width;
        particle.y = (particle.y + particle.vy + canvas.height) % canvas.height;

        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = particle.opacity;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(canvasRef.current, { opacity: 0 }, { duration: 1.2, opacity: 1 }, 0);
      tl.fromTo('[data-ref="eyebrow"]', { opacity: 0, y: 20 }, { duration: 0.5, opacity: 1, y: 0 }, 0.4);
      tl.fromTo(
        '.headline-char',
        { opacity: 0, rotateX: -20, y: 60 },
        { duration: 0.6, opacity: 1, stagger: 0.025, y: 0, rotateX: 0, ease: 'back.out(1.2)' },
        0.5,
      );
      tl.fromTo('[data-ref="subline"]', { opacity: 0, y: 30 }, { duration: 0.6, opacity: 1, y: 0 }, 1.2);
      tl.fromTo('[data-ref="ctas"] > *', { opacity: 0, scale: 0.85 }, { duration: 0.55, opacity: 1, scale: 1, stagger: 0.12, ease: 'back.out(1.2)' }, 1.5);
      tl.fromTo('[data-ref="trust"]', { opacity: 0 }, { duration: 0.4, opacity: 1 }, 1.8);
      tl.fromTo('[data-ref="scroll-indicator"]', { opacity: 0 }, { duration: 0.4, opacity: 1 }, 2.0);

      gsap.to('[data-ref="scroll-indicator"]', {
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        y: 10,
        yoyo: true,
      });

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          stagger: 0.14,
          scrollTrigger: {
            start: 'top 78%',
            trigger: '#features',
          },
          y: 0,
        },
      );

      gsap.fromTo(
        '.step-line-path',
        { strokeDasharray: 400, strokeDashoffset: 400 },
        {
          scrollTrigger: {
            start: 'top 80%',
            trigger: '#how-it-works',
          },
          strokeDashoffset: 0,
        },
      );

      statsRefs.current.forEach((element, index) => {
        const stat = stats[index];
        if (!element) return;
        gsap.fromTo(
          element,
          { textContent: 0 },
          {
            duration: 1.4,
            ease: 'power1.out',
            onUpdate() {
              const current = Number(element.textContent);
              if (stat.suffix === '%') {
                element.textContent = current.toFixed(1);
              } else {
                element.textContent = Math.round(current).toString();
              }
            },
            scrollTrigger: {
              start: 'top 80%',
              trigger: element,
            },
            textContent: stat.value,
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <header
        ref={headerRef}
        className={isScrolled ? 'scrolled' : undefined}
        style={{
          alignItems: 'center',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          background: isScrolled ? 'rgba(251,249,244,0.92)' : 'transparent',
          display: 'flex',
          height: 72,
          justifyContent: 'space-between',
          left: 0,
          padding: '0 48px',
          position: 'fixed',
          right: 0,
          top: 0,
          transition: 'background 300ms ease, backdrop-filter 300ms ease',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{ alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', gap: 10, fontSize: 20, fontWeight: 700 }}
          type="button"
        >
          <Sprout size={18} />
          AgroVet
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <ThemeToggle />
          <Button onClick={() => navigate('/login')} size="sm" variant="secondary">
            Log In
          </Button>
          <Button onClick={() => navigate('/register')} size="sm">
            Get Started
          </Button>
        </div>
      </header>

      <section style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
        <canvas ref={canvasRef} style={{ inset: 0, opacity: 0, pointerEvents: 'none', position: 'absolute', width: '100%', zIndex: 0 }} />
        <div
          className="page-container"
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh',
            paddingTop: 120,
            position: 'relative',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <span data-ref="eyebrow" style={{ color: 'var(--color-amber)', fontSize: 13, opacity: 0 }}>
            Trusted by 500+ Kenyan Farmers
          </span>
          <h1
            data-ref="headline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.96,
              margin: '20px 0 0',
              maxWidth: 980,
            }}
          >
            {headlineChars}
          </h1>
          <p
            data-ref="subline"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 18,
              lineHeight: 1.8,
              margin: '24px 0 0',
              maxWidth: 600,
              whiteSpace: 'pre-line',
            }}
          >
            The intelligent inventory and advisory platform{'\n'}built for Africa&apos;s agrovet businesses.
          </p>
          <div data-ref="ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 32 }}>
            <Button onClick={() => navigate('/register')} size="lg">
              Get Started Free
            </Button>
            <Button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} size="lg" variant="tertiary">
              See How It Works
            </Button>
          </div>
          <div data-ref="trust" style={{ color: 'var(--color-text-hint)', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginTop: 24 }}>
            <span>✓ Free to join</span>
            <span>✓ No credit card</span>
            <span>✓ Kenya-based</span>
          </div>
          <div data-ref="scroll-indicator" style={{ bottom: 32, opacity: 0, position: 'absolute' }}>
            <ArrowDown size={20} />
          </div>
        </div>
      </section>

      <section id="features" style={{ background: 'var(--color-surface-low)', padding: '120px 0' }}>
        <div className="page-container">
          <div style={{ margin: '0 auto', maxWidth: 560, textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, margin: 0 }}>Everything your agrovet needs.</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1.8, margin: '14px 0 0' }}>
              One editorial-grade workspace for inventory, advisory support, and business intelligence.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 64 }}>
            {features.map((feature) => (
              <Card key={feature.title} className="feature-card" level="elevated" padding={32} style={{ borderRadius: 'var(--radius-xl)' }}>
                <div style={{ alignItems: 'center', background: 'var(--color-primary-surface)', borderRadius: '9999px', color: 'var(--color-primary)', display: 'inline-flex', height: 56, justifyContent: 'center', width: 56 }}>
                  <feature.icon size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '20px 0 0' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 15, lineHeight: 1.7, margin: '12px 0 0' }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '80px 0' }}>
        <div className="page-container" style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 700 }}>
                <span ref={(element) => { statsRefs.current[index] = element; }}>0</span>
                {stat.suffix === '+' ? '+' : stat.suffix === '%' ? '%' : '+'}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: 14, margin: '8px 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '120px 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, margin: 0 }}>Simple and powerful.</h2>
          </div>
          <div style={{ marginTop: 48, position: 'relative' }}>
            <svg
              aria-hidden="true"
              style={{ display: typeof window !== 'undefined' && window.innerWidth >= 900 ? 'block' : 'none', left: 0, position: 'absolute', right: 0, top: 24 }}
              viewBox="0 0 900 120"
            >
              <path className="step-line-path" d="M130 60C260 20 340 20 450 60S640 100 770 60" fill="none" stroke="var(--color-primary)" strokeOpacity="0.3" strokeWidth="3" />
            </svg>
            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', position: 'relative' }}>
              {[
                {
                  description: 'Create your account in under 2 minutes.',
                  step: '1',
                  title: 'Register',
                },
                {
                  description: 'Explore hundreds of agrovet products and purchase with ease.',
                  step: '2',
                  title: 'Browse & Buy',
                },
                {
                  description: 'Monitor your orders and get AI-powered farming advice.',
                  step: '3',
                  title: 'Track & Advise',
                },
              ].map((item) => (
                <div key={item.step} style={{ justifyItems: 'center', textAlign: 'center' }}>
                  <span style={{ alignItems: 'center', background: 'var(--color-primary)', borderRadius: '9999px', color: '#fff', display: 'inline-flex', fontFamily: 'var(--font-display)', fontSize: 20, height: 48, justifyContent: 'center', width: 48 }}>
                    {item.step}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '16px 0 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.7, margin: '10px auto 0', maxWidth: 220 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-amber-surface)', padding: '80px 0' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, margin: 0 }}>Ready to modernise your agrovet business?</h2>
          <div style={{ marginTop: 32 }}>
            <Button onClick={() => navigate('/register')} size="lg">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      <footer style={{ padding: '24px 48px' }}>
        <div className="page-container" style={{ alignItems: 'center', color: 'var(--color-text-muted)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
          <span>© 2025 AgroVet — Built for Kenya</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#privacy" style={{ color: 'var(--color-amber)' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'var(--color-amber)' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
