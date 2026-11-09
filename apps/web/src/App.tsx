const sections = ["Visão geral", "GitHub", "Providers", "Decision Models", "Storage", "Comportamento", "Engine"];

export function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">V</span><span>Vectora <b>GH Bot</b></span></div>
        <div className="instance"><span className="status-dot" /> Instalação local <small>bootstrap</small></div>
        <nav aria-label="Configurações">
          {sections.map((section, index) => <a className={index === 0 ? "active" : "disabled"} href="#" key={section}>{section}<span>{index === 0 ? "⌂" : "·"}</span></a>)}
        </nav>
        <div className="sidebar-footer"><span>Self-hosted</span><span>v0.1.0-dev</span></div>
      </aside>

      <main>
        <header className="topbar"><div><span className="eyebrow">CONFIGURAÇÃO DA INSTÂNCIA</span><h1>Prepare seu GH Bot</h1></div><button className="user-button" disabled>Conectar ao Services <span>↗</span></button></header>
        <section className="intro">
          <div className="intro-icon">✳</div>
          <div><p className="eyebrow">SEU BOT, SUA INFRAESTRUTURA</p><h2>Um runtime independente para suas contas GitHub.</h2><p>Conecte o Vectora Services para validar sua conta e vincular GitHub. Providers, modelos, storage e comportamento serão configurados e guardados nesta instalação.</p></div>
        </section>
        <section className="steps">
          <article className="step-card"><div className="step-number">01</div><div><span className="tag">IDENTIDADE</span><h3>Conectar ao Services</h3><p>Use o Vectora token do dashboard da Company. Contas Free podem criar uma conta e autenticar a instalação.</p><button disabled>Conectar conta <span>→</span></button></div></article>
          <article className="step-card"><div className="step-number">02</div><div><span className="tag">GITHUB</span><h3>Vincular contas e instalações</h3><p>Adicione uma ou mais contas GitHub e escolha quais repositórios esta instância poderá atender.</p><button disabled>Adicionar GitHub <span>→</span></button></div></article>
          <article className="step-card"><div className="step-number">03</div><div><span className="tag">RUNTIME</span><h3>Configurar Engine</h3><p>Escolha providers, modelos de tarefa, Decision Models e backends de storage conforme as capacidades da Engine.</p><button disabled>Configurar Engine <span>→</span></button></div></article>
        </section>
        <section className="bottom-grid">
          <div className="panel"><div className="panel-heading"><div><span className="eyebrow">ESTADO DA INSTÂNCIA</span><h3>Serviços conectados</h3></div><span className="pill neutral">Não configurado</span></div><div className="service-row"><span>Vectora Services</span><span className="muted">Aguardando token</span></div><div className="service-row"><span>Vectora Engine</span><span className="muted">Binding npm pendente</span></div><div className="service-row"><span>GitHub</span><span className="muted">Nenhuma conta vinculada</span></div></div>
          <div className="panel panel-note"><span className="eyebrow">PRINCÍPIO DE PRIVACIDADE</span><h3>Configuração permanece no seu host</h3><p>Chaves de providers, credenciais de storage e políticas do Bot pertencem a esta instalação. O Services cuida de identidade e integrações compartilhadas, não do runtime local.</p><a href="https://github.com/vectora-ltda/gh-bot/tree/main/docs">Ler arquitetura e segurança <span>↗</span></a></div>
        </section>
        <footer>Vectora GH Bot · Open source sob AGPL-3.0 · <a href="https://github.com/vectora-ltda/gh-bot">vectora-ltda/gh-bot</a></footer>
      </main>
    </div>
  );
}
