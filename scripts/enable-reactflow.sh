#!/bin/bash

# Script to enable ReactFlow in the user flow diagram

# Print colored output
green() {
  echo -e "\033[0;32m$1\033[0m"
}

blue() {
  echo -e "\033[0;34m$1\033[0m"
}

yellow() {
  echo -e "\033[0;33m$1\033[0m"
}

# Start script
green "===== Enabling ReactFlow for User Flow Diagram ====="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  yellow "Error: npm is not installed. Please install Node.js and npm first."
  exit 1
fi

# Install ReactFlow dependency
blue "Installing ReactFlow dependency..."
npm install reactflow

# Make script executable from project root to ensure proper path resolution
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# Create an implementation backup
blue "Creating implementation backup..."
mkdir -p $PROJECT_ROOT/backup-reactflow
cp -r $PROJECT_ROOT/src/components/projects/userflow/nodes $PROJECT_ROOT/backup-reactflow/
cp $PROJECT_ROOT/src/components/projects/userflow/ReactFlowImplementation.tsx $PROJECT_ROOT/backup-reactflow/
cp $PROJECT_ROOT/src/components/projects/userflow/UserFlowDiagram.tsx $PROJECT_ROOT/backup-reactflow/

# Update the UserFlowDiagram to use ReactFlow by default
blue "Updating UserFlowDiagram component to use ReactFlow by default..."
sed -i.bak 's/const \[showImplementation, setShowImplementation\] = useState(false);/const \[showImplementation, setShowImplementation\] = useState(true);/' $PROJECT_ROOT/src/components/projects/userflow/UserFlowDiagram.tsx

# Cleanup backup file created by sed
rm $PROJECT_ROOT/src/components/projects/userflow/UserFlowDiagram.tsx.bak

green "ReactFlow has been enabled by default in the user flow diagram!"
green "You can always toggle back to the placeholder view using the Preview Mode switch."
yellow "Note: Make sure to test the implementation thoroughly before deploying to production."
blue "For any issues, check the backup files in backup-reactflow/ directory." 