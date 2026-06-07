const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Target referral code
const TARGET_REFERRAL = "utrader";

// Function: Check if created strictly on June 4, 5, 6, or 7, 2026
function isTargetDate(creationTimeStr) {
  if (!creationTimeStr) return false;
  
  const creationDate = new Date(creationTimeStr);
  const year = creationDate.getFullYear();
  const month = creationDate.getMonth(); // 5 = June (0-indexed)
  const date = creationDate.getDate();

  // Check if date is 4, 5, 6, or 7
  return year === 2026 && month === 5 && [4, 5, 6, 7].includes(date);
}

async function purgeSpecificReferrals() {
  console.log(`\n🛑 WARNING: Scanning for accounts referred by '${TARGET_REFERRAL}' created between June 4 and June 7...`);
  
  try {
    const db = admin.database();

    // Database se directly un users ko uthana jinhone yeh code use kiya hai
    // Yeh pure Auth list ko scan karne se bohut zyada fast hai
    console.log(`Querying database for referral code: ${TARGET_REFERRAL}...`);
    const snapshot = await db.ref('users').orderByChild('referredBy').equalTo(TARGET_REFERRAL).once('value');
    const usersData = snapshot.val();

    if (!usersData) {
        console.log(`\n✅ Safe: Koi bhi account database mein nahi mila jisne '${TARGET_REFERRAL}' use kiya ho.`);
        process.exit(0);
    }

    const uidsToCheck = Object.keys(usersData);
    console.log(`⚠️ Found ${uidsToCheck.length} total accounts using this referral code. Checking dates...\n`);

    let processedFakes = 0;

    // Har targeted user ka data process karna
    for (const uid of uidsToCheck) {
      try {
        // Har user ki creation date Auth se verify karna
        const userRecord = await admin.auth().getUser(uid);

        if (isTargetDate(userRecord.metadata.creationTime)) {
            // Condition match ho gayi (Date 4, 5, 6, ya 7 June hai)
            await admin.auth().deleteUser(uid);
            await db.ref(`users/${uid}`).remove();
            
            const exactDate = new Date(userRecord.metadata.creationTime).getDate();
            console.log(`► Deleted Fake: ${userRecord.email || uid} (Date matched: June ${exactDate})`);
            processedFakes++;
        }
      } catch (err) {
        // Agar account Auth se pehle hi delete ho chuka hai lekin RTDB mein para hai (orphan data)
        if (err.code === 'auth/user-not-found') {
            await db.ref(`users/${uid}`).remove();
            console.log(`► Cleaned Ghost Record from Database: UID [${uid}]`);
            processedFakes++;
        } else {
            console.error(`❌ Error checking user ${uid}:`, err.message);
        }
      }
    }

    console.log(`\n=========================================`);
    console.log(`🔥 Deletion Complete: ${processedFakes} targeted accounts removed.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during the entire process:', error);
    process.exit(1);
  }
}

purgeSpecificReferrals();
