import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const podspecPath = path.join(
   "node_modules",
   "@capgo",
   "capacitor-social-login",
   "CapgoCapacitorSocialLogin.podspec"
);

// The plugin wraps its whole Apple provider in `#if canImport(Alamofire)`, so
// without this dependency the native login rejects with "Apple Sign-In provider
// is disabled". The plugin's own capacitor:sync:before hook can only rewrite a
// template line that the shipped podspec never contains, so it is added here and
// survives every reinstall.
const dependency = "s.dependency 'Alamofire', '~> 5.10.2'";

if (!existsSync(podspecPath)) {
   console.warn("[social-login-podspec] plugin not installed, skipping");
   process.exit(0);
}

const contents = readFileSync(podspecPath, "utf8");

if (contents.includes("s.dependency 'Alamofire'")) {
   process.exit(0);
}

const patched = contents.replace(
   /^([ \t]*)s\.dependency 'Capacitor'\n/m,
   (_match, indent) =>
      `${indent}s.dependency 'Capacitor'\n` +
      `${indent}# Added for Sign in with Apple\n` +
      `${indent}${dependency}\n`
);

if (patched === contents) {
   console.warn(
      "[social-login-podspec] could not find the Capacitor dependency line; add Alamofire to the podspec manually"
   );
   process.exit(0);
}

writeFileSync(podspecPath, patched, "utf8");
console.log(
   "[social-login-podspec] added Alamofire; run `pod install` in ios/App before building"
);