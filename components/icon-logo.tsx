import { LOGO_MARK_PATH, LOGO_MARK_VIEW_BOX } from './logo-mark';

// The site's mark on its own.
export const IconLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={LOGO_MARK_VIEW_BOX}
      fill="currentColor"
      className="size-7"
    >
      <path d={LOGO_MARK_PATH} />
    </svg>
  );
};
