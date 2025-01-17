"use client";

import { useEffect, useState } from "react";

import List from "@/components/common/list/list";
import Modal from "@/components/common/modal/modal";
import Button from "@/components/common/button/button";
import Buttons from "@/components/common/button/buttons";

import { Option } from "@/interfaces/option";

import "./select-entity-modal.scss";

interface SelectEntityModalProps {
  show: boolean;
  files: File[] | undefined;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

export default function SelectEntityModal(props: SelectEntityModalProps) {
  const { show, files, onClose, onFileSelected } = props;

  const [options, setOptions] = useState<Option<File>[]>([]);

  useEffect(() => {
    if (!files) return;

    setOptions(
      files.map((file: File) => ({
        id: file.name,
        label: file.name,
        selected: false,
        data: file,
      }))
    );
  }, [files]);

  return (
    <div className="jmugen-select-entity-modal">
      <Modal
        show={show}
        enableClose={true}
        enableOverlayClose={true}
        title="Select the entity"
        body={
          <List
            options={options}
            onSelect={(option: Option<File>) => {
              setOptions(
                options.map((o: Option<File>) => ({
                  ...o,
                  selected: o.id === option.id,
                }))
              );
            }}
          />
        }
        footer={
          <Buttons type="right">
            <Button
              type="primary"
              label="Ok"
              onClick={() => {
                onClose();

                const option = options.find((option: Option<File>) => {
                  return option.selected;
                });
                if (!option || !option.data) return;

                onFileSelected(option.data);
              }}
            />
          </Buttons>
        }
        onClose={onClose}
      />
    </div>
  );
}
