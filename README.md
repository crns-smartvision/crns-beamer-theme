# CRNS Beamer theme

A Beamer theme for presentations at the Digital Research Centre of Sfax
(CRNS), based on the [Metropolis](https://github.com/matze/mtheme) theme.
`template.tex` is a ready-to-use deck that shows every element of the theme:
title page, sections, frame titles and subtitles, lists, animations,
figures, tables, blocks and mathematics.

## Features

- 16:9 slides with a clean title page, section pages and an optional sidebar
- Color profiles selected with one option (`palette=rose` or `palette=darkred`)
- Filled or transparent frame headers, frame subtitles with an arrow marker
- Transparent or filled `block`, `alertblock` and `exampleblock`
- Kurier for text, Latin Modern for mathematics
- A matching PowerPoint template (see [PowerPoint version](#powerpoint-version))

## Requirements

- A TeX distribution with `pdflatex` (TeX Live 2023 or later is tested)
- The LaTeX packages used by the theme and the template: `beamer`,
  `pgfopts`, `tikz`, `adjustbox`, `kurier`, `lmodern`, `babel`
  (with French), `amsmath`, `amssymb`, `booktabs`

With a full TeX Live installation everything is already there. On
Debian/Ubuntu, a minimal set is:

```bash
sudo apt install texlive-latex-recommended texlive-latex-extra \
                 texlive-pictures texlive-fonts-extra texlive-lang-french lmodern
```

With TeX Live's own package manager:

```bash
tlmgr install beamer pgfopts pgf adjustbox kurier lm babel-french booktabs amsfonts
```

### Installing the Kurier font

The template typesets text in **Kurier**. Two different things can be
missing:

1. **The LaTeX package** (used by `pdflatex` through `\usepackage{kurier}`).
   If the build stops with `File 'kurier.sty' not found`, install it with
   `sudo apt install texlive-fonts-extra` or `tlmgr install kurier`.

2. **The system font** (used by other applications, for example Inkscape
   to edit slide graphics, or by XeLaTeX/LuaLaTeX through `fontspec`).
   If `fc-list | grep -i kurier` prints nothing, install it from
   [crns-smartvision/fonts-kurier](https://github.com/crns-smartvision/fonts-kurier):

   ```bash
   git clone https://github.com/crns-smartvision/fonts-kurier.git
   cd fonts-kurier
   mkdir -p ~/.local/share/fonts
   cp -r kurier ~/.local/share/fonts/
   fc-cache -f
   fc-list | grep -i kurier    # should list the four Kurier styles
   ```

   This installs the font for the current user. For all users, copy the
   `kurier` folder to `/usr/share/fonts/` instead (requires `sudo`).

## Quick start

```bash
git clone https://github.com/crns-smartvision/crns-beamer-theme.git 
cd crns-beamer-theme
./build.sh main      # writes build/main.pdf
```

To start a new presentation, copy the five `beamer*themecrns.sty` files and
`main.tex` into your project, rename `main.tex`, and replace the
title page fields and the slides.

### Background images

The theme draws the CRNS backgrounds from:

| File | Used on |
|---|---|
| `graphics/main_background_v2.pdf` | every slide |
| `graphics/titlepage_background_v3.pdf` | the title page with `titlebackground=crns` |
| `graphics/titlepage_background_v3_smarts.pdf` | the title page with `titlebackground=smarts` |

These images are part of the CRNS visual identity and are **not
distributed** in this repository. Add them to a `graphics/` folder next to
your `.tex` file. Without them, the build reports `File ... not found` errors
and the PDF shows a placeholder box with the file name instead of each image.

## Usage

```latex
\documentclass[8pt, aspectratio=169]{beamer}
\usetheme[
  palette=darkred,       % color profile: rose | darkred
  header=transparent,    % frame title: filled | transparent
  sidebar=left,
  numbering=shifted,
]{crns}
```

A frame subtitle is given as the second argument of the frame:

```latex
\begin{frame}{Slide's title}{Slide's subtitle}
  ...
\end{frame}
```

Options can also be changed inside the document with `\crnsset{...}`, for
example `\crnsset{block=fill}`.

### Options

| Option | Values (default first) | Effect |
|---|---|---|
| `palette` | `rose`, `darkred` | Color profile (see below) |
| `header` | `filled`, `transparent` | Frame title on a colored band, or colored text |
| `background` | `light`, `dark` | Text and page colors (`dark` is hidden by an opaque background image) |
| `titlebackground` | `crns`, `smarts` | Background image of the title page |
| `block` | `transparent`, `fill` | Block environments with or without a background |
| `numbering` | `counter`, `none`, `fraction`, `shifted` | Frame number format |
| `progressbar` | `none`, `head`, `frametitle`, `foot` | Position of the progress bar |
| `sidebar` | `none`, `left` | Left sidebar |
| `sectionpage` | `progressbar`, `none`, `simple` | Slide shown at each `\section` |
| `subsectionpage` | `none`, `simple`, `progressbar`, `progressbarextended` | Slide shown at each `\subsection` |
| `titleformat title`, `titleformat subtitle`, `titleformat section`, `titleformat frame` | `regular`, `smallcaps`, `allsmallcaps`, `allcaps` | Letter case of titles |

### Color profiles

| Name | `rose` | `darkred` |
|---|---|---|
| `crnsprimary`: frame titles, numbers, progress bars | `#bb8484` | `#ae2626` |
| `crnstext`: normal text | `#23373b` | `#23373b` |
| `crnsalert`: `\alert`, alert blocks | `#ca242c` | `#ae2626` |
| `crnsblock`: default block titles | `#23373b` | `#23373b` |
| `crnsexample`: example block titles | `#14b03d` | `#1f6f6b` |

These color names can be used in your slides, for example
`\textcolor{crnsprimary}{...}`. To add a profile, define
`\crns@palette@<name>` in `beamercolorthemecrns.sty`, setting every color
listed above, and register `<name>` in the `palette` choice.

## PowerPoint version

`pptx/crns_template.pptx` is a PowerPoint template that matches the Beamer
theme with `palette=darkred` and `header=transparent`. It contains the same
17 showcase slides as `main.tex` (title page, sections, lists,
mathematics, figures, tables, blocks), so you can copy elements from it
instead of building them from scratch.

`pptx/smarts_template.pptx` is a derivative one corresponding to `titlebackground=smarts`
option for Smarts Lab presentation.

### Before you start: install Kurier

The template uses the **Kurier** font for all text. Install the system font
as described in [Installing the Kurier font](#installing-the-kurier-font)
(on Windows or macOS, open each `.ttf` file of the `kurier` folder and click
*Install*). Without it, PowerPoint replaces Kurier with another font and the
line breaks and spacing change.

If you present on a computer that may not have Kurier, embed it in the file.
In PowerPoint for Windows, choose *File > Options > Save > Embed fonts in
the file*, then *Embed all characters*. In PowerPoint for Mac, choose
*PowerPoint > Preferences > Save > Embed fonts in the file*. Or export to PDF
and present the PDF.

### Starting a new presentation

1. Copy `crns_template.pptx` and rename it.
2. Fill in the title page: title, subtitle, author, position and
   affiliation, email.
3. Delete the showcase slides you don't need. Keep a few until you are
   done, so you can copy their elements (blocks, tables, equations).
4. Add slides with *Home > New Slide* and pick a CRNS layout. To change the
   layout of an existing slide, use *Home > Layout*.

### Slide layouts

| Layout | Beamer equivalent | Use it for |
|---|---|---|
| **CRNS Title** | `\titlepage` | First slide: title, subtitle, author, affiliation, email |
| **CRNS Section** | `\section{...}` | Section page with a progress bar |
| **CRNS Subsection** | `\subsection{...}` | Table of contents with the current section highlighted |
| **CRNS Content** | `\begin{frame}{Title}` | Normal slide: title and one text area |
| **CRNS Content with Subtitle** | `\begin{frame}{Title}{Subtitle}` | Same, with the arrow and the italic subtitle |
| **CRNS Title Only** | `\begin{frame}{Title}` | Title only, for free placement of images, tables, equations |
| **CRNS Standout** | `\begin{frame}[standout]` | Closing slide with a centered message |

Use the placeholders of the layouts rather than new text boxes when you can:
they already have the right font, size, color and position, and the slide
titles then appear in the outline and in the navigation of the PDF export.
To return an element to its layout style, use *Home > Reset*.

### Colors

The theme colors are those of the `darkred` profile, so the first row of
every color menu gives the CRNS colors. Pick colors there rather than
typing hex values: the slides then stay consistent.

| Theme color (PowerPoint) | Beamer name | Hex | Use |
|---|---|---|---|
| Text 1 (Dark 1) | `crnstext` | `#23373B` | Normal text |
| Text 2 (Dark 2) | `crnsprimary` | `#AE2626` | Slide titles, slide numbers |
| Background 2 (Light 2) | `crnspaper` | `#FAFAFA` | Page |
| Accent 1 | `crnsprimary`, `crnsalert` | `#AE2626` | `\alert` text, alert blocks, progress bars |
| Accent 2 | `crnsexample` | `#1F6F6B` | Example blocks |
| Accent 3 | `crnsblock` | `#23373B` | Default blocks |
| Accent 4 | | `#CFD3D4` | Filled block title, dimmed table of contents |
| Accent 5 | | `#E5E6E7` | Filled block body |
| Accent 6 | | `#CDB8B8` | Progress bar track |

### Text elements

- **Emphasis**: italic for `\emph`, bold for `\textbf`, Accent 1 for
  `\alert` (see the *Typography* slide).
- **Small caps**: select the text, open *Home > Font* (the small arrow of
  the Font group, or Ctrl+D / Cmd+T) and check *Small Caps*.
- **Code**: Courier New. Kurier has no monospace style.
- **Lists**: use the bullet and numbering buttons. Press Tab for a sub-item,
  Shift+Tab to go back up. The *Lists* slide has items, enumerations and
  descriptions side by side.

### Equations

The equations of the showcase deck are images rendered by LaTeX, in Latin
Modern like the Beamer theme. Each image has alternative text that reads the
equation. Since they are images, they cannot be edited in PowerPoint. To add
your own equations, choose one of these three methods.

**1. PowerPoint's equation editor (quick, editable).** Choose
*Insert > Equation* (or press Alt+=). Recent versions of PowerPoint
for Microsoft 365 accept LaTeX. Click *Equation > LaTeX*, type the
code, for example `\frac{1}{n^2}`, then choose *Convert > Current - Professional*.
The equation uses Cambria Math, not Latin Modern. Set its size to 17 pt and
its color to Text 1 to match the body text.

**2. IguanaTeX (editable LaTeX, Windows and macOS).** The free
[IguanaTeX](https://www.jonathanleroux.org/software/iguanatex/) add-in
compiles LaTeX code into an image inside PowerPoint and keeps the code, so
you can double-click the image to edit it. It needs a LaTeX installation.
Add `\usepackage{lmodern}` to its preamble to get the template's math font.

**3. Render the images like the template does (same look as Beamer).**
Add your equation to `pptx/equations.tex` as a new `piece`:

```latex
% 9: my equation
\begin{piece}$\displaystyle
  E = mc^2
$\end{piece}
```

Then run `pptx/build.sh` (see [Rebuilding the template](#rebuilding-the-template)).
Each piece becomes `build/pptx/eq-<number>.png`, with a transparent
background and the `crnstext` color. Insert it with *Insert > Pictures* and
set its size: the pieces are typeset at 10 pt and the slide text is 17 pt,
so a piece of width *w* pt (given in `build/pptx/equations.json`) should be
*w* × 0.0235 inches wide (*w* × 0.0597 cm). For example, a piece 100 pt wide
becomes 2.35 in (5.97 cm). Lock the aspect ratio so the height follows. Add
alternative text (*right-click > View Alt Text*) that reads the equation.

Without the repository's build script, you can render a single equation
with any `standalone` document and `pdftocairo -png -transp -r 600 file.pdf`.

### Figures, tables and blocks

- **Figures**: insert images with *Insert > Pictures*. Prefer vector
  formats (SVG, EMF) or PNG at 200 dpi or more. Put the caption in a text
  box below the image, as on the *Figures* slide (*Figure 1:* in bold, 15 pt).
- **Tables**: copy the table of the *Tables* slide and edit it. It mimics
  `booktabs`: a thick rule at the top and bottom, a thin rule under the
  header, no vertical lines. Add rows with *Layout > Insert Below*.
- **Blocks**: copy a block from the *Blocks* slide. A block is two text
  boxes, the title in bold and the content below it. Group them
  (Ctrl+G / Cmd+Option+G) so they move together. Transparent blocks are on
  the left and filled blocks on the right. The title color sets the kind:
  Accent 3 for a default block, Accent 1 for an alert block, Accent 2 for an
  example block.

### Animations

Beamer overlays (`\pause`, `<+->`) become PowerPoint animations. To reveal
a list item by item, select the list, choose *Animations > Appear*, then
*Effect Options > By Paragraph*. The *Animation* slide has this tip in its
speaker notes.

### Sections and progress bars

The deck uses PowerPoint sections (visible in the slide panel and in
*View > Slide Sorter*) to mirror the Beamer sections. Right-click between
two slides and choose *Add Section* to start a new one.

The progress bar of a section slide is a plain shape named **Progress**,
so it does not update by itself. After adding or removing slides, adjust its
width so it shows the fraction of the deck already presented. The track
behind it is 8.18 in (20.78 cm) wide, so on slide *n* of *N* the bar
is 8.18 × *n* / *N* in wide. Select it with *Home > Arrange > Selection Pane*
and change its width in *Shape Format > Size*. To build a new section slide,
duplicate an existing one rather than using *New Slide*, so you keep the bar.

The table of contents on the *CRNS Subsection* layout is also plain text.
Update it when you rename or add sections.

### Differences from the Beamer version

- Only the `darkred` color profile with transparent headers is provided.
  There is no sidebar.
- Equations are images and do not use the body font size automatically.
- Progress bars and the subsection table of contents are updated by hand.
- Slide numbers are plain numbers (Beamer `numbering=counter`).

### Rebuilding the template

`crns_template.pptx` is generated by `pptx/build_pptx.js` with
[PptxGenJS](https://gitbrent.github.io/PptxGenJS/). You only need this to
change the template itself. To use it, just copy the `.pptx`.

Requirements:

- `pdflatex` with `standalone`, `lmodern`, `amsmath`, `amssymb`, `tikz`
- poppler (`pdftoppm`, `pdftocairo`, `pdfinfo`), for example
  `sudo apt install poppler-utils`
- Node.js with PptxGenJS (`npm install pptxgenjs`). If it is installed
  outside `pptx/`, set `NODE_PATH` to that `node_modules` folder.
- The background images in `graphics/` (see
  [Background images](#background-images))
- Optionally, a script that writes the theme colors into the `.pptx`, given
  by the `CRNS_APPLY_THEME` environment variable. It must export
  `applyTheme(file, theme)`. Without it, the deck is still built but its
  theme colors stay at the Office defaults (blue, orange...).

```bash
NODE_PATH=/path/to/node_modules CRNS_APPLY_THEME=/path/to/apply_theme.js pptx/build.sh
```

The script renders the backgrounds at 200 dpi and the equations of
`equations.tex` to `build/pptx/`, then writes `pptx/crns_template.pptx`.
Sizes and positions are measured on the Beamer PDF: the Beamer page is
160 × 90 mm and the PowerPoint page 13.333 × 7.5 in, so lengths scale by
2.117 and the 8 pt Beamer text becomes 17 pt.

## Repository structure

| File | Content |
|---|---|
| `beamerthemecrns.sty` | Entry point, loads the four sub-themes |
| `beamerinnerthemecrns.sty` | Title page, section pages, blocks |
| `beamerouterthemecrns.sty` | Background, frame title, footline, sidebar |
| `beamercolorthemecrns.sty` | Color profiles and beamer colors |
| `beamerfontthemecrns.sty` | Font sizes and title formats |
| `template.tex` | Showcase deck |
| `build.sh` | `pdflatex` build into `build/` |
| `pptx/crns_template.pptx` | PowerPoint version of the theme and showcase deck |
| `pptx/build_pptx.js` | Generator of the PowerPoint template |
| `pptx/equations.tex` | Equations and figure rendered as images for the PowerPoint template |
| `pptx/build.sh` | Builds `pptx/crns_template.pptx` |

## Contributing

Contributions are welcome through issues and pull requests. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and the theme
conventions.

## License and attribution

This work is licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
(see [LICENSE](LICENSE)). If you redistribute the theme or a modified
version of it, keep the license headers and credit this repository:

> Based on the SMARTS CRNS Beamer theme by Achraf Ben-Hamadou,
> <https://github.com/abenhamadou/smarts_crns_beamerclass_template>,
> licensed under CC BY-SA 4.0.

The theme is derived from Metropolis by Matthias Vogelgesang and the LaTeX
community, also under CC BY-SA 4.0. See [NOTICE.md](NOTICE.md) for details.
