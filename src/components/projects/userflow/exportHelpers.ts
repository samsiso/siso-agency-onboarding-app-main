import { toPng } from 'html-to-image';

/**
 * Exports a React Flow diagram as a PNG image
 * 
 * @param element - The DOM element to convert to an image
 * @param fileName - The name of the file to save
 */
export const exportFlowAsPng = async (element: HTMLElement, fileName: string = 'flow-diagram') => {
  try {
    // Create image
    const dataUrl = await toPng(element, {
      backgroundColor: '#111827',
      width: element.clientWidth,
      height: element.clientHeight,
      canvasWidth: element.clientWidth * 2,
      canvasHeight: element.clientHeight * 2,
      skipAutoScale: true,
      pixelRatio: 2, // Higher resolution
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting diagram:', error);
    throw new Error('Failed to export diagram');
  }
};

/**
 * Creates and returns a clone of the ReactFlow nodes and edges for saving/loading
 * 
 * @param nodes - The ReactFlow nodes
 * @param edges - The ReactFlow edges
 * @returns Object with cloned nodes and edges
 */
export const createFlowSnapshot = (nodes: any[], edges: any[]) => {
  return {
    nodes: nodes.map(node => ({ ...node })),
    edges: edges.map(edge => ({ ...edge })),
  };
};

/**
 * Calculates flow statistics from nodes and edges
 * 
 * @param nodes - The ReactFlow nodes
 * @param edges - The ReactFlow edges
 * @returns Statistics about the flow
 */
export const calculateFlowStats = (nodes: any[], edges: any[]) => {
  // Count node types
  const nodeTypeCount: Record<string, number> = {};
  nodes.forEach(node => {
    const type = node.type || 'default';
    nodeTypeCount[type] = (nodeTypeCount[type] || 0) + 1;
  });
  
  // Calculate node status counts
  const statusCount: Record<string, number> = {};
  nodes.forEach(node => {
    if (node.data && node.data.status) {
      statusCount[node.data.status] = (statusCount[node.data.status] || 0) + 1;
    }
  });
  
  // Calculate connection stats
  const connectionStats = {
    totalEdges: edges.length,
    startNodes: new Set(edges.map(e => e.source)).size,
    endNodes: new Set(edges.map(e => e.target)).size,
    isolatedNodes: nodes.filter(node => 
      !edges.some(e => e.source === node.id || e.target === node.id)
    ).length,
  };
  
  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodeTypeCount,
    statusCount,
    connectionStats,
    complexity: edges.length / Math.max(1, nodes.length), // A simple complexity metric
  };
}; 