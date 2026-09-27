import { ClientCachePurger } from '@/components/ClientCachePurger';
import LandingPageClient from '@/components/landing/LandingPageClient';

export default function LandingPage() {
  // Jika sudah login, middleware otomatis akan mengarahkan user ke /admin atau /superadmin
  // Halaman ini adalah public marketing landing page berkelas enterprise untuk menjangkau leads UMKM.
  return (
    <>
      <ClientCachePurger />
      <LandingPageClient />
    </>
  );
}
