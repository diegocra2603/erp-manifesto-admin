/**
 * ============================================
 * LANDING PAGE
 * ============================================
 * Public landing page with hero section, language selector, and dark/light mode toggle
 */

import { useState, useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Sun, Moon, Globe, ChevronDown, ArrowRight, Rocket, Shield, BarChart3, Menu as MenuIcon, X, Users, Gem, TrendingUp, Star, Check } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// ==================== i18n ====================

type Lang = 'es' | 'en';

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      features: 'Características',
      about: 'Nosotros',
      contact: 'Contacto',
      login: 'Iniciar sesión',
    },
    hero: {
      title: 'El universo de tu negocio,',
      titleHighlight: 'en una sola plataforma',
      subtitle:
        'Gestiona tu empresa con una herramienta potente, intuitiva y diseñada para escalar sin límites.',
      cta: 'Comenzar ahora',
      ctaSecondary: 'Conocer más',
    },
    features: {
      title: 'Todo lo que necesitas',
      subtitle: 'Herramientas diseñadas para impulsar tu negocio al siguiente nivel.',
      items: [
        {
          title: 'Gestión integral',
          description:
            'Controla inventario, ventas, compras y finanzas desde un solo lugar.',
        },
        {
          title: 'Seguridad avanzada',
          description:
            'Protege tus datos con autenticación robusta y permisos granulares.',
        },
        {
          title: 'Analítica en tiempo real',
          description:
            'Toma decisiones informadas con dashboards y reportes al instante.',
        },
      ],
    },
    growWithUs: {
      title: 'Crece con nosotros',
      items: [
        {
          title: 'Publicaciones',
          description: 'Comparte contenido y mantén informado a tu equipo en tiempo real.',
        },
        {
          title: 'Carrera',
          description: 'Impulsa el crecimiento profesional dentro de tu organización.',
        },
        {
          title: 'Educación',
          description: 'Capacita a tu equipo con herramientas de aprendizaje integradas.',
        },
        {
          title: 'Objetivos',
          description: 'Alcanza tus metas de negocio con seguimiento y métricas claras.',
        },
      ],
    },
    discovery: {
      subtitle: '¿Qué es Manifesto?',
      title: 'Una nueva era de gestión',
      description:
        'Manifesto es más que un ERP. Es una plataforma integral que combina tecnología de vanguardia con una experiencia de usuario excepcional, diseñada para transformar la forma en que administras tu negocio.',
      cta: 'Conocer más',
      products: [
        { title: 'Branding', description: 'Identidad visual y posicionamiento de marca.' },
        { title: 'Capacitación Digital', description: 'Formación y desarrollo de habilidades digitales.' },
        { title: 'Dirección de Eventos', description: 'Planificación y gestión integral de eventos.' },
        { title: 'Transformación Digital', description: 'Innovación y modernización de procesos.' },
      ],
    },
    community: {
      subtitle: 'Quiénes somos',
      title: 'Una comunidad de visionarios',
      description:
        'Somos una comunidad apasionada por la innovación empresarial. Conectamos líderes, emprendedores y equipos que buscan transformar la forma en que gestionan sus negocios.',
      items: [
        'Colaboración en tiempo real',
        'Soporte dedicado',
        'Innovación constante',
        'Crecimiento garantizado',
      ],
      cta: 'Comenzar ahora',
    },
    stats: {
      subtitle: 'Sobre nosotros',
      title: 'Comunidad empresarial para todos',
      description:
        'Nuestra plataforma conecta empresas de todos los tamaños, ofreciendo herramientas que simplifican la gestión y potencian el crecimiento colaborativo.',
      items: [
        { value: 2950, suffix: '+', label: 'Miembros activos' },
        { value: 12, suffix: '', label: 'Años de experiencia' },
        { value: 5, suffix: '', label: 'Sucursales' },
        { value: 24, suffix: '', label: 'Zonas de operación' },
      ],
    },
    contact: {
      subtitle: 'Contáctanos',
      title: 'Hablemos de tu proyecto',
      description: 'Déjanos tus datos y nos pondremos en contacto contigo para ayudarte a encontrar la solución perfecta.',
      name: 'Nombre completo',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      product: 'Producto de interés',
      productOptions: ['Branding', 'Capacitación Digital', 'Dirección de Eventos', 'Transformación Digital', 'Otro'],
      selectProduct: 'Selecciona un producto',
      otherPlaceholder: 'Escribe el nombre del producto',
      submit: 'Enviar solicitud',
      successTitle: '¡Solicitud enviada!',
      successMessage: 'Hemos recibido tus datos correctamente. Nos estaremos comunicando contigo pronto.',
      successCta: 'Entendido',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      login: 'Sign in',
    },
    hero: {
      title: 'Your business universe,',
      titleHighlight: 'in one single platform',
      subtitle:
        'Manage your company with a powerful, intuitive tool designed to scale without limits.',
      cta: 'Get started',
      ctaSecondary: 'Learn more',
    },
    features: {
      title: 'Everything you need',
      subtitle: 'Tools designed to take your business to the next level.',
      items: [
        {
          title: 'Full management',
          description:
            'Control inventory, sales, purchases, and finances from one place.',
        },
        {
          title: 'Advanced security',
          description:
            'Protect your data with robust authentication and granular permissions.',
        },
        {
          title: 'Real-time analytics',
          description:
            'Make informed decisions with dashboards and instant reports.',
        },
      ],
    },
    growWithUs: {
      title: 'Grow With Us',
      items: [
        {
          title: 'Publishing',
          description: 'Share content and keep your team informed in real time.',
        },
        {
          title: 'Career',
          description: 'Drive professional growth within your organization.',
        },
        {
          title: 'Education',
          description: 'Train your team with integrated learning tools.',
        },
        {
          title: 'Goals',
          description: 'Reach your business goals with clear tracking and metrics.',
        },
      ],
    },
    discovery: {
      subtitle: 'What is Manifesto?',
      title: 'A New Dawn Of Management',
      description:
        'Manifesto is more than an ERP. It is a comprehensive platform that combines cutting-edge technology with an exceptional user experience, designed to transform the way you manage your business.',
      cta: 'Learn more',
      products: [
        { title: 'Branding', description: 'Visual identity and brand positioning.' },
        { title: 'Digital Training', description: 'Education and digital skills development.' },
        { title: 'Event Management', description: 'Comprehensive event planning and execution.' },
        { title: 'Digital Transformation', description: 'Innovation and process modernization.' },
      ],
    },
    community: {
      subtitle: 'Who We Are',
      title: 'A Community Of Visionaries',
      description:
        'We are a community passionate about business innovation. We connect leaders, entrepreneurs and teams seeking to transform the way they manage their businesses.',
      items: [
        'Real-time collaboration',
        'Dedicated support',
        'Constant innovation',
        'Guaranteed growth',
      ],
      cta: 'Get Started',
    },
    stats: {
      subtitle: 'About Us',
      title: 'Business Communities For Everyone',
      description:
        'Our platform connects businesses of all sizes, offering tools that simplify management and drive collaborative growth.',
      items: [
        { value: 2950, suffix: '+', label: 'Active Members' },
        { value: 12, suffix: '', label: 'Years of Experience' },
        { value: 5, suffix: '', label: 'Branch Locations' },
        { value: 24, suffix: '', label: 'Operation Zones' },
      ],
    },
    contact: {
      subtitle: 'Contact Us',
      title: "Let's Talk About Your Project",
      description: 'Leave us your details and we will contact you to help you find the perfect solution.',
      name: 'Full name',
      email: 'Email address',
      phone: 'Phone number',
      product: 'Product of interest',
      productOptions: ['Branding', 'Digital Training', 'Event Management', 'Digital Transformation', 'Other'],
      selectProduct: 'Select a product',
      otherPlaceholder: 'Enter the product name',
      submit: 'Send request',
      successTitle: 'Request sent!',
      successMessage: 'We have received your information successfully. We will be contacting you soon.',
      successCta: 'Got it',
    },
    footer: {
      rights: 'All rights reserved.',
    },
  },
} as const;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'es',
  setLang: () => {},
});

