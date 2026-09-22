import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "For getting started with Notespace AI.",
    price: "$0",
    features: [
      "3 notebooks",
      "50 sources",
      "AI-powered conversations",
      "Semantic search",
      "Source citations",
      "Basic RAG",
    ],
    button: "Get Started",
  },
  {
    name: "Pro",
    description: "For serious learners and developers.",
    price: "$12",
    popular: true,
    features: [
      "Unlimited notebooks",
      "500 sources",
      "Advanced RAG",
      "Unlimited AI conversations",
      "Semantic search",
      "Source citations",
      "Multiple source types",
      "Priority processing",
    ],
    button: "Start Pro",
  },
  {
    name: "Developer",
    description: "For developers building with their knowledge.",
    price: "$29",
    features: [
      "Everything in Pro",
      "Unlimited sources",
      "API access",
      "Advanced retrieval controls",
      "Higher processing limits",
      "Developer tools",
      "Early access to new features",
    ],
    button: "Build with Notespace",
  },
];

function Pricing() {
  return (
    <section className="bg-[#030405] px-6 py-32">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Choose the way you want to
            <br />
            learn.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Start exploring your knowledge for free, then unlock more powerful
            capabilities when you need them.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-3 text-sm">
          <span className="font-medium text-white">Monthly</span>

          <div className="relative h-6 w-12 rounded-full border border-white/10 bg-white/[0.05]">
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
          </div>

          <span className="text-slate-400">Yearly</span>

          <span className="rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-2 py-1 text-xs text-blue-400">
            Save 20%
          </span>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                plan.popular
                  ? "border-blue-500/50 bg-[#10141b] shadow-[0_0_50px_rgba(37,99,235,0.08)]"
                  : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              {plan.popular && (
                <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-white">
                {plan.name}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-slate-500">
                  / month
                </span>
              </div>

              <div className="my-7 h-px bg-white/[0.08]" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                      <Check size={10} className="text-blue-400" />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:bg-blue-500"
                    : "border border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.1]"
                }`}
              >
                {plan.button}
                <ArrowRight size={17} />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          No credit card required to get started.
        </p>
      </div>
    </section>
  );
}

export default Pricing;