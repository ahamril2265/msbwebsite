export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-darkBg flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-darkCard rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-accent mb-6">Sign Up</h1>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accentDark transition"
          >
            Sign Up
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-mutedText mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
