import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.get("/", (_, res) => {
  res.send("Welcome Internal Usage API");
});
app.get("/test", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://internal-usage.vercel.app"
  );
  res.json({ message: "CORS working!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
