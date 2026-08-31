import fs from "node:fs";
import path from "node:path";

import { Cta } from "@/components/cta";
import { Flow } from "@/components/flow";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Problem } from "@/components/problem";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Flow />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
