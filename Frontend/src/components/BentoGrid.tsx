import React, { useState, useEffect } from "react";

const BentoGrid: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    {
      text: "Engineering is not about knowing the answers. It's about knowing how to find them.",
      detail: "We don't teach recipes; we teach the chemistry of the stack.",
    },
    {
      text: "The best way to predict the future is to invent it.",
      detail: "We build the architects who design tomorrow's systems.",
    },
    {
      text: "Code is poetry written in logic.",
      detail:
        "Master the syntax, understand the semantics, create the impossible.",
    },
    {
      text: "True mastery comes from understanding principles, not memorizing patterns.",
      detail:
        "We don't train coders; we forge engineers who think in first principles.",
    },
    {
      text: "The only way to do great work is to love what you do.",
      detail:
        "Passion transforms knowledge into innovation and creates breakthrough solutions.",
    },
  ];

  // Auto-rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="flex flex-col gap-10">
      {/* Featured Pillar: The Founding Vision */}
      <div className="reveal ml-6 md:ml-12 lg:ml-20 p-12 md:p-16 border rounded-sm flex flex-col justify-between group transition-all duration-500 max-w-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl hover:border-black dark:hover:border-accent-cyan">
        <div>
          <h3 className="text-4xl md:text-5xl font-black font-syne leading-[0.85] tracking-tighter uppercase mb-10 text-black dark:text-white">
            Master <br />
            <span className="text-rose-500">The</span> <br /> Core.
          </h3>

          {/* Animated Quote Section */}
          <div className="relative overflow-hidden min-h-30">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === quoteIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <p className="max-w-xl text-lg md:text-xl font-black leading-relaxed text-zinc-800 dark:text-zinc-100 mb-4">
                  "{quote.text}"
                </p>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 italic">
                  {quote.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Quote Navigation Dots */}
          <div className="flex items-center gap-2 mt-8">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setQuoteIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === quoteIndex
                    ? "w-8 bg-rose-500"
                    : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                }`}
                aria-label={`View quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Card 2: Immersion */}
        <div className="reveal p-12 border rounded-sm flex flex-col justify-between group transition-all duration-500 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-lg hover:border-black dark:hover:border-accent-fuchsia">
          <div className="w-16 h-16 border-2 flex items-center justify-center mb-10 border-accent-fuchsia text-accent-fuchsia group-hover:bg-accent-fuchsia group-hover:text-white transition-all duration-300">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
          <h4 className="text-4xl font-black font-syne tracking-tighter leading-none mb-6 text-black dark:text-white">
            Lets
            <br /> Build.
          </h4>
          <p className="text-base font-black text-zinc-700 dark:text-zinc-300">
            No abstractions allowed. You master the iron, the kernel, and the
            cloud from the root up.
          </p>
        </div>

        {/* Card 3: Founding Incentive */}
        <div className="reveal p-12 border rounded-sm flex flex-col justify-between group transition-all duration-500 bg-black dark:bg-accent-fuchsia text-white border-black dark:border-accent-fuchsia shadow-2xl dark:shadow-lg">
          <h4 className="text-5xl font-black font-syne tracking-tighter leading-[0.85] mb-8">
            Start <br /> Your <br /> Journey.
          </h4>
          <p className="text-sm font-black tracking-widest leading-relaxed opacity-90">
            The first 100 scholars <br /> are not just students; <br /> they are
            partners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
