import { useState, useMemo, memo } from 'react';

const MortgageCalculator = memo(({ isOpen, onClose }) => {
  const [loanAmount, setLoanAmount] = useState(500000000); // 500 million toman
  const [interestRate, setInterestRate] = useState(18); // 18% annual
  const [loanTerm, setLoanTerm] = useState(12); // 12 years
  const [downPayment, setDownPayment] = useState(200000000); // 200 million toman

  const calculations = useMemo(() => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (interestRate === 0) {
      monthlyPayment = principal / numberOfPayments;
      totalPayment = principal;
      totalInterest = 0;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      totalPayment = monthlyPayment * numberOfPayments;
      totalInterest = totalPayment - principal;
    }

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal)
    };
  }, [loanAmount, interestRate, loanTerm, downPayment]);

  const formatNumber = (num) => {
    return num.toLocaleString('fa-IR');
  };

  const presets = [
    { name: 'وام مسکن یکم', rate: 14, maxAmount: 500000000 },
    { name: 'وام مسکن ملی', rate: 18, maxAmount: 1000000000 },
    { name: 'وام بانکی', rate: 24, maxAmount: 2000000000 }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scale-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">ماشین‌حساب وام مسکن</h2>
              <p className="text-white/80 text-sm">محاسبه اقساط و سود وام</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Presets */}
        <div className="p-6 bg-gray-50 dark:bg-slate-700/30">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">پیش‌تنظیمات سریع</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setInterestRate(preset.rate);
                  setLoanAmount(preset.maxAmount);
                }}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              >
                {preset.name} (%{preset.rate})
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              مبلغ وام (تومان)
            </label>
            <div className="relative">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white transition-all duration-200"
                min="0"
                step="1000000"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">تومان</span>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{formatNumber(100000000)}</span>
              <span>{formatNumber(loanAmount)}</span>
              <span>{formatNumber(5000000000)}</span>
            </div>
            <input
              type="range"
              min="100000000"
              max="5000000000"
              step="100000000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2 accent-blue-500"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              پیش‌پرداخت (تومان)
            </label>
            <div className="relative">
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white transition-all duration-200"
                min="0"
                step="10000000"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">تومان</span>
            </div>
            <input
              type="range"
              min="0"
              max={loanAmount}
              step="10000000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full mt-2 accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                نرخ سود سالانه (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white transition-all duration-200"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                مدت بازپرداخت (سال)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white transition-all duration-200"
                  min="1"
                  max="30"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">سال</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700/50 dark:to-slate-600/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">نتایج محاسبه</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">قسط ماهانه</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(calculations.monthlyPayment)}
              </div>
              <div className="text-xs text-gray-500">تومان</div>
            </div>

            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">مجموع بازپرداخت</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatNumber(calculations.totalPayment)}
              </div>
              <div className="text-xs text-gray-500">تومان</div>
            </div>

            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">مجموع سود</div>
              <div className="text-2xl font-bold text-red-500">
                {formatNumber(calculations.totalInterest)}
              </div>
              <div className="text-xs text-gray-500">تومان</div>
            </div>

            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">اصل وام</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatNumber(calculations.principal)}
              </div>
              <div className="text-xs text-gray-500">تومان</div>
            </div>
          </div>

          {/* Visualization Bar */}
          <div className="mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">تقسیم‌بندی بازپرداخت</div>
            <div className="h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500"
                style={{ width: `${(calculations.principal / calculations.totalPayment) * 100}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${(calculations.totalInterest / calculations.totalPayment) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">اصل وام</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600 dark:text-gray-400">سود وام</span>
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MortgageCalculator.displayName = 'MortgageCalculator';

export default MortgageCalculator;
