import { useEffect, useRef, useState } from "react";

export type ReadMoreContentBoxProps = {
  lines: number;
  title?: string;
  children: React.ReactNode; // the clampable text only
  linkCls?: string;
  contentBoxCls?: string;
};

function ReadMoreContentBox({
  lines,
  title,
  children,
  linkCls,
  contentBoxCls,
}: ReadMoreContentBoxProps) {
  const [fitContent, toggleFitContent] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [overFlown, setIsOverFlown] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Measure on next frame so layout has settled (esp. after async data loads)
    const raf = requestAnimationFrame(() => {
      setIsOverFlown(element.scrollHeight > element.clientHeight + 1);
    });
    return () => cancelAnimationFrame(raf);
  }, [children, lines]);

  return (
    <div
      className={`flex flex-col p-5 gap-6 rounded-[10px] ${
        contentBoxCls ?? ""
      } bg-white`}
    >
      <div className="flex flex-col gap-4">
        {title && <h3 className="font-medium text-base">{title}</h3>}
        <p
          ref={textRef}
          className="text-sm"
          style={
            !fitContent
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: lines,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {children}
        </p>
      </div>

      {overFlown && (
        <a
          onClick={() => toggleFitContent((curr) => !curr)}
          className={`text-brand-dark text-sm cursor-pointer ${linkCls ?? ""}`}
        >
          Read {fitContent ? "Less" : "More"}
        </a>
      )}
    </div>
  );
}

export default ReadMoreContentBox;
