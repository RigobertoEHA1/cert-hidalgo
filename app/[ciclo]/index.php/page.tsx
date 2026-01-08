import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';



interface PageProps {
    searchParams: Promise<{ key?: string }>;
}

export default async function CertificatePage({ searchParams }: PageProps) {
    const { key } = await searchParams;

    if (!key) {
        notFound();
    }

    const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('key', key)
        .single();

    if (error || !certificate) {
        notFound();
    }

    return (
        <>
            <div className="pace pace-inactive">
                <div className="pace-progress" data-progress-text="100%" data-progress="99" style={{ transform: 'translate3d(100%, 0px, 0px)' }}>
                    <div className="pace-progress-inner"></div>
                </div>
                <div className="pace-activity"></div>
            </div>

            <header>
                <div className="header-content">Certificados Y Certificaciones para Escuelas Normales</div>
                <div className="logo">
                    {/* Using standard img tag to match original behavior closely, but optimization is good. 
                          However, for "exact" cloning, basic img might be safer to avoid Next.js wrapper divs if styles depend on it.
                          Let's use Next Image for optimization but ensure classes match.
                      */}
                    <img src="/assets/logo.png" alt="Logo SEPH" />
                </div>
            </header>

            <main className="content-container">
                <section className="consulta-becas" style={{ textAlign: 'left' }}>
                    <div className="subtitulos">DATOS DEL CERTIFICADO O CERTIFICACIÓN</div>
                    {/* @ts-ignore */}
                    <p align="justify" style={{ marginBottom: '-10px', marginTop: '-15px' }}>
                        Ciclo Escolar: <strong>{certificate.ciclo_escolar}</strong><br />
                        Nombre del Alumno(a): <strong>{certificate.nombre_alumno}</strong><br />
                        CURP del Alumno(a): <strong>{certificate.curp}</strong><br />
                        Licenciatura Cursada: <strong>{certificate.licenciatura}</strong><br />
                        Plan de Estudios: <strong>{certificate.plan_estudios}</strong><br />
                        CCT: <strong>{certificate.cct}</strong><br />
                        Promedio: <strong>{certificate.promedio}</strong><br />
                        Folio: <strong>{certificate.folio}</strong><br />
                        Folio Digital: <strong>{certificate.folio_digital}</strong><br />
                    </p>


                </section>
            </main>

            <footer>
                <p className="datos-footer"></p>
                Secretaría de Educación Pública de Hidalgo © 2025{' '}
                <a href="https://sep.hidalgo.gob.mx" target="_blank">
                    <span style={{ color: '#BC955B' }}>PORTAL INSTITUCIONAL</span>
                </a>
            </footer>
        </>
    );
}
