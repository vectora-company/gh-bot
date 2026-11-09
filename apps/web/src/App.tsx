const sections = ["Visão geral", "GitHub", "Providers", "Decision Models", "Storage", "Comportamento", "Engine"];

export function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">V</span><span>Vectora <b>GH Bot</b></span></div>
        <div className="instance"><span className="status-dot" /> Instalação GH Bot <small>bootstrap</small></div>
        <nav aria-label="Configurações">
          {sections.map((section, index) => <a className={index === 0 ? "active" : "disabled"} href="#" key={section}>{section}<span>{index === 0 ? "⌂" : "·"}</span></a>)}
        </nav>
        <div className="sidebar-footer"><span>Hosted · Self-hosted</span><span>v0.1.0-dev</span></div>
      </aside>

      <main>
        <header className="topbar"><div><span className="eyebrow">PRODUTO INDEPENDENTE · VECTORa ENGINE</span><h1>Configure seu GH Bot</h1></div><button className="user-button" disabled>Entrar com Vectora Services <span>↗</span></button></header>
        <section className="intro">
          <div className="intro-icon">✳</div>
          <div><p className="eyebrow">UM PRODUTO, DUAS FORMAS DE OPERAR</p><h2>Automação agêntica para seus repositórios GitHub.</h2><p>O GH Bot consome a Vectora Engine sem depender do app desktop. Escolha entre a operação hosted pela Vectora ou hospedar sua própria instância; a configuração fica no GH Bot.</p></div>
        </section>
        <section className="steps">
          <article className="step-card"><div className="step-number">01</div><div><span className="tag">HOSTED · ASSINATURA</span><h3>Operado pela Vectora</h3><p>A Vectora Ltda mantém o runtime e a disponibilidade. O endpoint hospedado será conectado à Action após login e validação do plano.</p><button disabled>Verificar acesso hosted <span>→</span></button></div></article>
          <article className="step-card"><div className="step-number">02</div><div><span className="tag">SELF-HOSTED · SEUS RECURSOS</span><h3>Hospede sua instância</h3><p>Instale por npm, Docker ou Kubernetes na sua VPS. Configure endpoint e credenciais; a review-action chega pela URL pública, com roteamento Cloudflare opcional, sem executar o Bot no Services.</p><button disabled>Configurar instalação <span>→</span></button></div></article>
        </section>
        <section className="steps">
          <article className="step-card"><div className="step-number">03</div><div><span className="tag">IDENTIDADE</span><h3>Login com Services</h3><p>Use o Vectora token disponibilizado pela Company para autenticar sua conta. Login não encaminha eventos nem chamadas de execução pelo Services.</p><button disabled>Entrar com Vectora <span>→</span></button></div></article>
          <article className="step-card"><div className="step-number">04</div><div><span className="tag">GITHUB</span><h3>Conectar pelo review-action</h3><p>Configure endpoint e token próprio do GH Bot no workflow para chamar a instância hospedada ou seu endpoint self-hosted.</p><button disabled>Configurar Action <span>→</span></button></div></article>
          <article className="step-card"><div className="step-number">05</div><div><span className="tag">ENGINE</span><h3>Configurar runtime agêntico</h3><p>Escolha providers, modelos por tarefa, Decision Models e backends de storage suportados pela Engine.</p><button disabled>Configurar Engine <span>→</span></button></div></article>
        </section>
        <section className="bottom-grid">
          <div className="panel"><div className="panel-heading"><div><span className="eyebrow">ESTADO DO PRODUTO</span><h3>Capacidades</h3></div><span className="pill neutral">Bootstrap</span></div><div className="service-row"><span>Vectora Services</span><span className="muted">Login/entitlement</span></div><div className="service-row"><span>Vectora Engine</span><span className="muted">Binding npm pendente</span></div><div className="service-row"><span>review-action</span><span className="muted">Endpoint direto</span></div></div>
          <div className="panel panel-note"><span className="eyebrow">TRÁFEGO E PRIVACIDADE</span><h3>Services não processa os jobs</h3><p>Na modalidade self-hosted, a review-action chama o endpoint público, que pode rotear pela borda Cloudflare até sua instância. A Vectora opera a modalidade paga. O Services cuida de login e de capacidades contratadas.</p><a href="https://github.com/vectora-ltda/gh-bot/tree/main/docs">Ler arquitetura e segurança <span>↗</span></a></div>
        </section>
        <footer>Vectora GH Bot · Open source sob AGPL-3.0 · <a href="https://github.com/vectora-ltda/gh-bot">vectora-ltda/gh-bot</a></footer>
      </main>
    </div>
  );
}
