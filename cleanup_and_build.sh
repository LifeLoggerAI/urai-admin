echo "=== Step 0: Unset conflicting NPM variables ==="
unset NPM_CONFIG_PREFIX

echo "=== Step 1: Backup current branch with timestamp ==="
BACKUP_BRANCH="backup-main-$(date +%Y%m%d_%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "Backup branch created: $BACKUP_BRANCH"

echo "=== Step 2: Open Nix-shell with git, git-lfs, openssh, nodejs ==="
nix-shell -p git git-lfs openssh nodejs --run '

echo "--- Step 3: Initialize Git LFS hooks ---"
git lfs install

echo "--- Step 4: Track all large Next.js webpack pack files ---"
git lfs track "*.pack"
git add .gitattributes
git commit -m "ci: track large pack files with LFS" || echo "Already committed"

echo "--- Step 5: Clean local build caches and node_modules ---"
rm -rf apps/urai-admin/.next apps/urai-admin/out functions/node_modules node_modules

echo "--- Step 6: Filter Git history to remove .next/cache/webpack packs ---"
git filter-branch --force --index-filter \
"git rm -r --cached --ignore-unmatch apps/urai-admin/.next/cache/webpack/" \
--prune-empty --tag-name-filter cat -- --all

echo "--- Step 7: Garbage collect and repack ---"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "--- Step 8: Push cleaned history to remote (force) ---"
git remote set-url origin git@github.com:LifeLoggerAI/urai-admin.git
git push origin main --force

echo "--- Step 9: Verify LFS files ---"
git lfs ls-files || echo "Git LFS working inside Nix-shell"

echo "--- Step 10: Install NPM dependencies and build ---"
npm install --legacy-peer-deps
npm run build

echo "--- Step 11: Final commit for build / cleanup ---"
git add .
git commit -m "chore: build / cleanup" || echo "Nothing to commit"
git push origin main

'

echo "=== DONE: Repo cleaned, LFS initialized, build complete, main branch pushed ===