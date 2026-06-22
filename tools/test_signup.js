const http = require("http");

const data = JSON.stringify({
  email: "test+local@example.com",
  password: "Password123",
  full_name: "Local Test",
  date_of_birth: "2000-01-01",
  trade_code: "WEB",
});

const options = {
  hostname: "localhost",
  port: 3003,
  path: "/api/v1/auth/signup",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
  },
  timeout: 5000,
};

const req = http.request(options, (res) => {
  let body = "";
  res.setEncoding("utf8");
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.log("STATUS", res.statusCode);
    console.log("BODY", body);
  });
});

req.on("error", (e) => {
  console.error("REQUEST ERROR", e.message);
});

req.write(data);
req.end();
