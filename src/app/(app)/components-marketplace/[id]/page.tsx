export default function ComponentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Component Detail: {params.id}</h1>
    </div>
  );
}
