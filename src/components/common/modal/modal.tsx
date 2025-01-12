"use client";

import { MouseEvent, ReactNode } from "react";

import "./modal.scss";

interface ModalProps {
  show: boolean;
  enableClose?: boolean;
  enableOverlayClose?: boolean;
  title?: string;
  content?: string;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export default function Modal(props: ModalProps) {
  const {
    show,
    enableClose,
    enableOverlayClose,
    title,
    content,
    header,
    body,
    footer,
    onClose,
  } = props;

  return (
    <div
      className={`
        jmugen-modal-overlay 
        jmugen-modal-overlay--${show ? "visible" : "hidden"}
      `}
      onClick={enableOverlayClose ? onClose : undefined}
    >
      <div
        className="jmugen-modal"
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        {title && (
          <div className="jmugen-modal__header">
            <div className="jmugen-modal__header-left">
              <p className="jmugen-modal__title">{title}</p>
            </div>
            <div className="jmugen-modal__header-right">
              {enableClose && (
                <i
                  className="jmugen-modal__close isax isax-add"
                  onClick={onClose}
                />
              )}
            </div>
          </div>
        )}

        {header}

        {content && (
          <div className="jmugen-modal__body">
            <p className="jmugen-modal__content">{content}</p>
          </div>
        )}

        {body}

        {footer && <div className="jmugen-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
