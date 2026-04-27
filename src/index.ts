#!/usr/bin/env node

import {
  chmod,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {
  cancel,
  confirm,
  intro,
  isCancel,
  note,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import { execa } from 'execa';

type TestOption = 'none' | 'unit' | 'e2e' | 'both';
type AuthOption = 'jwt' | 'cookie';
type DeployOption = 'none' | 's3-cloudfront' | 'ec2';

type ScaffoldOptions = {
  projectArg: string;
  packageName: string;
  targetDir: string;
  tests: TestOption;
  auth: AuthOption;
  storybook: boolean;
  deploy: DeployOption;
  install: boolean;
  git: boolean;
};

type PackageJson = {
  name?: string;
  version?: string;
  private?: boolean;
  packageManager?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

type TsConfig = {
  compilerOptions?: {
    target?: string;
    module?: string;
    moduleResolution?: string;
    allowImportingTsExtensions?: boolean;
    composite?: boolean;
    noEmit?: boolean;
    emitDeclarationOnly?: boolean;
    declaration?: boolean;
    strict?: boolean;
    skipLibCheck?: boolean;
    types?: string[];
    [key: string]: unknown;
  };
  include?: string[];
  [key: string]: unknown;
};

type KnipConfig = {
  project?: string[];
  ignoreBinaries?: string[];
  ignore?: string[];
  ignoreDependencies?: string[];
  [key: string]: unknown;
};

const biomeVersion = '2.4.13';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const templateDir = path.join(packageRoot, 'templates', 'react-common');

const testOptions = ['none', 'unit', 'e2e', 'both'] as const;
const authOptions = ['jwt', 'cookie'] as const;
const deployOptions = ['none', 's3-cloudfront', 'ec2'] as const;

const defaults = {
  tests: 'both' as TestOption,
  auth: 'jwt' as AuthOption,
  storybook: true,
  deploy: 'none' as DeployOption,
};

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      yes: { type: 'boolean', short: 'y' },
      tests: { type: 'string' },
      auth: { type: 'string' },
      storybook: { type: 'string' },
      deploy: { type: 'string' },
      'no-install': { type: 'boolean' },
      'skip-git': { type: 'boolean' },
    },
  });

  if (values.help) {
    printHelp();
    return;
  }

  intro('plea-fe-init');

  const nonInteractive = Boolean(values.yes) || !process.stdin.isTTY;
  const options = await resolveOptions({
    projectArg: positionals[0],
    nonInteractive,
    rawTests: values.tests,
    rawAuth: values.auth,
    rawStorybook: values.storybook,
    rawDeploy: values.deploy,
    install: !values['no-install'],
    git: !values['skip-git'],
  });

  await ensureTargetDir(options.targetDir);

  const s = spinner();
  s.start('Creating project files');
  await cp(templateDir, options.targetDir, {
    recursive: true,
    force: false,
    errorOnExist: false,
  });
  await restoreGitignore(options.targetDir);
  await applyOptions(options);
  s.stop('Project files created');

  if (options.git) {
    await runStep('Initializing git repository', options.targetDir, 'git', ['init']);
  }

  if (options.install) {
    await runStep('Installing dependencies with pnpm', options.targetDir, 'pnpm', ['install']);
  }

  note(buildSummary(options), 'Project ready');
  outro('Done');
}

