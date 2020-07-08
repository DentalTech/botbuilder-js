/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { NumberTransformEvaluator } from './numberTransformEvaluator';
import { ExpressionType } from '../expressionType';

/**
 * Returns the smallest integral value that is greater than or equal to the specified number.
 */
export class Ceiling extends NumberTransformEvaluator {
    public constructor(){
        super(ExpressionType.Ceiling, Ceiling.func);
    }

    private static func(args: any[]): number {
        return Math.ceil(args[0]);
    }
}