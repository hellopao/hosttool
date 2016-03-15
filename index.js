"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require("fs");
const os_1 = require("os");
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
};
const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
class HostTool {
    constructor(opts) {
        opts = opts || {};
        this.hostFile = opts.hostFile
            || (process.platform === "win32" ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts");
    }
    _getHosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const hosts = yield readFile(this.hostFile);
            return hosts;
        });
    }
    _setHosts(hosts) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield writeFile(this.hostFile, hosts);
            return result;
        });
    }
    list() {
        return this._getHosts();
    }
    add(host) {
        return this._getHosts()
            .then(result => {
            var hostItem;
            if (typeof host === "string") {
                hostItem = host;
            }
            else {
                hostItem = this._formatHost(host);
            }
            const hosts = `${result}${os_1.EOL}${hostItem}`;
            return this._setHosts(hosts);
        });
    }
    query(hostname) {
        return this._getHosts()
            .then(result => {
            return this._splitHosts(result)
                .filter(item => {
                const arr = item.split(/\s+/);
                return arr[1] === hostname;
            })[0];
        });
    }
    del(hostname) {
        return this._getHosts()
            .then(result => {
            const hosts = this._splitHosts(result)
                .filter(item => {
                const arr = item.split(/\s+/);
                return arr[1] !== hostname;
            });
            return this._setHosts(hosts.join(os_1.EOL));
        });
    }
    update(hostname, host) {
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
            return this._setHosts(hosts.join(os_1.EOL));
        });
    }
    _formatHost(host) {
        var hostItem = `${host.ip}  ${host.hostname}  #${host.comment}`;
        if (host.disable) {
            hostItem = `#${hostItem}`;
        }
        return hostItem;
    }
    _splitHosts(hosts) {
        return hosts.replace(/\t/g, '    ')
            .split(os_1.EOL)
            .filter(item => item && !item.startsWith('#'));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HostTool;
