# plea-fe-init

Company React frontend project initializer.

## Usage

```bash
pnpm dlx @plea-git/plea-fe-init my-project
npx @plea-git/plea-fe-init my-project
```

## Non-interactive usage

```bash
pnpm dlx @plea-git/plea-fe-init my-project \
  --yes \
  --tests both \
  --auth jwt \
  --storybook true \
  --deploy none
```

Options:

- `--tests <none|unit|e2e|both>`
- `--auth <jwt|cookie>`
- `--storybook <true|false>`
- `--deploy <none|s3-cloudfront|ec2>`
- `--no-install`
- `--skip-git`

## Publish model

The package is configured for the npm public registry as `@plea-git/plea-fe-init`.

Create or verify the `plea-git` organization on npm, then publish:

```bash
pnpm install
pnpm lint
pnpm build
pnpm publish --access public
```

For GitHub Actions publishing, add an npm automation token to the `plea-git/plea-fe-init`
repository secret named `NPM_TOKEN`, then run the `Publish` workflow or publish a GitHub release.

The executable command remains `plea-fe-init` because it is defined in `bin`, but package
execution uses the scoped package name.
