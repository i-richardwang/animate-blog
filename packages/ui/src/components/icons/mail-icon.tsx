export default function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Email"
      {...props}
    >
      <path
        d="M4 4h16s2 0 2 2v12s0 2 -2 2H4s-2 0 -2 -2V6s0 -2 2 -2"
        strokeWidth="2"
      />
      <path d="m22 7 -8.97 5.7a1.94 1.94 0 0 1 -2.06 0L2 7" strokeWidth="2" />
    </svg>
  );
}
