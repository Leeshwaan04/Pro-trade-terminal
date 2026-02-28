import { test, expect } from '@playwright/test';

test.describe('ZenG Terminal E2E Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Point to the correct terminal route with test auth
        await page.goto('http://localhost:3000/terminal?testAuth=1');
    });

    test('initial terminal load and system integrity', async ({ page }) => {
        // Ensure no runtime error overlay
        const errorOverlay = page.locator('text=Error');
        await expect(errorOverlay).toHaveCount(0);

        // Verify footer sync integrity is visible and dynamic
        const footer = page.locator('footer');
        await expect(footer).toContainText('SYNC INTEGRITY');
        await expect(footer).not.toContainText('DEGRADED');
    });

    test('order entry panel live ltp binding', async ({ page }) => {
        // Open order panel (usually active by default or clickable)
        const orderPanel = page.locator('[data-testid="order-entry-panel"]');
        await expect(orderPanel).toBeVisible();

        // Check if LTP is rendered in the header
        const ltpDisplay = orderPanel.locator('span', { hasText: '.' }).first();
        await expect(ltpDisplay).toBeVisible();

        // Toggle to MKT and verify price field updates (should not be empty)
        await page.click('button:has-text("MKT")');
        const priceInput = page.locator('label:has-text("Price")').locator('xpath=..').locator('input');
        const priceValue = await priceInput.inputValue();
        expect(parseFloat(priceValue)).toBeGreaterThan(0);
    });

    test('header layout', async ({ page }) => {
        const header = page.locator('[data-testid="app-header"]');
        await expect(header).toBeVisible();
        // Height approx 52px
        const height = await header.evaluate(el => getComputedStyle(el).height);
        expect(parseFloat(height)).toBeCloseTo(52, 2);
        // Logo text is split for density
        await expect(header.getByText('ZenG', { exact: true })).toBeVisible();
        await expect(header.getByText('TRADE', { exact: true })).toBeVisible();
        // Flat underline tabs exist
        const tabsCount = await header.locator('.group').count();
        expect(tabsCount).toBeGreaterThan(0);
        // Ensure no pill style class
        const firstTab = header.locator('.group').first();
        await expect(firstTab).not.toHaveClass(/rounded-full/);
    });

    test('indices ticker', async ({ page }) => {
        const ticker = page.locator('[data-testid="indices-ticker"]');
        await expect(ticker).toBeVisible();
        // Index symbols exist (UI strips "NIFTY " for density, so "NIFTY 50" becomes "50")
        await expect(ticker.locator('text=50').first()).toBeVisible();
        await expect(ticker.locator('text=BANK').first()).toBeVisible();
        await expect(ticker.locator('text=SENSEX').first()).toBeVisible();
        // Hover
        await ticker.hover();
    });

    test('watchlist widget density', async ({ page }) => {
        const watchlist = page.locator('[data-testid="watchlist-widget"]');
        await expect(watchlist).toBeVisible();
        // Column headers - Instrument, LTP, Chg%
        await expect(watchlist).toContainText('Instrument');
        await expect(watchlist).toContainText('LTP');
        await expect(watchlist).toContainText('Chg%');

        // Compact rows: check row height via padding/gap if needed or just visual confirmation
        const firstRow = watchlist.locator('.group').first();
        await expect(firstRow).toBeVisible();

        // Hover shows buy/sell buttons (avoiding absolute resize handles)
        await firstRow.locator('span').first().hover();
        const buyBtn = watchlist.locator('button', { hasText: 'B' }).first();
        const sellBtn = watchlist.locator('button', { hasText: 'S' }).first();
        await expect(buyBtn).toBeVisible({ timeout: 3000 });
        await expect(sellBtn).toBeVisible({ timeout: 3000 });
    });
});
