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
