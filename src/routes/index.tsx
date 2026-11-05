import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { derivative, optimize, validate, volume, type Optimization } from "@/lib/box-math";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalculaTech – Otimizador Inteligente de Embalagens" },
      {
        name: "description",
        content:
          "Calcule a caixa sem tampa de volume máximo usando funções, limites e derivadas de Cálculo 1.",
      },
      { property: "og:title", content: "CalculaTech – Otimizador Inteligente de Embalagens" },
      {
        property: "og:description",
        content: "Aplicação de Cálculo 1 para otimizar o volume de embalagens de papelão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- utilidades de formatação ---------- */
const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Index() {
  // Entradas do usuário (texto, para permitir validação)
  const [cIn, setCIn] = useState("30");
  const [wIn, setWIn] = useState("30");
  const [dims, setDims] = useState({ c: 30, w: 30 });
  const [error, setError] = useState<string | null>(null);
  const [xSel, setXSel] = useState(3);

  const opt = useMemo(() => optimize(dims.c, dims.w), [dims]);

  function calcular() {
    const c = parseFloat(cIn.replace(",", "."));
    const w = parseFloat(wIn.replace(",", "."));
    const err = validate(c, w);
    setError(err);
    if (err) return;
    setDims({ c, w });
    setXSel(+(optimize(c, w).x / 2).toFixed(2));
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16">
        <Problem />

        {/* 4–5. Entrada de dados */}
        <Section id="calcular" kicker="Etapa 1" title="Informe as dimensões da folha">
          <div className="grid gap-6 rounded-2xl border bg-card p-6 shadow-card md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label="Comprimento da folha (cm)" value={cIn} onChange={setCIn} />
            <Field label="Largura da folha (cm)" value={wIn} onChange={setWIn} />
            <button
              onClick={calcular}
              className="btn-calc rounded-xl bg-primary px-6 py-3.5 font-semibold tracking-wide text-primary-foreground"
            >
              CALCULAR OTIMIZAÇÃO
            </button>
            <p className="text-sm text-muted-foreground md:col-span-3">
              Use valores iguais para uma folha quadrada (caso clássico V(x) = x(L − 2x)²) ou
              diferentes para uma folha retangular.
            </p>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive md:col-span-3">
                {error}
              </p>
            )}
          </div>
        </Section>

        <Results opt={opt} dims={dims} />
        <Chart opt={opt} dims={dims} xSel={xSel} setXSel={setXSel} />
        <Simulator opt={opt} dims={dims} xSel={xSel} setXSel={setXSel} />
        <Concepts opt={opt} dims={dims} />
        <Foundation opt={opt} dims={dims} />
        <Conclusion opt={opt} dims={dims} />
      </main>
      <footer className="bg-navy py-8 text-center text-sm text-navy-foreground/70">
        CalculaTech · Projeto acadêmico de Cálculo Diferencial e Integral 1
      </footer>
    </div>
  );
}

type P = { opt: Optimization; dims: { c: number; w: number } };

