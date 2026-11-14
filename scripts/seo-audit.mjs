#!/usr/bin/env node
// SEO smoke test against a deployed site: status, redirects, canonical, <h1>, robots meta,
// and that no region popup or "get the app" screen covers the content.
//
//   npm run audit:seo                          # https://ccreward.app, default URL list
//   npm run audit:seo -- --base https://dev.ccreward.app
//   npm run audit:seo -- --sitemap 20          # plus 20 random URLs from the live sitemap.xml
//   npm run audit:seo -- /faq /in/top-cards    # only these paths
//   npm run audit:seo -- --json report.json    # also write the results as JSON
//   npm run audit:seo -- --width 1000 /        # viewport width (default 1300)
//
// Cloudflare blocks headless Chrome, so this drives the installed Google Chrome headed
// (a window opens), with a fresh context per URL and the automation flag turned off.
// Exits 1 if any check fails.

import fs from 'node:fs';
import { chromium } from 'playwright-core';

const CANONICAL_ORIGIN = 'https://ccreward.app';

// [path, expected final status, expected redirect target (path) or null]
const DEFAULT_CHECKS = [
    ['/', 200],
    ['/faq', 200],
    ['/in', 200],
    ['/sg', 200],
    ['/in/top-cards', 200],
    ['/in/top-cards/online-shopping', 200],
    ['/in/bank/amex', 200],
    ['/in/bank/amex/platinum-reserve', 200],
    ['/sg/top-cards', 200],
    ['/tools', 200],
    ['/tools/mcc-code-lookup', 200],
    // Legacy URL formats must 301 to the clean slug
    ['/in/bank/AMEX/Platinum%20Reserve', 200, '/in/bank/amex/platinum-reserve'],
    ['/in/top-cards/Online%20Shopping', 200, '/in/top-cards/online-shopping'],
    // ":hash" suffixes, SG cards under /in/, and renamed cards also redirect (worker/index.ts)
    ['/in/bank/sbi/pulse:28ukd2', 200, '/in/bank/sbi/pulse'],
    ['/in/bank/dcs/ultimate', 200, '/sg/bank/dcs/ultimate'],
    ['/sg/bank/sc/simply-cash', 200, '/sg/bank/sc/simplycash'],
    ['/mcp', 200],
    // Unknown pages must be real 404s, not soft 404s
    ['/in/bank/amex/this-card-does-not-exist', 404],
    ['/this-page-does-not-exist', 404],
];

function parseArgs(argv) {
    const opts = { base: 'https://ccreward.app', sitemap: 0, json: null, width: 1300, paths: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--base') opts.base = argv[++i].replace(/\/$/, '');
        else if (a === '--sitemap') opts.sitemap = Number(argv[++i]) || 0;
        else if (a === '--json') opts.json = argv[++i];
        else if (a === '--width') opts.width = Number(argv[++i]) || 1300;
        else if (a === '--help' || a === '-h') {
            console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 14).join('\n'));
            process.exit(0);
        } else opts.paths.push(a);
    }
    return opts;
}

async function sitemapSample(base, n) {
    const res = await fetch(`${base}/sitemap.xml`, { headers: { 'user-agent': 'ccreward-seo-audit' } });
    if (!res.ok) {
        console.warn(`⚠️  sitemap.xml returned ${res.status}; skipping the sample`);
        return [];
    }
    const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    for (let i = urls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [urls[i], urls[j]] = [urls[j], urls[i]];
    }
    return urls.slice(0, n).map((p) => [p, 200]);
}

