import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Menu,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

const FractureGlass = lazy(() => import('../FractureGlass'));

type ScrollDirection = 'down' | 'up';
const ScrollDirectionContext = createContext<ScrollDirection>('down');

function ScrollDirectionProvider({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState<ScrollDirection>('down');
  const directionRef = useRef<ScrollDirection>('down');

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious();
    const delta = current - previous;
    if (Math.abs(delta) < 1) return;

    const next: ScrollDirection = delta > 0 ? 'down' : 'up';
    if (next !== directionRef.current) {
      directionRef.current = next;
      setDirection(next);
    }
  });

  useEffect(() => {
    document.documentElement.dataset.scrollDirection = direction;
    return () => {
      delete document.documentElement.dataset.scrollDirection;
    };
  }, [direction]);

  const value = useMemo(() => direction, [direction]);
  return <ScrollDirectionContext.Provider value={value}>{children}</ScrollDirectionContext.Provider>;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="page-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.14, margin: '-6% 0px -6% 0px' });
  const direction = useContext(ScrollDirectionContext);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={isInView
        ? { opacity: 1, y: 0, rotateX: 0 }
        : { opacity: 0, y: direction === 'down' ? 36 : -36, rotateX: direction === 'down' ? -1.6 : 1.6 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1100, transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  );
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Proof', href: '#competitive' },
  { label: 'Contact', href: '#contact' },
];

function ResumeLink({ className = '' }: { className?: string }) {
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`resume-link ${className}`}
      aria-label="Open Devansh Singh Bais's resume PDF in a new tab"
    >
      <span>Resume</span>
      <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

function SiteHeader({ isPlaying, onToggleMelody }: { isPlaying: boolean; onToggleMelody: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <a href="#home" className="wordmark" aria-label="Devansh Singh Bais, home" onClick={closeMenu}>
          devansh<span>.bais</span><i>()</i>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="header-tools">
          <ResumeLink />
          <button
            type="button"
            className="melody-toggle"
            onClick={onToggleMelody}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause background melody' : 'Play background melody'}
            title={isPlaying ? 'Pause background melody' : 'Play background melody'}
          >
            {isPlaying ? <Volume2 size={15} strokeWidth={1.8} /> : <VolumeX size={15} strokeWidth={1.8} />}
            <span>{isPlaying ? 'Sound on' : 'Sound off'}</span>
          </button>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
            ))}
            <ResumeLink />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionHeading({ number, label, children }: {
  number: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal className="section-heading">
      <div className="section-index"><span>{number}</span><span className="index-rule" />{label}</div>
      <h2>{children}</h2>
    </ScrollReveal>
  );
}

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-fracture-anchor" aria-hidden="true">
        <Suspense fallback={null}>
          <FractureGlass />
        </Suspense>
      </div>

      <div className="site-container hero-content">
        <div className="hero-layout">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-kicker"><span>01</span><i />AI / Systems / Real world</p>
            <h1>
              I build AI systems that <em>survive</em> outside notebooks.
            </h1>
            <p className="hero-description">
              Most AI prototypes look impressive in a slide deck but crumble under real workloads. I design real-time vision pipelines with YOLO &amp; ByteTrack, LLM agents with function schemas, and reliable backends that don&apos;t choke when throughput spikes.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#projects">Explore projects <ArrowDown size={16} aria-hidden="true" /></a>
              <a className="button-quiet" href="https://github.com/DevanshSinghBais" target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          <ScrollReveal className="hero-code-wrap" delay={0.15}>
            <div className="hero-code-head">
              <span>three.js</span><span>src / FractureGlass.tsx</span>
            </div>
            <pre className="hero-code"><code>
              <span><b>const</b> scene = <b>new</b> THREE.Scene();</span>
              <span><b>const</b> camera = <b>new</b> THREE.PerspectiveCamera(</span>
              <span>  FOV, 1, 0.1, 100</span>
              <span>);</span>
              <span>camera.position.set(0, 0, CAM_Z);</span>
              <span className="code-gap"> </span>
              <span>renderer.render(scene, camera);<i className="type-caret" aria-hidden="true" /></span>
            </code></pre>
            <div className="hero-code-foot"><span>From the scene you sent</span><span>01 / 03</span></div>
          </ScrollReveal>
        </div>

        <div className="hero-bottom">
          <div className="hero-facts">
            <div><span>Location</span><strong>Bhopal, India</strong></div>
            <div><span>Education</span><strong>MANIT Bhopal · 9.15 / 10</strong></div>
            <div><span>Achievement</span><strong>1st Place · SISTec Hackathon</strong></div>
          </div>
          <a className="scroll-hint" href="#about"><span>Scroll to explore</span><ArrowDown size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

