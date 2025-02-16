import Image from "next/image";
import styles from "./page.module.css";
import loadingImg from "../assets/loading.webp";
import ErrorComponent from "../components/ErrorComponent";

export default function ComplexityResponse({
  data,
  error,
  isLoading,
  isFetching,
}: Record<string, any>) {
  if (isFetching || isLoading) {
    return (
      <div>
        <Image src={loadingImg} alt="Loading..." />
      </div>
    );
  }
  if (error) {
    console.log({ error });
    return <ErrorComponent errorMsg={error.message || JSON.stringify(error)} />;
  }
  if (!data || !data.content) {
    return <div></div>;
  }
  if (data.content?.error) {
    return <ErrorComponent errorMsg={data.content?.error} />;
  }
  return (
    <div className="responseSection">
      <div className={styles.complexity}>
        <h3>Time Complexity</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box}>
            <strong>Complexity</strong>{" "}
            <span className={styles.complexityValue}>
              {data.content.timeComplexity}
            </span>
          </div>
          <div className={styles.box}>
            <strong>Calculation</strong>{" "}
            <span className={styles.complexityValue}>
              {data.content.timeComplexityCalc}
            </span>
          </div>
        </div>
        <div className={styles.explanation}>
          <strong>Explanation</strong>
          <div className={styles.explanationText}>
            {data.content.timeComplexityExplain}
          </div>
        </div>
      </div>
      <div className={styles.complexity}>
        <h3>Space Complexity</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box}>
            <strong>Complexity</strong>{" "}
            <span className={styles.complexityValue}>
              {data.content.spaceComplexity}
            </span>
          </div>
          <div className={styles.box}>
            <strong>Calculation</strong>{" "}
            <span className={styles.complexityValue}>
              {data.content.spaceComplexityCalc}
            </span>
          </div>
        </div>
        <div className={styles.explanation}>
          <strong>Explanation</strong>
          <div className={styles.explanationText}>
            {data.content.spaceComplexityExplain}
          </div>
        </div>
      </div>
    </div>
  );
}
