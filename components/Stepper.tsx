import React from 'react';
import { WizardStep } from '../types';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface StepperProps {
    currentStep: WizardStep;
}

// FIX: Add 'as const' to prevent TypeScript from widening the type of the 'id' property to a generic 'string'.
// This ensures that `step.id` has a specific literal union type that is assignable to `WizardStep | 'Review'`.
const steps = [
    { id: WizardStep.Upload, name: 'Upload & Identify', icon: ICONS.document },
    { id: WizardStep.SelectTemplate, name: 'Select Template', icon: ICONS.parser },
    { id: WizardStep.ConfigureRules, name: 'Configure Rules', icon: ICONS.rules },
    { id: 'Review', name: 'Review Output', icon: ICONS.eye },
] as const;

// FIX: The stepper logic was showing the wrong step as active during partner identification.
// This updated logic correctly keeps "Upload & Identify" as the current step
// during both the Upload and IdentifyPartner phases.
const getStepStatus = (stepId: (typeof steps)[number]['id'], currentStepId: WizardStep) => {
    const stepOrder: (WizardStep | 'Review')[] = [WizardStep.Upload, WizardStep.IdentifyPartner, WizardStep.SelectTemplate, WizardStep.ConfigureRules, 'Review'];
    const currentIndex = stepOrder.indexOf(currentStepId);
    const stepIndex = stepOrder.indexOf(stepId);

    // Group Upload and IdentifyPartner visually as one step
    if (stepId === WizardStep.Upload) {
        if (currentStepId === WizardStep.Upload || currentStepId === WizardStep.IdentifyPartner) {
            return 'current';
        }
        if (currentIndex > stepOrder.indexOf(WizardStep.IdentifyPartner)) {
             return 'completed';
        }
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
};

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    // FIX: The filter was causing a TypeScript error because WizardStep.IdentifyPartner is not in the `steps` array.
    // The filter is redundant because the step is already excluded from the visual steps definition.
    const visibleSteps = steps;

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {visibleSteps.map((step, stepIdx) => {
                    // FIX: The status calculation was overly complex and incorrect.
                    // The updated getStepStatus function now handles the logic directly.
                    const status = getStepStatus(step.id, currentStep);
                    
                    return (
                        <li key={step.name} className={`relative ${stepIdx !== visibleSteps.length - 1 ? 'pr-24 sm:pr-32' : ''}`}>
                            {status === 'completed' ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-nifi-accent" />
                                    </div>
                                    <span
                                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-nifi-accent hover:bg-nifi-accent-hover"
                                    >
                                        <Icon path={ICONS.check} className="h-5 w-5 text-white" />
                                    </span>
                                </>
                            ) : status === 'current' ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span
                                        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-nifi-accent bg-white"
                                        aria-current="step"
                                    >
                                        <span className="h-2.5 w-2.5 rounded-full bg-nifi-accent" />
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span
                                        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white"
                                    >
                                    </span>
                                </>
                            )}
                            <div className="absolute top-10 left-4 -translate-x-1/2 w-max">
                                <span className={`text-sm font-medium ${status === 'current' ? 'text-nifi-accent' : 'text-gray-500'}`}>{step.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    );
};