const timeline = [
  {
    date: '2025–Present · BCI Club, MANIT',
    text: 'Research & Technical Executive: exploring AI/ML and brain-computer interfaces, and mentoring peers on technical projects.',
  },
  {
    date: '2025 · BITS Pilani Webathon',
    text: 'Won 1st Prize with SafeHer, a women’s safety platform for location-aware services and emergency alerts.',
  },
  {
    date: '2026 · SISTec Hackathon',
    text: 'Won 1st Place with Team QBurn for CrowdShield AI, a computer-vision crowd-safety system.',
  },
  {
    date: 'Current focus',
    text: 'Multi-object vision tracking, tool-calling agents, and competitive algorithms.',
  },
];

const focusAreas = [
  {
    title: 'Computer Vision & Multi-Camera Tracking',
    text: 'Working hands-on with YOLOv8, ByteTrack, and OpenCV. Calculating velocity vectors, directional line crossings, and density projections for spatial monitoring.',
  },
  {
    title: 'LLM Tool Use & Retrieval Architecture',
    text: 'Connecting models like Gemini and local LLMs to executable Python tools, dynamic function schemas, and RAG pipelines for contextual reasoning.',
  },
  {
    title: 'High-Throughput Backends & Distributed Systems',
    text: 'Engineering APIs with FastAPI, Node.js, WebSockets, and PostgreSQL. Dockerizing services for reproducible environments from local GPUs to cloud instances.',
  },
];