async function auditUrl(browser, { base, width }, [path, expectedStatus, expectedTarget = null]) {
    // A fresh context per URL: no region cookie/localStorage carried over, like a crawler
    const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'en-US' });
    const page = await context.newPage();
    const url = `${base}${path}`;
    const result = { path, failures: [] };
    const fail = (msg) => result.failures.push(msg);

    try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        // Let hydration and any region popup happen
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

        // Redirect chain, oldest first
        const chain = [];
        for (let req = response?.request().redirectedFrom(); req; req = req.redirectedFrom()) {
            const r = await req.response();
            chain.unshift({ from: new URL(req.url()).pathname, status: r?.status() });
        }
        result.redirects = chain;
        result.status = response?.status() ?? null;
        result.finalPath = new URL(page.url()).pathname;

        if (result.status !== expectedStatus) fail(`status ${result.status}, expected ${expectedStatus}`);
        if (expectedTarget) {
            if (!chain.length) fail(`no redirect, expected 301 to ${expectedTarget}`);
            else if (chain.some((c) => c.status !== 301)) fail(`redirect statuses ${chain.map((c) => c.status).join('→')}, expected 301`);
            if (result.finalPath !== expectedTarget) fail(`ended at ${result.finalPath}, expected ${expectedTarget}`);
        } else if (chain.length) {
            fail(`unexpected redirect ${chain.map((c) => `${c.from} (${c.status})`).join(' → ')} → ${result.finalPath}`);
        }

        const info = await page.evaluate(() => {
            const visible = (el) => {
                const r = el.getBoundingClientRect();
                const s = getComputedStyle(el);
                return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
            };
            const h1s = [...document.querySelectorAll('h1')];
            const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(visible);
            return {
                title: document.title,
                canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
                robots: document.querySelector('meta[name="robots"]')?.content ?? null,
                h1: h1s.map((h) => ({ text: h.textContent.trim().slice(0, 80), visible: visible(h) })),
                regionPopup: dialogs.some((d) => /select your region/i.test(d.textContent)),
                appScreen: h1s.some((h) => visible(h) && /get the ccreward app/i.test(h.textContent)),
            };
        });
        Object.assign(result, info);

        if (expectedStatus === 200) {
            // Canonicals always point at production, also on dev
            const expectedCanonical = `${CANONICAL_ORIGIN}${result.finalPath}`.replace(/\/$/, '');
            const canonical = info.canonical?.replace(/\/$/, '');
            if (!canonical) fail('no canonical');
            else if (canonical !== expectedCanonical) fail(`canonical ${info.canonical}, expected ${expectedCanonical}`);
            const visibleH1 = info.h1.filter((h) => h.visible);
            if (info.h1.length !== 1) fail(`${info.h1.length} <h1> (${visibleH1.length} visible)`);
            else if (!visibleH1.length) fail('<h1> not visible');
            if (info.robots && /noindex/i.test(info.robots) && !/dev\./.test(base)) fail(`robots meta "${info.robots}"`);
            if (!info.title) fail('empty <title>');
        }
        if (info.regionPopup) fail('region popup shown');
        if (info.appScreen) fail('"Get the ccreward App" screen shown');
    } catch (err) {
        fail(`error: ${err.message.split('\n')[0]}`);
    } finally {
        await context.close();
    }
    return result;
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    let checks = opts.paths.length ? opts.paths.map((p) => [p.startsWith('/') ? p : `/${p}`, 200]) : DEFAULT_CHECKS;
    if (opts.sitemap) checks = [...checks, ...(await sitemapSample(opts.base, opts.sitemap))];

    const browser = await chromium.launch({
        channel: 'chrome',
        headless: false,
        args: ['--disable-blink-features=AutomationControlled'],
    });

    console.log(`SEO audit of ${opts.base} at ${opts.width}px (${checks.length} URLs)\n`);
    const results = [];
    try {
        for (const check of checks) {
            const r = await auditUrl(browser, opts, check);
            results.push(r);
            const mark = r.failures.length ? '✗' : '✓';
            const redirect = r.redirects?.length ? ` → ${r.finalPath}` : '';
            console.log(`${mark} ${r.status ?? '---'} ${r.path}${redirect}`);
            for (const f of r.failures) console.log(`    ${f}`);
        }
    } finally {
        await browser.close();
    }

    const failed = results.filter((r) => r.failures.length);
    console.log(`\n${results.length - failed.length}/${results.length} passed`);
    if (opts.json) {
        fs.writeFileSync(opts.json, JSON.stringify({ base: opts.base, at: new Date().toISOString(), results }, null, 2));
        console.log(`Wrote ${opts.json}`);
    }
    process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