async function resolveOptions(input: {
  projectArg?: string;
  nonInteractive: boolean;
  rawTests?: string;
  rawAuth?: string;
  rawStorybook?: string;
  rawDeploy?: string;
  install: boolean;
  git: boolean;
}): Promise<ScaffoldOptions> {
  let projectArg = input.projectArg;

  if (!projectArg && input.nonInteractive) {
    throw new Error('Project name is required in non-interactive mode.');
  }

  if (!projectArg) {
    projectArg = unwrap(
      await text({
        message: 'Project name',
        placeholder: 'my-project',
        validate(value) {
          if (!value?.trim()) return 'Project name is required.';
        },
      }),
    );
  }

  const targetDir = path.resolve(process.cwd(), projectArg);
  const packageName = toPackageName(path.basename(targetDir));

  const tests =
    parseChoice(input.rawTests, testOptions, 'tests') ??
    (input.nonInteractive
      ? defaults.tests
      : unwrap(
          await select({
            message: 'Test setup',
            initialValue: defaults.tests,
            options: [
              { value: 'both', label: 'Vitest + Playwright' },
              { value: 'unit', label: 'Vitest only' },
              { value: 'e2e', label: 'Playwright only' },
              { value: 'none', label: 'None' },
            ],
          }),
        ));

  const auth =
    parseChoice(input.rawAuth, authOptions, 'auth') ??
    (input.nonInteractive
      ? defaults.auth
      : unwrap(
          await select({
            message: 'Auth/session style',
            initialValue: defaults.auth,
            options: [
              { value: 'jwt', label: 'JWT token' },
              { value: 'cookie', label: 'Session cookie' },
            ],
          }),
        ));

  const storybook =
    parseBoolean(input.rawStorybook, 'storybook') ??
    (input.nonInteractive
      ? defaults.storybook
      : unwrap(
          await confirm({
            message: 'Use Storybook?',
            initialValue: defaults.storybook,
          }),
        ));

  const deploy =
    parseChoice(input.rawDeploy, deployOptions, 'deploy') ??
    (input.nonInteractive
      ? defaults.deploy
      : unwrap(
          await select({
            message: 'Deployment CI example',
            initialValue: defaults.deploy,
            options: [
              { value: 'none', label: 'None' },
              { value: 's3-cloudfront', label: 'S3 + CloudFront' },
              { value: 'ec2', label: 'EC2 static deploy' },
            ],
          }),
        ));

  return {
    projectArg,
    packageName,
    targetDir,
    tests,
    auth,
    storybook,
    deploy,
    install: input.install,
    git: input.git,
  };
}

async function applyOptions(options: ScaffoldOptions) {
  await updatePackageJson(options);
  await updateTsconfigNode(options);
  await updateBiomeConfig(options.targetDir);
  await applyAuthTemplate(options);
  await applyTestTemplate(options);
  await applyStorybookTemplate(options);
  await updateKnipConfig(options);
  await writeEnvFiles(options);
  await writeCommitConvention(options.targetDir);
  await writeCiWorkflow(options);
  await writeDeployWorkflow(options);
}

async function restoreGitignore(targetDir: string) {
  const fallbackPath = path.join(targetDir, 'gitignore');
  if (!(await exists(fallbackPath))) return;

  const content = await readFile(fallbackPath, 'utf8');
  await writeFile(path.join(targetDir, '.gitignore'), content);
  await rm(fallbackPath, { force: true });
}

async function updatePackageJson(options: ScaffoldOptions) {
  const packageJsonPath = path.join(options.targetDir, 'package.json');
  const pkg = await readJson<PackageJson>(packageJsonPath);
  const hasUnit = options.tests === 'unit' || options.tests === 'both';
  const hasE2e = options.tests === 'e2e' || options.tests === 'both';

  pkg.name = options.packageName;
  pkg.version = '0.0.0';
  pkg.private = true;
  pkg.packageManager = 'pnpm@10.28.2';
  pkg.scripts ??= {};
  pkg.devDependencies ??= {};

  pkg.scripts.prepare = 'husky';
  pkg.devDependencies['@biomejs/biome'] = biomeVersion;
  pkg.devDependencies['@commitlint/cli'] = '^20.5.2';
  pkg.devDependencies['@commitlint/config-conventional'] = '^20.5.0';

  if (!hasUnit) {
    deleteScripts(pkg, ['test', 'test:watch', 'test:coverage']);
    deleteDevDependencies(pkg, [
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@testing-library/user-event',
      '@vitest/coverage-v8',
      'happy-dom',
      'jsdom',
      'vitest',
    ]);
  }

  if (!hasE2e) {
    deleteScripts(pkg, ['e2e', 'e2e:ui']);
    deleteDevDependencies(pkg, ['@playwright/test']);
  }

  if (!options.storybook) {
    deleteScripts(pkg, ['storybook', 'storybook:build']);
    for (const key of Object.keys(pkg.devDependencies)) {
      if (key === 'storybook' || key.startsWith('@storybook/')) {
        delete pkg.devDependencies[key];
      }
    }
  }

  await writeJson(packageJsonPath, pkg);
}

async function updateTsconfigNode(options: ScaffoldOptions) {
  const tsconfigPath = path.join(options.targetDir, 'tsconfig.node.json');
  const config = await readJson<TsConfig>(tsconfigPath);
  const hasUnit = options.tests === 'unit' || options.tests === 'both';
  const hasE2e = options.tests === 'e2e' || options.tests === 'both';

  config.include = (config.include ?? []).filter((entry) => {
    if (!hasUnit && entry === 'vitest.config.ts') return false;
    if (!hasE2e && entry === 'playwright.config.ts') return false;
    if (!options.storybook && entry === '.storybook/**/*.ts') return false;
    return true;
  });

  await writeTsconfigNode(tsconfigPath, config);
}

