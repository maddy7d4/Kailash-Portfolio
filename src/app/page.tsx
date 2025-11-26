import { Hero } from "@/components/sections/hero"
import { Work } from "@/components/sections/work"
import { Services } from "@/components/sections/services"
import { Process } from "@/components/sections/process"
import { Testimonials } from "@/components/sections/testimonials"
import { Toolkit } from "@/components/sections/toolkit"
import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Work />
      <Services />
      <Toolkit />
      <Process />
      <Testimonials />
      <About />
      <Contact />
    </main>
  )
}
