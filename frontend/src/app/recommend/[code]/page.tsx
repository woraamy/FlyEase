import AirportFlightsClient from '@/components/AirportFlightsClient';

// interface RecommendPageProps {
//   params: {
//     code: string;
//   };
// }

export default async function RecommendPage({ params } : { params : Promise<{code: string}>}) {
  const { code } = await params;
  return <AirportFlightsClient code={code} />;
}