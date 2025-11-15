import { useState } from 'react';

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small projects and startups',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Up to 3 active projects',
        '10 security scans per month',
        '5 compliance reviews per month',
        'Documentation analysis (PDD/TDD)',
        'Basic AI agent requests (50/month)',
        'Email support',
        'Standard response time (48h)',
        'Basic reporting dashboard'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing teams and mid-size companies',
      monthlyPrice: 249,
      annualPrice: 2490,
      features: [
        'Up to 10 active projects',
        'Unlimited security scans',
        '20 compliance reviews per month',
        'Advanced documentation analysis',
        'Priority AI agent requests (200/month)',
        'Email + Slack support',
        'Priority response time (24h)',
        'Advanced analytics & reporting',
        'Custom compliance frameworks',
        'API access for integrations'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthlyPrice: 799,
      annualPrice: 7990,
      features: [
        'Unlimited active projects',
        'Unlimited security scans',
        'Unlimited compliance reviews',
        'Full AI Red Team suite',
        'Unlimited AI agent requests',
        'Dedicated support manager',
        '24/7 priority support',
        'Custom AI model training',
        'White-label options',
        'SLA guarantees (99.9% uptime)',
        'On-premise deployment option',
        'Custom integrations & workflows'
      ],
      popular: false,
      color: 'indigo'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (billingCycle === 'annual') {
      const monthlyTotal = plan.monthlyPrice * 12;
      return monthlyTotal - plan.annualPrice;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Choose Your AI Red Team Plan
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            Continuous security and compliance monitoring for your projects
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-secondary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-primary' : 'bg-border-medium'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-text-primary' : 'text-text-secondary'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-8 bg-bg-card transition-all ${
                  plan.popular
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-border-light hover:border-primary/50 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-secondary mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-text-primary">${price}</span>
                    <span className="text-text-secondary">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  
                  {savings > 0 && (
                    <p className="text-sm text-success">
                      Save ${savings}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-text-primary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary-hover text-white'
                      : 'bg-bg-elevated hover:bg-border-light text-text-primary border border-border-light'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Contact Section */}
        <div className="bg-bg-card border border-border-light rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Need a Custom Solution?
          </h3>
          <p className="text-text-secondary mb-6">
            We offer tailored AI Red Team services for organizations with specific requirements.
            Contact us to discuss your needs.
          </p>
          <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Schedule a Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;

