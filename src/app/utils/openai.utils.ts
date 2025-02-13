const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const systemPrompt = `Analyze the time and space complexity of the given code and return a JSON response with the following keys and their accurate values. Always use standard notations to write the complexity. 
timeComplexity → final complexity like O(nlogn) [bigO]
timeComplexityCalc → define how this came up as a formula like O(n)+O(nlogn)=O(nlogn) [Must follow the '+' and '=' format]
timeComplexityExplain → explanation on how to calculate it, with references to specific parts of the code
spaceComplexity
spaceComplexityCalc
spaceComplexityExplain

If a valid code is not provided by the user, return {"error":"reason"}`;

export const getComplexityResponse = (
  code: string,
  token: string,
  useDirectApi: boolean = true
) => {
  if (!code) {
    throw new Error("Code not found!");
  }
  if (useDirectApi && !token) {
    throw new Error("No token found!");
  }

  if (!useDirectApi) {
    return getDataFromApi(code);
  }
  return getDataFromOpenAi(code, token);
};

export const getDataFromApi = (code: string) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
  });

  const body = JSON.stringify({ code });

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };
  return fetch("/api/analyze", requestOptions).then(async (res) => {
    if (!res.ok) {
      const errorRes = await res.json();
      return Promise.reject(new Error(errorRes?.message || res.statusText));
    }
    return res.json();
  });
};

export const getDataFromOpenAi = (
  code: string,
  token: string,
  model: string = DEFAULT_MODEL
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const body = JSON.stringify({
    model,
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
    max_completion_tokens: 5000,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  return fetch(OPENAI_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data?.usage);
      const aiRes = data?.choices[0]?.message?.content;
      return {
        content: JSON.parse(aiRes),
      };
    });
};
