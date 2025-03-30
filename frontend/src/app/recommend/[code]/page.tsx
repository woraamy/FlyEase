import AirportFlightsClient from '@/components/AirportFlightsClient';

interface RecommendPageProps {
  params: {
    code: string;
  };
}

export default async function RecommendPage({ params }: RecommendPageProps) {
  const { code } = await params;
  return <AirportFlightsClient code={code} />;
}