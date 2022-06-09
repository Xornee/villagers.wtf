import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 30px 50px;
  font-size: 4rem;
  border-radius: 20px;
  border: none;
  background-color: #B13132;
  font-weight: bold;
  -webkit-text-stroke: 1px black;
   color: white;
   text-shadow:
       3px 3px 0 #000,
     -3px -3px 0 #000,  
      3px -3px 0 #000,
      -3px 3px 0 #000,
       3px 3px 0 #000;
  }
  letter-spacing: -5px;
  color: var(--secondary-text);
  font-family: 'JejuHallasan';
  cursor: pointer;
`;
export const StyledRoundButton = styled.button`
  padding: 15px;
  border: none;
  background-color: #B13132;
  font-family: 'JejuHallasan';
  font-weight: bold;
  font-size: 30px;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;
export const StyledH1 = styled.h1`
  color: white; 
  text-shadow:
   -8px -8px 0 #000,  
    8px -8px 0 #000,
    -8px 8px 0 #000,
     8px 8px 0 #000;
  font-family: 'JejuHallasan';
  font-size: 7rem;
  font-weight: bold;
  letter-spacing: -3px;
`;
export const StyledImg = styled.img`
  background-color: var(--accent);
  width: 200px;
  @media (min-width: 900px) {
    width: 400px;
  }
  @media (min-width: 1000px) {
    width: 600px;
  }
  @media (min-width: 1930px) {
    width: 900px;
  }
  transition: width 0.5s;
`;
export const StyledMint = styled.h3`
  color: white; 
  text-shadow:
   -6px -6px 0 #000,  
    6px -6px 0 #000,
    -6px 6px 0 #000,
     6px 6px 0 #000;
  font-family: 'JejuHallasan';
  font-size: 6rem;
  font-weight: bold;
  letter-spacing: -3px;
  margin: 20px;
`;
export const GeneralText = styled.p`
  color: white; 
  text-shadow:
   -4px -4px 0 #000,  
    4px -4px 0 #000,
    -4px 4px 0 #000,
     4px 4px 0 #000;
  font-family: 'JejuHallasan';
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: -3px;
`;
export const MainContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  text-align: center;
  @media (min-width: 700px) {
    margin-left: 0px;
    margin-right: 0px;
  }
  @media (min-width: 900px) {
    margin-left: 100px;
    margin-right: 100px;
  }
  @media (min-width: 1930px) {
    margin-left: 200px;
    margin-right: 200px;
  }
`;
export const SupplyNumber = styled.div`
color: white; 
  text-shadow:
   -4px -4px 0 #000,  
    4px -4px 0 #000,
    -4px 4px 0 #000,
     4px 4px 0 #000;
  font-family: 'JejuHallasan';
  -webkit-text-stroke: 1px black;
  font-weight: bold;
  font-size: 5rem;
  font-weight: bold;
  letter-spacing: -3px;
`;
export const Icons = styled.a`
background-color: white;
    height: 50px;
    width: 50px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    transition: ease-in-out all 0.2s;
    margin-right: 30px;
`;


function App() {
  const dispatch = useDispatch();
  const [showNumbers, setShowNumbers] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    if (data.totalSupply < 1000){
      console.log(data.totalSupply)
      totalCostWei = String(0);
    } else {
      totalCostWei = String(cost * mintAmount);
    }
    
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .Mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
      if (newMintAmount > 2) {
        newMintAmount = 2;
      }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      setShowNumbers(true);
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)"}}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledH1>Villagers WTF</StyledH1>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <MainContainer
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              >
            <StyledMint>MintNow</StyledMint>
            <s.SpacerXSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <GeneralText
                >
                  The sale has ended.
                </GeneralText>
              </>
            ) : (
              <>
                  <GeneralText
                >
                  {/* Mint Price {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}. */}
                  Mint is free
                  </GeneralText>
                
                  <GeneralText
                >
                  2 per TX / 10 per wallet
                  </GeneralText>
                <s.SpacerSmall />
                    <s.SpacerXSmall />
                    <s.SpacerXSmall />

                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        setShowNumbers(true);
                      }}
                    >
                     Connect Wallet
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "Working on it" : "Mint you NFT"}
                      </StyledButton>
                    </s.Container>
                          <s.SpacerMedium />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                  </>
                )}
                    <s.SpacerSmall />
                    <s.SpacerSmall />
                    {showNumbers == true ? (
                      <SupplyNumber
                          >
                      {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                      </SupplyNumber>
                      
                      ) : (
                        <GeneralText
                        >
                          Connect Wallet to see mint status
                        </GeneralText>
                      )}
                    
                  
              </>
              
            )}
            </s.Container>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
            />
          </MainContainer>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container flex={'1'} jc={"center"} ai={"center"} style={{ width: "70%" }} fd={"row"}>
          <Icons href="" class="black-icon"><img style={{ height: 35 }} src="/config/images/twitter.png" alt="twitter icon" class="twitter-icon"></img></Icons>
          <Icons href="" class="black-icon"><img style={{ height: 50 }} src="/config/images/opensea.png" alt="opensea icon" class="opensea"></img></Icons>
          <Icons href="" class="black-icon"><img style={{ height: 40}} src="/config/images/ethereum.png" alt="ethereum icon" class="ethereum-icon"></img></Icons>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
