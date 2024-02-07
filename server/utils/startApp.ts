import devHosts from 'configs/hosts.json';
import { Express } from 'express';
import { readFileSync } from 'fs';
import https from 'https';
import { homedir } from 'os';
import { resolve } from 'path';
import { findIP } from './network';

interface Options {
    server: Express;
}

const { PORT = 3000, NODE_ENV } = process.env;

const isDev = NODE_ENV === 'development';

const APP_HOSTS = ['localhost'];

if (isDev) {
    const devLocalIP = findIP();
    console.log(`devLocalIP `, devLocalIP);
    if (devLocalIP) {
        APP_HOSTS.push(devLocalIP);
    }
}

export function startApp({ server }: Options) {
    if (isDev) {
        const pem = readFileSync(
            resolve(`${homedir()}/.certs`, 'dev.pem'),
            'utf8'
        );

        console.log(`homeDir `, homedir);
        console.log(`pem `, pem);

        server.listen(PORT, () => {
            console.log(
                `SERVER STARTED `,
                APP_HOSTS.concat(...devHosts.map(({ host }) => host))
            );
        });
    }
}
