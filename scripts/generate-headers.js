/**
 * Writes the shared security headers (security-headers.mjs) into the generated
 * block of public/_headers so static assets get the same policy as pages.
 * Everything outside the BEGIN/END markers is left as written.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityHeaders } from '../security-headers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HEADERS_PATH = path.join(__dirname, '..', 'public', '_headers');

const BEGIN = '# BEGIN generated security headers (npm run generate:headers; edit security-headers.mjs)';
const END = '# END generated security headers';

const block = [
    BEGIN,
    '/*',
    ...securityHeaders.map(({ key, value }) => `  ${key}: ${value}`),
    END,
].join('\n');

const current = fs.readFileSync(HEADERS_PATH, 'utf8');
const start = current.indexOf(BEGIN);
const end = current.indexOf(END);

if (start === -1 || end === -1 || end < start) {
    console.error(`public/_headers is missing the "${BEGIN}" / "${END}" markers`);
    process.exit(1);
}

const next = current.slice(0, start) + block + current.slice(end + END.length);
if (next !== current) {
    fs.writeFileSync(HEADERS_PATH, next);
    console.log('Updated security headers in public/_headers');
} else {
    console.log('public/_headers security headers already up to date');
}
