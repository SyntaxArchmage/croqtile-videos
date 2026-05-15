#!/usr/bin/env bash
# .devcontainer/install-chrome.sh
# Install Google Chrome (stable) for Remotion headless rendering.
# Runs once at container creation via onCreateCommand.
set -euo pipefail

echo "→ Installing Google Chrome for Remotion renderer..."

# Add Google's apt repo
curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
  | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] \
  https://dl.google.com/linux/chrome/deb/ stable main" \
  > /etc/apt/sources.list.d/google-chrome.list

apt-get update -q
apt-get install -y --no-install-recommends google-chrome-stable

echo "→ Chrome installed: $(google-chrome --version)"

# Tell Remotion / Puppeteer where to find Chrome
echo 'PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> /home/node/.bashrc
echo 'PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> /etc/environment
