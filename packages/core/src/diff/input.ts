import { GraphQLInputField, GraphQLInputObjectType } from 'graphql';
import { compareLists, diffArrays, isNotEqual, isVoid } from '../utils/compare.js';
import {
  inputFieldAdded,
  inputFieldDefaultValueChanged,
  inputFieldDescriptionAdded,
  inputFieldDescriptionChanged,
  inputFieldDescriptionRemoved,
  inputFieldRemoved,
  inputFieldTypeChanged,
} from './changes/input.js';
import { AddChange } from './schema.js';

export function changesInInputObject(
  oldInput: GraphQLInputObjectType,
  newInput: GraphQLInputObjectType,
  addChange: AddChange,
) {
  const oldFields = oldInput.getFields();
  const newFields = newInput.getFields();

  compareLists(Object.values(oldFields), Object.values(newFields), {
    onAdded(field) {
      addChange(inputFieldAdded(newInput, field));
    },
    onRemoved(field) {
      addChange(inputFieldRemoved(oldInput, field));
    },
    onMutual(field) {
      changesInInputField(oldInput, field.oldVersion, field.newVersion, addChange);
    },
  });
}

function changesInInputField(
  input: GraphQLInputObjectType,
  oldField: GraphQLInputField,
  newField: GraphQLInputField,
  addChange: AddChange,
) {
  if (isNotEqual(oldField.description, newField.description)) {
    if (isVoid(oldField.description)) {
      addChange(inputFieldDescriptionAdded(input, newField));
    } else if (isVoid(newField.description)) {
      addChange(inputFieldDescriptionRemoved(input, oldField));
    } else {
      addChange(inputFieldDescriptionChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.defaultValue, newField.defaultValue)) {
    if (Array.isArray(oldField.defaultValue) && Array.isArray(newField.defaultValue)) {
      if (diffArrays(oldField.defaultValue, newField.defaultValue).length > 0) {
        addChange(inputFieldDefaultValueChanged(input, oldField, newField));
      }
    } else if (JSON.stringify(oldField.defaultValue) !== JSON.stringify(newField.defaultValue)) {
      addChange(inputFieldDefaultValueChanged(input, oldField, newField));
    }
  }

  if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
    addChange(inputFieldTypeChanged(input, oldField, newField));
  }
}
