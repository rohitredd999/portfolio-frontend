// npm i framer-motion react-icons lucide-react
// Tailwind: set darkMode: 'class' in tailwind.config.js

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github as GithubIcon, ExternalLink } from "lucide-react";
import {
  FaJava, FaAws, FaTools, FaCogs, FaDatabase, FaMicrosoft,
  FaReact, FaAngular, FaJs, FaHtml5, FaCss3, FaBootstrap,
  FaDocker, FaJenkins, FaGithub
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

/* ---------- Galaxy Background (fixed) ---------- */
function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w, h, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const stars = [];
    const STAR_COUNT = 220;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function spawn() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.8 + 0.2,
          r: Math.random() * 1.6 + 0.2,
          tw: Math.random() * Math.PI * 2,
          spd: Math.random() * 0.3 + 0.05,
        });
      }
    }

    function drawBlob(depth, color) {
      ctx.fillStyle = color;
      const x = w * (0.2 + 0.6 * depth);
      const y = h * (0.2 + 0.6 * (1 - depth));
      const r = Math.max(w, h) * 0.35 * depth + 80;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(10,12,22,0.95)");
      g.addColorStop(1, "rgba(12,18,36,0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      drawBlob(0.25, "#60a5fa11");
      drawBlob(0.6, "#a78bfa11");
      drawBlob(0.9, "#34d39911");

      for (const s of stars) {
        s.x += s.spd * s.z;
        if (s.x > w + 10) s.x = -10;
        const alpha = 0.5 + 0.5 * Math.sin((s.tw += 0.03 * s.z));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }

    // init
    resize(); spawn(); draw();
    const onResize = () => { resize(); spawn(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 h-full w-full" style={{ background: "transparent" }} />;
}

/* ---------- Theme Toggle ---------- */
function ThemeButton() {
  const [t, setT] = useState(() =>
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  useEffect(() => {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("theme", t);
  }, [t]);
  return (
    <button onClick={() => setT(t === "dark" ? "light" : "dark")}
      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-white/10">
      {t === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

/* ---------- Layout Helpers ---------- */
function useHashSection() {
  const [section, setSection] = useState(() => window.location.hash || "#home");
  useEffect(() => {
    const onHash = () => setSection(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return section;
}
function Section({ id, title, children }) {
  return (
    <section id={id} className="py-20 scroll-mt-20">
      <motion.h2 className="text-3xl md:text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.5 }}>
        {title}
      </motion.h2>
      {children}
    </section>
  );
}

/* ---------- Summary & Skills Blocks ---------- */
function SummaryBlock() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Experienced Java Full-Stack Developer with 3+ years of hands-on expertise in Spring Boot, React.js,
        Microservices, and RESTful APIs. Proficient in cloud (AWS, Azure), containerization (Docker, Kubernetes),
        CI/CD, and testing (JUnit, Mockito). Adept in Agile teams, delivering scalable, secure solutions
        across financial and enterprise domains.
      </p>
    </div>
  );
}
function TechnicalSkills() {
  const rows = [
    ["Languages", "Java (8/11/17/21), SQL, JavaScript (ES6+), TypeScript, HTML5, CSS3"],
    ["Core Java", "OOP, Collections, Streams, Lambda, Concurrency, Exception Handling"],
    ["Frameworks & Libraries", "Spring Boot (3+), Spring MVC, Spring Security, Hibernate, JPA, Spring Data JPA, React.js, Angular, jQuery, Bootstrap, Swagger/OpenAPI"],
    ["Frontend", "React.js, Angular, HTML5, CSS3, JavaScript, Bootstrap, jQuery"],
    ["Databases & ORM", "PostgreSQL, MySQL, MongoDB, Oracle Database, Hibernate, JPA"],
    ["Web & DevOps", "RESTful APIs, JSON, XML, Microservices, AWS (EC2/S3/Lambda), Azure, Docker, Kubernetes, SonarQube, Git/GitHub, Jenkins, GitHub Actions, Maven, Gradle, Kafka"],
    ["Testing & Agile", "JUnit, Mockito, TDD, Code Reviews, Debugging, Agile (Scrum/Kanban), SDLC"],
    ["Tools & Monitoring", "IntelliJ, Eclipse, Postman, Jira, Confluence, Windows/Linux/macOS, Prometheus, Grafana, ELK Stack"],
  ];
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border bg-white/60 dark:bg-slate-900/40">
      {rows.map(([k, v]) => (
        <div key={k} className="grid md:grid-cols-4 gap-4 p-4">
          <div className="font-semibold">{k}</div>
          <div className="md:col-span-3 text-gray-700 dark:text-gray-300">{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Skills Grid (icons) ---------- */
function SkillPill({ Icon, label }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl bg-blue-50/70 dark:bg-blue-400/10 border p-3 shadow-sm hover:shadow-lg">
      <div className="flex items-center gap-2">
        <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/80 dark:bg-white/10">
          <Icon size={18} />
        </span>
        <span className="font-medium text-sm">{label}</span>
      </div>
    </motion.div>
  );
}
function SkillsGrid() {
  const groups = [
    {
      title: "Backend",
      items: [
        { Icon: FaJava, label: "Java" },
        { Icon: FaCogs, label: "Spring Boot" },
        { Icon: FaCogs, label: "Spring Security" },
        { Icon: FaCogs, label: "Hibernate / JPA" },
        { Icon: FaCogs, label: "Swagger / OpenAPI" },
        { Icon: FaCogs, label: "Kafka" },
        { Icon: FaTools, label: "Maven" },
        { Icon: FaTools, label: "Gradle" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { Icon: FaReact, label: "React" },
        { Icon: FaAngular, label: "Angular" },
        { Icon: FaJs, label: "JavaScript" },
        { Icon: FaJs, label: "TypeScript" },
        { Icon: FaHtml5, label: "HTML5" },
        { Icon: FaCss3, label: "CSS3" },
        { Icon: FaBootstrap, label: "Bootstrap" },
      ],
    },
    {
      title: "DevOps & Cloud",
      items: [
        { Icon: FaDocker, label: "Docker" },
        { Icon: FaCogs, label: "Kubernetes" },
        { Icon: FaAws, label: "AWS" },
        { Icon: FaMicrosoft, label: "Azure" },
        { Icon: FaGithub, label: "GitHub" },
        { Icon: FaJenkins, label: "Jenkins" },
        { Icon: FaCogs, label: "SonarQube" },
      ],
    },
    {
      title: "Data & Testing",
      items: [
        { Icon: FaDatabase, label: "PostgreSQL" },
        { Icon: FaDatabase, label: "MySQL" },
        { Icon: FaDatabase, label: "MongoDB" },
        { Icon: FaTools, label: "JUnit" },
        { Icon: FaTools, label: "Mockito" },
      ],
    },
  ];
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="text-lg font-semibold mb-4">{g.title}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {g.items.map((it) => <SkillPill key={it.label} {...it} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Lightbox ---------- */
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  if (!images?.length) return null;
  const src = images[index];
  return (
    <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <button className="absolute top-4 right-4 text-white/80 text-2xl" onClick={onClose}>✕</button>
      <button className="absolute left-4 text-white/80 text-3xl" onClick={onPrev}>‹</button>
      <img src={src} alt="" className="max-h-[85vh] max-w-[92vw] rounded-lg shadow-2xl" />
      <button className="absolute right-4 text-white/80 text-3xl" onClick={onNext}>›</button>
    </div>
  );
}

/* ---------- Project Card ---------- */
function ProjectCard({ p, onOpen }) {
  return (
    <motion.article
      className="rounded-2xl border bg-white/80 dark:bg-slate-800/80 p-5 shadow-sm hover:shadow-lg"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold">{p.name}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
      {p.images?.length ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {p.images.slice(0, 3).map((src, i) => (
            <button key={i} onClick={() => onOpen(p.images, i)} className="overflow-hidden rounded-md">
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover hover:scale-105 transition" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex gap-4">
        {p.github && (<a href={p.github} target="_blank" className="text-blue-600 hover:underline"><GithubIcon size={16}/> GitHub</a>)}
        {p.demo && (<a href={p.demo} target="_blank" className="text-blue-600 hover:underline"><ExternalLink size={16}/> Live Demo</a>)}
      </div>
    </motion.article>
  );
}

/* ---------- App ---------- */
export default function App() {
  const current = useHashSection();
  const [projects, setProjects] = useState([]);
  const [loadingProj, setLoadingProj] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, i: 0, imgs: [] });

  // Load projects (from API if available, else fallback list)
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`${API_BASE}/api/projects`);
        const data = r.ok ? await r.json() : [];
        const withImages = data.map((p) => ({
          ...p,
          images: p.images ?? [
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
          ],
        }));
        setProjects(withImages);
      } catch {
        setProjects([
          {
            id: "p1",
            name: "Portfolio Backend",
            description: "Spring Boot 3 + REST API + Render deploy. Secured endpoints, DTOs, and OpenAPI.",
            github: "https://github.com/yourname/portfolio-backend",
            demo: API_BASE ? `${API_BASE}/api/projects` : undefined,
            images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop"],
          },
          {
            id: "p2",
            name: "Portfolio Frontend",
            description: "React + Vite + Tailwind + Framer Motion with galaxy background and lightbox.",
            github: "https://github.com/yourname/portfolio-frontend",
            demo: "https://your-netlify-site.netlify.app/",
            images: ["https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"],
          },
          {
            id: "p3",
            name: "Microservice Auth",
            description: "Spring Security, JWT, role-based access, API gateway; Docker + K8s ready.",
            github: "https://github.com/yourname/microservice-auth",
            images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"],
          },
          {
            id: "p4",
            name: "Kafka Event Pipeline",
            description: "Producer/Consumer services with schema-validated payloads, dead-letter handling.",
            github: "https://github.com/yourname/kafka-pipeline",
            images: ["https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop"],
          },
        ]);
      } finally {
        setLoadingProj(false);
      }
    }
    if (API_BASE) load();
    else {
      // show fallback even without backend
      setProjects([
        {
          id: "p1",
          name: "Portfolio Backend",
          description: "Spring Boot 3 + REST API + Render deploy. Secured endpoints, DTOs, and OpenAPI.",
          github: "https://github.com/yourname/portfolio-backend",
          images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop"],
        },
        {
          id: "p2",
          name: "Portfolio Frontend",
          description: "React + Vite + Tailwind + Framer Motion with galaxy background and lightbox.",
          github: "https://github.com/yourname/portfolio-frontend",
          images: ["https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"],
        },
        {
          id: "p3",
          name: "Microservice Auth",
          description: "Spring Security, JWT, role-based access, API gateway; Docker + K8s ready.",
          github: "https://github.com/yourname/microservice-auth",
          images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"],
        },
        {
          id: "p4",
          name: "Kafka Event Pipeline",
          description: "Producer/Consumer services with schema-validated payloads, dead-letter handling.",
          github: "https://github.com/yourname/kafka-pipeline",
          images: ["https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop"],
        },
      ]);
      setLoadingProj(false);
    }
  }, []);

  // Experience (aligned to your résumé)
  const experience = [
    {
      company: "Meijer",
      role: "Java Software Engineer",
      period: "June 2023 – Present",
      bullets: [
        "End-to-end development and deployment of scalable, cloud-native apps using Spring Boot 3+ and React.js; +25% user engagement and −15% support inquiries.",
        "Designed and implemented RESTful APIs for microservices handling high throughput with 99.9% uptime.",
        "Managed PostgreSQL and MongoDB via Spring Data JPA; improved query performance and reliability.",
        "Implemented CI/CD with Jenkins and GitHub Actions; reduced deployment time and improved code quality.",
        "Containerized services (Docker) and ran on Kubernetes in AWS for high availability and efficiency.",
        "Active Agile contributor (requirements, planning, delivery).",
      ],
    },
    {
      company: "SS&C Technologies",
      role: "Java Software Developer",
      period: "Aug 2021 – Jan 2022",
      bullets: [
        "Developed high-performance backend services with Core Java and Spring for financial applications.",
        "Implemented and integrated RESTful APIs for secure, efficient inter-system communication.",
        "Used Hibernate/JPA with Oracle to optimize data access layers.",
        "Wrote unit tests (JUnit/Mockito) and took part in code reviews and design discussions.",
      ],
    },
    {
      company: "Smart Knower",
      role: "Java Full-Stack Developer",
      period: "Feb 2021 – July 2021",
      bullets: [
        "Contributed to enterprise applications focusing on scalable architecture and performance (inventory systems).",
        "Applied OOD/design patterns for modular, maintainable Java code; clean, testable code across the SDLC.",
        "Monitored and tuned high-volume, low-latency components; collaborated using Git-based workflows.",
      ],
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <GalaxyBackground />

      {/* NAV */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#home" className="font-semibold">Rohith Reddy G</a>
          <div className="flex items-center gap-4 text-sm">
            <a href="#summary">Summary</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
            <ThemeButton />
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="home">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            Java Full-Stack Developer
          </motion.h1>
          <motion.p className="mt-4 text-lg text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}>
            Spring Boot • React • Microservices • Cloud (AWS/Azure) • Docker • Kubernetes
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a href="mailto:rohithreddy999@outlook.com" className="underline">rohithreddy999@outlook.com</a>
            <a href="https://linkedin.com/in/rohithreddyg99/" target="_blank" className="underline">LinkedIn</a>
            <a href="https://github.com/yourname" target="_blank" className="underline">GitHub</a>
            <a href="/Rohith_Reddy_G_Resume.pdf" target="_blank" className="underline">Download Résumé (PDF)</a>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <AnimatePresence mode="wait">
        <motion.main key={current} className="mx-auto max-w-6xl px-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <>
            <Section id="summary" title="Summary">
              <SummaryBlock />
            </Section>

            <Section id="skills" title="Technical Skills">
              <TechnicalSkills />
              <div className="mt-10">
                <SkillsGrid />
              </div>
            </Section>

            <Section id="projects" title="Projects">
              {loadingProj && <p>Loading…</p>}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id || p.name}
                    p={p}
                    onOpen={(imgs, i) => setLightbox({ open: true, i, imgs })}
                  />
                ))}
              </div>
              {lightbox.open && (
                <Lightbox
                  images={lightbox.imgs}
                  index={lightbox.i}
                  onClose={() => setLightbox({ open: false, i: 0, imgs: [] })}
                  onPrev={() => setLightbox(l => ({ ...l, i: (l.i - 1 + l.imgs.length) % l.imgs.length }))}
                  onNext={() => setLightbox(l => ({ ...l, i: (l.i + 1) % l.imgs.length }))}
                />
              )}
            </Section>

            <Section id="education" title="Education">
              <ul className="space-y-3">
                <li>
                  <strong>University of the Cumberlands</strong> — M.S. Information Technology (Dec 2023),
                  Williamsburg, KY
                </li>
                <li>
                  <strong>GITAM University</strong> — B.Tech, Computer Science Engineering (Jun 2021),
                  Hyderabad, India
                </li>
              </ul>
            </Section>

            <Section id="experience" title="Experience">
              <div className="relative">
                {experience.map((item, i) => (
                  <motion.div key={i}
                    className="relative pl-8 pb-8 border-l border-slate-300 dark:border-slate-700"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.4 }}>
                    <div className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-blue-600" />
                    <h3 className="font-semibold">
                      {item.role} — <span className="text-blue-600">{item.company}</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.period}</p>
                    <ul className="mt-3 list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section id="contact" title="Contact">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! I’ll get back to you.");
                  e.currentTarget.reset();
                }}
                className="max-w-lg grid gap-4"
              >
                <input
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700">Send</button>
              </form>
            </Section>
          </>
        </motion.main>
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Rohith Reddy G — Built with Spring Boot & React
        </div>
      </footer>
    </div>
  );
}
