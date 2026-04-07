const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Aapke screenshot ke mutabiq database URL
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

const TARGET_DOMAIN = "@guerrillamailblock.com";

async function listFakeUsers() {
  console.log(`Starting to scan users for domain: ${TARGET_DOMAIN}`);
  
  let fakeUsersCount = 0;
  let nextPageToken;
  
  try {
    do {
      // 1000 users at a time fetch karta hai
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        if (userRecord.email && userRecord.email.endsWith(TARGET_DOMAIN)) {
          console.log(`Found -> UID: ${userRecord.uid} | Email: ${userRecord.email}`);
          fakeUsersCount++;
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);
    
    console.log(`\n=========================================`);
    console.log(`SCAN COMPLETE!`);
    console.log(`Total fake accounts found: ${fakeUsersCount}`);
    console.log(`=========================================\n`);
    
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

listFakeUsers();
