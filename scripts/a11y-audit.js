#!/usr/bin/env node
/**
 * Accessibility Static Audit Script
 * Checks critical a11y patterns in source files.
 * 
 * NOTE: This is a heuristic-based static checker. For full compliance,
 * run axe DevTools in the browser and manual screen reader testing.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "app");
const COMPONENTS = path.join(ROOT, "components");

const ISSUES = [];

function getAllFiles(dir, extensions) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
    for (const item of items) {
      if (item.isFile() && extensions.some((ext) => item.name.endsWith(ext))) {
        files.push(path.join(item.parentPath || item.path, item.name));
      }
    }
  } catch (e) {
    // Directory may not exist
  }
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = path.relative(ROOT, filePath);

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check for invalid Tailwind z-80 class
    if (/\bz-80\b/.test(line) && !/z-\[80\]/.test(line)) {
      ISSUES.push({
        file: relPath,
        line: lineNum,
        rule: "invalid-tailwind",
        message: "z-80 is not a valid Tailwind class. Use z-[80] instead.",
        severity: "low",
      });
    }

    // Check for <a> without href that is not a button or link role
    if (/<a\s/.test(line) && !/href=/.test(line) && !/role=/.test(line)) {
      // Only flag if it's not already wrapped in something else
      ISSUES.push({
        file: relPath,
        line: lineNum,
        rule: "missing-href",
        message: '<a> without href. Consider <button type="button">.',
        severity: "high",
      });
    }
  });

  // Check CSS for reduced-motion (only flag if NO media query exists in the file)
  if (filePath.endsWith(".css") && /@keyframes/.test(content)) {
    if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(content)) {
      ISSUES.push({
        file: relPath,
        line: 1,
        rule: "reduced-motion",
        message: "File has @keyframes but no prefers-reduced-motion fallback.",
        severity: "medium",
      });
    }
  }
}

function run() {
  console.log("🔍 VoiceFi Accessibility Static Audit\n");
  console.log("This script checks for common a11y anti-patterns.\n");
  console.log("For full WCAG compliance, also run:");
  console.log("  • axe DevTools browser extension");
  console.log("  • Lighthouse Accessibility audit");
  console.log("  • Manual keyboard + screen reader testing\n");

  const files = [
    ...getAllFiles(SRC, [".tsx", ".ts", ".css"]),
    ...getAllFiles(COMPONENTS, [".tsx", ".ts", ".css"]),
  ];

  files.forEach(checkFile);

  const critical = ISSUES.filter((i) => i.severity === "critical");
  const high = ISSUES.filter((i) => i.severity === "high");
  const medium = ISSUES.filter((i) => i.severity === "medium");
  const low = ISSUES.filter((i) => i.severity === "low");

  console.log("Summary:");
  console.log(`  Critical: ${critical.length}`);
  console.log(`  High:     ${high.length}`);
  console.log(`  Medium:   ${medium.length}`);
  console.log(`  Low:      ${low.length}\n`);

  if (ISSUES.length === 0) {
    console.log("✅ No issues detected by static audit.");
    console.log("   Remember to run browser-based tests for full coverage.");
    process.exit(0);
  }

  [...critical, ...high, ...medium, ...low].forEach((issue) => {
    console.log(`[${issue.severity.toUpperCase()}] ${issue.file}:${issue.line}`);
    console.log(`  ${issue.message}\n`);
  });

  const hasBlocking = critical.length + high.length > 0;
  if (hasBlocking) {
    console.log("⚠️  Blocking issues found. Fix high/critical items before release.");
  } else {
    console.log("✅ No blocking issues. Medium/low items should be addressed when feasible.");
  }

  process.exit(hasBlocking ? 1 : 0);
}

run();
