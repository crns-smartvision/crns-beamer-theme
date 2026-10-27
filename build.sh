#!/bin/bash

## Usage: ./build.sh main
## Builds main.tex

#set -e

FILE="$1"
BUILDDIR="build"

if [ -z "$FILE" ]; then
  echo "Usage: $0 <filename without extension>"
  exit 1
fi

mkdir -p "$BUILDDIR"
#mkdir -p "$BUILDDIR/sessions"

echo "##############################################"
echo "Building tex file"
echo "[$FILE]"
echo "##############################################"

# First LaTeX pass
pdflatex -interaction=nonstopmode -output-directory="$BUILDDIR" "$FILE.tex"

# BibTeX (note the path!)
bibtex "$BUILDDIR/$FILE"

# Final LaTeX pass
pdflatex -interaction=nonstopmode -output-directory="$BUILDDIR" "$FILE.tex"

# Copy final PDF back to working directory
#cp "$BUILDDIR/$FILE.pdf" .

echo "Build finished: $FILE.pdf"
#echo pdfjam "$BUILDDIR/$FILE".pdf --nup 1x2 --delta "0 2cm"  --paper a4paper --outfile "$BUILDDIR/$FILE"_2up_a4.pdf

#pdfjam "$BUILDDIR/$FILE".pdf --nup 1x2 --delta "0 2cm"  --paper a4paper --outfile "$BUILDDIR/$FILE"_2up_a4.pdf




#echo "##############################################"
#echo "Building tex file"
#echo "[$1]"
#echo "##############################################"

#pdflatex  $1.tex
#bibtex  $1.aux
#dvips -Pdownload35 -o $1.ps $1.dvi
#pdflatex $1.tex


#rm $1.aux
#rm $1.flg
#rm $1.log
#rm $1.ilg
#rm $1.ind
#rm $1.blg
#rm $1.toc
#rm $1.idx
#rm $1.bbl
#rm $1.ps
#rm $1.dvi
#rm $1.snm
#rm $1.out
#rm $1.nav
#rm $1.vrb





