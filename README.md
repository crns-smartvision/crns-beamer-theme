# SMARTS CRNS Beamer theme

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
git clone https://github.com/abenhamadou/smarts_crns_beamerclass_template.git
cd smarts_crns_beamerclass_template
./build.sh template      # writes build/template.pdf
```

To start a new presentation, copy the five `beamer*themecrns.sty` files and
`template.tex` into your project, rename `template.tex`, and replace the
title page fields and the slides.

### Background images

The theme draws the CRNS backgrounds from:

| File | Used on |
|---|---|
| `graphics/main_background_v2.pdf` | every slide |
| `graphics/titlepage_background_v3.pdf` | the title page |

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
