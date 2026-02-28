import { test, expect } from '@playwright/test';

test('verify light mode integration', async ({ page }) => {
    test.setTimeout(30000);

    console.log("Navigating to Terminal...");
    await page.goto('http://localhost:3000/terminal?mock=true', { waitUntil: 'domcontentloaded' });

    // Wait for a few seconds for data to load and chart to render
    await page.waitForTimeout(3000);

    // Take a screenshot of the original Dark Mode
    await page.screenshot({ path: '/Users/sumitbagewadi/.gemini/antigravity/brain/5de15f42-336d-473a-af30-fbb988b76d9b/light_mode_test_dark_before.png', fullPage: true });
    console.log("Captured Dark Mode Screenshot.");

    // Find the theme toggle button (Dropdown triggering the ThemeSelector)
    console.log("Looking for Theme Toggle...");
    const themeToggle = page.locator('button').filter({ hasText: 'THEME' }).first();

    // Wait for it to be visible and click it
    await themeToggle.waitFor({ state: 'visible', timeout: 5000 });
    await themeToggle.click();

    // Click on Light Mode / Corporate Slate option
    await page.locator('text=Corporate Slate').waitFor({ state: 'visible', timeout: 5000 });
    await page.locator('text=Corporate Slate').click();

    // Wait a few seconds for transitions to finish and CSS to settle
    await page.waitForTimeout(2000);

    // Take a screenshot of the Light Mode
    await page.screenshot({ path: '/Users/sumitbagewadi/.gemini/antigravity/brain/5de15f42-336d-473a-af30-fbb988b76d9b/light_mode_test_light_after.png', fullPage: true });
    console.log("Captured Light Mode Screenshot.");
});