async function updateBiomeConfig(targetDir: string) {
  const biomeConfigPath = path.join(targetDir, 'biome.json');
  const config = await readJson<Record<string, unknown>>(biomeConfigPath);
  config.$schema = `https://biomejs.dev/schemas/${biomeVersion}/schema.json`;
  await writeJson(biomeConfigPath, config);
}

async function applyAuthTemplate(options: ScaffoldOptions) {
  const apiDir = path.join(options.targetDir, 'src', 'api');
  const selectedFile = options.auth === 'jwt' ? 'jwt-example.ts' : 'cookie-example.ts';
  const content = await readFile(path.join(apiDir, selectedFile), 'utf8');

  await writeFile(path.join(apiDir, 'client.ts'), content);
  await rm(path.join(apiDir, 'jwt-example.ts'), { force: true });
  await rm(path.join(apiDir, 'cookie-example.ts'), { force: true });

  if (options.auth === 'cookie') {
    await enableViteProxy(options.targetDir);
  }
}

async function enableViteProxy(targetDir: string) {
  const viteConfigPath = path.join(targetDir, 'vite.config.ts');
  const source = await readFile(viteConfigPath, 'utf8');
  const next = source.replace(
    [
      "    // proxy: {",
      "    //   '/api': {",
      "    //     target: 'http://localhost:8080',",
      '    //     changeOrigin: true,',
      '    //   },',
      '    // },',
    ].join('\n'),
    [
      '    proxy: {',
      "      '/api': {",
      "        target: 'http://localhost:8080',",
      '        changeOrigin: true,',
      '        secure: false,',
      '      },',
      '    },',
    ].join('\n'),
  );
  await writeFile(viteConfigPath, next);
}

async function applyTestTemplate(options: ScaffoldOptions) {
  const hasUnit = options.tests === 'unit' || options.tests === 'both';
  const hasE2e = options.tests === 'e2e' || options.tests === 'both';

  if (!hasUnit) {
    await rm(path.join(options.targetDir, 'vitest.config.ts'), { force: true });
    await rm(path.join(options.targetDir, 'src', 'test'), { recursive: true, force: true });
    await rm(path.join(options.targetDir, 'src', 'mocks', 'server.ts'), { force: true });
    await removeFilesMatching(options.targetDir, (filePath) => /\.test\.[cm]?[tj]sx?$/.test(filePath));
  }

  if (!hasE2e) {
    await rm(path.join(options.targetDir, 'playwright.config.ts'), { force: true });
    await rm(path.join(options.targetDir, 'e2e'), { recursive: true, force: true });
  }
}

async function applyStorybookTemplate(options: ScaffoldOptions) {
  if (options.storybook) return;

  await rm(path.join(options.targetDir, '.storybook'), { recursive: true, force: true });
  await removeFilesMatching(options.targetDir, (filePath) =>
    /\.stories\.[cm]?[tj]sx?$/.test(filePath),
  );
}

async function updateKnipConfig(options: ScaffoldOptions) {
  const knipConfigPath = path.join(options.targetDir, 'knip.json');
  const packageJsonPath = path.join(options.targetDir, 'package.json');
  const config = await readJson<KnipConfig>(knipConfigPath);
  const pkg = await readJson<PackageJson>(packageJsonPath);
  const installedPackages = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
  const forcedDependencies = [
    '@ebay/nice-modal-react',
    '@hookform/resolvers',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-direction',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
    '@tanstack/react-table',
    '@types/lodash',
    'class-variance-authority',
    'clsx',
    'date-fns',
    'dayjs',
    'immer',
    'ky',
    'lodash',
    'lucide-react',
    'react-datepicker',
    'react-day-picker',
    'react-hook-form',
    'react-number-format',
    'sonner',
    'tailwind-merge',
    'zod',
    'zustand',
  ].filter((dependency) => installedPackages.has(dependency));

  config.ignoreDependencies = unique([...(config.ignoreDependencies ?? []), ...forcedDependencies]);

  if (!options.storybook) {
    config.ignore = (config.ignore ?? []).filter((entry) => entry !== '.storybook/**');
  }

  await writeKnipConfig(knipConfigPath, config);
}

async function writeEnvFiles(options: ScaffoldOptions) {
  const value = options.auth === 'cookie' ? '/api' : 'http://localhost:3001/api';
  const content = `VITE_API_URL=${value}\n`;

  await writeFile(path.join(options.targetDir, '.env.local'), content);
  await writeFile(path.join(options.targetDir, '.env.example'), content);
}

