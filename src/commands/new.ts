import fs from 'fs';
import path from 'path';

function newCommand(projectName: string): void {
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`Creating a new project in ${projectPath}...`);

  // 1. 프로젝트 폴더 생성
  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }
  fs.mkdirSync(projectPath);

  // 2. 하위 폴더 (apps, packages) 생성
  fs.mkdirSync(path.join(projectPath, 'apps'));
  fs.mkdirSync(path.join(projectPath, 'packages'));

  // 3. package.json 파일 생성 (기본 내용)
  const packageJsonContent = {
    name: projectName,
    version: '1.0.0',
    private: true,
    scripts: {
      "dev": "pnpm --filter my-app dev"
    },
  };
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2)
  );
  
  // 4. pnpm-workspace.yaml 파일 생성
  const workspaceYamlContent = `packages:\n  - 'apps/*'\n  - 'packages/*'\n`;
  fs.writeFileSync(
    path.join(projectPath, 'pnpm-workspace.yaml'),
    workspaceYamlContent
  );

  console.log('✅ Project created successfully!');
  console.log('To get started:');
  console.log(`  cd ${projectName}`);
  console.log('  pnpm install');
}

export default newCommand;