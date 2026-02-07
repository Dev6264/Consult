export default function LoginPage() {
  return (
    <div className="mx-auto mt-20 max-w-md space-y-6">
      <div className="card space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Welcome to SteeringOS</h1>
        <p className="text-sm text-slate-400">
          Sign in to steer your store with real-time intelligence.
        </p>
        <form className="mt-6 space-y-4 text-left">
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              placeholder="owner@acmebikes.com"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              placeholder="••••••••"
            />
          </label>
          <button className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      </div>
      <p className="text-center text-xs text-slate-500">
        Demo accounts are listed in the README.
      </p>
    </div>
  );
}
