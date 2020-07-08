/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MultivariateNumericEvaluator } from './multivariateNumericEvaluator';
import { ExpressionType } from '../expressionType';

/**
 * Return exponentiation of one number to another.
 */
export class Power extends MultivariateNumericEvaluator {
    public constructor() {
        super(ExpressionType.Power, Power.func);
    }

    private static func(args: any[]): number {
        return Math.pow(args[0], args[1]);
    }
}