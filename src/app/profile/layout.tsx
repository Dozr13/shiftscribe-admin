import styles from '../layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.innerLayout}>
      <div>Announcements: Tomorrow is a holiday!</div>
      <div>{children}</div>
    </div>
  );
}
