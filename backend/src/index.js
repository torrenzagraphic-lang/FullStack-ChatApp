import express from "express";
import { toNodeHandler } from "better-auth/node";
import "dotenv/config";
import { auth } from "./lib/auth.js";
import { friendRouter } from "./modules/friend/friend.routes.js";
import { chatRouter } from "./modules/chat/chat.routes.js";
const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.use("/api/friend", friendRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
    res.send("Hello From backend");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
