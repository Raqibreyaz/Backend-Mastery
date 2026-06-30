export const lambda = async (event) => {
  return {
    statusCode: 200,
    "content-type": "application/json",
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};
