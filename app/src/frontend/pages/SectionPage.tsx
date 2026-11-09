import { Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";

const descriptions: Record<string, string> = {
  github: "Conecte uma ou mais contas e instalações do GitHub.",
  providers: "Configure credenciais, modelos e rotas de fallback.",
  "decision-models":
    "Defina os modelos que escolhem como cada tarefa será executada.",
  storage:
    "Selecione storage local, remoto ou misto para as capacidades da Engine.",
  behavior: "Ajuste as políticas, limites e instruções do Bot.",
  engine: "Consulte e configure as capacidades disponíveis na Vectora Engine.",
};

export function SectionPage() {
  const { section } = useParams({ from: "/$section" });
  const title = section.replaceAll("-", " ");

  return (
    <main className="section-page">
      <motion.section
        className="panel section-placeholder"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="eyebrow">CONFIGURAÇÃO DO GH BOT</span>
        <h1>{title}</h1>
        <p>
          {descriptions[section] ??
            "Esta área será configurada nesta instalação."}
        </p>
        <p className="muted">
          A tela de configuração está no bootstrap e ainda não conecta serviços.
        </p>
        <Link className="back-link" to="/">
          Voltar à visão geral
        </Link>
      </motion.section>
    </main>
  );
}
