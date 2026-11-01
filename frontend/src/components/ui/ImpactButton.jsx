import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

function ImpactButton({ children, className = "", onClick, ...buttonProps }) {
  const [ripple, setRipple] = useState(null);
  const rippleId = useRef(0);
  const reduceMotion = useReducedMotion();

  const triggerImpact = (event) => {
    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    if (!reduceMotion) {
      setRipple({
        id: ++rippleId.current,
        x: event.clientX ? event.clientX - bounds.left : bounds.width / 2,
        y: event.clientY ? event.clientY - bounds.top : bounds.height / 2,
      });
    }
    onClick?.(event);
  };

  return (
    <motion.button
      {...buttonProps}
      onClick={triggerImpact}
      whileHover={reduceMotion ? undefined : { y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`impact-button ${className}`}
    >
      <span className="impact-button-content">{children}</span>
      <AnimatePresence>
        {ripple && (
          <span
            key={ripple.id}
            className="impact-button-ripple"
            aria-hidden="true"
          >
            <motion.span
              className="impact-button-ripple-wave"
              initial={{ scale: 0, opacity: 0.48 }}
              animate={{ scale: 22, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ left: ripple.x, top: ripple.y }}
              onAnimationComplete={() =>
                setRipple((current) =>
                  current?.id === ripple.id ? null : current,
                )
              }
            />
          </span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default ImpactButton;
