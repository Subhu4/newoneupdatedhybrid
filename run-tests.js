const { spawnSync } = require("child_process");

function runCommand(command, args) {
  try {
    const result = spawnSync(`${command} ${args.join(" ")}`, { stdio: "inherit", shell: true });

    if (result.error) {
      console.error(`Command failed: ${command} ${args.join(" ")} - ${String(result.error)}`);
      return 1;
    }

    return result.status ?? 1;
  } catch (error) {
    console.error(`Command failed: ${command} ${args.join(" ")} - ${String(error)}`);
    return 1;
  }
}

const testExitCode = runCommand("npx", ["playwright", "test"]);
const allureExitCode = runCommand("npx", [
  "allure",
  "generate",
  "reports/allure-results",
  "-o",
  "reports/allure-report",
  "--clean"
]);

process.exit(testExitCode !== 0 ? testExitCode : allureExitCode);
