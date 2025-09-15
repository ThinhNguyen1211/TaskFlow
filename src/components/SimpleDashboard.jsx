const SimpleDashboard = ({ 
    todos = [], 
    addTodo = () => {}, 
    toggleTodo = () => {}, 
    deleteTodo = () => {},
    isLoading = false 
}) => {
    const handleAddTask = () => {
        const newTask = {
            id: Date.now().toString(),
            text: `Sample Task ${Date.now()}`,
            completed: false,
            priority: 'medium',
            tags: ['demo'],
            createdAt: new Date().toISOString()
        };
        addTodo(newTask);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">TaskFlow - Simple Version</h1>
                
                <div className="bg-slate-800 p-6 rounded-lg mb-8">
                    <h2 className="text-2xl mb-4">Quick Add Task</h2>
                    <button 
                        onClick={handleAddTask}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Sample Task
                    </button>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-2xl mb-4">Tasks ({todos.length})</h2>
                    {todos.length === 0 ? (
                        <p className="text-gray-400">No tasks yet. Click "Add Sample Task" to get started!</p>
                    ) : (
                        <div className="space-y-3">
                            {todos.map((todo) => (
                                <div 
                                    key={todo.id} 
                                    className="flex items-center justify-between bg-slate-700 p-4 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleTodo(todo.id)}
                                            className="w-5 h-5"
                                        />
                                        <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                                            {todo.text}
                                        </span>
                                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                            {todo.priority}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleDashboard;