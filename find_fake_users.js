const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Yahan hum sirf un domains ko allow kar rahe hain jo official/trusted hain
const ALLOWED_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'icloud.com',
  'mac.com',
  'me.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com'
];

// Function: Check if email is from an UNOFFICIAL domain (like merepost.com)
function isUnofficialEmail(email) {
  if (!email) return true; // Agar email missing hai toh usko bhi filter karo
  
  const emailParts = email.toLowerCase().split('@');
  if (emailParts.length !== 2) return true; // Invalid format

  const domain = emailParts[1];
  
  // Agar domain ALLOWED_DOMAINS list mein NAHI hai, toh yeh un-official/spam hai
  return !ALLOWED_DOMAINS.includes(domain);
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

async function purgeUnofficialFakesOnly() {
  console.log(`\n🛑 WARNING: Scanning for accounts (June 6 & 7 ONLY) without official email domains...`);
  
  try {
    const db = admin.database();
    let fakeUsersToProcess = [];
    let nextPageToken;

    // 1. Find the specific fake accounts
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        // Condition: Date 6-7 June HO aur Email Un-official HO
        if (isJune6or7(userRecord.metadata.creationTime) && isUnofficialEmail(userRecord.email)) {
            fakeUsersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (fakeUsersToProcess.length === 0) {
        console.log(`\n✅ Safe: Koi bhi non-official email account (June 6-7) mein nahi mila. Nothing to process.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total unofficial accounts found: ${fakeUsersToProcess.length}`);
    console.log(`Starting process to Delete Fakes ONLY (Referrers will NOT be disabled)...\n`);

    let processedFakes = 0;

    // 2. Process Fake Accounts (Delete from Auth & RTDB)
    for (const fakeUser of fakeUsersToProcess) {
      try {
        // Fake account ko Auth se hamesha ke liye delete karna
        await admin.auth().deleteUser(fakeUser.uid);
        
        // Fake account ko RTDB se permanent delete karna
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

purgeUnofficialFakesOnly();
