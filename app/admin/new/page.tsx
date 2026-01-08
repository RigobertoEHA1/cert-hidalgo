import CertificateForm from '../../../components/CertificateForm';

export default function NewCertificatePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Certificado</h1>
            <CertificateForm />
        </div>
    );
}
