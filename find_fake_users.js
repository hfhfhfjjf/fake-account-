const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Function: Check if email matches the specific spam patterns requested
function isTargetEmail(email) {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  const parts = emailLower.split('@');
  if (parts.length !== 2) return false;

  const localPart = parts[0];
  const domain = parts[1];

  // 1. Check for specific throwaway domains
  if (domain === 'fexbox.org' || domain === 'tmpmailtor.com') {
    return true;
  }

  // 2. Check for Googlemail / Gmail Dot & Plus tricks
  if (domain === 'googlemail.com' || domain === 'gmail.com') {
    const hasPlus = localPart.includes('+');
    const dotCount = (localPart.match(/\./g) || []).length;
    const tooManyDots = dotCount >= 2;

    return hasPlus || tooManyDots;
  }
  
  return false;
}

// Function: Check if created strictly on June 6 or June 7, 2026
function isJune6or7(creationTimeStr) {
  if (!creationTimeStr) return false;
  
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 5 = June (0-indexed)
  const date = creationDate.getDate();

  return year === 2026 && month === 5 && (date === 6 || date === 7);
}

async function purgeTargetedFakesOnly() {
  console.log(`\n🛑 WARNING: Scanning for fexbox.org, tmpmailtor.com & googlemail/gmail dot tricks (Created on June 6 & 7 ONLY)...`);
  
  try {
    const db = admin.database();
    let fakeUsersToProcess = [];
    let nextPageToken;

    // 1. Find the specific fake accounts
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        // Date check AND Email pattern check
        if (isJune6or7(userRecord.metadata.creationTime) && isTargetEmail(userRecord.email)) {
            fakeUsersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (fakeUsersToProcess.length === 0) {
        console.log(`\n✅ Safe: In dates (June 6-7) mein in domains wale koi accounts nahi mile.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total targeted fake accounts found: ${fakeUsersToProcess.length}`);
    console.log(`Starting process to Delete Fakes ONLY (Referrers will NOT be disabled)...\n`);

    let processedFakes = 0;

    // 2. Process Fake Accounts (Delete from Auth & RTDB)
    for (const fakeUser of fakeUsersToProcess) {
      try {
        // Fake account ko Auth se Hamesha ke liye Delete karna
        await admin.auth().deleteUser(fakeUser.uid);
        
        // Fake account ko RTDB se Delete karna
        await db.ref(`users/${fakeUser.uid}`).remove();
        
        console.log(`► Deleted Fake: ${fakeUser.email}`);
        processedFakes++;
      } catch (err) {
        console.error(`❌ Error deleting fake user ${fakeUser.email}:`, err.message);
      }
    }

    console.log(`\n=========================================`);
    console.log(`🔥 Deletion Complete: ${processedFakes} targeted accounts removed.`);
    console.log(`✅ Referrers were NOT touched.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the entire process:', error);
    process.exit(1);
  }
}

purgeTargetedFakesOnly();
