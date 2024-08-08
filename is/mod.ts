import { isAny } from "./any.ts";
import { isArray } from "./array.ts";
import { isArrayOf } from "./array_of.ts";
import { isAsyncFunction } from "./async_function.ts";
import { isBigint } from "./bigint.ts";
import { isBoolean } from "./boolean.ts";
import { isFunction } from "./function.ts";
import { isInstanceOf } from "./instance_of.ts";
import { isIntersectionOf } from "./intersection_of.ts";
import { isLiteralOf } from "./literal_of.ts";
import { isLiteralOneOf } from "./literal_one_of.ts";
import { isMap } from "./map.ts";
import { isMapOf } from "./map_of.ts";
import { isNull } from "./null.ts";
import { isNullish } from "./nullish.ts";
import { isNumber } from "./number.ts";
import { isObjectOf } from "./object_of.ts";
import { isOmitOf } from "./omit_of.ts";
import { isParametersOf } from "./parameters_of.ts";
import { isPartialOf } from "./partial_of.ts";
import { isPickOf } from "./pick_of.ts";
import { isPrimitive } from "./primitive.ts";
import { isReadonlyOf } from "./readonly_of.ts";
import { isRecord } from "./record.ts";
import { isRecordObject } from "./record_object.ts";
import { isRecordObjectOf } from "./record_object_of.ts";
import { isRecordOf } from "./record_of.ts";
import { isRequiredOf } from "./required_of.ts";
import { isSet } from "./set.ts";
import { isSetOf } from "./set_of.ts";
import { isStrictOf } from "./strict_of.ts";
import { isString } from "./string.ts";
import { isSymbol } from "./symbol.ts";
import { isSyncFunction } from "./sync_function.ts";
import { isTupleOf } from "./tuple_of.ts";
import { isUndefined } from "./undefined.ts";
import { isUniformTupleOf } from "./uniform_tuple_of.ts";
import { isUnionOf } from "./union_of.ts";
import { isUnknown } from "./unknown.ts";

/**
 * Type predicate function collection.
 *
 * @namespace
 * @borrows isAny as Any
 * @borrows isArray as Array
 * @borrows isArrayOf as ArrayOf
 * @borrows isAsyncFunction as AsyncFunction
 * @borrows isBigint as Bigint
 * @borrows isBoolean as Boolean
 * @borrows isFunction as Function
 * @borrows isInstanceOf as InstanceOf
 * @borrows isIntersectionOf as IntersectionOf
 * @borrows isLiteralOf as LiteralOf
 * @borrows isLiteralOneOf as LiteralOneOf
 * @borrows isMap as Map
 * @borrows isMapOf as MapOf
 * @borrows isNull as Null
 * @borrows isNullish as Nullish
 * @borrows isNumber as Number
 * @borrows isObjectOf as ObjectOf
 * @borrows isOmitOf as OmitOf
 * @borrows isParametersOf as ParametersOf
 * @borrows isPartialOf as PartialOf
 * @borrows isPickOf as PickOf
 * @borrows isPrimitive as Primitive
 * @borrows isReadonlyOf as ReadonlyOf
 * @borrows isRecord as Record
 * @borrows isRecordObject as RecordObject
 * @borrows isRecordObjectOf as RecordObjectOf
 * @borrows isRecordOf as RecordOf
 * @borrows isRequiredOf as RequiredOf
 * @borrows isSet as Set
 * @borrows isSetOf as SetOf
 * @borrows isStrictOf as StrictOf
 * @borrows isString as String
 * @borrows isSymbol as Symbol
 * @borrows isSyncFunction as SyncFunction
 * @borrows isTupleOf as TupleOf
 * @borrows isUndefined as Undefined
 * @borrows isUniformTupleOf as UniformTupleOf
 * @borrows isUnionOf as UnionOf
 * @borrows isUnknown as Unknown
 */
export const is = {
  Any: isAny,
  Array: isArray,
  ArrayOf: isArrayOf,
  AsyncFunction: isAsyncFunction,
  Bigint: isBigint,
  Boolean: isBoolean,
  Function: isFunction,
  InstanceOf: isInstanceOf,
  IntersectionOf: isIntersectionOf,
  LiteralOf: isLiteralOf,
  LiteralOneOf: isLiteralOneOf,
  Map: isMap,
  MapOf: isMapOf,
  Null: isNull,
  Nullish: isNullish,
  Number: isNumber,
  ObjectOf: isObjectOf,
  OmitOf: isOmitOf,
  ParametersOf: isParametersOf,
  PartialOf: isPartialOf,
  PickOf: isPickOf,
  Primitive: isPrimitive,
  ReadonlyOf: isReadonlyOf,
  Record: isRecord,
  RecordObject: isRecordObject,
  RecordObjectOf: isRecordObjectOf,
  RecordOf: isRecordOf,
  RequiredOf: isRequiredOf,
  Set: isSet,
  SetOf: isSetOf,
  StrictOf: isStrictOf,
  String: isString,
  Symbol: isSymbol,
  SyncFunction: isSyncFunction,
  TupleOf: isTupleOf,
  Undefined: isUndefined,
  UniformTupleOf: isUniformTupleOf,
  UnionOf: isUnionOf,
  Unknown: isUnknown,
} as const;
