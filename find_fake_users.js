const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Function: Check if email is suspicious (Dot trick, Plus trick, or QQ domain)
function isSuspiciousEmailPattern(email) {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  const parts = emailLower.split('@');
  if (parts.length !== 2) return false;

  const localPart = parts[0];
  const domain = parts[1];

  // 1. Check for QQ.com domain (Spam domain)
  if (domain === 'qq.com') {
    return true;
  }

  // 2. Check for Gmail Tricks
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Plus Trick: Check if it contains '+'
    const hasPlus = localPart.includes('+');
    
    // Dot Trick: Check if local part has 2 or more dots
    const dotCount = (localPart.match(/\./g) || []).length;
    const tooManyDots = dotCount >= 2;

    return hasPlus || tooManyDots;
  }
  
  return false;
}

// Function: Check if created on June 2, 2026
function isJune2nd(creationTimeStr) {
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 5 = June (0-indexed)
  const date = creationDate.getDate();

  return year === 2026 && month === 5 && date === 2;
}

async function purgeJuneFakesAndDisableReferrers() {
  console.log(`\n🛑 WARNING: Scanning for fake accounts (June 2) using dot/plus tricks & qq.com...`);
  
  try {
    const db = admin.database();
    let fakeUsersToProcess = [];
    let nextPageToken;

    // 1. Find all fake accounts created on June 2
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      listUsersResult.users.forEach((userRecord) => {
        if (isJune2nd(userRecord.metadata.creationTime) && isSuspiciousEmailPattern(userRecord.email)) {
            fakeUsersToProcess.push({
                uid: userRecord.uid,
                email: userRecord.email
            });
        }
      });
      
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (fakeUsersToProcess.length === 0) {
        console.log(`\n✅ Safe: Koi "Dot/Plus Trick" ya "qq.com" wale accounts June 2 ki date mein nahi mile.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total fake accounts found: ${fakeUsersToProcess.length}`);
    console.log(`Starting process to Delete Fakes & Disable their Referrers...\n`);

    let processedFakes = 0;
    let referrersToDisable = new Set(); // To avoid duplicate referrers

    // 2. Process Fake Accounts and extract Referrers
    for (const fakeUser of fakeUsersToProcess) {
      try {
        // RTDB se fake user ka data nikal kar 'referredBy' check karna
        const userSnap = await db.ref(`users/${fakeUser.uid}`).once('value');
        const userData = userSnap.val();

        if (userData && userData.referredBy) {
            referrersToDisable.add(userData.referredBy);
        }

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
    console.log(`🔥 Deletion Complete: ${processedFakes} fake accounts removed.`);
    console.log(`=========================================\n`);
    
    // 3. Disable the main culprits (Referrers)
    if (referrersToDisable.size > 0) {
        console.log(`⚠️ Found ${referrersToDisable.size} main referrers who invited these bots. Disabling them...`);
        let disabledCount = 0;

        for (const referrerUsername of referrersToDisable) {
            try {
                // Database mein username search kar ke uski UID nikalna
                const snapshot = await db.ref('users').orderByChild('username').equalTo(referrerUsername).once('value');
                
                if (snapshot.exists()) {
                    for (const [uid, data] of Object.entries(snapshot.val())) {
                        // Main abuser ko Auth mein disable kar dena
                        await admin.auth().updateUser(uid, { disabled: true });
                        console.log(`🚫 Disabled Abuser: Username '${referrerUsername}' (UID: ${uid})`);
                        disabledCount++;
                    }
                } else {
                    console.log(`⚠️ Referrer '${referrerUsername}' not found in database.`);
                }
            } catch (err) {
                console.error(`❌ Error disabling referrer '${referrerUsername}':`, err.message);
            }
        }
        console.log(`\n✅ Successfully disabled ${disabledCount} referring accounts.`);
    }

    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the entire process:', error);
    process.exit(1);
  }
}

purgeJuneFakesAndDisableReferrers();
