---
version: "1.0"
name: Orison Brand System Prompt
description: >
  Sistema de design e identidade visual da Orison — empresa de infraestrutura
  de IA para negócios. Este documento é a fonte normativa de todos os ativos
  de design: tokens de cor, tipografia, espaçamento, bordas, sombras, motion e
  componentes de UI.

colors:
  # Identidade — superfícies e fundo
  black: "#0a0a0a"
  midnight: "#111113"
  surface: "#0d0d0f"
  slate: "#3a3a3a"
  border: "#2e2e2e"
  border-strong: "#3a3a3a"
  gray: "#5a5a5a"
  subtle: "#484848"
  offwhite: "#e8e6e1"

  # Texto — escala concreta (sem empilhamento de opacidade)
  text-primary: "#f7f5f0"
  text-body: "#edeae4"
  text-secondary: "#d4d2cd"
  text-muted: "#bcbab5"

  # Acento — crimson é a cor de ação e destaque exclusivo
  crimson: "#8B1A1A"
  red: "#A52020"
  crimson-text: "#F06070"

  # Opacidade semântica
  text-dim: "rgba(232, 230, 225, 0.55)"

  # Visualização de dados
  negative-hi: "#8B1A1A"
  negative-md: "#C0392B"
  alert-hi: "#8B4A1A"
  alert-md: "#C0622B"
  positive-hi: "#1A5C2E"
  positive-md: "#27834A"

  # Acento de borda
  border-accent: "#8B1A1A"

  # Data Visualization — escalas expandidas
  # Sequencial Crimson (8 steps — heatmaps, density maps)
  crimson-scale-1: "#1A0505"
  crimson-scale-2: "#2D0A0A"
  crimson-scale-3: "#4A1010"
  crimson-scale-4: "#6B1515"
  crimson-scale-5: "#8B1A1A"
  crimson-scale-6: "#A52020"
  crimson-scale-7: "#C03030"
  crimson-scale-8: "#D94040"

  # Sequencial Neutral (8 steps — intensidade sem conotação)
  neutral-scale-1: "#111113"
  neutral-scale-2: "#1A1A1C"
  neutral-scale-3: "#252527"
  neutral-scale-4: "#303032"
  neutral-scale-5: "#3A3A3C"
  neutral-scale-6: "#4A4A4C"
  neutral-scale-7: "#5A5A5C"
  neutral-scale-8: "#6A6A6C"

  # Divergente (5 steps — negativo ↔ neutro ↔ positivo)
  divergent-neg-hi: "#8B1A1A"
  divergent-neg: "#6B1515"
  divergent-neutral: "#3A3A3C"
  divergent-pos: "#1A5C2E"
  divergent-pos-hi: "#27834A"

  # Categórica (6 cores máximas — séries de chart)
  cat-crimson: "#8B1A1A"
  cat-amber: "#8B4A1A"
  cat-teal: "#1A6B6B"
  cat-steel: "#4A6A8B"
  cat-olive: "#4A6B1A"
  cat-plum: "#6B1A6B"

typography:
  # Display — Cormorant Garamond (editorial, sofisticado)
  display-hero:
    fontFamily: Cormorant Garamond
    fontSize: 56px
    fontWeight: 300
    letterSpacing: 18px
  display-xl:
    fontFamily: Cormorant Garamond
    fontSize: 52px
    fontWeight: 300
    letterSpacing: 8px
  display-lg:
    fontFamily: Cormorant Garamond
    fontSize: 36px
    fontWeight: 300
    letterSpacing: 6px
  display-md:
    fontFamily: Cormorant Garamond
    fontSize: 28px
    fontWeight: 300
    letterSpacing: 6px
  display-sm:
    fontFamily: Cormorant Garamond
    fontSize: 20px
    fontWeight: 300
    letterSpacing: 16px
  display-xs:
    fontFamily: Cormorant Garamond
    fontSize: 18px
    fontWeight: 300
    letterSpacing: 4px

  # Body — Montserrat (técnico, preciso)
  body:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: 300
    lineHeight: 1.9
  label:
    fontFamily: Montserrat
    fontSize: 9px
    fontWeight: 400
    letterSpacing: 5px
  micro:
    fontFamily: Montserrat
    fontSize: 8px
    fontWeight: 400
    letterSpacing: 4px

spacing:
  base: 8px
  1: 4px
  2: 8px
  3: 16px
  4: 24px
  5: 32px
  6: 48px
  7: 64px
  8: 80px

rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px

