import { useAtlasmap } from "./AtlasmapProvider";
import React, { useCallback } from "react";
import {
  IMappingDetailsViewProps,
  MappingDetailsView,
  IAtlasmapField,
} from "../Views";
import { DataMapperUtil } from "@atlasmap/core";

export interface IUseSidebarProps {
  onCreateConstant: (
    constants: any | null,
    addToActiveMapping?: boolean,
  ) => void;
  onCreateProperty: (
    isSource: boolean,
    props: any | null,
    addToActiveMapping?: boolean,
  ) => void;
  onRemoveMapping: () => void;
  onEditEnum: (cb: any) => void;
  isEnumMapping: () => boolean;
}

export function useSidebar({
  onCreateConstant,
  onCreateProperty,
  onRemoveMapping,
  onEditEnum,
  isEnumMapping,
}: IUseSidebarProps) {
  const {
    selectedMapping,
    deselectMapping,
    removeMappedFieldFromCurrentMapping,
    fromMappedFieldToIMappingField,
    flatSources,
    flatTargets,
    constants,
    sourceProperties,
    targetProperties,
    canAddToSelectedMapping,
    isFieldAddableToSelection,
    addToCurrentMapping,
    notifications,
    markNotificationRead,
    mappingExpressionEnabled,

    //mapping details
    getMultiplicityActions,
    getMultiplicityActionDelimiters,
    handleIndexChange,
    handleNewTransformation,
    handleRemoveTransformation,
    handleTransformationChange,
    handleTransformationArgumentChange,
    handleMultiplicityChange,
    handleMultiplicityArgumentChange,
  } = useAtlasmap();

  return useCallback(() => {
    if (selectedMapping) {
      const m = selectedMapping.mapping;
      const sources = m
        .getMappedFields(true)
        .map(fromMappedFieldToIMappingField);
      const targets = m
        .getMappedFields(false)
        .map(fromMappedFieldToIMappingField);
      const showSourcesIndex =
        sources.length > 1 &&
        m.transition.isManyToOneMode() &&
        !m.transition.enableExpression;
      const showTargetsIndex =
        targets.length > 1 &&
        m.transition.isOneToManyMode() &&
        !m.transition.enableExpression;

      const multiplicityFieldAction = m.transition.transitionFieldAction;

      let multiplicity: IMappingDetailsViewProps["multiplicity"] = undefined;
      if (multiplicityFieldAction) {
        const transformations = getMultiplicityActions(m);
        const transformationsOptions = transformations.map((a) => ({
          label: DataMapperUtil.toDisplayable(a.name),
          name: a.name,
          value: a.name,
        }));
        const delimiters = getMultiplicityActionDelimiters();
        const delimitersOptions = delimiters.map((a) => ({
          name: a.prettyName!,
          value: a.actualDelimiter,
        }));

        multiplicity = {
          name: multiplicityFieldAction.name,
          transformationsOptions,
          transformationsArguments: multiplicityFieldAction.argumentValues.map(
            (a) => ({
              label: DataMapperUtil.toDisplayable(a.name),
              name: a.name,
              value: a.value,
              options: a.name === "delimiter" ? delimitersOptions : undefined,
            }),
          ),
          onChange: (name) =>
            handleMultiplicityChange(multiplicityFieldAction, name),
          onArgumentChange: (argumentName, arguemntValue) =>
            handleMultiplicityArgumentChange(
              multiplicityFieldAction,
              argumentName,
              arguemntValue,
            ),
        };
      }

      const handleRemoveMappedField = (isSource: boolean, index: number) => {
        const amField = selectedMapping.mapping.getMappedFieldForIndex(
          "" + (index + 1),
          isSource,
        );
        if (amField) {
          removeMappedFieldFromCurrentMapping(amField);
        }
      };

      const addableSources = [
        constants?.fields,
        sourceProperties?.fields,
        flatSources,
      ]
        .flatMap((fields) => (fields ? (fields as IAtlasmapField[]) : []))
        .filter((f) => isFieldAddableToSelection("source", f));

      const addableTargets = [targetProperties?.fields, flatTargets]
        .flatMap((fields) => (fields ? (fields as IAtlasmapField[]) : []))
        .filter((f) => isFieldAddableToSelection("target", f));

      return (
        <MappingDetailsView
          notifications={notifications.filter(
            (n) => n.mappingId === selectedMapping.id && !n.isRead,
          )}
          sources={sources}
          targets={targets}
          addableSources={addableSources}
          addableTargets={addableTargets}
          onClose={deselectMapping}
          onRemoveMapping={onRemoveMapping}
          onRemoveMappedField={handleRemoveMappedField}
          showSourcesIndex={showSourcesIndex}
          showTargetsIndex={showTargetsIndex}
          mappingExpressionEnabled={mappingExpressionEnabled}
          multiplicity={multiplicity}
          onIndexChange={handleIndexChange}
          onNewTransformation={handleNewTransformation}
          onRemoveTransformation={handleRemoveTransformation}
          onTransformationChange={handleTransformationChange}
          onTransformationArgumentChange={handleTransformationArgumentChange}
          onAddFieldToMapping={(_isSource, f) => addToCurrentMapping(f.amField)}
          onNotificationRead={markNotificationRead}
          onEditEnum={onEditEnum}
          isEnumMapping={isEnumMapping}
          onCreateConstant={onCreateConstant}
          onCreateProperty={(isSource) => {
            if (isSource) {
              onCreateProperty(isSource, sourceProperties, true);
            } else {
              onCreateProperty(isSource, targetProperties, true);
            }
          }}
          canAddToSelectedMapping={canAddToSelectedMapping}
        />
      );
    }
    return <>TODO: error</>;
  }, [
    selectedMapping,
    fromMappedFieldToIMappingField,
    constants,
    sourceProperties,
    targetProperties,
    flatSources,
    flatTargets,
    notifications,
    deselectMapping,
    onRemoveMapping,
    onEditEnum,
    isEnumMapping,
    handleIndexChange,
    handleNewTransformation,
    handleRemoveTransformation,
    handleTransformationChange,
    handleTransformationArgumentChange,
    markNotificationRead,
    getMultiplicityActions,
    getMultiplicityActionDelimiters,
    handleMultiplicityChange,
    handleMultiplicityArgumentChange,
    removeMappedFieldFromCurrentMapping,
    isFieldAddableToSelection,
    addToCurrentMapping,
    mappingExpressionEnabled,
    onCreateConstant,
    onCreateProperty,
    canAddToSelectedMapping,
  ]);
}
