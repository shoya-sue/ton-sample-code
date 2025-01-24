const TonWeb = require('tonweb');

const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')
);

const seed = TonWeb.utils.base64ToBytes('bqMuNPW+A5MzRChQFlIW31M9z4X2TVvBEaASYdytXJQ=');
const keyPair = TonWeb.utils.keyPairFromSeed(seed);


// ウォレットを生成 (v4R2)
const wallet = tonweb.wallet.create({
  publicKey: keyPair.publicKey,
  wc: 0,
  version: 'v4R2'
});


// ---- ここがポイント: ウォレットをデプロイするためのstateInitを作る
(async () => {
  try {
    // 1. ウォレットアドレスを確認(テストネットのfaucetから送金しておく)
    const walletAddress = await wallet.getAddress();
    console.log('Sender Wallet Address:', walletAddress.toString(true, true, true));
    // TON Amountを表示する
    /*
    const balanceNano = await tonweb.provider.getBalance(walletAddress);
    const balance = TonWeb.utils.fromNano(balanceNano);
    console.log('Sender TON Amount:', balance);
    */
    
    // 2. ウォレットのstateInit(コントラクト初期化データ)を作成
    const initResult = await wallet.createStateInit();
    const stateInitCell = initResult.stateInit
    // console.log('StateInit:', stateInit);
    
    // 3. 初回送金(兼ウォレットデプロイ)用のseqnoは 0 とする
    const seqno = 0;

    // 送る先のアドレスや金額
    const toAddress = '0QAAZ_S6FrL27-CWT4tCCF3d0zZriagGmKYbNv1eAQMdUxQN'; 
    console.log('Recive Wallet Address:', toAddress);
    // const amount = TonWeb.utils.toNano('0.001'); 
    const amount = 1000000; // 0.001 TON
    console.log('Recive TON Amount:', amount);

    // 4. 初回トランザクション作成 (デプロイを同時に行うため stateInit を指定)
    const transfer = wallet.methods.transfer({
      secretKey: keyPair.secretKey,
      toAddress: toAddress,
      amount: amount,
      seqno: 1,
      payload: null,
      stateInit: null // deploy時はstateInitを指定しない
    });
    console.log('Transfer' , transfer);

    console.log('Deploying wallet + Sending transaction in one step...');
    const sendResult = await transfer.send();
    console.log('Transaction send result:', sendResult);

    // 5. ブロック取り込み待ち
    console.log('Waiting for the transaction to be included in a block...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 6. トランザクション確認
    const txList = await wallet.provider.getTransactions(wallet.address, 1);
    console.log('Latest transaction info:', txList);


  } catch (err) {
    console.error('Error occurred:', err);
  }
})();
