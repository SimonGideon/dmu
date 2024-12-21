echo "Switching to branch test"
git checkout test
git add .
echo "Committing changes to test"
git commit -m "Deploying to test"
echo "Pushing changes to test"
git push origin test

echo "Pulling latest changes from test"
git pull origin test
echo "Building app..."
npm run build
echo "Deploying app to server..."
scp -r dist/* xeai@41.90.122.129:/var/www/41.90.122.129/

echo "Deployment completed successfully"
