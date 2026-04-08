const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// JIS CODE KE REFERRALS DELETE KARNE HAIN, WO YAHAN LIKHEIN
const TARGET_USERNAME = "rian88"; 

async function deleteReferralAccounts() {
  console.log(`\n🚀 Deletion process started for all users referred by: ${TARGET_USERNAME}`);
  
  try {
    const db = admin.database();
    const usersRef = db.ref('users');
    
    // Database se data lana
    const snapshot = await usersRef.once('value');
    const usersData = snapshot.val();
    
    if (!usersData) {
      console.log("Database khali hai.");
      process.exit(0);
    }

    let uidsToDelete = [];

    // Saare users ko check karna
    for (const [uid, userData] of Object.entries(usersData)) {
      // Agar referredBy us target code se match karta hai
      if (userData && userData.referredBy === cename) {
        uidsToDelete.push(uid);
      }
    }
    
    if (uidsToDelete.length === 0) {
        console.log(`\n✅ Koi account nahi mila jo '${TARGET_USERNAME}' se refer hua ho.`);
        process.exit(0);
    }

    console.log(`\n⚠️ Total ${uidsToDelete.length} accounts mile hain. Purging started...`);

    // Firebase Auth ki limit handle karne ke liye 1000 ke chunks
    for (let i = 0; i < uidsToDelete.length; i += 1000) {
      const chunk = uidsToDelete.slice(i, i + 1000);
      
      // 1. Firebase Auth se delete karna
      const authResult = await admin.auth().deleteUsers(chunk);
      console.log(`► Auth: ${authResult.successCount} users delete ho gaye.`);

      // 2. Realtime Database se unka data delete karna
      let dbCount = 0;
      for (const uid of chunk) {
         await db.ref(`users/${uid}`).remove();
         dbCount++;
      }
      console.log(`► RTDB: ${dbCount} records saaf ho gaye.`);
    }

    console.log(`\n=========================================`);
    console.log(`✨ SUCCESS: Sab kuch saaf ho gaya!`);
    console.log(`'${TARGET_USERNAME}' ke saare ${uidsToDelete.length} referrals uda diye gaye hain.`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteReferralAccounts();
