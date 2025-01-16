import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { isTextBoxVisibleAtom, textBoxContentAtom } from "../game/store";
import "./textbox.css";

const variants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0.5 },
};

export function useTextBox<T>() {

  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(<></>);
  const resolvePromiseRef = useRef<((value: T) => void) | null>(null);


  const showTextBox = useCallback((textBoxContent: JSX.Element) => {
    setIsVisible(true);
    setContent(textBoxContent);

    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve;
    });

  }, [setIsVisible, setContent])
  const closeTextBox = useCallback((value: T) => {
    if (resolvePromiseRef.current) resolvePromiseRef.current(value); // Resolve the Promise
    setIsVisible(false); // Hide the modal
    setContent(<></>); // Clear content
  }, [setIsVisible, setContent]);


  return {
    setTextBoxVisible: setIsVisible,
    setTextBoxContent: setContent,
    showTextBox,
    closeTextBox,
    textBox: <TextBox content={content} isVisible={isVisible} setIsVisible={setIsVisible} />
  }
}

export default function TextBox({ content, isVisible, setIsVisible }: { content: JSX.Element, isVisible: boolean, setIsVisible: Dispatch<SetStateAction<boolean>> }) {
  const [isCloseRequest, setIsCloseRequest] = useState(false);

  const handleAnimationComplete = () => {
    if (isCloseRequest) {
      setIsVisible(false);
      setIsCloseRequest(false);
    }
  };

  useEffect(() => {
    const closeHandler = (e: KeyboardEvent) => {
      if (!isVisible) return;
      if (e.code === "Space") {
        setIsCloseRequest(true);
      }
    };

    window.addEventListener("keydown", closeHandler);

    return () => {
      window.removeEventListener("keydown", closeHandler);
    };
  }, [isVisible, setIsVisible]);

  return (
    isVisible ? (
      <motion.div
        className="text-box"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isCloseRequest ? "closed" : "open"}
        variants={variants}
        transition={{ duration: 0.2 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {content}
      </motion.div>
    ) : <div></div>
  );
}
