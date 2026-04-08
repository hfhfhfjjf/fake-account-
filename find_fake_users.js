const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Target referral code jiske accounts delete karne hain
const TARGET_USERNAME = "shiqi";

async function deleteCenameReferrals() {
  console.log(`\n🛑 WARNING: Deletion Process Started for ALL referrals of: ${TARGET_USERNAME}...`);
  
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

    // Har user ka data check karein aur filter karein
    for (const [uid, userData] of Object.entries(usersData)) {
      if (userData && userData.referredBy === TARGET_USERNAME) {
        uidsToDelete.push(uid);
      }
    }
    
    if (uidsToDelete.length === 0) {
        console.log(`\n✅ Safe: Username '${TARGET_USERNAME}' ka koi referral database mein nahi mila. Nothing to delete.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total accounts ready to delete: ${uidsToDelete.length}`);
    console.log(`Starting permanent deletion from AUTH and RTDB...\n`);

    // Firebase Auth ki limit 1000 users per request hai, isliye 1000 ke chunks banayenge
    const chunkSize = 1000;
    
    for (let i = 0; i < uidsToDelete.length; i += chunkSize) {
      const chunk = uidsToDelete.slice(i, i + chunkSize);
      console.log(`Processing chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} users)...`);

      // 1. Authentication se hamesha ke liye delete karein
      const deleteAuthResult = await admin.auth().deleteUsers(chunk);
      console.log(`► Auth: Successfully deleted ${deleteAuthResult.successCount} users.`);
      if (deleteAuthResult.failureCount > 0) {
        console.log(`► Auth: Failed to delete ${deleteAuthResult.failureCount} users (may already be deleted).`);
      }

      // 2. Realtime Database se sirf un specific UIDs ka node hamesha ke liye delete karein
      let dbDeleteCount = 0;
      for (const uid of chunk) {
         await db.ref(`users/${uid}`).remove();
         dbDeleteCount++;
      }
      console.log(`► RTDB: Successfully removed ${dbDeleteCount} specific user records from database.\n`);
    }

    console.log(`=========================================`);
    console.log(`🎉 DELETION COMPLETE!`);
    console.log(`All ${uidsToDelete.length} fake accounts referred by '${TARGET_USERNAME}' have been purged.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error during deletion process:', error);
    process.exit(1);
  }
}

deleteCenameReferrals();
