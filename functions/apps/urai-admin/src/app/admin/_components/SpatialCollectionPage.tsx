import { SpatialAdminFrame, SpatialSection } from '@/components/SpatialAdminFrame';
import { AdminCollectionTable, type AdminColumn, type CollectionKey } from './AdminCollectionTable';

type SpatialCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  signalValue: string;
  collection: CollectionKey;
  columns: AdminColumn[];
  emptyLabel: string;
};

export function SpatialCollectionPage({
  eyebrow,
  title,
  description,
  signalValue,
  collection,
  columns,
  emptyLabel,
}: SpatialCollectionPageProps) {
  return (
    <SpatialAdminFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      signals={[
        { label: 'Source', value: collection },
        { label: 'Mode', value: 'Live API' },
        { label: 'Surface', value: signalValue },
      ]}
    >
      <SpatialSection title="Live records" description="Authenticated runtime records with production-safe loading, empty, and error states.">
        <AdminCollectionTable collection={collection} emptyLabel={emptyLabel} columns={columns} />
      </SpatialSection>
    </SpatialAdminFrame>
  );
}
