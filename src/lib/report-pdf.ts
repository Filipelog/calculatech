import { optimize, volume } from "./box-math";

const f = (n: number, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Gera e baixa o relatório PDF da otimização (jsPDF carregado sob demanda). */
export async function downloadReport(c: number, w: number) {
  const { jsPDF } = await import("jspdf");
  const o = optimize(c, w);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const M = 18;
  let y = 0;

  // Cabeçalho
  doc.setFillColor(15, 30, 60);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text("CalculaTech", M, 14);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Relatório de Otimização de Embalagem - Cálculo 1", M, 22);
  doc.text(new Date().toLocaleDateString("pt-BR"), 192, 22, { align: "right" });
  doc.setTextColor(20, 20, 20);
  y = 42;

  const h = (t: string) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(15, 30, 60);
    doc.text(t, M, y);
    doc.setDrawColor(230, 120, 30).setLineWidth(0.6).line(M, y + 1.8, M + 40, y + 1.8);
    doc.setTextColor(20, 20, 20);
    y += 9;
  };
  const p = (t: string) => {
    doc.setFont("helvetica", "normal").setFontSize(10);
    const lines = doc.splitTextToSize(t, 210 - 2 * M);
    if (y + lines.length * 5 > 280) { doc.addPage(); y = 20; }
    doc.text(lines, M, y);
    y += lines.length * 5 + 2;
  };
  const row = (k: string, v: string) => {
    doc.setFont("helvetica", "normal").setFontSize(10).text(k, M, y);
    doc.setFont("helvetica", "bold").text(v, 192, y, { align: "right" });
    doc.setDrawColor(225).setLineWidth(0.2).line(M, y + 2, 192, y + 2);
    y += 7;
  };

  h("1. Dimensões informadas");
  row("Comprimento da folha (C)", `${f(c)} cm`);
  row("Largura da folha (W)", `${f(w)} cm`);
  row("Área da folha", `${f(o.sheetArea)} cm²`);
  y += 4;

  h("2. Resultados da otimização");
  row("Corte ideal nos cantos (x)", `${f(o.x)} cm`);
  row("Altura da caixa", `${f(o.height)} cm`);
  row("Base da caixa", `${f(o.baseLength)} x ${f(o.baseWidth)} cm`);
  row("Volume máximo", `${f(o.maxVolume)} cm³`);
  row("Capacidade", `${f(o.maxVolume / 1000, 3)} litros`);
  row("Material aproveitado", `${f(o.usedArea)} cm² (${f((o.usedArea / o.sheetArea) * 100, 1)}%)`);
  y += 4;

  // Gráfico V(x)
  h("3. Gráfico de V(x)");
  const gx = M + 10, gy = y, gw = 160, gh = 70;
  doc.setDrawColor(120).setLineWidth(0.3);
  doc.line(gx, gy + gh, gx + gw, gy + gh);
  doc.line(gx, gy, gx, gy + gh);
  const N = 120, vmax = o.maxVolume * 1.1;
  const px = (x: number) => gx + (x / o.domainMax) * gw;
  const py = (v: number) => gy + gh - (v / vmax) * gh;
  doc.setDrawColor(30, 90, 200).setLineWidth(0.8);
  for (let i = 0; i < N; i++) {
    const a = (o.domainMax * i) / N, b = (o.domainMax * (i + 1)) / N;
    doc.line(px(a), py(volume(a, c, w)), px(b), py(volume(b, c, w)));
  }
  doc.setDrawColor(230, 120, 30).setLineWidth(0.3);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(px(o.x), py(o.maxVolume), px(o.x), gy + gh);
  doc.line(gx, py(o.maxVolume), px(o.x), py(o.maxVolume));
  doc.setLineDashPattern([], 0);
  doc.setFillColor(230, 120, 30).circle(px(o.x), py(o.maxVolume), 1.4, "F");
  doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(80);
  doc.text("0", gx - 1, gy + gh + 4, { align: "right" });
  doc.text(`${f(o.domainMax)}`, gx + gw, gy + gh + 4, { align: "center" });
  doc.text(`x* = ${f(o.x)}`, px(o.x), gy + gh + 4, { align: "center" });
  doc.text(`${f(o.maxVolume, 0)}`, gx - 1, py(o.maxVolume) + 1, { align: "right" });
  doc.text("x (cm)", gx + gw, gy + gh + 9, { align: "right" });
  doc.text("V (cm³)", gx, gy - 2);
  doc.setFontSize(9).setTextColor(20);
  doc.text(`Máximo: (${f(o.x)} ; ${f(o.maxVolume)})`, px(o.x) + 3, py(o.maxVolume) - 2);
  y = gy + gh + 14;

  // Fundamentação
  doc.addPage(); y = 20;
  h("4. Fundamentação matemática");
  p(`Função volume: ao recortar quadrados de lado x nos cantos de uma folha ${f(c)} x ${f(w)} cm e dobrar as abas, obtém-se V(x) = x(${f(c)} - 2x)(${f(w)} - 2x).`);
  p(`Domínio: as dimensões devem ser positivas, logo 0 < x < ${f(o.domainMax)} cm. Pelos limites, V(x) tende a 0 quando x tende a 0 e quando x tende a ${f(o.domainMax)}, então existe um máximo no interior.`);
  p(`Derivada: V'(x) = 12x² - 4(C + W)x + CW = 12x² - ${f(4 * (c + w))}x + ${f(c * w)}.`);
  p(`Pontos críticos (V'(x) = 0): x1 = ${f(o.critical[0])} cm e x2 = ${f(o.critical[1])} cm. Apenas x1 pertence ao domínio.`);
  p(`Teste da 2ª derivada: V''(x) = 24x - 4(C + W); V''(${f(o.x)}) = ${f(o.secondDeriv)} < 0, portanto x = ${f(o.x)} cm é ponto de máximo.`);
  if (Math.abs(c - w) < 1e-9) p(`Caso quadrado (L = ${f(c)}): V'(x) = (L - 2x)(L - 6x), x* = L/6 = ${f(c / 6)} cm e Vmáx = 2L³/27 = ${f((2 * c ** 3) / 27)} cm³.`);
  p(`Conclusão: o corte ideal é ${f(o.x)} cm, produzindo uma caixa de ${f(o.baseLength)} x ${f(o.baseWidth)} x ${f(o.height)} cm com volume máximo de ${f(o.maxVolume)} cm³.`);
  y += 4;

  h("5. Comparação com outros cortes");
  [0.25, 0.5, 1, 1.5, 2].map((k) => o.x * k).filter((x) => x < o.domainMax).forEach((x) => {
    const v = volume(x, c, w);
    row(`x = ${f(x)} cm${Math.abs(x - o.x) < 1e-9 ? " (ótimo)" : ""}`, `${f(v)} cm³ - ${f((v / o.maxVolume) * 100, 1)}%`);
  });

  doc.save(`calculatech-relatorio-${f(c, 0)}x${f(w, 0)}.pdf`);
}
