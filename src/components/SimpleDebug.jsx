const SimpleDebug = () => {
    return (
        <div className="min-h-screen p-8 bg-slate-900 text-white">
            <h1 className="text-4xl font-bold mb-8">TaskFlow Debug Page</h1>
            <div className="bg-slate-800 p-6 rounded-lg">
                <h2 className="text-2xl mb-4">System Status</h2>
                <ul className="space-y-2">
                    <li>✅ React Router Working</li>
                    <li>✅ CSS Loading</li>
                    <li>✅ JavaScript Executing</li>
                    <li>✅ Components Rendering</li>
                </ul>
            </div>
            <div className="mt-8 bg-blue-600 p-4 rounded-lg">
                <p>If you can see this page, the basic routing is working!</p>
                <p>Current URL: {window.location.href}</p>
                <p>Current Path: {window.location.pathname}</p>
            </div>
        </div>
    );
};

export default SimpleDebug;