/* ---------- blocos de layout ---------- */
function Header() {
  const links = [
    ["#calcular", "Calcular"],
    ["#resultados", "Resultados"],
    ["#grafico", "Gráfico"],
    ["#simulador", "Simulador"],
    ["#conceitos", "Conceitos"],
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-navy-foreground/10 bg-navy/95 text-navy-foreground backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-mono text-accent-foreground">
            ∂
          </span>
          Calcula<span className="text-sky">Tech</span>
        </a>
        <nav className="hidden gap-6 text-sm md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="opacity-80 transition hover:text-sky hover:opacity-100">
              {l}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero relative overflow-hidden text-navy-foreground">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <p className="fade-up font-mono text-sm text-sky">Cálculo 1 · Otimização aplicada</p>
        <h1 className="fade-up mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          CalculaTech – Otimizador Inteligente de Embalagens
        </h1>
        <p className="fade-up mt-6 max-w-2xl text-lg opacity-85">
          Descubra, com derivadas, qual o tamanho exato dos cortes em uma folha de papelão para
          fabricar a caixa sem tampa com a <strong>maior capacidade possível</strong>.
        </p>
        <div className="fade-up mt-8 flex flex-wrap gap-3 font-mono text-sm">
          <span className="rounded-full border border-sky/40 px-4 py-1.5">V(x) = x(L − 2x)²</span>
          <span className="rounded-full border border-sky/40 px-4 py-1.5">V′(x) = (L − 2x)(L − 6x)</span>
          <span className="rounded-full bg-accent px-4 py-1.5 text-accent-foreground">x = L/6</span>
        </div>
        <a
          href="#calcular"
          className="btn-calc mt-10 inline-block rounded-xl bg-navy-foreground px-6 py-3 font-semibold text-navy"
        >
          Começar a otimizar →
        </a>
      </div>
    </section>
  );
}

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 fade-up">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{kicker}</p>
      <h2 className="mb-6 mt-1 text-2xl font-bold md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-lg outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
      />
    </label>
  );
}

