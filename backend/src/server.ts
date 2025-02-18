import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.get("/", (_, res) => {
  res.send("Welcome Internal Usage API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
