import styles from "./navbar.module.css";
import iconImg from "../assets/icon.png";
import Image from "next/image";
export default function NavBar() {
  return (
    <div className={styles.main}>
      <div className={styles.siteName}>
        <Image src={iconImg} className={styles.icon} alt="icon" />
        <h3>ComplexityCalc</h3>
      </div>
    </div>
  );
}