function Card({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card transition hover:-translate-y-1 ${
        highlight ? "bg-navy text-navy-foreground" : "bg-card"
      }`}
    >
      <p className={`text-sm ${highlight ? "text-sky" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold">
        {value} <span className="text-base opacity-70">{unit}</span>
      </p>
    </div>
  );
}

/* ---------- 2–3. Problema ---------- */
function Problem() {
  return (
    <Section kicker="O problema real" title="Como fabricar a melhor caixa com uma única folha?">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 text-muted-foreground">
          <p>
            Uma indústria de embalagens recebe folhas de papelão e precisa produzir caixas sem tampa.
            Para isso, retira um quadrado de lado <b className="text-foreground">x</b> de cada um dos
            quatro cantos e dobra as laterais para cima.
          </p>
          <p>
            Se o corte for pequeno demais, a caixa fica rasa. Se for grande demais, a base fica
            minúscula. Existe um tamanho ideal — e o Cálculo nos diz exatamente qual é.
          </p>
          <p>
            <b className="text-foreground">Objetivo do projeto:</b> mostrar que funções, limites e
            derivadas resolvem problemas concretos de engenharia e produção.
          </p>
        </div>
        <div className="rounded-2xl bg-secondary p-6 font-mono text-sm text-secondary-foreground">
          <p>L = lado da folha</p>
          <p>x = lado do quadrado cortado</p>
          <p className="mt-3">altura = x</p>
          <p>base = (L − 2x) × (L − 2x)</p>
          <p className="mt-3 text-base font-semibold">V(x) = x(L − 2x)²</p>
          <p>Domínio: 0 &lt; x &lt; L/2</p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- 6. Resultados ---------- */
function Results({ opt, dims }: P) {
  // Comparação com outros cortes possíveis (frações do domínio)
  const samples = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5].map((k) => opt.x * k).filter((x) => x < opt.domainMax);
  return (
    <Section id="resultados" kicker="Etapa 2" title="Painel de resultados">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Corte ideal nos cantos (x)" value={fmt(opt.x)} unit="cm" highlight />
        <Card label="Altura da caixa" value={fmt(opt.height)} unit="cm" />
        <Card label="Comprimento da base" value={fmt(opt.baseLength)} unit="cm" />
        <Card label="Largura da base" value={fmt(opt.baseWidth)} unit="cm" />
        <Card label="Volume máximo" value={fmt(opt.maxVolume)} unit="cm³" highlight />
        <Card label="Capacidade" value={fmt(opt.maxVolume / 1000, 3)} unit="litros" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="px-4 py-3">Corte x (cm)</th>
              <th className="px-4 py-3">Volume (cm³)</th>
              <th className="px-4 py-3">% do máximo</th>
              <th className="px-4 py-3 w-1/3">Comparação</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {samples.map((x) => {
              const v = volume(x, dims.c, dims.w);
              const pct = (v / opt.maxVolume) * 100;
              const best = Math.abs(x - opt.x) < 1e-9;
              return (
                <tr key={x} className={`border-t ${best ? "bg-accent/15 font-semibold" : ""}`}>
                  <td className="px-4 py-2.5">{fmt(x)} {best && "★"}</td>
                  <td className="px-4 py-2.5">{fmt(v)}</td>
                  <td className="px-4 py-2.5">{fmt(pct, 1)}%</td>
                  <td className="px-4 py-2.5">
                    <div className="h-2 rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${best ? "bg-primary" : "bg-accent"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ---------- 7. Gráfico interativo (SVG gerado dinamicamente) ---------- */
function Chart({ opt, dims, xSel, setXSel }: P & { xSel: number; setXSel: (n: number) => void }) {
  const W = 720, H = 380, pad = { l: 70, r: 20, t: 20, b: 50 };
  const xMax = opt.domainMax;
  const yMax = opt.maxVolume * 1.12;
  const sx = (x: number) => pad.l + (x / xMax) * (W - pad.l - pad.r);
  const sy = (y: number) => H - pad.b - (y / yMax) * (H - pad.t - pad.b);

  const pts = Array.from({ length: 201 }, (_, i) => {
    const x = (xMax * i) / 200;
    return `${sx(x)},${sy(volume(x, dims.c, dims.w))}`;
  }).join(" ");

  const xs = Math.min(Math.max(xSel, 0), xMax);
  const vSel = volume(xs, dims.c, dims.w);
  const dSel = derivative(xs, dims.c, dims.w);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Section id="grafico" kicker="Etapa 3" title="Gráfico interativo de V(x)">
      <div className="rounded-2xl border bg-card p-4 shadow-card md:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico do volume em função do corte">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={sy(yMax * t)} y2={sy(yMax * t)} className="stroke-border" />
              <text x={pad.l - 8} y={sy(yMax * t) + 4} textAnchor="end" className="fill-muted-foreground font-mono text-[11px]">
                {fmt(yMax * t, 0)}
              </text>
              <text x={sx(xMax * t)} y={H - pad.b + 18} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px]">
                {fmt(xMax * t, 1)}
              </text>
            </g>
          ))}
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} className="stroke-foreground" />
          <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} className="stroke-foreground" />
          <text x={(W + pad.l) / 2} y={H - 8} textAnchor="middle" className="fill-foreground text-xs font-semibold">
            Eixo X: tamanho do corte x (cm)
          </text>
          <text transform={`translate(16 ${(H - pad.b) / 2}) rotate(-90)`} textAnchor="middle" className="fill-foreground text-xs font-semibold">
            Eixo Y: volume V(x) (cm³)
          </text>

          <polyline points={pts} fill="none" className="stroke-primary" strokeWidth={3} />

          {/* ponto de máximo */}
          <line x1={sx(opt.x)} x2={sx(opt.x)} y1={sy(opt.maxVolume)} y2={H - pad.b} strokeDasharray="4 4" className="stroke-accent" />
          <circle cx={sx(opt.x)} cy={sy(opt.maxVolume)} r={7} className="fill-accent stroke-primary" strokeWidth={2} />
          <text x={sx(opt.x)} y={sy(opt.maxVolume) - 14} textAnchor="middle" className="fill-primary font-mono text-xs font-semibold">
            Vmáx = {fmt(opt.maxVolume)} cm³ (x = {fmt(opt.x)})
          </text>

          {/* ponto selecionado pelo usuário */}
          <line x1={sx(xs)} x2={sx(xs)} y1={sy(vSel)} y2={H - pad.b} className="stroke-muted-foreground" />
          <circle cx={sx(xs)} cy={sy(vSel)} r={6} className="fill-destructive" />
        </svg>

        <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr] md:items-center">
          <label className="block">
            <span className="text-sm font-medium">Altere o corte x: <b className="font-mono">{fmt(xs)} cm</b></span>
            <input
              type="range"
              min={0}
              max={xMax}
              step={xMax / 500}
              value={xs}
              onChange={(e) => setXSel(+e.target.value)}
              className="mt-2 w-full accent-primary"
            />
          </label>
          <div className="rounded-xl bg-secondary p-4 font-mono text-sm text-secondary-foreground">
            <p>V({fmt(xs)}) = {fmt(vSel)} cm³</p>
            <p>V′({fmt(xs)}) = {fmt(dSel)}</p>
            <p className="mt-1 font-sans text-xs">
              {Math.abs(dSel) < Math.abs(derivative(0, dims.c, dims.w)) * 0.01
                ? "Derivada ≈ 0: você está no ponto de máximo!"
                : dSel > 0
                  ? "V′ > 0: aumentar x aumenta o volume."
                  : "V′ < 0: aumentar x diminui o volume."}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- 8. Simulador visual ---------- */
function Simulator({ opt, dims, xSel, setXSel }: P & { xSel: number; setXSel: (n: number) => void }) {
  const [fold, setFold] = useState(90);
  const [useOpt, setUseOpt] = useState(true);
  const x = useOpt ? opt.x : Math.min(xSel, opt.domainMax * 0.999);
  const k = 220 / Math.max(dims.c, dims.w); // escala px/cm
  const C = dims.c * k, Wd = dims.w * k, X = x * k;
  const bl = C - 2 * X, bw = Wd - 2 * X;

  const flap = "absolute bg-cardboard border border-cardboard-dark";
  return (
    <Section id="simulador" kicker="Etapa 4" title="Simulador visual da caixa">
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setUseOpt(true)} className={`btn-calc rounded-lg px-4 py-2 text-sm ${useOpt ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          Corte ideal ({fmt(opt.x)} cm)
        </button>
        <button onClick={() => setUseOpt(false)} className={`btn-calc rounded-lg px-4 py-2 text-sm ${!useOpt ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          Corte do gráfico ({fmt(Math.min(xSel, opt.domainMax))} cm)
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* folha original */}
        <SimCard title="1. Folha original" caption={`${fmt(dims.c, 1)} × ${fmt(dims.w, 1)} cm`}>
          <svg viewBox="-10 -10 240 240" className="h-60 w-full">
            <rect x={(220 - C) / 2} y={(220 - Wd) / 2} width={C} height={Wd} className="fill-cardboard stroke-cardboard-dark" strokeWidth={2} />
          </svg>
        </SimCard>
        {/* cortes */}
        <SimCard title="2. Quadrados removidos" caption={`4 cortes de ${fmt(x)} × ${fmt(x)} cm`}>
          <svg viewBox="-10 -10 240 240" className="h-60 w-full">
            <g transform={`translate(${(220 - C) / 2} ${(220 - Wd) / 2})`}>
              <rect width={C} height={Wd} className="fill-cardboard stroke-cardboard-dark" strokeWidth={2} />
              {[[0, 0], [C - X, 0], [0, Wd - X], [C - X, Wd - X]].map(([a, b], i) => (
                <rect key={i} x={a} y={b} width={X} height={X} className="fill-destructive/30 stroke-destructive" strokeDasharray="3 3" />
              ))}
              <rect x={X} y={X} width={bl} height={bw} fill="none" className="stroke-primary" strokeDasharray="6 4" />
            </g>
          </svg>
        </SimCard>
        {/* dobra + 3D */}
        <SimCard title="3. Dobra e caixa em 3D" caption={`Base ${fmt(bl / k)} × ${fmt(bw / k)} cm · altura ${fmt(x)} cm`}>
          <div className="grid h-60 place-items-center" style={{ perspective: 800 }}>
            <div style={{ transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-35deg)" }}>
              <div className="relative bg-cardboard-dark/80 border border-cardboard-dark" style={{ width: bl, height: bw, transformStyle: "preserve-3d" }}>
                <div className={flap} style={{ width: bl, height: X, bottom: "100%", left: 0, transformOrigin: "bottom", transform: `rotateX(${-fold}deg)` }} />
                <div className={flap} style={{ width: bl, height: X, top: "100%", left: 0, transformOrigin: "top", transform: `rotateX(${fold}deg)` }} />
                <div className={flap} style={{ width: X, height: bw, right: "100%", top: 0, transformOrigin: "right", transform: `rotateY(${fold}deg)` }} />
                <div className={flap} style={{ width: X, height: bw, left: "100%", top: 0, transformOrigin: "left", transform: `rotateY(${-fold}deg)` }} />
              </div>
            </div>
          </div>
          <label className="mt-2 block text-sm">
            Dobrar laterais: {fold}°
            <input type="range" min={0} max={90} value={fold} onChange={(e) => setFold(+e.target.value)} className="w-full accent-primary" />
          </label>
        </SimCard>
      </div>
      {!useOpt && (
        <p className="mt-4 text-sm text-muted-foreground">
          Volume com este corte: <b className="font-mono">{fmt(volume(x, dims.c, dims.w))} cm³</b> (
          {fmt((volume(x, dims.c, dims.w) / opt.maxVolume) * 100, 1)}% do máximo). Ajuste no gráfico acima.
          <button className="ml-2 underline" onClick={() => setXSel(opt.x)}>Ir para o ideal</button>
        </p>
      )}
    </Section>
  );
}

function SimCard({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <p className="font-semibold">{title}</p>
      {children}
      <p className="mt-2 font-mono text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}

/* ---------- 9. Conceitos de Cálculo 1 ---------- */
function Concepts({ opt, dims }: P) {
  const m = opt.domainMax;
  const near0 = [0.1, 0.01, 0.001].map((e) => e * m);
  const nearM = [0.9, 0.99, 0.999].map((e) => e * m);
  const items: [string, ReactNode][] = [
    ["Funções", <>O volume depende do corte: cada valor de x gera uma caixa diferente. Com a folha {fmt(dims.c, 1)} × {fmt(dims.w, 1)} cm, V(x) = x({fmt(dims.c, 1)} − 2x)({fmt(dims.w, 1)} − 2x).</>],
    ["Limites", (
      <>
        Nas extremidades do domínio a caixa “desaparece”:
        <span className="mt-2 block font-mono text-xs">
          {near0.map((x) => <span key={x} className="block">V({fmt(x, 4)}) = {fmt(volume(x, dims.c, dims.w), 4)}</span>)}
          <span className="block font-semibold">lim x→0⁺ V(x) = 0</span>
          {nearM.map((x) => <span key={x} className="block">V({fmt(x, 4)}) = {fmt(volume(x, dims.c, dims.w), 4)}</span>)}
          <span className="block font-semibold">lim x→{fmt(m, 2)}⁻ V(x) = 0</span>
        </span>
      </>
    )],
    ["Derivadas", <>V′(x) = 12x² − 4(C + W)x + CW mede a taxa de variação do volume: quantos cm³ ganhamos ou perdemos por cm a mais de corte. Na folha quadrada: V′(x) = (L − 2x)(L − 6x).</>],
    ["Máximos e mínimos", <>V′(x) = 0 em x₁ = {fmt(opt.critical[0])} e x₂ = {fmt(opt.critical[1])}. Só x₁ está no domínio (0, {fmt(m)}). Como V″(x₁) = {fmt(opt.secondDeriv)} &lt; 0, a concavidade é para baixo: é um <b>máximo</b>.</>],
    ["Otimização", <>Juntando tudo: o volume é zero nas pontas, positivo no meio e tem um único ponto crítico. Logo x = {fmt(opt.x)} cm gera a maior capacidade possível: {fmt(opt.maxVolume)} cm³.</>],
  ];
  return (
    <Section id="conceitos" kicker="Teoria aplicada" title="Os conceitos de Cálculo 1 em ação">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([t, body], i) => (
          <div key={t} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1">
            <p className="font-mono text-xs text-accent">0{i + 1}</p>
            <h3 className="mt-1 text-lg font-bold">{t}</h3>
            <div className="mt-2 text-sm text-muted-foreground">{body}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Fundamentação matemática ---------- */
function Foundation({ opt, dims }: P) {
  const square = Math.abs(dims.c - dims.w) < 1e-9;
  const L = dims.c;
  return (
    <Section kicker="Apresentação acadêmica" title="Fundamentação Matemática">
      <div className="space-y-4 rounded-2xl bg-navy p-6 font-mono text-sm leading-relaxed text-navy-foreground md:p-8">
        <p className="text-sky">1. Modelagem</p>
        <p>V(x) = x · (C − 2x) · (W − 2x),  0 &lt; x &lt; min(C, W)/2</p>
        <p className="text-sky">2. Derivada</p>
        <p>V′(x) = 12x² − 4(C + W)x + CW</p>
        <p>Caso quadrado (C = W = L): V′(x) = (L − 2x)(L − 6x)</p>
        <p className="text-sky">3. Pontos críticos (V′ = 0)</p>
        <p>x = [(C + W) ± √(C² − CW + W²)] / 6 → x₁ = {fmt(opt.critical[0], 4)}, x₂ = {fmt(opt.critical[1], 4)}</p>
        {square && <p>Como a folha é quadrada: x = L/6 = {fmt(L, 2)}/6 = {fmt(L / 6, 4)} cm</p>}
        <p className="text-sky">4. Teste da segunda derivada</p>
        <p>V″(x) = 24x − 4(C + W) → V″({fmt(opt.x, 4)}) = {fmt(opt.secondDeriv, 4)} &lt; 0 ⇒ máximo</p>
        <p className="text-sky">5. Volume máximo</p>
        <p>V({fmt(opt.x, 4)}) = {fmt(opt.maxVolume, 4)} cm³</p>
        {square && <p>Verificação: 2L³/27 = 2·{fmt(L, 2)}³/27 = {fmt((2 * L ** 3) / 27, 4)} cm³</p>}
        <p className="font-sans text-navy-foreground/80">
          Interpretação: cortando quadrados de {fmt(opt.x)} cm, obtém-se uma caixa de
          {" "}{fmt(opt.baseLength)} × {fmt(opt.baseWidth)} × {fmt(opt.height)} cm. Qualquer outro
          corte produz uma caixa de menor capacidade com a mesma folha.
        </p>
      </div>
    </Section>
  );
}

/* ---------- 10. Conclusão ---------- */
function Conclusion({ opt, dims }: P) {
  const waste = (4 * opt.x * opt.x) / opt.sheetArea * 100;
  const naive = volume(opt.domainMax / 4, dims.c, dims.w);
  const gain = ((opt.maxVolume - naive) / naive) * 100;
  return (
    <Section kicker="Conclusão" title="A importância da otimização matemática">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4 text-muted-foreground">
          <p>
            Com Cálculo 1, deixamos de fabricar caixas “no olho”. A derivada indica exatamente onde
            o volume para de crescer e começa a cair, garantindo a maior capacidade possível com a
            mesma quantidade de papelão.
          </p>
          <p>
            Isso significa menos folhas para armazenar o mesmo volume de produtos, menos desperdício
            de material, menor custo e menor impacto ambiental — a matemática a serviço da eficiência
            industrial.
          </p>
        </div>
        <div className="space-y-3">
          <Card label="Material descartado nos cortes" value={fmt(waste, 1)} unit="%" />
          <Card label={`Ganho vs. corte arbitrário (x = ${fmt(opt.domainMax / 4)} cm)`} value={`+${fmt(gain, 1)}`} unit="%" highlight />
        </div>
      </div>
    </Section>
  );
}
