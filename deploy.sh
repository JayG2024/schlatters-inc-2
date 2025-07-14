#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "To deploy to Netlify:"
    echo "1. Go to https://app.netlify.com/teams/jason-gordon/projects"
    echo "2. Click 'Add new site' > 'Deploy manually'"
    echo "3. Drag the 'dist' folder to the deployment area"
    echo ""
    echo "Or use GitHub integration:"
    echo "1. Click 'Add new site' > 'Import an existing project'"
    echo "2. Choose GitHub and select 'schlatters-inc' repository"
    echo "3. Deploy settings are already configured in netlify.toml"
    echo ""
    echo "Build output is in: $(pwd)/dist"
else
    echo "Build failed!"
    exit 1
fi