const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

const TARGET_USERNAME = "xcq510";

async function countAllReferrals() {
  console.log(`Scanning Realtime Database to find ALL referrals for: ${TARGET_USERNAME}...`);
  
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

    let totalReferrals = 0;
    let referredUsersList = [];

    // Har user ka data check karein
    for (const [uid, userData] of Object.entries(usersData)) {
      
      // Agar referredBy xcq510 hai
      if (userData && userData.referredBy === TARGET_USERNAME) {
        totalReferrals++;
        
        referredUsersList.push({
            UID: uid,
            Username: userData.username || "N/A",
            Email: userData.email || "No Email",
            FullName: userData.fullName || "N/A"
        });
      }
    }
    
    console.log(`\n=========================================`);
    console.log(`📊 REFERRAL REPORT FOR: ${TARGET_USERNAME}`);
    console.log(`=========================================`);
    console.log(`Total Referrals found: ${totalReferrals}`);
    console.log(`=========================================\n`);
    
    if (totalReferrals > 0) {
        console.log(`📋 Referral Details:`);
        // Limit output so GitHub Actions log doesn't crash if there are thousands
        if (totalReferrals > 500) {
           console.log(`Showing first 500 records...`);
           console.table(referredUsersList.slice(0, 500));
        } else {
           console.table(referredUsersList);
        }
    } else {
        console.log(`Koi referral nahi mila is user ka.`);
    }
    
    process.exit(0); 
  } catch (error) {
    console.error('Error fetching data from Realtime Database:', error);
    process.exit(1);
  }
}

countAllReferrals();
