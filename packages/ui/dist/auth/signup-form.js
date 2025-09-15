// SignUp Form Component for NEET Prep AI Platform
// Story 1.1: User Authentication System
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SignUpForm = ({ onSuccess, onError, className = '', }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    // Temporary mock signUp function
    const signUp = async (data) => {
        setLoading(true);
        // TODO: Implement actual sign up logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        return { user: null, error: 'Authentication not implemented yet' };
    };
    const [formData, setFormData] = (0, react_1.useState)({
        email: '',
        password: '',
        full_name: '',
        role: 'student',
        phone: '',
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
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
        else {
            if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters long';
            }
            else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            }
            else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one lowercase letter';
            }
            else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one number';
            }
        }
        // Full name validation
        if (!formData.full_name?.trim()) {
            newErrors.full_name = 'Full name is required';
        }
        else if (formData.full_name.trim().length < 2) {
            newErrors.full_name = 'Full name must be at least 2 characters';
        }
        // Phone validation (optional)
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const result = await signUp(formData);
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
    return ((0, jsx_runtime_1.jsx)("div", { className: `max-w-md mx-auto ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-md rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Create Your NEET Account" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Start your journey to NEET success" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.general && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: errors.general }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "full_name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "full_name", value: formData.full_name, onChange: (e) => handleInputChange('full_name', e.target.value), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.full_name ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Enter your full name", disabled: loading }), errors.full_name && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.full_name }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address *" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Enter your email address", disabled: loading }), errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.email }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password *" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', id: "password", value: formData.password, onChange: (e) => handleInputChange('password', e.target.value), className: `w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Create a strong password", disabled: loading }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5", disabled: loading, children: showPassword ? '👁️' : '🔒' })] }), errors.password && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.password })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Must be 8+ characters with uppercase, lowercase, and number" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", id: "phone", value: formData.phone, onChange: (e) => handleInputChange('phone', e.target.value), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`, placeholder: "+91 9876543210", disabled: loading }), errors.phone && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.phone }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 mb-1", children: "I am a *" }), (0, jsx_runtime_1.jsxs)("select", { id: "role", value: formData.role, onChange: (e) => handleInputChange('role', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", disabled: loading, children: [(0, jsx_runtime_1.jsx)("option", { value: "student", children: "NEET Student" }), (0, jsx_runtime_1.jsx)("option", { value: "parent", children: "Parent" }), (0, jsx_runtime_1.jsx)("option", { value: "coach", children: "Coach/Teacher" })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: `w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`, children: loading ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Creating Account..."] })) : ('Create Account') }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 text-center", children: ["By creating an account, you agree to our", ' ', (0, jsx_runtime_1.jsx)("a", { href: "/terms", className: "text-blue-600 hover:underline", children: "Terms of Service" }), ' ', "and", ' ', (0, jsx_runtime_1.jsx)("a", { href: "/privacy", className: "text-blue-600 hover:underline", children: "Privacy Policy" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-center pt-4 border-t", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Already have an account?", ' ', (0, jsx_runtime_1.jsx)("a", { href: "/login", className: "text-blue-600 hover:underline font-medium", children: "Sign In" })] }) })] })] }) }));
};
exports.SignUpForm = SignUpForm;
