**Uniswap ProtocolGovernance Link: https://gov.uniswap.org/t/official-uniswap-v3-deployments-list/24323/1**

**Authors: Uniswap Accountability Committee (UAC)**

This forum post is meant to display all of the approved Uniswap v3 deployments. It provides a running list of the contracts on each EVM chain that have been approved by governance, verified, and correspondingly added to the v3-deployments.uniswap.eth subdomain. The Accountability Committee will be responsible for updating this thread.

**What does it mean for a deployment to be “official”?**

Uniswap v3 was initially released under a BUSL license to prevent others from forking the protocol and using it for commercial purposes. As of April 2023, the BUSL was converted to an open-source license, allowing for the commercial usage of the v3 contracts. Such a transition can lead anyone to deploy the relevant v3 contracts on any EVM, claiming those contracts to be “the official Uniswap”.
In order to prevent entities apart from the Uniswap DAO, who may or may not have ill intentions or an ulterior motive behind deploying the given v3 contracts, the Uniswap Foundation implemented a process to officiate deployments across numerous EVMs.
This grants authority solely to the Uniswap DAO to declare which v3 deployments are official, thereby preserving Uniswap’s reputable brand. Any target chain that would like to introduce an official Uniswap deployment to their ecosystem must abide by the appropriate governance channels.
Until April 2024, the process for declaring a v3 deployment as official required a multi-step process, culminating in an onchain vote where the given deployment would be added to the v3 subdomain. The DAO now follows a simpler model, where a deployment is optimistically considered official if the DAO does not veto deployment onto the given chain during a Snapshot vote. Under this setup, the alteration of the v3 subdomain is completed by the Accountability Committee.

**This thread will continuously be updated whenever a new deployment is considered official by the DAO.**

__________________________________________________________________________________________________________________________

**Ink**
Chain ID: 57073

Subdomain String: 0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f, 0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424

**Recognized Front-ends: Reservoir**

**Date of Recognition: December 2024**

Deployer: Protofire

**Contract Name**                              **Contract Address**
UniswapV3Factory	                            0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424
UniversalRouter	                                0x9C5577aEF7c2a5C80aA62bA5420170F6b4a302FF
ProxyAdmin	                                    0x9B65c0df5aFffB95E75Aa5cAD81F3Fe2368446f1
TickLens	                                    0x3e6Dba802d62aba2361Dd632fbC9f547AA6789aE
NFTDescriptor	                                0x987ca6B9cC569dE1a0340d2465DA8E4Aa4B14aa5
NonfungibleTokenPositionDescriptor	            0x2079bc044AEe33146bB63674DC2502c69E821Af9
Descriptor proxy	                            0xa1168fd2Cb5acEC1F0B100593A1858f47b399A7B
NonfungiblePositionManager	                    0xC0836E5B058BBE22ae2266e1AC488A1A0fD8DCE8
V3Migrator	
v3StakerAddress	
QuoterV2	                                    0x96b572D2d880cf2Fa2563651BD23ADE6f5516652
SwapRouter02	                                0x177778F19E89dD1012BdBe603F144088A95C4B53
Permit2	                                        0x000000000022D473030F116dDEE9F6B43aC78BA3
Multicall	                                    0xA0fCec583AeE6176527C07B198e5561722332014
LimitOrderRegistry	