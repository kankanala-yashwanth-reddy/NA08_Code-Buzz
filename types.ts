
export interface AnalysisContent {
  disease: string;
  pesticide: string;
  recommendation: string;
}

export interface AnalysisResponse {
  english: AnalysisContent;
  telugu: AnalysisContent;
}
