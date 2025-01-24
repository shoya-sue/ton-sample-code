const TonWeb = require('tonweb');

// 1. TON HTTP Providerを設定 (ここではテストネットを指定)
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

(async () => {
  // 2. 新しいシード(32バイト)を生成
  const seed = TonWeb.utils.newSeed();

  // 3. シードからキーペア(publicKey/secretKey)を生成
  const keyPair = TonWeb.utils.keyPairFromSeed(seed);

  // 4. ウォレットを作成 (version: 'v4R2' を指定)
  const wallet = tonweb.wallet.create({
    publicKey: keyPair.publicKey,
    wc: 0,
    version: 'v4R2'
  });

  // 5. ウォレットアドレスを取得
  const walletAddress = await wallet.getAddress();

  // 6. 各情報を出力
  console.log('=== Generated TON Wallet ===');
  console.log('Seed (Base64):', TonWeb.utils.bytesToBase64(seed));
  console.log('Public Key (Hex):', TonWeb.utils.bytesToHex(keyPair.publicKey));
  console.log('Secret Key (Hex):', TonWeb.utils.bytesToHex(keyPair.secretKey));
  console.log('Wallet Address:', walletAddress.toString(true, true, true));
  console.log('=================================');
})();
