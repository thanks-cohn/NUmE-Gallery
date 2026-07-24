# NUME Gallery

A living visual index built around continuously moving image rows. Selecting a work opens the gallery from within, revealing a related-image rotunda, then a side-by-side source preview.

## Interaction

- Rows move continuously in alternating directions.
- Hover a row and use its arrow controls or the keyboard arrow keys.
- Select an image to open its central family rotunda.
- Use Previous and Next to move through opened images.
- Select the hero again to reveal its source preview.
- Use Back to reverse one stage at a time.

## Run locally

```bash
npm install
npm run dev
```

## Deployments

Pushes to `main` deploy the static build to GitHub Pages through GitHub Actions. The repository also retains its Cloudflare-compatible Vinext build.
