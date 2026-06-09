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

// Function: Check if email is from an UNOFFICIAL domain (like fextemp.com, rover.info)
function isUnofficialEmail(email) {
  if (!email) return true; // Agar email missing hai toh usko bhi spam samjho
  
  const emailParts = email.toLowerCase().split('@');
  if (emailParts.length !== 2) return true; 

  const domain = emailParts[1];
  
  // Agar domain hamari ALLOWED_DOMAINS list mein NAHI hai, toh yeh un-official/spam hai
  return !ALLOWED_DOMAINS.includes(domain);
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

async function purgeJune8UnofficialFakes() {
  console.log(`\n🛑 WARNING: Scanning for unofficial email accounts created on June 8 ONLY...`);
  
  try {
    const db = admin.database();
    let fakeUsersToProcess = [];
    let nextPageToken;

    // 1. Auth se list fetch kar ke filter karna
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        // Condition: Date 8 June HO aur Email Un-official HO
        if (isJune8th(userRecord.metadata.creationTime) && isUnofficialEmail(userRecord.email)) {
            fakeUsersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email || 'No Email'
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (fakeUsersToProcess.length === 0) {
        console.log(`\n✅ Safe: Aaj ki date (June 8) mein unofficial domains wale koi accounts nahi mile.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total unofficial accounts found: ${fakeUsersToProcess.length}`);
    console.log(`Starting permanent deletion process...\n`);

    let processedFakes = 0;

    // 2. Clear from Auth and RTDB
    for (const fakeUser of fakeUsersToProcess) {
      try {
        // Auth se delete
        await admin.auth().deleteUser(fakeUser.uid);
        
        // Realtime Database se delete
        await db.ref(`users/${fakeUser.uid}`).remove();
        
        console.log(`► Deleted Fake: ${fakeUser.email} (UID: ${fakeUser.uid})`);
        processedFakes++;
      } catch (err) {
        console.error(`❌ Error deleting fake user ${fakeUser.email}:`, err.message);
      }
    }

    console.log(`\n=========================================`);
    console.log(`🔥 Deletion Complete: ${processedFakes} unofficial accounts removed.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the entire process:', error);
    process.exit(1);
  }
}

purgeJune8UnofficialFakes();
