const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

const TARGET_USERNAME = "xcq510";

async function deleteAllSpamAccounts() {
  console.log(`\n🛑 Deletion Started for ALL referrals of: ${TARGET_USERNAME}...`);
  
  try {
    const db = admin.database();
    const usersRef = db.ref('users');
    
    // Database se tamam users ka data fetch karna
    const snapshot = await usersRef.once('value');
    const usersData = snapshot.val();
    
    if (!usersData) {
      console.log("Database mein koi users nahi mile.");
      process.exit(0);
    }

    // UIDs jama karne ke liye array
    let uidsToDelete = [];

    // Har user ka data check karein
    for (const [uid, userData] of Object.entries(usersData)) {
      if (userData && userData.referredBy === TARGET_USERNAME) {
        uidsToDelete.push(uid);
      }
    }
    
    if (uidsToDelete.length === 0) {
        console.log(`\n✅ Safe: Username '${TARGET_USERNAME}' ka koi referral database mein nahi mila.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total fake accounts found: ${uidsToDelete.length}. Deleting ALL...`);

    // Firebase Auth ki 1000 UIDs ki API limit ko handle karne ke liye internal loop
    for (let i = 0; i < uidsToDelete.length; i += 1000) {
      const chunk = uidsToDelete.slice(i, i + 1000);
      
      // 1. Authentication se delete karein
      await admin.auth().deleteUsers(chunk);

      // 2. Realtime Database se sirf in UIDs ka data delete karein
      for (const uid of chunk) {
         await db.ref(`users/${uid}`).remove();
      }
    }

    console.log(`\n=========================================`);
    console.log(`🎉 COMPLETELY DELETED!`);
    console.log(`All ${uidsToDelete.length} fake accounts referred by '${TARGET_USERNAME}' have been permanently removed.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during deletion process:', error);
    process.exit(1);
  }
}

deleteAllSpamAccounts();
