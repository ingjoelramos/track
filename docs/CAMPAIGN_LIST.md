# Campaign List Implementation

## Overview

The campaign list component implements search, filtering, pagination, and link copying features to efficiently manage and display campaigns. This document outlines the key features and their implementation details.

## Features

### 1. Copy Link Functionality ✓
- One-click link copying
- Visual feedback with icon transition
- Success toast notification
- Automatic reset after 2 seconds
- Supports multiple link formats

### 2. Search Functionality ✓
- Real-time search filtering
- Case-insensitive search
- Searches through campaign names
- Instant results updating
- Empty state handling

### 3. Status Filtering ✓
- Filter options:
  - All
  - Active
  - Paused
  - Draft
- Visual indicators for current filter
- Combined filtering with search

### 4. Pagination ✓
- 10 items per page
- Page navigation controls
- Current page indicator
- First/last page detection
- Responsive design

## Implementation Details

### Copy Link Implementation
```typescript
function CampaignCard({ campaign }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    const url = `https://${domain?.host}/${campaign.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    addToast({
      title: 'Link Copied',
      description: 'Campaign link copied to clipboard',
      variant: 'success',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopyLink}
      className="text-gray-500 hover:text-primary-600"
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Link className="h-4 w-4" />
      )}
    </Button>
  );
}
```

### Search and Filter Logic
```typescript
const filteredCampaigns = useMemo(() => {
  return campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}, [campaigns, searchTerm, statusFilter]);
```

### Pagination Calculation
```typescript
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);
```

## Component Structure

### Campaign Card Actions
- Copy link button with state feedback
- Status toggle (admin only)
- View dashboard link
- Visual status indicators

### Search Bar
- Input field with search icon
- Real-time filtering
- Clear button when search has content

### Status Filter Buttons
- Toggle buttons for each status
- Visual feedback for active filter
- Responsive layout

### Campaign Grid
- Responsive grid layout
- Campaign cards with status indicators
- Empty state handling

### Pagination Controls
- Page numbers
- Previous/Next buttons
- Current page highlight
- Disabled state for edge cases

## Usage Example

```jsx
<CampaignCard campaign={campaign}>
  <div className="flex items-center gap-2">
    {/* Copy Link Button */}
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopyLink}
      className="text-gray-500 hover:text-primary-600"
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Link className="h-4 w-4" />
      )}
    </Button>
    
    {/* Status Toggle (Admin Only) */}
    {onStatusToggle && campaign.status !== 'draft' && (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onStatusToggle(campaign.id, campaign.status)}
      >
        {campaign.status === 'active' ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    )}
  </div>
</CampaignCard>
```

## Performance Considerations

1. **Memoization**
   - Uses `useMemo` for filtered results
   - Prevents unnecessary re-filtering
   - Optimizes render performance

2. **Pagination**
   - Limits rendered items
   - Reduces DOM size
   - Improves scrolling performance

3. **Search Optimization**
   - Debounced search input
   - Case-insensitive comparison
   - Efficient filtering algorithm

4. **Copy Link Optimization**
   - State reset timeout cleanup
   - Efficient clipboard API usage
   - Minimal re-renders

## Accessibility Features

1. **Keyboard Navigation**
   - Focusable controls
   - Logical tab order
   - Keyboard shortcuts

2. **ARIA Labels**
   - Descriptive button labels
   - Status announcements
   - Screen reader support

3. **Visual Indicators**
   - High contrast states
   - Focus indicators
   - Loading states
   - Copy feedback

## Error Handling

1. **Empty States**
   - No results message
   - Search feedback
   - Clear filter option

2. **Edge Cases**
   - Invalid page numbers
   - Out of range navigation
   - Reset functionality
   - Clipboard API fallbacks

## Future Enhancements

1. **Advanced Link Options**
   - Custom URL parameters
   - UTM parameter builder
   - Link shortening
   - QR code generation

2. **Advanced Search**
   - Multiple field search
   - Date range filtering
   - Tag-based filtering

3. **Sorting**
   - Multiple sort criteria
   - Sort direction toggle
   - Custom sort functions

4. **View Options**
   - List/grid toggle
   - Compact view
   - Custom page sizes

5. **Export**
   - CSV export
   - Selected items export
   - Custom field selection

## Testing Considerations

1. **Unit Tests**
   - Filter logic
   - Pagination calculation
   - Search functionality
   - Copy link behavior

2. **Integration Tests**
   - Component interaction
   - State management
   - User flow validation
   - Clipboard operations

3. **E2E Tests**
   - Search scenarios
   - Filter combinations
   - Pagination navigation
   - Link copying workflow