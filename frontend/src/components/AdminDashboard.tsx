import { FormEvent, useState } from "react";
import { BarChart3, BookOpen, FolderKanban, Inbox, LogIn, Newspaper, PlusCircle, UploadCloud } from "lucide-react";

type DashboardTotals = {
  projects: number;
  blogs: number;
  messages: number;
  testimonials: number;
  resumes: number;
  media: number;
  visits: number;
};

export function AdminDashboard({ apiBase }: { apiBase: string }) {
  const [token, setToken] = useState("");
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [status, setStatus] = useState("Use your seeded admin account to load dashboard.");
  const [activeTab, setActiveTab] = useState<"dashboard" | "project" | "blog" | "cv">("dashboard");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Signing in...");
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setToken(data.token);
      setStatus("Signed in.");
      await loadDashboard(data.token);
    } catch {
      setStatus("Login failed. Check credentials and API server.");
    }
  }

  async function loadDashboard(authToken = token) {
    const res = await fetch(`${apiBase}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) { setStatus("Could not load dashboard totals."); return; }
    const data = await res.json();
    setTotals(data.totals);
    setStatus("Dashboard loaded.");
  }

  return (
    <div className="dashboardShell">
      <form className="loginPanel" onSubmit={login}>
        <h3>Admin login</h3>
        <input name="email" placeholder="Admin email" type="email" required />
        <input name="password" placeholder="Password" type="password" required minLength={8} />
        <button className="button primary" type="submit"><LogIn size={18} /> Sign in</button>
        <p className="muted">{status}</p>
      </form>

      <div className="adminRight">
        {token && (
          <div className="adminTabs">
            {(["dashboard", "project", "blog", "cv"] as const).map((tab) => (
              <button
                key={tab}
                className={`adminTab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "dashboard" && <BarChart3 size={16} />}
                {tab === "project" && <FolderKanban size={16} />}
                {tab === "blog" && <Newspaper size={16} />}
                {tab === "cv" && <UploadCloud size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="dashboardPanel">
            <Metric icon={<FolderKanban />} label="Projects" value={totals?.projects} />
            <Metric icon={<Newspaper />} label="Blogs" value={totals?.blogs} />
            <Metric icon={<Inbox />} label="Messages" value={totals?.messages} />
            <Metric icon={<UploadCloud />} label="Media" value={totals?.media} />
            <Metric icon={<BarChart3 />} label="Visits" value={totals?.visits} />
          </div>
        )}

        {activeTab === "project" && token && <AddProjectForm apiBase={apiBase} token={token} />}
        {activeTab === "blog" && token && <AddBlogForm apiBase={apiBase} token={token} />}
        {activeTab === "cv" && token && <UploadCVForm apiBase={apiBase} token={token} />}
      </div>
    </div>
  );
}

function AddProjectForm({ apiBase, token }: { apiBase: string; token: string }) {
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");
    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title") as string,
      summary: form.get("summary") as string,
      description: form.get("description") as string,
      githubUrl: form.get("githubUrl") as string || "",
      demoUrl: form.get("demoUrl") as string || "",
      coverImage: form.get("coverImage") as string || "",
      status: form.get("status") as string,
      featured: form.get("featured") === "true"
    };
    try {
      const res = await fetch(`${apiBase}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      setStatus("Project created successfully.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("Failed to create project.");
    }
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      <h3><PlusCircle size={18} /> Add project</h3>
      <input name="title" placeholder="Title" required />
      <input name="summary" placeholder="Short summary" required />
      <textarea name="description" placeholder="Full description" rows={4} required />
      <input name="coverImage" placeholder="Cover image URL (Cloudinary or other)" type="url" />
      <input name="githubUrl" placeholder="GitHub URL" type="url" />
      <input name="demoUrl" placeholder="Live demo URL" type="url" />
      <div className="formRow">
        <select name="status">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <select name="featured">
          <option value="false">Not featured</option>
          <option value="true">Featured</option>
        </select>
      </div>
      <button className="button primary" type="submit">Create project</button>
      {status && <p className="formStatus">{status}</p>}
    </form>
  );
}

function AddBlogForm({ apiBase, token }: { apiBase: string; token: string }) {
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");
    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title") as string,
      excerpt: form.get("excerpt") as string,
      content: form.get("content") as string,
      externalUrl: form.get("externalUrl") as string || "",
      coverImage: form.get("coverImage") as string || "",
      status: form.get("status") as string,
      seoTitle: form.get("seoTitle") as string || undefined,
      seoDescription: form.get("seoDescription") as string || undefined
    };
    try {
      const res = await fetch(`${apiBase}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      setStatus("Blog post created successfully.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("Failed to create blog post.");
    }
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      <h3><BookOpen size={18} /> Add blog post</h3>
      <input name="title" placeholder="Title" required />
      <input name="excerpt" placeholder="Short excerpt" required />
      <textarea name="content" placeholder="Full content (markdown supported)" rows={6} required />
      <input name="externalUrl" placeholder="External article URL (Medium, Dev.to, Hashnode, etc.)" type="url" />
      <input name="coverImage" placeholder="Cover image URL" type="url" />
      <input name="seoTitle" placeholder="SEO title (optional)" />
      <input name="seoDescription" placeholder="SEO description (optional)" />
      <select name="status">
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>
      <button className="button primary" type="submit">Create blog post</button>
      {status && <p className="formStatus">{status}</p>}
    </form>
  );
}

function UploadCVForm({ apiBase, token }: { apiBase: string; token: string }) {
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");
    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title") as string,
      version: form.get("version") as string,
      fileUrl: form.get("fileUrl") as string,
      active: form.get("active") === "true"
    };
    try {
      const res = await fetch(`${apiBase}/resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      setStatus("CV saved successfully. Visitors can now download it.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("Failed to save CV.");
    }
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      <h3><UploadCloud size={18} /> Upload CV / Resume</h3>
      <p className="muted">Upload your CV file to Cloudinary or any file host, then paste the direct URL here.</p>
      <input name="title" placeholder="Label (e.g. Resume 2025)" required />
      <input name="version" placeholder="Version (e.g. v3)" required />
      <input name="fileUrl" placeholder="Direct file URL (PDF link)" type="url" required />
      <select name="active">
        <option value="true">Set as active (shown to visitors)</option>
        <option value="false">Save as inactive</option>
      </select>
      <button className="button primary" type="submit">Save CV</button>
      {status && <p className="formStatus">{status}</p>}
    </form>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </div>
  );
}
