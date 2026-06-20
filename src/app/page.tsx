import Link from 'next/link'
import LandingScripts from '@/components/LandingScripts'

export const metadata = {
  title: 'Afro Raiz — Especialista em Tranças e Cabelos Afro',
  description: 'Tranças, Box Braids, Nago, Mega Hair e muito mais. Agende online com horario real por servico, sem horarios fixos.',
}

export default function HomePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --moss: #2F4F3E;
          --olive: #556B4F;
          --gold: #C4A66B;
          --gold-light: #d4bc88;
          --beige: #F8F4EE;
          --offwhite: #FCFBF8;
          --text-dark: #1a1a1a;
          --text-mid: #4a4a4a;
          --text-light: #7a7a7a;
          --radius: 16px;
          --radius-sm: 10px;
          --radius-lg: 24px;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
          --shadow-md: 0 8px 30px rgba(0,0,0,0.06);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.08);
          --shadow-gold: 0 8px 30px rgba(196,166,107,0.15);
          --transition: cubic-bezier(0.22, 1, 0.36, 1);
        }
        html { scroll-behavior: smooth; font-size: 16px; }
        body { font-family: 'Outfit', sans-serif; background: var(--offwhite); color: var(--text-dark); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, h5 { font-family: 'Cormorant Garamond', serif; font-weight: 400; line-height: 1.1; }
        .container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        img { max-width: 100%; display: block; }
        a { text-decoration: none; color: inherit; }
        button { border: none; cursor: pointer; font-family: inherit; }
        .section-label { font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: inline-block; }
        .section-title { font-size: clamp(2.2rem, 5vw, 3.8rem); color: var(--moss); margin-bottom: 20px; letter-spacing: -0.02em; }
        .section-subtitle { font-size: 1.05rem; font-weight: 300; color: var(--text-light); line-height: 1.7; max-width: 560px; }
        .btn-primary { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; background: var(--gold); color: #fff; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 100px; transition: all 0.3s var(--transition); cursor: pointer; }
        .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: var(--shadow-gold); }
        .btn-secondary { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; background: rgba(255,255,255,0.1); color: #fff; font-size: 0.85rem; font-weight: 400; letter-spacing: 0.05em; border-radius: 100px; border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(10px); transition: all 0.3s var(--transition); }
        .btn-secondary:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border: 1.5px solid var(--moss); color: var(--moss); font-size: 0.82rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 100px; transition: all 0.3s var(--transition); }
        .btn-outline:hover { background: var(--moss); color: #fff; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 20px 0; transition: all 0.4s var(--transition); }
        .nav.scrolled { background: rgba(252,251,248,0.95); backdrop-filter: blur(20px); padding: 14px 0; box-shadow: var(--shadow-sm); }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: #fff; letter-spacing: 0.02em; transition: color 0.3s; }
        .nav-logo span { color: var(--gold); }
        .nav.scrolled .nav-logo { color: var(--moss); }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
        .nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); transition: color 0.3s; position: relative; }
        .nav.scrolled .nav-links a { color: var(--text-mid); }
        .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1.5px; background: var(--gold); transition: width 0.3s; }
        .nav-links a:hover::after { width: 100%; }
        .nav-book { background: var(--gold); color: #fff !important; padding: 10px 24px; border-radius: 100px; font-weight: 500 !important; letter-spacing: 0.06em !important; transition: all 0.3s !important; }
        .nav-book:hover { background: var(--gold-light); transform: translateY(-1px); }
        .nav-book::after { display: none !important; }
        .nav-toggle { display: none; flex-direction: column; gap: 5px; background: none; padding: 4px; }
        .nav-toggle span { display: block; width: 24px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; }
        .nav.scrolled .nav-toggle span { background: var(--moss); }
        .mobile-menu { display: none; position: fixed; inset: 0; background: var(--moss); z-index: 2000; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
        .mobile-menu.active { display: flex; }
        .mobile-menu a { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: #fff; transition: color 0.3s; }
        .mobile-menu a:hover { color: var(--gold); }
        .mobile-close { position: absolute; top: 24px; right: 24px; font-size: 2rem; color: #fff; background: none; }

        /* HERO */
        .hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: center; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; }
        .hero-bg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); transition: transform 8s var(--transition); }
        .hero:hover .hero-bg img { transform: scale(1); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(47,79,62,0.75) 0%, rgba(0,0,0,0.4) 100%); }
        .hero .container { position: relative; z-index: 1; }
        .hero-content { max-width: 680px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(196,166,107,0.15); border: 1px solid rgba(196,166,107,0.3); color: var(--gold-light); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; padding: 8px 20px; border-radius: 100px; margin-bottom: 28px; backdrop-filter: blur(10px); }
        .hero h1 { font-size: clamp(3rem, 7vw, 5.5rem); color: #fff; margin-bottom: 24px; line-height: 1; }
        .hero h1 em { color: var(--gold); font-style: italic; }
        .hero-desc { font-size: 1.1rem; font-weight: 300; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 40px; max-width: 500px; }
        .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 64px; }
        .hero-stats { display: flex; gap: 48px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.15); }
        .hero-stat h3 { font-size: 2.2rem; color: #fff; font-weight: 300; }
        .hero-stat p { font-size: 0.8rem; color: rgba(255,255,255,0.6); letter-spacing: 0.05em; margin-top: 4px; }
        .hero-scroll { position: absolute; bottom: 40px; right: 48px; display: flex; align-items: center; gap: 12px; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); writing-mode: vertical-rl; }
        .hero-scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.4)); }

        /* ABOUT */
        .about { padding: 140px 0; background: var(--offwhite); }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .about-images { position: relative; }
        .about-img-main { border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4/5; box-shadow: var(--shadow-lg); }
        .about-img-main img { width: 100%; height: 100%; object-fit: cover; }
        .about-img-accent { position: absolute; bottom: -40px; right: -40px; width: 55%; border-radius: var(--radius); overflow: hidden; aspect-ratio: 1; box-shadow: var(--shadow-lg); border: 4px solid var(--offwhite); }
        .about-img-accent img { width: 100%; height: 100%; object-fit: cover; }
        .about-experience { position: absolute; top: 40px; left: -20px; background: var(--moss); color: #fff; padding: 20px 24px; border-radius: var(--radius); text-align: center; }
        .about-experience h3 { font-size: 2rem; color: var(--gold); font-weight: 300; }
        .about-experience p { font-size: 0.75rem; letter-spacing: 0.1em; opacity: 0.8; margin-top: 4px; }
        .about-content { padding-left: 20px; }
        .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
        .about-feature { display: flex; align-items: flex-start; gap: 14px; padding: 20px; background: var(--beige); border-radius: var(--radius-sm); }
        .about-feature-icon { width: 40px; height: 40px; background: rgba(47,79,62,0.08); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--moss); flex-shrink: 0; }
        .about-feature h4 { font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
        .about-feature p { font-size: 0.8rem; color: var(--text-light); }

        /* SERVICES */
        .services { padding: 140px 0; background: var(--moss); }
        .services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; gap: 40px; }
        .services-header .section-title { color: #fff; margin-bottom: 0; }
        .services-header .section-subtitle { color: rgba(255,255,255,0.6); }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .service-card { background: rgba(255,255,255,0.05); border-radius: var(--radius); overflow: hidden; border: 1px solid rgba(255,255,255,0.08); transition: all 0.4s var(--transition); }
        .service-card:hover { transform: translateY(-8px); background: rgba(255,255,255,0.08); border-color: rgba(196,166,107,0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .service-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .service-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--transition); }
        .service-card:hover .service-card-img img { transform: scale(1.08); }
        .service-card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(47,79,62,0.6), transparent); }
        .service-card-price { position: absolute; bottom: 16px; left: 16px; z-index: 1; background: var(--gold); color: #fff; font-size: 0.78rem; font-weight: 600; padding: 6px 14px; border-radius: 100px; letter-spacing: 0.04em; }
        .service-card-body { padding: 24px; }
        .service-card-body h3 { font-size: 1.4rem; color: #fff; margin-bottom: 10px; }
        .service-card-body p { font-size: 0.88rem; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 20px; }
        .service-card-body .btn-outline { border-color: rgba(196,166,107,0.4); color: var(--gold); font-size: 0.78rem; padding: 10px 22px; }
        .service-card-body .btn-outline:hover { background: var(--gold); color: #fff; border-color: var(--gold); }

        /* PORTFOLIO */
        .portfolio { padding: 140px 0; background: var(--offwhite); }
        .portfolio-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
        .portfolio-grid { display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: 320px 320px; gap: 16px; }
        .portfolio-item { position: relative; overflow: hidden; border-radius: var(--radius); }
        .portfolio-item:nth-child(1) { grid-column: 1 / 6; grid-row: 1; }
        .portfolio-item:nth-child(2) { grid-column: 6 / 9; grid-row: 1; }
        .portfolio-item:nth-child(3) { grid-column: 9 / 13; grid-row: 1 / 3; }
        .portfolio-item:nth-child(4) { grid-column: 1 / 5; grid-row: 2; }
        .portfolio-item:nth-child(5) { grid-column: 5 / 9; grid-row: 2; }
        .portfolio-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--transition); }
        .portfolio-item:hover img { transform: scale(1.06); }
        .portfolio-item-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); color: #fff; transform: translateY(10px); opacity: 0; transition: all 0.3s var(--transition); }
        .portfolio-item:hover .portfolio-item-label { transform: translateY(0); opacity: 1; }
        .portfolio-item-label h4 { font-size: 1.1rem; }
        .portfolio-item-label span { font-size: 0.78rem; color: var(--gold); letter-spacing: 0.08em; }

        /* TESTIMONIALS */
        .testimonials { padding: 140px 0; background: var(--beige); }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials .section-title { color: var(--moss); }
        .testimonials-header .section-subtitle { margin: 0 auto; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: #fff; border-radius: var(--radius); padding: 36px; box-shadow: var(--shadow-md); transition: all 0.4s var(--transition); }
        .testimonial-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .testimonial-stars { display: flex; gap: 4px; margin-bottom: 20px; }
        .testimonial-stars svg { width: 18px; height: 18px; fill: var(--gold); }
        .testimonial-card blockquote { font-size: 0.95rem; font-weight: 300; color: var(--text-mid); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 14px; }
        .testimonial-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .testimonial-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .testimonial-author-info h4 { font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--text-dark); }
        .testimonial-author-info p { font-size: 0.78rem; color: var(--text-light); }

        /* FAQ */
        .faq { padding: 140px 0; background: var(--offwhite); }
        .faq-layout { display: grid; grid-template-columns: 400px 1fr; gap: 80px; align-items: start; }
        .faq .section-title { color: var(--moss); }
        .faq-list { display: flex; flex-direction: column; gap: 0; }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
        .faq-item:first-child { border-top: 1px solid rgba(0,0,0,0.08); }
        .faq-question { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 0; background: none; text-align: left; font-size: 1rem; font-weight: 500; color: var(--text-dark); transition: color 0.3s; }
        .faq-question:hover { color: var(--moss); }
        .faq-icon { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); transition: all 0.3s; }
        .faq-icon svg { width: 14px; height: 14px; transition: transform 0.3s; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .faq-answer-inner { padding-bottom: 20px; font-size: 0.92rem; font-weight: 300; color: var(--text-mid); line-height: 1.7; }
        .faq-item.active .faq-icon { background: var(--gold); border-color: var(--gold); color: #fff; }
        .faq-item.active .faq-icon svg { transform: rotate(45deg); }

        /* CTA */
        .cta { padding: 120px 0; background: linear-gradient(135deg, var(--moss), #1a3328); position: relative; overflow: hidden; }
        .cta::before { content: ''; position: absolute; top: -50%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(196,166,107,0.08) 0%, transparent 70%); border-radius: 50%; }
        .cta-inner { text-align: center; max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
        .cta-inner h2 { font-size: clamp(2.5rem, 5vw, 4rem); color: #fff; margin-bottom: 16px; }
        .cta-inner h2 em { color: var(--gold); font-style: italic; }
        .cta-inner p { font-size: 1.05rem; font-weight: 300; color: rgba(255,255,255,0.7); margin-bottom: 44px; }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .cta-whatsapp { display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; background: #25D366; color: #fff; font-size: 0.85rem; font-weight: 500; border-radius: 100px; transition: all 0.3s var(--transition); }
        .cta-whatsapp:hover { background: #20ba59; transform: translateY(-2px); }

        /* FOOTER */
        .footer { background: #0f1f18; padding: 80px 0 40px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 60px; }
        .footer .nav-logo { color: #fff; font-size: 1.6rem; display: block; margin-bottom: 16px; }
        .footer-brand p { font-size: 0.88rem; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 280px; margin-bottom: 28px; }
        .footer-social { display: flex; gap: 12px; }
        .footer-social a { width: 38px; height: 38px; background: rgba(255,255,255,0.06); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all 0.3s; }
        .footer-social a svg { width: 16px; height: 16px; fill: currentColor; }
        .footer-social a:hover { background: var(--gold); color: #fff; }
        .footer-col h4 { font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a { font-size: 0.88rem; font-weight: 300; color: rgba(255,255,255,0.45); transition: color 0.3s; }
        .footer-col ul li a:hover { color: var(--gold); }
        .footer-col p { font-size: 0.88rem; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.8; }
        .footer-bottom { padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-bottom p { font-size: 0.8rem; color: rgba(255,255,255,0.25); }

        /* WHATSAPP FLOAT */
        .whatsapp-float { position: fixed; bottom: 28px; right: 28px; z-index: 500; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(37,211,102,0.4); transition: all 0.3s var(--transition); }
        .whatsapp-float:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.5); }
        .whatsapp-float svg { width: 28px; height: 28px; fill: #fff; }

        /* REVEAL ANIMATIONS */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .reveal-delay-5 { transition-delay: 0.5s; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .about-grid { gap: 48px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-toggle { display: flex; }
          .hero h1 { font-size: 3rem; }
          .hero-stats { gap: 28px; }
          .about-grid { grid-template-columns: 1fr; }
          .about-img-accent { display: none; }
          .about-content { padding-left: 0; }
          .services-grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
          .portfolio-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .portfolio-item { grid-column: auto !important; grid-row: auto !important; aspect-ratio: 1; }
          .portfolio-item:nth-child(1) { grid-column: span 2 !important; aspect-ratio: 16/9; }
          .testimonials-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .faq-layout { grid-template-columns: 1fr; gap: 40px; }
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .hero-buttons { flex-direction: column; }
          .hero-buttons .btn-primary, .hero-buttons .btn-secondary { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="container nav-inner">
          <a href="#" className="nav-logo">Afro <span>Raiz</span></a>
          <ul className="nav-links">
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#servicos">Servicos</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><Link href="/agendar" className="nav-book">Agendar Agora</Link></li>
          </ul>
          <button className="nav-toggle" id="navToggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-menu" id="mobileMenu">
        <button className="mobile-close" id="mobileClose">&times;</button>
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Servicos</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#depoimentos">Depoimentos</a>
        <a href="#faq">FAQ</a>
        <Link href="/agendar">Agendar Agora</Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=1920&q=80" alt="Mulher com tranças lindas" />
        </div>
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Especialista em Cabelos Afro</div>
            <h1>A Arte das<br /><em>Tranças Perfeitas</em></h1>
            <p className="hero-desc">Onde a heranca cultural encontra a elegancia contemporanea. Tranças artesanais criadas por especialistas em um ambiente de cuidado e acolhimento.</p>
            <div className="hero-buttons">
              <Link href="/agendar" className="btn-primary">
                Agendar Horario
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#servicos" className="btn-secondary">Ver Servicos</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><h3>8+</h3><p>Anos de Experiencia</p></div>
              <div className="hero-stat"><h3>500+</h3><p>Clientes Atendidas</p></div>
              <div className="hero-stat"><h3>5.0</h3><p>Avaliacao Media</p></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* SOBRE */}
      <section className="about" id="sobre">
        <div className="container">
          <div className="about-grid">
            <div className="about-images reveal">
              <div className="about-img-main">
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" alt="Salao" />
              </div>
              <div className="about-img-accent">
                <img src="https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&q=80" alt="Detalhe de tranca" />
              </div>
              <div className="about-experience">
                <h3>8+</h3>
                <p>Anos de Expertise</p>
              </div>
            </div>
            <div className="about-content">
              <span className="section-label reveal">Nossa Historia</span>
              <h2 className="section-title reveal reveal-delay-1">Arte e Identidade<br />em cada Tranca</h2>
              <p className="section-subtitle reveal reveal-delay-2">Fundado no respeito profundo pelas tradicoes do cabelo afro, o Afro Raiz e muito mais que um salao — e um espaco onde arte, cultura e cuidado se encontram. Cada tranca conta uma historia, e nossa especialista e a narradora.</p>
              <p className="section-subtitle reveal reveal-delay-3" style={{marginTop: '16px'}}>Com anos de experiencia em tecnicas ancestrais e estilos contemporaneos, garantimos que cada cliente saia se sentindo confiante, linda e conectada as suas raizes.</p>
              <div className="about-features reveal reveal-delay-4">
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div><h4>Especialista Certificada</h4><p>Tecnicas ancestrais e contemporaneas</p></div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <div><h4>Produtos Premium</h4><p>Apenas os melhores cuidados capilares</p></div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div><h4>Agenda Inteligente</h4><p>Tempo real por servico, sem pressa</p></div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div><h4>Atendimento Personalizado</h4><p>Exclusividade e atencao total</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICOS */}
      <section className="services" id="servicos">
        <div className="container">
          <div className="services-header">
            <div>
              <span className="section-label reveal">O Que Oferecemos</span>
              <h2 className="section-title reveal reveal-delay-1">Nossos Servicos</h2>
            </div>
            <p className="section-subtitle reveal reveal-delay-2">Cada servico tem duracao exclusiva reservada para voce. Sem horarios fixos — apenas o tempo que o seu cabelo merece.</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80" alt="Box Braids" />
                <span className="service-card-price">A partir de R$ 350</span>
              </div>
              <div className="service-card-body">
                <h3>Box Braids</h3>
                <p>Tranças box individuais em qualquer espessura e comprimento. Versatilidade classica com elegancia moderna que dura semanas.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-1">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&q=80" alt="Nago" />
                <span className="service-card-price">A partir de R$ 150</span>
              </div>
              <div className="service-card-body">
                <h3>Nago</h3>
                <p>Trancas raiz nago com fixacao duradoura e acabamento impecavel. Estilo que resiste e valoriza a beleza natural.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-2">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1617273811826-d0606024440f?w=600&q=80" alt="Tranca Simples" />
                <span className="service-card-price">A partir de R$ 80</span>
              </div>
              <div className="service-card-body">
                <h3>Tranca Simples</h3>
                <p>Classica e versatil, ideal para o dia a dia. Tecnica tradicional com acabamento delicado e duradouro.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-3">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80" alt="Mega Hair" />
                <span className="service-card-price">A partir de R$ 500</span>
              </div>
              <div className="service-card-body">
                <h3>Mega Hair</h3>
                <p>Aplique de mega hair para volume, comprimento e transformacao completa. Uma experiencia de renovacao total.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-4">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=600&q=80" alt="Tranca Personalizada" />
                <span className="service-card-price">A partir de R$ 200</span>
              </div>
              <div className="service-card-body">
                <h3>Tranca Personalizada</h3>
                <p>Estilo sob consulta — referencias, mistura de tecnicas e criações exclusivas. Arte feita sob medida para voce.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-5">
              <div className="service-card-img">
                <img src="https://images.unsplash.com/photo-1634302086738-b9d1e3d67e47?w=600&q=80" alt="Tratamento Capilar" />
                <span className="service-card-price">A partir de R$ 120</span>
              </div>
              <div className="service-card-body">
                <h3>Tratamento Capilar</h3>
                <p>Hidratacao profunda, oleo quente e terapias capilares que restauram a vitalidade. Porque cabelo saudavel e a base de tudo.</p>
                <Link href="/agendar" className="btn-outline">Agendar</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="portfolio-header">
            <div>
              <span className="section-label reveal">Nosso Trabalho</span>
              <h2 className="section-title reveal reveal-delay-1">Portfolio</h2>
              <p className="section-subtitle reveal reveal-delay-2">Uma selecao curada da nossa arte — cada tranca, cada padrao, cada detalhe feito com intencao.</p>
            </div>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="btn-outline reveal reveal-delay-3">Ver no Instagram</a>
          </div>
          <div className="portfolio-grid">
            <div className="portfolio-item reveal">
              <img src="https://images.unsplash.com/photo-1589156280159-276f8a7e8364?w=900&q=80" alt="Portfolio 1" />
              <div className="portfolio-item-label"><h4>Elegancia Natural</h4><span>Box Braids</span></div>
            </div>
            <div className="portfolio-item reveal reveal-delay-1">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80" alt="Portfolio 2" />
              <div className="portfolio-item-label"><h4>Hora Dourada</h4><span>Nago</span></div>
            </div>
            <div className="portfolio-item reveal reveal-delay-2">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" alt="Portfolio 3" />
              <div className="portfolio-item-label"><h4>Padrao Real</h4><span>Tranca Personalizada</span></div>
            </div>
            <div className="portfolio-item reveal reveal-delay-3">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" alt="Portfolio 4" />
              <div className="portfolio-item-label"><h4>Beleza Autentica</h4><span>Tranca Simples</span></div>
            </div>
            <div className="portfolio-item reveal reveal-delay-4">
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80" alt="Portfolio 5" />
              <div className="portfolio-item-label"><h4>Arte Capilar</h4><span>Mega Hair</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="testimonials" id="depoimentos">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-label reveal">Clientes</span>
            <h2 className="section-title reveal reveal-delay-1">O Que Dizem Nossas Clientes</h2>
            <p className="section-subtitle reveal reveal-delay-2">A confianca das nossas clientes e o maior elogio que recebemos.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <blockquote>A melhor experiencia de trancas que ja tive. A atencao ao detalhe e incomparavel, e minhas box braids duraram lindas por 8 semanas.</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar"><img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" alt="Ana Paula" /></div>
                <div className="testimonial-author-info"><h4>Ana Paula S.</h4><p>Cliente de Box Braids</p></div>
              </div>
            </div>
            <div className="testimonial-card reveal reveal-delay-1">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <blockquote>Meu nago ficou uma obra de arte. Recebi tantos elogios! O ambiente e acolhedor e o atendimento e completamente personalizado.</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Fatima D." /></div>
                <div className="testimonial-author-info"><h4>Fatima D.</h4><p>Cliente de Nago</p></div>
              </div>
            </div>
            <div className="testimonial-card reveal reveal-delay-2">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <blockquote>Sao tres anos vindo aqui. O tratamento restaurou minhas madeixas e as tranças ficam sempre impecaveis. Nao confiaria em mais ninguem.</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Nia J." /></div>
                <div className="testimonial-author-info"><h4>Nia J.</h4><p>Cliente Fiel</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="faq-layout">
            <div>
              <span className="section-label reveal">FAQ</span>
              <h2 className="section-title reveal reveal-delay-1">Perguntas<br />Frequentes</h2>
              <p className="section-subtitle reveal reveal-delay-2">Tudo o que voce precisa saber antes da sua visita. Nao encontrou sua resposta? Fale diretamente conosco.</p>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}`} className="btn-outline reveal reveal-delay-3" style={{marginTop: '24px'}}>Falar no WhatsApp</a>
            </div>
            <div className="faq-list" id="faqList">
              {[
                {q: 'Quanto tempo duram as trancas?', a: 'Com o cuidado adequado, nossas trancas duram entre 6 a 8 semanas. Fornecemos instrucoes detalhadas de manutencao apos o atendimento.'},
                {q: 'Preciso levar o cabelo para aplique?', a: 'Nao necessariamente. Podemos fornecer o material mediante orcamento previo. Mas se preferir uma marca especifica, pode trazer o seu.'},
                {q: 'Quanto tempo dura uma sessao?', a: 'Depende do servico. Tranca Simples: cerca de 2h. Nago: 3h. Box Braids: 5h. Mega Hair: ate 6h. O tempo e reservado exclusivamente para voce.'},
                {q: 'Como funciona o agendamento online?', a: 'Voce escolhe o servico, a data e o sistema mostra apenas horarios realmente disponiveis com base na duracao real do seu servico. Sem slots fixos.'},
                {q: 'Qual a politica de cancelamento?', a: 'Cancelamentos com mais de 24h de antecedencia sao gratuitos. Para cancelamentos com menos de 24h, pode ser cobrada uma taxa. Entre em contato e sempre buscamos uma solucao.'},
                {q: 'Voces atendem criancas?', a: 'Sim! Atendemos clientes de todas as idades. Nossas profissionais tem experiencia com cabelos infantis e tomam cuidado extra para garantir uma experiencia confortavel.'},
              ].map((item, i) => (
                <div key={i} className={`faq-item reveal${i > 0 ? ` reveal-delay-${Math.min(i, 5)}` : ' active'}`}>
                  <button className="faq-question">
                    {item.q}
                    <span className="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="contato">
        <div className="container">
          <div className="cta-inner reveal">
            <span className="section-label">Pronta?</span>
            <h2>Comece sua <em>Jornada</em><br />de Beleza</h2>
            <p>Agende seu horario hoje e viva a experiencia do Afro Raiz.</p>
            <div className="cta-buttons">
              <Link href="/agendar" className="btn-primary">
                Agendar Horario
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}`} className="cta-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="nav-logo">Afro <span>Raiz</span></a>
              <p>Onde a heranca cultural encontra a elegancia contemporanea. Especialistas em trancas e cabelos afro dedicados a arte da beleza autentica.</p>
              <div className="footer-social">
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Servicos</h4>
              <ul>
                <li><Link href="/agendar">Box Braids</Link></li>
                <li><Link href="/agendar">Nago</Link></li>
                <li><Link href="/agendar">Tranca Simples</Link></li>
                <li><Link href="/agendar">Mega Hair</Link></li>
                <li><Link href="/agendar">Tranca Personalizada</Link></li>
                <li><Link href="/agendar">Tratamento Capilar</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contato</h4>
              <p>Sao Paulo — SP<br /><br />WhatsApp:<br />(11) 99353-7874<br /><br />Instagram:<br />@afroraiz</p>
            </div>
            <div className="footer-col">
              <h4>Horario de Atendimento</h4>
              <p>Terca a Sexta<br />9h00 — 19h00<br /><br />Sabado<br />9h00 — 17h00<br /><br />Domingo e Segunda<br />Sem atendimento</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Afro Raiz. Todos os direitos reservados.</p>
            <p>Feito com cuidado em Sao Paulo</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}?text=Ola!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servicos.`} className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <LandingScripts />
    </>
  )
}
