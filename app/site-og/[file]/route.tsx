import { renderSiteOgImage } from '@/lib/og';
import { notFound } from 'next/navigation';

// Generated on first request, then cached. The image's file name is a route
// parameter only so that, like the pages' images, it is not rendered at build
// time (see lib/og.tsx).
export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/site-og/[file]'>,
) {
  const { file } = await params;
  if (file !== 'image.png') notFound();

  return renderSiteOgImage();
}

export function generateStaticParams(): { file: string }[] {
  return [];
}
