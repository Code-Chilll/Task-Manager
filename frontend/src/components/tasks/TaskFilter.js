"use client";

export default function TaskFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">Filter Tasks:</span>
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                currentFilter === filter.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}