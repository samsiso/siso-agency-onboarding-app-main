import { toPng } from 'html-to-image';

export const exportFlowAsPng = async (flowRef: HTMLElement | null, projectName: string = 'userflow') => {
  if (!flowRef) {
    throw new Error('Flow reference is not available');
  }
  
  try {
    // Create the PNG
    const dataUrl = await toPng(flowRef, {
      backgroundColor: '#111111',
      width: flowRef.offsetWidth * 2,
      height: flowRef.offsetHeight * 2,
      pixelRatio: 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
      }
    });
    
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-userflow.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting flow diagram:', error);
    throw error;
  }
}; 