import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B14]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#A78BFA] flex items-center justify-center">
              ⚡
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              StartupForge
            </span>
          </div>
          <p className="text-xs text-slate-500">10 free analyses included. No credit card required.</p>
        </div>
        <SignUp
          routing="hash"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#0F1624] border border-white/10 shadow-2xl',
              headerTitle: 'text-white font-bold',
              headerSubtitle: 'text-slate-400',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10',
              formFieldInput: 'bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600',
              formFieldLabel: 'text-slate-400',
              footerActionLink: 'text-[#00D4FF]',
              formButtonPrimary: 'bg-[#00D4FF] text-[#080B14] font-bold hover:bg-[#00B8D9]',
              dividerLine: 'bg-white/10',
              dividerText: 'text-slate-600',
            },
          }}
        />
      </div>
    </div>
  );
}
