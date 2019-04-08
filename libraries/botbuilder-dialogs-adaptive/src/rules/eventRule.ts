/**
 * @module botbuilder-planning
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Dialog, DialogEvent } from 'botbuilder-dialogs';
import { PlanningContext, PlanChangeList, PlanChangeType, PlanStepState } from '../planningContext';
import { PlanningRule } from './planningRule';

/**
 * This rule is triggered when a dialog event matching a list of event names is emitted.
 */
export class EventRule implements PlanningRule {

    /**
     * List of events to filter to.
     */
    public readonly events: string[];

    /**
     * List of steps to update the plan with when triggered.
     */
    public readonly steps: Dialog[];

    /**
     * Creates a new `EventRule` instance.
     * @param events (Optional) list of events to filter to.
     * @param steps (Optional) list of steps to update the plan with when triggered.
     */
    constructor(events?: string|string[], steps?: Dialog[]) {
        this.events = Array.isArray(events) ? events : (events !== undefined ? [events] : []);
        this.steps = steps || [];
    }

    public evaluate(planning: PlanningContext, event: DialogEvent, memory: object): Promise<PlanChangeList[]|undefined> {
        // Limit evaluation to only supported events
        if (this.events.indexOf(event.name) >= 0) {
            return this.onEvaluate(planning, event, memory);
        } else {
            return undefined;
        }
    }

    protected async onEvaluate(planning: PlanningContext, event: DialogEvent, memory: object): Promise<PlanChangeList[]|undefined> {
        if (await this.onIsTriggered(planning, event, memory)) {
            return [this.onCreateChangeList(planning, event)];
        }
    }

    protected async onIsTriggered(planning: PlanningContext, event: DialogEvent, memory: object): Promise<boolean> {
        return true;
    }

    protected onCreateChangeList(planning: PlanningContext, event: DialogEvent, dialogOptions?: any): PlanChangeList {
        const changeList: PlanChangeList = { changeType: PlanChangeType.doSteps, steps: [] };
        this.steps.forEach((step) => {
            const stepState: PlanStepState = { dialogStack: [], dialogId: step.id };
            if (dialogOptions !== undefined) {
                stepState.options = dialogOptions;
            }
            changeList.steps.push(stepState);
        });

        return changeList;
    }
}