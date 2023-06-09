VERSION_BUMP="patch"

NEW_VERSION="0.5.19"
echo "NEW_VERSION: $NEW_VERSION"
git remote -v
git status
git add .
git commit -m "$NEW_VERSION"
git status
git push origin feat/shlee/62
git status
npm run build
npm publish
git push --tags
gh release create $NEW_VERSION -t $NEW_VERSION -n "Release $NEW_VERSION"