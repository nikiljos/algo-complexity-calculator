const systemPrompt = `Analyze the time and space complexity of the given code and return a JSON response with the following keys and their accurate values. Always use standard notations to write the complexity. 
timeComplexity → final complexity like O(nlogn) [bigO]
timeComplexityCalc → define how this came up as a formula like O(n)+O(nlogn)=O(nlogn) [Must follow the '+' and '=' format]
timeComplexityExplain → explanation on how tom calculate it, with references to specific parts of the code
spaceComplexity
spaceComplexityCalc
spaceComplexityExplain

If a valid code is not provided by the user, return {"error":"reason"}`;

export const getComplexityResponse = (code: string, token: string) => {
  if (!code) {
    throw new Error("Code not found!");
  }
  if (!token) {
    throw new Error("No token found!");
  }
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: systemPrompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: code,
          },
        ],
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0,
    max_completion_tokens: 5048,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  return fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log("OpenAI Response:", data);
      const aiRes = data?.choices[0]?.message?.content;
      return {
        content: JSON.parse(aiRes),
      };
    });
};
