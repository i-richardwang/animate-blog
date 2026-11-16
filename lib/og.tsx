import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { SITE } from '@/lib/site';
import { LOGO_PATH, LOGO_VIEW_BOX } from '@/components/logo-paths';

// The site's Open Graph images. Each is a sheet of the site's paper in its
// ink, the top-right corner folded as on the site's mark, with titles in a
// serif like the logo's and the rest in Outfit, the site's own font, beside a
// Chinese sans for what Outfit lacks.
//
// The routes that serve these images skip prerendering (see their
// generateStaticParams): only crawlers fetch them, and rendering at build time
// would put the font downloads, this module's only network calls, on the
// critical path of every deployment.

const SITE_HOST = new URL(SITE.url).host;

// The light theme's colours (see app/globals.css).
const BACKGROUND = '#fcf9f0';
const FOREGROUND = '#2b3328';
const MUTED_FOREGROUND = '#515b4e';
const PRIMARY = '#526b2d';
const CARD = '#f0edde';
const BORDER = '#e0dccc';

const SERIF = 'Noto Serif SC';
const SANS = 'Outfit';
const CHINESE_SANS = 'Noto Sans SC';

// Loads the glyphs of `text` from a Google font, with the ellipsis that a text
// cut short ends in.
async function loadGoogleFont(name: string, weight: 400 | 700, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@${weight}&text=${encodeURIComponent(`${text}…`)}`;
  const css = await (await fetch(url)).text();
  const file = css.match(/src: url\((.+)\) format\('(?:opentype|truetype)'\)/);
  const response = file && (await fetch(file[1]));
  if (!response?.ok) throw new Error(`failed to load the font ${name}`);

  return {
    name,
    weight,
    style: 'normal' as const,
    data: await response.arrayBuffer(),
  };
}

// Cuts a text short after so many lines. Only a block's lines are counted.
const clamp = (lines: number) =>
  ({ display: 'block', lineClamp: lines }) as const;

function Logo({ width }: { width: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={FOREGROUND}
      viewBox={LOGO_VIEW_BOX}
      width={width}
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}

// The sheet every image is set on. Its folded corner is drawn as what shows
// behind the sheet, and over that the corner itself.
function Sheet({ tw, children }: { tw: string; children: ReactNode }) {
  return (
    <div
      tw={`relative flex w-full h-full ${tw}`}
      style={{
        backgroundColor: BACKGROUND,
        fontFamily: `${SANS}, ${CHINESE_SANS}`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="132"
        height="132"
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <path d="M0 0H100V100Z" fill={BORDER} />
        <path d="M0 0L100 100H16A16 16 0 0 1 0 84Z" fill={CARD} />
      </svg>

      {children}
    </div>
  );
}

// Renders a page's Open Graph image: its title and description.
export async function renderOgImage({
  title,
  description = '',
}: {
  title: string;
  description?: string;
}) {
  const text = `${description} ${SITE_HOST}`;
  const fonts = await Promise.all([
    loadGoogleFont(SERIF, 700, title),
    loadGoogleFont(SANS, 400, text),
    loadGoogleFont(CHINESE_SANS, 400, text),
  ]);

  return new ImageResponse(
    (
      <Sheet tw="flex-col justify-between px-18 py-16">
        <Logo width={300} />

        <div tw="flex flex-col">
          <div
            tw="w-14 h-1.5 rounded-full mb-7"
            style={{ backgroundColor: PRIMARY }}
          />
          <p
            tw="m-0"
            style={{
              fontFamily: SERIF,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.25,
              color: FOREGROUND,
              ...clamp(2),
            }}
          >
            {title}
          </p>
          {description && (
            <p
              tw="m-0 mt-5"
              style={{
                fontSize: 26,
                lineHeight: 1.6,
                maxWidth: 860,
                color: MUTED_FOREGROUND,
                ...clamp(3),
              }}
            >
              {description}
            </p>
          )}
          <p
            tw="m-0 mt-10 pt-5 text-2xl"
            style={{ borderTop: `2px solid ${BORDER}`, color: PRIMARY }}
          >
            {SITE_HOST}
          </p>
        </div>
      </Sheet>
    ),
    { fonts },
  );
}

// Renders the site's own Open Graph image, for the pages that have none of
// their own: the logo and the site's motto.
export async function renderSiteOgImage() {
  const fonts = await Promise.all([
    loadGoogleFont(SERIF, 400, SITE.motto),
    loadGoogleFont(SANS, 400, SITE_HOST),
  ]);

  return new ImageResponse(
    (
      <Sheet tw="flex-col items-center justify-center">
        <Logo width={780} />
        <p
          tw="m-0 mt-11"
          style={{
            fontFamily: SERIF,
            fontSize: 36,
            letterSpacing: 6,
            color: MUTED_FOREGROUND,
          }}
        >
          {SITE.motto}
        </p>
        <p tw="absolute bottom-14 m-0 text-2xl" style={{ color: PRIMARY }}>
          {SITE_HOST}
        </p>
      </Sheet>
    ),
    { fonts },
  );
}
