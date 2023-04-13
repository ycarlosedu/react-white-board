import { useEffect, useState } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string, 
  defaultWidth: number,
) => {
  const [minHeight, setMinHeight] = useState(defaultWidth)
  useEffect(() => {
    if (!textAreaRef) return 

    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textAreaRef.style.height = "0px";
    let scrollHeight = textAreaRef.scrollHeight;
    let scrollWidth = textAreaRef.scrollWidth;

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will product an incorrect value.
    if (scrollHeight < defaultWidth) {
      scrollHeight = defaultWidth;
    }

    if (scrollWidth < defaultWidth) {
      textAreaRef.style.width = defaultWidth + "px";
    }
    setMinHeight(scrollHeight)
    textAreaRef.style.height = scrollHeight + "px";
  }, [textAreaRef, value]);
  return minHeight
};

export default useAutosizeTextArea;