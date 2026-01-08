'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Plus, Trash2, Edit, Copy, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import QRModal from '../../components/QRModal';

interface Certificate {
    id: string;
    key: string;
    nombre_alumno: string;
    ciclo_escolar: string;
}

export default function AdminDashboard() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertQR, setSelectedCertQR] = useState<{ link: string; title: string } | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        if (data) setCertificates(data);
        setLoading(false);
    };

    const deleteCertificate = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este certificado?')) return;
        await supabase.from('certificates').delete().eq('id', id);
        fetchCertificates();
    };

    const getLink = (cert: Certificate) => {
        // "2023-2024" -> "23" + "24" -> "QR2324"
        const years = cert.ciclo_escolar.split('-');
        if (years.length === 2) {
            const prefix = `QR${years[0].slice(-2)}${years[1].slice(-2)}`;
            return `https://normales-seph-gob-mx.vercel.app/${prefix}/index.php?key=${cert.key}`;
        }
        return `https://normales-seph-gob-mx.vercel.app/QR2324/index.php?key=${cert.key}`; // Fallback
    };

    const copyLink = (cert: Certificate) => {
        const url = getLink(cert);
        navigator.clipboard.writeText(url);
        alert('Link copiado al portapapeles');
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Certificados</h1>
                <Link href="/admin/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={20} />
                    Nuevo Certificado
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {certificates.map((cert) => (
                        <li key={cert.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{cert.nombre_alumno}</p>
                                <p className="text-sm text-gray-500">{cert.ciclo_escolar}</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">Key: {cert.key}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => copyLink(cert)} className="text-gray-400 hover:text-gray-600" title="Copiar Link">
                                    <Copy size={20} />
                                </button>
                                <button
                                    onClick={() => setSelectedCertQR({ link: getLink(cert), title: cert.nombre_alumno })}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Ver QR"
                                >
                                    <QrCode size={20} />
                                </button>
                                <Link href={`/admin/edit/${cert.id}`} className="text-indigo-400 hover:text-indigo-600" title="Editar">
                                    <Edit size={20} />
                                </Link>
                                <button onClick={() => deleteCertificate(cert.id)} className="text-red-400 hover:text-red-600" title="Eliminar">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                    {certificates.length === 0 && (
                        <li className="px-6 py-10 text-center text-gray-500">No hay certificados registrados.</li>
                    )}
                </ul>
            </div>

            <QRModal
                isOpen={!!selectedCertQR}
                onClose={() => setSelectedCertQR(null)}
                value={selectedCertQR?.link || ''}
                title={selectedCertQR?.title || ''}
            />
        </div>
    );
}
