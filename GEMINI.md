# bene-mono-cli

## 1. 프로젝트 개요 (Overview)

`bene-mono-cli`는 pnpm 워크스페이스를 기반으로 하는 모던 타입스크립트 모노레포를 손쉽게 구성해주는 Node.js 기반 CLI 애플리케이션입니다. NestJS CLI와 같이 직관적인 명령어를 통해, React 애플리케이션과 공통 라이브러리(예: 디자인 시스템, 유틸리티 함수)가 포함된 개발 환경을 자동으로 생성하여 프로젝트 초기 설정 시간을 단축하고 일관된 구조를 유지하도록 돕습니다.

## 2. 주요 기능 (Core Features)

- **pnpm 워크스페이스 자동 구성**: 명령어 한 줄로 `apps`와 `packages` 폴더를 포함한 pnpm 모노레포 구조를 생성합니다.
- **React + TypeScript 템플릿**: `apps` 폴더 내에 Vite 기반의 React + TypeScript 앱 템플릿을 기본으로 생성합니다.
- **공통 모듈 템플릿**: `packages` 폴더에 디자인 시스템(`ui`), 공통 로직(`utils`) 등 재사용 가능한 라이브러리 템플릿을 생성할 수 있는 기반을 마련합니다.
- **표준화된 개발 환경**: ESLint와 Prettier의 가장 일반적인 규칙을 자동으로 설정하여, 모든 패키지에서 일관된 코드 스타일과 품질을 유지합니다.

## 3. 기술 스택 (Tech Stack)

- **CLI Framework**: Node.js, Commander.js
- **Package Manager**: pnpm
- **Application Template**: React, TypeScript, Vite
- **Linting & Formatting**: ESLint, Prettier

## 4. 기본 디렉토리 구조 (Initial Directory Structure)

```
/
├── apps/
│   └── my-app/         # React + TS (Vite)
│       ├── package.json
│       └── ...
├── packages/
│   ├── ui/             # 공통 UI 컴포넌트 라이브러리
│   │   ├── package.json
│   │   └── ...
│   └── utils/          # 공통 유틸리티 함수 라이브러리
│       ├── package.json
│       └── ...
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json        # 루트 package.json
├── pnpm-workspace.yaml # pnpm 워크스페이스 정의
└── tsconfig.base.json  # 공통 TS 설정
```
