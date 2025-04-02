import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    test.setTimeout(1200000);
    await page.goto('http://localhost:3001/');
    await page.getByRole('link', { name: 'Chat Bot' }).click();
    const inputSelector = 'input[placeholder="Ask about your travel plans..."]';
    await page.waitForSelector(inputSelector);
    await page.evaluate(() => {
        const input = document.querySelector('input[placeholder="Ask about your travel plans..."]') as HTMLInputElement;
        if (input) {
            input.removeAttribute('disabled');
            input.value = "What are some good travel destinations?";
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    // await page.getByRole('button', { name: 'Send message' }).click();
    await page.evaluate(() => {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.removeAttribute('disabled');
            const form = button.closest('form');
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
        }
    });

    await page.waitForSelector('div:has-text("Assistant")');
});


