import { useState, type FormEvent, type ReactNode } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeWord, WordAnalysis } from './lib/gemini';

export default function App() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWord(word.trim());
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Arre! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Panel */}
      <header className="px-10 py-8 border-b border-gold/20 flex justify-between items-center">
        <div className="font-display italic text-2xl text-gold tracking-wider">
          WordWiz AI
        </div>
        <div className="text-[10px] tracking-[0.2em] opacity-70 uppercase font-medium hidden md:block">
          Status: Ready // Hinglish_Mode_Enabled
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Search Section */}
        <section className="max-w-2xl mx-auto mb-20 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display italic text-4xl md:text-5xl text-gold mb-8"
          >
            English Post-Mortem
          </motion.h1>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearch}
            className="relative"
          >
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter word to analyze..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/20 font-serif italic"
            />
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-gold hover:bg-gold/10 rounded-lg transition-colors disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </button>
          </motion.form>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {analysis && !loading && (
            <motion.div
              key={word}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-[1.5fr_1fr] gap-12"
            >
              {/* Word Hero - Spans Full Width if needed or Grid */}
              <div className="lg:col-span-2 border-b border-white/10 pb-10 mb-2 flex items-baseline gap-6">
                <h2 className="font-display text-7xl md:text-8xl font-light text-white tracking-tighter capitalize">
                  {word}
                </h2>
                <span className="font-mono text-white/40 text-xl md:text-2xl lowercase tracking-widest hidden sm:inline">
                  /analysis/
                </span>
              </div>

              {/* Left Column Content */}
              <div className="space-y-12">
                <Card className="p-8">
                  <SectionTitle>1. Meaning</SectionTitle>
                  <p className="text-2xl leading-relaxed text-white font-sans">
                    {analysis.meaning}
                  </p>
                </Card>

                <Card className="p-8">
                  <SectionTitle>4. Example</SectionTitle>
                  <blockquote className="italic text-xl border-l border-white/20 pl-8 py-2 text-white/80 leading-relaxed font-serif">
                    "{analysis.example}"
                  </blockquote>
                </Card>

                <Card className="p-8 flex-1">
                  <SectionTitle>5. Synonyms</SectionTitle>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {analysis.synonyms.map((s, i) => (
                      <span
                        key={i}
                        className="bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium tracking-wide"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column Content */}
              <div className="space-y-12">
                <Card className="p-8">
                  <SectionTitle>2. Breakdown</SectionTitle>
                  <div className="space-y-4">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-line font-sans">
                      {analysis.breakdown}
                    </p>
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionTitle>3. Origin</SectionTitle>
                  <p className="text-lg leading-relaxed text-white/90 font-sans">
                    {analysis.origin}
                  </p>
                </Card>

                <Card className="p-0 overflow-hidden relative">
                  <div className="p-8 bg-gradient-to-br from-gold/15 to-transparent border-l-4 border-gold h-full">
                    <SectionTitle>6. Memory Trick</SectionTitle>
                    <p className="text-lg leading-relaxed text-white font-sans italic mt-4">
                      {analysis.memoryTrick}
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-8 p-4 bg-red-950/30 border border-red-500/20 text-red-400 rounded-xl text-center font-serif italic"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!analysis && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-px h-24 bg-gold/30 mb-8" />
            <p className="font-display italic text-2xl text-gold/60 max-w-lg">
              "To have another language is to possess a second soul."
            </p>
          </motion.div>
        )}
      </main>

      <footer className="w-full py-6 mt-12 bg-black/40 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-medium">
          &copy; 2026 WordWiz Post-Mortem | Language Model: Hinglish-v2.0
        </p>
      </footer>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-white/[0.03] border border-white/[0.05] rounded-2xl flex flex-col gap-3 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display italic text-gold text-[13px] uppercase tracking-[0.2em] mb-4">
      {children}
    </h3>
  );
}

