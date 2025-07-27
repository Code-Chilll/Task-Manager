# Task Manager - Search, Filtering, and Pagination Features

This document describes the new search, filtering, and pagination features added to the Task Manager application.

## Backend Features

### New API Endpoint

**GET /tasks/paginated** - Enhanced task retrieval with pagination, search, and filtering

**Parameters:**
- `userEmail` (required): User's email address
- `search` (optional): Search term to filter by task name or description
- `priority` (optional): Filter by priority (low, medium, high)
- `completed` (optional): Filter by completion status (true/false)
- `page` (optional, default: 0): Page number (0-based)
- `size` (optional, default: 10): Number of items per page (max 100)
- `sortBy` (optional, default: "createdAt"): Field to sort by (createdAt, name, priority, completed, lastDate)
- `sortDir` (optional, default: "desc"): Sort direction (asc/desc)

**Example Request:**
```
GET /tasks/paginated?userEmail=user@example.com&search=meeting&priority=high&completed=false&page=0&size=20&sortBy=name&sortDir=asc
```

**Response:**
```json
{
  "tasks": [...],
  "totalElements": 45,
  "totalPages": 3,
  "currentPage": 0,
  "size": 20,
  "hasNext": true,
  "hasPrevious": false
}
```

### Database Enhancements

- Added custom JPQL queries with JOIN FETCH for efficient data loading
- Implemented case-insensitive search across task names and descriptions
- Added filtering by priority and completion status
- Support for multiple sorting options

## Frontend Features

### Search Functionality
- Real-time search input for task names and descriptions
- Enter key support for quick search execution
- Search results are highlighted and paginated

### Filtering Options
- **Priority Filter**: Filter tasks by Low, Medium, or High priority
- **Status Filter**: Filter by Pending or Completed tasks
- **Combined Filters**: All filters work together for precise results

### Sorting Capabilities
- Sort by Name, Priority, or Creation Date
- Toggle between ascending and descending order
- Visual indicators show current sort field and direction

### Pagination Controls
- Configurable page sizes (5, 10, 20, 50 items per page)
- First, Previous, Next, Last navigation buttons
- Page information display (current page, total pages, total items)
- Results summary showing current range

### Enhanced User Interface
- **Search & Filter Panel**: Organized controls for easy access
- **Results Summary**: Shows current result range and total count
- **Visual Feedback**: Loading states, empty states, and error handling
- **Responsive Design**: Works on desktop and mobile devices

### Priority Color Coding
Tasks now display priority with color-coded indicators:
- **High Priority**: Red text
- **Medium Priority**: Yellow text  
- **Low Priority**: Green text

## User Experience Improvements

### Admin Users
- Can search and filter across all tasks in the system
- See task ownership information in results
- Full access to pagination and sorting features

### Regular Users
- Search and filter within their own tasks
- Same pagination and sorting capabilities
- Optimized queries for better performance

### Performance Optimizations
- Server-side pagination reduces data transfer
- Efficient database queries with proper indexing
- Client-side state management for smooth interactions

## How to Use

1. **Search**: Type in the search box and press Enter or click the Search button
2. **Filter**: Use the dropdown menus to filter by priority and status
3. **Sort**: Click the sort buttons to change ordering
4. **Paginate**: Use the pagination controls at the bottom
5. **Clear**: Use the "Clear Filters" button to reset all filters

## Technical Implementation

### Backend Stack
- Spring Boot with JPA/Hibernate
- Custom repository methods with JPQL
- Pageable interface for pagination
- DTO pattern for response objects

### Frontend Stack  
- Next.js 14 with React hooks
- Tailwind CSS for styling
- Custom UI components
- URL parameter management for bookmarkable searches

## Future Enhancements

Potential improvements for future versions:
- Advanced date range filtering
- Bulk operations on filtered results
- Export functionality for search results
- Saved search/filter presets
- Real-time updates with WebSocket
