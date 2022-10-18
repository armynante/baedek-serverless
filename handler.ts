import serverless from "serverless-http";
import express from "express";
import scrape from "./lib/infatuation/hitlist";
const app = express();

app.get("/", async (req, res, next) => {
  const  hitlist = await scrape((err, result) => {
    if (err) {
      return next(err);
    }
    return result;
  });
  return res.status(200).json( hitlist );
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
