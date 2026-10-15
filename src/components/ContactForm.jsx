import { useState } from "react";
import { Send } from "lucide-react";
import { profile, projectTypes } from "@/data/portfolio";
import GlassCard from "./GlassCard";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-input bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: projectTypes[0],
    message: "",
  });

  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  // Opens the visitor's mail client — no fake submit endpoint.
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = `${form.type} enquiry from ${form.name || "website visitor"}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.type}\n\n${form.message}`;
    window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <GlassCard as="section" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="font-bold">
        Send a message
      </h2>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Name
            <input
              required
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="Your name"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@company.com"
              className={fieldClass}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Project Type
          <select value={form.type} onChange={update("type")} className={fieldClass}>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-popover">
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Message
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={update("message")}
            placeholder="Tell me about the project, system, or product."
            className={fieldClass}
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Send aria-hidden="true" className="size-4" />
          Send Message
        </button>
      </form>
    </GlassCard>
  );
};

export default ContactForm;
