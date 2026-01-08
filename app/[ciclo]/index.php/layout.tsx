import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEPH",
  description: "Certificados Y Certificaciones para Escuelas Normales",
};

export default function CertificateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap-extended.css" />
        <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/datatables/datatables.min.css" />
        <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/tables/datatable/datatables.min.css" />
        <link rel="stylesheet" href="/assets/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Arial:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <style>{`
          body::-webkit-scrollbar {
            display: none;
          }
          html::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </head>
      <body className="pace-done">
        {children}
        <script src="/app-assets/js/core/libraries/jquery.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/tether.min.js" type="text/javascript" async></script>
        <script src="/app-assets/js/core/libraries/bootstrap.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/perfect-scrollbar.jquery.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/unison.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/blockUI.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/jquery.matchHeight-min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/ui/screenfull.min.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/extensions/pace.min.js" type="text/javascript" async></script>
        <script src="/app-assets/js/core/app-menu.js" type="text/javascript" async></script>
        <script src="/app-assets/js/core/app.js" type="text/javascript" async></script>
        <script src="/app-assets/vendors/js/datatables/datatables.js" type="text/javascript" async></script>
      </body>
    </html>
  );
}
