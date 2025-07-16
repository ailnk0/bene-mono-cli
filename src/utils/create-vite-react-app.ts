import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

export async function createViteReactApp(
  projectRootPath: string,
  createShadcnUI: boolean,
  uiPackageName: string | undefined
): Promise<string | undefined> {
  const appNameResponse = await prompts({
    type: 'text',
    name: 'appName',
    message: 'What is the name of your React application? (e.g., my-web-app)',
    initial: 'my-web-app',
  });

  const appName = appNameResponse.appName;
  if (!appName) {
    console.log('React application creation cancelled.');
    return undefined;
  }

  const appPath = path.join(projectRootPath, 'apps', appName);

  console.log(`
Creating Vite React app '${appName}' in ${appPath}...
`);

  try {
    // Execute pnpm create vite command
    // --template react-ts ensures React with TypeScript
    // . means create in the current directory (which will be the appPath)
    execSync(`pnpm create vite ${appName} --template react-ts`, {
      cwd: path.join(projectRootPath, 'apps'),
      stdio: 'inherit',
    });

    // Update package.json to include shadcn/ui package as dependency if created
    if (createShadcnUI && uiPackageName) {
      const appPackageJsonPath = path.join(appPath, 'package.json');
      const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf-8'));

      appPackageJson.dependencies[`@${uiPackageName}`] = 'workspace:*';

      fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));

      // Update tsconfig.json to include path alias for shadcn/ui package
      const appTsconfigPath = path.join(appPath, 'tsconfig.json');
      const appTsconfig = JSON.parse(fs.readFileSync(appTsconfigPath, 'utf-8'));

      // Ensure compilerOptions exists
      if (!appTsconfig.compilerOptions) {
        appTsconfig.compilerOptions = {};
      }

      // Ensure compilerOptions.paths exists
      if (!appTsconfig.compilerOptions.paths) {
        appTsconfig.compilerOptions.paths = {};
      }
      appTsconfig.compilerOptions.paths[`@${uiPackageName}/*`] = [`../../packages/${uiPackageName}/src/*`];

      fs.writeFileSync(appTsconfigPath, JSON.stringify(appTsconfig, null, 2));
    }

    console.log(`✅ Vite React app '${appName}' created successfully!`);
    return appName; // Return the app name
  } catch (error: any) {
    console.error(`
❌ Failed to create Vite React app '${appName}':`, error.message);
    process.exit(1);
  }
}
