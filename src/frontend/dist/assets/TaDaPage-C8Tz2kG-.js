import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, G as createContextScope, a3 as createPopperScope, a4 as useId, a5 as useControllableState, a6 as Root2, D as useComposedRefs, a7 as Anchor, H as Primitive, J as composeEventHandlers, a8 as Portal$1, a9 as Arrow, aa as DismissableLayer, ab as Content, ac as createSlottable, ad as Root, Q as cn, t as todayInputStr, ae as useIsAdmin, af as useAllClaims, ag as useMyClaims, ah as useSubmitClaim, ai as useApproveClaim, aj as useRejectClaim, b as useInternetIdentity, ak as Receipt, B as Button, n as Plus, al as TriangleAlert, C as Card, l as CardContent, S as Skeleton, F as FileText, L as Label, I as Input, s as Select, v as SelectTrigger, w as SelectValue, x as SelectContent, y as SelectItem, am as Camera, q as LoaderCircle, z as ue, A as dateInputToNs, m as formatDate, h as Badge, p as StatusBadge } from "./index-DbjPUQDs.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { P as Progress } from "./progress-C5j8GP1K.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CpdBFqUb.js";
import { T as Textarea } from "./textarea-k-DTS19z.js";
import { P as Presence } from "./index-CzBemFCv.js";
import { S as Status__2 } from "./backend.d-Ws4C8wFG.js";
import { U as Upload } from "./upload-BmiwQOmh.js";
import { C as CircleX } from "./circle-x-Bv0ZDASn.js";
import { P as Printer } from "./printer-BujzTYqY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode);
var [createTooltipContext] = createContextScope("Tooltip", [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const isOpenDelayedRef = reactExports.useRef(true);
  const isPointerInTransitRef = reactExports.useRef(false);
  const skipDelayTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayedRef,
      delayDuration,
      onOpen: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        isOpenDelayedRef.current = false;
      }, []),
      onClose: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => isOpenDelayedRef.current = true,
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: reactExports.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = reactExports.useState(null);
  const contentId = useId();
  const openTimerRef = reactExports.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = reactExports.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange == null ? void 0 : onOpenChange(open2);
    },
    caller: TOOLTIP_NAME
  });
  const stateAttribute = reactExports.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  reactExports.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: reactExports.useCallback(() => {
        if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
      onTriggerLeave: reactExports.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME = "TooltipTrigger";
var TooltipTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = reactExports.useRef(false);
    const hasPointerMoveOpenedRef = reactExports.useRef(false);
    const handlePointerUp = reactExports.useCallback(() => isPointerDownRef.current = false, []);
    reactExports.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open) {
            context.onClose();
          }
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: composeEventHandlers(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onClick: composeEventHandlers(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "TooltipPortal";
var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "TooltipContent";
var TooltipContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = reactExports.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = reactExports.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = reactExports.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = reactExports.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  reactExports.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = createSlottable("TooltipContent");
var TooltipContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;
    reactExports.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    reactExports.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event) => {
          const target = event.target;
          if (target == null ? void 0 : target.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent$1.displayName = CONTENT_NAME;
var ARROW_NAME = "TooltipArrow";
var TooltipArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}
var Provider = TooltipProvider$1;
var Root3 = Tooltip$1;
var Trigger = TooltipTrigger$1;
var Portal = TooltipPortal;
var Content2 = TooltipContent$1;
var Arrow2 = TooltipArrow;
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
function extractServiceReport(notes) {
  const m = notes.match(/\[SR\]([\s\S]*?)\[\/SR\]/);
  return m ? m[1] : "";
}
function extractPhotoDataUrl(notes) {
  const m = notes.match(/\[PHOTO:([^\]]+)\]/);
  return m ? m[1] : null;
}
function extractTag(notes, tag) {
  const m = notes.match(new RegExp(`\\[${tag}:([^\\]]*?)\\]`));
  return m ? m[1] : "";
}
function buildNotesString(serviceReport, photoDataUrl, billAmount, fromLocation, toLocation, distanceKm, transportType, expenseCategory, extraNotes) {
  let result = "";
  if (serviceReport) result += `[SR]${serviceReport}[/SR]`;
  if (photoDataUrl) result += `[PHOTO:${photoDataUrl}]`;
  if (billAmount) result += `[BILL:${billAmount}]`;
  if (fromLocation) result += `[FROM:${fromLocation}]`;
  if (toLocation) result += `[TO:${toLocation}]`;
  if (distanceKm) result += `[DIST:${distanceKm}]`;
  if (transportType && transportType !== "none")
    result += `[TRANS:${transportType}]`;
  if (expenseCategory && expenseCategory !== "none")
    result += `[CAT:${expenseCategory}]`;
  if (extraNotes) result += extraNotes;
  return result;
}
const emptyForm = {
  date: todayInputStr(),
  travelAllowance: "",
  dailyAllowance: "",
  locationsVisited: "",
  notes: "",
  serviceReport: "",
  photoDataUrl: null,
  photoUploadProgress: 0,
  billAmount: "",
  fromLocation: "",
  toLocation: "",
  distanceKm: "",
  transportType: "none",
  expenseCategory: "none"
};
function CameraDialog({
  open,
  onClose,
  onCapture
}) {
  const videoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const [cameraError, setCameraError] = reactExports.useState(null);
  const [streaming, setStreaming] = reactExports.useState(false);
  const startCamera = reactExports.useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch {
      setCameraError(
        "Camera access denied or not available. Please use file upload instead."
      );
    }
  }, []);
  const stopCamera = reactExports.useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    setStreaming(false);
  }, []);
  const handleCapture = reactExports.useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    stopCamera();
    onCapture(dataUrl);
    onClose();
  }, [stopCamera, onCapture, onClose]);
  const handleClose = reactExports.useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);
  const handleOpenChange = reactExports.useCallback(
    (isOpen) => {
      if (isOpen) {
        startCamera();
      } else {
        handleClose();
      }
    },
    [startCamera, handleClose]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "tada.camera.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 18, className: "text-primary" }),
      "Take Bill Photo"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      cameraError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive", children: cameraError }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-black rounded-lg overflow-hidden aspect-video", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            className: "w-full h-full object-cover",
            playsInline: true,
            muted: true
          }
        ),
        !streaming && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-center text-white text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 16 }),
          "Starting camera..."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "tada.camera.cancel_button",
          onClick: handleClose,
          children: "Cancel"
        }
      ),
      !cameraError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "tada.camera.capture_button",
          onClick: handleCapture,
          disabled: !streaming,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 16 }),
            "Capture"
          ]
        }
      )
    ] })
  ] }) });
}
function printClaim(claim) {
  const billAmount = extractTag(claim.notes, "BILL");
  const fromLoc = extractTag(claim.notes, "FROM");
  const toLoc = extractTag(claim.notes, "TO");
  const dist = extractTag(claim.notes, "DIST");
  const trans = extractTag(claim.notes, "TRANS");
  const cat = extractTag(claim.notes, "CAT");
  const srText = extractServiceReport(claim.notes);
  const photoUrl = extractPhotoDataUrl(claim.notes);
  const totalAmount = Number(claim.travelAllowance) + Number(claim.dailyAllowance) + (billAmount ? Number(billAmount) : 0);
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TA DA Claim Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0; color: #555; font-size: 13px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .row label { color: #666; font-size: 13px; }
        .row span { font-weight: 600; }
        .total { background: #f0f0f0; padding: 12px 16px; border-radius: 6px; margin-top: 16px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
        .section { margin-top: 20px; }
        .section h3 { font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .sr { background: #f9f9f9; padding: 12px; border-left: 3px solid #333; white-space: pre-wrap; font-size: 13px; }
        .photo { margin-top: 16px; }
        .photo img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .sign-line { margin-top: 40px; border-top: 1px solid #555; width: 200px; text-align: center; padding-top: 6px; font-size: 12px; color: #666; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>TA DA Claim Receipt</p>
        <p>Claim Date: ${new Date(Number(claim.date / 1000000n)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
        <p>Status: ${String(claim.status).toUpperCase()} ${claim.adminRemarks ? `— ${claim.adminRemarks}` : ""}</p>
      </div>

      ${fromLoc || toLoc ? `<div class="row"><label>Route</label><span>${fromLoc || "—"} → ${toLoc || "—"}${dist ? ` (${dist} km)` : ""}</span></div>` : ""}
      ${trans && trans !== "none" ? `<div class="row"><label>Transport</label><span>${trans}</span></div>` : ""}
      ${cat && cat !== "none" ? `<div class="row"><label>Category</label><span>${cat}</span></div>` : ""}
      <div class="row"><label>Locations Visited</label><span>${claim.locationsVisited || "—"}</span></div>
      <div class="row"><label>Travel Allowance</label><span>₹${Number(claim.travelAllowance).toLocaleString("en-IN")}</span></div>
      <div class="row"><label>Daily Allowance</label><span>₹${Number(claim.dailyAllowance).toLocaleString("en-IN")}</span></div>
      ${billAmount ? `<div class="row"><label>Bill Amount</label><span>₹${Number(billAmount).toLocaleString("en-IN")}</span></div>` : ""}
      <div class="total"><span>TOTAL CLAIM</span><span>₹${totalAmount.toLocaleString("en-IN")}</span></div>

      ${srText ? `<div class="section"><h3>Service Report</h3><div class="sr">${srText}</div></div>` : ""}
      ${photoUrl ? `<div class="photo section"><h3>Bill Photo</h3><img src="${photoUrl}" alt="Bill" /></div>` : ""}

      <div style="margin-top:40px; display:flex; justify-content:space-between;">
        <div class="sign-line">Staff Signature</div>
        <div class="sign-line">Admin Approval</div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
function TaDaPage() {
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [cameraOpen, setCameraOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [remarksOpen, setRemarksOpen] = reactExports.useState(false);
  const [remarksText, setRemarksText] = reactExports.useState("");
  const [actionClaimId, setActionClaimId] = reactExports.useState(null);
  const [actionType, setActionType] = reactExports.useState("approve");
  const [lightboxUrl, setLightboxUrl] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const { data: isAdmin } = useIsAdmin();
  const { data: allClaims, isLoading: allLoading } = useAllClaims();
  const { data: myClaims, isLoading: myLoading } = useMyClaims();
  const submitClaim = useSubmitClaim();
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();
  const { identity } = useInternetIdentity();
  const claims = isAdmin ? allClaims ?? [] : myClaims ?? [];
  const isLoading = isAdmin ? allLoading : myLoading;
  const handlePhotoChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      ue.error("Photo must be under 2MB");
      return;
    }
    setForm((p) => ({ ...p, photoUploadProgress: 0 }));
    const reader = new FileReader();
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setForm((p) => ({ ...p, photoUploadProgress: Math.min(progress, 90) }));
      if (progress >= 90) clearInterval(interval);
    }, 80);
    reader.onload = () => {
      clearInterval(interval);
      setForm((p) => ({
        ...p,
        photoDataUrl: reader.result,
        photoUploadProgress: 100
      }));
    };
    reader.readAsDataURL(file);
  };
  const handleCameraCapture = (dataUrl) => {
    setForm((p) => ({
      ...p,
      photoDataUrl: dataUrl,
      photoUploadProgress: 100
    }));
    ue.success("Photo captured!");
  };
  const autoTotal = (Number(form.travelAllowance) || 0) + (Number(form.dailyAllowance) || 0) + (Number(form.billAmount) || 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identity) return;
    try {
      const notesStr = buildNotesString(
        form.serviceReport,
        form.photoDataUrl,
        form.billAmount,
        form.fromLocation,
        form.toLocation,
        form.distanceKm,
        form.transportType,
        form.expenseCategory,
        form.notes
      );
      await submitClaim.mutateAsync({
        id: 0n,
        userId: identity.getPrincipal(),
        date: dateInputToNs(form.date),
        travelAllowance: BigInt(form.travelAllowance || "0"),
        dailyAllowance: BigInt(form.dailyAllowance || "0"),
        locationsVisited: form.locationsVisited.trim(),
        notes: notesStr,
        adminRemarks: "",
        status: Status__2.pending,
        submittedAt: BigInt(Date.now()) * 1000000n
      });
      ue.success("Claim submitted successfully");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      ue.error("Failed to submit claim");
    }
  };
  const openAction = (id, type) => {
    setActionClaimId(id);
    setActionType(type);
    setRemarksText("");
    setRemarksOpen(true);
  };
  const handleAction = async (e) => {
    e.preventDefault();
    if (actionClaimId === null) return;
    try {
      if (actionType === "approve") {
        await approveClaim.mutateAsync({
          id: actionClaimId,
          remarks: remarksText
        });
        ue.success("Claim approved");
      } else {
        await rejectClaim.mutateAsync({
          id: actionClaimId,
          remarks: remarksText
        });
        ue.success("Claim rejected");
      }
      setRemarksOpen(false);
      setActionClaimId(null);
    } catch {
      ue.error("Action failed");
    }
  };
  const totalPending = claims.filter((c) => c.status === "pending").length;
  const totalApproved = claims.filter((c) => c.status === "approved").reduce(
    (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
    0
  );
  const MONTHLY_LIMIT = 5e3;
  const thisMonth = (/* @__PURE__ */ new Date()).getMonth();
  const thisYear = (/* @__PURE__ */ new Date()).getFullYear();
  const monthlyTotal = claims.filter((c) => {
    const d = new Date(Number(c.date / 1000000n));
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).reduce(
    (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
    0
  );
  const overMonthlyLimit = !isAdmin && monthlyTotal > MONTHLY_LIMIT;
  const renderClaimRow = (claim, idx) => {
    const srText = extractServiceReport(claim.notes);
    const photoUrl = extractPhotoDataUrl(claim.notes);
    const billAmount = extractTag(claim.notes, "BILL");
    const fromLoc = extractTag(claim.notes, "FROM");
    const toLoc = extractTag(claim.notes, "TO");
    const trans = extractTag(claim.notes, "TRANS");
    const showRoute = fromLoc || toLoc;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TableRow,
      {
        "data-ocid": `tada.item.${idx + 1}`,
        className: "hover:bg-muted/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: formatDate(claim.date) }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden md:table-cell text-muted-foreground text-xs font-mono", children: [
            claim.userId.toString().slice(0, 12),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[200px] space-y-0.5", children: [
            showRoute && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-foreground", children: [
              fromLoc || "—",
              " → ",
              toLoc || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground truncate text-xs", children: claim.locationsVisited || "—" }),
            srText && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary/70 truncate cursor-help flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 10 }),
                srText.slice(0, 35),
                srText.length > 35 ? "…" : ""
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { className: "max-w-xs text-xs whitespace-pre-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Service Report:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                srText
              ] })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm", children: trans && trans !== "none" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: trans }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: Number(claim.travelAllowance).toLocaleString("en-IN") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm", children: Number(claim.dailyAllowance).toLocaleString("en-IN") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm font-medium", children: billAmount ? `₹${Number(billAmount).toLocaleString("en-IN")}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: claim.status }),
            photoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `tada.photo_button.${idx + 1}`,
                onClick: () => setLightboxUrl(photoUrl),
                className: "h-6 w-6 rounded bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors",
                title: "View bill photo",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 12, className: "text-primary" })
              }
            ),
            claim.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `tada.print_button.${idx + 1}`,
                onClick: () => printClaim(claim),
                className: "h-6 w-6 rounded bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors",
                title: "Print claim receipt",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 12, className: "text-primary" })
              }
            )
          ] }) }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
            claim.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  "data-ocid": `tada.approve_button.${idx + 1}`,
                  onClick: () => openAction(claim.id, "approve"),
                  className: "h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 12 }),
                    "Approve"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  "data-ocid": `tada.reject_button.${idx + 1}`,
                  onClick: () => openAction(claim.id, "reject"),
                  className: "h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 12 }),
                    "Reject"
                  ]
                }
              )
            ] }),
            claim.status !== "pending" && claim.adminRemarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-right truncate max-w-[120px]", children: claim.adminRemarks })
          ] })
        ]
      },
      claim.id.toString()
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 24, className: "text-primary" }),
          "TA DA Claims"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: isAdmin ? "Manage all staff travel and daily allowance claims" : "Your travel and daily allowance claims" })
      ] }),
      !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "tada.submit_button",
          onClick: () => setAddOpen(true),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            "Submit Claim"
          ]
        }
      )
    ] }),
    overMonthlyLimit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "tada.monthly_limit.card",
        className: "flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-medium",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, className: "flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Monthly claim total ₹",
            monthlyTotal.toLocaleString("en-IN"),
            " exceeds ₹",
            MONTHLY_LIMIT.toLocaleString("en-IN"),
            " limit — please review before submitting more claims."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-amber-600 mt-1", children: totalPending })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Total Claims" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold mt-1", children: claims.length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Approved Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold text-emerald-600 mt-1", children: [
          "₹",
          totalApproved.toLocaleString("en-IN")
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-x-auto shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "tada.claims_table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Date" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Staff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden sm:table-cell", children: "Route / Locations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Transport" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "TA (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "DA (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Bill Amt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Status" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({ length: isAdmin ? 9 : 7 }).map((__, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `cell-${j}`)
        )) }, `skeleton-${i}`)
      )) : claims.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableCell,
        {
          colSpan: isAdmin ? 9 : 7,
          "data-ocid": "tada.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 36, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No claims found" })
          ]
        }
      ) }) : claims.map((claim, idx) => renderClaimRow(claim, idx)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: addOpen,
        onOpenChange: (o) => {
          setAddOpen(o);
          if (!o) setForm(emptyForm);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            "data-ocid": "tada.submit.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Submit TA DA Claim" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "tada.date.input",
                      type: "date",
                      value: form.date,
                      onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Expense Category" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: form.expenseCategory,
                        onValueChange: (v) => setForm((p) => ({ ...p, expenseCategory: v })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tada.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select —" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Travel", children: "Travel" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Food", children: "Food" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Accommodation", children: "Accommodation" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Transport Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: form.transportType,
                        onValueChange: (v) => setForm((p) => ({ ...p, transportType: v })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tada.transport.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select transport" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select —" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Flight", children: "✈️ Flight" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Train", children: "🚂 Train" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Bus", children: "🚌 Bus" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Auto", children: "🛺 Auto" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Own Vehicle", children: "🚗 Own Vehicle" })
                          ] })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.from.input",
                        value: form.fromLocation,
                        onChange: (e) => setForm((p) => ({ ...p, fromLocation: e.target.value })),
                        placeholder: "Departure city"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.to.input",
                        value: form.toLocation,
                        onChange: (e) => setForm((p) => ({ ...p, toLocation: e.target.value })),
                        placeholder: "Destination city"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Distance (km)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.distance.input",
                        type: "number",
                        min: "0",
                        value: form.distanceKm,
                        onChange: (e) => setForm((p) => ({ ...p, distanceKm: e.target.value })),
                        placeholder: "0"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Travel Allowance (₹)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.travel.input",
                        type: "number",
                        min: "0",
                        value: form.travelAllowance,
                        onChange: (e) => setForm((p) => ({ ...p, travelAllowance: e.target.value })),
                        placeholder: "0"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Daily Allowance (₹)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.daily.input",
                        type: "number",
                        min: "0",
                        value: form.dailyAllowance,
                        onChange: (e) => setForm((p) => ({ ...p, dailyAllowance: e.target.value })),
                        placeholder: "0"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bill Amount (₹)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "tada.bill_amount.input",
                        type: "number",
                        min: "0",
                        value: form.billAmount,
                        onChange: (e) => setForm((p) => ({ ...p, billAmount: e.target.value })),
                        placeholder: "0"
                      }
                    )
                  ] })
                ] }),
                autoTotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Total Claim Amount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-bold text-primary", children: [
                    "₹",
                    autoTotal.toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Locations Visited *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "tada.locations.input",
                      value: form.locationsVisited,
                      onChange: (e) => setForm((p) => ({ ...p, locationsVisited: e.target.value })),
                      placeholder: "e.g. Pune, Nashik, Mumbai",
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Service Report / Daily Work" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      "data-ocid": "tada.service_report.textarea",
                      value: form.serviceReport,
                      onChange: (e) => setForm((p) => ({ ...p, serviceReport: e.target.value })),
                      rows: 3,
                      placeholder: "Describe services performed, work completed..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bill Photo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/*",
                      className: "hidden",
                      onChange: handlePhotoChange
                    }
                  ),
                  !form.photoDataUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "tada.photo.upload_button",
                        onClick: () => {
                          var _a;
                          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                        },
                        className: "flex-1 border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 18 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Upload from Gallery" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Max 2MB" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "tada.camera.open_modal_button",
                        onClick: () => setCameraOpen(true),
                        className: "flex-1 border-2 border-dashed border-primary/30 rounded-lg p-3 flex flex-col items-center gap-1.5 text-primary/70 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-primary/5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 18 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Take Photo" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Use Camera" })
                        ]
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: form.photoDataUrl,
                        alt: "Bill preview thumbnail",
                        className: "h-14 w-14 object-cover rounded cursor-pointer border border-border",
                        onClick: () => setLightboxUrl(form.photoDataUrl),
                        onKeyDown: (e) => e.key === "Enter" && setLightboxUrl(form.photoDataUrl)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 14, className: "text-primary" }),
                        "Photo attached"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click image to preview" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setForm((p) => ({
                          ...p,
                          photoDataUrl: null,
                          photoUploadProgress: 0
                        })),
                        className: "text-destructive hover:text-destructive/80 transition-colors",
                        title: "Remove photo",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 })
                      }
                    )
                  ] }),
                  form.photoUploadProgress > 0 && form.photoUploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Loading… ",
                      form.photoUploadProgress,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Progress,
                      {
                        value: form.photoUploadProgress,
                        className: "h-1.5"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Additional Notes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      "data-ocid": "tada.notes.textarea",
                      value: form.notes,
                      onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
                      rows: 2,
                      placeholder: "Any additional details..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      "data-ocid": "tada.cancel_button",
                      onClick: () => {
                        setForm(emptyForm);
                        setAddOpen(false);
                      },
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "submit",
                      "data-ocid": "tada.confirm_submit_button",
                      disabled: submitClaim.isPending,
                      children: [
                        submitClaim.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                        "Submit Claim"
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CameraDialog,
      {
        open: cameraOpen,
        onClose: () => setCameraOpen(false),
        onCapture: handleCameraCapture
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: remarksOpen, onOpenChange: setRemarksOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "tada.action.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: actionType === "approve" ? "Approve Claim" : "Reject Claim" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAction, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "tada.remarks.textarea",
              value: remarksText,
              onChange: (e) => setRemarksText(e.target.value),
              rows: 3,
              placeholder: "Add remarks (optional)..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "tada.action.cancel_button",
              onClick: () => setRemarksOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              "data-ocid": "tada.action.confirm_button",
              disabled: approveClaim.isPending || rejectClaim.isPending,
              className: actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90",
              children: [
                approveClaim.isPending || rejectClaim.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                actionType === "approve" ? "Confirm Approve" : "Confirm Reject"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!lightboxUrl,
        onOpenChange: (o) => !o && setLightboxUrl(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl p-2", "data-ocid": "tada.photo.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 16, className: "text-primary" }),
            "Bill Photo"
          ] }) }),
          lightboxUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: lightboxUrl,
              alt: "Bill receipt",
              className: "w-full max-h-[70vh] object-contain rounded-lg"
            }
          )
        ] })
      }
    )
  ] });
}
export {
  TaDaPage as default
};
