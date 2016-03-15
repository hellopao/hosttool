#!/usr/bin/env node

"use strict";

import * as program from "commander";

import HostTool from "../";

const pkg = require('../package.json');
const stdout = process.stdout;

program
    .version(pkg.version)
    .usage('[command]')


program
	.command('query <hostname>')
	.description('query host info by hostname')
	.action((hostname:string) => {
		const tool = new HostTool();
        
        tool.query(hostname)
            .then(host => {
                stdout.write(host);
            })
	})
    
program
    .command('list')
    .description('list the system hosts')
    .action(()=> {
        const tool = new HostTool();
        
        tool.list()
            .then(hosts => {
                stdout.write(hosts);
            })
    })  
    
program
    .command('add <host>')
    .description('add host')
    .action((host: string) => {
        const tool = new HostTool();
        
        tool.add(host)
            .then(()=> {
                stdout.write('host is added');
            })
    })
    
program
    .command('del <hostname>')
    .description('delete host by hostname')
    .action((hostname: string) => {
        const tool = new HostTool();
        
        tool.del(hostname)
            .then(()=> {
                stdout.write('host is deleted');
            })
    })
    
program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}