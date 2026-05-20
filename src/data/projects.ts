export type ProjectStatus = "active" | "shipped" | "beta" | "archived"

export interface Project {
  name: string
  description: string
  url: string
  status: ProjectStatus
  section: "building" | "project"
  startDate?: string
}

export const projects: Project[] = [
  {
    name: "Lacy Shell",
    description:
      "Talk to your terminal. Natural language routes to AI agents automatically.",
    url: "https://lacy.sh",
    status: "active",
    section: "building",
    startDate: "2024-01-01",
  },
  {
    name: "Juno AI",
    description:
      "Voice-operate your computer. Rust + Tauri + Whisper.",
    url: "https://junebug.ai",
    status: "active",
    section: "building",
    startDate: "2025-01-01",
  },
  {
    name: "Shipkit",
    description:
      "Ship Next.js apps fast. Auth, payments, AI included.",
    url: "https://shipkit.io",
    status: "active",
    section: "building",
    startDate: "2024-01-01",
  },
  {
    name: "AI Alpaca",
    description:
      "Autonomous trading bot. Claude + Alpaca MCP.",
    url: "https://github.com/lacymorrow/ai-alpaca",
    status: "beta",
    section: "building",
    startDate: "2026-01-01",
  },
  {
    name: "shipx",
    description:
      "Interactive release CLI — bump, tag, publish, and ship from one command.",
    url: "https://github.com/lacymorrow/shipx",
    status: "active",
    section: "building",
    startDate: "2025-01-01",
  },
  {
    name: "Paperclip Hub",
    description:
      "Plugin hub & marketplace for Paperclip AI agents.",
    url: "https://cliphub.fyi",
    status: "active",
    section: "building",
    startDate: "2025-01-01",
  },
  {
    name: "CrossOver",
    description:
      "Gaming overlay for any screen. Windows, Mac, and Linux. Featured in Windows Store.",
    url: "https://gh.lacymorrow.com/crossover",
    status: "shipped",
    section: "project",
    startDate: "2015-01-01",
  },
  {
    name: "OpenClaw Trading",
    description:
      "Autonomous AI trading agents in Rust, Go, and Shell for stocks and prediction markets.",
    url: "https://github.com/lacymorrow/openclaw-alpaca-trading-skill",
    status: "active",
    section: "project",
    startDate: "2024-01-01",
  },
  {
    name: "MCP Servers & Tools",
    description:
      "Model Context Protocol integrations for AI agent desktop automation.",
    url: "https://github.com/lacymorrow",
    status: "active",
    section: "project",
    startDate: "2025-01-01",
  },
  {
    name: "Cloud0 AI",
    description:
      "100% private, offline AI. Your data never leaves your machine.",
    url: "https://cloud0.dev",
    status: "shipped",
    section: "project",
    startDate: "2024-01-01",
  },
  {
    name: "Twilio HackPack v4",
    description:
      "Open source hardware badge for SIGNAL 2018. Joystick, lights, touchscreen on Raspberry Pi Zero.",
    url: "https://github.com/twilio/hackpack-v4",
    status: "archived",
    section: "project",
    startDate: "2018-01-01",
  },
  {
    name: "XSPF Jukebox",
    description:
      "Web-based playlist player. One of the original web audio players.",
    url: "https://xspf-jukebox.vercel.app",
    status: "archived",
    section: "project",
    startDate: "2008-01-01",
  },
]

export const buildingProjects = projects.filter((p) => p.section === "building")
export const gridProjects = projects.filter((p) => p.section === "project")
