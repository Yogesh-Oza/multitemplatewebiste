import { FeedbackPageClient } from './FeedbackPageClient';

export default async function FeedbackPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  
  return <FeedbackPageClient subdomain={subdomain} />;
}
