const puppeteer = require('puppeteer');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
        page.on('requestfailed', request => console.error('BROWSER NETWORK ERROR:', request.url(), request.failure() ? request.failure().errorText : ''));
        page.on('dialog', async dialog => {
            console.log('BROWSER ALERT:', dialog.message());
            await dialog.dismiss();
        });

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

        // Wait for substance load
        await new Promise(r => setTimeout(r, 1000));

        // Select first substance
        await page.select('#substance', '69a80b57bb7daaf18ac8b90a');

        // Click submit
        await page.evaluate(() => document.getElementById('simulateBtn').click());

        // Wait a bit for async operations
        await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
        console.error('PUPPETEER ERROR:', e);
    } finally {
        if (browser) await browser.close();
    }
})();
