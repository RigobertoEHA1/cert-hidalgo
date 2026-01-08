import CertificateForm from '../../../../components/CertificateForm';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditCertificatePage({ params }: Props) {
    const { id } = await params;

    const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !certificate) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Certificado</h1>
            <CertificateForm initialData={certificate} />
        </div>
    );
}
