import { action } from '@storybook/addon-actions';
import React, { createElement, useState } from 'react';
import { Atlasmap } from '../src/atlasmap';
import { ElementId, ElementType, IMappings } from '../src/models';
import { mappings as sampleMappings, sources, targets } from './sampleData';

export default {
  title: 'Mapper',
};

export const sample = () => createElement(() => {
  const [mappings, setMappings] = useState<IMappings[]>(sampleMappings);
  const addToMapping = (elementId: ElementId, elementType: ElementType, mappingId: string) => {
    const updatedMappings = mappings.map(m => {
      if (m.id === mappingId) {
        if (elementType === 'source') {
          m.sourceFields = [...m.sourceFields, {id: elementId, name: elementId, tip: elementId}];
        } else {
          m.targetFields = [...m.targetFields, {id: elementId, name: elementId, tip: elementId}];
        }
      }
      return m;
    });
    setMappings(updatedMappings)
  };
  return (
    <Atlasmap
      sources={sources}
      targets={targets}
      mappings={mappings}
      addToMapping={addToMapping}
      onImportAtlasFile={action('importAtlasFile')}
      onExportAtlasFile={action('exportAtlasFile')}
      onResetAtlasmap={action('resetAtlasmap')}
      onSourceSearch={action('onSourceSearch')}
      onTargetSearch={action('onTargetSearch')}
      pending={false}
      error={false}
    />
  );
});