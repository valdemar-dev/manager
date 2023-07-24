"use client";

import hashText from "@/utils/hashText";
import { detect } from "detect-browser";
import { useRouter } from "next/navigation";

export default function Login() {
  const browser = detect();
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
    }

    const data = {
      username: hashText(target.username.value).output,
      email: hashText(target.email.value).output,
      password: hashText(target.password.value).output,
      browserName: browser?.name || "NULL",
      os: browser?.os || "NULL",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/api/user/login", options).then(async (response) => {
      if (!response.ok) {
        return alert(await response.text())
      }

      localStorage.setItem("username", target.username.value);
      router.push("/dashboard");
    })
  }

  return (
    <main>
      <form onSubmit={async (event) => {await handleLogin(event)}}>
        <input type="text" name="username" placeholder="username"/>
        <input type="email" name="email" placeholder="email"/>
        <input type="password" name="password" placeholder="password"/>

        <button type="submit">Login</button>
      </form>
    </main>
  )
}