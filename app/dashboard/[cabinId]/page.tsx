import CabinDetails from '../components/CabinDetails';

export default function CabinPage({ params }: { params: { cabinId: string } }) {
  return <CabinDetails cabinId={params.cabinId} />;
}