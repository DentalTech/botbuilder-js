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
import { TimeZoneConverter } from '../timeZoneConverter';
import { tz } from 'moment-timezone';

/**
 * Convert a timestamp from Universal Time Coordinated (UTC) to a target time zone.
 */
export class ConvertFromUTC extends ExpressionEvaluator {

    private static readonly NoneUtcDefaultDateTimeFormat: string = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

    public constructor(){
        super(ExpressionType.ConvertFromUTC, ConvertFromUTC.evaluator, ReturnType.String, ConvertFromUTC.validator);
    }

    private static evaluator(expression: Expression, state: MemoryInterface, options: Options): {value: any; error: string} {
        let value: any;
        let error: string;
        let args: any[];
        ({args, error} = FunctionUtils.evaluateChildren(expression, state, options));
        if (!error) {
            const format: string = (args.length === 3) ? FunctionUtils.timestampFormatter(args[2]) : ConvertFromUTC.NoneUtcDefaultDateTimeFormat;
            if (typeof (args[0]) === 'string' && typeof (args[1]) === 'string') {
                ({value, error} = ConvertFromUTC.evalConvertFromUTC(args[0], args[1], format));
            } else {
                error = `${expression} cannot evaluate`;
            }
        }

        return {value, error};
    }

    private static evalConvertFromUTC(timeStamp: string, destinationTimeZone: string, format?: string): {value: any; error: string} {
        let result: string;
        let error: string;
        error = FunctionUtils.verifyISOTimestamp(timeStamp);
        const timeZone: string = TimeZoneConverter.windowsToIana(destinationTimeZone);
        if (!TimeZoneConverter.verifyTimeZoneStr(timeZone)) {
            error = `${destinationTimeZone} is not a valid timezone`;
        }

        if (!error) {
            try {
                result = tz(timeStamp, timeZone).format(format);
            } catch (e) {
                error = `${format} is not a valid timestamp format`;
            }
        }

        return {value: result, error};
    }

    private static validator(expression: Expression): void {
        FunctionUtils.validateOrder(expression, [ReturnType.String], ReturnType.String, ReturnType.String);
    }
}