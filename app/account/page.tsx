"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Account() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/getSessionList").then(async (res) => {
      if (!res.ok) {
        return router.push("/account/login");
      }

      setSessions(await res.json());
    })
  }, []);

  const logout = () => {
    fetch("/api/user/logout").then(() => {
      return router.push("/account/login");
    })
  };

  return (
    <main>
      <button onClick={() => {logout()}}>Logout</button>
      {sessions.map((session) => {
        const lastActive = new Date(session.lastActive);
        return (
          <div>
            Last used: {lastActive.toLocaleString()}
            <br/>
            Ip address: {session.userIp}
            <br/>
            OS: {session.os}

            <br/>
            <br/>
          </div>
        )
      })}
    </main>
  )
}
