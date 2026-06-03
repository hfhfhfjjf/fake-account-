const admin = require('firebase-admin');

// GitHub secrets se service account key lena
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" 
});

// Aapne jo log text bheja tha, wo yahan mojood hai
const logText = `
2026-06-02T14:43:10.7874542Z ⚠️ Found 371 main referrers who invited these bots (Skipping 'starx'). Disabling them...
2026-06-02T14:43:33.4177861Z 🚫 Disabled Abuser: Username 'rrri_jall' (UID: z2H0ks0IkDNYTn2WLhKGXOnYs2s2)
2026-06-02T14:43:45.5288903Z 🚫 Disabled Abuser: Username 'haiyang' (UID: CvHL8XTRxbZ7MOxGWnRgC7Ku02W2)
2026-06-02T14:44:08.7790663Z 🚫 Disabled Abuser: Username 'zlb320827' (UID: X7F6C1J92uhZhKmQNg7TV9Pz9md2)
2026-06-02T14:44:32.1570077Z 🚫 Disabled Abuser: Username 'ddp1981' (UID: ajmVK34UlVRtg7PXcm3opIQkK9Z2)
2026-06-02T14:44:43.2750802Z 🚫 Disabled Abuser: Username 'yezi' (UID: OYm3RdjbKFS8hOwGDS8TeDDlAnQ2)
2026-06-02T14:44:55.0040380Z 🚫 Disabled Abuser: Username 'lxk1688' (UID: 9x9K27VcvJMjvJjxtpOVbzGhVo92)
2026-06-02T14:45:41.0189164Z 🚫 Disabled Abuser: Username 'jianjie303' (UID: qG8JWriHzQTlSScRblvGgmdUepd2)
2026-06-02T14:46:15.3567591Z 🚫 Disabled Abuser: Username 'starxwkh' (UID: oYDI0bVu4QVwRThzUaHdd9XH4jq2)
2026-06-02T14:47:23.4384750Z 🚫 Disabled Abuser: Username 'mf136' (UID: ooJy5CgtIafBVWtfYGMJBnuWAz73)
2026-06-02T14:48:19.6416227Z 🚫 Disabled Abuser: Username 'openmainnet' (UID: 7RQwg3vKbxfkry7jZdtrHcsTvZw1)
2026-06-02T14:49:26.9692104Z 🚫 Disabled Abuser: Username 'mrspock' (UID: E0SgOdF1mGg86lfyd5BOzBQE0yL2)
2026-06-02T14:49:38.1153813Z 🚫 Disabled Abuser: Username 'thxx018' (UID: UPiSAZZWqhcuCBeAR6V2Wz0WwE33)
2026-06-02T14:50:00.5143661Z 🚫 Disabled Abuser: Username 'djshuh373823' (UID: Yq1lPSuSXRb8wuX1mkU382hG3IG2)
2026-06-02T14:50:22.3910930Z 🚫 Disabled Abuser: Username 'jinzi333' (UID: phKiZuiZCChAbFxzetQqfJouBA42)
2026-06-02T14:50:43.5697069Z 🚫 Disabled Abuser: Username 'wk197027' (UID: GTnaNRVtyaSVcSnPED8HYjznB1y2)
2026-06-02T14:50:54.4723874Z 🚫 Disabled Abuser: Username 'liao748312' (UID: CxgpKf4pw1TzN5FOCXOxGPoPAKD2)
2026-06-02T14:51:04.8997760Z 🚫 Disabled Abuser: Username 'a1234' (UID: FICCGzRnjqXqPjko5PxWGKu3k162)
2026-06-02T14:51:35.9096118Z 🚫 Disabled Abuser: Username 'token' (UID: m0VSW94EVCNkFko6QSrPJvH2vJG3)
2026-06-02T14:52:07.6330330Z 🚫 Disabled Abuser: Username 'truong36' (UID: BatQxhqZjbhhhS2Km68pRqXtley2)
2026-06-02T14:52:18.5502467Z 🚫 Disabled Abuser: Username 'fxuio' (UID: 09zNFdUQdDTh7XsOZlK6vF9nS9B2)
2026-06-02T14:52:40.0368885Z 🚫 Disabled Abuser: Username 'cenzong' (UID: ojPRTavLT7gCOhTwSqIv1ryajA23)
2026-06-02T14:53:12.2169116Z 🚫 Disabled Abuser: Username 'rby888' (UID: p0pqHzdAxfhyuj4vyjGxwluPTDy1)
2026-06-02T14:53:54.9633701Z 🚫 Disabled Abuser: Username 'startx' (UID: 0Agz3uUX0xQogACVqpC9740Imjd2)
2026-06-02T14:54:06.1425516Z 🚫 Disabled Abuser: Username 'manput80' (UID: u6QxmIe4LjTYHJHU8SiVrGUM1x02)
2026-06-02T14:54:37.9862256Z 🚫 Disabled Abuser: Username 'shangpan123' (UID: avkqcEUaAXdbxL99msH7RTSiytk2)
2026-06-02T14:55:11.3776491Z 🚫 Disabled Abuser: Username 'yong666' (UID: 2CUynD1ql2dE4oU5n1JqVOfsmzC2)
2026-06-02T14:56:27.7277484Z 🚫 Disabled Abuser: Username 'one121212' (UID: qbrKipjwf4a9EN8EP5wjAPZPwM33)
2026-06-02T14:56:49.6348838Z 🚫 Disabled Abuser: Username 'saleh235' (UID: Cpv5Cw1AIfel0XQCFaUmNVzcSLy1)
2026-06-02T14:57:11.6844415Z 🚫 Disabled Abuser: Username 'lpq0809520' (UID: 4DpSXVdBPbWFjtvrSfm1HKyywQk2)
2026-06-02T14:57:33.4549174Z 🚫 Disabled Abuser: Username '000000' (UID: vmJswluecLSr09NM76atRMuycFX2)
2026-06-02T14:58:50.9492680Z 🚫 Disabled Abuser: Username 'jingy1319' (UID: 9NTegcqd8TgGoOSfMm9EufMuIhI3)
2026-06-02T14:59:24.6055476Z 🚫 Disabled Abuser: Username 'dcd7728' (UID: axzDIkung6P2ERtm7tkY0v9Wf2G2)
2026-06-02T15:01:48.6307094Z 🚫 Disabled Abuser: Username 'ch9555' (UID: 49aCTgd59HanW9v0vTf863aouJq2)
2026-06-02T15:02:32.9440254Z 🚫 Disabled Abuser: Username 'dounw' (UID: T25DHFmjF2SknboEe0pZSiH0YOC3)
2026-06-02T15:02:44.2838396Z 🚫 Disabled Abuser: Username 'caminers' (UID: 6WURIVxnLqSl3GpR4j76Qhf2UTm2)
2026-06-02T15:05:06.9070024Z 🚫 Disabled Abuser: Username '1177' (UID: Xscns4pWYTQrCztJSoVyYEF7Wiz1)
2026-06-02T15:05:39.1976254Z 🚫 Disabled Abuser: Username 'andy888' (UID: xo2DrZ3psFPQDg4VerwLXolE2dM2)
2026-06-02T15:06:01.2223300Z 🚫 Disabled Abuser: Username 'htkvn' (UID: ZEcJDUFY33TvAC1phphZ5lTtUDA2)
2026-06-02T15:06:12.6773503Z 🚫 Disabled Abuser: Username 'y66666y' (UID: e2YqdiQ6v1QtSpR9fbqL17nWQvA3)
2026-06-02T15:06:23.7418892Z 🚫 Disabled Abuser: Username 'liwai' (UID: vIz4CnjDtYS0rIPDk7yV8YJfkyG2)
2026-06-02T15:06:45.6033135Z 🚫 Disabled Abuser: Username '1133199' (UID: JQccmc4WRhNRw2iCWZ6dyrc006o2)
2026-06-02T15:07:17.6956658Z 🚫 Disabled Abuser: Username 'mystarx' (UID: tWDKYSh2xqN7ea4UVLE3PAwoERA2)
2026-06-02T15:08:00.0507212Z 🚫 Disabled Abuser: Username 'cuiyuzhen' (UID: p5hXGxb7haNeuGVuGVygd2rnYIm2)
2026-06-02T15:08:10.7693932Z 🚫 Disabled Abuser: Username 'hnpgfxa' (UID: EIrN6IKdkCaC8PWEthohvB3ztP42)
2026-06-02T15:08:22.0649225Z 🚫 Disabled Abuser: Username 'ymx32199' (UID: tmgYEqaCcvbwoaavbpN4f15Mru33)
2026-06-02T15:09:25.7626073Z 🚫 Disabled Abuser: Username 'qianyu' (UID: H7zrxwzfkEQ50TjJI6AgpLsqflZ2)
2026-06-02T15:09:36.4298394Z 🚫 Disabled Abuser: Username 'junjiexiaozi' (UID: KMqdryVdQKUjRJs5C0hDUwwWIbX2)
2026-06-02T15:09:57.7648298Z 🚫 Disabled Abuser: Username '嗨皮' (UID: ICuaLMqXY1e0wa91jjn64Jr6TGX2)
2026-06-02T15:10:18.9241899Z 🚫 Disabled Abuser: Username 'liu135157' (UID: UQnwagWx3aasZnjeMtw2dPGcPBB2)
2026-06-02T15:10:50.7684036Z 🚫 Disabled Abuser: Username 'sunnybright' (UID: vECUHd5q0YVRp4QnzhrX2EBIyF72)
2026-06-02T15:11:11.9461796Z 🚫 Disabled Abuser: Username 'fei1988' (UID: wlYjU6DE4vTRyTRtaK8Nj9xb86B2)
2026-06-02T15:11:33.1572339Z 🚫 Disabled Abuser: Username 'cbb131' (UID: 9It6rZbMzzacoYBnByaJGx81pl82)
2026-06-02T15:11:43.8540310Z 🚫 Disabled Abuser: Username 'cj319' (UID: 7QjcDXLyc1UjEhmEwRwlGdHQFz73)
2026-06-02T15:13:41.5420852Z 🚫 Disabled Abuser: Username 'qzmjbs888' (UID: TjM1r45Qc6OQ3P2D5Dc6igvhPoG2)
2026-06-02T15:14:24.7292068Z 🚫 Disabled Abuser: Username 'draltcoin' (UID: o5a3X22anVW0hayzBb306ueW5M62)
2026-06-02T15:14:35.5238774Z 🚫 Disabled Abuser: Username 'sirhadi19' (UID: UgCwyKsU7KTChvnQVTt1CiAn8842)
2026-06-02T15:16:02.2314694Z 🚫 Disabled Abuser: Username 'jspxhdyp' (UID: YpmpWB6XNCSzNsZoYBtHbxmDnn52)
2026-06-02T15:16:13.4341342Z 🚫 Disabled Abuser: Username 'simon12' (UID: E9NiJ6jCUmY9QopyGmyKoiqOCxy1)
2026-06-02T15:17:07.3144935Z 🚫 Disabled Abuser: Username 'zk123' (UID: ms5w35m8ojSN3Rtex2FFXwo12t62)
2026-06-02T15:17:51.1431467Z 🚫 Disabled Abuser: Username 'signup' (UID: jbOVJVRy8WVMtaqc1rmX0ROZIoI2)
2026-06-02T15:18:13.5175106Z 🚫 Disabled Abuser: Username 'wxz111111' (UID: 8CYiZcrn8QZbq8uAfgZTVLUK71y2)
2026-06-02T15:18:45.8489077Z 🚫 Disabled Abuser: Username 'jarolacrypto' (UID: 1vaYCleF84boP5X2Z0UAzTuIxXO2)
2026-06-02T15:19:50.4802583Z 🚫 Disabled Abuser: Username 'ck100' (UID: 3SNfX9MXyWUUTsq4jEBb3MraY4a2)
2026-06-02T15:20:12.5660969Z 🚫 Disabled Abuser: Username 'zjg556688' (UID: xSsN3yjEyvRlQ2JHV83faOf2HrY2)
2026-06-02T15:20:46.0502802Z 🚫 Disabled Abuser: Username '夏龙阳' (UID: CZqIS6s5nMQrxqXsuOMTPXNPuc63)
2026-06-02T15:22:35.4577348Z 🚫 Disabled Abuser: Username 'josgo28' (UID: CCml2PWlxOfND4XyTYGpwFY9QQW2)
2026-06-02T15:22:46.3775852Z 🚫 Disabled Abuser: Username 'tansi69' (UID: 8mh7Ece1gAfZU07RdADuAflP6Zh2)
2026-06-02T15:23:29.7967565Z 🚫 Disabled Abuser: Username 'mz888888' (UID: NBqx5OKKySfpoeNJ6sQCrUNVHlt2)
2026-06-02T15:23:51.9807591Z 🚫 Disabled Abuser: Username 'candy' (UID: Wiuc6fwTZxSOGrhygy2eg8z6gVm1)
2026-06-02T15:24:35.4645090Z 🚫 Disabled Abuser: Username 'king856' (UID: vKMxk7jKqqdZv5iU08YdfrjmvQN2)
2026-06-02T15:24:56.9877532Z 🚫 Disabled Abuser: Username 'hailin' (UID: O8yrfqC18nM9kf4ooWep1lpE2gA3)
2026-06-02T15:26:12.8824652Z 🚫 Disabled Abuser: Username 'john75' (UID: 0lXiERQTYgbIn4ARiNKAlwCPvIw1)
2026-06-02T15:26:56.5762603Z 🚫 Disabled Abuser: Username 'luoyijiao' (UID: Ku8Taz9YnofxhYhZkGhyTk8sOvd2)
2026-06-02T15:28:01.8530280Z 🚫 Disabled Abuser: Username '565455' (UID: kDRti4wRtHTn0fk3PmpBOglrLeB3)
2026-06-02T15:28:45.1624377Z 🚫 Disabled Abuser: Username 'strax' (UID: Q2fw1mfMgRNeT2vGrV3Apb3CjV43)
2026-06-02T15:29:49.2929534Z 🚫 Disabled Abuser: Username 'cboran' (UID: GZPSHoktzrgkvvOGt7dTtK0M0lD3)
2026-06-02T15:31:50.2611733Z 🚫 Disabled Abuser: Username 'vasiliu24' (UID: dOAOjB617UdK6InsEEMU4sjmlGh2)
2026-06-02T15:32:12.4412710Z 🚫 Disabled Abuser: Username 'wanglin' (UID: 3RoiS5IC9EX6mCVQasevp0NU8Xw2)
2026-06-02T15:32:55.9714860Z 🚫 Disabled Abuser: Username 'diamonds' (UID: StDSTUc0YabNJtUTjtKI62uhSaJ2)
2026-06-02T15:34:11.1679306Z 🚫 Disabled Abuser: Username 'anvar' (UID: OyydVSaedSRe5k8O63vBHuiPiXZ2)
2026-06-02T15:34:22.1182058Z 🚫 Disabled Abuser: Username 's' (UID: SaPazdvuRHfXzXURWF5zfBfu23h1)
2026-06-02T15:35:16.3425973Z 🚫 Disabled Abuser: Username 'mexico227' (UID: 1fpqBddrAAUPCo8Mkpno50x1qi12)
2026-06-02T15:36:42.5479625Z 🚫 Disabled Abuser: Username 'pingcry' (UID: YoOvtCiCbqMOTOpTF1Ti56YdgRT2)
2026-06-02T15:36:53.3711700Z 🚫 Disabled Abuser: Username 'timberland250' (UID: txOXkUFmb2bVPadwTusJxWUzrqH3)
2026-06-02T15:37:04.9955619Z 🚫 Disabled Abuser: Username 'mhj139' (UID: v95MT7cJFaNksxfiGmhUVpTfm5c2)
2026-06-02T15:37:36.9074310Z 🚫 Disabled Abuser: Username 'heo' (UID: EHYlmF27lPbA0cg3VTkDnvZEgL82)
2026-06-02T15:37:48.0542593Z 🚫 Disabled Abuser: Username 'gzp6816' (UID: apdjos8OOuMJa5Ydf7FLrActuii2)
2026-06-02T15:38:09.4435414Z 🚫 Disabled Abuser: Username 'papaboy524' (UID: vnEkPOGDbUdk8Ex2SVdBwZT4Hb72)
2026-06-02T15:38:53.0713309Z 🚫 Disabled Abuser: Username 'xyz588' (UID: AxwF8EozHGZ2b611jGf5mgNOPKE2)
2026-06-02T15:39:25.3753913Z 🚫 Disabled Abuser: Username 'dali26815' (UID: VcgifRQHwfMI0szHsDKdo93cLf03)
2026-06-02T15:39:36.6822776Z 🚫 Disabled Abuser: Username 'hsj88999' (UID: n2RIR1QblmQLfk7nDWNxDbA64lU2)
2026-06-02T15:39:47.7473383Z 🚫 Disabled Abuser: Username 'x' (UID: qgr7plNCgweHBI8bCOd9piXtyfP2)
2026-06-02T15:40:09.8629308Z 🚫 Disabled Abuser: Username 'ic-rain' (UID: dZP0SqmjNkWhCULm5uUGvqmkWX22)
2026-06-02T15:40:31.7333360Z 🚫 Disabled Abuser: Username 'txm023' (UID: ANEMned1HcW4LVgsxdf9FbTafDf1)
2026-06-02T15:40:32.0977379Z 🚫 Disabled Abuser: Username 'txm023' (UID: H47zRACDryTfoIiSLOgqeciH27g1)
2026-06-02T15:40:43.5253507Z 🚫 Disabled Abuser: Username 'greg2962' (UID: blnzMo1HPITFi48gHb2nz18XiUW2)
2026-06-02T15:42:41.9197139Z 🚫 Disabled Abuser: Username 'metta95' (UID: xFoIz477SmduVjn8bwzqfY8BFks2)
2026-06-02T15:42:53.2179324Z 🚫 Disabled Abuser: Username 'taizi' (UID: 7T1hXXwPvUNmtNj7S1I5lRKaap22)
2026-06-02T15:43:04.1936716Z 🚫 Disabled Abuser: Username 'sq100200' (UID: vN9PvMKRPvSBPDloX57EhRr8YTE2)
2026-06-02T15:43:47.9125366Z 🚫 Disabled Abuser: Username 'cmq141319' (UID: VLMZKchqiOfyuBoca1fYf5aQDen2)
2026-06-02T15:44:31.9418914Z 🚫 Disabled Abuser: Username 'qun66666' (UID: 3XWvvYp9AUcZAHVOwrr4kFx1wah2)
2026-06-02T15:44:43.6216091Z 🚫 Disabled Abuser: Username 'wuxuemin' (UID: VLP25l6XC8ZH02uW2hTNWO2gtED3)
2026-06-02T15:44:54.9797052Z 🚫 Disabled Abuser: Username 'zhao' (UID: 8nXNR20klSXg9Ng3AYJaPrHscwA3)
2026-06-02T15:45:50.4577567Z 🚫 Disabled Abuser: Username 'oy4913' (UID: SZ2v476lbfWeNzN13YSXsFfk9uw2)
2026-06-02T15:46:24.0686591Z 🚫 Disabled Abuser: Username 'xin0608' (UID: awi8aP4tLOfDq5So5YJGuOOSEMa2)
2026-06-02T15:46:36.3122124Z 🚫 Disabled Abuser: Username '9' (UID: QkJe6KU0pfdoLehoXoOKBRJTHqx2)
2026-06-02T15:47:20.5896888Z 🚫 Disabled Abuser: Username '2233' (UID: ZfkrFFRlUphQXhIUuMzwoRlujQ43)
2026-06-02T15:48:05.0805927Z 🚫 Disabled Abuser: Username 'stalla' (UID: fGVv5EMHtwSd30aIU9029z21K9P2)
2026-06-02T15:48:16.9010639Z 🚫 Disabled Abuser: Username 'huangjunfeng' (UID: YXg7i8SmvqgjSrw5VKIaemRkPUM2)
2026-06-02T15:48:28.4292131Z 🚫 Disabled Abuser: Username 'datou95' (UID: uTWJtB0Kbig6uVqmvAFEANB8g2n2)
2026-06-02T15:48:50.2587989Z 🚫 Disabled Abuser: Username 'zhangcheng8888' (UID: T8B9CCwJTMUD04IfCkgslSVp0cJ3)
2026-06-02T15:49:01.2323145Z 🚫 Disabled Abuser: Username 'brian' (UID: i03BYt1QQKcZPd7FTFl8cD0htNu2)
2026-06-02T15:49:23.6455226Z 🚫 Disabled Abuser: Username 'zzxx1' (UID: gtwl7WmFq1VaNH0simCSXIud6A42)
2026-06-02T15:49:46.2553169Z 🚫 Disabled Abuser: Username 'starxz' (UID: VAOSvP754FYhecnZdUVHdyhfk3B3)
2026-06-02T15:49:57.7099327Z 🚫 Disabled Abuser: Username 'gls567' (UID: rXImAjJHM1gqi7PyIVwEKixpANx2)
2026-06-02T15:50:09.2269343Z 🚫 Disabled Abuser: Username 'star' (UID: gm744fD65NVDQzoGfSGOF22QIz32)
2026-06-02T15:50:32.0430949Z 🚫 Disabled Abuser: Username 'mxb8866' (UID: tENv87GJZfTxOKFPdPODOTwBsZn2)
2026-06-02T15:50:43.1969170Z 🚫 Disabled Abuser: Username 'brianmanpi' (UID: UZqx8wMNwKPjZ8yGkYJXP3p94Hf1)
2026-06-02T15:50:54.8747952Z 🚫 Disabled Abuser: Username 'jeannot20' (UID: MSyaMX9jXBNP6R0eHgghp0AnBpw1)
`;

