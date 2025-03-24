import AirportFlightsClient from '@/components/AirportFlightsClient';

interface RecommendPageProps {
  params: {
    code: string;
  };
}

export default function RecommendPage({ params }: RecommendPageProps) {
  return <AirportFlightsClient code={params.code} />;
}