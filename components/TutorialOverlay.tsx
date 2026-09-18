"use client";

import React, { useEffect, useState } from 'react';

type TutorialStep = {
  target: string;
  title: string;
  text: string;
};

type TutorialOverlayProps = {
  show: boolean;
  steps: TutorialStep[];
  step: number;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
};

export default function TutorialOverlay({
  show,
  steps,
  step,
  onNext,
  onSkip,
  onFinish,
}: TutorialOverlayProps) {
  const [holeRect, setHoleRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!show || steps.length === 0 || step >= steps.length) {
      setHoleRect(null);
      return;
    }

    const currentTargetId = steps[step]?.target;
    if (!currentTargetId) {
      setHoleRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(currentTargetId);
      if (el) {
        const r = el.getBoundingClientRect();
        setHoleRect({
          top: r.top - 8,
          left: r.left - 8,
          width: r.width + 16,
          height: r.height + 16,
        });
      } else {
        setHoleRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [show, step, steps]);

  if (!show || steps.length === 0 || step >= steps.length) return null;

  const currentStep = steps[step];
  const totalSteps = steps.length;

  const tooltipTop = holeRect
    ? (holeRect.top + holeRect.height + 20 < window.innerHeight - 180
        ? holeRect.top + holeRect.height + 20
        : Math.max(20, holeRect.top - 200))
    : 200;

  const tooltipLeft = holeRect
    ? Math.max(20, Math.min(holeRect.left, window.innerWidth - 340))
    : 20;

  return (
    <>
      <div className="tutorial-spotlight" role="dialog" aria-modal="true" aria-label={`Panduan langkah ${step + 1} dari ${totalSteps}`}>
        <div className="tutorial-spotlight__overlay" onClick={onSkip} />
        {holeRect && (
          <div
            className="tutorial-spotlight__hole"
            style={{
              top: `${holeRect.top}px`,
              left: `${holeRect.left}px`,
              width: `${holeRect.width}px`,
              height: `${holeRect.height}px`,
            }}
          />
        )}
      </div>

      <div
        className="tutorial-tooltip"
        style={{ top: `${tooltipTop}px`, left: `${tooltipLeft}px` }}
        role="document"
      >
        <div className="tutorial-tooltip__title">{currentStep.title}</div>
        <div className="tutorial-tooltip__text">{currentStep.text}</div>

        <div className="tutorial-progress">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`tutorial-progress__dot ${i === step ? 'tutorial-progress__dot--active' : ''}`}
            />
          ))}
        </div>

        <div className="tutorial-tooltip__actions">
          {step === totalSteps - 1 ? (
            <button className="tutorial-tooltip__btn tutorial-tooltip__btn--primary" onClick={onFinish}>
              Mulai Transaksi
            </button>
          ) : (
            <>
              <button className="tutorial-tooltip__btn tutorial-tooltip__btn--secondary" onClick={onSkip}>
                Lewati
              </button>
              <button className="tutorial-tooltip__btn tutorial-tooltip__btn--primary" onClick={onNext}>
                Lanjut
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}