const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

async function countKycVerifiedUsers() {
  console.log(`\n🔍 Scanning Realtime Database to count KYC Verified users...`);
  
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

    let kycVerifiedCount = 0;
    let totalUsersCount = 0;

    // Har user ka data check karein
    for (const [uid, userData] of Object.entries(usersData)) {
      totalUsersCount++;
      
      // Check karein ke kya user kycVerified hai (screenshot ke mutabiq yeh boolean 'true' hai)
      if (userData && userData.kycVerified === true) {
        kycVerifiedCount++;
      }
    }

    console.log(`\n=========================================`);
    console.log(`✅ KYC VERIFICATION REPORT`);
    console.log(`=========================================`);
    console.log(`Total Users in Database : ${totalUsersCount}`);
    console.log(`Total KYC Verified      : ${kycVerifiedCount}`);
    console.log(`Pending/Unverified      : ${totalUsersCount - kycVerifiedCount}`);
    console.log(`=========================================\n`);
    
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error fetching data from Realtime Database:', error);
    process.exit(1);
  }
}

countKycVerifiedUsers();
