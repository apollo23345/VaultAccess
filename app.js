const screen = document.getElementById("screen");

const shieldSvg = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 2.2 19 5v5.3c0 4.7-2.8 8.9-7 11.5-4.2-2.6-7-6.8-7-11.5V5l7-2.8Z"/>
</svg>`;

const state = {
  screen: "login",
  scenario: "trusted",
  otp: "",
  selectedChallenge: "device",
  securityLevel: "LEVEL 1 · STANDARD",
  securityClass: "blue",
  trustedDevices: 2,
  cooldown: false,
  blockedSources: 0,
  sourceRestrictionActive: false,
  lastBlockedSource: "Unknown Chrome · Quezon City",
  accountGloballyLocked: false,
  staffRole: "Tier 2 — Help Desk",
  logs: [
    {time: "10:42 AM", user: "r.santos", action: "Viewed customer security context", resource: "Help Desk", status: "Allowed"},
    {time: "10:37 AM", user: "j.reyes", action: "Requested user-session reset", resource: "Tier 2", status: "Allowed"}
  ]
};

const pages = {
  login: renderLogin,
  level1: renderLevel1,
  unusual: renderUnusual,
  verify: renderVerify,
  level2passed: renderLevel2Passed,
  protected: renderProtected,
  challenge: renderChallenge,
  cooldown: renderCooldown,
  sourceblocked: renderSourceBlocked,
  locked: renderSourceBlocked,
  alternate: renderAlternate,
  manual: renderManual,
  dashboard: renderDashboard,
  sessions: renderSessions,
  checkup: renderCheckup,
  recovery: renderRecovery,
  highrisk: renderHighRisk,
  staff: renderStaff,
  tiers: renderTiers,
  monitor: renderStaffMonitor
};

function setScreen(name) {
  state.screen = name;
  updateNav(name);
  screen.innerHTML = pages[name] ? pages[name]() : renderLogin();
  screen.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  attachPageHandlers(name);
}

function updateNav(name) {
  document.querySelectorAll("[data-nav]").forEach(btn => btn.classList.remove("active"));
  const key = ["staff","tiers","monitor"].includes(name) ? "staff" :
              ["dashboard","sessions","checkup","recovery","highrisk"].includes(name) ? "dashboard" : "login";
  document.querySelector(`[data-nav="${key}"]`)?.classList.add("active");
}

function heroFeatures() {
  return `
    <div class="hero-features">
      <div class="hero-feature">
        <span class="hero-icon">✓</span>
        <div><strong>Adaptive rate-limiting</strong><span>Blocking behavior adapts to risk instead of using a flat retry counter.</span></div>
      </div>
      <div class="hero-feature">
        <span class="hero-icon">✓</span>
        <div><strong>Device-aware verification</strong><span>Known devices stay low-friction while unfamiliar devices step up.</span></div>
      </div>
      <div class="hero-feature">
        <span class="hero-icon">✓</span>
        <div><strong>Protected Mode</strong><span>Higher-risk attempts receive stronger identity checks.</span></div>
      </div>
      <div class="hero-feature">
        <span class="hero-icon">✓</span>
        <div><strong>Clear audit context</strong><span>Security states remain understandable to users and support staff.</span></div>
      </div>
    </div>`;
}

function renderLogin() {
  return `
    <section class="login-stage">
      <div class="login-hero">
        <div>
          <div class="eyebrow">Secure banking access</div>
          <h1>Security that adapts to login risk.</h1>
        </div>
        ${heroFeatures()}
      </div>

      <div class="auth-card">
        <div class="shield-icon">${shieldSvg}</div>
        <h2>Welcome back</h2>
        <p class="subtext">Sign in to continue to your account.</p>

        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email / Username</label>
            <input class="input" id="email" name="email" value="maria.santos@gmail.com" autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input class="input" id="password" type="password" name="password" value="vault123" autocomplete="current-password" />
          </div>
          <div class="form-row">
            <label class="checkbox"><input type="checkbox" id="remember" /> Remember this device</label>
            <button class="text-link" type="button" data-action="forgot">Forgot password?</button>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Sign in</button>
        </form>

        <div class="prototype-note">
          <strong>Prototype demo:</strong> use the floating <em>Demo controls</em> to choose Trusted Device, New Device, or High Risk before signing in.
        </div>
      </div>
    </section>`;
}

function renderLevel1() {
  return centerCard({
    orb: "✓", orbClass: "success",
    level: "Standard Access", levelClass: "success",
    title: "Level 1 · Standard",
    subtitle: "Known device + correct password",
    body: `
      <div class="info-panel green">
        <div class="info-grid">
          <span>Device Recognized</span><strong>Chrome on Windows Laptop</strong>
          <span>Location</span><strong>Manila, Philippines</strong>
          <span>Status</span><span class="pill green">TRUSTED</span>
        </div>
      </div>
      <div class="info-panel gray"><strong>Security Level</strong>No additional verification required.</div>
      <button class="btn btn-success btn-block" data-go="dashboard">Continue to Account</button>
    `,
    meter: ["done","",""]
  });
}

function renderUnusual() {
  return centerCard({
    orb: "!", orbClass: "warning",
    level: "Unusual Activity", levelClass: "warning",
    title: "Unusual Sign-In Detected",
    subtitle: "We noticed a sign-in that looks different from your usual activity.",
    body: `
      <div class="info-panel blue">
        <strong>Was this you?</strong>
        Confirm the activity so we can protect your account intelligently.
      </div>
      <div class="info-panel gray">
        <div class="info-grid">
          <span>Device</span><strong>Chrome on Windows</strong>
          <span>Location</span><strong>Quezon City, Philippines</strong>
          <span>Time</span><strong>Just now</strong>
        </div>
      </div>
      <div class="inline-actions">
        <button class="btn btn-primary" data-go="verify">Yes, it's me</button>
        <button class="btn btn-light" data-go="protected">No, secure my account</button>
      </div>
    `,
    meter: ["done","",""]
  });
}

function renderVerify() {
  return centerCard({
    orb: shieldSvg, orbClass: "blue",
    level: "Level 2 · Verification", levelClass: "blue",
    title: "Verify Your Identity",
    subtitle: "New device or repeated failure",
    body: `
      <div class="info-panel blue">
        <strong>One-time code sent to</strong>
        m••••@gmail.com &nbsp; · &nbsp; +63 9XX XXX 1234
      </div>
      <form id="otpForm">
        <label style="font-size:10px;font-weight:700;">Enter 6-digit code</label>
        <div class="otp-row">
          ${Array.from({length: 6}, (_, i) => `<input class="otp-input" maxlength="1" inputmode="numeric" aria-label="OTP digit ${i+1}" />`).join("")}
        </div>
        <p class="otp-help">Demo code: <strong>123456</strong></p>
        <button class="btn btn-primary btn-block" type="submit">Verify Code</button>
      </form>
      <p class="small-center"><button class="text-link" data-action="resend">Resend code</button></p>
    `,
    meter: ["done","done",""]
  });
}

function renderLevel2Passed() {
  return centerCard({
    orb: shieldSvg, orbClass: "blue",
    level: "Standard Access", levelClass: "blue",
    title: "Level 2 · Passed",
    subtitle: "Awaiting confirmation…",
    body: `
      <div class="info-panel blue">
        <div class="info-grid">
          <span>Device Recognized</span><strong>Chrome on Windows Laptop</strong>
          <span>Location</span><strong>Manila, Philippines</strong>
          <span>Status</span><span class="pill blue">VERIFIED</span>
        </div>
      </div>
      <div class="info-panel gray"><strong>Security Level</strong>Additional verification completed.</div>
      <button class="btn btn-primary btn-block" data-action="trust-device">Trust this device & continue</button>
    `,
    meter: ["done","done",""]
  });
}

function renderProtected() {
  return centerCard({
    orb: "!", orbClass: "warning",
    level: "Level 3 · Protected Mode", levelClass: "warning",
    title: "Protected Mode Enabled",
    subtitle: "Multiple failures / risky verification",
    body: `
      <div class="info-panel orange">
        <strong>We added verification to secure your account.</strong>
        Suspicious behavior was detected, so this sign-in source needs stronger identity confirmation.
      </div>
      <div class="step-list">
        <div class="step-row"><span class="step-num">1</span><div><strong>Rate-limit this source</strong><span>Repeated attempts from the current device/session are slowed or paused without locking the whole customer account.</span></div><span>✓</span></div>
        <div class="step-row"><span class="step-num">2</span><div><strong>Require final identity challenge</strong><span>Verify the person before this suspicious source can continue.</span></div><span>→</span></div>
        <div class="step-row"><span class="step-num">3</span><div><strong>Record security event</strong><span>Keep device/session context for the customer and authorized support staff.</span></div><span>✓</span></div>
      </div>
      <button class="btn btn-warning btn-block" data-go="challenge">Continue to Final Challenge</button>
    `,
    meter: ["done","warn","warn"]
  });
}

function renderChallenge() {
  return centerCard({
    orb: shieldSvg, orbClass: "purple",
    level: "Last Check Before Source Block", levelClass: "purple",
    title: "Final Identity Challenge",
    subtitle: "Phone or email verification",
    body: `
      <div class="info-panel purple">
        <strong>Choose a verification channel</strong>
        If verification fails, this suspicious device/session will be blocked. The customer's other trusted access stays available.
      </div>
      <div class="option-list" id="challengeOptions">
        <button class="option selected" data-select="sms">
          <span class="option-icon">S</span><div><strong>SMS Verification</strong><span>+63 9XX XXX 1234</span></div><span class="chev">›</span>
        </button>
        <button class="option" data-select="email">
          <span class="option-icon">@</span><div><strong>Email Verification</strong><span>m••••@gmail.com</span></div><span class="chev">›</span>
        </button>
      </div>
      <button class="btn btn-cyan btn-block" data-action="challenge-pass">Continue</button>
      <p class="small-center">Can't use SMS or email? <button class="text-link" data-go="alternate">Can't access these?</button></p>
      <p class="small-center"><button class="text-link" data-action="challenge-fail">Demo attacker failing identity challenge</button></p>
    `,
    meter: ["done","warn","warn"]
  });
}

function renderCooldown() {
  return centerCard({
    orb: "✓", orbClass: "success",
    level: "No-Lockout Cooldown", levelClass: "success",
    title: "Challenge Passed",
    subtitle: "Account remains open",
    body: `
      <div class="info-panel green" style="text-align:center;">
        <strong>No Account Lockout</strong>
        <div style="font-size:28px;font-weight:800;margin:8px 0 4px;" id="cooldownTimer">00:30</div>
        Cooldown remaining
      </div>
      <div class="info-panel gray"><strong>Why cooldown?</strong>Prevents rapid retry abuse while avoiding a full lockout for a verified customer.</div>
      <button class="btn btn-success btn-block" data-go="dashboard">Continue to Account</button>
    `,
    meter: ["done","done","done"]
  });
}

function renderSourceBlocked() {
  return centerCard({
    orb: "⛔", orbClass: "danger",
    level: "Suspicious Source Blocked", levelClass: "danger",
    title: "This Sign-In Was Blocked",
    subtitle: "The suspicious device/session is isolated — not the whole customer account.",
    body: `
      <div class="info-panel red">
        <strong>Source restriction applied</strong>
        ${state.lastBlockedSource} can no longer keep retrying. The customer's trusted devices and existing valid sessions are not globally locked.
      </div>
      <div class="info-panel green">
        <strong>DoS loophole closed</strong>
        An attacker who knows the customer's email cannot lock the victim out just by intentionally failing passwords or the final identity challenge.
      </div>
      <div class="inline-actions">
        <button class="btn btn-success" data-action="trusted-owner">Continue from Trusted Device</button>
        <button class="btn btn-light" data-go="alternate">Verify This Source</button>
      </div>
      <p class="small-center">A full account lock is reserved for a confirmed compromise or an authorized security/support action.</p>
    `,
    meter: ["done","done","danger"]
  });
}

function renderAlternate() {
  return centerCard({
    orb: shieldSvg, orbClass: "purple",
    level: "Alternate Verification", levelClass: "purple",
    title: "Alternate Verification",
    subtitle: "Independent verification for a restricted sign-in source",
    body: `
      <div class="option-list">
        <button class="option selected" data-alt="device">
          <span class="option-icon">✓</span><div><strong>Registered Device Approval</strong><span>Approve from a previously trusted device.</span></div><span class="chev">›</span>
        </button>
        <button class="option" data-alt="staff">
          <span class="option-icon">✓</span><div><strong>Bank Staff Verification</strong><span>Complete identity confirmation with authorized personnel.</span></div><span class="chev">›</span>
        </button>
      </div>
      <div class="inline-actions">
        <button class="btn btn-primary" data-action="alternate-pass">Approve Demo</button>
        <button class="btn btn-light" data-go="manual">Can't verify</button>
      </div>
      <p class="small-center">This suspicious source remains blocked until identity is verified. Other trusted access can remain available.</p>
    `,
    meter: ["done","done","danger"]
  });
}

function renderManual() {
  return centerCard({
    orb: "🔒", orbClass: "danger",
    level: "Manual Verification Required", levelClass: "danger",
    title: "Manual Recovery Needed",
    subtitle: "The suspicious sign-in source remains restricted.",
    body: `
      <div class="info-panel red">
        <strong>The suspicious source stays blocked.</strong>
        Automated verification was unsuccessful, so this device/session cannot continue until an authorized recovery process verifies the customer.
      </div>
      <div class="info-panel green">
        <strong>The customer account is not automatically locked.</strong>
        A trusted device or valid existing session can remain available unless there is separate evidence of account compromise.
      </div>
      <div class="option-list">
        <button class="option" data-action="support"><span class="option-icon">1</span><div><strong>Contact Bank Support</strong><span>Open a secure help-desk case.</span></div><span class="chev">›</span></button>
        <button class="option" data-action="docs"><span class="option-icon">2</span><div><strong>Submit Identity Documents</strong><span>Manual identity review.</span></div><span class="chev">›</span></button>
        <button class="option" data-action="manual"><span class="option-icon">3</span><div><strong>Request Manual Recovery</strong><span>Escalate to authorized recovery staff.</span></div><span class="chev">›</span></button>
      </div>
      <button class="btn btn-danger btn-block" data-go="login">Return to Sign In</button>
    `,
    meter: ["done","done","danger"]
  });
}

function centerCard({orb, orbClass, level, levelClass, title, subtitle, body, meter = []}) {
  return `
    <section class="center-wrap">
      <div class="center-card">
        <div class="status-orb ${orbClass}">${orb}</div>
        <div class="level-label ${levelClass}">${level}</div>
        <h2>${title}</h2>
        <p class="subtext">${subtitle}</p>
        ${body}
        ${meter.length ? `<div class="flow-meter">${meter.map(x => `<span class="${x}"></span>`).join("")}</div>` : ""}
      </div>
    </section>`;
}

function customerSide(active = "Overview") {
  const items = ["Overview","Activity","Active Sessions","Trusted Devices","Security Settings","Account Recovery","High Risk Action","Help & Support"];
  return `
    <aside class="side">
      <div class="side-brand"><span class="mini-mark">V</span><strong>VAULTACCESS</strong></div>
      <nav class="side-nav">
        ${items.map(item => `<button class="side-link ${item===active?"active":""}" data-side="${item}">${item}</button>`).join("")}
      </nav>
      <button class="side-link logout" data-go="login">Logout</button>
    </aside>`;
}

function renderDashboard() {
  const securityValue = state.sourceRestrictionActive
    ? "LEVEL 3 · SOURCE BLOCK"
    : (state.cooldown ? "LEVEL 3 · COOLDOWN" : state.securityLevel);
  const securityColor = (state.sourceRestrictionActive || state.cooldown) ? "orange" : state.securityClass;
  return `
    <section class="dashboard-shell">
      ${customerSide("Overview")}
      <div class="dash-main">
        <div class="dash-head">
          <div><div class="eyebrow">Customer Dashboard</div><h1>Account Security Overview</h1></div>
          <div class="user-mini"><strong>Maria Santos</strong><span>Customer</span></div>
        </div>

        <div class="stat-grid">
          <div class="stat-card"><div class="stat-label">Account Status</div><div class="stat-value green">PROTECTED</div><div class="stat-sub">Your account is secure.</div></div>
          <div class="stat-card"><div class="stat-label">Security Level</div><div class="stat-value ${securityColor}">${securityValue}</div><div class="stat-sub">${state.sourceRestrictionActive ? "Suspicious source isolated; trusted access remains available." : (state.cooldown ? "Trusted device access enabled." : "Current login state.")}</div></div>
          <div class="stat-card"><div class="stat-label">Trusted Devices</div><div class="stat-value">${state.trustedDevices}</div><div class="stat-sub">Windows Laptop · iPhone 13</div></div>
        </div>

        ${state.sourceRestrictionActive ? `
        <div class="info-panel green">
          <strong>${state.blockedSources} suspicious sign-in source${state.blockedSources === 1 ? "" : "s"} blocked</strong>
          Your account was not globally locked. Trusted access remains available while the suspicious source is isolated.
        </div>` : ""}

        <div class="dash-grid">
          <div class="dash-card">
            <h3>Recent Activity</h3>
            <div class="activity-list">
              <div class="activity-item"><span class="activity-dot"></span><div><strong>Successful Login</strong><span>Chrome on Windows · Manila</span></div></div>
              <div class="activity-item"><span class="activity-dot blue"></span><div><strong>Verification Required</strong><span>Unfamiliar device · Manila</span></div></div>
              ${state.blockedSources > 0
                ? `<div class="activity-item"><span class="activity-dot red"></span><div><strong>Suspicious Sign-In Source Blocked</strong><span>${state.lastBlockedSource} · account remained available</span></div></div>`
                : `<div class="activity-item"><span class="activity-dot red"></span><div><strong>Failed Login Attempt</strong><span>Unknown device · Quezon City</span></div></div>`}
            </div>
          </div>
          <div class="dash-card">
            <h3>Trusted Devices</h3>
            <div class="device-list">
              <div class="device-item"><strong>Windows Laptop</strong><span class="pill green">Trusted</span></div>
              <div class="device-item"><strong>iPhone 13</strong><span class="pill green">Trusted</span></div>
              <div class="device-item"><strong>Android Phone</strong><span class="pill gray">Pending</span></div>
            </div>
          </div>
        </div>

        <div class="recommend"><strong>Security Recommendations</strong>Review unfamiliar login attempts and keep recovery channels up to date.</div>
      </div>
    </section>`;
}

function renderSessions() {
  return `
    <section class="dashboard-shell">
      ${customerSide("Active Sessions")}
      <div class="dash-main">
        <div class="dash-head"><div><div class="eyebrow">Customer Security</div><h1>Active Sessions</h1></div><div class="pill blue">3 sessions</div></div>
        <div class="page-card">
          <p class="subtext" style="text-align:left;margin:0;">Review devices currently signed in to your VAULTACCESS account.</p>
          <div class="sessions">
            <div class="session current"><span class="session-icon">W</span><div><strong>Windows Laptop</strong><span>Chrome 141 · Manila City, Philippines · Current session</span></div><span class="pill green">CURRENT</span></div>
            <div class="session"><span class="session-icon">P</span><div><strong>iPhone 15</strong><span>Safari · Quezon City, Philippines · Active 2 hours ago</span></div><button class="btn btn-outline" data-action="signout-one">Sign Out</button></div>
            <div class="session risk"><span class="session-icon">?</span><div><strong>Unknown Browser</strong><span>Unknown location · Today 04:18 AM</span></div><button class="btn btn-danger" data-action="signout-one">Sign Out</button></div>
          </div>
          <button class="btn btn-danger btn-block" style="margin-top:14px;" data-action="signout-all">Sign Out All Other Sessions</button>
        </div>
      </div>
    </section>`;
}

function renderCheckup() {
  return `
    <section class="dashboard-shell">
      ${customerSide("Security Settings")}
      <div class="dash-main">
        <div class="dash-head"><div><div class="eyebrow">Customer Security</div><h1>Security Checkup</h1></div></div>
        <div class="page-card">
          <div class="info-panel blue" style="display:flex;justify-content:space-between;align-items:center;">
            <div><strong>Security status</strong><span style="font-size:13px;font-weight:800;">Strong protection</span></div>
            <span class="pill blue">4 of 5 set</span>
          </div>
          <div class="check-list">
            <div class="check-row"><span class="check-icon good">✓</span><div><strong>Password Secure</strong><span>Strong password and not recently compromised.</span></div><button class="btn btn-outline">Review</button></div>
            <div class="check-row"><span class="check-icon good">✓</span><div><strong>MFA Enabled</strong><span>Authenticator + recovery channels configured.</span></div><button class="btn btn-outline">Manage</button></div>
            <div class="check-row"><span class="check-icon warn">!</span><div><strong>Trusted Devices</strong><span>3 devices are trusted; review unfamiliar devices.</span></div><button class="btn btn-outline" data-go="sessions">Review</button></div>
            <div class="check-row"><span class="check-icon warn">!</span><div><strong>Recovery Codes</strong><span>Set up a recovery code for emergency access.</span></div><button class="btn btn-outline">Set Up</button></div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:14px;">Finish Security Checkup</button>
        </div>
      </div>
    </section>`;
}

function renderRecovery() {
  return `
    <section class="dashboard-shell">
      ${customerSide("Account Recovery")}
      <div class="dash-main">
        <div class="dash-head"><div><div class="eyebrow">Recovery</div><h1>Account Recovery</h1></div></div>
        <div class="page-card">
          <div class="info-panel purple"><strong>Recovery email</strong>recovery.mail+new@gmail.com</div>
          <div class="option-list">
            <button class="option" data-go="challenge"><span class="option-icon">1</span><div><strong>Use Passkey</strong><span>Faster and phishing-resistant.</span></div><span class="chev">›</span></button>
            <button class="option" data-go="verify"><span class="option-icon">2</span><div><strong>Authenticator Code</strong><span>Use your 6-digit app code.</span></div><span class="chev">›</span></button>
            <button class="option" data-go="alternate"><span class="option-icon">3</span><div><strong>Account Password</strong><span>Use with another verification factor.</span></div><span class="chev">›</span></button>
          </div>
        </div>
      </div>
    </section>`;
}

function renderHighRisk() {
  return `
    <section class="dashboard-shell">
      ${customerSide("High Risk Action")}
      <div class="dash-main">
        <div class="dash-head"><div><div class="eyebrow">High-Risk Action</div><h1>Confirm It's Really You</h1></div></div>
        <div class="page-card" style="max-width:560px;">
          <div class="info-panel purple"><strong>Re-authentication required</strong>You're attempting to change your recovery email.</div>
          <div class="option-list">
            <button class="option" data-go="verify"><span class="option-icon">1</span><div><strong>Authenticator Code</strong><span>Use your verification app.</span></div><span class="chev">›</span></button>
            <button class="option" data-go="alternate"><span class="option-icon">2</span><div><strong>Use Passkey</strong><span>Verify with a trusted device.</span></div><span class="chev">›</span></button>
          </div>
        </div>
      </div>
    </section>`;
}

function staffSide(active = "Customers") {
  const items = ["Dashboard","Customers","Security Alerts","Reports","Audit Logs","AD Privilege Tiers","Escalation Monitor","Settings"];
  return `
    <aside class="side">
      <div class="side-brand"><span class="mini-mark">V</span><strong>VAULTACCESS</strong></div>
      <nav class="side-nav">
        ${items.map(item => `<button class="side-link ${item===active?"active":""}" data-staff-side="${item}">${item}</button>`).join("")}
      </nav>
      <button class="side-link logout" data-go="login">Logout</button>
    </aside>`;
}

function renderStaff() {
  return `
    <section class="staff-shell">
      <div class="staff-layout">
        ${staffSide("Customers")}
        <div class="staff-content">
          <div class="dash-head"><div><div class="eyebrow">Bank Staff / Help Desk</div><h1>Customer Security Center</h1></div><div class="pill blue">${state.staffRole}</div></div>
          <div class="form-group"><input class="input" placeholder="Search customer by name, email, or account number..." /></div>

          <div class="staff-grid">
            <div class="customer-card">
              <div class="customer-line">
                <span class="avatar">MS</span>
                <div><strong>Maria Santos</strong><span>Customer ID: CUST-004-0023 · maria.santos@gmail.com</span></div>
                <div><span class="pill blue">VERIFICATION</span><span class="pill orange" style="margin-left:5px;">HIGH RISK</span></div>
              </div>
              <div class="badge-stack">
                <span class="pill blue">New Device Detected</span>
                <span class="pill orange">Failed Login x4</span>
                <span class="pill red">Multiple Failed Attempts</span>
              </div>
            </div>
            <div class="customer-card">
              <h3 style="margin:0 0 12px;font-size:11px;">Actions</h3>
              <div class="action-stack">
                <button class="btn btn-success" data-action="approve-recovery">Approve Recovery</button>
                <button class="btn btn-primary" data-action="verify-identity">Verify Identity</button>
                <button class="btn btn-light" data-go="monitor">View Login History</button>
                <button class="btn btn-danger" data-action="admin-lock-account">Full Account Lock (Admin Only)</button>
              </div>
            </div>
          </div>

          <div class="customer-card security-events">
            <h3 style="margin:0 0 8px;font-size:11px;">Recent Security Events</h3>
            ${state.blockedSources > 0
              ? `<div class="event-row"><span class="activity-dot red"></span><div><strong>Suspicious Source Blocked</strong><span>${state.lastBlockedSource} · customer account not globally locked</span></div><span class="event-time">Just now</span></div>`
              : `<div class="event-row"><span class="activity-dot red"></span><div><strong>Failed Step-Up Code</strong><span>New device · Quezon City</span></div><span class="event-time">Today · 3:20 PM</span></div>`}
            <div class="event-row"><span class="activity-dot blue"></span><div><strong>Login Attempt (New Device)</strong><span>Chrome on Windows</span></div><span class="event-time">Today · 3:19 PM</span></div>
            <div class="event-row"><span class="activity-dot red"></span><div><strong>Failed Password Attempt</strong><span>Rate-limited at device/IP layer</span></div><span class="event-time">Today · 3:18 PM</span></div>
          </div>
        </div>
      </div>
    </section>`;
}

function renderTiers() {
  return `
    <section class="staff-shell">
      <div class="staff-layout">
        ${staffSide("AD Privilege Tiers")}
        <div class="staff-content">
          <div class="dash-head"><div><div class="eyebrow">Least Privilege</div><h1>AD Privilege Tiers</h1></div><div class="pill blue">${state.staffRole}</div></div>
          <div class="info-panel blue"><strong>Signed-in staff permissions</strong>Actions inside the assigned tier are available. Out-of-tier actions are blocked and sent to Escalation Monitor.</div>

          <div class="tier-grid">
            <div class="tier-card">
              <div class="tier-top"><h3>Tier 1</h3><span class="pill green">Allowed</span></div>
              <p>Basic customer support and low-risk account context.</p>
              <div class="permission-list"><span>View customer profile</span><span>View sign-in status</span><span>Open support case</span></div>
              <button class="btn btn-light btn-block" data-action="tier-allowed">Open Tier 1</button>
            </div>
            <div class="tier-card current">
              <div class="tier-top"><h3>Tier 2</h3><span class="pill blue">Current</span></div>
              <p>Help-desk verification and approved recovery tasks.</p>
              <div class="permission-list"><span>Verify identity</span><span>Approve recovery</span><span>View security events</span></div>
              <button class="btn btn-primary btn-block" data-action="tier-allowed">Open Tier 2</button>
            </div>
            <div class="tier-card">
              <div class="tier-top"><h3>Tier 3</h3><span class="pill red">Locked</span></div>
              <p>Security administration and sensitive access controls.</p>
              <div class="permission-list locked"><span>Modify access policy</span><span>Suspend staff access</span><span>Review escalations</span></div>
              <button class="btn btn-danger btn-block" data-action="tier-blocked" data-tier="Tier 3">Attempt Tier 3</button>
            </div>
            <div class="tier-card">
              <div class="tier-top"><h3>Tier 4</h3><span class="pill red">Locked</span></div>
              <p>Highest-privilege directory and platform administration.</p>
              <div class="permission-list locked"><span>Directory-wide changes</span><span>Privileged role assignment</span><span>Critical policy override</span></div>
              <button class="btn btn-danger btn-block" data-action="tier-blocked" data-tier="Tier 4">Attempt Tier 4</button>
            </div>
          </div>

          ${monitorBlock()}
        </div>
      </div>
    </section>`;
}

function monitorBlock() {
  return `
    <div class="monitor">
      <div class="monitor-head"><h3>Escalation Monitor</h3><span class="pill ${state.logs.some(l=>l.status==="Blocked")?"red":"green"}">${state.logs.some(l=>l.status==="Blocked")?"ATTENTION":"NORMAL"}</span></div>
      <div style="overflow:auto;">
        <table class="log-table">
          <thead><tr><th>Time</th><th>Staff</th><th>Action</th><th>Resource</th><th>Status</th></tr></thead>
          <tbody>
            ${state.logs.slice().reverse().map(l => `<tr><td>${l.time}</td><td>${l.user}</td><td>${l.action}</td><td>${l.resource}</td><td><span class="pill ${l.status==="Blocked"?"red":"green"}">${l.status}</span></td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderStaffMonitor() {
  return `
    <section class="staff-shell">
      <div class="staff-layout">
        ${staffSide("Escalation Monitor")}
        <div class="staff-content">
          <div class="dash-head"><div><div class="eyebrow">Security Operations</div><h1>Escalation Monitor</h1></div><div class="pill orange">Live Demo</div></div>
          <div class="info-panel orange"><strong>Purpose</strong>Every out-of-tier request creates an audit event. The system blocks the request first, then sends context for authorized review.</div>
          ${monitorBlock()}
        </div>
      </div>
    </section>`;
}

function attachPageHandlers(name) {
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => setScreen(el.dataset.go)));

  if (name === "login") {
    document.getElementById("loginForm")?.addEventListener("submit", e => {
      e.preventDefault();
      if (state.scenario === "trusted") setScreen("level1");
      else if (state.scenario === "new") setScreen("unusual");
      else setScreen("verify");
    });
    document.querySelector('[data-action="forgot"]')?.addEventListener("click", () => setScreen("recovery"));
  }

  if (name === "verify") {
    const inputs = [...document.querySelectorAll(".otp-input")];
    inputs.forEach((input, idx) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0,1);
        if (input.value && idx < inputs.length - 1) inputs[idx + 1].focus();
      });
      input.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !input.value && idx > 0) inputs[idx - 1].focus();
      });
    });
    document.getElementById("otpForm")?.addEventListener("submit", e => {
      e.preventDefault();
      const code = inputs.map(i => i.value).join("");
      if (code === "123456") {
        if (state.scenario === "risk") setScreen("protected");
        else setScreen("level2passed");
      } else {
        toast("Verification code not accepted", "For the demo, enter 123456.");
      }
    });
    document.querySelector('[data-action="resend"]')?.addEventListener("click", () => toast("Code resent", "A new one-time code was sent to the registered channels."));
  }

  if (name === "level2passed") {
    document.querySelector('[data-action="trust-device"]')?.addEventListener("click", () => {
      state.trustedDevices = 3;
      state.securityLevel = "LEVEL 2 · STANDARD";
      state.securityClass = "blue";
      state.cooldown = false;
      toast("Device trusted", "Future sign-ins from this device can use the low-friction Level 1 path.");
      setScreen("dashboard");
    });
  }

  if (name === "challenge") {
    document.querySelectorAll("[data-select]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-select]").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      state.selectedChallenge = btn.dataset.select;
    }));
    document.querySelector('[data-action="challenge-pass"]')?.addEventListener("click", () => {
      state.securityLevel = "LEVEL 3 · COOLDOWN";
      state.securityClass = "orange";
      state.cooldown = true;
      setScreen("cooldown");
    });
    document.querySelector('[data-action="challenge-fail"]')?.addEventListener("click", () => {
      state.blockedSources += 1;
      state.sourceRestrictionActive = true;
      state.cooldown = false;
      state.securityLevel = "LEVEL 3 · SOURCE BLOCK";
      state.securityClass = "orange";
      toast("Suspicious source blocked", "This device/session was isolated. The customer account remains available on trusted access.");
      setScreen("sourceblocked");
    });
  }

  if (name === "sourceblocked" || name === "locked") {
    document.querySelector('[data-action="trusted-owner"]')?.addEventListener("click", () => {
      state.securityLevel = "LEVEL 3 · SOURCE BLOCK";
      state.securityClass = "orange";
      state.cooldown = false;
      toast("Trusted access still works", "The attacker source stays blocked while the legitimate customer continues from a trusted device.");
      setScreen("dashboard");
    });
  }

  if (name === "cooldown") startCooldown();

  if (name === "alternate") {
    document.querySelectorAll("[data-alt]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-alt]").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
    }));
    document.querySelector('[data-action="alternate-pass"]')?.addEventListener("click", () => {
      state.cooldown = true;
      state.sourceRestrictionActive = false;
      state.securityLevel = "LEVEL 3 · COOLDOWN";
      state.securityClass = "orange";
      toast("Identity verified", "This sign-in source passed independent verification and can continue under cooldown.");
      setScreen("dashboard");
    });
  }

  document.querySelectorAll("[data-side]").forEach(btn => btn.addEventListener("click", () => {
    const map = {
      "Overview":"dashboard",
      "Activity":"dashboard",
      "Active Sessions":"sessions",
      "Trusted Devices":"sessions",
      "Security Settings":"checkup",
      "Account Recovery":"recovery",
      "High Risk Action":"highrisk",
      "Help & Support":"manual"
    };
    setScreen(map[btn.dataset.side] || "dashboard");
  }));

  document.querySelectorAll("[data-staff-side]").forEach(btn => btn.addEventListener("click", () => {
    const map = {
      "Dashboard":"staff",
      "Customers":"staff",
      "Security Alerts":"monitor",
      "Reports":"monitor",
      "Audit Logs":"monitor",
      "AD Privilege Tiers":"tiers",
      "Escalation Monitor":"monitor",
      "Settings":"staff"
    };
    setScreen(map[btn.dataset.staffSide] || "staff");
  }));

  bindGenericActions();
}

function bindGenericActions() {
  const actions = {
    "signout-one": () => toast("Session ended", "The selected session was revoked."),
    "signout-all": () => toast("Other sessions ended", "All non-current sessions were revoked."),
    "approve-recovery": () => toast("Recovery approved", "The customer can continue through the verified recovery path."),
    "verify-identity": () => toast("Identity check started", "A staff-assisted verification case has been opened."),
    "admin-lock-account": () => {
      state.accountGloballyLocked = true;
      toast("Administrative full-account lock applied", "Unlike source blocking, this simulated action locks the whole account and should require authorized review or confirmed compromise.");
    },
    "support": () => toast("Support case created", "A secure bank-support case was started."),
    "docs": () => toast("Document review started", "The prototype would route the customer to secure document submission."),
    "manual": () => toast("Manual recovery requested", "The case was queued for an authorized recovery reviewer."),
    "tier-allowed": () => toast("Access granted", "This action is inside the signed-in staff member's assigned tier.")
  };
  Object.entries(actions).forEach(([action, fn]) => {
    document.querySelectorAll(`[data-action="${action}"]`).forEach(btn => btn.addEventListener("click", fn));
  });

  document.querySelectorAll('[data-action="tier-blocked"]').forEach(btn => btn.addEventListener("click", () => {
    const tier = btn.dataset.tier;
    const now = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    state.logs.push({time: now, user: "r.santos", action: "Out-of-tier resource request", resource: tier, status: "Blocked"});
    toast("Privilege escalation blocked", `${tier} is outside ${state.staffRole}. The attempt was written to Escalation Monitor.`);
    setScreen("tiers");
  }));
}

function startCooldown() {
  let remaining = 30;
  const el = document.getElementById("cooldownTimer");
  const tick = () => {
    if (!el || state.screen !== "cooldown") return;
    const secs = String(remaining).padStart(2,"0");
    el.textContent = `00:${secs}`;
    if (remaining > 0) {
      remaining--;
      setTimeout(tick, 1000);
    } else {
      el.textContent = "READY";
    }
  };
  tick();
}

function toast(title, message) {
  const region = document.getElementById("toastRegion");
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `<strong>${title}</strong>${message}`;
  region.appendChild(node);
  setTimeout(() => node.remove(), 3600);
}

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-go]");
  if (btn && !btn.closest("#screen")) setScreen(btn.dataset.go);
});

const demoToggle = document.getElementById("demoToggle");
const demoPanel = document.getElementById("demoPanel");
function toggleDemo(force) {
  const open = typeof force === "boolean" ? force : demoPanel.hidden;
  demoPanel.hidden = !open;
  demoToggle.setAttribute("aria-expanded", String(open));
}
demoToggle.addEventListener("click", () => toggleDemo());
document.getElementById("closeDemo").addEventListener("click", () => toggleDemo(false));

document.querySelectorAll("[data-scenario]").forEach(btn => btn.addEventListener("click", () => {
  const s = btn.dataset.scenario;
  if (s === "staff") {
    state.scenario = "trusted";
    toggleDemo(false);
    setScreen("staff");
    toast("Staff demo loaded", "Use AD Privilege Tiers to demonstrate least-privilege enforcement.");
    return;
  }
  state.scenario = s;
  state.cooldown = false;
  state.sourceRestrictionActive = false;
  state.accountGloballyLocked = false;
  state.securityLevel = "LEVEL 1 · STANDARD";
  state.securityClass = "blue";
  toggleDemo(false);
  setScreen("login");
  const labels = {trusted:"Trusted device", new:"New device / unusual sign-in", risk:"High-risk repeated failures"};
  toast("Scenario selected", labels[s]);
}));

document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "d" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) toggleDemo();
});

setScreen("login");
