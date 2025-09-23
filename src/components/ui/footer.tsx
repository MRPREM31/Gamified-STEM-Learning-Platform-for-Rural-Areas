import { Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "./button"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            © 2025 EduQuest. All Rights Reserved. Made by{" "}
            <a
              href="https://mrprem.in/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Quantumcoders
            </a>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary"
            asChild
          >
            <a
              href="https://github.com/MRPREM31"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary"
            asChild
          >
            <a
              href="https://twitter.com/eduquest"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary"
            asChild
          >
            <a
              href="https://linkedin.com/company/eduquest"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}