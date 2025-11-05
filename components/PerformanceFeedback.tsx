import React, { useState } from 'react';
import GoIcon from './GoIcon';
import CautionIcon from './CautionIcon';

const PerformanceFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-2">Feedback de Performance</h3>
      <p className="text-sm text-text-secondary mb-4">
        A performance correspondeu à sua expectativa? Seu feedback é crucial para a evolução do modelo.
      </p>
      {submitted ? (
        <div className="text-center py-4 text-success bg-success/10 rounded-lg">
          <p>Obrigado pelo seu feedback!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ex: 'O alvo foi atingido mais rápido que o esperado', 'O stop foi muito curto para a volatilidade atual...'"
            className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-opacity-80 disabled:opacity-50"
              disabled={!feedback.trim()}
            >
              Enviar Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PerformanceFeedback;
