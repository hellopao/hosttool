"use strict";
const program = require("commander");
const _1 = require("../");
const pkg = require('../package.json');
const stdout = process.stdout;
program
    .version(pkg.version)
    .usage('[command]');
program
    .command('query <hostname>')
    .description('query host info by hostname')
    .action((hostname) => {
    const tool = new _1.default();
    tool.query(hostname)
        .then(host => {
        stdout.write(host);
    });
});
program
    .command('list')
    .description('list the system hosts')
    .action(() => {
    const tool = new _1.default();
    tool.list()
        .then(hosts => {
        stdout.write(hosts);
    });
});
program
    .command('add <host>')
    .description('add host')
    .action((host) => {
    const tool = new _1.default();
    tool.add(host)
        .then(() => {
        stdout.write('host is added');
    });
});
program
    .command('del <hostname>')
    .description('delete host by hostname')
    .action((hostname) => {
    const tool = new _1.default();
    tool.del(hostname)
        .then(() => {
        stdout.write('host is deleted');
    });
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
