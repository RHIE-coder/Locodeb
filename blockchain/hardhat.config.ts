import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {ethers} from 'ethers';

// # 본 니모닉은 테스트용으로 실제로 사용하면 안됨
// # 0xa7558AE65e40edDcaeC34bc1DED7C25297EA7CF2
const USER_MNEMONIC = "slim female tumble swing acquire course return attitude build citizen wise seminar"

function createSignerByMnemonic(mnemonicString:string, index?:number | undefined) {
    index = index ?? 0;
    const defaultPathForDeriving = `m/44'/60'/0'/0/${index}`;
    const wallet = ethers.Wallet.fromPhrase(mnemonicString);
    if(!wallet.mnemonic) {
      throw new ReferenceError("Mnemonic cannot be nullish");
    }
    return ethers.HDNodeWallet.fromMnemonic(wallet.mnemonic, defaultPathForDeriving);
}

const accounts = createSignerByMnemonic(USER_MNEMONIC)

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    op_one: {
      chainId: 900,
      url:"http://localhost:8545",
      accounts:[accounts.privateKey],
    },
    op_two: {
      chainId: 901,
      url:"http://localhost:9545",
      accounts:[accounts.privateKey],
    },
  }
};

export default config;
