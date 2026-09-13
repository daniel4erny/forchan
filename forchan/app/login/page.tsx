import GenToken from "./genToken";

export default function Login() {
  return (
    <>
      <div className="flex justify-center w-full min-h-screen">
        <div className="w-[70%] min-h-screen bg-[url('/fade.png')] bg-[length:100%_100%] bg-no-repeat bg-top bg-fixed">
          <main className="pt-24 pl-16 pr-16">
            <p className="text-2xl mb-3 text-center text-body">
              So, after clicking login, you will get a special token, the token is just for managing all messages from the same token. (deletion and edit) <br/><br/>
              The token will be deleted in 31 days, to reset the timer, make a post or paste it into "Reset token" <br/><br/>
              Messages made with token work normally - not interesting will be deleted. Without the token the message will be simply deleted after three days <br/><br/>
            </p>

            <GenToken/>

          </main>
        </div>
      </div>
    </>
  );
}
