
export interface ImageHistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface DesignAdvice {
  title: string;
  content: string;
  category: 'Composition' | 'Performance' | 'Lighting' | 'Animation';
}
