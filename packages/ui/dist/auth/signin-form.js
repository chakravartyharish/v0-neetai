// SignIn Form Component for NEET Prep AI Platform
// Story 1.1: User Authentication System
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SignInForm = ({ onSuccess, onError, className = '', }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    // Temporary mock signIn function
    const signIn = async (data) => {
        setLoading(true);
        // TODO: Implement actual sign in logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        return { user: null, error: 'Authentication not implemented yet' };
    };
    const [formData, setFormData] = (0, react_1.useState)({
        email: '',
        password: '',
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [rememberMe, setRememberMe] = (0, react_1.useState)(false);
    const validateForm = () => {
        const newErrors = {};
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const result = await signIn(formData);
            if (result.error) {
                onError?.(result.error);
                setErrors({ general: result.error });
            }
            else if (result.user) {
                onSuccess?.(result.user);
                setErrors({});
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            onError?.(errorMessage);
            setErrors({ general: errorMessage });
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handleForgotPassword = () => {
        // Redirect to forgot password page
        window.location.href = `/auth/forgot-password?email=${encodeURIComponent(formData.email)}`;
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `max-w-md mx-auto ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-md rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Welcome Back" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Sign in to continue your NEET preparation" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.general && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: errors.general }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Enter your email address", disabled: loading, autoComplete: "email" }), errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.email }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', id: "password", value: formData.password, onChange: (e) => handleInputChange('password', e.target.value), className: `w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Enter your password", disabled: loading, autoComplete: "current-password" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5", disabled: loading, children: showPassword ? '👁️' : '🔒' })] }), errors.password && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.password }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { id: "remember-me", name: "remember-me", type: "checkbox", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded", disabled: loading }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Remember me" })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleForgotPassword, className: "text-sm text-blue-600 hover:text-blue-500 font-medium", disabled: loading, children: "Forgot password?" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: `w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`, children: loading ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Signing In..."] })) : ('Sign In') }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full border-t border-gray-300" }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex justify-center text-sm", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 bg-white text-gray-500", children: "Or" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", disabled: loading, className: "w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5 mr-2", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), (0, jsx_runtime_1.jsx)("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), (0, jsx_runtime_1.jsx)("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), (0, jsx_runtime_1.jsx)("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Continue with Google", (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xs text-gray-500", children: "(Coming Soon)" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-center pt-4 border-t", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Don't have an account?", ' ', (0, jsx_runtime_1.jsx)("a", { href: "/signup", className: "text-blue-600 hover:underline font-medium", children: "Create Account" })] }) })] })] }) }));
};
exports.SignInForm = SignInForm;
