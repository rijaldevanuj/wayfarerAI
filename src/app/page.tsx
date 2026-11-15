import Image from 'next/image';
import Link from 'next/link';

const journeys = [
  { region: 'Patagonia', style: 'Small-group', days: '10 days', number: '03 / CHILE & ARGENTINA', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80' },
  { region: 'Bali', style: 'Honeymoon', days: '8 days', number: '04 / INDONESIA', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { region: 'Kenya', style: 'Safari', days: '9 days', number: '05 / EAST AFRICA', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80' },
];

const wayfarerPrinciples = [
  { number: '01', title: 'Tailor-made trips', description: 'Each itinerary is built around the rhythm you want, not a model template.' },
  { number: '02', title: 'Honeymoons', description: 'Private moments, slower transitions, and a sense of ease from arrival to goodbye.' },
  { number: '03', title: 'Small-group adventures', description: 'Professional, intimate travel with room for discovery and curation.' },
];

const designers = [
  { name: 'Elena Rivera', role: 'South America', description: 'Wild coastlines, cultural layers, and slow-travel design.' },
  { name: 'James Okello', role: 'Africa', description: 'Remote stays, wildlife stories, and highly personal pacing.' },
  { name: 'Sofia Torres', role: 'Europe & Asia', description: 'Immersive city itineraries shaped by food, design, and ritual.' },
];

const stories = [
  { title: 'The kind of itinerary that made us linger longer than planned.', quote: 'We left with the right kind of tired — the one that comes from long dinners, warm water, and places that felt chosen for us.' },
  { title: 'A honeymoon that felt quietly cinematic.', quote: 'Every airline transfer, dinner reservation, and last-minute change was tailored to the pace we actually wanted.' },
  { title: 'The travel day we thought would be hectic ended up feeling effortless.', quote: 'Wayfarer made the impossible feel balanced: gorgeous, calm, and deeply personal.' },
];

export default function Home() {
  return (
    <div className="bg-[#0B1F2A] text-[#F5EFE6]">
      <header className="sticky top-0 z-50 border-b border-[#1E3A4A] bg-[#0B1F2A]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF7A45]/60 bg-[#102937] text-[#FF7A45]">✦</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#F5EFE6]">
              <div>Wayfarer</div>
              <div className="text-[#9FB1BC]">Journeys</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.2em] text-[#9FB1BC] md:flex">
            <a href="#journeys" className="transition hover:text-[#F5EFE6]">The journeys</a>
            <a href="#way" className="transition hover:text-[#F5EFE6]">Our way</a>
            <a href="#designers" className="transition hover:text-[#F5EFE6]">Our people</a>
          </nav>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
            <Link href="/auth" className="text-[#9FB1BC] transition hover:text-[#F5EFE6]">Account</Link>
            <Link href="/planner" className="border-b border-[#FF7A45] pb-1 text-[#FF7A45]">Plan with AI ↗</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F2A] via-[#0B1F2A]/80 to-[#0B1F2A]/20" />

          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#FF7A45]">For the beautifully curious</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black tracking-[-0.06em] text-[#F5EFE6] sm:text-6xl lg:text-8xl">
              Wayfarer
            </h1>
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[#D8E1E8]">Extraordinary places. Entirely your journey.</p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="/planner" className="flex h-12 items-center justify-center rounded-full bg-[#FF7A45] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0B1F2A]">
                Plan with AI ↗
              </Link>
              <a href="#journeys" className="flex h-12 items-center justify-center rounded-full border border-[#F5EFE6]/30 px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F5EFE6]">
                Find your inspiration ↓
              </a>
            </div>
            <div className="mt-10 text-4xl font-black tracking-[-0.05em] text-[#F5EFE6] sm:text-5xl">
              Go further. <span className="text-[#FF7A45]">Feel closer.</span>
            </div>
          </div>
        </section>

        <section id="journeys" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#FF7A45]">01 / The journeys</p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                A world of possibility. A journey that’s yours.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-[#9FB1BC]">
              <button type="button" className="rounded-full border border-[#FF7A45] bg-[#FF7A45]/10 px-3 py-2 text-[#FF7A45]">All destinations</button>
              <button type="button" className="rounded-full border border-[#1E3A4A] px-3 py-2">Southeast Asia</button>
              <button type="button" className="rounded-full border border-[#1E3A4A] px-3 py-2">Africa</button>
              <button type="button" className="rounded-full border border-[#1E3A4A] px-3 py-2">South America</button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {journeys.map((trip) => (
              <Link key={trip.region} href="/planner" className="group overflow-hidden rounded-[28px] border border-[#1E3A4A] bg-[#102937] shadow-lg shadow-black/20 transition hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={trip.image}
                    alt={trip.region}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="eager"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A] via-[#0B1F2A]/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#102937]/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]">
                    {trip.style}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF7A45]">{trip.number}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <h3 className="text-2xl font-black tracking-tight text-white">{trip.region}</h3>
                    <span className="text-sm text-[#9FB1BC]">{trip.days}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#F5EFE6]">
                    <span>Explore journey</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="way" className="border-y border-[#1E3A4A] bg-[#0B1F2A]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#FF7A45]">02 / The Wayfarer way</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Three ways to go. Always your own.</h2>

            <div className="mt-8 divide-y divide-[#1E3A4A] rounded-[28px] border border-[#1E3A4A] bg-[#102937]">
              {wayfarerPrinciples.map((item) => (
                <div key={item.number} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF7A45]">{item.number}</span>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-white">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-[#D8E1E8]">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-2xl text-[#FF7A45]">↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="designers" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#FF7A45]">03 / Your travel designers</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {designers.map((designer) => (
              <div key={designer.name} className="rounded-[28px] border border-[#1E3A4A] bg-[#102937] p-5">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE1] text-xl font-black text-[#0B1F2A]">
                  {designer.name.split(' ').map((word) => word[0]).join('')}
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#FF7A45]">{designer.role}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{designer.name}</h3>
                <p className="mt-3 text-[#D8E1E8]">{designer.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#F3ECE1] py-16 text-[#0B1F2A]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#0B1F2A]/75">04 / Stories that came home</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {stories.map((story, index) => (
                <article key={story.title} className="rounded-[28px] border border-[#0B1F2A]/10 bg-white/40 p-5">
                  <div className="mb-4 text-[11px] uppercase tracking-[0.2em] text-[#0B1F2A]/70">0{index + 1} / 05</div>
                  <h3 className="text-2xl font-black tracking-tight">{story.title}</h3>
                  <p className="mt-4 text-[#0B1F2A]/75">“{story.quote}”</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
