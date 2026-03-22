import { Shield, Tag, Headphones, Star } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Terpercaya',
    desc: 'Ribuan pelanggan puas dengan layanan kami',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Tag,
    title: 'Harga Terbaik',
    desc: 'Harga kompetitif tanpa biaya tersembunyi',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Tim kami siap membantu kapanpun Anda butuh',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Star,
    title: 'Kualitas Premium',
    desc: 'Armada terawat dan pemandu berpengalaman',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 p-8 md:p-12 lg:p-16">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-3 block">Keunggulan Kami</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight px-4">
            Mengapa Pilih Kami?
          </h2>
          <div className="w-16 h-1 bg-blue-700 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative"
            >
              <div
                className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              
              {/* Animated number background */}
              <span className="absolute top-0 right-0 text-7xl font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -translate-y-4">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
