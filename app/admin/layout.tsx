import Link from "next/link";
import { FolderOpen } from "lucide-react";
import "../globals.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/admin" className="flex-shrink-0 flex items-center gap-2 text-indigo-600 font-bold text-xl">
                                <FolderOpen className="h-6 w-6" />
                                <span>Admin Certificados</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
