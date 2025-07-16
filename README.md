# bene-mono-cli

A simple CLI for generating pnpm-based monorepos with a modern tech stack.

`bene-mono-cli` helps you kickstart your next project by setting up a fully configured pnpm workspace. It automatically creates a standard monorepo structure with separate folders for applications and shared packages, pre-configured with TypeScript, ESLint, and Prettier.

## Features

- **pnpm Workspace**: Generates a ready-to-use pnpm workspace.
- **TypeScript First**: All templates are based on TypeScript.
- **Standard Structure**: Creates `apps` and `packages` directories for clean code organization.
- **React Template**: Includes a default React (Vite) application template.
- **Linting & Formatting**: Comes with pre-configured ESLint and Prettier for consistent code quality.

## Installation

To install the CLI globally, run the following command:

```bash
npm install -g bene-mono-cli
```

## Usage

To create a new monorepo project, use the `new` command:

```bash
bene-mono-cli new my-awesome-project
```

This will create a new directory named `my-awesome-project` with the following structure:

```
/
├── apps/
├── packages/
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Development

To set up the project for local development:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/bene-mono-cli.git
    cd bene-mono-cli
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Link the CLI locally:**
    This step makes the `bene-mono-cli` command available in your terminal, pointing to your local source code.
    ```bash
    npm link
    ```

4.  **Build the project:**
    The source code is written in TypeScript. You need to compile it to JavaScript.
    ```bash
    npm run build
    ```

    To automatically re-compile on file changes, use the watch mode:
    ```bash
    npm run build -- -w
    ```

Now you can use the `bene-mono-cli` command anywhere on your system, and it will execute the code from your local repository.
