import { useEffect } from "react"
import { router } from "expo-router"

export default function AiTabRedirect() {
  useEffect(() => {
    router.replace("/ai-planner")
  }, [])
  return null
}
