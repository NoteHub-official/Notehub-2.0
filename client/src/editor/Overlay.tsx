import { CaretPosition, CursorOverlayState, useRemoteCursorOverlayPositions } from "@slate-yjs/react";
import clsx from "clsx";
import React, { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from "react";

export type CursorData = {
  name: string;
  color: string;
};

export type CaretProps = {
  position: CaretPosition;
  data: CursorData;
};

export function Caret({ position, data }: CaretProps) {
  const [show, setShow] = useState(true);

  const caretStyle: CSSProperties = {
    ...position,
    background: data.color,
  };

  const labelStyle: CSSProperties = {
    transform: "translateY(-100%)",
    background: data.color,
  };

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [position, data]);

  return (
    <div style={caretStyle} className="w-0.5 absolute">
      <div
        className="absolute text-xs text-white whitespace-nowrap top-0 rounded rounded-bl-none px-1.5 py-0.5"
        style={{ ...labelStyle }}
      >
        {data.name}
      </div>
    </div>
  );
}

export function RemoteSelection({
  data,
  selectionRects,
  caretPosition,
}: CursorOverlayState<CursorData>) {
  if (!data) {
    return null;
  }

  const selectionStyle: CSSProperties = {
    // Add a opacity to the background color
    backgroundColor: `${data.color}66`,
  };

  return (
    <React.Fragment>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="absolute pointer-events-none"
          // eslint-disable-next-line react/no-array-index-key
          key={i}
        />
      ))}
      {caretPosition && <Caret position={caretPosition} data={data} />}
    </React.Fragment>
  );
}

type RemoteCursorsProps = PropsWithChildren<{
  className?: string;
}>;

export function RemoteCursorOverlay({ className, children }: RemoteCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cursors } = useRemoteCursorOverlayPositions<CursorData>({
    containerRef,
  });

  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      {children}
      {cursors.map((cursor) => (
        <RemoteSelection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  );
}
