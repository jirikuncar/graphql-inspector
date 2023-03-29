import { GraphQLNamedType } from 'graphql';
import { getKind } from '../../utils/graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  TypeAddedChange,
  TypeDescriptionAddedChange,
  TypeDescriptionChangedChange,
  TypeDescriptionRemovedChange,
  TypeKindChangedChange,
  TypeRemovedChange,
} from './change';

function buildTypeRemovedMessage(type: TypeRemovedChange['meta']): string {
  return `Type '${type.removedTypeName}' was removed`;
}

export function typeRemovedFromMeta(args: TypeRemovedChange) {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.TypeRemoved,
    message: buildTypeRemovedMessage(args.meta),
    meta: args.meta,
    path: args.meta.removedTypeName,
  } as const;
}

export function typeRemoved(type: GraphQLNamedType): Change<ChangeType.TypeRemoved> {
  return typeRemovedFromMeta({
    type: ChangeType.TypeRemoved,
    meta: {
      removedTypeName: type.name,
    },
  });
}

function buildTypeAddedMessage(type: TypeAddedChange['meta']): string {
  return `Type '${type.addedTypeName}' was added`;
}

export function typeAddedFromMeta(args: TypeAddedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeAdded,
    message: buildTypeAddedMessage(args.meta),
    meta: args.meta,
    path: args.meta.addedTypeName,
  } as const;
}

export function typeAdded(type: GraphQLNamedType): Change<ChangeType.TypeAdded> {
  return typeAddedFromMeta({
    type: ChangeType.TypeAdded,
    meta: {
      addedTypeName: type.name,
    },
  });
}

function buildTypeKindChangedMessage(args: TypeKindChangedChange): string {
  return `'${args.meta.typeName}' kind changed from '${args.meta.oldTypeKind}' to '${args.meta.newTypeKind}'`;
}

export function typeKindChangedFromMeta(args: TypeKindChangedChange) {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Changing the kind of a type is a breaking change because it can cause existing queries to error. For example, turning an object type to a scalar type would break queries that define a selection set for this type.`,
    },
    type: ChangeType.TypeKindChanged,
    message: buildTypeKindChangedMessage(args),
    path: args.meta.typeName,
    meta: args.meta,
  } as const;
}

export function typeKindChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change<ChangeType.TypeKindChanged> {
  return typeKindChangedFromMeta({
    type: ChangeType.TypeKindChanged,
    meta: {
      typeName: oldType.name,
      newTypeKind: String(getKind(newType)),
      oldTypeKind: String(getKind(oldType)),
    },
  });
}

function buildTypeDescriptionChangedMessage(args: TypeDescriptionChangedChange['meta']): string {
  return `Description '${args.oldTypeDescription}' on type '${args.typeName}' has changed to '${args.newTypeDescription}'`;
}

export function typeDescriptionChangedFromMeta(args: TypeDescriptionChangedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionChanged,
    message: buildTypeDescriptionChangedMessage(args.meta),
    path: args.meta.typeName,
    meta: args.meta,
  } as const;
}

export function typeDescriptionChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionChanged> {
  return typeDescriptionChangedFromMeta({
    type: ChangeType.TypeDescriptionChanged,
    meta: {
      typeName: oldType.name,
      newTypeDescription: newType.description ?? '',
      oldTypeDescription: oldType.description ?? '',
    },
  });
}

function buildTypeDescriptionRemoved(args: TypeDescriptionRemovedChange['meta']): string {
  return `Description '${args.removedTypeDescription}' was removed from object type '${args.typeName}'`;
}

export function typeDescriptionRemovedFromMeta(args: TypeDescriptionRemovedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionRemoved,
    message: buildTypeDescriptionRemoved(args.meta),
    path: args.meta.typeName,
    meta: args.meta,
  } as const;
}

export function typeDescriptionRemoved(
  type: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionRemoved> {
  return typeDescriptionRemovedFromMeta({
    type: ChangeType.TypeDescriptionRemoved,
    meta: {
      typeName: type.name,
      removedTypeDescription: type.description ?? '',
    },
  });
}

function buildTypeDescriptionAddedMessage(args: TypeDescriptionAddedChange['meta']): string {
  return `Object type '${args.typeName}' has description '${args.addedTypeDescription}'`;
}

export function typeDescriptionAddedFromMeta(args: TypeDescriptionAddedChange) {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionAdded,
    message: buildTypeDescriptionAddedMessage(args.meta),
    path: args.meta.typeName,
    meta: args.meta,
  } as const;
}

export function typeDescriptionAdded(
  type: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionAdded> {
  return typeDescriptionAddedFromMeta({
    type: ChangeType.TypeDescriptionAdded,
    meta: {
      typeName: type.name,
      addedTypeDescription: type.description ?? '',
    },
  });
}
