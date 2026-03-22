import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.from("pengaturan_website").select("*");
  
  const settings: Record<string, string> = {};
  data?.forEach((d: any) => {
    settings[d.kunci] = d.nilai || "";
  });

  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
