'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
    value: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value }) => {
    const downloadQR = () => {
        const canvas = document.getElementById('qr-gen') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            let downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'codigo_qr.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <QRCodeCanvas
                    id="qr-gen"
                    value={value}
                    size={128}
                    level={"H"}
                    includeMargin={true}
                />
            </div>
            <button
                onClick={downloadQR}
                className="btn btn-primary"
                style={{
                    backgroundColor: '#BC955B',
                    borderColor: '#BC955B',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                }}
            >
                Descargar PNG
            </button>
        </div>
    );
};

export default QRCodeGenerator;
