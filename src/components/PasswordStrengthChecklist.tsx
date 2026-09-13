import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PASSWORD_RULES: { id: string; label: string; test: (v: string) => boolean }[] = [
  { id: 'length', label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'Un número', test: (v) => /[0-9]/.test(v) },
  { id: 'symbol', label: 'Un símbolo (ej. !@#$%)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const isPasswordValid = (password: string) => PASSWORD_RULES.every((r) => r.test(password));

export function PasswordStrengthChecklist({ password }: { password: string }) {
  return (
    <ul className="space-y-1 text-sm">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li key={rule.id} className={cn('flex items-center gap-2', passed ? 'text-green-600' : 'text-muted-foreground')}>
            {passed ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
