import Link from 'next/link';
import styles from './layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>Next.js</title>
        <link
          rel='preload'
          href='/_next/static/css/app/second/page.css?v=1688149354840'
          as='style'
        />
      </head>
      <body>
        <div className={styles.header}>
          <div>
            <h1 style={{ marginTop: 0 }}>From layout</h1>
          </div>
          <div>
            <Link href='./'>navigate to home page</Link>
          </div>
          <div>
            <Link href='/profile/employee'>navigate to employee profile</Link>
          </div>
          <div>
            <Link href='/profile/superAdmin'>
              navigate to superAdmin profile
            </Link>
          </div>
          <div>
            <Link href='/second'>navigate to second page example</Link>
          </div>
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
