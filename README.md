# CalculaTech

# PROMPT — CRIAÇÃO DE UMA PÁGINA WEB: CALCULATECH

Desenvolva uma página web interativa, moderna e responsiva, com o nome **CalculaTech – Otimizador Inteligente de Embalagens**, utilizando HTML, CSS e JavaScript.

## 1. Objetivo do projeto

A página deverá demonstrar, na prática, como os conceitos de Cálculo Diferencial e Integral 1 podem ser aplicados para resolver problemas reais por meio da tecnologia.

O sistema deverá permitir que o usuário informe as dimensões de uma folha de papelão e calcule automaticamente as dimensões ideais para construir uma caixa sem tampa com o maior volume possível, utilizando conceitos de funções, limites, derivadas e otimização.

## 2. Problema matemático

O problema consiste em fabricar uma caixa sem tampa a partir de uma folha quadrada de papelão.

Para isso, serão retirados quadrados de lado x dos quatro cantos da folha, dobrando-se as laterais para formar a caixa.

Considere L como o lado da folha de papelão.

A função matemática que representa o volume da caixa será:

V(x) = x(L - 2x)²

O domínio da função será:

0 < x < L/2

A aplicação deverá calcular:

- O volume da caixa em função de x.

- A primeira derivada da função.

- Os pontos críticos.

- O ponto de máximo volume.

- As dimensões ideais da caixa.

- O volume máximo possível.

A derivada da função será:

V'(x) = (L - 2x)(L - 6x)

O ponto de máximo será encontrado em:

x = L/6

O volume máximo será:

Vmáx = 2L³/27

## 3. Funcionalidades obrigatórias

### A) Entrada de dados

Criar campos para o usuário informar:

- Comprimento da folha (em centímetros).

- Largura da folha (em centímetros), permitindo também trabalhar com folhas retangulares como funcionalidade adicional.

Adicionar um botão chamado "CALCULAR OTIMIZAÇÃO".

### B) Resultados automáticos

Após inserir os dados, o sistema deverá apresentar:

- Medida ideal dos cortes nos cantos.

- Altura da caixa.

- Comprimento da base.

- Largura da base.

- Volume máximo.

- Comparação entre o volume máximo e outros volumes possíveis.

### C) Gráficos interativos

Criar um gráfico da função V(x), mostrando:

- Eixo X: tamanho dos cortes.

- Eixo Y: volume da caixa.

- Curva da função.

- Ponto de máximo destacado.

- Identificação do volume máximo.

Permitir que o usuário altere o valor de x e visualize como o volume muda no gráfico.

### D) Aplicação dos conceitos de Cálculo 1

A página deverá apresentar uma seção explicativa contendo:

**Funções:** explicar como o volume depende do tamanho dos cortes.

**Limites:** demonstrar o comportamento da função quando x se aproxima de 0 e de L/2, mostrando que o volume tende a zero.

**Derivadas:** apresentar a derivada e explicar como ela representa a taxa de variação do volume.

**Máximos e mínimos:** identificar o ponto crítico e demonstrar por que ele representa um máximo.

**Otimização:** explicar como a matemática permite encontrar as dimensões que produzem a maior capacidade possível da caixa.

## 4. Simulador visual

Criar uma representação visual da folha de papelão antes e depois dos cortes.

O usuário deverá conseguir visualizar:

- A folha original.

- Os quatro quadrados que serão removidos.

- As laterais sendo dobradas.

- A caixa formada em perspectiva 3D.

A representação deverá atualizar automaticamente conforme os valores inseridos.

## 5. Design da página

Desenvolver uma interface com aparência profissional e tecnológica.

Características:

- Design moderno e intuitivo.

- Cores predominantes: azul-escuro, branco e azul-claro.

- Layout responsivo para celulares e computadores.

- Botões com efeitos visuais.

- Gráficos bem identificados.

- Resultados organizados em cartões.

- Animações suaves.

- Linguagem simples e explicativa.

## 6. Organização das seções

A página deverá conter:

1. Cabeçalho com o nome CalculaTech.

2. Apresentação e objetivo do projeto.

3. Explicação do problema real.

4. Campo para entrada de dados.

5. Botão para realizar os cálculos.

6. Painel de resultados.

7. Gráfico interativo da função.

8. Simulador visual da caixa.

9. Explicação dos conceitos de Cálculo 1.

10. Conclusão demonstrando a importância da otimização matemática.

## 7. Requisitos técnicos

- Utilizar HTML5, CSS3 e JavaScript.

- Todos os cálculos deverão funcionar automaticamente.

- Os gráficos deverão ser gerados dinamicamente.

- Validar os dados inseridos pelo usuário.

- Evitar resultados incorretos para dimensões inválidas.

- Garantir funcionamento em dispositivos móveis.

- Organizar o código de maneira clara e comentada.

- Não utilizar resultados fictícios: todos os valores devem ser calculados com base nos dados inseridos.

## 8. Apresentação acadêmica

Adicionar uma seção chamada "Fundamentação Matemática", explicando as fórmulas, os cálculos e a interpretação dos resultados.

Adicionar também uma conclusão que demonstre como a aplicação dos conceitos de Cálculo 1 pode reduzir desperdícios de material e aumentar a eficiência na fabricação de embalagens.

**IMPORTANTE:** Não criar apenas uma página ilustrativa. Desenvolver uma aplicação computacional funcional, na qual o usuário possa inserir informações, executar cálculos matemáticos, visualizar gráficos e observar os resultados de uma otimização real.

O resultado final deverá ser um protótipo tecnológico funcional, adequado para apresentação de um projeto acadêmico de Cálculo 1.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0ff4fa21-e531-51d0-9532-e6e137e27ec0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
