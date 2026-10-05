import { projects } from '@/lib/source';
import { renderOgImage } from '@/lib/og';
import { notFound } from 'next/navigation';

// Generated on first request, then cached.
export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = projects.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return renderOgImage(page.data);
}

export function generateStaticParams(): { slug: string[] }[] {
  return [];
}
