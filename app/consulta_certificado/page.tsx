"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type CertificadoData = {
  ciclo_escolar: string;
  nombre_alumno: string;
  curp: string;
  licenciatura: string;
  plan_estudios: string;
  cct: string;
  promedio: string;
  folio: string;
  folio_digital: string;
};

export default function ConsultaCertificado() {
  const [ciclo, setCiclo] = useState("");
  const [folio, setFolio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CertificadoData | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndIncrementCounter = async () => {
      try {
        const { data, error } = await supabase.rpc('increment_visitor_counter');
        if (error) {
          console.error('Error fetching visitor counter:', error);
          return;
        }
        if (data !== null) {
          setVisitorCount(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching counter:', err);
      }
    };

    fetchAndIncrementCounter();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!ciclo || !folio) {
      setError("Por favor completa ambos campos.");
      return;
    }

    setLoading(true);

    try {
      // The user indicated the folio in the DB does not have hyphens
      const folioForDb = folio.replace(/-/g, '');

      // The subagent found the table is named 'certificates'
      const { data, error: sbError } = await supabase
        .from('certificates')
        .select('*')
        .eq('key', folioForDb)
        .eq('ciclo_escolar', ciclo)
        .single();
        
      if (sbError) {
        if (sbError.code === 'PGRST116') {
           setError("No se encontró ningún certificado con esos datos.");
        } else {
           console.error("Supabase Error:", sbError);
           setError("Error al consultar la base de datos.");
        }
      } else if (data) {
        setResult(data as CertificadoData);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFolio("");
    setCiclo("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans flex flex-col justify-between items-center w-full">
      {/* Header */}
      <header className="w-full bg-[#691B32] px-[10px] md:px-[8px] flex items-center justify-between transition-all duration-300">
        <div className="hidden md:block text-white font-bold text-[30px] leading-tight ml-2">
          <h2 className="m-0 font-bold">Certificados para Escuelas Normales</h2>
        </div>
        <div className="flex md:hidden text-white font-bold text-[14px] leading-tight ml-1 w-1/2">
          <h2 className="m-0 font-bold">Certificados para Escuelas Normales</h2>
        </div>
        <div className="py-2 mr-2">
          <img src="/logo.png" alt="SEPH Logo" className="h-[50px] md:h-[70px] w-auto transition-all duration-300" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full mx-auto flex flex-col items-center my-[40px] px-[20px]">
        
        {!result ? (
          /* --- SEARCH FORM VIEW --- */
          <div className="w-full md:w-[600px] lg:w-[800px] max-w-full bg-[#F5F5F5] rounded-[10px] px-[15px] md:px-[40px] py-[20px] flex flex-col items-center">
            <h1 className="text-[#BC955B] font-bold text-[24px] md:text-[30px] text-center mb-6 mt-4">
              CONSULTA TU CERTIFICADO
            </h1>
            
            <p className="text-[#555555] text-[15px] md:text-[16px] text-center mb-2">
              Consulta la Información de tu Certificado
            </p>

            <div className="w-full flex flex-col items-center text-[#555555] mb-6">
              <p className="text-[18px] leading-[28.8px] text-center">1. Selecciona el ciclo escolar en el que fue emitido</p>
              <p className="text-[18px] leading-[28.8px] text-center mt-1">
                2. Teclea el folio digital que viene en la parte delantera inferior izquierda del documento.
              </p>
            </div>

            <form className="w-full md:w-[400px] flex flex-col items-center" onSubmit={handleSearch}>
              
              <div className="w-full flex flex-col items-center mb-5">
                <label htmlFor="ciclo" className="text-[#333333] font-bold text-[14px] md:text-[16px] mb-2 uppercase text-center w-full">
                  CICLO ESCOLAR DE EMISIÓN
                </label>
                <select 
                  id="ciclo" 
                  value={ciclo}
                  onChange={(e) => setCiclo(e.target.value)}
                  className="w-full h-[38px] px-3 bg-white border border-[#ccc] rounded text-[#555555] outline-none focus:border-[#66afe9] focus:ring-[1px] focus:ring-[#66afe9] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-all duration-200"
                >
                  <option value="" disabled>-Seleccionar-</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                </select>
              </div>

              <div className="w-full flex flex-col items-center mb-6">
                <label htmlFor="folio" className="text-[#333333] font-bold text-[14px] md:text-[16px] mb-2 uppercase text-center w-full">
                  FOLIO DIGITAL
                </label>
                <input 
                  type="text" 
                  id="folio" 
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  className="w-full h-[38px] px-3 bg-white border border-[#ccc] rounded text-[#555555] outline-none focus:border-[#66afe9] focus:ring-[1px] focus:ring-[#66afe9] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-all duration-200"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2 text-center w-full bg-red-50 p-2 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="w-full flex justify-center mt-2 mb-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-[200px] bg-[#BC955B] hover:bg-[#A26C0E] disabled:opacity-50 text-white font-bold text-[16px] py-[10px] px-4 rounded-[10px] transition-colors duration-200"
                >
                  {loading ? 'Consultando...' : 'Consultar'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* --- SEARCH RESULTS VIEW (FAITHFUL CLONE) --- */
          <div className="w-full md:w-[800px] lg:w-[1000px] max-w-full bg-[#F5F5F5] flex flex-col md:flex-row items-start gap-[30px] rounded-[10px] p-[15px] md:p-[40px]">
            
            {/* Left Image Section */}
            <div className="w-full md:w-[40%] flex-shrink-0 flex justify-center md:justify-start">
               {/* 
                  Note: The original uses a specific background image with specific text overlay. 
                  We use an image here. If the text is baked in, we just display the image.
               */}
               <img src="/bg_resultados.png" alt="Certificado Encontrado" className="w-[250px] md:w-full max-w-[350px] object-contain rounded-[10px]" />
            </div>

            {/* Data Section */}
            <div className="w-full md:w-[60%] flex flex-col items-start pt-2 md:pt-6">
              
              <h2 className="text-[#BC955B] font-bold text-[20px] mb-4 uppercase">
                DATOS DEL REGISTRO
              </h2>
              
              <div className="text-[#555555] text-[16px] leading-[1.6] space-y-1 w-full mb-8">
                <p>Ciclo Escolar: <strong>{result.ciclo_escolar}</strong></p>
                <p>Nombre del Alumno(a): <strong>{result.nombre_alumno}</strong></p>
                <p>CURP del Alumno(a): <strong>{result.curp}</strong></p>
                <p>Licenciatura Cursada: <strong>{result.licenciatura}</strong></p>
                <p>Plan de Estudios: <strong>{result.plan_estudios}</strong></p>
                <p>CCT: <strong>{result.cct}</strong></p>
                <p>Promedio: <strong>{result.promedio}</strong></p>
                <p>Folio: <strong>{result.folio}</strong></p>
                <p>Folio Digital: <strong className="break-all">{result.folio_digital}</strong></p>
              </div>

              <div className="w-full flex justify-center md:justify-start md:ml-10 mt-6">
                <button 
                  onClick={handleReset}
                  className="w-[280px] bg-[#BC955B] hover:bg-[#A26C0E] text-white font-bold text-[16px] py-[12px] px-[24px] rounded-[10px] transition-colors duration-200"
                >
                  Regresar/Consultar otro Folio
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#691B32] text-white py-[15px] px-4 flex flex-col md:flex-row items-center justify-center text-[10px] sm:text-[14px]">
        <div className="flex items-center text-center flex-wrap justify-center font-sans tracking-wide">
            Secretaría de Educación Pública de Hidalgo © 2025 |&nbsp;
            <a href="https://sep.hidalgo.gob.mx" target="_blank" rel="noopener noreferrer" className="text-[#BC955B] font-bold hover:underline">
              PORTAL INSTITUCIONAL
            </a> 
        </div>
        {!result && (
          <div className="mt-2 md:mt-0 md:ml-4 flex items-center text-white text-[14px] font-normal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] mr-[10px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {visitorCount !== null ? visitorCount.toLocaleString() : '---'}
          </div>
        )}
      </footer>
    </div>
  );
}
