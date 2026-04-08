import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle("Michak's");
  });

  test('shows site heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText("Michak's");
  });

  test('has links to blog and about', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'blog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'about' })).toBeVisible();
  });

  test('does not show header nav on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).not.toBeVisible();
  });

  test('navigates to blog on link click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'blog' }).click();
    await expect(page).toHaveURL('/blog');
  });
});

test.describe('Blog index page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle("Blog — Michak's");
  });

  test('shows Blog heading', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('header')).toBeVisible();
  });

  test('blog nav link is active', async ({ page }) => {
    await page.goto('/blog');
    const blogLink = page.locator('header a[href="/blog"]');
    await expect(blogLink).toHaveAttribute('data-active', 'true');
  });

  test('shows at least one blog post', async ({ page }) => {
    await page.goto('/blog');
    const postLinks = page.locator('ul li a');
    await expect(postLinks).toHaveCount(1);
    // Each post has a title and a date
    const firstPost = postLinks.first();
    await expect(firstPost).toBeVisible();
  });

  test('blog post links navigate correctly', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('ul li a').first();
    const href = await firstPostLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);
    await firstPostLink.click();
    await expect(page).toHaveURL(href!);
  });
});

test.describe('Blog post page', () => {
  test('shows post title in page title', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('ul li a').first();
    const postTitle = await firstPostLink.locator('.post-title').textContent();
    await firstPostLink.click();

    const pageTitle = await page.title();
    expect(pageTitle).toContain("Michak's");
    expect(pageTitle).toContain(postTitle?.trim());
  });

  test('has back link to blog', async ({ page }) => {
    await page.goto('/blog');
    await page.locator('ul li a').first().click();

    const backLink = page.getByRole('link', { name: /blog/i }).first();
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/blog');
  });

  test('shows post heading and date', async ({ page }) => {
    await page.goto('/blog');
    await page.locator('ul li a').first().click();

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('time')).toBeVisible();
  });
});

test.describe('About page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Michak/);
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('header')).toBeVisible();
  });

  test('about nav link is active', async ({ page }) => {
    await page.goto('/about');
    const aboutLink = page.locator('header a[href="/about"]');
    await expect(aboutLink).toHaveAttribute('data-active', 'true');
  });
});
