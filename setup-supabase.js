#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Supabase Setup for Schlatter\'s Inc\n');

const questions = [
  {
    name: 'supabaseUrl',
    question: 'Enter your Supabase Project URL (https://xxx.supabase.co): ',
    envKey: 'VITE_SUPABASE_URL'
  },
  {
    name: 'supabaseAnonKey',
    question: 'Enter your Supabase Anon/Public Key: ',
    envKey: 'VITE_SUPABASE_ANON_KEY'
  }
];

const answers = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFile();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(q.question, (answer) => {
    answers[q.envKey] = answer.trim();
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFile() {
  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envPath = path.join(__dirname, '.env.local');
  
  fs.writeFileSync(envPath, envContent + '\n');
  
  console.log('\n✅ Created .env.local file');
  console.log('\n📋 Next steps:');
  console.log('1. Run the SQL migration in your Supabase dashboard');
  console.log('2. Copy the migration from: supabase/migrations/001_initial_schema.sql');
  console.log('3. Go to SQL Editor in Supabase and run it');
  console.log('4. Start the dev server: npm run dev');
  console.log('\n📚 Full setup guide: SUPABASE_SETUP.md');
  
  rl.close();
}

// Check if .env.local already exists
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  rl.question('.env.local already exists. Overwrite? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      askQuestion();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  askQuestion();
}