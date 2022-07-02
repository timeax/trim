#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const handler_1 = require("./handler");
const actions = new handler_1.Actions(null);
commander_1.program
    .version('1.0.0')
    .description('HTML Preprocessor Manager')
    .name('ts');
commander_1.program
    .command('init')
    .alias('-y')
    .description('creates a config file')
    .action((...props) => {
    const path = process.cwd();
    actions.createConfig(path);
});
commander_1.program
    .command('run')
    .alias('-c')
    .description('Compiles specific path')
    .arguments('<from> <to>')
    .action((from, to) => {
    actions.runFile(from, to);
});
commander_1.program
    .command('watch')
    .alias('-w')
    .description('watch path')
    .action(() => {
    const path = process.cwd();
    actions.watchFolder(path);
});
commander_1.program.parse(process.argv);
