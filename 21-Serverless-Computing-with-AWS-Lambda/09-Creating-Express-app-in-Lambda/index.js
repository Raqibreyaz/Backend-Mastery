import serverless from "serverless-http";
import app from "./app.js";

const isLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

export const lambdaFunction = serverless(app, { provider: "aws" });

if (!isLambda) {
  app.listen(8080, (error) => {
    if (error) return console.log(error);
    console.log(`Server is running at port 8080...`);
  });
}
