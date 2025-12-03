// Test script for store settings API
// Run this file with: node test-store-settings.js

const BASE_URL = 'http://localhost:3001';

// Mock user token for testing (you'll need to replace this with a real token)
const TEST_TOKEN = 'your-jwt-token-here';

async function testStoreSettings() {
  console.log('Testing Store Settings API...\n');

  try {
    // Test 1: Get current settings
    console.log('1. Getting current settings...');
    const getResponse = await fetch(`${BASE_URL}/api/settings`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ Current settings:', data);
    } else {
      console.log('⚠️ No existing settings found (expected for first run)');
    }

    // Test 2: Create/Update store settings
    console.log('\n2. Updating store settings...');
    const testStoreData = {
      store_name: 'My Awesome Store',
      store_description: 'Best products at great prices',
      store_url: 'my-awesome-store'
    };

    const updateResponse = await fetch(`${BASE_URL}/api/settings/store`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testStoreData),
    });

    if (updateResponse.ok) {
      const data = await updateResponse.json();
      console.log('✅ Store settings updated:', data);
    } else {
      const error = await updateResponse.json();
      console.log('❌ Error updating store settings:', error);
    }

    // Test 3: Verify store template was synced
    console.log('\n3. Checking store template sync...');
    const templateResponse = await fetch(`${BASE_URL}/api/store-templates`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (templateResponse.ok) {
      const data = await templateResponse.json();
      console.log('✅ Store template synced:', data);
    } else {
      console.log('❌ Could not fetch store template');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Note: This test requires a valid JWT token for authentication
console.log('⚠️ Note: Update TEST_TOKEN variable with a valid JWT token before running this test');
console.log('You can get a token by logging in through the frontend and checking localStorage');

// Uncomment the line below and add a real token to run the test
// testStoreSettings();