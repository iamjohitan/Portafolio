import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function CVDownloadButton() {
  const [cvUrl, setCvUrl] = useState<string>("/CV_Johan_Lucumi_Web_ES.pdf");

  useEffect(() => {
    // Obtener idioma de localStorage
    const currentLang = (localStorage.getItem("lang") as "es" | "en") || "es";
    updateCVUrl(currentLang);

    // Escuchar cambios de idioma
    const handleLangChange = () => {
      const newLang = (localStorage.getItem("lang") as "es" | "en") || "es";
      updateCVUrl(newLang);
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, []);

  const updateCVUrl = (lang: "es" | "en") => {
    const url =
      lang === "es"
        ? "/CV_Johan_Lucumi_ES.pdf"
        : "/CV_Johan_Lucumi_EN.pdf";
    setCvUrl(url);
  };

  return (
    <a
      href={cvUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-8 py-4 border border-white/10 bg-white/5 text-white rounded-full hover:bg-white/10 hover:border-white/30 transition flex items-center gap-2 backdrop-blur-sm"
    >
      <Download size={20} /> CV
    </a>
  );
}
