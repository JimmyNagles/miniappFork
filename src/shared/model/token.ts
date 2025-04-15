import { tokenApi } from "@/shared/api/token";
import { IS_LOCAL } from "@/shared/app-state";

export const TOKEN_STORAGE = "jwt-token";

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE);
}

async function updateToken() {
  try {
    // TODO: Replace this logic with your custom auth source
    const init_data = IS_LOCAL === "local" ? "your_fallback_init_data" : ""; // Or pull from your actual auth context/environment

    const { payload } = await tokenApi.generateToken({ init_data });

    if (payload) {
      localStorage.setItem(TOKEN_STORAGE, payload?.token);
      return { error: false };
    }

    return { error: true };
  } catch (e) {
    console.log(e);
    return { error: true };
  }
}

function clearToken() {
  localStorage.setItem(TOKEN_STORAGE, "");
}

export const tokenModel = {
  getToken,
  updateToken,
  clearToken,
};
