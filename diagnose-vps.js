import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
    try {
        return execSync(cmd).toString();
    } catch (e) {
        return `Error: ${e.message}`;
    }
}

console.log('--- VPS Deep Diagnosis ---');

console.log('\n1. PM2 Status:');
console.log(run('pm2 status'));

console.log('\n2. Looking for jandr.sqlite:');
console.log(run('find /root -name "jandr.sqlite"'));

console.log('\n3. Directory Structure of /root/jandr:');
console.log(run('ls -F /root/jandr'));

console.log('\n4. Directory Structure of /root/apps (if exists):');
console.log(run('ls -F /root/apps 2>/dev/null || echo "Not found"'));

console.log('\n5. Checking for globals.css:');
console.log(run('find /root/jandr -name "globals.css"'));
console.log(run('find /root/apps -name "globals.css" 2>/dev/null'));

console.log('\n6. Checking process working directory:');
console.log(run('pwdx $(pgrep node) 2>/dev/null || echo "Could not get PWD of node processes"'));
