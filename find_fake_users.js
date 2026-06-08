const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Function: Check if Gmail has 4 or more dots (Spam pattern)
function hasHeavyDotTrick(email) {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  const parts = emailLower.split('@');
  if (parts.length !== 2) return false;

  const localPart = parts[0];
  const domain = parts[1];

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Check if the local part contains 4 or more dots
    const dotCount = (localPart.match(/\./g) || []).length;
    return dotCount >= 4;
  }
  
  return false;
}

// Function: Check if created strictly on June 8, 2026
function isJune8th(creationTimeStr) {
  if (!creationTimeStr) return false;
  
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 5 = June (0-indexed)
  const date = creationDate.getDate();

  return year === 2026 && month === 5 && date === 8;
}

async function purgeJune8Fakes() {
  console.log(`\n🛑 WARNING: Scanning for heavy Gmail dot tricks (4+ dots) created on June 8 ONLY...`);
  
  try {
    const db = admin.database();
    let fakeUsersToProcess = [];
    let nextPageToken;

    // 1. Auth se list fetch kar ke filter karna
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        if (isJune8th(userRecord.metadata.creationTime) && hasHeavyDotTrick(userRecord.email)) {
            fakeUsersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (fakeUsersToProcess.length === 0) {
        console.log(`\n✅ Safe: Aaj ki date (June 8) mein aisa koi dot trick account nahi mila.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total targeted fake accounts found: ${fakeUsersToProcess.length}`);
    console.log(`Starting permanent deletion process...\n`);

    let processedFakes = 0;

    // 2. Clear from Auth and RTDB
    for (const fakeUser of fakeUsersToProcess) {
      try {
        // Auth se delete
        await admin.auth().deleteUser(fakeUser.uid);
        
        // Realtime Database se delete
        await db.ref(`users/${fakeUser.uid}`).remove();
        
        console.log(`► Deleted Fake: ${fakeUser.email}`);
        processedFakes++;
      } catch (err) {
        console.error(`❌ Error deleting fake user ${fakeUser.email}:`, err.message);
      }
    }

    console.log(`\n=========================================`);
    console.log(`🔥 Deletion Complete: ${processedFakes} heavy dot-trick accounts removed.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the entire process:', error);
    process.exit(1);
  }
}

purgeJune8Fakes();
