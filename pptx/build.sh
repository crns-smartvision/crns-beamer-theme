#!/bin/bash
## Usage: pptx/build.sh
## Builds the PowerPoint version of the crns theme, once per title background:
## pptx/crns_template.pptx (crns) and pptx/smarts_template.pptx (smarts).
##
## Needs: pdflatex, poppler (pdftoppm, pdftocairo, pdfinfo), node with
## pptxgenjs (set NODE_PATH to its node_modules folder if it is installed
## elsewhere), and CRNS_APPLY_THEME pointing to apply_theme.js to write the
## theme colors. The backgrounds are read from ../graphics/.

set -e
cd "$(dirname "$0")"
ASSETS=../build/pptx
mkdir -p "$ASSETS"

# Backgrounds at 200 dpi of the 13.333 x 7.5 in slide
pdftoppm -png -singlefile -scale-to-x 2667 -scale-to-y 1500 ../graphics/main_background_v2.pdf "$ASSETS/bg_main"
pdftoppm -png -singlefile -scale-to-x 2667 -scale-to-y 1500 ../graphics/titlepage_background_v3.pdf "$ASSETS/bg_title_crns"
pdftoppm -png -singlefile -scale-to-x 2667 -scale-to-y 1500 ../graphics/titlepage_background_v3_smarts.pdf "$ASSETS/bg_title_smarts"

# Equations and figure: one PDF page each, rendered with a transparent background
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$ASSETS" equations.tex > /dev/null
pdftocairo -png -transp -r 600 "$ASSETS/equations.pdf" "$ASSETS/eq"
pages=$(pdfinfo "$ASSETS/equations.pdf" | awk '/^Pages:/ {print $2}')
{
  echo "{"
  for i in $(seq 1 "$pages"); do
    pdfinfo -f "$i" -l "$i" "$ASSETS/equations.pdf" \
      | awk -v i="$i" -v last="$pages" '/^Page.*size:/ {printf "  \"%s\": {\"w\": %s, \"h\": %s}%s\n", i, $4, $6, (i < last ? "," : "")}'
  done
  echo "}"
} > "$ASSETS/equations.json"
# pdftocairo numbers pages eq-1.png ... or eq-01.png ... depending on the count
for f in "$ASSETS"/eq-0*.png; do [ -e "$f" ] && mv "$f" "$ASSETS/eq-$(basename "$f" .png | sed 's/^eq-0*//').png"; done

node build_pptx.js "$ASSETS" crns_template.pptx crns
node build_pptx.js "$ASSETS" smarts_template.pptx smarts
