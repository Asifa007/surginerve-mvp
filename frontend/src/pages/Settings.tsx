import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageWrapper from "@/components/PageWrapper";

const Settings = () => {
  const { role } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Dr. John Doe"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="doctor@hospital.com"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Profile
          </button>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Change Password</h3>
          <div className="max-w-sm space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Update Password
          </button>
        </div>

        {/* Admin Section */}
        {role === "admin" && (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-card p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-foreground">System Administration</h3>
            <p className="text-sm text-muted-foreground">
              User management, system configuration, and audit logs will be available here in a future update.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Settings;
