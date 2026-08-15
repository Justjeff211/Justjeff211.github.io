# Mojalefa L. Letsoara, Cybersecurity Portfolio

Personal portfolio site covering SOC operations, Azure security, detection engineering and incident response.

**Live site:** [justjeff211.github.io](https://justjeff211.github.io/)

## About this site

I don't just study security, I build it. This site documents the labs I've built, the
alerts they generate and the investigations that follow: a running record of the
build, monitor, investigate, document loop I want to bring to a SOC team.

## Tech stack

Plain HTML, CSS and JavaScript. No frameworks, no build step.

- CSS custom properties for the design system (colour, type, spacing)
- Vanilla JS with `IntersectionObserver` for scroll reveal, counters and section tracking
- 3D scroll motion, dark and light themes with `localStorage` persistence
- Animated SVG diagrams, hand-drawn, no image assets
- Montserrat via Google Fonts
- Hosted on GitHub Pages

## Structure

```
index.html       All page content
css/style.css    Base layout and components
css/extra.css    Palette, theme, tiles, contact form, motion
js/main.js       Nav, menu, reveal, counters, tiles, form, theme, 3D motion
assets/cv/       Downloadable CV
```

## Contact form

The contact form posts to [Formspree](https://formspree.io) form `xeajljpp` over AJAX,
so the page never reloads and no email address appears in the page source.

- `js/main.js` handles submit, success, field-level validation errors and network failures
- `_subject` sets the subject line of the notification email
- `_gotcha` is a hidden honeypot field that silently drops bot submissions

The first real submission needs to be confirmed once from the Formspree dashboard
before messages start arriving.

## Running locally

No build step required.

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Connect

- [LinkedIn](https://www.linkedin.com/in/mojalefa-l-letsoara283b5a211/)
- [TikTok](https://www.tiktok.com/@justjeff211)
- GitHub, you're already here
