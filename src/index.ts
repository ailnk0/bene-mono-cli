import { Command } from 'commander';
import newCommand from './commands/new.js';

const program = new Command();

program
  .name('bene-mono-cli')
  .description('A CLI to generate pnpm-based monorepos')
  .version('0.1.0');

program
  .command('new <project-name>')
  .description('Create a new pnpm monorepo project')
  .action(newCommand);

program.parse(process.argv);