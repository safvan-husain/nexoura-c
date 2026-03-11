import React from 'react';

export default function ShadowExperimentPage() {
    const variations = [
        {
            name: "Current Implementation (Active: i === 2)",
            shadowClass: "w-[65%] h-3 bg-black/70 blur-md",
            style: { bottom: '18%', opacity: 0.9 },
        },
        {
            name: "Current Implementation (Inactive: i !== 2)",
            shadowClass: "w-[60%] h-4 bg-black/60 blur-lg",
            style: { bottom: '18%', opacity: 0.8 },
        },
        {
            name: "Variation 1: Tighter, Darker core",
            shadowClass: "w-[50%] h-2 bg-black/80 blur-sm",
            style: { bottom: '19%', opacity: 0.95 },
        },
        {
            name: "Variation 2: Wider, Softer (Ambient)",
            shadowClass: "w-[80%] h-5 bg-black/50 blur-xl",
            style: { bottom: '16%', opacity: 0.8 },
        },
        {
            name: "Variation 3: Double layer (Core + Ambient)",
            customShadow: (
                <>
                    <div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[40%] h-2 bg-black/80 blur-sm z-0" style={{ bottom: '18%' }} />
                    <div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[70%] h-4 bg-black/40 blur-lg z-0" style={{ bottom: '17%' }} />
                </>
            ),
            code: `<!-- Double Layer -->\n<div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[40%] h-2 bg-black/80 blur-sm z-0" style={{ bottom: '18%' }} />\n<div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[70%] h-4 bg-black/40 blur-lg z-0" style={{ bottom: '17%' }} />`
        },
        {
            name: "Variation 4: High Elevation (Floating higher)",
            shadowClass: "w-[40%] h-6 bg-black/30 blur-2xl",
            style: { bottom: '12%', opacity: 0.7 },
        },
        {
            name: "Variation 5: Very sharp, low to ground",
            shadowClass: "w-[65%] h-1.5 bg-black/90 blur-[3px]",
            style: { bottom: '19%', opacity: 0.95 },
        },
        {
            name: "Variation 6: Deep Oval Box Shadow",
            shadowClass: "w-[60%] h-[15px] bg-black/60 blur-[10px]",
            style: { bottom: '18%', opacity: 0.85 },
        },
        {
            name: "Variation 7: Very Soft Wide Spread",
            shadowClass: "w-[90%] h-4 bg-black/40 blur-[14px]",
            style: { bottom: '16%', opacity: 0.8 },
        },
        {
            name: "Variation 8: Spread Top Gradient",
            customShadow: (
                <div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-20 bg-gradient-to-t from-black/50 to-transparent blur-xl rounded-t-[100%] z-0" style={{ bottom: '12%' }} />
            ),
            code: `<div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-20 bg-gradient-to-t from-black/50 to-transparent blur-xl rounded-t-[100%] z-0" style={{ bottom: '12%' }} />`
        },
        {
            name: "Variation 9: Spread Top Gradient (Narrow & Taller)",
            customShadow: (
                <div className="absolute left-1/2 -translate-x-1/2 w-[50%] h-24 bg-gradient-to-t from-black/60 to-transparent blur-2xl rounded-t-[100%] z-0" style={{ bottom: '10%' }} />
            ),
            code: `<div className="absolute left-1/2 -translate-x-1/2 w-[50%] h-24 bg-gradient-to-t from-black/60 to-transparent blur-2xl rounded-t-[100%] z-0" style={{ bottom: '10%' }} />`
        },
        {
            name: "Variation 10: Spread Top Gradient (Soft Base + Gradient)",
            customShadow: (
                <>
                    <div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[50%] h-3 bg-black/40 blur-lg z-0" style={{ bottom: '16%' }} />
                    <div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-24 bg-gradient-to-t from-black/40 to-transparent blur-2xl rounded-t-[100%] z-0" style={{ bottom: '10%' }} />
                </>
            ),
            code: `<!-- Base + Gradient Top Spread -->\n<div className="absolute left-1/2 -translate-x-1/2 rounded-full w-[50%] h-3 bg-black/40 blur-lg z-0" style={{ bottom: '16%' }} />\n<div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-24 bg-gradient-to-t from-black/40 to-transparent blur-2xl rounded-t-[100%] z-0" style={{ bottom: '10%' }} />`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/90 py-16 px-6 sm:px-12 text-black">
            <h1 className="text-3xl font-bold mb-4 text-center mt-12 text-zinc-800">Floor Shadow Experiments</h1>
            <p className="text-center mb-16 text-zinc-500 max-w-2xl mx-auto">
                Review different shadow configurations for the <strong>ProductCarousel</strong> component. 
                These emulate the active center position scaling layout.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20 justify-items-center max-w-[1600px] mx-auto">
                {variations.map((v, idx) => (
                    <div key={idx} className="flex flex-col items-center w-full max-w-[280px]">
                        <h3 className="font-semibold mb-6 text-center h-12 flex items-center justify-center text-zinc-700">
                            {v.name}
                        </h3>

                        {/* Simulate the carousel container physics */}
                        <div className="relative w-full aspect-[3/5] rounded-xl overflow-hidden flex items-center justify-center p-4 bg-white/50 border border-gray-100 shadow-sm">
                            
                            {/* Inner product card mockup similar to ProductCrousel */}
                            <div className="flex relative w-full h-full scale-100">
                                {/* Product Image / Card Mock (Mimicking transparency of product img) */}
                                <div className="absolute inset-0 drop-shadow-2xl z-10 flex flex-col items-center justify-center pointer-events-none pb-[20%]">
                                    <div className="w-[85%] aspect-[5/4] bg-gradient-to-br from-zinc-200 to-zinc-400 border border-white flex flex-col items-center justify-center rounded-[2rem] shadow-xl transform rotate-[-12deg]">
                                        <span className="text-zinc-500/80 font-bold text-xl uppercase tracking-widest drop-shadow-md">Shoe</span>
                                    </div>
                                </div>

                                {/* Floor shadow */}
                                {v.customShadow ? (
                                    v.customShadow
                                ) : (
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-opacity duration-500 z-0 ${v.shadowClass}`}
                                        style={v.style}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 w-full bg-zinc-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-auto shadow-inner border border-zinc-800">
                            {v.customShadow ? (
                                <pre className="whitespace-pre-wrap word-break">
                                    {v.code}
                                </pre>
                            ) : (
                                <>
                                    <p className="mb-2"><span className="text-zinc-500">className=</span>"{v.shadowClass}"</p>
                                    <p><span className="text-zinc-500">style=</span>{JSON.stringify(v.style)}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
