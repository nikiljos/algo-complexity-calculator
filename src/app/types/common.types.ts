type ComplexityAiResponse = {
  spaceComplexity: string;
  spaceComplexityCalc: string;
  spaceComplexityExplain: string;
  timeComplexity: string;
  timeComplexityCalc: string;
  timeComplexityExplain: string;
  error?: string;
};
export type ComplexityData = {
  content: ComplexityAiResponse;
};
