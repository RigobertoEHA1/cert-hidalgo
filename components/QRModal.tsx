'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    title: string;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, value, title }) => {
    if (!isOpen) return null;

    const downloadQR = () => {
        const canvas = document.getElementById('qr-gen-modal') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            let downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `QR_${title.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Código QR</h3>
                    <p className="text-sm text-gray-500 mb-6 truncate px-4">{title}</p>

                    <div className="flex justify-center mb-6 bg-white p-4 rounded-lg">
                        <QRCodeCanvas
                            id="qr-gen-modal"
                            value={value}
                            size={300} // High resolution
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={downloadQR}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors"
                        >
                            Descargar PNG
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 font-medium transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRModal;
