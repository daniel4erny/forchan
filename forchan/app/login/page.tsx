import GenToken from "./genToken";
import SetToken from "./setToken";

export default function Login() {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
        <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-4">Get your token</h1>

          <p className="mb-6">
            After clicking login, you will get a special token. The token is just for managing all
            messages from the same token (deletion and edit).
          </p>

          <ul className="list-disc pl-6 mb-10 space-y-1">
            <li>
              The token will be deleted in 31 days. To reset the timer, make a post or paste it into
              &quot;Reset token&quot;.
            </li>
            <li>Messages made with token work normally &mdash; not interesting will be deleted.</li>
            <li>Without the token the message will be simply deleted after three days.</li>
          </ul>

          <div className="grid gap-8 md:grid-cols-2">
            <GenToken />
            <SetToken />
          </div>
        </main>
      </div>
    </div>
  );
}
