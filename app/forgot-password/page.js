export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-darkBg flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-darkCard rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-accent mb-6">
          Reset Password
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accentDark transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-mutedText mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-accent hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}
