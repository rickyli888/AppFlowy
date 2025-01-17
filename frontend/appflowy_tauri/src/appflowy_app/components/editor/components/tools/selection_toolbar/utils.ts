import { ReactEditor } from 'slate-react';
import { Editor, Range } from 'slate';
import { getEditorDomNode } from '$app/components/editor/plugins/utils';

export function getSelectionPosition(editor: ReactEditor) {
  const { selection } = editor;

  const isFocused = ReactEditor.isFocused(editor);

  if (!selection || !isFocused || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
    return null;
  }

  const domSelection = window.getSelection();
  const rangeCount = domSelection?.rangeCount;

  if (!rangeCount) return null;

  const domRange = rangeCount > 0 ? domSelection.getRangeAt(0) : undefined;

  const rect = domRange?.getBoundingClientRect();

  let newRect;

  const domNode = getEditorDomNode(editor);
  const domNodeRect = domNode.getBoundingClientRect();

  // the default height of the toolbar is 30px
  const gap = 36;

  if (rect) {
    let relativeDomTop = rect.top - domNodeRect.top;
    const relativeDomLeft = rect.left - domNodeRect.left;

    // if the range is above the window, move the toolbar to the bottom of range
    if (rect.top < gap) {
      relativeDomTop = rect.bottom - gap - domNodeRect.top;
    }

    newRect = {
      top: relativeDomTop,
      left: relativeDomLeft,
      width: rect.width,
      height: rect.height,
    };
  }

  return newRect;
}
