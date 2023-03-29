import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
import { isDeprecated } from '../../utils/is-deprecated';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  EnumValueAddedChange,
  EnumValueDeprecationReasonAddedChange,
  EnumValueDeprecationReasonChangedChange,
  EnumValueDeprecationReasonRemovedChange,
  EnumValueDescriptionChangedChange,
  EnumValueRemovedChange,
} from './change';

function buildEnumValueRemovedMessage(args: EnumValueRemovedChange['meta']) {
  return `Enum value '${args.removedEnumValueName}' ${
    args.isEnumValueDeprecated ? '(deprecated) ' : ''
  }was removed from enum '${args.enumName}'`;
}

const enumValueRemovedCriticalityBreakingReason = `Removing an enum value will cause existing queries that use this enum value to error.`;

export function enumValueRemovedFromMeta(args: EnumValueRemovedChange) {
  return {
    type: ChangeType.EnumValueRemoved,
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: enumValueRemovedCriticalityBreakingReason,
    },
    message: buildEnumValueRemovedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.enumName, args.meta.removedEnumValueName].join('.'),
  } as const;
}

export function enumValueRemoved(
  oldEnum: GraphQLEnumType,
  value: GraphQLEnumValue,
): Change<ChangeType.EnumValueRemoved> {
  return enumValueRemovedFromMeta({
    type: ChangeType.EnumValueRemoved,
    meta: {
      enumName: oldEnum.name,
      removedEnumValueName: value.name,
      isEnumValueDeprecated: isDeprecated(value),
    },
  });
}

function buildEnumValueAddedMessage(args: EnumValueAddedChange) {
  return `Enum value '${args.meta.addedEnumValueName}' was added to enum '${args.meta.enumName}'`;
}

const enumValueAddedCriticalityDangerousReason = `Adding an enum value may break existing clients that were not programming defensively against an added case when querying an enum.`;

export function enumValueAddedFromMeta(args: EnumValueAddedChange) {
  return {
    type: ChangeType.EnumValueAdded,
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason: enumValueAddedCriticalityDangerousReason,
    },
    message: buildEnumValueAddedMessage(args),
    meta: args.meta,
    path: [args.meta.enumName, args.meta.addedEnumValueName].join('.'),
  } as const;
}

export function enumValueAdded(
  newEnum: GraphQLEnumType,
  value: GraphQLEnumValue,
): Change<ChangeType.EnumValueAdded> {
  return enumValueAddedFromMeta({
    type: ChangeType.EnumValueAdded,
    meta: {
      enumName: newEnum.name,
      addedEnumValueName: value.name,
    },
  });
}

function buildEnumValueDescriptionChangedMessage(args: EnumValueDescriptionChangedChange['meta']) {
  return args.oldEnumValueDescription === null
    ? `Description '${args.newEnumValueDescription ?? 'undefined'}' was added to enum value '${
        args.enumName
      }.${args.enumValueName}'`
    : `Description for enum value '${args.enumName}.${args.enumValueName}' changed from '${
        args.oldEnumValueDescription ?? 'undefined'
      }' to '${args.newEnumValueDescription ?? 'undefined'}'`;
}

export function enumValueDescriptionChangedFromMeta(
  args: EnumValueDescriptionChangedChange,
): Change<ChangeType.EnumValueDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDescriptionChanged,
    message: buildEnumValueDescriptionChangedMessage(args.meta),
    path: [args.meta.enumName, args.meta.enumValueName].join('.'),
    meta: args.meta,
  } as const;
}

export function enumValueDescriptionChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDescriptionChanged> {
  return enumValueDescriptionChangedFromMeta({
    type: ChangeType.EnumValueDescriptionChanged,
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      oldEnumValueDescription: oldValue.description ?? null,
      newEnumValueDescription: newValue.description ?? null,
    },
  });
}

function buildEnumValueDeprecationChangedMessage(args: EnumValueDeprecationReasonChangedChange['meta']) {
  return `Enum value '${args.enumName}.${args.enumValueName}' deprecation reason changed from '${args.oldEnumValueDeprecationReason}' to '${args.newEnumValueDeprecationReason}'`;
}

export function enumValueDeprecationReasonChangedFromMeta(args: EnumValueDeprecationReasonChangedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonChanged,
    message: buildEnumValueDeprecationChangedMessage(args.meta),
    path: [args.meta.enumName, args.meta.enumValueName].join('.'),
    meta: args.meta,
  } as const;
}

export function enumValueDeprecationReasonChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonChanged> {
  return enumValueDeprecationReasonChangedFromMeta({
    type: ChangeType.EnumValueDeprecationReasonChanged,
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      oldEnumValueDeprecationReason: oldValue.deprecationReason ?? '',
      newEnumValueDeprecationReason: newValue.deprecationReason ?? '',
    },
  });
}

function buildEnumValueDeprecationReasonAddedMessage(
  args: EnumValueDeprecationReasonAddedChange['meta'],
) {
  return `Enum value '${args.enumName}.${args.enumValueName}' was deprecated with reason '${args.addedValueDeprecationReason}'`;
}

export function enumValueDeprecationReasonAddedFromMeta(args: EnumValueDeprecationReasonAddedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonAdded,
    message: buildEnumValueDeprecationReasonAddedMessage(args.meta),
    path: [args.meta.enumName, args.meta.enumValueName].join('.'),
    meta: args.meta,
  } as const;
}

export function enumValueDeprecationReasonAdded(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonAdded> {
  return enumValueDeprecationReasonAddedFromMeta({
    type: ChangeType.EnumValueDeprecationReasonAdded,
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      addedValueDeprecationReason: newValue.deprecationReason ?? '',
    },
  });
}

function buildEnumValueDeprecationReasonRemovedMessage(
  args: EnumValueDeprecationReasonRemovedChange['meta'],
) {
  return `Deprecation reason was removed from enum value '${args.enumName}.${args.enumValueName}'`;
}

export function enumValueDeprecationReasonRemovedFromMeta(args: EnumValueDeprecationReasonRemovedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonRemoved,
    message: buildEnumValueDeprecationReasonRemovedMessage(args.meta),
    path: [args.meta.enumName, args.meta.enumValueName].join('.'),
    meta: args.meta,
  } as const;
}

export function enumValueDeprecationReasonRemoved(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  _newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonRemoved> {
  return enumValueDeprecationReasonRemovedFromMeta({
    type: ChangeType.EnumValueDeprecationReasonRemoved,
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      removedEnumValueDeprecationReason: oldValue.deprecationReason ?? '',
    },
  });
}
