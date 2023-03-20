import { Explorer } from "@datawheel/tesseract-explorer";
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Explorer
        multiquery
        src={process.env.TESSERACT_SOURCE}
      />
    </div>
  )
}
