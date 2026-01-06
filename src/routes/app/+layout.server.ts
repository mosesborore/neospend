import { requireLogin } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const user = requireLogin(event);

  if (!user) {
    return {
      isAuthenticated: false,
    };
  }

  return { isAuthenticated: true, user };
};
