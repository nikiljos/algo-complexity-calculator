"use client";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import styles from "./page.module.css";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { cpp } from "@codemirror/lang-cpp";
import { useQuery } from "@tanstack/react-query";
import { getComplexityResponse } from "../utils/openai.utils";
import ComplexityResponse from "./ComplexityResponse";
import { parseCodeValue } from "../utils/urlparser.utils";
import { ComplexityData } from "../types/common.types";
import Switch from "@mui/material/Switch";

export default function Analyze() {
  const [codeInput, setCodeInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [localMode, setLocalMode] = useState(false);

  const { isLoading, isFetching, error, isError, data, refetch } = useQuery({
    queryKey: ["openai_response"],
    queryFn: (): Promise<ComplexityData> | null =>
      getComplexityResponse(codeInput, tokenInput, localMode),
    refetchOnWindowFocus: false,
    retry: false, //this was causing retries and hence delays when i myself was throwing a validation ewrr on the fetch fn
    enabled: false, // disable this query from automatically running
  });

  useEffect(() => {
    const decodedInput = parseCodeValue(window.location.search);
    if (decodedInput) {
      setCodeInput(decodedInput);
    }
  }, []);

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
            {localMode ? (
              <input
                type="password"
                className={styles.tokenInput}
                placeholder="Enter your OpenAI API Key"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
            ) : (
              <></>
            )}
          </div>
          <div className={styles.extraConfig}>
            <details>
              <summary>Advanced Config</summary>
              <div className={styles.localToggle}>
                <Switch
                  value={localMode}
                  onChange={(e) => setLocalMode(e.target.checked)}
                />
                <span>Local Mode</span>
              </div>
            </details>
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
