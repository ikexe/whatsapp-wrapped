all: report.pdf

report.pdf: report.tex references.bib
	pdflatex report.tex
	bibtex report
	pdflatex report.tex
	pdflatex report.tex

clean:
	rm -f report.aux report.log report.out report.toc report.bbl report.blg

.PHONY: all clean
