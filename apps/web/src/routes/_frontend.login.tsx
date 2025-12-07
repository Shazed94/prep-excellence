import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/store/useAuth";
import { BACKEND_URL } from "@/lib/GlobalVariable";

export const Route = createFileRoute("/_frontend/login")({
  component: LoginPage,
});

function LoginPage() {
  // Read the `from` search param directly to avoid subscribing to router
  // search state which was causing a render loop in this setup.
  // const params =
  //   typeof window !== "undefined"
  //     ? new URLSearchParams(window.location.search)
  //     : null;
  // const from = params?.get("from") ?? "/admin";

  // Use the store's getState() to call login without subscribing the
  // component to the store (prevents unnecessary re-renders).
  const authStore = (
    useAuth as unknown as {
      getState: () => { login: (token: string) => void };
    }
  ).getState();
  console.log("authstore", authStore);
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget || e.target);
    const email = form.get("email");
    const password = form.get("password");

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Call login via the store instance (no subscription)
    authStore.login(data.accessToken);

    // Redirect to the original requested page
    // window.location.href = from;
  }

  return (
    <form onSubmit={handleLogin}>
      <input name="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
