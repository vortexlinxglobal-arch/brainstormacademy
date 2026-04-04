const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL or NEXT_PUBLIC_API_BASE_URL must be set to use backend API endpoints.");
  }
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export async function postAdmission(data) {
  const response = await fetch(buildUrl("v1/admissions"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchBackend(path, options = {}) {
  const response = await fetch(buildUrl(path), options);
  return response.json();
}
