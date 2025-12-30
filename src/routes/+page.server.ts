import { lucia, requireLogin } from "$lib/server/auth";
import type { Actions } from "./$types";
import { redirect } from "sveltekit-flash-message/server";

export const actions: Actions = {
  logout: async (event) => {
    requireLogin(event);

    const session = event.locals.session;
    if (!session) {
      return redirect(
        "/auth/login",
        {
          type: "error",
          message: {
            title: "You're not logged in.",
            description: "",
          },
        },
        event.cookies
      );
    }
    await lucia.invalidateSession(session.id);
    event.locals.user = null;
    event.locals.session = null;
  },
};
