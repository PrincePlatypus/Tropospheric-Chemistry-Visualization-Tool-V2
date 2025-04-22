/**
 * UI Configuration including layout and styling
 */

export const UI_CONFIG = {
  layout: {
    grid: {
      columns: 2,
      rows: 2,
      gap: '2px'
    },
    sections: {
      topLeft: {
        title: 'Chart 1',
        height: '100%',
        padding: '20px'
      },
      topRight: {
        title: 'Map View',
        height: '100%',
        padding: '0'
      },
      bottomLeft: {
        title: 'Chart 2',
        height: '100%',
        padding: '20px'
      },
      bottomRight: {
        title: 'Chart 3',
        height: '100%',
        padding: '20px'
      }
    }
  },
  theme: {
    colors: {
      primary: '#f0f0f0',
      secondary: '#ffffff',
      text: '#333333',
      accent: '#1E90FF',
      error: '#FF0000'
    },
    fonts: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      code: 'source-code-pro, Menlo, Monaco, Consolas, monospace'
    }
  }
}; 