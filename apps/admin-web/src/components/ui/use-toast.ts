import * as React from "react"
type ToasterToast = ToastProps & { id: string; title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactElement; }
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000
type ToastOptions = { limit: number; removeDelay: number; }
type State = { toasts: ToasterToast[]; options: ToastOptions; }
type Action = | { type: "ADD_TOAST"; toast: ToasterToast } | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } } | { type: "DISMISS_TOAST"; toastId?: string } | { type: "REMOVE_TOAST"; toastId?: string }
const reducer = (state: State, action: Action): State => { switch (action.type) { case "ADD_TOAST": return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }; case "UPDATE_TOAST": return { ...state, toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t) }; case "DISMISS_TOAST": { const { toastId } = action; if (toastId) { return { ...state, toasts: state.toasts.map((t) => t.id === toastId ? { ...t, open: false } : t) } } else { return { ...state, toasts: state.toasts.map((t) => ({ ...t, open: false })) } } } case "REMOVE_TOAST": if (action.toastId) { return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) } } else { return { ...state, toasts: [] } } default: return state } }
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [], options: {limit: TOAST_LIMIT, removeDelay: TOAST_REMOVE_DELAY} }
function dispatch(action: Action) { memoryState = reducer(memoryState, action); listeners.forEach((listener) => { listener(memoryState) }) }
interface Toast extends Omit<ToasterToast, "id"> {}
function toast(props: Toast) { const id = Math.random().toString(36).substr(2, 9); const update = (props: ToasterToast) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }); const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id }); dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss() } } }); return { id: id, dismiss, update } }
function useToast() { const [state, setState] = React.useState<State>(memoryState); React.useEffect(() => { listeners.push(setState); return () => { const index = listeners.indexOf(setState); if (index > -1) { listeners.splice(index, 1) } } }, [state]); return { ...state, toast, dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }) } }
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
export { useToast, toast };
