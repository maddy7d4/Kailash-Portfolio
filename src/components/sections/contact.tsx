"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Mail, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import { Meteors } from "@/components/ui/meteors"
import { SoundTrigger } from "@/components/ui/sound-trigger"
import { ContactScene } from "@/components/3d/contact-scene"
import Link from "next/link"

export function Contact() {
    return (
        <section id="contact" className="py-32 bg-background relative overflow-hidden min-h-screen flex items-center justify-center">
            <SoundTrigger profile="contact" />
            <ContactScene />
            <Meteors number={20} />
            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's Create Together</h2>
                    <p className="text-xl text-muted-foreground mb-12">
                        Ready to elevate your visual content? Reach out and let's discuss your next project.
                    </p>

                    <a
                        href="mailto:hello@kailas.com"
                        className="inline-flex items-center gap-3 text-2xl md:text-4xl font-bold hover:text-primary transition-colors"
                    >
                        <Mail className="w-8 h-8 md:w-12 md:h-12" />
                        hello@kailas.com
                    </a>

                    <div className="flex justify-center gap-8 mt-16">
                        {[
                            { icon: Instagram, href: "#" },
                            { icon: Twitter, href: "#" },
                            { icon: Linkedin, href: "#" },
                            { icon: Youtube, href: "#" }
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                className="p-4 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all hover:scale-110"
                            >
                                <social.icon className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                </motion.div>
            </Container>

            <footer className="absolute bottom-8 left-0 w-full text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Kailas. All rights reserved.</p>
            </footer>
        </section>
    )
}
