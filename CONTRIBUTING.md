# Contributing

Thanks for your interest in improving the SMARTS CRNS Beamer theme.
Bug reports, suggestions and pull requests are all welcome.

## Reporting a bug or suggesting a feature

Open an issue on
<https://github.com/abenhamadou/smarts_crns_beamerclass_template/issues>.
Before opening a new one, check that it has not already been reported.

For a bug, include:

- a minimal `.tex` file that reproduces the problem (based on `template.tex`)
- the error message or a screenshot of the wrong output
- your TeX distribution and version (`pdflatex --version`)

For a feature, describe what you want to achieve and, if possible, how it
would be used from the `\usetheme[...]{crns}` options.

## Contributing changes

1. **Fork** the repository on GitHub and clone your fork:

   ```bash
   git clone git@github.com:<your-user>/smarts_crns_beamerclass_template.git
   cd smarts_crns_beamerclass_template
   git remote add upstream git@github.com:abenhamadou/smarts_crns_beamerclass_template.git
   ```

2. **Create a branch** from the latest default branch, named after the change:

   ```bash
   git fetch upstream
   git switch -c fix/subsection-page upstream/master
   ```

   Use a prefix such as `fix/`, `feature/` or `docs/`.

3. **Make your changes**, following the conventions below. Keep a pull
   request focused on one topic; split unrelated changes into separate PRs.

4. **Test** (see [Testing](#testing)).

5. **Commit** with a clear message: a short summary line (imperative mood,
   about 50 characters), a blank line, then what changed and why.

   ```
   Add palette option for the color profile

   Each profile defines the named theme colors, so a deck selects its
   colors with a single \usetheme option instead of editing the .sty files.
   ```

6. **Push** to your fork and **open a pull request** against the default
   branch of the upstream repository. Fill in the pull request template.

7. **Review**: a maintainer will review the PR and may ask for changes.
   Push new commits to the same branch to update it. Keep your branch up to
   date with `git fetch upstream && git rebase upstream/master` if needed.

## Theme conventions

- **Options** are pgfkeys under `/crns/<subtheme>/` (`inner`, `outer`,
  `color`, `font`) and must be usable from `\usetheme[...]{crns}`.
  Set their defaults in the `\crns@<subtheme>@setdefaults` macro.
- **Internal macros and lengths** are prefixed with `crns@`
  (`\crns@block`, `\crns@parskip`, ...). Do not define unprefixed commands
  in the theme files.
- **Colors** are defined only in the palette profiles of
  `beamercolorthemecrns.sty` (`crnsprimary`, `crnstext`, `crnspaper`,
  `crnsalert`, `crnsblock`, `crnsexample`). Inner and outer themes use
  beamer colors or these names, never hard-coded values. A new profile
  must define every named color.
- **Fonts and sizes** go through `\setbeamerfont` in
  `beamerfontthemecrns.sty` rather than `\fontsize` in templates.
- **Images**: do not commit logos, backgrounds or any presentation content
  (`graphics/`, `figures/`, `logos/` are ignored on purpose). The theme
  must still compile when these files are absent.
- **Showcase**: when you add a feature, add or update a slide in
  `template.tex` that demonstrates it.
- **Style**: match the surrounding code (indentation, comment style), and
  remove dead or commented-out code instead of adding more.
- **License headers**: keep the header at the top of each `.sty` file.

## Testing

Build the template and check that it compiles without errors:

```bash
./build.sh template
grep -c '^!' build/template.log          # must print 0
grep 'Missing character' build/template.log   # must print nothing
```

Then:

- open `build/template.pdf` and check the slides your change affects;
- if you touched colors, build once with each palette
  (`palette=rose` and `palette=darkred`);
- if you touched layout, check both the default and the
  `sidebar=left` / `header=transparent` options used in `template.tex`.

Include before/after screenshots in the pull request for any visual change.

## License of contributions

This project is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(see [`LICENSE`](LICENSE) and [`NOTICE.md`](NOTICE.md)).
By submitting a pull request, you agree that your contribution is
licensed under the same terms, and you confirm that you have the right to
submit it. Do not submit code copied from sources whose license is not
compatible with CC BY-SA 4.0.
