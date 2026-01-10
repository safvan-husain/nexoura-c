import { CarouselDemo } from './CarouselDemo';

export default function ExpPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
                <div className="space-y-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">/exp</p>
                    <h1 className="text-4xl font-bold">Experimental Carousel</h1>
                    <p className="text-lg text-white/70">
                        Ten concept cards, only three in view. Smooth translate motion with endless looping.
                    </p>
                </div>

                <CarouselDemo />
            </div>
        </div>
    );
}

