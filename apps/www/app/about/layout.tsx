import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Learn more about Richard Wang - tech enthusiast, perpetual learner, and collector of hobbies.',
  openGraph: {
    title: 'About Me - Richard Wang',
    description:
      'Learn more about Richard Wang - tech enthusiast, perpetual learner, and collector of hobbies.',
    type: 'profile',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

