import { Explorer } from "@datawheel/tesseract-explorer";
import Head from 'next/head';

const PANELS = [
  {key: "table", label: "Data Table", component: TableView},
  {key: "matrix", label: "Pivot Table", component: PivotView},
  {key: "debug", label: "Raw response", component: DebugView},
  {key: "vizbuilder", label: "Vizbuilder", component: VizbuilderPanel}
];

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Explorer
        panels={PANELS}
        previewLimit={100}
        source={process.env.TESSERACT_SOURCE}
        withinMantineProvider
        withinReduxProvider
        withMultiQuery
      />
    </div>
  )
}
