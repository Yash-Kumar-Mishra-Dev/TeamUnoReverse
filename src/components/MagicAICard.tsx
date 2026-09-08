import React from 'react';
import { Sparkles, Navigation } from 'lucide-react';

interface MagicAICardProps {
  text: string;
  ctaText?: string;
  dark?: boolean;
  onApply?: () => void;
  onDismiss?: () => void;
}

export const MagicAICard: React.FC<MagicAICardProps> = ({
  text,
  ctaText = 'Apply Reroute',
  dark = false,
  onApply,
  onDismiss
}) => {
  return (
    <div className={`${dark ? 'magic-ai-dark text-slate-100' : 'magic-ai-light text-slate-900'} rounded-xl p-4 shadow-xs border transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg ${dark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-600/10 text-blue-600'} flex items-center justify-center shrink-0`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className={`text-xs font-bold ${dark ? 'text-blue-300' : 'text-blue-900'} uppercase tracking-wider flex items-center gap-1.5`}>
            <span>Magic AI Suggests</span>
            <span className={`${dark ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-600 text-white'} text-[9px] px-1.5 py-0.2 rounded font-mono`}>
              LIVE MODEL
            </span>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            "{text}"
          </p>
          <div className="pt-2 flex items-center gap-2">
            {onApply && (
              <button
                onClick={onApply}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{ctaText}</span>
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`px-2.5 py-1.5 text-xs font-semibold ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
