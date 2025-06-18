import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

const CONTRACT_ADDRESS = "0x5897040e2bdC84Dd81Bd7eE0E6edFdB4188B5790";
const CONTRACT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function stake(uint256 amount) public",
  "function claimReward() public",
  "function unstake(uint256 amount) public"
];

const BASE_CHAIN_ID = "0x2105"; // 8453 in hex

const translations = {
  en: {
    title: "SPARKCOIN (SPRK)",
    about: "About the Token",
    aboutDesc: "SPARKCOIN is a token on the Ethereum blockchain (Base Layer 2), created for decentralized finance and community participation.",
    features: [
      "Secure and transparent smart contract",
      "Rewards through staking",
      "Voting for proposals",
      "Transparent metadata on IPFS"
    ],
    metadata: "Metadata",
    liquidity: "Liquidity on Aerodrome",
    web3: "Web3 Interaction",
    connect: "Connect MetaMask",
    wrongNetwork: "Wrong network. Please switch to Base (Chain ID 8453)",
    wallet: "Wallet",
    balance: "SPRK Balance",
    stakePlaceholder: "Amount to stake",
    unstakePlaceholder: "Amount to unstake",
    stake: "Stake",
    unstake: "Unstake",
    claim: "Claim Reward",
    howTo: "How to Start",
    steps: [
      "Install MetaMask",
      "Add the Base network",
      "Bridge ETH to Base",
      "Buy SPRK on Aerodrome",
      "Connect your wallet and stake tokens",
      "Receive rewards"
    ],
    join: "Join the Community"
  },
  ru: {
    title: "SPARKCOIN (SPRK)",
    about: "О токене",
    aboutDesc: "SPARKCOIN — это токен на блокчейне Ethereum (Base Layer 2), созданный для децентрализованных финансов и сообщества.",
    features: [
      "Безопасный и прозрачный смарт-контракт",
      "Награды за стейкинг",
      "Голосование за предложения",
      "Метаданные на IPFS"
    ],
    metadata: "Метаданные",
    liquidity: "Ликвидность на Aerodrome",
    web3: "Взаимодействие с Web3",
    connect: "Подключить MetaMask",
    wrongNetwork: "Неверная сеть. Пожалуйста, подключитесь к Base (Chain ID 8453)",
    wallet: "Кошелек",
    balance: "Баланс SPRK",
    stakePlaceholder: "Сумма для стейкинга",
    unstakePlaceholder: "Сумма для анстейка",
    stake: "Стейк",
    unstake: "Анстейк",
    claim: "Забрать награду",
    howTo: "Как начать",
    steps: [
      "Установите MetaMask",
      "Добавьте сеть Base",
      "Переведите ETH в Base",
      "Купите SPRK на Aerodrome",
      "Подключите кошелек и застейкайте токены",
      "Получайте награды"
    ],
    join: "Присоединиться к сообществу"
  },
  de: {
    title: "SPARKCOIN (SPRK)",
    about: "Über den Token",
    aboutDesc: "SPARKCOIN ist ein Token auf der Ethereum-Blockchain (Base Layer 2), der für dezentrale Finanzen und die Gemeinschaft entwickelt wurde.",
    features: [
      "Sicherer und transparenter Smart Contract",
      "Belohnungen durch Staking",
      "Abstimmung über Vorschläge",
      "Transparente Metadaten auf IPFS"
    ],
    metadata: "Metadaten",
    liquidity: "Liquidität auf Aerodrome",
    web3: "Web3 Interaktion",
    connect: "MetaMask verbinden",
    wrongNetwork: "Falsches Netzwerk. Bitte wechsle zu Base (Chain ID 8453)",
    wallet: "Wallet",
    balance: "SPRK Guthaben",
    stakePlaceholder: "Betrag zum Staken",
    unstakePlaceholder: "Betrag zum Unstaken",
    stake: "Staken",
    unstake: "Unstaken",
    claim: "Belohnung holen",
    howTo: "Wie man anfängt",
    steps: [
      "Installiere MetaMask",
      "Füge das Base-Netzwerk hinzu",
      "Bridge ETH zu Base",
      "Kaufe SPRK auf Aerodrome",
      "Wallet verbinden und Token staken",
      "Belohnungen erhalten"
    ],
    join: "Der Community beitreten"
  }
};

