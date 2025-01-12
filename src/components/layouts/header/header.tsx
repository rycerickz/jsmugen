"use client";

import { useCallback, useState } from "react";

import Button from "@/components/common/button/button";
import Toolbar from "@/components/common/toolbar/toolbar";
import Separator from "@/components/common/separator/separator";

import SelectEntityModal from "@/components/layouts/header/modals/select-entity-modal/select-entity-modal";

import { processEntity } from "@/utils/entity-manager";
import { filterFiles, selectFiles } from "@/utils/file-manager";

import { View } from "@/types/view";

import { Entity } from "@/interfaces/entity";

import {
  SUPPORTED_EXTENSIONS,
  FILTERED_EXTENSIONS,
} from "@/constants/extensions";

import {
  DEFINITIONS_VIEW,
  SPRITES_VIEW,
  ANIMATIONS_VIEW,
  STATES_VIEW,
  COMMANDS_VIEW,
  SOUNDS_VIEW,
} from "@/constants/views";

import "./header.scss";

interface HeaderProps {
  view: View;
  entity: Entity | undefined;
  onViewChange: (view: View) => void;
  onEntityChange: (entity: Entity | undefined) => void;
}

export default function Header(props: HeaderProps) {
  const { view, entity, onViewChange, onEntityChange } = props;

  const [showSelectEntityModal, setShowSelectEntityModal] = useState(false);

  const [files, setFiles] = useState<File[] | undefined>();
  const [filteredFiles, setFilteredFiles] = useState<File[] | undefined>();

  const onSelectEntity = useCallback(async () => {
    const files = await selectFiles(SUPPORTED_EXTENSIONS);
    if (!files || files.length === 0) return;
    setFiles(files);

    const filteredFiles = filterFiles(files, FILTERED_EXTENSIONS);
    if (filteredFiles.length === 0) return;
    setFilteredFiles(filteredFiles);

    setShowSelectEntityModal(true);
  }, []);

  const onProcessEntity = useCallback(
    async (file: File) => {
      if (!files) return;

      const entity = await processEntity(file, files);
      if (!entity) return;

      onEntityChange(entity);
      onViewChange(DEFINITIONS_VIEW);
    },
    [files, onEntityChange, onViewChange]
  );

  return (
    <>
      <div className="jmugen-header">
        <Toolbar>
          <Button
            type="toolbar"
            iconLeft="isax isax-folder"
            onClick={onSelectEntity}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-folder-minus"
            onClick={() => {
              onViewChange("none");
              onEntityChange(undefined);
            }}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-save-2"
            disabled={true}
            onClick={() => {
              // TODO: save.
            }}
          />
        </Toolbar>

        <Separator orientation="vertical" />

        <Toolbar>
          <Button
            type="toolbar"
            iconLeft="isax isax-document-text"
            active={view === DEFINITIONS_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(DEFINITIONS_VIEW)}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-image"
            active={view === SPRITES_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(SPRITES_VIEW)}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-video-square"
            active={view === ANIMATIONS_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(ANIMATIONS_VIEW)}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-code-1"
            active={view === STATES_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(STATES_VIEW)}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-game"
            active={view === COMMANDS_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(COMMANDS_VIEW)}
          />
          <Button
            type="toolbar"
            iconLeft="isax isax-sound"
            active={view === SOUNDS_VIEW}
            disabled={!entity}
            onClick={() => onViewChange(SOUNDS_VIEW)}
          />
        </Toolbar>
      </div>

      <SelectEntityModal
        show={showSelectEntityModal}
        files={filteredFiles}
        onClose={() => setShowSelectEntityModal(false)}
        onFileSelected={onProcessEntity}
      />
    </>
  );
}