async function writeCommitConvention(targetDir: string) {
  const config = `module.exports = { extends: ['@commitlint/config-conventional'] };\n`;
  const hook = `pnpm exec commitlint --edit "$1"\n`;
  const hookPath = path.join(targetDir, '.husky', 'commit-msg');

  await mkdir(path.dirname(hookPath), { recursive: true });
  await writeFile(path.join(targetDir, 'commitlint.config.cjs'), config);
  await writeFile(hookPath, hook);
  await chmod(hookPath, 0o755);

  const prePushPath = path.join(targetDir, '.husky', 'pre-push');
  if (await exists(prePushPath)) {
    await chmod(prePushPath, 0o755);
  }
}

async function writeCiWorkflow(options: ScaffoldOptions) {
  const hasUnit = options.tests === 'unit' || options.tests === 'both';
  const hasE2e = options.tests === 'e2e' || options.tests === 'both';
  const steps: string[] = [
    step('Checkout', 'uses: actions/checkout@v4'),
    step('Setup pnpm', ['uses: pnpm/action-setup@v4', 'with:', '  version: 10.28.2']),
    step('Setup Node.js', [
      'uses: actions/setup-node@v4',
      'with:',
      '  node-version: 24',
      '  cache: pnpm',
    ]),
    step('Install dependencies', 'run: pnpm install --frozen-lockfile'),
    step('Lint & Format check', 'run: pnpm lint'),
    step('Type check', 'run: pnpm typecheck'),
    step('Unused code check', 'run: pnpm knip'),
    step('Security audit', ['run: pnpm audit --audit-level=high', 'continue-on-error: true']),
  ];

  if (hasUnit) {
    steps.push(step('Unit test', ['run: pnpm test', 'timeout-minutes: 3']));
  }

  steps.push(step('Build', 'run: pnpm build'));

  if (options.storybook) {
    steps.push(step('Build Storybook', 'run: pnpm storybook:build'));
  }

  if (hasE2e) {
    steps.push(
      step('Install Playwright browsers', 'run: pnpm exec playwright install --with-deps chromium'),
    );
    steps.push(step('E2E test', 'run: pnpm e2e'));
  }

  const content = `name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
${steps.join('\n')}
`;

  await writeFile(path.join(options.targetDir, '.github', 'workflows', 'ci.yml'), content);
}

async function writeDeployWorkflow(options: ScaffoldOptions) {
  if (options.deploy === 'none') return;

  const workflow =
    options.deploy === 's3-cloudfront' ? s3CloudFrontWorkflow() : ec2StaticDeployWorkflow();

  const workflowDir = path.join(options.targetDir, '.github', 'workflows');
  await mkdir(workflowDir, { recursive: true });
  await writeFile(path.join(workflowDir, 'deploy.yml'), workflow);
}

function s3CloudFrontWorkflow() {
  return `name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.28.2

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ secrets.AWS_REGION }}

      - name: Upload to S3
        run: aws s3 sync dist/ s3://\${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id \${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
`;
}

function ec2StaticDeployWorkflow() {
  return `name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.28.2

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "\${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H "\${{ secrets.EC2_HOST }}" >> ~/.ssh/known_hosts

      - name: Upload dist
        run: rsync -avz --delete dist/ \${{ secrets.EC2_USER }}@\${{ secrets.EC2_HOST }}:\${{ secrets.EC2_DEPLOY_PATH }}/
`;
}

function step(name: string, body: string | string[]) {
  const lines = Array.isArray(body) ? body : [body];
  return [`      - name: ${name}`, ...lines.map((line) => `        ${line}`)].join('\n');
}

async function runStep(label: string, cwd: string, command: string, args: string[]) {
  const s = spinner();
  s.start(label);
  try {
    await execa(command, args, { cwd, stdio: 'pipe' });
    s.stop(label);
  } catch (error) {
    s.stop(`${label} failed`);
    throw error;
  }
}

async function ensureTargetDir(targetDir: string) {
  if (await exists(targetDir)) {
    const files = await readdir(targetDir);
    if (files.length > 0) {
      throw new Error(`Target directory is not empty: ${targetDir}`);
    }
  }

  await mkdir(targetDir, { recursive: true });
}

async function removeFilesMatching(rootDir: string, predicate: (relativePath: string) => boolean) {
  const files = await listFiles(rootDir);
  await Promise.all(
    files
      .filter((file) => predicate(path.relative(rootDir, file)))
      .map((file) => rm(file, { force: true })),
  );
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(fullPath);
      if (entry.isFile()) return [fullPath];
      return [];
    }),
  );

  return files.flat();
}

