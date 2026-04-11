import { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const translations = {
  es: {
    title: "Hablemos",
    description:
      "Tengo interés en oportunidades del mundo profesional y colaboraciones interesantes. Escríbeme y te responderé lo antes posible.",
    labels: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
    },
    placeholders: {
      name: "Tu nombre completo",
      email: "tu@email.com",
      message:
        "Cuéntame sobre tu propuesta, oportunidad o lo que tengas en mente...",
    },
    errors: {
      name: "El nombre es requerido",
      emailRequired: "El email es requerido",
      emailInvalid: "Email inválido",
      messageRequired: "El mensaje es requerido",
      messageLength: "El mensaje debe tener al menos 10 caracteres",
    },
    button: "Enviar Mensaje",
    buttonLoading: "Enviando...",
    success: "¡Mensaje enviado correctamente! Te responderé pronto.",
    error: "Error al enviar. Por favor intenta de nuevo.",
    support: "También puedes contactarme directamente a través de",
    supportEmail: "email",
    supportOr: "o en mis redes sociales.",
  },
  en: {
    title: "Let's Talk",
    description:
      "I'm interested in professional opportunities and interesting collaborations. Write to me and I'll get back to you as soon as possible.",
    labels: {
      name: "Name",
      email: "Email",
      message: "Message",
    },
    placeholders: {
      name: "Your full name",
      email: "your@email.com",
      message:
        "Tell me about your proposal, opportunity or what you have in mind...",
    },
    errors: {
      name: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      messageRequired: "Message is required",
      messageLength: "The message must be at least 10 characters",
    },
    button: "Send Message",
    buttonLoading: "Sending...",
    success: "Message sent successfully! I'll get back to you soon.",
    error: "Error sending. Please try again.",
    support: "You can also contact me directly through",
    supportEmail: "email",
    supportOr: "or on my social networks.",
  },
};

export default function ContactForm() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLang = (localStorage.getItem("lang") as "es" | "en") || "es";
    setLang(savedLang);

    const handleLangChange = () => {
      const currentLang = (localStorage.getItem("lang") as "es" | "en") || "es";
      setLang(currentLang);
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, []);

  const t = translations[lang];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.errors.name;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.errors.messageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.errors.messageLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/xeepydjj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email,
          _subject: `Nuevo mensaje de ${formData.name}`, // Esto personaliza el asunto
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Mail className="w-12 h-12 text-yellow-300" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400">{t.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-2"
            >
              {t.labels.name} <span className="text-yellow-300">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.placeholders.name}
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 transition-all focus:outline-none ${
                errors.name
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-yellow-300"
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              {t.labels.email} <span className="text-yellow-300">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.placeholders.email}
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 transition-all focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-yellow-300"
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-white mb-2"
            >
              {t.labels.message} <span className="text-yellow-300">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t.placeholders.message}
              rows={5}
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 transition-all focus:outline-none resize-none ${
                errors.message
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-yellow-300"
              }`}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          {/* Estado de envío */}
          {status === "success" && (
            <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{t.success}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{t.error}</p>
            </div>
          )}

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-gray-900 transition-all duration-300 flex items-center justify-center gap-2 ${
              status === "loading"
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-300 hover:bg-yellow-400 active:scale-95"
            }`}
          >
            {status === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                {t.buttonLoading}
              </>
            ) : (
              t.button
            )}
          </button>
        </form>

        {/* Soporte */}
        <p className="text-center text-gray-500 text-sm mt-8">
          {t.support}{" "}
          <a
            href="mailto:johanesneiderlucumip@gmail.com"
            className="text-yellow-300 hover:underline"
          >
            {t.supportEmail}
          </a>{" "}
          {t.supportOr}
        </p>
      </div>
    </section>
  );
}
