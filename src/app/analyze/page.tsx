"use client";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import styles from "./page.module.css";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { cpp } from "@codemirror/lang-cpp";
import { useQuery } from "@tanstack/react-query";
import { getComplexityResponse, ComplexityData } from "../utils/openai";
import ComplexityResponse from "./components/ComplexityResponse";

export default function Analyze() {
  const [codeInput, setCodeInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  const { isPending, isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: ["openai_response"],
    queryFn: (): Promise<ComplexityData> | null =>
      getComplexityResponse(codeInput, tokenInput),
    refetchOnWindowFocus: false,
    retry: false, //this was causing retries and hence delays when i myself was throwing a validation ewrr on the fetch fn
    enabled: false, // disable this query from automatically running
  });
  console.log({ isPending, isLoading, isFetching, error, data });
  console.log({ tokenInput, codeInput });
  return (
    <div className={styles.page}>
      <div className={styles.ctaSection}>
        <h3>Enter your code</h3>
        <div className={styles.inputSection}>
          <CodeMirror
            className={styles.codeInput}
            value={codeInput}
            height="300px" // Set the height as needed
            theme={vscodeLight}
            extensions={[cpp()]} // Use the appropriate language mode
            onChange={(value) => {
              setCodeInput(value);
            }}
          />
          <div className={styles.ctaBottom}>
            <button onClick={() => refetch()}>Analyze</button>
            <input
              type="password"
              className={styles.tokenInput}
              placeholder="Enter your OpenAI API Key"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ComplexityResponse
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