function AboutSection() {
  return (
    <section id="about" className="content-section about-section">
      <div className="site-container">
        <SectionHeading number="02" label="Origin & mindset">The developer behind the code.</SectionHeading>
        <div className="about-grid">
          <ScrollReveal className="timeline-column">
            <div className="profile-photo-wrap">
              <img
                src="https://avatars.githubusercontent.com/u/229690909?v=4"
                alt="Devansh Singh Bais"
                className="profile-photo"
                loading="lazy"
              />
              <span className="profile-photo-caption">MANIT Bhopal · CSE</span>
            </div>
            <ol className="timeline-list">
              {timeline.map((item) => (
                <li key={item.date}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <div><strong>{item.date}</strong><p>{item.text}</p></div>
                </li>
              ))}
            </ol>
          </ScrollReveal>

          <div className="about-copy">
            <ScrollReveal>
              <p className="lead-copy">
                I am an AI/ML engineer in progress at <strong>MANIT Bhopal</strong>, pursuing B.Tech CSE with a 9.15/10 CGPA. I care about the messy middle ground between training a neural network and making it work reliably in production.
              </p>
              <p className="body-copy">
                When working on deep learning systems, the model is usually only 20% of the challenge. The real engineering is in streaming video frames without dropping frame rates, keeping bounding boxes stable across occlusions, sanitizing LLM outputs into structured JSON schemas, and writing APIs that fail gracefully.
              </p>
            </ScrollReveal>

            <div className="focus-list">
              {focusAreas.map((focus, index) => (
                <ScrollReveal className="focus-row" key={focus.title} delay={index * 0.04}>
                  <span className="focus-number">0{index + 1}</span>
                  <div><h3>{focus.title}</h3><p>{focus.text}</p></div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="ethos-line">
              <span>&gt; ethos:</span> “Build carefully. Ship useful things. Keep the architecture honest.”
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const skillGroups = [
  {
    category: 'Vision & Deep Learning',
    description: 'Model inference, spatial bounding, and multi-object tracking pipelines.',
    items: ['TensorFlow', 'OpenCV', 'YOLOv8', 'ByteTrack', 'PyTorch', 'Keras', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib'],
  },
  {
    category: 'LLMs & Generative AI',
    description: 'Structured outputs, dynamic function schemas, and agentic workflows.',
    items: ['OpenAI API', 'Gemini API', 'Anthropic API', 'Hugging Face', 'LangChain', 'LangGraph', 'Tool Calling', 'RAG', 'Gradio'],
  },
  {
    category: 'Languages & Core DSA',
    description: 'Primary tools for system architecture and competitive problem-solving.',
    items: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'C', 'Java', 'HTML', 'CSS'],
  },
  {
    category: 'Backends & Distributed Systems',
    description: 'Scalable APIs, WebSocket streaming, and containerized deployment.',
    items: ['FastAPI', 'Flask', 'Node.js', 'Express', 'WebSockets', 'REST APIs', 'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'Linux', 'Git'],
  },
];

function SkillsSection() {
  return (
    <section id="skills" className="content-section skills-section">
      <div className="site-container">
        <SectionHeading number="03" label="Tools & telemetry">The technical spectrum.</SectionHeading>
        <div className="skill-list">
          {skillGroups.map((group, index) => (
            <ScrollReveal className="skill-row" key={group.category} delay={index * 0.035}>
              <span className="skill-number">0{index + 1}</span>
              <div className="skill-intro">
                <h3>{group.category}</h3>
                <p>{group.description}</p>
              </div>
              <ul className="skill-items" aria-label={`${group.category} tools`}>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const otherProjects = [
  {
    title: 'SafeHer',
    subtitle: 'Women’s safety platform · 1st Prize, BITS Pilani Webathon 2025',
    tags: 'TypeScript / PostgreSQL / Web APIs / Location Services',
    url: '/resume.pdf',
    resume: true,
  },
  {
    title: 'StudyPilot',
    subtitle: 'Autonomous study agent · experience across 25+ API integrations',
    tags: 'Python / LLM API / Tool Calling / Gradio / RAG',
    url: 'https://github.com/DevanshSinghBais/StudyPilot',
  },
  {
    title: 'GitHub Repo Explainer',
    subtitle: 'AST code parsing and Gemini API token streaming',
    tags: 'Python / Gemini API / GitHub REST API / AST Parsing',
    url: 'https://github.com/DevanshSinghBais/GitHub-Repo-Explainer',
  },
  {
    title: 'Pneumonia Detection',
    subtitle: 'Chest X-ray neural classifier & activation maps',
    tags: 'Python / TensorFlow / Keras / Medical Imaging',
    url: 'https://github.com/DevanshSinghBais/Pneumonia_Detection',
  },
];

const crowdPeople: Array<[number, number, number]> = [
  [22, 28, 0.76], [51, 47, 0.9], [79, 28, 0.72], [108, 42, 0.92],
  [145, 25, 0.78], [32, 83, 0.95], [70, 77, 0.72], [124, 86, 1.02],
];

const detectionBounds: Array<[number, number, number, number]> = [
  [15, 18, 13, 24], [44, 34, 14, 27], [73, 17, 12, 23], [100, 28, 16, 27],
  [138, 14, 14, 25], [25, 69, 15, 27], [64, 64, 13, 23], [116, 70, 17, 28],
];

const crowdStages = ['frame', 'detection', 'track', 'route'];

function CrowdStage({ stage }: { stage: number }) {
  return (
    <div className="crowd-stage">
      <div className="crowd-stage-heading">
        <span>{crowdStages[stage]}</span>
        {stage < 3 && <ArrowRight size={13} strokeWidth={1.5} aria-hidden="true" />}
      </div>
      <svg className="crowd-stage-svg" viewBox="0 0 180 112" aria-hidden="true">
        <defs>
          <linearGradient id={'crowd-surface-' + stage} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#50606b" />
            <stop offset="1" stopColor="#283640" />
          </linearGradient>
          <pattern id={'crowd-grid-' + stage} width="28" height="22" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V22" fill="none" stroke="#d8e1e5" strokeOpacity=".12" strokeWidth=".65" />
          </pattern>
        </defs>
        <rect width="180" height="112" fill={'url(#crowd-surface-' + stage + ')'} />
        <path d="M0 24 180 11M0 48 180 42M0 76 180 78M0 99 180 108" stroke="#dce4e6" strokeOpacity=".16" strokeWidth="1" />
        <path d="M0 0 180 112M40 0 130 112M100 0 180 65M0 57 92 112" stroke="#101820" strokeOpacity=".28" strokeWidth="1" />
        <rect width="180" height="112" fill={'url(#crowd-grid-' + stage + ')'} />
        {crowdPeople.map(([x, y, scale], index) => (
          <g key={index} transform={'translate(' + x + ' ' + y + ') scale(' + scale + ')'}>
            <ellipse cx="0" cy="8" rx="5.5" ry="2.1" fill="#101820" opacity=".42" />
            <circle cx="0" cy="-5" r="2.5" fill={index % 3 === 0 ? '#c7d0d5' : '#aab6bd'} />
            <path d="M-3-2Q0-4 3-2L4 5 2 7H-2L-4 5Z" fill={index % 2 ? '#3d4b55' : '#596771'} />
          </g>
        ))}
        {stage > 0 && detectionBounds.map(([x, y, width, height], index) => (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            fill="none"
            stroke={stage === 1 ? '#e1704a' : index % 2 ? '#87b4c1' : '#a6c88d'}
            strokeWidth="1.1"
          />
        ))}
        {stage === 2 && (
          <g className="crowd-id-labels" fontFamily="monospace" fontSize="7" fontWeight="600">
            <text x="44" y="31" fill="#b9d9e2">ID 12</text>
            <text x="100" y="25" fill="#e9a271">ID 07</text>
            <text x="114" y="68" fill="#b9d99c">ID 19</text>
          </g>
        )}
        {stage === 3 && (
          <g fill="none" strokeWidth="2" strokeDasharray="4 4" opacity=".95">
            <path d="M28 89C47 64 52 69 69 42S101 28 118 16" stroke="#e1704a" />
            <path d="M71 85C88 62 107 69 123 49S145 34 161 25" stroke="#b9d99c" />
            <path d="M38 26C52 40 68 55 93 54S122 75 144 87" stroke="#87b4c1" />
          </g>
        )}
      </svg>
    </div>
  );
}

function CrowdShieldDiagram() {
  return (
    <div className="pipeline-diagram" role="img" aria-label="CrowdShield AI visual pipeline showing a camera frame, object detection, multi-object tracking, and route paths">
      <div className="pipeline-label">
        <strong>CrowdShield AI</strong>
        <span>// real-time multi-object tracking</span>
      </div>
      <div className="crowd-stage-grid">
        {crowdStages.map((stage, index) => <CrowdStage key={stage} stage={index} />)}
      </div>
      <div className="pipeline-foot"><span>YOLOv8 + ByteTrack</span><span>frame / detection / track / route</span></div>
    </div>
  );
}

function FlameVisual() {
  return (
    <div className="flame-visual" role="img" aria-label="Illustrative microgravity combustion research scene with a free-floating flame and NASA source links">
      <div className="flame-visual-head"><strong>FLAME IN FREEFALL</strong><span>MICROGRAVITY / 0 G</span></div>
      <svg className="flame-scene" viewBox="0 0 560 220" aria-hidden="true">
        <defs>
          <radialGradient id="flame-halo">
            <stop offset="0" stopColor="#e79b62" stopOpacity=".3" />
            <stop offset="1" stopColor="#e79b62" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flame-core-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#cc472e" />
            <stop offset=".5" stopColor="#ed9a51" />
            <stop offset="1" stopColor="#f6d39e" />
          </linearGradient>
        </defs>
        <path className="flame-orbit" d="M62 112C119 26 420 24 497 108S126 208 62 112Z" />
        <path className="flame-orbit flame-orbit-faint" d="M90 55C180 168 366 168 469 59" />
        <circle cx="105" cy="89" r="2" fill="#91b0ba" />
        <circle cx="440" cy="149" r="2.5" fill="#e79b62" />
        <circle cx="365" cy="46" r="1.8" fill="#d8e2e4" />
        <circle cx="179" cy="173" r="1.8" fill="#d8e2e4" />
        <ellipse cx="281" cy="118" rx="89" ry="70" fill="url(#flame-halo)" />
        <ellipse className="flame-vessel" cx="281" cy="118" rx="70" ry="52" />
        <path className="flame-core" d="M281 157C239 143 232 115 252 87C260 75 272 69 276 50C296 77 325 96 315 123C309 142 295 153 281 157Z" fill="url(#flame-core-gradient)" />
        <path className="flame-core-inner" d="M281 146C263 135 261 119 272 104C278 96 282 88 282 78C296 97 303 108 298 124C295 135 288 143 281 146Z" />
        <path className="flame-sensor-line" d="M160 118H210M352 118H404" />
        <circle cx="160" cy="118" r="3" fill="#8eb7c0" />
        <circle cx="404" cy="118" r="3" fill="#8eb7c0" />
        <text x="281" y="204" textAnchor="middle" className="flame-svg-caption">SOURCE-GROUNDED COMBUSTION RESEARCH</text>
      </svg>
      <div className="flame-visual-foot"><span>NASA NTRS</span><span>Gemini research assistant</span><span>Traceable sources</span></div>
    </div>
  );
}

function TeslaVisual() {
  return (
    <div className="tsla-visual" role="img" aria-label="Illustrative Tesla LSTM forecasting chart with a 60-day input window and next-day closing price output">
      <div className="tsla-visual-head"><strong>TSLA / LSTM</strong><span>DAILY CLOSE / 2019-2024</span></div>
      <svg className="tsla-chart" viewBox="0 0 560 185" aria-hidden="true">
        <g className="tsla-chart-grid">
          <path d="M46 22H542M46 57H542M46 92H542M46 127H542M46 162H542" />
          <path d="M46 22V162M170 22V162M294 22V162M418 22V162M542 22V162" />
        </g>
        <path className="tsla-history-line" d="M48 137 70 128 92 134 114 113 136 117 158 95 180 105 202 91 224 102 246 75 268 82 290 65 312 77 334 59 356 67 378 43 400 52 422 39" />
        <line className="tsla-cutover" x1="432" y1="22" x2="432" y2="162" />
        <path className="tsla-forecast-line" d="M422 39C445 34 458 52 476 47S509 59 540 41" />
        <circle className="tsla-forecast-dot" cx="540" cy="41" r="4" />
        <text x="49" y="177" className="tsla-chart-label">60-DAY LOOKBACK</text>
        <text x="442" y="177" className="tsla-chart-label">NEXT CLOSE</text>
      </svg>
      <div className="tsla-sequence">
        <div><span>INPUT</span><strong>60 sessions</strong></div>
        <ArrowRight size={14} aria-hidden="true" />
        <div><span>MODEL</span><strong>LSTM</strong></div>
        <ArrowRight size={14} aria-hidden="true" />
        <div><span>OUTPUT</span><strong>Next close</strong></div>
      </div>
      <div className="tsla-visual-foot"><span>Historical TSLA data</span><span>Illustrative model view</span></div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="content-section projects-section">
      <div className="site-container">
        <div className="projects-heading-row">
          <SectionHeading number="04" label="Selected work">Projects built for the real world.</SectionHeading>
          <ScrollReveal className="projects-aside">Practical systems.<br />Careful engineering.</ScrollReveal>
        </div>

        <article className="featured-project">
          <ScrollReveal className="featured-project-copy">
            <p className="project-index">01 / COMPUTER VISION</p>
            <h3>CrowdShield AI</h3>
            <p className="project-subtitle">Real-time crowd tracking &amp; spatial risk heuristic engine</p>
            <p className="project-award">1st Place · SISTec Innovation Hackathon 2026</p>
            <p className="project-story">
              Built in 48 intense hackathon hours with Team QBurn. Solved multi-camera occlusion using YOLOv8 bounding boxes and ByteTrack spatial heuristics.
            </p>
            <p className="project-architecture">
              Computes velocity flow vectors, line-crossing counters, and congestion slopes, with alternative egress routing through Mesa and Dijkstra pathfinding.
            </p>
            <p className="project-tags">Python <i>/</i> YOLOv8 <i>/</i> ByteTrack <i>/</i> FastAPI <i>/</i> React <i>/</i> TypeScript</p>
            <a className="text-link" href="https://github.com/DevanshSinghBais/CrowdSheild_AI" target="_blank" rel="noopener noreferrer">
              View project <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </ScrollReveal>
          <ScrollReveal className="featured-project-visual" delay={0.1}>
            <CrowdShieldDiagram />
          </ScrollReveal>
        </article>

        <article className="secondary-project">
          <ScrollReveal className="secondary-project-copy">
            <p className="project-index">02 / ENVIRONMENTAL INTELLIGENCE</p>
            <h3>EcoMRI</h3>
            <p className="project-subtitle">Cinematic environmental anomaly intelligence platform</p>
            <p className="project-story">
              An interactive station-mapping and telemetry platform for environmental anomaly signals, time-series inspection, and risk projections.
            </p>
            <p className="project-tags">TypeScript <i>/</i> React <i>/</i> Node.js <i>/</i> tRPC <i>/</i> Drizzle</p>
            <div className="project-links">
              <a className="text-link" href="https://ecomri.vercel.app" target="_blank" rel="noopener noreferrer">Live platform <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a className="text-link" href="https://github.com/DevanshSinghBais/ecomri" target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </ScrollReveal>
          <ScrollReveal className="ecomri-visual" delay={0.08}>
            <div className="ecomri-topline"><span>EcoMRI</span><span>environmental anomaly view</span></div>
            <div className="ecomri-map-frame">
              <svg className="ecomri-map-svg" viewBox="0 0 640 250" aria-hidden="true">
                <defs>
                  <linearGradient id="ecomri-map-tone" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#34474a" />
                    <stop offset=".55" stopColor="#1f3037" />
                    <stop offset="1" stopColor="#17242c" />
                  </linearGradient>
                  <radialGradient id="ecomri-heat">
                    <stop offset="0" stopColor="#d96a45" stopOpacity=".88" />
                    <stop offset=".6" stopColor="#bd4b31" stopOpacity=".48" />
                    <stop offset="1" stopColor="#bd4b31" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="ecomri-map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M28 0H0V28" fill="none" stroke="#dbe4e0" strokeOpacity=".09" strokeWidth=".7" />
                  </pattern>
                </defs>
                <rect width="640" height="250" fill="url(#ecomri-map-tone)" />
                <path className="ecomri-landform" d="M0 34 72 18 116 46 173 25 211 63 255 44 298 65 327 106 288 139 246 147 204 177 163 160 117 190 67 173 30 196 0 183Z" />
                <path className="ecomri-landform ecomri-landform-alt" d="M383 0 439 21 474 17 504 44 558 31 602 57 640 51V0ZM421 250 457 218 496 229 530 194 574 209 611 181 640 193V250Z" />
                <rect width="640" height="250" fill="url(#ecomri-map-grid)" />
                <g className="ecomri-contours">
                  <path d="M-12 78C45 45 82 80 124 61S201 51 228 90 296 107 322 74 382 32 423 63 501 94 557 62 620 49 658 75" />
                  <path d="M-8 102C42 69 81 103 123 85S196 74 225 114 293 132 323 98 379 55 419 87 496 118 552 87 615 74 654 99" />
                  <path d="M-11 129C43 98 82 130 122 112S193 101 222 140 287 160 320 126 374 82 416 113 492 145 548 114 610 101 653 126" />
                  <path d="M-9 156C46 126 84 156 121 139S190 127 218 166 283 188 317 153 371 110 412 141 488 171 545 140 608 129 650 152" />
                  <path d="M14 40C49 29 72 39 91 54M527 163C554 146 581 149 611 163" />
                </g>
                <path className="ecomri-river" d="M0 218C82 190 118 221 180 198S267 153 320 169 402 216 467 186 567 134 640 152" />
                <ellipse cx="388" cy="126" rx="100" ry="63" fill="url(#ecomri-heat)" />
                <path className="ecomri-boundary" d="M328 93 432 91 454 153 349 163Z" />
                <circle className="ecomri-sensor-dot" cx="385" cy="126" r="4" />
                <circle className="ecomri-sensor-dot" cx="415" cy="115" r="2.8" />
                <circle className="ecomri-sensor-dot" cx="362" cy="143" r="2.5" />
              </svg>
              <div className="ecomri-layer-panel">
                <strong>Layers</strong>
                <span><i className="layer-check is-active" /> Satellite</span>
                <span><i className="layer-check is-active" /> Anomalies</span>
                <span><i className="layer-check" /> Boundaries</span>
              </div>
              <div className="ecomri-alert-panel">
                <span className="ecomri-alert-kicker"><i /> Signal for review</span>
                <strong>Possible anomaly</strong>
                <span>Illustrative evidence marker</span>
              </div>
            </div>
            <div className="ecomri-foot"><span>map layers</span><span>signal review</span><span>source-linked context</span></div>
          </ScrollReveal>
        </article>

        <article className="featured-project additional-project">
          <ScrollReveal className="featured-project-copy">
            <p className="project-index">03 / AI RESEARCH</p>
            <h3>Flame in Freefall</h3>
            <p className="project-subtitle">A source-first research space for combustion beyond Earth.</p>
            <p className="project-story">
              Explore NASA technical literature on microgravity combustion, then ask questions with source-linked evidence and citation checks.
            </p>
            <p className="project-architecture">
              Built to keep published research separate from AI interpretation, with a personal library for saving and comparing papers.
            </p>
            <p className="project-tags">Next.js <i>/</i> TypeScript <i>/</i> Supabase <i>/</i> NASA NTRS <i>/</i> Gemini</p>
            <div className="project-links">
              <a className="text-link" href="https://flame-in-freefall-two.vercel.app" target="_blank" rel="noopener noreferrer">Live research space <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a className="text-link" href="https://github.com/DevanshSinghBais/flame-in-freefall" target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </ScrollReveal>
          <ScrollReveal className="featured-project-visual" delay={0.08}>
            <FlameVisual />
          </ScrollReveal>
        </article>

        <article className="secondary-project additional-project tesla-project">
          <ScrollReveal className="secondary-project-copy">
            <p className="project-index">04 / TIME SERIES</p>
            <h3>TSLA LSTM Forecasting</h3>
            <p className="project-subtitle">Next-session close forecasting from a rolling 60-day window.</p>
            <p className="project-story">
              Trains an LSTM on historical Tesla daily closing prices from 2019–2024, using the previous 60 trading days as each input sequence.
            </p>
            <p className="project-tags">Python <i>/</i> TensorFlow <i>/</i> Keras <i>/</i> Pandas <i>/</i> Scikit-learn</p>
            <a className="text-link" href="https://github.com/DevanshSinghBais/TSLA-LSTM-Forecasting" target="_blank" rel="noopener noreferrer">
              View source on GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </ScrollReveal>
          <ScrollReveal className="featured-project-visual" delay={0.08}>
            <TeslaVisual />
          </ScrollReveal>
        </article>

        <div className="other-projects">
          <ScrollReveal className="other-projects-heading"><span>05—08</span><h3>More projects.</h3></ScrollReveal>
          <div className="other-projects-list">
            {otherProjects.map((project, index) => (
              <ScrollReveal className="other-project" key={project.title} delay={index * 0.035}>
                <span className="other-project-number">{String(index + 5).padStart(2, '0')}</span>
                <div>
                  <h4>{project.title}</h4>
                  <p>{project.subtitle}</p>
                  <small>{project.tags}</small>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={project.resume ? 'Open the resume for SafeHer project details' : 'View ' + project.title + ' on GitHub'}>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompetitiveSection() {
  return (
    <section id="competitive" className="content-section competitive-section">
      <div className="site-container">
        <SectionHeading number="05" label="Algorithmic foundations">Competitive problem solving.</SectionHeading>
        <ScrollReveal className="competitive-intro">
          500+ algorithmic problems solved across platforms, building fluency in data structures, graph theory, and problem-solving.
        </ScrollReveal>
        <div className="competitive-grid">
          <ScrollReveal className="competitive-profile">
            <p className="profile-label">Codeforces</p>
            <h3>@devanshsinghbais0071</h3>
            <a className="text-link" href="https://codeforces.com/profile/devanshsinghbais0071" target="_blank" rel="noopener noreferrer">
              Verify on Codeforces <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <dl className="rating-grid">
              <div><dt>Rating</dt><dd>1400</dd></div>
              <div><dt>Solved</dt><dd>200+</dd></div>
            </dl>
            <div className="codechef-proof"><span>CodeChef</span><strong>2-Star</strong></div>
            <p className="profile-copy">Timed rounds in dynamic programming, two-pointer techniques, number theory, and tree traversals.</p>
          </ScrollReveal>

          <ScrollReveal className="competitive-profile" delay={0.08}>
            <p className="profile-label">LeetCode</p>
            <h3>@DevanshSinghBais</h3>
            <a className="text-link" href="https://leetcode.com/u/DevanshSinghBais/" target="_blank" rel="noopener noreferrer">
              View LeetCode profile <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <dl className="rating-grid leetcode-grid">
              <div><dt>Rating</dt><dd>1550</dd></div>
              <div><dt>Solved</dt><dd>300+</dd></div>
            </dl>
            <p className="profile-copy">Focusing on BFS/DFS shortest paths, Dijkstra heuristics, sliding windows, and binary search invariants.</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="content-section contact-section">
      <div className="site-container">
        <ScrollReveal className="contact-content">
          <div className="contact-index">06 / Direct channel</div>
          <h2>Let&apos;s build <em>something useful.</em></h2>
          <p>Have an open role, an engineering collaboration, or an AI research project?</p>
          <a className="contact-email" href="mailto:devanshsinghbais111@gmail.com">
            devanshsinghbais111@gmail.com <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <div className="contact-links">
            <a href="https://github.com/DevanshSinghBais" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/devansh-singh-bais-748b192b5/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a>
            <a href="https://leetcode.com/u/DevanshSinghBais/" target="_blank" rel="noopener noreferrer">LeetCode <ArrowUpRight size={13} aria-hidden="true" /></a>
            <ResumeLink />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <a href="#home" className="wordmark" aria-label="Back to top">devansh<span>.bais</span><i>()</i></a>
        <span>Devansh Singh Bais · Bhopal, India</span>
        <a className="back-to-top" href="#home">Back to top <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}

interface PortfolioSiteProps {
  isPlaying: boolean;
  onToggleMelody: () => void;
}

export default function PortfolioSite({ isPlaying, onToggleMelody }: PortfolioSiteProps) {
  return (
    <motion.div
      className="portfolio-site"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <ScrollDirectionProvider>
        <ScrollProgress />
        <SiteHeader isPlaying={isPlaying} onToggleMelody={onToggleMelody} />
        <main>
          <Hero />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <CompetitiveSection />
          <ContactSection />
        </main>
        <Footer />
      </ScrollDirectionProvider>
    </motion.div>
  );
}
