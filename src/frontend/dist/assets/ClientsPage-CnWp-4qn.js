import { c as createLucideIcon, r as reactExports, A as useComposedRefs, D as useDirection, j as jsxRuntimeExports, E as createContextScope, G as Primitive, H as composeEventHandlers, J as useCallbackRef, K as useLayoutEffect2, M as clamp, N as cn, O as useClients, Q as useCreateClient, R as useDeleteClient, T as useAllVisits, a as useNavigate, b as useInternetIdentity, U as Users, B as Button, p as LoaderCircle, L as Label, I as Input, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, V as Search, S as Skeleton, h as Badge, y as ue } from "./index-B35ZsBaz.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dx5L2af-.js";
import { C as Checkbox } from "./checkbox-3sZKEVxp.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-By5XpH_Y.js";
import { P as Presence } from "./index-D9TW8sPI.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DrCVGfIm.js";
import { T as Textarea } from "./textarea-BSm-TJHQ.js";
import { D as Download } from "./download-DfhWrGN8.js";
import { U as Upload } from "./upload-DnyTotmE.js";
import { F as FileDown } from "./file-down-Dg8soP5s.js";
import { P as Plus } from "./plus-CePg9O6D.js";
import { B as Building2 } from "./building-2-Bc-1Jyoz.js";
import { C as Calendar } from "./calendar-BTmADWLM.js";
import { T as Trash2 } from "./trash-2-y2naHm-4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["line", { x1: "3", x2: "21", y1: "9", y2: "9", key: "1vqk6q" }],
  ["line", { x1: "3", x2: "21", y1: "15", y2: "15", key: "o2sbyz" }],
  ["line", { x1: "9", x2: "9", y1: "9", y2: "21", key: "1ib60c" }],
  ["line", { x1: "15", x2: "15", y1: "9", y2: "21", key: "1n26ft" }]
];
const Sheet = createLucideIcon("sheet", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function encodeContacts(notes, contacts) {
  const stripped = notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
  if (contacts.length === 0) return stripped;
  const encoded = btoa(JSON.stringify(contacts));
  return `[CONTACTS:${encoded}]${stripped ? ` ${stripped}` : ""}`;
}
function decodeContacts(notes) {
  const m = notes.match(/\[CONTACTS:([^\]]+)\]/);
  if (!m) return [];
  try {
    return JSON.parse(atob(m[1]));
  } catch {
    return [];
  }
}
function stripContactsTag(notes) {
  return notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
}
function genContactId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
const INDUSTRY_OPTIONS = [
  "Steel Plant",
  "Cement Plant",
  "Mining",
  "Power Plant",
  "Pharmaceutical",
  "Textile",
  "Other"
];
const INDUSTRY_BADGE_CLASSES = {
  "Steel Plant": "bg-slate-50 text-slate-700 border-slate-200",
  "Cement Plant": "bg-stone-50 text-stone-700 border-stone-200",
  Mining: "bg-amber-50 text-amber-700 border-amber-200",
  "Power Plant": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Pharmaceutical: "bg-blue-50 text-blue-700 border-blue-200",
  Textile: "bg-purple-50 text-purple-700 border-purple-200",
  Other: "bg-muted text-muted-foreground border-border"
};
function encodeIndustry(notes, industry) {
  const stripped = notes.replace(/\[IND:[^\]]*\]\s*/g, "");
  if (!industry || industry === "none") return stripped;
  return `[IND:${industry}]${stripped ? ` ${stripped}` : ""}`;
}
function extractIndustry(notes) {
  const m = notes.match(/\[IND:([^\]]+)\]/);
  return m ? m[1] : "";
}
function stripIndustryTag(notes) {
  return notes.replace(/\[IND:[^\]]*\]\s*/g, "").trim();
}
const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  industry: "none",
  notes: ""
};
const SAMPLE_CLIENTS = [
  {
    name: "Swapnil Sir",
    company: "BRPL Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Supply payment follow-up"
  },
  {
    name: "Aaksh Kumar",
    company: "PPL Pradeep",
    phone: "",
    email: "",
    address: "Pradeep, Odisha",
    notes: "[IND:Steel Plant] Supply & service payment follow-up"
  },
  {
    name: "Annant Kumar",
    company: "Jagnnath Steel RSP Rourkela",
    phone: "",
    email: "",
    address: "Rourkela, Odisha",
    notes: "[IND:Steel Plant] 300 MTR liner inquiry, April expected"
  },
  {
    name: "Uttam Poul",
    company: "Rashmi Metallic Unit 1",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Ceramic liner + 200 UHMWPE roller inquiry"
  },
  {
    name: "Brijndan Mandal",
    company: "JSL Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] Ceramic liner + pallet plant inquiry"
  },
  {
    name: "Contact",
    company: "Shyam Metallic Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Roller offer finalization next week"
  },
  {
    name: "Contact",
    company: "IMFA Steel Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] New project inquiry this month"
  },
  {
    name: "Contact",
    company: "Gerawa Steel Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Belt scraper requirement, visit required"
  },
  {
    name: "Suni Giri",
    company: "Bengal Energy Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Power Plant] Visit planned"
  },
  {
    name: "Anil Sahu",
    company: "Rungta Kalyani",
    phone: "",
    email: "",
    address: "Kalyani, WB",
    notes: "[IND:Mining] 3300 MTR order + belt scraper finalization"
  },
  {
    name: "Bhagat Ji",
    company: "Vedanta Bhadrak",
    phone: "",
    email: "",
    address: "Bhadrak, Odisha",
    notes: "[IND:Steel Plant] Rubber panel finalization this month"
  },
  {
    name: "Tapan",
    company: "MECON Dhanbad",
    phone: "",
    email: "",
    address: "Dhanbad, Jharkhand",
    notes: "[IND:Other] Ceramic discussion, visit planned"
  }
];
function printClientsPDF(clients) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const rows = clients.map(
    (c) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.company}</td>
        <td>${extractIndustry(c.notes) || "—"}</td>
        <td>${c.phone || "—"}</td>
        <td>${c.email || "—"}</td>
        <td>${c.address || "—"}</td>
      </tr>`
  ).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Client List – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 7px 6px; border: 1px solid #ddd; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
        .count { color: #666; font-size: 11px; margin-bottom: 8px; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Client Directory</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Clients: ${clients.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Industry</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
function downloadSampleCSV() {
  const csvContent = "Name,Company,Phone,Email,Address,Industry,Notes\nRaju Singh,BRPL Barbil,9876543210,raju@brpl.com,Barbil Odisha,Steel Plant,Payment follow-up";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample_clients.csv";
  link.click();
  URL.revokeObjectURL(url);
}
function toTitleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
function detectBusiness(rawName) {
  const words = rawName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    const personName = words.slice(0, 2).map(toTitleCase).join(" ");
    const companyName = words.slice(2).map(toTitleCase).join(" ");
    return { isBusiness: true, personName, companyName };
  }
  return {
    isBusiness: false,
    personName: words.map(toTitleCase).join(" "),
    companyName: ""
  };
}
function ClientsPage() {
  const [search, setSearch] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [phoneError, setPhoneError] = reactExports.useState("");
  const [isBulkAdding, setIsBulkAdding] = reactExports.useState(false);
  const [isImporting, setIsImporting] = reactExports.useState(false);
  const [isImportingExcel, setIsImportingExcel] = reactExports.useState(false);
  const csvInputRef = reactExports.useRef(null);
  const excelInputRef = reactExports.useRef(null);
  const [phoneContacts, setPhoneContacts] = reactExports.useState([]);
  const [phoneImportOpen, setPhoneImportOpen] = reactExports.useState(false);
  const [isPhoneImporting, setIsPhoneImporting] = reactExports.useState(false);
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();
  const { data: allVisits } = useAllVisits();
  const lastVisitMap = /* @__PURE__ */ new Map();
  for (const v of allVisits ?? []) {
    const key = v.clientId.toString();
    const existing = lastVisitMap.get(key);
    if (!existing || v.plannedDate > existing) {
      lastVisitMap.set(key, v.plannedDate);
    }
  }
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const filtered = (clients ?? []).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );
  const validatePhone = (phone) => {
    if (!phone) return true;
    if (phone.replace(/\D/g, "").length !== 10) {
      setPhoneError("Phone must be exactly 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!identity) return;
    if (!validatePhone(form.phone)) return;
    try {
      const notesWithIndustry = encodeIndustry(
        form.notes.trim(),
        form.industry
      );
      await createClient.mutateAsync({
        id: 0n,
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        notes: notesWithIndustry,
        createdAt: BigInt(Date.now()) * 1000000n,
        updatedAt: BigInt(Date.now()) * 1000000n,
        createdBy: identity.getPrincipal()
      });
      ue.success("Client added successfully");
      setForm(emptyForm);
      setPhoneError("");
      setAddOpen(false);
    } catch {
      ue.error("Failed to add client");
    }
  };
  const handleBulkAdd = async () => {
    if (!identity) return;
    setIsBulkAdding(true);
    try {
      for (const c of SAMPLE_CLIENTS) {
        await createClient.mutateAsync({
          id: 0n,
          name: c.name,
          company: c.company,
          phone: c.phone,
          email: c.email,
          address: c.address,
          notes: c.notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
      }
      ue.success("12 sample clients added!");
    } catch {
      ue.error("Failed to add some clients. Please try again.");
    } finally {
      setIsBulkAdding(false);
    }
  };
  const handleCSVImport = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !identity) return;
    e.target.value = "";
    setIsImporting(true);
    ue("Importing clients...");
    try {
      const text = await file.text();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const dataLines = lines.slice(1);
      let count = 0;
      for (const line of dataLines) {
        const cols = line.split(",");
        const name = (cols[0] ?? "").trim();
        if (!name) continue;
        const company = (cols[1] ?? "").trim();
        const phone = (cols[2] ?? "").trim();
        const email = (cols[3] ?? "").trim();
        const address = (cols[4] ?? "").trim();
        const industry = (cols[5] ?? "").trim();
        const rawNotes = (cols[6] ?? "").trim();
        const notes = encodeIndustry(rawNotes, industry);
        await createClient.mutateAsync({
          id: 0n,
          name,
          company,
          phone,
          email,
          address,
          notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
        count++;
      }
      ue.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      ue.error("Import failed. Please check the CSV format.");
    } finally {
      setIsImporting(false);
    }
  };
  const handleExcelImport = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !identity) return;
    e.target.value = "";
    setIsImportingExcel(true);
    ue("Importing from CSV/Excel (save as CSV first)...");
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const dataLines = lines.slice(1);
      let count = 0;
      for (const line of dataLines) {
        const sep = line.includes("	") ? "	" : ",";
        const cols = line.split(sep);
        const name = (cols[0] ?? "").replace(/^"|"$/g, "").trim();
        if (!name) continue;
        const company = (cols[1] ?? "").replace(/^"|"$/g, "").trim();
        const phone = (cols[2] ?? "").replace(/^"|"$/g, "").trim();
        const email = (cols[3] ?? "").replace(/^"|"$/g, "").trim();
        const address = (cols[4] ?? "").replace(/^"|"$/g, "").trim();
        const industry = (cols[5] ?? "").replace(/^"|"$/g, "").trim();
        const rawNotes = (cols[6] ?? "").replace(/^"|"$/g, "").trim();
        const notes = encodeIndustry(rawNotes, industry);
        await createClient.mutateAsync({
          id: 0n,
          name,
          company,
          phone,
          email,
          address,
          notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
        count++;
      }
      ue.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      ue.error("Import failed. Please save the Excel file as CSV first.");
    } finally {
      setIsImportingExcel(false);
    }
  };
  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteClient.mutateAsync(deleteId);
      ue.success("Client deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete client");
    }
  };
  const handlePhoneImport = async () => {
    if (!navigator.contacts) {
      ue.error("Ye feature sirf Chrome Android mein kaam karta hai");
      return;
    }
    try {
      const selected = await navigator.contacts.select(
        ["name", "tel"],
        { multiple: true }
      );
      if (!selected || selected.length === 0) return;
      const parsed = selected.map(
        (contact) => {
          var _a, _b;
          const rawName = (((_a = contact.name) == null ? void 0 : _a[0]) ?? "").trim();
          const phone = (((_b = contact.tel) == null ? void 0 : _b[0]) ?? "").replace(/\s+/g, "").trim();
          const { isBusiness, personName, companyName } = detectBusiness(rawName);
          return {
            name: personName,
            company: companyName,
            phone,
            isBusiness,
            include: isBusiness
            // auto-check business, uncheck personal
          };
        }
      );
      setPhoneContacts(parsed);
      setPhoneImportOpen(true);
    } catch {
      ue.error("Contact access cancelled or not supported.");
    }
  };
  const handlePhoneImportSubmit = async () => {
    if (!identity) return;
    const toImport = phoneContacts.filter((c) => c.include);
    if (toImport.length === 0) {
      ue.error("Koi bhi contact select nahi kiya.");
      return;
    }
    const missingCompany = toImport.filter(
      (c) => !c.isBusiness && !c.company.trim()
    );
    if (missingCompany.length > 0) {
      ue.error(
        `${missingCompany.length} personal contact(s) mein company name bharein.`
      );
      return;
    }
    setIsPhoneImporting(true);
    ue(`Importing ${toImport.length} contacts...`);
    try {
      let count = 0;
      for (const c of toImport) {
        await createClient.mutateAsync({
          id: 0n,
          name: c.name.trim(),
          company: c.company.trim(),
          phone: c.phone,
          email: "",
          address: "",
          notes: "",
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
        count++;
      }
      ue.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
      setPhoneImportOpen(false);
      setPhoneContacts([]);
    } catch {
      ue.error("Kuch contacts import nahi hue. Please try again.");
    } finally {
      setIsPhoneImporting(false);
    }
  };
  const selectedCount = phoneContacts.filter((c) => c.include).length;
  const businessContacts = phoneContacts.filter((c) => c.isBusiness);
  const personalContacts = phoneContacts.filter((c) => !c.isBusiness);
  const updatePhoneContact = (idx, patch) => {
    setPhoneContacts(
      (prev) => prev.map((c, i) => i === idx ? { ...c, ...patch } : c)
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24, className: "text-primary" }),
          "Clients"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
          (clients == null ? void 0 : clients.length) ?? 0,
          " total clients"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: csvInputRef,
            type: "file",
            accept: ".csv",
            className: "hidden",
            onChange: handleCSVImport
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: excelInputRef,
            type: "file",
            accept: ".csv,.xlsx,.xls,.txt",
            className: "hidden",
            onChange: handleExcelImport
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.download_sample.button",
            onClick: downloadSampleCSV,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
              "Sample CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.import.upload_button",
            onClick: () => {
              var _a;
              return (_a = csvInputRef.current) == null ? void 0 : _a.click();
            },
            disabled: isImporting || !identity,
            className: "gap-2",
            children: [
              isImporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 15 }),
              isImporting ? "Importing..." : "Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.import_excel.upload_button",
            onClick: () => {
              var _a;
              return (_a = excelInputRef.current) == null ? void 0 : _a.click();
            },
            disabled: isImportingExcel || !identity,
            className: "gap-2",
            children: [
              isImportingExcel ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { size: 15 }),
              isImportingExcel ? "Importing..." : "Import Excel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.phone_import.button",
            onClick: handlePhoneImport,
            disabled: !identity,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 15 }),
              "Import from Phone"
            ]
          }
        ),
        !isLoading && (clients ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.pdf.button",
            onClick: () => printClientsPDF(clients ?? []),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 15 }),
              "Export PDF"
            ]
          }
        ),
        !isLoading && (clients ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            "data-ocid": "clients.sample.primary_button",
            onClick: handleBulkAdd,
            disabled: isBulkAdding || !identity,
            className: "gap-2",
            children: [
              isBulkAdding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 16 }),
              isBulkAdding ? "Adding..." : "Add Sample Clients"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dialog,
          {
            open: addOpen,
            onOpenChange: (o) => {
              setAddOpen(o);
              if (!o) {
                setForm(emptyForm);
                setPhoneError("");
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "clients.add_button", className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                "Add Client"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "client.dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add New Client" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "space-y-4 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "name",
                          "data-ocid": "client.name.input",
                          value: form.name,
                          onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
                          placeholder: "Contact name",
                          required: true
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company", children: "Company *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "company",
                          "data-ocid": "client.company.input",
                          value: form.company,
                          onChange: (e) => setForm((p) => ({ ...p, company: e.target.value })),
                          placeholder: "Company name",
                          required: true
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "phone",
                          "data-ocid": "client.phone.input",
                          value: form.phone,
                          onChange: (e) => {
                            setForm((p) => ({ ...p, phone: e.target.value }));
                            if (phoneError) validatePhone(e.target.value);
                          },
                          onBlur: (e) => validatePhone(e.target.value),
                          placeholder: "10-digit mobile number",
                          inputMode: "numeric"
                        }
                      ),
                      phoneError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          "data-ocid": "client.phone.error_state",
                          className: "text-xs text-destructive mt-1",
                          children: phoneError
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "email",
                          "data-ocid": "client.email.input",
                          type: "email",
                          value: form.email,
                          onChange: (e) => setForm((p) => ({ ...p, email: e.target.value })),
                          placeholder: "email@company.com"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "address",
                          "data-ocid": "client.address.input",
                          value: form.address,
                          onChange: (e) => setForm((p) => ({ ...p, address: e.target.value })),
                          placeholder: "Full address"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "industry", children: "Industry Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: form.industry,
                          onValueChange: (v) => setForm((p) => ({ ...p, industry: v })),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                id: "industry",
                                "data-ocid": "client.industry.select",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select industry" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select industry —" }),
                              INDUSTRY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt))
                            ] })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Notes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "notes",
                        "data-ocid": "client.notes.textarea",
                        value: form.notes,
                        onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
                        placeholder: "Any additional notes...",
                        rows: 3
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        "data-ocid": "client.cancel_button",
                        onClick: () => {
                          setAddOpen(false);
                          setForm(emptyForm);
                          setPhoneError("");
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "submit",
                        "data-ocid": "client.save_button",
                        disabled: createClient.isPending || !!phoneError,
                        children: [
                          createClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                          "Save Client"
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: phoneImportOpen,
        onOpenChange: (o) => {
          if (!isPhoneImporting) {
            setPhoneImportOpen(o);
            if (!o) setPhoneContacts([]);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-2xl w-full",
            "data-ocid": "clients.phone_import.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 18, className: "text-primary" }),
                  "Phone Contacts Import"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Business contacts (3+ words) auto-detected. Review and select which to import." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh] pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                businessContacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200", children: [
                    "✅ Business Contacts — ",
                    businessContacts.length,
                    " detected"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: phoneContacts.map((contact, idx) => {
                    if (!contact.isBusiness) return null;
                    const displayIdx = idx + 1;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `clients.phone_contact.item.${displayIdx}`,
                        className: "flex items-start gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/40",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Checkbox,
                            {
                              id: `pc-include-${idx}`,
                              "data-ocid": `clients.phone_contact.checkbox.${displayIdx}`,
                              checked: contact.include,
                              onCheckedChange: (checked) => updatePhoneContact(idx, {
                                include: Boolean(checked)
                              }),
                              className: "mt-1 shrink-0"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Person Name" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  "data-ocid": `clients.phone_contact.input.${displayIdx}`,
                                  value: contact.name,
                                  onChange: (e) => updatePhoneContact(idx, {
                                    name: e.target.value
                                  }),
                                  placeholder: "Person name",
                                  className: "h-8 text-sm",
                                  disabled: !contact.include
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Company Name" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: contact.company,
                                  onChange: (e) => updatePhoneContact(idx, {
                                    company: e.target.value
                                  }),
                                  placeholder: "Company name",
                                  className: "h-8 text-sm",
                                  disabled: !contact.include
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Phone" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: contact.phone,
                                  readOnly: true,
                                  className: "h-8 text-sm bg-muted/40"
                                }
                              )
                            ] })
                          ] })
                        ]
                      },
                      `phone-${idx}`
                    );
                  }) })
                ] }),
                personalContacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border", children: [
                    "👤 Personal Contacts — ",
                    personalContacts.length,
                    " (will be skipped by default)"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: phoneContacts.map((contact, idx) => {
                    if (contact.isBusiness) return null;
                    const displayIdx = idx + 1;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `clients.phone_contact.item.${displayIdx}`,
                        className: "flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Checkbox,
                            {
                              id: `pc-personal-${idx}`,
                              "data-ocid": `clients.phone_contact.checkbox.${displayIdx}`,
                              checked: contact.include,
                              onCheckedChange: (checked) => updatePhoneContact(idx, {
                                include: Boolean(checked)
                              }),
                              className: "mt-1 shrink-0"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Name" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: contact.name,
                                  readOnly: true,
                                  className: "h-8 text-sm bg-muted/40"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground mb-1 block", children: [
                                "Company Name",
                                " ",
                                contact.include && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: contact.company,
                                  onChange: (e) => updatePhoneContact(idx, {
                                    company: e.target.value
                                  }),
                                  placeholder: contact.include ? "Required" : "Optional",
                                  className: "h-8 text-sm",
                                  disabled: !contact.include
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Phone" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: contact.phone,
                                  readOnly: true,
                                  className: "h-8 text-sm bg-muted/40"
                                }
                              )
                            ] })
                          ] })
                        ]
                      },
                      `phone-p-${idx}`
                    );
                  }) })
                ] }),
                phoneContacts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "clients.phone_import.empty_state",
                    className: "text-center py-8 text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 32, className: "mx-auto mb-2 opacity-30" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Koi contact nahi mila." })
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground sm:mr-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: selectedCount }),
                  " ",
                  "contact",
                  selectedCount !== 1 ? "s" : "",
                  " will be imported"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      "data-ocid": "clients.phone_import.cancel_button",
                      onClick: () => {
                        setPhoneImportOpen(false);
                        setPhoneContacts([]);
                      },
                      disabled: isPhoneImporting,
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "clients.phone_import.submit_button",
                      onClick: handlePhoneImportSubmit,
                      disabled: isPhoneImporting || selectedCount === 0 || !identity,
                      children: [
                        isPhoneImporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                        isPhoneImporting ? "Importing..." : `Import ${selectedCount} Client${selectedCount !== 1 ? "s" : ""}`
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "clients.search_input",
          type: "text",
          placeholder: "Search clients...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "clients.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Industry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24 text-right font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 ml-auto" }) })
        ] }, `skeleton-${i}`)
      )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableCell,
        {
          colSpan: 6,
          "data-ocid": "clients.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 36, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No clients match your search" : "No clients yet. Add your first client!" })
          ]
        }
      ) }) : filtered.map((client, idx) => {
        const industry = extractIndustry(client.notes);
        const industryClass = INDUSTRY_BADGE_CLASSES[industry] ?? "bg-muted text-muted-foreground border-border";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `clients.item.${idx + 1}`,
            className: "hover:bg-muted/30 cursor-pointer",
            onClick: () => navigate({ to: `/clients/${client.id.toString()}` }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                client.name,
                (() => {
                  const cnt = decodeContacts(client.notes).length;
                  return cnt > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs px-1.5 py-0 h-4 font-normal",
                      title: `${cnt} contact${cnt !== 1 ? "s" : ""}`,
                      children: [
                        "👥 ",
                        cnt
                      ]
                    }
                  ) : null;
                })()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: client.company }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: industry ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${industryClass}`,
                  children: industry
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-muted-foreground", children: client.phone || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-muted-foreground", children: client.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden xl:table-cell", children: (() => {
                const lastDate = lastVisitMap.get(client.id.toString());
                if (!lastDate)
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "Never visited" });
                const d = new Date(Number(lastDate / 1000000n));
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-700 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                  d.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                ] });
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-end gap-1",
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        "data-ocid": `client.view_button.${idx + 1}`,
                        onClick: () => navigate({
                          to: `/clients/${client.id.toString()}`
                        }),
                        className: "h-7 w-7",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        "data-ocid": `client.delete_button.${idx + 1}`,
                        onClick: () => setDeleteId(client.id),
                        className: "h-7 w-7 text-destructive hover:text-destructive",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                      }
                    )
                  ]
                }
              ) })
            ]
          },
          client.id.toString()
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteId !== null,
        onOpenChange: (o) => !o && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "client.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Client" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this client? This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "client.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                "data-ocid": "client.delete.confirm_button",
                onClick: handleDelete,
                className: "bg-destructive hover:bg-destructive/90",
                children: [
                  deleteClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                  "Delete"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
const ClientsPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ClientsPage,
  extractIndustry,
  stripIndustryTag
}, Symbol.toStringTag, { value: "Module" }));
export {
  ClientsPage$1 as C,
  Smartphone as S,
  stripContactsTag as a,
  decodeContacts as d,
  encodeContacts as e,
  genContactId as g,
  stripIndustryTag as s
};
