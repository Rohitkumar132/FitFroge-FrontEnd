import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { Progress } from "@/components/ui/progress";
import { useProducts } from "@/hooks/useApi";
import { getRecommendedProducts } from "@/utils/recommendationEngine";
import { RecommendationBudgetRange, RecommendationFilters } from "@/types";

const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const concerns = ["Acne", "Anti-aging", "Brightening", "Hydration", "Pore care", "Dullness"];
const categories = ["Makeup", "Skincare", "Haircare", "Fragrance", "Bath & Body"];
const budgetRanges: RecommendationBudgetRange[] = [
  { label: "Under Rs. 500", min: 0, max: 500 },
  { label: "Rs. 500 - Rs. 1,000", min: 500, max: 1000 },
  { label: "Rs. 1,000 - Rs. 2,000", min: 1000, max: 2000 },
  { label: "Above Rs. 2,000", min: 2000 },
];

const stepTitles = ["Skin type", "Concerns", "Category", "Budget"];

const RecommendationsPage = () => {
  const [step, setStep] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quiz, setQuiz] = useState<RecommendationFilters>({
    skinType: "",
    concerns: [],
    category: "",
    budget: null,
  });

  const { data, isLoading } = useProducts({ limit: 1000 });
  const products = useMemo(() => data?.data || [], [data?.data]);
  const recommended = useMemo(() => getRecommendedProducts(products, quiz), [products, quiz]);
  const progress = ((step + 1) / stepTitles.length) * 100;

  const canContinue =
    (step === 0 && quiz.skinType) ||
    (step === 1 && quiz.concerns.length > 0) ||
    (step === 2 && quiz.category) ||
    (step === 3 && quiz.budget);

  const updateQuiz = <Key extends keyof RecommendationFilters>(key: Key, value: RecommendationFilters[Key]) => {
    setQuiz(prev => ({ ...prev, [key]: value }));
  };

  const toggleConcern = (concern: string) => {
    setQuiz(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(item => item !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const submitQuiz = () => {
    setIsPreparing(true);
    window.setTimeout(() => {
      setIsPreparing(false);
      setShowResults(true);
    }, 900);
  };

  const resetQuiz = () => {
    setStep(0);
    setIsPreparing(false);
    setShowResults(false);
    setQuiz({ skinType: "", concerns: [], category: "", budget: null });
  };

  const nextStep = () => {
    if (step === stepTitles.length - 1) {
      submitQuiz();
      return;
    }
    setStep(prev => Math.min(stepTitles.length - 1, prev + 1));
  };

  const optionClass = (isSelected: boolean) =>
    `rounded-lg border px-5 py-4 text-left transition-all ${
      isSelected
        ? "border-primary bg-brand-pink-light text-primary shadow-sm"
        : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
    }`;

  const renderStep = () => {
    if (step === 0) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">What is your skin type?</h2>
          <p className="text-muted-foreground mb-6">Pick the closest match. This helps us tune texture and finish.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skinTypes.map(type => (
              <button key={type} onClick={() => updateQuiz("skinType", type)} className={optionClass(quiz.skinType === type)}>
                <span className="font-semibold">{type}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">What would you like to improve?</h2>
          <p className="text-muted-foreground mb-6">Choose one or more concerns for sharper recommendations.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concerns.map(concern => (
              <button key={concern} onClick={() => toggleConcern(concern)} className={optionClass(quiz.concerns.includes(concern))}>
                <span className="font-semibold">{concern}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Which category are you shopping for?</h2>
          <p className="text-muted-foreground mb-6">We will prioritize this category in your product picks.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(category => (
              <button key={category} onClick={() => updateQuiz("category", category)} className={optionClass(quiz.category === category)}>
                <span className="font-semibold">{category}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">What budget feels right?</h2>
        <p className="text-muted-foreground mb-6">We will keep the strongest matches close to your preferred range.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {budgetRanges.map(range => (
            <button key={range.label} onClick={() => updateQuiz("budget", range)} className={optionClass(quiz.budget?.label === range.label)}>
              <span className="font-semibold">{range.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <section className="section-padding max-w-6xl mx-auto">
        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
            <div className="bg-secondary rounded-lg p-6 lg:sticky lg:top-32">
              <Sparkles className="text-primary mb-4" size={34} />
              <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Personalized For You
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Answer four quick questions and we will match you with products based on skin type, concerns, category, and budget.
              </p>
              <div className="mt-8">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
                  <span>Step {step + 1} of {stepTitles.length}</span>
                  <span>{stepTitles[step]}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 sm:p-8 min-h-[440px]">
              {isPreparing ? (
                <div className="min-h-[360px] flex flex-col items-center justify-center text-center">
                  <Loader2 className="text-primary animate-spin mb-4" size={42} />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Preparing your beauty edit</h2>
                  <p className="text-muted-foreground max-w-sm">Matching your answers with product categories, tags, ratings, and budget.</p>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between gap-3 mt-8">
                    <button
                      onClick={() => setStep(prev => Math.max(0, prev - 1))}
                      disabled={step === 0}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-semibold disabled:opacity-40 hover:border-primary transition-colors"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!canContinue || isLoading}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      {step === stepTitles.length - 1 ? "Get My Recommendations" : "Continue"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Sparkles className="text-primary mx-auto mb-4" size={38} />
              <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Personalized Picks
              </h1>
              <p className="text-muted-foreground">
                Based on {quiz.skinType} skin, {quiz.concerns.join(", ")}, {quiz.category}, and {quiz.budget?.label}.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map(product => <ProductCard key={product._id} product={product} />)}
            </div>

            {!recommended.length && (
              <div className="text-center bg-secondary rounded-lg p-8">
                <p className="text-muted-foreground">No exact matches yet. Try a broader category or budget range.</p>
              </div>
            )}

            <div className="text-center mt-8">
              <button onClick={resetQuiz} className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                <RotateCcw size={16} /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default RecommendationsPage;
