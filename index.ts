import * as fs from "fs";
import {join} from "path";
import {EOL} from "os";

const readFile = (file): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
}

const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

interface IOptions {
    hostFile?: string;    
}

interface IHost {
    ip: string;
    hostname: string;
    comment?: string;
    disable?: boolean;
}

export default class HostTool {

    hostFile: string;

    constructor(opts?: IOptions) {
        opts = opts || {};
        this.hostFile = opts.hostFile 
            || (process.platform === "win32" ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts");
    }

    async _getHosts() {
        const hosts = await readFile(this.hostFile);
        return hosts;
    }

    async _setHosts(hosts: string) {
        const result = await writeFile(this.hostFile, hosts);
        return result;
    }

    list(): Promise<any> {
        return this._getHosts()
    }

    add(host: IHost | string): Promise<any> {
        return this._getHosts()
            .then(result => {
                var hostItem;
                if (typeof host === "string") {
                    hostItem = host; 
                } else {
                    hostItem = this._formatHost(host);                    
                }
                const hosts = `${result}${EOL}${hostItem}`
                return this._setHosts(hosts);
            })
    }

    query(hostname: string): Promise<string> {
        return this._getHosts()
            .then(result => {
                return this._splitHosts(result)
                    .filter(item => {
                        const arr = item.split(/\s+/);
                        return arr[1] === hostname;
                    })[0];
            })
    }

    del(hostname: string): Promise<any> {
        return this._getHosts()
            .then(result => {
                const hosts = this._splitHosts(result)
                    .filter(item => {
                        const arr = item.split(/\s+/);
                        return arr[1] !== hostname;
                    });
                return this._setHosts(hosts.join(EOL))
            })
    }

    update(hostname: string, host: IHost): Promise<any> {
        return this._getHosts()
            .then(result => {
                const hosts = this._splitHosts(result)
                    .map(item => {
                        const arr = item.split(/\s+/);
                        if (arr[1] === hostname) {
                            return this._formatHost(host);
                        }
                        return item;
                    });
                return this._setHosts(hosts.join(EOL));
            })
    }

    _formatHost(host: IHost): string {
        var hostItem = `${host.ip}  ${host.hostname}  #${host.comment}`;
        if (host.disable) {
            hostItem = `#${hostItem}`;
        }
        return hostItem;
    }

    _splitHosts(hosts: string): string[] {
        return hosts.replace(/\t/g, '    ')
            .split(EOL)
            .filter(item => item && !item.startsWith('#'))
    }
}
