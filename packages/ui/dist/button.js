'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const cn_1 = require("./utils/cn");
exports.Button = (0, react_1.forwardRef)(({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
        destructive: 'bg-red-600 hover:bg-red-700 text-white'
    };
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 py-3 text-lg'
    };
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, className: (0, cn_1.cn)('inline-flex items-center justify-center rounded-lg font-medium transition-all', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500', 'disabled:opacity-50 disabled:pointer-events-none', 'active:scale-[0.98]', variants[variant], sizes[size], className), disabled: disabled || loading, ...props, children: [loading && (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), children] }));
});
exports.Button.displayName = 'Button';
