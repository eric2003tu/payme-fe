import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || "https://payme-0vf0.onrender.com",
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
  },
});

export async function getJson<T>(url: string): Promise<T> {
  return api.get(url).json<T>();
}

export async function postJson<TInput extends object, TOutput>(url: string, json: TInput): Promise<TOutput> {
  return api.post(url, { json }).json<TOutput>();
}

export async function patchJson<TInput extends object, TOutput>(url: string, json: TInput): Promise<TOutput> {
  return api.patch(url, { json }).json<TOutput>();
}
