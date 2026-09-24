import { Check, ArrowRight, Lock } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "For getting started with Notespace AI.",
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
    monthlyPrice: 12,
    description: "For serious learners and developers.",
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
    popular: true,
  },
  {
    name: "Developer",
    monthlyPrice: 29,
    description: "For developers building with their knowledge.",
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
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#030405] px-6 py-[120px]"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-[100px]" />

      <div className="relative mx-auto max-w-[1100px]">

        {/* Heading */}
        <div className="text-center">

          <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#3B82F6]">
            Simple, transparent pricing
          </p>

          <h2 className="mx-auto max-w-3xl text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[#F8FAFC]">
            Choose the way you want to learn.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.65] text-[#94A3B8]">
            Start exploring your knowledge for free, then unlock more powerful
            capabilities when you need them.
          </p>

          {/* Billing toggle */}
          <div
            className="mt-8 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.025] p-1"
            aria-label="Billing period"
          >
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                !yearly
                  ? "bg-white/[0.08] text-[#F8FAFC]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
              aria-pressed={!yearly}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                yearly
                  ? "bg-white/[0.08] text-[#F8FAFC]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
              aria-pressed={yearly}
            >
              Yearly{" "}
              <span className="ml-1 text-[#3B82F6]">
                — Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const displayedPrice =
              yearly && plan.monthlyPrice > 0
                ? (plan.monthlyPrice * 0.8).toFixed(1)
                : plan.monthlyPrice;

            return (
              <article
                key={plan.name}
                className={`group relative flex flex-col overflow-visible rounded-[14px] border p-7 backdrop-blur-[24px] transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500/40 bg-blue-500/[0.045] shadow-[0_0_50px_rgba(37,99,235,0.08)]"
                    : "border-white/[0.08] bg-white/[0.04] hover:border-blue-500/25 hover:bg-white/[0.05]"
                }`}
              >

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-blue-500/30 bg-[#0B1220] px-4 py-1.5 text-[11px] font-semibold text-[#60A5FA] shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                    Most Popular
                  </div>
                )}

                {/* Plan header */}
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    {plan.name}
                  </h3>

                  <div className="mt-5 flex items-baseline">
                    <span className="text-sm font-medium text-[#64748B]">
                      $
                    </span>

                    <span className="ml-1 text-4xl font-bold tracking-tight text-[#F8FAFC]">
                      {displayedPrice}
                    </span>

                    <span className="ml-1 text-[12px] text-[#64748B]">
                      / month
                    </span>
                  </div>

                  {yearly && plan.monthlyPrice > 0 && (
                    <p className="mt-1 text-[11px] text-[#3B82F6]">
                      Billed yearly
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-7 h-px bg-white/[0.08]" />

                {/* Features */}
                <ul className="flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-[#94A3B8]"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600/[0.12]">
                        <Check
                          size={10}
                          strokeWidth={2}
                          className="text-[#60A5FA]"
                        />
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#cta"
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-[#2563EB] text-white shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:bg-[#3B82F6]"
                      : "border border-white/[0.1] bg-white/[0.04] text-[#F8FAFC] hover:border-white/[0.16] hover:bg-white/[0.07]"
                  }`}
                >
                  {plan.button}
                  <ArrowRight size={16} />
                </a>
              </article>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#64748B]">
          <Lock size={13} />
          <span>No credit card required to get started.</span>
        </div>
      </div>
    </section>
  );
}

export default Pricing;