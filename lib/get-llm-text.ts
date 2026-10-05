import type { Page } from '@/lib/source';

export async function getLLMText(page: Page) {
  return `# ${page.data.title}
URL: ${page.url}

${await page.data.getText('raw')}`;
}
