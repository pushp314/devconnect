import { getDocumentBySlug } from '@/app/actions/documents';
import { DocForm } from '@/components/forms/doc-form';
import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export default async function EditDocPage({ params }: { params: { slug: string } }) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    const doc = await getDocumentBySlug(params.slug);

    if (!doc) {
        notFound();
    }

    if (doc.authorId !== session.user.id) {
        redirect('/docs');
    }

    return (
        <div className="container max-w-4xl mx-auto py-8">
            <DocForm document={doc} />
        </div>
    )
}
