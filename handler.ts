import serverless from "serverless-http";
import express from "express";
import scrape from "./scrape";
const app = express();

app.get("/", async (req, res, next) => {
  const url = await scrape((err, result) => {
    if (err) {
      return next(err);
    }
    return result;
  });
  return res.status(200).json({
    message: url,
  });
});

// app.get("/hello", (req, res, next) => {
//   return res.status(200).json({
//     message: "Hello from path!",
//   });
// });

// app.use((req, res, next) => {
//   return res.status(404).json({
//     error: "Not Found",
//   });
// });

module.exports.handler = serverless(app);
