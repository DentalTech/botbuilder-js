/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ExpressionEvaluator } from '../expressionEvaluator';
import { ReturnType, Expression } from '../expression';
import { ExpressionType } from '../expressionType';
import { FunctionUtils } from '../functionUtils';
import { MemoryInterface } from '../memory/memoryInterface';
import { Options } from '../options';

/**
 * Return the scheme value of a unified resource identifier (URI).
 */
export class UriScheme extends ExpressionEvaluator {
    public constructor(){
        super(ExpressionType.UriScheme, UriScheme.evaluator, ReturnType.String, FunctionUtils.validateUnary);
    }

    private static evaluator(expr: Expression, state: MemoryInterface, options: Options): {value: any; error: string} {
        let value: any;
        let error: string;
        let args: any[];
        ({args, error} = FunctionUtils.evaluateChildren(expr, state, options));
        if (!error) {
            if (typeof (args[0]) === 'string') {
                ({value, error} = UriScheme.evalUriScheme(args[0]));
            } else {
                error = `${expr} cannot evaluate`;
            }
        }

        return {value, error};
    }

    private static evalUriScheme(uri: string): {value: any; error: string} {
        let result: string;
        let error: string;
        let parsed: URL;
        ({value: parsed, error} = FunctionUtils.parseUri(uri));
        if (!error) {
            try {
                result = parsed.protocol.replace(':', '');
            } catch (e) {
                error = 'invalid operation, input uri should be an absolute URI';
            }
        }

        return {value: result, error};
    }
}