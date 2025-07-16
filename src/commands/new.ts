import fs from "fs";
import path from "path";
import prompts from "prompts";
import { createViteReactApp } from "../utils/create-vite-react-app";
import { createShadcnUI } from "../utils/create-shadcn-ui";

async function newCommand(projectName: string): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName);
  const templateRootPath = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    "root"
  );

  console.log(`Creating a new project in ${projectPath}...`);

  // 1. 프로젝트 폴더 생성
  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }
  fs.mkdirSync(projectPath);

  // 2. 하위 폴더 (apps, packages) 생성
  fs.mkdirSync(path.join(projectPath, "apps"));
  fs.mkdirSync(path.join(projectPath, "packages"));

  // 3. package.json 파일 생성 (기본 내용)
  const packageJsonContent = {
    name: projectName,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "pnpm --filter my-app dev", // This will be updated dynamically
    },
  };
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJsonContent, null, 2)
  );

  // 4. pnpm-workspace.yaml 파일 생성
  const workspaceYamlContent = `packages:\n  - 'apps/*'\n  - 'packages/*'\n`;
  fs.writeFileSync(
    path.join(projectPath, "pnpm-workspace.yaml"),
    workspaceYamlContent
  );

  // 5. 템플릿 파일 복사 (eslintrc, prettierrc, tsconfig.base.json 등)
  fs.readdirSync(templateRootPath).forEach((file) => {
    const srcFilePath = path.join(templateRootPath, file);
    const destFilePath = path.join(projectPath, file);
    fs.copyFileSync(srcFilePath, destFilePath);
  });

  let uiPackageName: string | undefined;
  let createdAppName: string | undefined;

  // 6. 사용자에게 앱 및 패키지 생성 여부 질문
  const response = await prompts([
    {
      type: "confirm",
      name: "createReactApp",
      message:
        "Would you like to create a Vite React application in the apps folder?",
      initial: true,
    },
    {
      type: "confirm",
      name: "createShadcnUI",
      message:
        "Would you like to create a shadcn/ui design system in the packages folder?",
      initial: true,
    },
  ]);

  if (response.createShadcnUI) {
    const uiNameResponse = await prompts({
      type: "text",
      name: "uiPackageName",
      message: "What is the name of your UI package? (e.g., ui, design-system)",
      initial: "ui",
    });
    uiPackageName = uiNameResponse.uiPackageName;
    if (uiPackageName) {
      console.log("Creating shadcn/ui design system...");
      await createShadcnUI(projectPath, uiPackageName);
    }
  }

  if (response.createReactApp) {
    console.log("Creating Vite React app...");
    createdAppName = await createViteReactApp(
      projectPath,
      response.createShadcnUI,
      uiPackageName
    );
  }

  // Update root package.json with the actual app name if a React app was created
  if (createdAppName) {
    const rootPackageJsonPath = path.join(projectPath, 'package.json');
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
    rootPackageJson.scripts.dev = `pnpm --filter ${createdAppName} dev`;
    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
  }

  console.log("✅ Project created successfully!");
  console.log("To get started:");
  console.log(`  cd ${projectName}`);
  console.log("  pnpm install");
}

export default newCommand;