export default function SparkCoinPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [lang, setLang] = useState("ru");

  const t = translations[lang];

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId !== 8453) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BASE_CHAIN_ID }],
          });
        }
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setWalletConnected(true);
        getBalance(accounts[0]);
        setWrongNetwork(false);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    }
  };

  const getBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const rawBalance = await contract.balanceOf(address);
    setBalance(ethers.utils.formatEther(rawBalance));
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const amount = ethers.utils.parseEther(stakeAmount);
    const tx = await contract.stake(amount);
    await tx.wait();
    getBalance(account);
  };

  const handleUnstake = async () => {
    if (!unstakeAmount) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const amount = ethers.utils.parseEther(unstakeAmount);
    const tx = await contract.unstake(amount);
    await tx.wait();
    getBalance(account);
  };

  const handleClaimReward = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.claimReward();
    await tx.wait();
    getBalance(account);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setLang("en")}>EN</Button>
          <Button variant="outline" onClick={() => setLang("ru")}>RU</Button>
          <Button variant="outline" onClick={() => setLang("de")}>DE</Button>
        </div>

        <motion.h1 className="text-5xl font-bold text-center text-yellow-600" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {t.title}
        </motion.h1>

        <Card className="shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">{t.about}</h2>
            <p>{t.aboutDesc}</p>
            <ul className="list-disc list-inside space-y-1">
              {t.features.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p><strong>{t.metadata}:</strong></p>
            <a href="https://gateway.pinata.cloud/ipfs/bafkreiha33esorirkdpczky2ylllnuileac65i55p42bba64eqbcx4hz6m" target="_blank" className="text-blue-600 underline">Document</a><br/>
            <a href="https://gateway.pinata.cloud/ipfs/bafkreihywz72dtvyfqw5wrnfifzpfvfxvp2vebqhlcpx2nqxyqhiyaql2i" target="_blank" className="text-blue-600 underline">Metadata</a><br/>
            <a href="https://gateway.pinata.cloud/ipfs/bafkreignrnyet54jv43afm7b7cj7w4d5memy425yipbjzmqidzj7qx746u" target="_blank" className="text-blue-600 underline">Image</a>
            <p><strong>{t.liquidity}:</strong> <a href="https://aerodrome.finance/pools?token0=0x5897040e2bdc84dd81bd7ee0e6edfdb4188b5790&chain0=8453&token1=eth&chain1=8453" target="_blank" className="text-purple-600 underline">Aerodrome</a></p>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">{t.web3}</h2>
            {!walletConnected ? (
              <Button onClick={connectWallet} className="bg-yellow-400 text-black">{t.connect}</Button>
            ) : wrongNetwork ? (
              <p className="text-red-600">{t.wrongNetwork}</p>
            ) : (
              <>
                <p className="text-green-700">{t.wallet}: {account}</p>
                <p>{t.balance}: {balance}</p>
                <div className="space-y-4 mt-4">
                  <div>
                    <input type="text" placeholder={t.stakePlaceholder} value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="p-2 border rounded w-64" />
                    <Button onClick={handleStake} className="ml-2 bg-green-500 text-white">{t.stake}</Button>
                  </div>
                  <div>
                    <input type="text" placeholder={t.unstakePlaceholder} value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} className="p-2 border rounded w-64" />
                    <Button onClick={handleUnstake} className="ml-2 bg-red-500 text-white">{t.unstake}</Button>
                  </div>
                  <div>
                    <Button onClick={handleClaimReward} className="bg-blue-500 text-white">{t.claim}</Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">{t.howTo}</h2>
            <ol className="list-decimal list-inside space-y-1">
              {t.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="bg-yellow-400 text-black px-6 py-3 text-lg rounded-xl">
            {t.join}
          </Button>
        </div>

        <div className="flex justify-center gap-6 mt-10 text-3xl text-gray-600">
          <a href="https://t.me/SPRKcoin2025" target="_blank" rel="noopener noreferrer">
            <FaTelegram className="hover:text-blue-500 transition-colors" />
          </a>
          <a href="https://x.com/BartMr82219" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="hover:text-black transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
