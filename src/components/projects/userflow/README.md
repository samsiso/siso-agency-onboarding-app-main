# User Flow Diagram Implementation

This directory contains the implementation of the User Flow diagram feature for the SISO Agency Onboarding App. The user flow diagram visualizes the user journey through the application using an interactive node-based diagram built with React Flow.

## Features

- Interactive node-based diagram showing user flows
- Three node types: Page, Action, and Decision
- Node details sidebar showing detailed information about selected nodes
- Export functionality to download the diagram as a PNG
- Controls for zooming, panning, and fitting the view
- Locking/unlocking the diagram for editing
- Visual distinction between live, in-development, and planned nodes

## Components

### Main Components

- `UserFlowDiagram.tsx` - The main component that renders the React Flow diagram
- `NodeDetailsSidebar.tsx` - Displays detailed information about a selected node
- `UserFlowToolbar.tsx` - Provides controls for interacting with the diagram

### Node Components

- `nodes/PageNode.tsx` - Represents application pages/screens
- `nodes/ActionNode.tsx` - Represents user actions
- `nodes/DecisionNode.tsx` - Represents conditional flows/decision points

### Utilities

- `sampleFlowData.ts` - Provides sample data for the flow diagram
- `exportHelpers.ts` - Utilities for exporting the diagram as images

## How to Use

The diagram is integrated into the project details page under the "User Flow" tab. Users can:

1. Click on nodes to see more details in the sidebar
2. Use the toolbar to zoom in/out and fit the view
3. Download the diagram as a PNG
4. (For admins) Toggle the lock to enable editing mode

## Data Structure

### Nodes
```typescript
interface FlowNode {
  id: string;
  type: 'page' | 'action' | 'decision';
  position: { x: number, y: number };
  data: {
    label: string;
    description?: string;
    status: 'live' | 'in-development' | 'planned';
    details?: {
      wireframeId?: string;
      implementationNotes?: string;
      requirements?: string[];
      externalLink?: string;
    };
  };
}
```

### Edges
```typescript
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'smoothstep';
  animated?: boolean;
}
```

## Future Enhancements

- Database integration for storing flow diagrams
- Collaborative editing features
- Auto-layout algorithms for complex diagrams
- Advanced node types for better representation of different user flow elements
- Integration with actual wireframes and screens
- Advanced export options (PDF, SVG, JSON) 