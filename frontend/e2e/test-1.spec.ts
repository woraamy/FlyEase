import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  test.setTimeout(999999999);
  await page.goto('http://localhost:3001/');
  await page.getByRole('link', { name: 'Chat Bot' }).click();
  await page.getByRole('textbox', { name: 'Ask about your travel plans...' }).click();
  await page.getByRole('textbox', { name: 'Ask about your travel plans...' }).fill('What is weather in Bangkok ?');
  
  // Use either Enter key or the Send button, not both
  await page.getByRole('button', { name: 'Send message' }).click();
  
  // Wait for response to appear
  await page.waitForSelector('.chat-message, .response-message');
  
  // Verify that the page contains the sent message
  await expect(page.getByText('What is weather in Bangkok ?')).toBeVisible();
});