export default function LoginPage() {
  return (
    <main className="min-h-screen bg-darkBg flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-darkCard rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-accent mb-6">Login</h1>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accentDark transition"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-mutedText mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-accent hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}
