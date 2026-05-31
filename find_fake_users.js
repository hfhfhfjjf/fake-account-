const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Yahan aap mazeed fake domains add kar sakte hain jo aapko spam kar rahe hain
const SUSPICIOUS_DOMAINS = ['bwmyga.com']; 

// Function: Check if email is suspicious
function isSuspiciousEmail(email) {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  
  // 1. Check if domain matches our suspicious list
  const isBadDomain = SUSPICIOUS_DOMAINS.some(domain => emailLower.endsWith(`@${domain}`));
  
  // 2. Check if the local part (before @) looks like 10 random alphanumeric characters
  // Example: pbatd4m7vf
  const prefix = emailLower.split('@')[0];
  const isRandomPrefix = /^[a-z0-9]{10}$/.test(prefix) && /\d/.test(prefix) && /[a-z]/.test(prefix);

  return isBadDomain || isRandomPrefix;
}

// Function: Check if created on May 30 or May 31, 2026
function isTargetDate(creationTimeStr) {
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 4 = May (0-indexed)
  const date = creationDate.getDate();

  return year === 2026 && month === 4 && (date === 30 || date === 31);
}

async function processSpamAccounts() {
  console.log(`\n🛑 WARNING: Scanning for spam accounts created on May 30 & 31...`);
  
  try {
    const db = admin.database();
    let usersToProcess = [];
    let nextPageToken;

    // Firebase Auth se list paginate kar ke tamam users nikalna
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        if (isTargetDate(userRecord.metadata.creationTime) && isSuspiciousEmail(userRecord.email)) {
            // Sirf wo users jo already disabled nahi hain unko array mein daalain
            if (!userRecord.disabled) {
                usersToProcess.push({
                    uid: userRecord.uid,
                    email: userRecord.email
                });
            }
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (usersToProcess.length === 0) {
        console.log(`\n✅ Safe: Koi spam accounts in dates mein nahi mile. Nothing to process.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total spam accounts found: ${usersToProcess.length}`);
    console.log(`Starting Disable (Auth) & Deletion (RTDB) process...\n`);

    let processedCount = 0;

    // Loop through targeted users
    for (const targetUser of usersToProcess) {
      try {
        // 1. Auth mein account ko disable karna
        await admin.auth().updateUser(targetUser.uid, { disabled: true });
        
        // 2. RTDB se data permanently delete karna
        await db.ref(`users/${targetUser.uid}`).remove();
        
        console.log(`► Processed: ${targetUser.email} (Disabled in Auth, Deleted from RTDB)`);
        processedCount++;
      } catch (err) {
        console.error(`❌ Error processing user ${targetUser.email} (${targetUser.uid}):`, err.message);
      }
    }

    console.log(`\n=========================================`);
    console.log(`🎉 PROCESS COMPLETE!`);
    console.log(`Successfully handled ${processedCount} out of ${usersToProcess.length} fake accounts.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the scanning process:', error);
    process.exit(1);
  }
}

processSpamAccounts();
