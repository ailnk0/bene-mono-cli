import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

export async function createShadcnUI(projectRootPath: string, uiPackageName: string): Promise<void> {
  // The uiPackageName is now passed as an argument, so we don't need to prompt for it here.
  // const uiPackageNameResponse = await prompts({
  //   type: 'text',
  //   name: 'uiPackageName',
  //   message: 'What is the name of your UI package? (e.g., ui, design-system)',
  //   initial: 'ui',
  // });

  // const uiPackageName = uiPackageNameResponse.uiPackageName;
  if (!uiPackageName) {
    console.log('Shadcn/ui design system creation cancelled.');
    return;
  }

  const uiPackagePath = path.join(projectRootPath, 'packages', uiPackageName);

  console.log(`
Creating shadcn/ui package '${uiPackageName}' in ${uiPackagePath}...
`);

  // Create UI package directory
  if (fs.existsSync(uiPackagePath)) {
    console.error(`Error: Directory ${uiPackageName} already exists in packages.`);
    process.exit(1);
  }
  fs.mkdirSync(uiPackagePath);

  // Create basic package.json for the UI package
  const packageJsonContent = {
    name: `@${uiPackageName}`,
    version: '1.0.0',
    main: './src/index.ts',
    types: './src/index.ts',
    license: 'MIT',
    scripts: {
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "build": "tsc",
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      "@types/react": "^18.2.66",
      "@types/react-dom": "^18.2.22",
      "typescript": "^5.2.2",
      "eslint": "^8.57.0",
      "@typescript-eslint/eslint-plugin": "^7.2.0",
      "@typescript-eslint/parser": "^7.2.0",
      "@vitejs/plugin-react": "^4.2.1",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-react-refresh": "^0.4.6",
      "prettier": "^3.2.5",
      "tailwindcss": "^3.4.1",
      "postcss": "^8.4.38",
      "autoprefixer": "^10.4.19",
    }
  };
  fs.writeFileSync(
    path.join(uiPackagePath, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2)
  );

  // Create a basic tsconfig.json for the UI package
  const tsconfigObject = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      outDir: "./dist",
      jsx: "react-jsx",
      lib: ["DOM", "DOM.Iterable", "ESNext"]
    },
    include: ["src"],
    exclude: ["node_modules", "dist"]
  };
  const tsconfigContent = JSON.stringify(tsconfigObject, null, 2);
  fs.writeFileSync(path.join(uiPackagePath, 'tsconfig.json'), tsconfigContent);

  // Create a basic index.ts for the UI package
  fs.mkdirSync(path.join(uiPackagePath, 'src'));
  fs.writeFileSync(path.join(uiPackagePath, 'src', 'index.ts'), 'export * from \'./components/button\';\n');

  // Prompt for shadcn/ui init options
  const shadcnConfig = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Which style would you like to use?',
      choices: [
        { title: 'Default', value: 'default' },
        { title: 'New York', value: 'new-york' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'baseColor',
      message: 'Which color would you like to use as base color?',
      choices: [
        { title: 'Slate', value: 'slate' },
        { title: 'Gray', value: 'gray' },
        { title: 'Zinc', value: 'zinc' },
        { title: 'Neutral', value: 'neutral' },
        { title: 'Stone', value: 'stone' },
      ],
      initial: 0,
    },
    {
      type: 'text',
      name: 'cssGlobal',
      message: 'Where is your global CSS file? (e.g., src/index.css)',
      initial: 'src/index.css',
    },
    {
      type: 'text',
      name: 'componentsAlias',
      message: 'Configure the import alias for components:',
      initial: '@/components',
    },
    {
      type: 'text',
      name: 'utilsAlias',
      message: 'Configure the import alias for utils:',
      initial: '@/lib/utils',
    },
    {
      type: 'confirm',
      name: 'rsc',
      message: 'Are you using React Server Components?',
      initial: false,
    },
  ]);

  // Construct the shadcn-ui init command
  const initCommand = [
    `pnpm dlx shadcn-ui@latest init`,
    `--yes`,
    `--ts`,
    `--style=${shadcnConfig.style}`,
    `--base-color=${shadcnConfig.baseColor}`,
    `--css-global=${shadcnConfig.cssGlobal}`,
    `--components-alias=${shadcnConfig.componentsAlias}`,
    `--utils-alias=${shadcnConfig.utilsAlias}`,
    shadcnConfig.rsc ? `--rsc` : '',
  ].filter(Boolean).join(' ');

  try {
    // Execute shadcn-ui init command inside the new UI package
    execSync(initCommand, { 
      cwd: uiPackagePath, 
      stdio: 'inherit' 
    });

    // Add some default components
    console.log('Adding default shadcn/ui components (Button, Input)...');
    execSync(`pnpm dlx shadcn-ui@latest add button input`, { 
      cwd: uiPackagePath, 
      stdio: 'inherit' 
    });

    console.log(`✅ Shadcn/ui design system '${uiPackageName}' created successfully!`);
  } catch (error: any) {
    console.error(`
❌ Failed to create shadcn/ui design system '${uiPackageName}':`, error.message);
    process.exit(1);
  }
}