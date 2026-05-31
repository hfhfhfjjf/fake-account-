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

// Function: Check if email is from an UNOFFICIAL domain
function isUnofficialEmail(email) {
  if (!email) return true; 
  
  const emailParts = email.toLowerCase().split('@');
  if (emailParts.length !== 2) return true; 

  const domain = emailParts[1];
  
  return !ALLOWED_DOMAINS.includes(domain);
}

// Function: Check if created on May 30 or May 31, 2026
function isTargetDate(creationTimeStr) {
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 4 = May (0-indexed)
  const date = creationDate.getDate();

  return year === 2026 && month === 4 && (date === 30 || date === 31);
}

async function purgeUnofficialAccounts() {
  console.log(`\n🛑 WARNING: Scanning for accounts (May 30-31) without official email domains...`);
  
  try {
    const db = admin.database();
    let usersToProcess = [];
    let nextPageToken;

    // Firebase Auth se users fetch karna
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        // Condition: Date 30-31 May HO aur Email Un-official HO
        if (isTargetDate(userRecord.metadata.creationTime) && isUnofficialEmail(userRecord.email)) {
            usersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (usersToProcess.length === 0) {
        console.log(`\n✅ Safe: Koi bhi non-official email account in dates mein nahi mila. Nothing to process.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total unofficial accounts found: ${usersToProcess.length}`);
    console.log(`Starting Permanent Deletion from Auth & RTDB...\n`);

    let processedCount = 0;

    for (const targetUser of usersToProcess) {
      try {
        // 1. Auth se account ko hamesha ke liye delete karna
        await admin.auth().deleteUser(targetUser.uid);
        
        // 2. Realtime Database se unka node permanent delete karna
        await db.ref(`users/${targetUser.uid}`).remove();
        
        console.log(`► Deleted: ${targetUser.email} (Removed from Auth & RTDB)`);
        processedCount++;
      } catch (err) {
        console.error(`❌ Error processing user ${targetUser.email} (${targetUser.uid}):`, err.message);
      }
    }

    console.log(`\n=========================================`);
    console.log(`🎉 DELETION COMPLETE!`);
    console.log(`Successfully deleted ${processedCount} out of ${usersToProcess.length} unofficial accounts.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the scanning process:', error);
    process.exit(1);
  }
}

purgeUnofficialAccounts();
