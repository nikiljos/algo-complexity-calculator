import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Algo Complexity Analyzer</h1>
        <ol>
          <li>Paste your code</li>
          <li>Add you OpenAI key</li>
        </ol>

        <div className={styles.ctas}>
          <Link
            className={styles.primary}
            href="/analyze"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Try Now
          </Link>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Github
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://nikjos.in" target="_blank" rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          nikjos.in →
        </a>
      </footer>
    </div>
  );
}
