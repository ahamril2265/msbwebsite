"use client";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="bg-darkCard p-6 rounded-lg shadow max-w-lg space-y-6">
        <div>
          <label className="block text-sm mb-2">Change Email</label>
          <input
            type="email"
            placeholder="New email"
            className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Change Password</label>
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-2 rounded-lg bg-darkBg border border-line text-lightText placeholder-mutedText focus:outline-none focus:border-accent"
          />
        </div>

        <button className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accentDark transition">
          Save Changes
        </button>
      </div>
    </main>
  );
}
