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
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Mengapa Pilih Kami?
        </h2>
        <p className="text-gray-500 mt-2">
          Kami berkomitmen memberikan pengalaman perjalanan terbaik
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="text-center p-6 rounded-2xl border hover:shadow-md transition"
          >
            <div
              className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <f.icon className={`w-7 h-7 ${f.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
