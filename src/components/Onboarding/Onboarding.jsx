import React, { useState, useEffect } from 'react';
import { onboardingSteps } from '../../services/mockData';
import './Onboarding.css';

const Onboarding = ({ isVisible, onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const currentStepData = onboardingSteps[currentStep];
    const isLastStep = currentStep === onboardingSteps.length - 1;
    const isFirstStep = currentStep === 0;

    useEffect(() => {
        if (isVisible && currentStepData?.target) {
            const targetElement = document.querySelector(currentStepData.target);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                // Add highlight class
                targetElement.classList.add('onboarding-highlight');
                
                return () => {
                    targetElement.classList.remove('onboarding-highlight');
                };
            }
        }
    }, [currentStep, isVisible, currentStepData]);

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 200);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 200);
        }
    };

    const handleComplete = () => {
        localStorage.setItem('onboardingCompleted', 'true');
        onComplete?.();
    };

    const handleSkip = () => {
        localStorage.setItem('onboardingCompleted', 'true');
        onSkip?.();
    };

    if (!isVisible) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-backdrop" onClick={handleSkip} />
            
            <div className={`onboarding-tooltip ${isAnimating ? 'animating' : ''}`}>
                <div className="onboarding-header">
                    <h3 className="onboarding-title">{currentStepData.title}</h3>
                    <button 
                        className="onboarding-close"
                        onClick={handleSkip}
                        aria-label="Skip onboarding"
                    >
                        ×
                    </button>
                </div>
                
                <div className="onboarding-content">
                    <p className="onboarding-description">
                        {currentStepData.description}
                    </p>
                </div>
                
                <div className="onboarding-footer">
                    <div className="onboarding-progress">
                        <span className="onboarding-step-counter">
                            {currentStep + 1} of {onboardingSteps.length}
                        </span>
                        <div className="onboarding-progress-bar">
                            <div 
                                className="onboarding-progress-fill"
                                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    
                    <div className="onboarding-actions">
                        {!isFirstStep && (
                            <button 
                                className="onboarding-btn onboarding-btn-secondary"
                                onClick={handlePrevious}
                            >
                                Previous
                            </button>
                        )}
                        
                        <button 
                            className="onboarding-btn onboarding-btn-primary"
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Get Started' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;