components:
  # Botão primário — ação principal, use com parcimônia
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.offwhite}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.red}"
  button-primary-active:
    backgroundColor: "{colors.crimson}"
  button-primary-disabled:
    backgroundColor: "{colors.crimson}"

  # Botão ghost — ação secundária
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.offwhite}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
  button-ghost-hover:
    backgroundColor: "transparent"

  # Badge — status e categorização
  badge-crimson:
    backgroundColor: "rgba(139, 26, 26, 0.15)"
    textColor: "{colors.crimson-text}"
  badge-alert:
    backgroundColor: "rgba(139, 74, 26, 0.15)"
    textColor: "#E07840"
  badge-positive:
    backgroundColor: "rgba(26, 92, 46, 0.15)"
    textColor: "#3AAA62"
  badge-neutral:
    backgroundColor: "rgba(90, 90, 90, 0.15)"
    textColor: "{colors.text-secondary}"

  # Input field — entrada de dados
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.offwhite}"
    typography: "{typography.body}"
  input-focus:
    backgroundColor: "{colors.surface}"
  input-error:
    backgroundColor: "{colors.surface}"
  input-disabled:
    backgroundColor: "{colors.surface}"

  # Sidebar — navegação fixa desktop (240px)
  sidebar:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.offwhite}"
    width: "240px"
  sidebar-item-active:
    backgroundColor: "rgba(139, 26, 26, 0.10)"
    textColor: "{colors.crimson-text}"

  # KPI Card — variantes: Simple, Spark, Ring, Metric (seção 33)
  kpi-card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.none}"
    padding: "24px"
    label: "{typography.micro}"
    value: "{typography.display-md}"
    delta-positive: "{colors.positive-md}"
    delta-negative: "{colors.negative-md}"
    numeric-rendering:
      font-variant-numeric: "tabular-nums"
      font-feature-settings: '"lnum", "tnum"'
      note: >
        Cormorant Garamond usa old-style numerals por padrão — dígitos 3,4,5,7,9
        ficam abaixo da baseline. lnum força lining numerals (todos na mesma
        altura). tnum garante largura fixa por dígito (mesmo efeito de tabular-nums,
        mas via OpenType). Ambos são obrigatórios em todo elemento numérico.
    layout-stability:
      display: "inline-block"
      min-width: "140px (display-md) | 100px (display-xs) | 60px (percentuais)"
      text-align: "right"
      note: >
        min-width fixo previne layout shift quando o número muda de comprimento
        (ex: "R$ 89.636" → "R$ 102.000"). text-align right alinha os dígitos
        pelo lado das unidades — o olho ancora à direita em dados numéricos.

  # Chart — regras universais para bar, line, donut, area (seção 32)
  chart:
    background: "{colors.surface}"
    axis-color: "{colors.subtle}"
    axis-typography: "{typography.micro}"
    grid-line: "1px rgba(255,255,255,0.04) horizontal"
    primary-series: "{colors.crimson}"
    secondary-series: "{colors.slate}"
    border-radius: "{rounded.none}"
    max-series: 3
    value-typography: "{typography.body}"
---

# Orison Brand System

> **Documento normativo de design.** Todos os ativos visuais da Orison nascem
> aqui. Designers e agentes de IA devem consultar este arquivo como fonte única
> de verdade para cor, tipografia, espaçamento, forma, voz e componentes.

---

## Overview

A Orison é uma empresa de infraestrutura de inteligência artificial para
negócios. Seu posicionamento não é o de uma ferramenta, mas de um organismo —
algo que age, aprende e transforma as operações de quem o adota.

**Personalidade visual:** Calculada. Precisa. Sóbria. Inevitável.

A identidade visual da Orison é construída sobre **escuridão intencional**:
fundos quase pretos, tipografia editorial em contraste máximo e um único acento
cromático — o crimson — usado com disciplina cirúrgica. Não há ornamentos
desnecessários. Cada elemento serve a uma função.

**Público-alvo:** Executivos, heads de operações e decisores técnicos em
empresas B2B de médio a grande porte. A identidade deve transmitir
confiabilidade institucional sem abrir mão de uma presença visual que cause
impacto.

**Resposta emocional esperada:** Ao ver um material da Orison, o observador
deve sentir que está diante de algo rigoroso, inevitável e de alta performance.
Nunca jovial, nunca genérico, nunca ansioso.

**Princípio unificador:** *Menos elementos, mais peso.* A identidade ganha
força pela subtração — pelo que se escolhe não mostrar.

---

## Colors

A paleta é construída sobre neutros de alto contraste (dark-first) e um único
acento evocativo. O crimson não é uma cor decorativa: é uma declaração de
intenção.