async function restoreAccountsFromLogs() {
  console.log(`\n🔄 WARNING: Extracting UIDs from logs to Re-Enable accounts...`);
  
  // Regex pattern: "UID: " ke baad aane walay characters ko capture karega
  const regex = /UID:\s([a-zA-Z0-9_-]+)\)/g;
  const uidsToEnable = new Set(); // Set use kiya gaya hai taake koi UID duplicate na ho jaye
  let match;

  // Har match ko find kar ke array mein dalna
  while ((match = regex.exec(logText)) !== null) {
    uidsToEnable.add(match[1]);
  }

  const uidArray = Array.from(uidsToEnable);

  if (uidArray.length === 0) {
    console.log(`\n❌ Koi UID logs mein nahi mili.`);
    process.exit(1);
  }

  console.log(`\n⚠️ Total unique accounts found to restore: ${uidArray.length}`);
  console.log(`Starting process to ENABLE them...\n`);

  let enabledCount = 0;

  // Har extracted UID ko database mein update karna
  for (const uid of uidArray) {
    try {
      await admin.auth().updateUser(uid, { disabled: false });
      console.log(`► Restored: UID [${uid}] is now ENABLED.`);
      enabledCount++;
    } catch (err) {
      console.error(`❌ Error enabling UID [${uid}]:`, err.message);
    }
  }

  console.log(`\n=========================================`);
  console.log(`🎉 RESTORATION COMPLETE!`);
  console.log(`Successfully re-enabled ${enabledCount} specific accounts.`);
  console.log(`=========================================\n`);
  
  process.exit(0); 
}

restoreAccountsFromLogs();
