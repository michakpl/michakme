import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe } from 'vitest';
import Layout from '../layouts/Layout.astro';

describe('Layout', () => {
  test('renders the page title', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Page' },
      slots: { default: '<p>Content</p>' },
    });

    expect(result).toContain('<title>Test Page</title>');
  });

  test('uses default title when none provided', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      slots: { default: '<p>Content</p>' },
    });

    expect(result).toContain('<title>Minimalist personal page</title>');
  });

  test('hides header when isHome is true', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { isHome: true },
      slots: { default: '<p>Home content</p>' },
    });

    expect(result).not.toContain('<header');
  });

  test('shows header with navigation when isHome is false', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { isHome: false },
      slots: { default: '<p>Page content</p>' },
    });

    expect(result).toContain('<header');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('href="/about"');
  });

  test('sets blog nav link as active when activePath starts with /blog', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { activePath: '/blog' },
      slots: { default: '' },
    });

    expect(result).toMatch(/href="\/blog"[^>]*data-active="true"/);
    expect(result).toMatch(/href="\/about"[^>]*data-active="false"/);
  });

  test('sets about nav link as active when activePath is /about', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { activePath: '/about' },
      slots: { default: '' },
    });

    expect(result).toMatch(/href="\/about"[^>]*data-active="true"/);
    expect(result).toMatch(/href="\/blog"[^>]*data-active="false"/);
  });

  test('renders slot content', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test' },
      slots: { default: '<h1>Hello World</h1>' },
    });

    expect(result).toContain('<h1>Hello World</h1>');
  });

  test('renders footer with copyright', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      slots: { default: '' },
    });

    expect(result).toContain('Michak');
    expect(result).toContain(new Date().getFullYear().toString());
  });
});
