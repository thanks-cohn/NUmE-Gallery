# NUME Gallery

NUME is a living visual index built around continuously moving image rows. Selecting a work opens the gallery from within: first as an enlarged hero rotunda, then as a source preview, while the moving gallery remains alive behind it.

## Experience

- Infinite image rows move continuously in alternating directions.
- Rows support pointer dragging, edge controls, hover controls, and keyboard navigation.
- Selecting an image opens its enlarged family rotunda.
- Previous and Next move through the current row.
- Ascend and Descend cross row boundaries from the nearest logical end.
- Selecting the enlarged hero opens its source preview.
- Back reverses one stage at a time; Escape remains available on hardware keyboards.
- The background gallery keeps moving but cannot receive accidental input while the rotunda is open.
- Reduced-motion preferences are respected.

### Mobile

Mobile uses a dedicated responsive rotunda component while sharing the same gallery data and interaction state as desktop. It is not a separate `mobile.html` page and does not redirect visitors.

- The selected image is the primary viewport region and can expand to approximately `94vw`.
- Enlarged images use `object-fit: contain` to preserve the complete artwork.
- Metadata, imagery, source preview, and navigation occupy separate layout regions to prevent overlapping text.
- Dynamic viewport units and safe-area insets support mobile browser bars and notched devices.
- Large row-edge controls replace the small desktop row-control pill.
- Portrait and landscape layouts are handled independently.
- Opening the rotunda locks background scrolling and restores the previous position when closed.

## Requirements

- Linux, macOS, or another Node-compatible development environment
- Node.js 22
- npm
- `bash`, `curl`, `flock`, `sha256sum`, and GNU `timeout` for the verified installation scripts

The hosted and CI environments use Node 22. Node 26 is not recommended for this project because native dependencies such as Sharp may not provide a compatible installation path.

## Node 22 with Fish

NUME was tested locally with Fish and `fnm`.

Install `fnm` if it is not already available:

```fish
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.config/fish/conf.d/fnm.fish
fnm install 22
fnm use 22
node --version
```

`node --version` should report `v22.x.x`.

In a new terminal, activate Node 22 before working on NUME:

```fish
fnm use 22
```

## First local setup

```fish
cd ~/dev/NUmE-Gallery
chmod +x scripts/*.sh

set -lx SHARP_IGNORE_GLOBAL_LIBVIPS 1
set -lx npm_config_include optional

npm run install:ci; and npm run build
```

Why these environment values are used:

- `SHARP_IGNORE_GLOBAL_LIBVIPS=1` prevents Sharp from detecting a system-wide `libvips` installation and attempting an unnecessary source compilation.
- `npm_config_include=optional` ensures Sharp's platform-specific prebuilt packages are installed.

The verified installer performs one bounded `npm ci`, checks the locked Vinext tarball and integrity value, uses a project-local writable cache, and confirms that Vinext is available afterward.

## Sites manifest

The repository tracks `.openai/hosting.json`, which identifies the existing NUME Sites project:

```json
{"project_id":"appgprj_6a631ba8f9cc81919d9b8d654d903388"}
```

This project ID is an identifier, not a password or deployment credential. Do not replace it when working on the existing NUME site.

If an older clone reports that `./.openai/hosting.json` cannot be resolved, update `main` first:

```fish
git switch main
git pull --ff-only
```

## Development

```fish
cd ~/dev/NUmE-Gallery
fnm use 22
npm run dev
```

Vite normally serves the project at:

```text
http://localhost:5173/
```

Stop the development server with `Ctrl+C`.

## Production build

```fish
cd ~/dev/NUmE-Gallery
fnm use 22
npm run build
```

A successful build ends with both messages:

```text
Build complete.
Validated Sites artifact: ESM Worker default.fetch and hosting manifest are present.
```

Vinext may report that route `/` is `Unknown`. This is an informational static-analysis limitation, not a failed build, provided the build and artifact validation finish successfully.

## Quality checks

```fish
npm run lint
npx tsc --noEmit
npm test
```

`npm test` performs the production build and then runs the automated tests. Current focused coverage includes mobile edge controls, drag-click suppression, background interaction blocking, the dedicated mobile rotunda layout, contained mobile imagery, and Previous/Next/Ascend/Descend behavior.

Next.js may emit advisory warnings about ordinary `<img>` elements during linting. Warnings are not build failures; errors must still be corrected.

## Available scripts

- `npm run install:ci` — verified, bounded clean dependency installation
- `npm run dev` — local Vite development server
- `npm run build` — Vinext production build plus Sites artifact validation
- `npm run start` — starts the completed Vinext production build
- `npm run lint` — ESLint through the project-local Sites environment
- `npm test` — production build followed by Node tests
- `npm run validate:artifact` — validates the generated Worker and Sites manifest

## Troubleshooting

### `Permission denied` for a script

```fish
chmod +x scripts/*.sh
git add scripts
git commit -m "Fix shell script permissions"
git push origin main
```

### `vinext is unavailable`

Dependencies have not completed installation:

```fish
fnm use 22
set -lx SHARP_IGNORE_GLOBAL_LIBVIPS 1
set -lx npm_config_include optional
npm run install:ci
```

Do not run the build until installation succeeds.

### Sharp attempts to build from source

Confirm Node and platform information:

```fish
node --version
uname -m
ldd --version | head -n 1
```

On x86-64 GNU/Linux, use:

```fish
set -lx SHARP_IGNORE_GLOBAL_LIBVIPS 1
set -lx npm_config_include optional
npm run install:ci
```

### Missing `.openai/hosting.json`

Pull the latest `main`. If repairing an old or incomplete local checkout manually:

```fish
mkdir -p .openai
printf '%s\n' \
'{"project_id":"appgprj_6a631ba8f9cc81919d9b8d654d903388"}' \
> .openai/hosting.json
```

### Fish says `Expected a string, but found a redirection`

Do not paste terminal output beginning with `>` back into the shell. Paste only the commands inside documented code blocks.

## Source control workflow

Before beginning work:

```fish
git switch main
git pull --ff-only
```

After a verified change:

```fish
git status
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

The completed v1 gallery milestone remains available under the `v1` Git tag. Later commits contain the mobile usability work and build-environment fixes.

## Deployment

The project retains its Cloudflare-compatible Vinext Worker build and Sites metadata. Sites deployments use the same application source as the GitHub repository; mobile and desktop are responsive presentations of one application rather than separately deployed websites.

Current Sites deployment:

https://nume-gallery.officialmahasbiz.chatgpt.site

Before deploying or publishing a change, run the production build and quality checks described above. Never commit credentials, `.env` secrets, API keys, or payment-provider secrets.