**Superfícies (do mais escuro ao mais claro):**
- **Black (#0a0a0a):** Fundo absoluto. Usado em cartões de visita frente, slide
  covers e ambientes de máximo contraste.
- **Midnight (#111113):** Superfície primária da interface. Base de todos os
  painéis e seções do brand book.
- **Surface (#0d0d0f):** Superfície secundária para elevação sutil — cards,
  tabelas, células de estado e blocos de detalhe.
- **Slate (#3a3a3a):** Bordas estruturais, divisores e separadores no tema
  escuro.
- **Off-White (#e8e6e1):** Quente, nunca puro branco. Texto principal,
  wordmarks em fundo escuro e face clara do cartão.

**Acento:**
- **Crimson (#8B1A1A):** A única cor de ação. Usada em destaques, bordas de
  acento, botões primários, indicadores de navegação ativa e pontos de
  interação críticos. Use com parcimônia — uma vez por tela quando possível.
- **Red (#A52020):** Estado hover do crimson. Nunca usado como cor standalone.
- **Crimson-Text (#F06070):** Variante legível do crimson para texto sobre
  fundo escuro (contraste ≥ 5.5:1). Usado em labels, badges e links.

**Texto — escala concreta (sem empilhamento de `opacity`):**
- **Text-Primary (#f7f5f0):** Títulos, wordmarks, headings de seção.
- **Text-Body (#edeae4):** Parágrafos, descrições e conteúdo de leitura.
- **Text-Secondary (#d4d2cd):** Labels, especificações, metadados.
- **Text-Muted (#bcbab5):** Texto de suporte, placeholders, itens inativos.

**Visualização de dados:**
- **Negative (hi/md):** Vermelho escuro para KPIs negativos e alertas críticos.
- **Alert (hi/md):** Âmbar escuro para avisos e dados atenção.
- **Positive (hi/md):** Verde escuro para resultados positivos e confirmações.

**Regras de uso de cor:**
- Nunca use o crimson como cor de fundo de superfície ampla.
- Nunca use mais de dois acentos cromáticos em um único layout.
- Mantenha contraste WCAG AA mínimo (4.5:1) para texto; AA+ (5.5:1) é o
  alvo para texto corporal.
- As cores de texto usam valores hexadecimais concretos — nunca aplique
  `opacity` sobre uma cor de texto para criar variações; use a cor correta da
  escala.
- Em fundo claro (off-white), use `midnight` para texto e `crimson` para
  acento mantendo os mesmos papéis semânticos.

---

## Data Visualization Colors

Escalas de cor para uso exclusivo em visualização de dados — charts, KPIs,
heatmaps e command centers. Estas cores não substituem a paleta de identidade:
são extensões quantitativas dela, projetadas para comunicar magnitude, direção
e categoria em contextos de dado. Ver seção 31 da página de preview.

**Escala Sequencial — Crimson (8 steps):**
Progressão de `#1A0505` (mínimo quase-preto) a `#D94040` (crimson claro).
Usada em heatmaps, mapas de densidade e qualquer visualização onde a
intensidade de um único fenômeno precisa ser codificada por cor. A escala
ainda preserva o crimson como acento da identidade — o ponto mais escuro
é negro-crimson, não cinza.

| Token | Valor | Intensidade |
|---|---|---|
| `crimson-scale-1` | `#1A0505` | 0% — fundo quase-preto |
| `crimson-scale-2` | `#2D0A0A` | 14% |
| `crimson-scale-3` | `#4A1010` | 28% |
| `crimson-scale-4` | `#6B1515` | 43% |
| `crimson-scale-5` | `#8B1A1A` | 57% — crimson identidade |
| `crimson-scale-6` | `#A52020` | 71% |
| `crimson-scale-7` | `#C03030` | 85% |
| `crimson-scale-8` | `#D94040` | 100% — máximo |

**Escala Sequencial — Neutral (8 steps):**
Progressão de `#111113` (midnight) a `#6A6A6C` (cinza médio). Usada para
backgrounds de intensidade sem conotação semântica — quando a escala crimson
carregaria implicação de alerta indesejada.

| Token | Valor | Uso |
|---|---|---|
| `neutral-scale-1` | `#111113` | Base — midnight |
| `neutral-scale-5` | `#3A3A3C` | Médio — slate |
| `neutral-scale-8` | `#6A6A6C` | Máximo — cinza |

**Escala Divergente (5 steps):**
Espectro de negativo a positivo, com neutro explícito no centro. Usada em
comparações de performance, variações percentuais e qualquer dado com direção
bipolar. O neutro `#3A3A3C` é exatamente o `slate` da identidade — os extremos
são semânticos (crimson/verde), o centro é neutro.

| Token | Valor | Semântica |
|---|---|---|
| `divergent-neg-hi` | `#8B1A1A` | Negativo alto |
| `divergent-neg` | `#6B1515` | Negativo |
| `divergent-neutral` | `#3A3A3C` | Neutro |
| `divergent-pos` | `#1A5C2E` | Positivo |
| `divergent-pos-hi` | `#27834A` | Positivo alto |

**Escala Categórica (6 cores — máximo absoluto):**
Seis cores discrimináveis para séries independentes em um mesmo chart.
Crimson é sempre a série primária. Nunca use mais de 6 categorias em um
único chart — acima disso, agrupe as menores em "Outros" usando `neutral-scale-5`.

| Token | Valor | Uso |
|---|---|---|
| `cat-crimson` | `#8B1A1A` | Série primária — sempre |
| `cat-amber` | `#8B4A1A` | Série 2 |
| `cat-teal` | `#1A6B6B` | Série 3 |
| `cat-steel` | `#4A6A8B` | Série 4 |
| `cat-olive` | `#4A6B1A` | Série 5 |
| `cat-plum` | `#6B1A6B` | Série 6 (máximo) |

**Regras de data visualization:**
- Nunca misture escalas sequencial e categórica no mesmo chart.
- A escala divergente exige que o dado tenha um zero semântico real — não use
  para dados sempre positivos.
- Crimson categórico e crimson de identidade são o mesmo valor — não conflitam.
- Em contextos de alto contraste ou acessibilidade, complemente cor com forma
  (padrão de linha, ícone de status) — cor sozinha não é suficiente.

---

## Typography

A estratégia tipográfica emprega dois pesos e duas famílias complementares:
**Cormorant Garamond** para a camada editorial e de identidade, e **Montserrat**
para a camada técnica e funcional.

**Display — Cormorant Garamond (Light, 300):**
A família display é reservada para títulos, wordmarks e peças de alto impacto.
Seu espírito serifa editorial cria o contraste de luxo necessário contra fundos
escuros. O espaçamento de letras (letter-spacing) é sempre positivo e
generoso — de 4px (`display-xs`) a 18px (`display-hero`) — criando presença
arejada e autoridade.

- **Display Hero (56px / 18px spacing):** Títulos de capa e cabeçalhos de
  seção de alto impacto.
- **Display XL (52px / 8px spacing):** Headings principais de seção.
- **Display LG (36px / 6px spacing):** Títulos de subsessão e peças editoriais.
- **Display MD (28px / 6px spacing):** Headings secundários em layouts de duas
  colunas.
- **Display SM (20px / 16px spacing, uppercase):** Wordmarks horizontais e
  subtítulos com maiúsculas.
- **Display XS (18px / 4px spacing):** Citações curtas e nomenclatura de
  aplicações.

**Body & Label — Montserrat:**
O Montserrat é a voz técnica da Orison. Sua geometria limpa evoca precisão de
instrumento. Todos os tamanhos são pequenos por design — a densidade
informacional é uma característica da identidade, não uma limitação.

- **Body (11px / Light / Line-height 1.9):** Parágrafos, descrições de
  especificação e copy de interface. O line-height generoso (1.9) garante
  legibilidade a tamanhos pequenos.
- **Label (9px / Regular / 5px tracking, uppercase):** Rótulos de componentes,
  cabeçalhos de tabela, identificadores de token e botões. Sempre maiúsculas.
- **Micro (8px / Regular / 4px tracking, uppercase):** Badges, versões,
  numeração de seção e metadados de menor hierarquia.

**Regras tipográficas:**
- Nunca use mais de dois pesos em uma mesma peça (ex.: Light + Regular).
- Nunca use itálico no Cormorant para UI — reservado para citações literárias
  pontuais.
- Texto de interface nunca excede `body` (11px) em tamanho de corpo.
- Wordmarks usam sempre `display-sm` (vertical) ou `display-xs` (horizontal)
  com uppercase.
- Nunca use fontes fora do sistema sem aprovação — não substitua Cormorant por
  Georgia nem Montserrat por Arial.

---

## Layout

O layout da Orison segue o modelo **Fixed-Max-Width** com largura máxima de
`1080px`, centrado na viewport. O sidebar de navegação (240px) fica fixo à
esquerda em desktop, deslocando o conteúdo principal.

A base do espaçamento é **8px**. Todos os valores da escala são múltiplos
exatos de 8 (com a exceção do meio-passo de 4px para micro-ajustes).

**Escala de espaçamento:**

| Token     | Valor | Nome    | Uso típico                                 |
|-----------|-------|---------|--------------------------------------------|
| `space-1` | 4px   | XS      | Gaps internos mínimos, icon-text gaps      |
| `space-2` | 8px   | S       | Gaps entre rótulos e valores               |
| `space-3` | 16px  | M       | Padding interno de cells e tags            |
| `space-4` | 24px  | ML      | Gutters de grid, gap padrão entre cards    |
| `space-5` | 32px  | L       | Padding de painéis menores, seções         |
| `space-6` | 48px  | XL      | Gaps verticais entre blocos de conteúdo    |
| `space-7` | 64px  | 2XL     | Separação de seções maiores                |
| `space-8` | 80px  | 3XL     | Padding externo das seções principais      |

**Grid interno:**
- Seções usam grid de 2 colunas (`1fr 1fr`) com gap de `2px` — a ausência de
  espaço entre painéis é intencional, criando superfícies contíguas em bloco.
- Grids específicos (swatches, espaçamento, estados) usam 4–8 colunas conforme
  a densidade necessária.

**Padding de seção:** `80px 60px` (vertical/horizontal).

**Breakpoints responsivos:**
- `≤ 1120px`: ajuste de column-gap em grids maiores.
- `≤ 900px`: grids colapsam para 1 coluna; sidebar vira drawer com overlay.
- `≤ 600px`: padding reduzido; layouts horizontais empilham verticalmente.

---

## Elevation & Depth

A Orison não usa sombras decorativas. Profundidade é comunicada por
**contraste tonal entre superfícies**, não por `box-shadow` com blur difuso.

**Hierarquia de superfícies (mais escuro = mais fundo):**
1. `black` (#0a0a0a) — fundo absoluto, impressão
2. `midnight` (#111113) — camada primária da interface
3. `surface` (#0d0d0f) — camada elevada (cards, células)

Sombras são usadas apenas em contextos de **modal/overlay** ou **elevação
funcional** onde o contraste tonal sozinho não é suficiente:

- **Shadow SM:** `0 8px 16px rgba(0,0,0,0.6)` — cards flutuantes leves
- **Shadow MD:** `0 16px 32px rgba(0,0,0,0.5)` — dropdowns, tooltips
- **Shadow LG:** `0 24px 48px rgba(0,0,0,0.7)` — modais, painéis sobrepostos
- **Shadow Inner:** `inset 0 1px 0 rgba(232,230,225,0.04)` — highlight sutil
  de borda superior em superfícies elevadas

**Bordas como substitutas de sombra:**
Em vez de sombras complexas, a borda `1px solid var(--border-color)` delimita
cards e painéis. A borda forte (`border-color-strong`) é usada para estados
hover e foco.

---

## Glass Material System

Introduzido no Command Center v1.0. Define o sistema de superfícies translúcidas para dashboards imersivos onde múltiplas camadas de informação coexistem sobre um fundo atmosférico.

### Tokens glass

Adicionados ao `src/tokens/colors.css`:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-glass-surface` | `rgba(13,13,15,0.72)` | Painéis laterais e bottom bar |
| `--color-glass-header` | `rgba(17,17,19,0.88)` | Header bar (mais opaco, mais alto na hierarquia visual) |
| `--color-glass-detail` | `rgba(13,13,15,0.92)` | DetailPanel flutuante (quase opaco — leitura de dados) |
| `--color-glass-border` | `rgba(255,255,255,0.04)` | Divisores internos entre cards e slots |
| `--color-glass-shadow` | `rgba(139,26,26,0.12)` | Sombra com toque crimson para painéis flutuantes |

### Material unificado

Header, painéis laterais e bottom bar compartilham o mesmo "vidro escurecido":

```css
background: var(--color-glass-surface);   /* ou glass-header */
backdrop-filter: blur(10px);              /* 12px no header */
-webkit-backdrop-filter: blur(10px);
```

Não usar `border` para delimitar painéis. Usar fades de gradiente nos limites com o hero:

```css
/* Exemplo: fade lateral do painel esquerdo */
.left::after {
  content: '';
  position: absolute;
  top: 0; right: -64px; width: 64px; height: 100%;
  background: linear-gradient(to right, var(--color-glass-surface), transparent);
  pointer-events: none;
}
```

### Cards sem bordas

KPI cards e blocos de informação dentro dos painéis não têm `border` individual. Separação por:

1. Linha sutil `border-bottom: 1px solid var(--color-glass-border)` — apenas entre itens
2. Espaçamento generoso (`padding: var(--space-3) var(--space-2)`)
3. Hover discreto: `background: rgba(255,255,255,0.02)`

```css
.card {
  background: transparent;
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--color-glass-border);
}
.card:last-child { border-bottom: none; }
.card:hover { background: rgba(255, 255, 255, 0.02); }
```

### DetailPanel glass-morphism

Painéis flutuantes de detalhe (hover sobre entidades 3D) usam `glass-detail`:

```css
background: var(--color-glass-detail);
border: 1px solid rgba(139, 26, 26, 0.15);
box-shadow:
  0 8px 32px rgba(0,0,0,0.6),
  0 0 0 1px rgba(255,255,255,0.03),
  inset 0 1px 0 rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
```

Sem aspecto de modal: sem overlay, sem `border` dura, sombra serve como delimitador visual.

### Regras

- Nunca use `border` como separador de painel — use fade de gradiente ou ausência de borda.
- Nunca use `background` sólido em painéis que sobrepoêm o hero 3D — mantém a sensação de profundidade.
- `backdrop-filter: blur()` requer que o pai não tenha `overflow: hidden` ou `will-change: transform`.
- Em contextos sem suporte a `backdrop-filter`: `glass-surface` continua funcional por ter opacidade suficiente (0.72).

---

## Shapes

A linguagem de formas da Orison é definida por **austeridade geométrica**.
Não há bordas arredondadas expressivas. Os poucos raios permitidos existem
apenas para suavizar arestas tecnicamente — nunca como elemento de identidade.

| Token        | Valor  | Uso                                                  |
|--------------|--------|------------------------------------------------------|
| `rounded-none` | 0px  | Padrão: botões, inputs, cards, painéis, tabelas      |
| `rounded-sm`   | 2px  | Badges, tags e elementos muito pequenos              |
| `rounded-md`   | 4px  | Exceção funcional quando zero causa artefato visual  |
| `rounded-lg`   | 8px  | Nunca usado em componentes de UI padrão              |
| `rounded-full` | 9999px | Avatares circulares, indicadores de status ponto  |

**Regra:** Não misture cantos arredondados e cantos retos no mesmo layout.
Se um elemento do grupo usa `rounded-none`, todos os outros do mesmo nível
hierárquico devem usar `rounded-none`.

---

## Components

### Botões

Dois variantes: **Primary** e **Ghost**. Nenhum variante adicional deve ser
criado sem aprovação.

**Primary (`.btn-orison`):**
Ação principal. Fundo crimson, texto off-white, sem borda. Tipografia Label
(9px, uppercase, 5px tracking). Sem raio de borda.

| Estado    | Background      | Transform       |
|-----------|-----------------|-----------------|
| Default   | `crimson`       | —               |
| Hover     | `red`           | `translateY(-1px)` |
| Active    | `crimson`       | `translateY(0)` |
| Focus     | `crimson`       | 2px red outline, 3px offset |
| Disabled  | `crimson`       | `opacity: 0.35` |

**Ghost (`.btn-orison-ghost`):**
Ação secundária. Fundo transparente, borda `1px solid gray`, texto off-white.
Mesma tipografia do primary.

| Estado    | Background    | Borda         | Transform          |
|-----------|---------------|---------------|--------------------|
| Default   | transparente  | `gray`        | —                  |
| Hover     | transparente  | `offwhite`    | `translateY(-1px)` |
| Focus     | transparente  | `offwhite`    | 2px offwhite outline |
| Disabled  | transparente  | `gray`        | `opacity: 0.30`    |

**Regras de botões:**
- Um único botão Primary por tela ou por grupo de ação.
- Não use botão Primary para ações destrutivas — use Ghost com texto vermelho.
- Nunca crie variante colorida além de crimson/ghost.

---

### Badges

Quatro variantes semânticas. Todos usam tipografia Micro (8px, uppercase,
3px tracking), padding `4px 10px`, `rounded-sm`.

| Variante   | Contexto                        | Background                        | Cor do texto       |
|------------|---------------------------------|-----------------------------------|--------------------|
| `crimson`  | Destaque, "novo", status ativo  | `rgba(139,26,26,0.15)`            | `crimson-text`     |
| `alert`    | Atenção, aviso moderado         | `rgba(139,74,26,0.15)`            | `#E07840`          |
| `positive` | Sucesso, confirmação            | `rgba(26,92,46,0.15)`             | `#3AAA62`          |
| `neutral`  | Informativo, inativo            | `rgba(90,90,90,0.15)`             | `text-secondary`   |

---

### Input Fields

Tipografia Body (11px). Fundo `surface`. Borda `1px solid border-color`.
Largura máxima `320px`. Sem raio.

Label acima do input: Micro (8px, uppercase, 4px tracking).
Hint abaixo: Micro (8px, 2px tracking, `text-muted`).

| Estado    | Borda                | Notas                            |
|-----------|----------------------|----------------------------------|
| Default   | `border-color`       | —                                |
| Hover     | `gray`               | —                                |
| Focus     | `crimson`            | Sem outline externo adicional    |
| Error     | `red`                | Hint usa `crimson-text`          |
| Disabled  | `border-color`       | `opacity: 0.30`                  |

---

### KPI Cards

Quatro variantes (Simple, Spark, Ring, Metric). Tipografia `display-md` (28px, Cormorant Garamond, weight 300) para o valor principal. Label em Micro (uppercase). Sem borda arredondada.

**Renderização numérica obrigatória em todo elemento que exibe número:**

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "lnum", "tnum";
```

- `lnum` — lining numerals: força todos os dígitos à mesma altura de baseline. Sem `lnum`, o Cormorant Garamond usa old-style numerals por padrão — dígitos 3, 4, 5, 7 e 9 ficam abaixo da baseline, criando inconsistência visual.
- `tnum` — tabular numerals: garante largura fixa por dígito via OpenType, reforçando o efeito de `tabular-nums`.

Ambas as propriedades são obrigatórias. Omitir qualquer uma produz numerais desalinhados verticalmente ou com largura variável.

**Estabilidade de layout em atualizações ao vivo:**

```css
display: inline-block;
min-width: 140px;   /* display-md: cobre "R$ 102.000" */
text-align: right;
```

`min-width` fixo previne layout shift quando o comprimento do número muda (ex.: `"R$ 89.636"` → `"R$ 102.000"`). `text-align: right` ancora os dígitos pelo lado das unidades — o olho lê números da direita para a esquerda. Sem `min-width`, o container encolhe com o número e empurra elementos adjacentes.

Valores por contexto: `140px` para `display-md`, `100px` para `display-xs` (Header), `60px` para percentuais (KpiRing).

---

### Data Table

Cabeçalho: Label (8px, 4px tracking, uppercase), borda inferior `subtle`.
Células: Body (11px, 1px tracking), padding `14px 16px`, borda inferior thin.
Hover em linha: `rgba(255,255,255,0.02)`.

Variantes de célula:
- `.td-metric` — monospace, métricas numéricas
- `.td-positive` — cor `positive-md`
- `.td-negative` — cor `negative-md`
- `.td-muted` — cor `text-muted`

---

### Motion

A Orison usa um sistema de 4 tokens de transição. A easing padrão é linear
suave; ações de alto impacto usam o spring `cubic-bezier(0.16, 1, 0.3, 1)`.

| Token              | Duração | Easing                              | Uso                                    |
|--------------------|---------|-------------------------------------|----------------------------------------|
| `transition-instant` | 0.1s  | `ease`                              | Feedback imediato (toggle, check)      |
| `transition-fast`    | 0.2s  | `ease`                              | Hover states, cores, opacity           |
| `transition-base`    | 0.3s  | `ease`                              | Transições padrão de estado            |
| `transition-slow`    | 0.6s  | `cubic-bezier(0.16, 1, 0.3, 1)`    | Entrada de painéis, modais, reveals    |

Animações de scroll-reveal usam `transition-slow` com `translateY(24px) → 0`
e stagger de `80ms` entre elementos adjacentes.

**Regras de motion:**
- Nunca use `transition: all` — especifique apenas as propriedades afetadas.
- Respeite `prefers-reduced-motion`: desative translateY reveals e reduza
  durações a `0.01s`.
- Não use bounces exagerados nem loops de animação em UI de dados.

---

## Do's and Don'ts

**Símbolo e Logotipo:**
- ✓ Mantenha a área de proteção = altura do símbolo ÷ 4 em todos os lados.
- ✓ Use sempre o arquivo SVG original — nunca recrie o símbolo manualmente.
- ✗ Não altere a cor do símbolo fora do par aprovado (off-white sobre escuro /
  midnight sobre claro).
- ✗ Não rotacione, distorça, aplique sombra ou efeito sobre o símbolo.
- ✗ Não use o símbolo abaixo de 16px sem remover o círculo interno.

**Cor:**
- ✓ Use crimson uma vez por tela, na ação mais importante.
- ✓ Mantenha contraste WCAG AA mínimo (4.5:1) — AA+ (5.5:1) para corpo.
- ✗ Não use crimson como cor de fundo de superfície ampla.
- ✗ Não crie novas cores fora da paleta sem aprovação.
- ✗ Não aplique `opacity` sobre texto para criar variações de cor — use a cor
  correta da escala.

**Tipografia:**
- ✓ Use Cormorant para editorial e identidade; Montserrat para interface e
  dados técnicos.
- ✓ Letras maiúsculas apenas em labels e micro — nunca em parágrafos.
- ✗ Não use mais de dois pesos tipográficos em uma peça.
- ✗ Não substitua as famílias por fontes do sistema.
- ✗ Não use tamanhos fora da escala definida.

**Layout:**
- ✓ Use espaçamentos sempre em múltiplos de 8px (ou 4px para micro-ajuste).
- ✓ Respeite a largura máxima de 1080px para todo conteúdo principal.
- ✗ Não quebre o ritmo de 8px com valores arbitrários (ex.: 15px, 22px).
- ✗ Não misture cantos arredondados e cantos retos no mesmo grupo de elementos.

**Voz:**
- ✓ Escreva com precisão cirúrgica — frases curtas, sem ambiguidade.
- ✓ Prefira substantivos de resultado: *precisão*, *transformação*, *resultado*.
- ✗ Não use *inovação*, *disruptivo*, *ecossistema*, *solução*, *plataforma*,
  *sinérgico*, *holístico*, *alavancar*.
- ✗ Não personifique a Orison como assistente ou "ajudante" — a Orison opera,
  não serve.

---

## Voice & Tone

A Orison comunica como um organismo que age — não como um produto que aguarda
instruções. A voz reflete a premissa central: **transformação operacional por
meio de inteligência estrutural**.

**A Orison É:**
- **Calculada** — cada palavra e cada pixel carregam intenção.
- **Precisa** — sem ambiguidade, sem eufemismo, sem rodeios.
- **Sóbria** — nunca excessivamente entusiasmada ou emocional.
- **Inevitável** — comunica como se o resultado já estivesse decidido.
- **Direta** — vai ao ponto sem jargão de marketing.

**A Orison Nunca É:**
- Animada ou jovial (sem exclamações, sem emoji em contextos formais).
- Humilde em excesso (sem "tentamos", "esperamos que", "acreditamos que").
- Técnica demais (sem acrônimos não explicados, sem jargão de engenharia em
  copy de negócio).
- Genérica (sem clichês de tecnologia ou de consultoria).
- Reativa (nunca responde a críticas com defesa — age com demonstração).

**Vocabulário aprovado:**
Precisão · Resultado · Transformação · Organismo · Estrutura · Inteligência ·
Operação · Velocidade · Clareza · Decisão · Processo · Escala

**Vocabulário proibido:**
Inovação · Disruptivo · Ecossistema · Solução · Plataforma · Sinérgico ·
Holístico · Alavancar · Empoderar · Jornada · User-centric · Best-in-class

**Exemplo correto:**
> "A Orison mapeia cada processo da sua operação e elimina o atrito antes que
> ele vire custo."

**Exemplo incorreto:**
> "Acreditamos que nossa plataforma inovadora pode ajudar sua empresa a
> alavancar resultados de forma holística."

---

## Applications

Os templates de aplicação são a expressão da identidade em contextos reais.
Todos os templates seguem os mesmos tokens e não podem ser alterados
estruturalmente sem revisão do sistema.

**Cartão de Visita (85mm × 55mm):**
- Frente: fundo black, símbolo no topo esquerdo + divisor vertical slate +
  wordmark horizontal (Cormorant 26px, loose tracking) + subtítulo crimson.
  Verso: fundo off-white, mesmo lockup em midnight, nome e cargo à direita.
- Nome: Display SM, off-white (frente) / midnight (verso).
- Cargo: Label, `text-secondary`.
- Contato: Micro, `text-muted`.

**Assinatura de E-mail:**
- Estrutura: símbolo 36px + barra crimson esquerda + bloco de texto.
- Nome: Cormorant 17px Regular, crimson-text.
- Cargo: Label uppercase, `text-secondary`.
- Divisor: 1px slate.
- Contato: Micro, `text-muted`, stack vertical.

**Slide Cover (16:9):**
- Fundo: black.
- Barra crimson: 3px, borda esquerda, altura total.
- Conteúdo: eyebrow (Label, crimson-text) + título (Display LG, offwhite) +
  subtítulo (Body, `text-secondary`).
- Logotipo: canto inferior direito, lockup horizontal pequeno.
- Decoração: símbolo em background opacity-decoration (5%).

**Capa de Proposta (A4 vertical):**
- Fundo: midnight.
- Topo: lockup vertical.
- Meio: divisor crimson (32px largura, 1px) + título da proposta (Display MD).
- Base: nome do cliente (Display XS) + data (Label, `text-muted`).
- Decoração: símbolo em background opacity-decoration.

**Banner LinkedIn (1584 × 396px):**
- Fundo: black.
- Esquerda: lockup horizontal (símbolo + divisor + wordmark).
- Centro-direita: tagline (Label uppercase, `text-secondary`).
- Decoração: símbolo à direita em opacity-decoration.
