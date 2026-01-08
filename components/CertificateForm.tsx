'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Props {
    initialData?: any;
}

export default function CertificateForm({ initialData }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        key: '',
        ciclo_escolar: '',
        nombre_alumno: '',
        curp: '',
        licenciatura: '',
        plan_estudios: '',
        cct: '',
        promedio: '',
        folio: '',
        folio_digital: '',
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const generateKeyFromFolio = (folioDig: string) => {
        // Remove dashes and ensure alphanumeric
        return folioDig.replace(/[^a-zA-Z0-9]/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-generate key when Folio Digital changes
            if (name === 'folio_digital') {
                newData.key = generateKeyFromFolio(value);
            }
            return newData;
        });
    };

    const checkDuplicate = async (key: string, currentId?: string) => {
        let query = supabase.from('certificates').select('id').eq('key', key);

        if (currentId) {
            query = query.neq('id', currentId);
        }

        const { data } = await query;
        return data && data.length > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSave = { ...formData };

            // Ensure key exists
            if (!dataToSave.key) {
                if (dataToSave.folio_digital) {
                    dataToSave.key = generateKeyFromFolio(dataToSave.folio_digital);
                } else {
                    // Fallback literal random if absolutely no info provided (unlikely with required fields)
                    dataToSave.key = Math.random().toString(36).substring(2, 15);
                }
            }

            // Check for duplicate key
            const isDuplicate = await checkDuplicate(dataToSave.key, initialData?.id);
            if (isDuplicate) {
                throw new Error(`Ya existe un certificado con la llave/folio digital: ${dataToSave.key}`);
            }

            let resultError;
            if (initialData?.id) {
                const { error } = await supabase.from('certificates').update(dataToSave).eq('id', initialData.id);
                resultError = error;
            } else {
                const { error } = await supabase.from('certificates').insert([dataToSave]);
                resultError = error;
            }

            if (resultError) throw resultError;

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-md p-6 space-y-4">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ciclo Escolar</label>
                    <input
                        name="ciclo_escolar"
                        value={formData.ciclo_escolar}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="2023-2024"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Promedio</label>
                    <input
                        name="promedio"
                        value={formData.promedio}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="7.80"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Alumno</label>
                <input
                    name="nombre_alumno"
                    value={formData.nombre_alumno}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="MELENDEZ CUEVAS EDGAR ULISES"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">CURP</label>
                <input
                    name="curp"
                    value={formData.curp}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="MECE990723HHGLVD04"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Licenciatura</label>
                <input
                    name="licenciatura"
                    value={formData.licenciatura}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="LICENCIATURA EN ENSEÑANZA Y APRENDIZAJE DE LA HISTORIA EN EDUCACIÓN SECUNDARIA"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Plan de Estudios</label>
                    <input
                        name="plan_estudios"
                        value={formData.plan_estudios}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="2018"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">CCT</label>
                    <input
                        name="cct"
                        value={formData.cct}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="ESCUELA NORMAL SUPERIOR PÚBLICA DEL ESTADO DE HIDALGO - 13DNL0006C"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Folio</label>
                    <input
                        name="folio"
                        value={formData.folio}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="CE132400575"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Folio Digital</label>
                    <input
                        name="folio_digital"
                        value={formData.folio_digital}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="1eef24a1-7af2-4519-9078-69b47ab2c5c3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">La llave se generará automáticamente a partir de este folio.</p>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => router.back()} disabled={loading} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50">
                    Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
