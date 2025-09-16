"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
const jsx_runtime_1 = require("react/jsx-runtime");
function Card({ title, children, href, className, }) {
    return ((0, jsx_runtime_1.jsxs)("a", { className: `group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${className || ""}`, href: `${href}?utm_source=create-turbo&utm_medium=with-tailwind&utm_campaign=create-turbo"`, rel: "noopener noreferrer", target: "_blank", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", children: [title, " ", (0, jsx_runtime_1.jsx)("span", { className: "inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none text-blue-500", children: "\u2192" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600 dark:text-gray-300 leading-relaxed", children: children })] }));
}
