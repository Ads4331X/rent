import { Platform } from "react-native";

export const Colors = {
  primary: "#E11D48", // rose-600
  background: "#0F172A", // slate-900
  card: "#1E293B", // slate-800
  border: "#334155", // slate-700
  inputBg: "#0F172A", // slate-900
  placeholder: "#64748B", // slate-500
  label: "#94A3B8", // slate-400
  text: "#F1F5F9", // slate-100
  subtext: "#64748B", // slate-500
  icon: "#64748B",
  pending: "red",
  noPending: "green",
};

export const Input = {
  inputContainer:
    "flex-row items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 h-14",
  inputStyle: "flex-1 text-white ",
  labelStyle: "mb-2 text-sm font-medium text-white",
};

export const OtherLogin = {
  socialButton: "rounded-2xl border border-slate-700 bg-slate-900 p-3",
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
