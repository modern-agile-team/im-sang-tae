VERSION_BUMP="patch"

NEW_VERSION=$(npm version $VERSION_BUMP) 

echo "------------"
echo $NEW_VERSION
echo "------------"

git add .

git commit -m "$NEW_VERSION"