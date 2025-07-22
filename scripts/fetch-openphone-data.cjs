#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const apiKey = envVars.OPENPHONE_API_KEY;

async function fetchOpenPhoneData() {
  const headers = {
    'Authorization': apiKey,
    'Content-Type': 'application/json'
  };

  try {
    // Fetch recent calls
    console.log('📞 Fetching recent calls...');
    const callsResponse = await fetch('https://api.openphone.com/v1/calls?limit=10', { headers });
    const calls = await callsResponse.json();
    
    console.log(`\nFound ${calls.data?.length || 0} calls:`);
    if (calls.data?.length > 0) {
      calls.data.forEach((call, index) => {
        console.log(`\nCall ${index + 1}:`);
        console.log(`  ID: ${call.id}`);
        console.log(`  Direction: ${call.direction}`);
        console.log(`  Status: ${call.status}`);
        console.log(`  From: ${call.from}`);
        console.log(`  To: ${call.to}`);
        console.log(`  Duration: ${call.duration} seconds`);
        console.log(`  Created: ${new Date(call.createdAt).toLocaleString()}`);
        if (call.recording) {
          console.log(`  Recording: Available`);
        }
      });
    }

    // Fetch recent messages
    console.log('\n\n💬 Fetching recent messages...');
    const messagesResponse = await fetch('https://api.openphone.com/v1/messages?limit=10', { headers });
    const messages = await messagesResponse.json();
    
    console.log(`\nFound ${messages.data?.length || 0} messages:`);
    if (messages.data?.length > 0) {
      messages.data.forEach((message, index) => {
        console.log(`\nMessage ${index + 1}:`);
        console.log(`  ID: ${message.id}`);
        console.log(`  Direction: ${message.direction}`);
        console.log(`  From: ${message.from}`);
        console.log(`  To: ${message.to}`);
        console.log(`  Body: ${message.body?.substring(0, 50)}...`);
        console.log(`  Created: ${new Date(message.createdAt).toLocaleString()}`);
      });
    }

    // Save data for further processing
    const data = { calls: calls.data || [], messages: messages.data || [] };
    fs.writeFileSync(path.join(__dirname, 'openphone-data.json'), JSON.stringify(data, null, 2));
    console.log('\n\n✅ Data saved to scripts/openphone-data.json');

  } catch (error) {
    console.error('❌ Error fetching OpenPhone data:', error.message);
  }
}

fetchOpenPhoneData();