function useLang() {
  return useContext(LangContext);
}

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app_lang') as Lang) || 'es';
    }
    return 'es';
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('app_lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LangContext.Provider>
  );
}

// ==================== COMPONENTS ====================

const featureIcons = [Rocket, Shield, BarChart3];

function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Icon logo when at top, full name logo when scrolled
  const logoSrc = scrolled
    ? '/assets/logo/logo-manifesto-nombre-blanco.svg'
    : '/assets/logo/logo-manifesto-blanco.svg';

  const navLinks = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.about, href: '#' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? 'rgba(0,0,0,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#hero" className="flex shrink-0 items-center gap-3">
          <img
            src={logoSrc}
            alt="Manifesto"
            className="w-auto transition-all duration-500"
            style={{ height: scrolled ? '20px' : '32px' }}
          />
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-wide transition-colors duration-200"
              style={{
                color: 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = '#fff')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <button
            onClick={(e) => setLangAnchor(e.currentTarget)}
            className="flex cursor-pointer items-center gap-1 rounded-lg border-none px-2.5 py-1.5 text-sm font-medium transition-colors duration-200"
            style={{
              background: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Globe size={15} />
            <span className="uppercase">{lang}</span>
            <ChevronDown size={13} />
          </button>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 120,
                  bgcolor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              },
            }}
          >
            <MenuItem
              selected={lang === 'es'}
              onClick={() => {
                setLang('es');
                setLangAnchor(null);
              }}
            >
              Español
            </MenuItem>
            <MenuItem
              selected={lang === 'en'}
              onClick={() => {
                setLang('en');
                setLangAnchor(null);
              }}
            >
              English
            </MenuItem>
          </Menu>

          {/* Theme toggle */}
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              bgcolor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)',
              },
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>

          {/* Mobile menu button */}
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden!"
            sx={{ color: '#fff' }}
          >
            {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </IconButton>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t px-4 pb-4 md:hidden"
          style={{
            backgroundColor: 'rgba(0,0,0,0.95)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/images/amp-top-img.jpg')" }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Animated glow */}
      <div
        className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-16 text-center sm:px-6 lg:px-8">

        {/* Title */}
        <h1
          className="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ color: '#fff' }}
        >
          {t.hero.title}
          <br />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={18} />}
            onClick={() => {
              const nextSection = document.getElementById('grow');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: '#fff',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9375rem',
              borderRadius: '12px',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {t.hero.cta}
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="#features"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '0.9375rem',
              borderRadius: '12px',
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.05)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {t.hero.ctaSecondary}
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex justify-center">
          <div
            className="flex h-9 w-5 items-start justify-center rounded-full border-2 p-1"
            style={{
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <div
              className="h-2 w-1 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.5)',
                animation: 'scrollDown 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes scrollDown {
          0% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function FeaturesSection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="features"
      className="relative py-24 sm:py-32"
      style={{
        backgroundColor: isDark ? '#000' : '#fff',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            {t.features.title}
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg"
            style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)' }}
          >
            {t.features.subtitle}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {t.features.items.map((item, idx) => {
            const Icon = featureIcons[idx];
            return (
              <div
                key={idx}
                className="group relative rounded-2xl p-8 transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isDark
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(0,0,0,0.12)';
                  e.currentTarget.style.backgroundColor = isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.backgroundColor = isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: isDark
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <Icon
                    size={22}
                    style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
                  />
                </div>

                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: isDark ? '#fff' : '#000' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const growImages = [
  '/assets/images/5.png',  // Globe - Publishing
  '/assets/images/6.png',  // Compass - Career
  '/assets/images/3.png',  // Network - Education
  '/assets/images/12.png', // Moon flag - Goals
];

function GrowWithUsSection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="grow"
      className="relative py-14 sm:py-20"
      style={{
        backgroundColor: isDark ? '#0a0a0a' : '#111111',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2
          className="mb-10 text-center text-3xl font-light tracking-wide sm:text-4xl md:text-5xl"
          style={{
            color: isDark ? '#fff' : 'rgba(255,255,255,0.9)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {t.growWithUs.title}
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {t.growWithUs.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + idx * 0.12}s`,
              }}
            >
              {/* Image with hover animation */}
              <div
                className="group mb-4 flex h-16 w-16 items-center justify-center"
                style={{ perspective: '600px' }}
              >
                <img
                  src={growImages[idx]}
                  alt={item.title}
                  className="h-12 w-12 object-contain transition-all duration-500 group-hover:scale-110"
                  style={{
                    filter: 'brightness(0) invert(0.7)',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(0) invert(1)';
                    e.currentTarget.style.transform = 'scale(1.15) translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(0) invert(0.7)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                />
              </div>

              {/* Title */}
              <h3
                className="mb-2 text-base font-semibold tracking-wide sm:text-lg"
                style={{ color: isDark ? '#fff' : 'rgba(255,255,255,0.9)' }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="max-w-[200px] text-xs leading-relaxed sm:text-sm"
                style={{
                  color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.4)',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const productImages = [
  '/assets/images/products/branding.png',
  '/assets/images/products/capacitacion-digital.png',
  '/assets/images/products/direccion-eventos.png',
  '/assets/images/products/transformacion-digital.png',
];

function DiscoverySection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#000' : '#0a0a0a' }}
    >
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        {/* Hero banner with background image */}
        <div
          className="relative mb-16 overflow-hidden rounded-2xl"
          style={{ minHeight: '500px' }}
        >
          <img
            src="/assets/images/usa-hawaii-mauna-kea-volcano-telesco.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />
          <div className="relative flex h-full min-h-[500px] items-center justify-end p-6 sm:p-12 lg:p-16">
            <div
              className="w-full max-w-lg rounded-2xl p-8 sm:p-10"
              style={{
                backgroundColor: 'rgba(15,15,25,0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(60px)',
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p
                className="mb-3 text-sm font-medium tracking-wide"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
              >
                {t.discovery.subtitle}
              </p>
              <h2
                className="mb-5 text-3xl leading-tight font-light tracking-wide sm:text-4xl"
                style={{
                  color: '#fff',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              >
                {t.discovery.title}
              </h2>
              <p
                className="mb-8 text-sm leading-relaxed sm:text-base"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                }}
              >
                {t.discovery.description}
              </p>
              <div
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                }}
              >
                <a
                  href="/login"
                  className="inline-block rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {t.discovery.cta}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
          {t.discovery.products.map((product, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + idx * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredProduct(idx)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product image */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: '3 / 4',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img
                  src={productImages[idx]}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: hoveredProduct === idx ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5"
                  style={{
                    background: hoveredProduct === idx
                      ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
                    transition: 'background 0.4s ease',
                  }}
                >
                  <h3
                    className="text-sm font-semibold tracking-wide sm:text-base"
                    style={{
                      color: '#fff',
                      transform: hoveredProduct === idx ? 'translateY(0)' : 'translateY(4px)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    className="mt-1 text-xs leading-relaxed sm:text-sm"
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      opacity: hoveredProduct === idx ? 1 : 0,
                      transform: hoveredProduct === idx ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
                      maxHeight: hoveredProduct === idx ? '60px' : '0',
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const communityIcons = [Users, Gem, TrendingUp, Star];

function CommunitySection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoverPos, setHoverPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPos(Math.max(15, Math.min(85, x)));
  };

  const handleMouseLeave = () => {
    setHoverPos(50);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: isDark ? '#000' : '#050505' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Images with hover reveal */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl"
            style={{
              height: '550px',
              cursor: 'col-resize',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Image 1 - Full background */}
            <img
              src="/assets/images/the-man-with-a-camera-stand-on-the-starry-sky-back.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Image 2 - Clipped on top */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 0 0 ${hoverPos}%)`,
                transition: 'clip-path 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src="/assets/images/two-brothers-looking-at-the-stars-using-a-telescop.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 z-10 w-px"
              style={{
                left: `${hoverPos}%`,
                backgroundColor: 'rgba(255,255,255,0.4)',
                transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Subtle overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)',
              }}
            />
          </div>

          {/* Right - Content */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <p
              className="mb-3 text-sm font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {t.community.subtitle}
            </p>
            <h2
              className="mb-5 text-3xl leading-tight font-light tracking-wide sm:text-4xl md:text-5xl"
              style={{ color: '#fff' }}
            >
              {t.community.title}
            </h2>
            <p
              className="mb-8 max-w-md text-sm leading-relaxed sm:text-base"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {t.community.description}
            </p>

            {/* Items grid */}
            <div className="mb-10 grid grid-cols-2 gap-4">
              {t.community.items.map((item, idx) => {
                const Icon = communityIcons[idx];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(15px)',
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + idx * 0.1}s`,
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
              }}
            >
              <a
                href="/login"
                className="inline-block rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '1px solid #fff',
                }}
              >
                {t.community.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function StatsSection() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const t = translations[lang];
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: isDark ? '#0a0a0a' : '#111111' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - Text */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <p
              className="mb-3 text-sm font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {t.stats.subtitle}
            </p>
            <h2
              className="mb-6 text-3xl leading-tight font-light tracking-wide sm:text-4xl md:text-5xl"
              style={{ color: '#fff' }}
            >
              {t.stats.title}
            </h2>
            <p
              className="max-w-md text-sm leading-relaxed sm:text-base"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {t.stats.description}
            </p>
          </div>

          {/* Right - Stats grid */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {t.stats.items.map((item, idx) => (
              <StatItem
                key={idx}
                value={item.value}
                suffix={item.suffix}
                label={item.label}
                isDark={isDark}
                visible={visible}
                delay={idx * 0.15}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  isDark,
  visible,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  isDark: boolean;
  visible: boolean;
  delay: number;
}) {
  const count = useCountUp(value, 2000, visible);
  const formatted = count.toLocaleString();

  return (
    <div
      className="text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <p
        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        {formatted}
        {suffix}
      </p>
      <p
        className="mt-2 text-sm font-medium sm:text-base"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        {label}
      </p>
    </div>
  );
}

function ContactSection() {
  const { lang } = useLang();
  const t = translations[lang];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    customProduct: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', product: '', customProduct: '' });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/images/agujero-negro.jpg')" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Text */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <p
              className="mb-3 text-sm font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {t.contact.subtitle}
            </p>
            <h2
              className="mb-6 text-3xl leading-tight font-light tracking-wide sm:text-4xl md:text-5xl"
              style={{ color: '#fff' }}
            >
              {t.contact.title}
            </h2>
            <p
              className="max-w-md text-sm leading-relaxed sm:text-base"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {t.contact.description}
            </p>
          </div>

          {/* Right - Form or Success */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{
                backgroundColor: 'rgba(15,15,25,0.5)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name */}
                  <div>
                    <label
                      className="mb-2 block text-xs font-medium tracking-wide"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="mb-2 block text-xs font-medium tracking-wide"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="mb-2 block text-xs font-medium tracking-wide"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {t.contact.phone}
                    </label>
                    <PhoneInput
                      country="gt"
                      value={formData.phone}
                      onChange={(phone: string) => setFormData({ ...formData, phone })}
                      enableSearch
                      searchPlaceholder={lang === 'es' ? 'Buscar país...' : 'Search country...'}
                      containerStyle={{ width: '100%' }}
                      inputStyle={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        fontSize: '0.875rem',
                        paddingLeft: '62px',
                      }}
                      buttonStyle={{
                        borderRadius: '12px 0 0 12px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRight: 'none',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        width: '52px',
                      }}
                      dropdownStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff',
                        borderRadius: '12px',
                      }}
                    />
                  </div>

                  {/* Product */}
                  <div>
                    <label
                      className="mb-2 block text-xs font-medium tracking-wide"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {t.contact.product}
                    </label>
                    <select
                      required
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      style={{
                        ...inputStyle,
                        cursor: 'pointer',
                        appearance: 'none' as const,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='rgba(255,255,255,0.5)' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                      }}
                    >
                      <option value="" disabled style={{ backgroundColor: '#1a1a2e' }}>
                        {t.contact.selectProduct}
                      </option>
                      {t.contact.productOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ backgroundColor: '#1a1a2e' }}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {/* Custom product input when "Other" is selected */}
                    {(formData.product === 'Otro' || formData.product === 'Other') && (
                      <input
                        type="text"
                        required
                        value={formData.customProduct}
                        onChange={(e) => setFormData({ ...formData, customProduct: e.target.value })}
                        placeholder={t.contact.otherPlaceholder}
                        style={{ ...inputStyle, marginTop: '8px' }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                        }}
                      />
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="mt-2 w-full cursor-pointer rounded-full border-none py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: '#fff',
                      color: '#000',
                    }}
                  >
                    {t.contact.submit}
                  </button>
                </form>
              ) : (
                /* Success state */
                <div
                  className="flex flex-col items-center py-8 text-center"
                  style={{
                    animation: 'contactFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Animated check circle */}
                  <div
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      animation: 'contactPulseCheck 2s ease-in-out infinite',
                    }}
                  >
                    <Check size={36} style={{ color: '#fff' }} strokeWidth={2.5} />
                  </div>

                  <h3
                    className="mb-3 text-2xl font-light tracking-wide"
                    style={{ color: '#fff' }}
                  >
                    {t.contact.successTitle}
                  </h3>
                  <p
                    className="mb-8 max-w-sm text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {t.contact.successMessage}
                  </p>
                  <button
                    onClick={handleReset}
                    className="cursor-pointer rounded-full border-none px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#fff',
                      color: '#000',
                    }}
                  >
                    {t.contact.successCta}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes contactFadeIn {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes contactPulseCheck {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(255,255,255,0); }
        }
        #contact .react-tel-input .form-control:focus {
          border-color: rgba(255,255,255,0.3) !important;
          background-color: rgba(255,255,255,0.1) !important;
          box-shadow: none !important;
        }
        #contact .react-tel-input .flag-dropdown.open .selected-flag {
          background-color: rgba(255,255,255,0.1) !important;
        }
        #contact .react-tel-input .country-list .country:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }
        #contact .react-tel-input .country-list .country.highlight {
          background-color: rgba(255,255,255,0.15) !important;
        }
        #contact .react-tel-input .selected-flag:hover,
        #contact .react-tel-input .selected-flag:focus {
          background-color: rgba(255,255,255,0.1) !important;
        }
        #contact .react-tel-input .selected-flag {
          width: 48px !important;
          padding: 0 0 0 14px !important;
        }
        #contact .react-tel-input .country-list .search {
          background-color: #1a1a2e !important;
          padding: 10px !important;
        }
        #contact .react-tel-input .country-list .search-box {
          background-color: rgba(255,255,255,0.08) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: #fff !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        #contact .react-tel-input .country-list .search-box::placeholder {
          color: rgba(255,255,255,0.4) !important;
        }
      `}</style>
    </section>
  );
}

function Footer() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <footer
      className="py-8"
      style={{
        backgroundColor: '#000',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <img src="/assets/logo/logo-manifesto-nombre-blanco.svg" alt="Manifesto" className="h-5 w-auto opacity-60" />
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          &copy; {new Date().getFullYear()} Manifesto. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

// ==================== MAIN ====================

function LandingPageContent() {
  return (
    <LangProvider>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Navbar />
        <HeroSection />
        <GrowWithUsSection />
        <DiscoverySection />
        <CommunitySection />
        <StatsSection />
        <ContactSection />
        <Footer />
      </Box>
    </LangProvider>
  );
}

export function LandingPage() {
  return (
    <ThemeProvider>
      <LandingPageContent />
    </ThemeProvider>
  );
}
