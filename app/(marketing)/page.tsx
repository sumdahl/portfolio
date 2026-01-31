import { Hero } from '@/components/home/Hero';

import { Contact } from '@/components/home/Contact';
import { getContributionCalendar } from '@/lib/github';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const contributionCalendar = await getContributionCalendar();

  return (
    <div className="min-h-screen">
      <Hero contributionCalendar={contributionCalendar} />
      <Contact />
    </div>
  );
}
