import fs from "node:fs";
import path from "node:path";

import { Cta } from "@/components/cta";
import { Flow } from "@/components/flow";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Problem } from "@/components/problem";

/**
 * The hero renders a procedural steel-container elevation by default. Drop a
 * grayscale photograph at web/public/hero.{jpg,png,webp} and it is picked up
 * automatically at build time, with no code change required.
 */
function findHeroPhotograph(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const file of ["hero.jpg", "hero.png", "hero.webp"]) {
    if (fs.existsSync(path.join(publicDir, file))) return `/${file}`;
  }
  return null;
}

export default function Page() {
  const photograph = findHeroPhotograph();

  return (
    <>
      <Nav />
      <main>
        <Hero photograph={photograph} />
        <Problem />
        <Flow />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
