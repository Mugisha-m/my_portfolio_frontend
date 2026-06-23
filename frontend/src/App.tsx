import { FormEvent, useEffect, useState } from "react";
import { Activity, ArrowUpRight, Briefcase, Code2, Database, Download, Github, GraduationCap, LayoutDashboard, Linkedin, Lock, Mail, MapPin, Menu, Moon, Phone, Server, Shield, Sun, UploadCloud, X } from "lucide-react";
import { certificates, education, experience, profile, projects, skills } from "./lib/content";
import { AdminDashboard } from "./components/AdminDashboard";

const apiBase = import.meta.env.VITE_API_URL ?? "/api";

export function App() {
  const [contactState, setContactState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeResume, setActiveResume] = useState<{ id: string; fileUrl: string; title: string } | null>(null);
  const [blogs, setBlogs] = useState<{ id: string; title: string; excerpt: string; content: string; coverImage?: string; externalUrl?: string; publishedAt: string }[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    fetch(`${apiBase}/blogs`)
      .then((r) => r.json())
      .then((d) => { if (d.blogs) setBlogs(d.blogs); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${apiBase}/resumes/active`)
      .then((r) => r.json())
      .then((d) => { if (d.resume) setActiveResume(d.resume); })
      .catch(() => {});
  }, []);

  async function downloadCV() {
    if (!activeResume) return;
    try {
      const res = await fetch(`${apiBase}/resumes/${activeResume.id}/download`, { method: "PATCH" });
      const data = await res.json();
      window.open(data.fileUrl, "_blank");
    } catch {
      window.open(activeResume.fileUrl, "_blank");
    }
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactState("sending");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      subject: form.get("subject") as string,
      message: form.get("message") as string
    };
    try {
      const response = await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error();
      (event.target as HTMLFormElement).reset();
      setContactState("sent");
      setTimeout(() => setContactState("idle"), 3000);
    } catch {
      setContactState("error");
      setTimeout(() => setContactState("idle"), 5000);
    }
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#blog", label: "Blog" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#home">
          <Code2 size={22} />
          <span>{profile.name}</span>
        </a>
        <nav className={menuOpen ? "navOpen" : ""}>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          {activeResume && (
            <button className="button primary navCv" onClick={() => { downloadCV(); setMenuOpen(false); }}>
              <Download size={16} /> Download CV
            </button>
          )}
          <button className="themeToggle" onClick={() => setIsDark(!isDark)} aria-label="Toggle dark mode">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
        <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="home">

        {/* ── Hero ── */}
        <section className="hero section">
          <div className="heroCopy">
            <span className="status"><span /> Available for opportunities</span>
            <h1>{profile.name}</h1>
            <p className="heroTitle">{profile.title}</p>
            <p>{profile.summary}</p>
            <div className="actions">
              <a className="button primary" href="#projects">View Projects</a>
              <a className="button secondary" href="#contact">Get in Touch</a>
            </div>
            <div className="socialLinks">
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={20} /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>
          <div className="portraitWrap">
            <img src="/images/profile.png" alt={profile.name} />
          </div>
        </section>

        {/* ── About ── */}
        <section className="section" id="about">
          <div className="twoCol">
            <div>
              <p className="eyebrow">About me</p>
              <h2>Who I am</h2>
              <p>{profile.about}</p>
            </div>
            <div className="capabilityGrid">
              <Capability icon={<Server />} label="API Development" />
              <Capability icon={<Database />} label="Database Design" />
              <Capability icon={<Lock />} label="Authentication" />
              <Capability icon={<UploadCloud />} label="Deployment" />
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="section" id="skills">
          <p className="eyebrow">Knowledge and skills</p>
          <h2>Technical skills</h2>
          <div className="skillsGrid">
            {skills.map((group) => (
              <article className="card skillCard" key={group.group}>
                <h3>{group.group}</h3>
                <div className="chips">
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section className="section" id="projects">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Featured work</p>
              <h2>Projects</h2>
            </div>
            <a className="textLink" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="projectGrid">
            {projects.map((project) => (
              <article className="card projectCard" key={project.title}>
                {project.image
                  ? <img src={project.image} alt={`${project.title} screenshot`} />
                  : <div className="imageFallback"><Github size={40} /></div>
                }
                <div className="cardBody">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="chips">
                    {project.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="cardActions">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14} /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="section" id="experience">
          <p className="eyebrow">Work history</p>
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((job) => (
              <div className="timelineItem" key={job.company}>
                <div className="timelineDot"><Briefcase size={16} /></div>
                <div className="timelineBody">
                  <h3>{job.role}</h3>
                  <p className="timelineCompany">{job.company} · <span className="muted">{job.period}</span></p>
                  <p>{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Education & Certificates ── */}
        <section className="section" id="education">
          <p className="eyebrow">Background</p>
          <h2>Education & Certificates</h2>
          <div className="eduGrid">
            <article className="card eduCard">
              <div className="eduIcon"><GraduationCap size={28} /></div>
              <div>
                <h3>{education.degree}</h3>
                <p className="timelineCompany">{education.institution} · {education.location}</p>
                <p className="muted">{education.status}</p>
              </div>
            </article>
            <div className="certGrid">
              {certificates.map((cert) => (
                <article className="card certCard" key={cert}>
                  <span className="certBadge">✓</span>
                  <p>{cert}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Blog ── */}
        {blogs.length > 0 && (
          <section className="section blogSection" id="blog">
            <p className="eyebrow">Writing</p>
            <h2>Blog</h2>
            <div className="blogGrid">
              {blogs.map((post) => (
                <article className="card blogCard" key={post.id}
                  onClick={() => post.externalUrl && window.open(post.externalUrl, "_blank")}
                  style={{ cursor: post.externalUrl ? "pointer" : "default" }}
                >
                  {post.coverImage && <img src={post.coverImage} alt={post.title} className="blogCover" />}
                  <div className="blogBody">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    {post.content && <p className="blogContent">{post.content}</p>}
                    {post.externalUrl && <span className="blogReadMore">Explore <ArrowUpRight size={14} /></span>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Admin ── */}
        <section className="section" id="admin">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Backend platform</p>
              <h2>Admin dashboard</h2>
            </div>
  
          </div>
          <div className="adminGrid">
            <AdminFeature icon={<LayoutDashboard />} title="Content management" text="Projects, blogs, testimonials, resumes, media, categories, and tags." />
            <AdminFeature icon={<Shield />} title="Security" text="JWT auth, hashed passwords, role checks, validation, rate limiting, CORS, and audit logs." />
            <AdminFeature icon={<Activity />} title="Analytics" text="Page visits, project views, blog views, contact submissions, resume downloads, and GitHub cache." />
            <AdminFeature icon={<Download />} title="Resume management" text="Visitors can download the active CV with download tracking and version control." />
          </div>
          <AdminDashboard apiBase={apiBase} />
        </section>

        {/* ── Contact ── */}
        <section className="section contact" id="contact">
          <div className="contactInfo">
            <p className="eyebrow">Contact</p>
            <h2>Get in Touch</h2>
            <p className="muted">Whether you have a project, collaboration, or opportunity in mind — I'd love to hear from you.</p>
            <div className="contactLinks">
              <a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone size={18} /> {profile.phone}</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
              <span className="contactLocation"><MapPin size={18} /> {profile.location}</span>
            </div>
          </div>
          <form className="contactForm" onSubmit={submitContact}>
            <input aria-label="Name" name="name" placeholder="Your name" required />
            <input aria-label="Email" name="email" placeholder="Email address" required type="email" />
            <input aria-label="Subject" name="subject" placeholder="Subject" required />
            <textarea aria-label="Message" name="message" placeholder="Tell me about the project or opportunity" required rows={5} />
            <button className="button primary" disabled={contactState === "sending"} type="submit">
              <Mail size={18} /> {contactState === "sending" ? "Sending..." : "Send message"}
            </button>
            {contactState === "sent" && <p className="formStatus success">Message sent successfully.</p>}
            {contactState === "error" && <p className="formStatus error">Could not send message. Please try again or email directly.</p>}
          </form>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerBrandName"><Code2 size={20} /><span>{profile.name}</span></div>
            <p>{profile.title}</p>
          </div>
          <div className="footerLinks">
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
            <a href={`mailto:${profile.email}`}><Mail size={18} /> Email</a>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone size={18} /> {profile.phone}</a>
            <span className="footerLocation"><MapPin size={16} /> {profile.location}</span>
          </div>
        </div>
        <p className="footerCopy">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </footer>
    </>
  );
}

function Capability({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="capability">{icon}<span>{label}</span></div>;
}

function AdminFeature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="card adminFeature">{icon}<h3>{title}</h3><p>{text}</p></article>;
}
