// Behavior test: spawns decoy processes with crafted argv, runs the real script, asserts who dies.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("../skills/ops/purge-stress/scripts/purge-stress", import.meta.url));

// `exec -a` sets argv[0], which ps shows as the start of the command line. Flags ride inside argv[0]
// because `sleep` rejects unknown arguments.
function fake(cmdline) {
  const child = spawn("bash", ["-c", `exec -a "$0" sleep 300`, cmdline], { stdio: "ignore", detached: true });
  return child.pid;
}
// A zombie has exited; execFileSync blocks Node from reaping it, so check ps state too.
const alive = (pid) => {
  try { process.kill(pid, 0); } catch { return false; }
  try { return !execFileSync("ps", ["-o", "stat=", "-p", String(pid)]).toString().includes("Z"); } catch { return false; }
};
const run = (...args) => execFileSync("bash", [SCRIPT, ...args]).toString();

test("kills agent-browser and headless chromium, spares a headed browser", { skip: process.platform === "win32" }, async () => {
  const leak = fake("/tmp/agent-browser-chrome-test/Chromium");
  const headless = fake("/opt/Chromium --headless=new");
  const headed = fake("/Applications/Google Chrome");
  await sleep(300);
  try {
    const dry = run("--dry-run");
    assert.match(dry, new RegExp(`^${leak}\\s.*agent-browser leak`, "m"));
    assert.match(dry, new RegExp(`^${headless}\\s.*headless chromium`, "m"));
    assert.doesNotMatch(dry, new RegExp(`^${headed}\\s`, "m"));
    assert.ok(alive(leak) && alive(headless), "dry run kills nothing");

    run();
    await sleep(300);
    assert.equal(alive(leak), false, "agent-browser leak killed");
    assert.equal(alive(headless), false, "headless chromium killed");
    assert.equal(alive(headed), true, "headed browser spared");
  } finally {
    for (const pid of [leak, headless, headed]) if (alive(pid)) process.kill(pid, "SIGKILL");
  }
});

test("rejects unknown flags with exit code 2", () => {
  assert.throws(() => run("--bogus"), (e) => e.status === 2);
});
