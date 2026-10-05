import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';
import { LOGO_MARK } from '@/components/icon-logo';

const SITE_HOST = new URL(SITE.url).host;

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

// Renders a page's Open Graph image: its title and description on the
// site's dark grid. The routes that serve these images skip prerendering
// (see their generateStaticParams): only crawlers fetch them, and rendering
// at build time would put the font download, this module's only network
// call, on the critical path of every deployment.
export async function renderOgImage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return new ImageResponse(
    (
      <div tw="relative flex w-full h-full bg-[#0A0A0A]">
        <div tw="absolute left-15 top-0 bottom-0 w-0.5 h-full bg-[#171717]" />
        <div tw="absolute right-15 top-0 bottom-0 w-0.5 h-full bg-[#171717]" />
        <div tw="absolute bottom-15 left-0 right-0 w-full h-0.5 bg-[#171717]" />
        <div tw="absolute top-15 left-0 right-0 w-full h-0.5 bg-[#171717]" />

        <div tw="absolute top-15 left-[43.5px] w-[35px] h-0.5 bg-[#404040]" />
        <div tw="absolute left-15 top-[43.5px] h-[35px] w-0.5 bg-[#404040]" />

        <div tw="absolute bottom-15 left-[43.5px] w-[35px] h-0.5 bg-[#404040]" />
        <div tw="absolute left-15 bottom-[43.5px] h-[35px] w-0.5 bg-[#404040]" />

        <div tw="absolute top-15 right-[43.5px] w-[35px] h-0.5 bg-[#404040]" />
        <div tw="absolute right-15 top-[43.5px] h-[35px] w-0.5 bg-[#404040]" />

        <div tw="absolute bottom-15 right-[43.5px] w-[35px] h-0.5 bg-[#404040]" />
        <div tw="absolute right-15 bottom-[43.5px] h-[35px] w-0.5 bg-[#404040]" />

        <div tw="flex flex-col w-full h-full items-start justify-between p-26">
          <div tw="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              viewBox={LOGO_MARK.viewBox}
              height="45"
            >
              <path d={LOGO_MARK.path} />
            </svg>
            <p
              tw="text-white text-4xl font-medium ml-5 my-0"
              style={{ fontFamily: 'Outfit' }}
            >
              {SITE.name}
            </p>
          </div>

          <div tw="relative flex w-full items-end">
            <div tw="flex min-w-0 flex-col">
              <p
                tw="text-white text-6xl font-medium mb-0"
                style={{ fontFamily: 'Outfit' }}
              >
                {title}
              </p>
              {description && (
                <p
                  tw="text-white/60 text-2xl mt-6 -mb-2 max-w-2xl"
                  style={{ fontFamily: 'Outfit' }}
                >
                  {description}
                </p>
              )}
            </div>

            <div tw="flex ml-6 flex-shrink-0 absolute right-0 bottom-0">
              <p
                tw="text-white/80 text-2xl -mb-2"
                style={{ fontFamily: 'Outfit' }}
              >
                {SITE_HOST}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      fonts: [
        {
          name: 'Outfit',
          data: await loadGoogleFont(
            'Outfit',
            `${description} ${title} ${SITE.name} ${SITE_HOST}`,
          ),
          style: 'normal',
        },
      ],
    },
  );
}
