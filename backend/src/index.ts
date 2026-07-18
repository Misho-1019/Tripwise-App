import express from "express"
import cors from "cors"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

dotenv.config()

import authRoutes from "./routes/auth"
import destinationRoutes from "./routes/destinations"
import tripRoutes from "./routes/trips"
import savedRoutes from "./routes/saved"
import reviewRoutes from "./routes/reviews"
import aiRoutes from "./routes/ai"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(limiter)

app.use("/api/auth", authRoutes)
app.use("/api/destinations", destinationRoutes)
app.use("/api/categories", destinationRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/saved", savedRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/ai", aiRoutes)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("join-trip", (tripId: string) => {
    socket.join(`trip:${tripId}`)
  })

  socket.on("leave-trip", (tripId: string) => {
    socket.leave(`trip:${tripId}`)
  })

  socket.on("trip-update", (data: { tripId: string; update: any }) => {
    socket.to(`trip:${data.tripId}`).emit("trip-changed", data.update)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`TripWise API running on port ${PORT}`)
})

export default app