async function exists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

async function writeJson(filePath: string, value: unknown) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeTsconfigNode(filePath: string, config: TsConfig) {
  const compilerOptions = config.compilerOptions ?? {};
  const include = config.include ?? [];
  const content = `{
  "compilerOptions": {
    "target": "${compilerOptions.target ?? 'ES2022'}",
    "module": "${compilerOptions.module ?? 'ESNext'}",
    "moduleResolution": "${compilerOptions.moduleResolution ?? 'bundler'}",
    "allowImportingTsExtensions": ${compilerOptions.allowImportingTsExtensions ?? true},
    "composite": ${compilerOptions.composite ?? true},
    "noEmit": ${compilerOptions.noEmit ?? false},
    "emitDeclarationOnly": ${compilerOptions.emitDeclarationOnly ?? true},
    "declaration": ${compilerOptions.declaration ?? true},
    "strict": ${compilerOptions.strict ?? true},
    "skipLibCheck": ${compilerOptions.skipLibCheck ?? true},
    "types": ${inlineStringArray(compilerOptions.types ?? ['node'])}
  },
  "include": ${inlineStringArray(include)}
}
`;
  await writeFile(filePath, content);
}

async function writeKnipConfig(filePath: string, config: KnipConfig) {
  const content = `{
  "$schema": ${JSON.stringify(config.$schema ?? 'https://unpkg.com/knip@6/schema.json')},
  "project": ${inlineStringArray(config.project ?? [])},
  "ignoreBinaries": ${inlineStringArray(config.ignoreBinaries ?? [])},
  "ignore": ${multilineStringArray(config.ignore ?? [], 2)},
  "ignoreDependencies": ${multilineStringArray(config.ignoreDependencies ?? [], 2)}
}
`;
  await writeFile(filePath, content);
}

function inlineStringArray(values: string[]) {
  return `[${values.map((value) => JSON.stringify(value)).join(', ')}]`;
}

function multilineStringArray(values: string[], baseIndent: number) {
  if (values.length === 0) return '[]';
  const indent = ' '.repeat(baseIndent);
  const itemIndent = ' '.repeat(baseIndent + 2);
  return `[\n${values.map((value) => `${itemIndent}${JSON.stringify(value)}`).join(',\n')}\n${indent}]`;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values)).sort();
}

function deleteScripts(pkg: PackageJson, names: string[]) {
  if (!pkg.scripts) return;
  for (const name of names) {
    delete pkg.scripts[name];
  }
}

function deleteDevDependencies(pkg: PackageJson, names: string[]) {
  if (!pkg.devDependencies) return;
  for (const name of names) {
    delete pkg.devDependencies[name];
  }
}

function parseChoice<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  flagName: string,
) {
  if (value === undefined) return undefined;
  if (allowed.includes(value as T)) return value as T;
  throw new Error(`Invalid --${flagName}: ${value}. Use one of: ${allowed.join(', ')}`);
}

function parseBoolean(value: string | undefined, flagName: string) {
  if (value === undefined) return undefined;
  if (['true', 'yes', '1'].includes(value)) return true;
  if (['false', 'no', '0'].includes(value)) return false;
  throw new Error(`Invalid --${flagName}: ${value}. Use true or false.`);
}

function unwrap<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('Canceled');
    process.exit(0);
  }
  return value;
}

function toPackageName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[._-]+$/, '');
}

function buildSummary(options: ScaffoldOptions) {
  const commands = [
    `cd ${path.relative(process.cwd(), options.targetDir) || '.'}`,
    !options.install ? 'pnpm install' : undefined,
    'pnpm dev',
  ].filter(Boolean);

  return [
    `Project: ${options.packageName}`,
    `Tests: ${options.tests}`,
    `Auth: ${options.auth}`,
    `Storybook: ${options.storybook ? 'enabled' : 'disabled'}`,
    `Deploy: ${options.deploy}`,
    '',
    commands.join('\n'),
  ].join('\n');
}

function printHelp() {
  process.stdout.write(`Usage:
  plea-fe-init <project-name> [options]

Options:
  -y, --yes                         Use defaults for omitted options
  --tests <none|unit|e2e|both>      Test setup
  --auth <jwt|cookie>               Auth/session style
  --storybook <true|false>          Include Storybook
  --deploy <none|s3-cloudfront|ec2> Deployment CI example
  --no-install                      Skip pnpm install
  --skip-git                        Skip git init
  -h, --help                        Show help
`);
}

main().catch((error) => {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
